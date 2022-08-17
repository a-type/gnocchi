import { ServerMessage } from '@aglio/storage-common';

export interface MessageSender {
	broadcast(libraryId: string, message: ServerMessage): void;
	send(libraryId: string, clientId: string, message: ServerMessage): void;
}
