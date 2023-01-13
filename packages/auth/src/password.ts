import { PasswordReset, prisma } from '@aglio/prisma';
import * as bcrypt from 'bcrypt';

export function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

export async function resetPassword(reset: PasswordReset, password: string) {
	await prisma.profile.update({
		where: {
			email: reset.email,
		},
		data: {
			password: await hashPassword(password),
		},
	});
	await prisma.passwordReset.delete({
		where: {
			id: reset.id,
		},
	});
}
