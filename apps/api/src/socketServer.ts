import { getLoginSession, Session } from '@aglio/auth';
import { prisma } from '@aglio/prisma';
import { assert } from '@aglio/tools';
import { Server, UserProfiles } from '@lo-fi/server';
import { IncomingMessage, Server as HttpServer } from 'http';
import { verifySubscription } from './auth/verifySubscription.js';

const storageDbFile = process.env.STORAGE_DATABASE_URL;
assert(!!storageDbFile, 'STORAGE_DATABASE_URL is not set');

class Profiles implements UserProfiles<any> {
	get = (userId: string) => {
		return prisma.profile.findUnique({ where: { id: userId } });
	};
}
async function authorize(req: IncomingMessage) {
	const session = await getLoginSession(req);
	if (!session) {
		throw new Error('Not authenticated');
	}

	await verifySubscription(session);

	return {
		libraryId: session.planId,
		userId: session.userId,
	};
}

export function attachSocketServer(httpServer: HttpServer) {
	const server = new Server({
		httpServer,
		databaseFile: storageDbFile!,
		authorize,
		profiles: new Profiles(),
	});

	return server;
}
