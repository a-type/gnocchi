import { prisma } from '@aglio/prisma';
import { assert } from '@aglio/tools';
import { Server, UserProfiles } from '@lo-fi/server';
import { Server as HttpServer } from 'http';

const storageDbFile = process.env.STORAGE_DATABASE_URL;
assert(!!storageDbFile, 'STORAGE_DATABASE_URL is not set');

class Profiles implements UserProfiles<any> {
	get = async (userId: string) => {
		const profile = await prisma.profile.findUnique({ where: { id: userId } });
		if (profile) {
			return {
				id: profile.id,
				name: profile.friendlyName,
				imageUrl: profile.imageUrl,
			};
		} else {
			return {
				id: userId,
				name: 'Anonymous',
				imageUrl: null,
			};
		}
	};
}

export function attachSocketServer(httpServer: HttpServer) {
	const server = new Server({
		httpServer,
		databaseFile: storageDbFile!,
		tokenSecret: process.env.LOFI_SECRET!,
		profiles: new Profiles(),
		replicaTruancyMinutes: 30 * 60 * 24,
		log: console.debug,
	});

	server.on('error', console.error);

	return server;
}
