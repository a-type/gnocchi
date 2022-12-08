import { prisma } from '@aglio/prisma';
import { RequestError } from '@aglio/tools';
import * as bcrypt from 'bcrypt';

export async function login({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	const user = await prisma.profile.findUnique({
		where: {
			email: email,
		},
	});
	if (!user) {
		throw new Error('No user exists with that email');
	}
	if (!user.password) {
		throw new RequestError(400, 'User has no password set');
	}
	if (!(await bcrypt.compare(password, user.password))) {
		throw new RequestError(401, 'Incorrect password');
	}
	return user;
}
