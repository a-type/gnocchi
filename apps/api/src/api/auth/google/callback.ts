import { Profile } from '@aglio/prisma';
import { setLoginSession, getInviteIdCookie, join } from '@aglio/auth';
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

	const inviteId = getInviteIdCookie(req);

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
		user = await join({
			inviteId,
			email: profile.email,
			fullName: profile.name,
			friendlyName: profile.given_name,
			picture: profile.picture,
			providerAccount: {
				accessToken: tokens.access_token!,
				tokenType: 'Bearer',
				provider: 'google',
				providerAccountId: profile.sub,
				type: 'oauth2',
			},
		});
	} else {
		user = accountAndUser.profile;
	}

	await setLoginSession(res, {
		userId: user.id,
		name: user.friendlyName,
		planId: user.planId,
		role: user.role as 'admin' | 'user',
		isProductAdmin: user.isProductAdmin,
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
