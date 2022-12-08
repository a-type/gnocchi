import { createRouter } from './common.js';
import { prisma } from '@aglio/prisma';
import * as z from 'zod';
import { sendEmailVerification } from '@aglio/email';
import { join, login, setLoginSession } from '@aglio/auth';
import { RequestError } from '@aglio/tools';

export const authRouter = createRouter()
	.query('isProductAdmin', {
		resolve: async ({ ctx }) => {
			console.log(ctx.session);
			if (!ctx.session) return false;
			const user = await prisma.profile.findUnique({
				where: { id: ctx.session.userId },
			});

			return user?.isProductAdmin;
		},
	})
	.mutation('createEmailVerification', {
		input: z.object({
			email: z.string(),
			name: z.string().optional(),
			returnTo: z.string().optional(),
		}),
		resolve: async ({ input, ctx }) => {
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
		},
	})
	.mutation('verifyEmail', {
		input: z.object({
			code: z.string(),
			inviteId: z.string().optional(),
			returnTo: z.string().optional(),
			password: z.string(),
		}),
		resolve: async ({ input, ctx }) => {
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
			});
			if (input.returnTo) {
				ctx.res.setHeader('Location', decodeURIComponent(input.returnTo));
				ctx.res.statusCode = 302;
			}
			return {
				user,
			};
		},
	})
	.mutation('login', {
		input: z.object({
			email: z.string(),
			password: z.string(),
			returnTo: z.string().optional(),
		}),
		resolve: async ({ input, ctx }) => {
			const user = await login(input);
			if (user) {
				setLoginSession(ctx.res, {
					userId: user.id,
					planId: user.planId,
					name: user.friendlyName || user.fullName,
					role: user.role as 'admin' | 'user',
				});
				if (input.returnTo) {
					ctx.res.setHeader('Location', decodeURIComponent(input.returnTo));
					ctx.res.statusCode = 302;
				}
				return {
					user,
				};
			} else {
				throw new RequestError(401, 'Incorrect email or password');
			}
		},
	});
