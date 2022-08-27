import { ServerMessage } from '@aglio/storage-common';
import { MessageSender } from '@aglio/storage-server';
import EventEmitter from 'events';

class OutgoingMessages extends EventEmitter implements MessageSender {
	broadcast = (
		libraryId: string,
		message: ServerMessage,
		omitReplicas: string[] = [],
	) => {
		this.emit(`broadcast`, libraryId, message, omitReplicas);
	};

	send = (libraryId: string, replicaId: string, message: ServerMessage) => {
		this.emit(`send`, replicaId, message);
	};
}

export const outgoingMessages = new OutgoingMessages();
