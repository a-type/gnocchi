export type DocumentBaseline<T extends any = any> = {
	oid: string;
	snapshot: T;
	timestamp: string;
};
