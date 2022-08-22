import { Profile } from '@prisma/client';
import { setLoginSession } from '../../../auth/index.js';
import { googleOauth } from '../../../auth/googleOauth.js';
import { prisma } from '../../../data/prisma.js';
import { assert } from '@aglio/tools';
import { Request, Response } from 'express';

export default async function googleCallbackHandler(
	req: Request,
	res: Response,
) {
	const { code } = req.query;
	assert(typeof code === 'string', 'code is required');
	const { tokens } = await googleOauth.getToken(code);
	googleOauth.setCredentials(tokens);
	const profileResponse = await googleOauth.request({
		url: 'https://www.googleapis.com/oauth2/v3/userinfo',
	});
	if (profileResponse.status !== 200) {
		throw new Error(
			`Failed to fetch profile: ${profileResponse.status} ${profileResponse.data}`,
		);
	}
	const profile = profileResponse.data as GoogleOAuthProfile;
	console.log(profile);

	// find an existing Google account association and user
	const accountAndUser = await prisma.account.findUnique({
		where: {
			provider_providerAccountId: {
				provider: 'google',
				providerAccountId: profile.sub,
			},
		},
		include: {
			profile: true,
		},
	});

	let user: Profile;
	if (!accountAndUser) {
		// create a new account and user
		const email = profile.email;
		// user might already exist, check by email
		user = await prisma.profile.upsert({
			where: { email },
			update: {
				accounts: {
					create: {
						provider: 'google',
						providerAccountId: profile.sub,
						type: 'oauth2',
						accessToken: tokens.access_token,
						tokenType: 'Bearer',
					},
				},
			},
			create: {
				email,
				fullName: profile.name,
				friendlyName: profile.given_name || profile.name,
				imageUrl: profile.picture,
				accounts: {
					create: {
						provider: 'google',
						providerAccountId: profile.sub,
						type: 'oauth2',
						accessToken: tokens.access_token,
						tokenType: 'Bearer',
					},
				},
				// create a default plan for new users
				plan: {
					create: {},
				},
			},
		});
	} else {
		user = accountAndUser.profile;
	}

	await setLoginSession(res, {
		userId: user.id,
		name: user.friendlyName,
		planId: user.planId,
	});

	// TODO: safari hack compat
	res.writeHead(302, { Location: '/api/auth/loginSuccess' });
	res.end();
}

type GoogleOAuthProfile = {
	sub: string;
	name: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
	email: string;
	email_verified: boolean;
	locale: string;
};
