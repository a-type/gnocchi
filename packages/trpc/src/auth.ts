import { createRouter } from './common.js';
import { prisma } from '@aglio/prisma';

export const authRouter = createRouter().query('isProductAdmin', {
	resolve: async ({ ctx }) => {
		console.log(ctx.session);
		if (!ctx.session) return false;
		const user = await prisma.profile.findUnique({
			where: { id: ctx.session.userId },
		});

		return user?.isProductAdmin;
	},
});
