import { prisma } from '@aglio/prisma';
import { assert } from '@aglio/tools';
import { Server, UserProfiles, FileStorage, FileInfo } from '@lo-fi/server';
import { Server as HttpServer } from 'http';
import { Readable } from 'stream';
import {
	S3Client,
	DeleteObjectCommand,
	PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

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

const userFilesBucket = process.env.USER_FILES_BUCKET;
assert(!!userFilesBucket, 'USER_FILES_BUCKET is not set');
const userFilesBucketRegion =
	process.env.USER_FILES_BUCKET_REGION || 'us-east-1';

class S3FileBackend implements FileStorage {
	private s3Client: S3Client;

	constructor() {
		const credentials =
			process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
				? {
						accessKeyId: process.env.AWS_ACCESS_KEY_ID,
						secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				  }
				: undefined;
		this.s3Client = new S3Client({
			region: userFilesBucketRegion,
			credentials,
		});
	}
	private getDirectory = (data: FileInfo) => {
		return `${data.libraryId}/${data.id}`;
	};
	private getPath = (data: FileInfo) => {
		return `${this.getDirectory(data)}/${data.fileName}`;
	};
	put = async (fileStream: Readable, data: FileInfo): Promise<void> => {
		// pipe stream to s3
		const parallelUploads3 = new Upload({
			client: this.s3Client,
			leavePartsOnError: false, // optional manually handle dropped parts
			params: {
				Bucket: userFilesBucket,
				Key: this.getPath(data),
				Body: fileStream,
			},
		});

		const result = await parallelUploads3.done();
		if (
			result.$metadata.httpStatusCode &&
			result.$metadata.httpStatusCode >= 300
		) {
			throw new Error(
				`Failed to upload file to S3: ${result.$metadata.httpStatusCode}`,
			);
		}
	};
	getUrl = (data: FileInfo): string => {
		return `https://s3.amazonaws.com/${userFilesBucket}/${this.getPath(data)}`;
	};
	delete = async (data: FileInfo): Promise<void> => {
		await this.s3Client.send(
			new DeleteObjectCommand({
				Bucket: userFilesBucket,
				Key: this.getPath(data),
			}),
		);
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
		fileStorage: new S3FileBackend(),
		fileConfig: {
			deleteExpirationDays: 3,
		},
	});

	server.on('error', console.error);

	return server;
}
