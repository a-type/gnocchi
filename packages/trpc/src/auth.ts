import { t } from './common.js';
import { prisma } from '@aglio/prisma';
import * as z from 'zod';
import { sendEmailVerification } from '@aglio/email';
import { join, login, setLoginSession } from '@aglio/auth';
import { RequestError } from '@aglio/tools';

export const authRouter = t.router({
	isProductAdmin: t.procedure.query(async ({ ctx }) => {
		return ctx?.isProductAdmin;
	}),
	createEmailVerification: t.procedure
		.input(
			z.object({
				email: z.string(),
				name: z.string().optional(),
				returnTo: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 36);
			const verification = await prisma.emailVerification.upsert({
				where: {
					email: input.email,
				},
				create: {
					email: input.email,
					name: input.name,
					code: Math.floor(Math.random() * 1000000).toString(),
					expiresAt,
				},
				update: {
					code: Math.floor(Math.random() * 1000000).toString(),
					expiresAt,
				},
			});
			await sendEmailVerification({
				to: input.email,
				code: verification.code,
				returnTo: input.returnTo,
				uiOrigin: ctx.deployedContext.uiHost,
			});
			return {
				sent: true,
			};
		}),
	verifyEmail: t.procedure
		.input(
			z.object({
				code: z.string(),
				inviteId: z.string().optional(),
				returnTo: z.string().optional(),
				password: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const verification = await prisma.emailVerification.findUnique({
				where: {
					code: input.code,
				},
			});
			if (!verification) {
				throw new Error(
					'No email verification exists for that code. Try sending another one',
				);
			}
			const user = await join({
				inviteId: input.inviteId,
				email: verification.email,
				fullName: verification.name || 'Anonymous',
				password: input.password,
			});
			setLoginSession(ctx.res, {
				userId: user.id,
				planId: user.planId,
				name: user.friendlyName || user.fullName,
				role: user.role as 'admin' | 'user',
				isProductAdmin: user.isProductAdmin,
			});
			return {
				user,
			};
		}),
	login: t.procedure
		.input(
			z.object({
				email: z.string(),
				password: z.string(),
				returnTo: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const user = await login(input);
			if (user) {
				setLoginSession(ctx.res, {
					userId: user.id,
					planId: user.planId,
					name: user.friendlyName || user.fullName,
					role: user.role as 'admin' | 'user',
					isProductAdmin: user.isProductAdmin,
				});
				return {
					user,
				};
			} else {
				throw new RequestError(401, 'Incorrect email or password');
			}
		}),
});
