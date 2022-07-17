function serialize(message: any) {
	return JSON.stringify(message);
}

function deserialize(message: string) {
	return JSON.parse(message);
}

export type PatchInput = {
	range?: string;
	patch: any;
	version?: string;
	mergeType?: string;
	patchType?: string;
};

function patch({ range, patch, version, mergeType, patchType }: PatchInput) {
	return {
		type: 'patch' as const,
		range,
		patch,
		version,
		mergeType,
		patchType,
	};
}

export type PatchMessage = ReturnType<typeof patch>;

export type VersionInput = {
	version: string;
	parents?: string[];
	mergeType?: string;
} & (
	| {
			patches: {
				patchType: string;
				range?: string;
				patch: any;
			}[];
	  }
	| {
			body: any;
	  }
);

function version({ version, parents = [], mergeType, ...rest }: VersionInput) {
	return {
		type: 'version' as const,
		version,
		parents,
		...rest,
	};
}

export type VersionMessage = ReturnType<typeof version>;

export type PingMessage = { type: 'ping' };

export function parse(
	message: string,
): PatchMessage | VersionMessage | PingMessage {
	try {
		const asObject = deserialize(message);
		// TODO: validation
		switch (asObject.type) {
			case 'patch':
				return asObject as PatchMessage;
			case 'version':
				return asObject as VersionMessage;
			case 'ping':
				return asObject as PingMessage;
			default:
				throw new Error(`Unknown message type: ${asObject.type}`);
		}
	} catch (e) {
		throw new Error(`Invalid message: ${e.message}`);
	}
}

export const clientProtocol = {
	patch: (...args: Parameters<typeof patch>) => serialize(patch(...args)),
};

export const serverProtocol = {
	version: (...args: Parameters<typeof version>) => serialize(version(...args)),
};
