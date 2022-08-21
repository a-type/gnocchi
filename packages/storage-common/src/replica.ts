export interface ReplicaInfo {
	replicaId: string;
	lastSeenLogicalTime: string;
	oldestOperationLogicalTime: string;
}

export const SERVER_REPLICA_ID = 'SERVER';
