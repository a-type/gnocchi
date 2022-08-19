export type DocumentBaseline<T extends any> = {
	documentId: string;
	snapshot: T;
	timestamp: string;
};
