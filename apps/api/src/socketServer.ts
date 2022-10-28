import { prisma } from '@aglio/prisma';
import { assert } from '@aglio/tools';
import { Server, UserProfiles } from '@lo-fi/server';
import { Server as HttpServer } from 'http';

const storageDbFile = process.env.STORAGE_DATABASE_URL;
assert(!!storageDbFile, 'STORAGE_DATABASE_URL is not set');

class Profiles implements UserProfiles<any> {
	get = (userId: string) => {
		return prisma.profile.findUnique({ where: { id: userId } });
	};
}

export function attachSocketServer(httpServer: HttpServer) {
	const server = new Server({
		httpServer,
		databaseFile: storageDbFile!,
		tokenSecret: process.env.LOFI_SECRET!,
		profiles: new Profiles(),
		replicaTruancyMinutes: 30 * 60 * 24,
	});

	server.on('error', console.error);

	return server;
}
