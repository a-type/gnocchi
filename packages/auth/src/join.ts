import { prisma, Profile } from '@aglio/prisma';
import { RequestError } from '@aglio/tools';
import * as bcrypt from 'bcrypt';
import { hashPassword } from './password.js';

export async function validateInvite(inviteId: string | null | undefined) {
	let joiningPlanId: string | null = null;
	if (inviteId) {
		// check validity of invite
		const invite = await prisma.planInvitation.findUnique({
			where: {
				id: inviteId,
			},
		});
		if (!invite) {
			throw new RequestError(400, 'Invalid invite code');
		}
		if (invite.expiresAt < new Date()) {
			throw new RequestError(400, 'Invite expired');
		}
		if (invite.claimedAt) {
			throw new RequestError(400, 'Invite already claimed');
		}
		joiningPlanId = invite.planId;
	}
	return joiningPlanId;
}

export async function join({
	inviteId,
	email,
	providerAccount,
	fullName,
	friendlyName,
	picture,
	password,
}: {
	inviteId?: string;
	email: string;
	fullName: string;
	friendlyName?: string;
	picture?: string;
	password?: string;
	providerAccount?: {
		provider: string;
		providerAccountId: string;
		type: string;
		accessToken: string;
		tokenType: string;
	};
}) {
	let user: Profile;

	const joiningPlanId = await validateInvite(inviteId);

	// create a new account and user
	if (joiningPlanId) {
		user = await prisma.profile.upsert({
			where: { email },
			update: {
				accounts: providerAccount
					? {
							create: providerAccount,
					  }
					: undefined,
				plan: {
					connect: {
						id: joiningPlanId,
					},
				},
			},
			create: {
				email,
				password: password ? await hashPassword(password) : undefined,
				fullName: fullName,
				friendlyName: friendlyName || fullName,
				imageUrl: picture,
				accounts: providerAccount
					? {
							create: providerAccount,
					  }
					: undefined,
				// create a default plan for new users who aren't using an invite
				plan: {
					connect: {
						id: joiningPlanId,
					},
				},
			},
		});

		// i'm feeling pretty sloppy right now. maybe refactor later.
		if (inviteId) {
			await prisma.planInvitation.update({
				where: { id: inviteId },
				data: {
					claimedAt: new Date(),
				},
			});
		}
	} else {
		// user might already exist, check by email
		user = await prisma.profile.upsert({
			where: { email },
			update: {
				accounts: providerAccount
					? {
							create: providerAccount,
					  }
					: undefined,
				password: password ? bcrypt.hashSync(password, 10) : undefined,
				fullName,
				friendlyName: friendlyName || fullName,
				imageUrl: picture ?? undefined,
			},
			create: {
				email,
				password: password ? bcrypt.hashSync(password, 10) : undefined,
				fullName: fullName,
				friendlyName: friendlyName || fullName,
				imageUrl: picture,
				accounts: providerAccount
					? {
							create: providerAccount,
					  }
					: undefined,
				// create a default plan for new users who aren't using an invite
				plan: {
					create: {},
				},
				// since they created the plan, they're the admin
				role: 'admin',
			},
		});
	}

	return user;
}
