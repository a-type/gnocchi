export interface ReplicaInfo {
	id: string;
	ackedLogicalTime: string;
	oldestOperationLogicalTime: string;
}

export const SERVER_REPLICA_ID = 'SERVER';
