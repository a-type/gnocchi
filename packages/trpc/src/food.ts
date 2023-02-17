import { z } from 'zod';
import { t } from './common.js';
import { prisma } from '@aglio/prisma';

export const foodRouter = t.router({
	data: t.procedure.input(z.string()).query(async ({ input }) => {
		// get top-voted category assignment
		const nameAndData = await prisma.foodName.findUnique({
			where: {
				name: input,
			},
			include: {
				foodData: {
					include: {
						categoryAssignments: {
							take: 1,
							orderBy: {
								votes: 'desc',
							},
						},
						names: true,
					},
				},
			},
		});

		if (!nameAndData) {
			return null;
		}

		const categoryId = nameAndData.foodData?.categoryAssignments[0]?.categoryId;

		return {
			canonicalName: nameAndData.foodData.canonicalName,
			categoryId,
			isPerishable: nameAndData.foodData.isPerishable,
			isStaple: nameAndData.foodData.isStaple,
			expiresAfterDays: nameAndData.foodData.expiresAfterDays,
			alternateNames: [
				nameAndData.foodData.canonicalName,
				...nameAndData.foodData.names.map((n) => n.name),
			],
		};
	}),
});
