import { ServerMessage } from '@aglio/storage-common';

export interface MessageSender {
	broadcast(libraryId: string, message: ServerMessage): void;
	send(libraryId: string, replicaId: string, message: ServerMessage): void;
}
