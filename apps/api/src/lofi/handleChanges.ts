import { prisma } from '@aglio/prisma';
import {
	ListChangesPushData,
	getPlanIdFromGroceryLibraryId,
} from '@aglio/tools';
import { DocumentBaseline, Operation, decomposeOid } from '@lo-fi/common';
import { sendPush } from 'src/data/webPush.js';

export async function handleLofiChanges({
	libraryId,
	userId,
	operations,
	baselines,
}: {
	libraryId: string;
	userId: string;
	operations: Operation[];
	baselines: DocumentBaseline[];
}) {
	await listChangeNotifier.update(libraryId, userId, operations);
}

class ListChangeNotifier {
	private debounceTimeSeconds = 10;
	private pendingNotifications = new Map<
		string,
		{
			libraryId: string;
			userId: string;
			createdItemCount: number;
			purchasedItemCount: number;
			timeout: NodeJS.Timeout;
		}
	>();

	update = async (
		libraryId: string,
		userId: string,
		operations: Operation[],
	) => {
		console.log('responding to lo-fi changes');
		// looking at operations on "item" entities that match the criteria...
		// 1. "initialize" op type
		// 2. "set" on "purchasedAt" field
		let createdItemCount = 0;
		let purchasedItemCount = 0;
		for (const { data, oid } of operations) {
			const { collection, subId } = decomposeOid(oid);
			// only interested in top-level item changes
			if (collection !== 'items' || subId) continue;

			if (data.op === 'initialize') {
				createdItemCount++;
			} else if (data.op === 'set' && data.name === 'purchasedAt') {
				purchasedItemCount++;
			}
		}

		if (createdItemCount || purchasedItemCount) {
			console.log('list changes detected');
			const key = `${libraryId}:${userId}`;
			const existing = this.pendingNotifications.get(key);
			if (existing) {
				clearTimeout(existing.timeout);
				existing.createdItemCount += createdItemCount;
				existing.purchasedItemCount += purchasedItemCount;
				existing.timeout = this.schedule(key);
			} else {
				this.pendingNotifications.set(key, {
					libraryId,
					userId,
					createdItemCount,
					purchasedItemCount,
					timeout: this.schedule(key),
				});
			}
		}
	};

	private schedule = (key: string) => {
		return setTimeout(this.fire, this.debounceTimeSeconds * 1000, key);
	};

	private fire = async (key: string) => {
		const notification = this.pendingNotifications.get(key);
		if (!notification) return;

		this.pendingNotifications.delete(key);

		// send a notification to all other users in the plan
		const planId = getPlanIdFromGroceryLibraryId(notification.libraryId);
		const members = await prisma.profile.findMany({
			where: { planId },
			include: {
				pushSubscriptions: true,
			},
		});
		const sender = members.find(
			(profile) => profile.id === notification.userId,
		);
		const senderName = sender?.friendlyName ?? sender?.fullName ?? 'Someone';
		console.info(
			`Sending list change notification for ${notification.libraryId} by ${notification.userId}`,
		);
		for (const member of members) {
			if (member.id === notification.userId) continue;
			await Promise.allSettled(
				member.pushSubscriptions.map(async (sub) => {
					if (sub.auth && sub.p256dh) {
						await sendPush(sub, {
							userName: senderName,
							addedItemCount: notification.createdItemCount,
							purchasedItemCount: notification.purchasedItemCount,
						} as ListChangesPushData);
					}
				}),
			);
		}
	};
}

const listChangeNotifier = new ListChangeNotifier();
