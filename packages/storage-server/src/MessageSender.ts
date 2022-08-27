import { ServerMessage } from '@aglio/storage-common';

export interface MessageSender {
	broadcast(
		libraryId: string,
		message: ServerMessage,
		omitReplicas?: string[],
	): void;
	send(libraryId: string, replicaId: string, message: ServerMessage): void;
}
