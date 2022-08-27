import { SERVER_REPLICA_ID, } from '@aglio/storage-common';
import { ReplicaInfos } from './Replicas.js';
import { OperationHistory } from './OperationHistory.js';
import { ServerCollectionManager } from './ServerCollection.js';
import { Baselines } from './Baselines.js';
export class ServerLibrary {
    constructor(db, sender, id) {
        this.db = db;
        this.sender = sender;
        this.id = id;
        this.collections = new ServerCollectionManager(this.db, this.id);
        this.replicas = new ReplicaInfos(this.db, this.id);
        this.operations = new OperationHistory(this.db, this.id);
        this.baselines = new Baselines(this.db, this.id);
        this.receive = (message, clientId) => {
            switch (message.type) {
                case 'op':
                    return this.handleOperation(message);
                case 'sync':
                    return this.handleSync(message, clientId);
                case 'sync-step2':
                    return this.handleSyncStep2(message, clientId);
                case 'ack':
                    return this.handleAck(message, clientId);
                default:
                    console.log('Unknown message type', message.type);
                    break;
            }
        };
        this.handleOperation = (message) => {
            const collection = this.collections.open(message.op.collection);
            const run = this.db.transaction(() => {
                // apply the operation to the document
                collection.receive(message);
                // update client's oldest timestamp
                this.replicas.updateOldestOperationTimestamp(message.op.replicaId, message.op.timestamp);
            });
            run();
            // update replica's oldest operation
            this.replicas.updateOldestOperationTimestamp(message.op.replicaId, message.oldestHistoryTimestamp);
            this.enqueueRebase();
            // rebroadcast to whole library except the sender
            this.rebroadcastOperations([message.op], [message.op.replicaId]);
        };
        this.rebroadcastOperations = (ops, ignoreReplicas) => {
            this.sender.broadcast(this.id, {
                type: 'op-re',
                ops,
                globalAckTimestamp: this.replicas.getGlobalAck(),
            }, ignoreReplicas);
        };
        this.handleSync = (message, clientId) => {
            const replicaId = message.replicaId;
            const clientReplicaInfo = this.replicas.getOrCreate(replicaId, clientId);
            // respond to client
            // lookup operations after the last ack the client gave us
            const ops = this.operations.getAfter(clientReplicaInfo.ackedLogicalTime);
            const baselines = this.baselines.getAllAfter(clientReplicaInfo.ackedLogicalTime);
            this.sender.send(this.id, replicaId, {
                type: 'sync-resp',
                ops,
                baselines: baselines.map((baseline) => ({
                    documentId: baseline.documentId,
                    snapshot: baseline.snapshot,
                    timestamp: baseline.timestamp,
                })),
                provideChangesSince: clientReplicaInfo.ackedLogicalTime,
                globalAckTimestamp: this.replicas.getGlobalAck(),
            });
        };
        this.handleSyncStep2 = (message, clientId) => {
            // store all incoming operations and baselines
            this.baselines.insertAll(message.baselines);
            console.debug('Storing', message.ops.length, 'operations');
            this.operations.insertAll(message.ops);
            this.rebroadcastOperations(message.ops, [message.replicaId]);
            // update the client's ackedLogicalTime
            const lastOperation = message.ops[message.ops.length - 1];
            if (lastOperation) {
                this.replicas.updateAcknowledged(message.replicaId, lastOperation.timestamp);
            }
        };
        this.setupServerReplica = () => {
            this.replicas.getOrCreate(SERVER_REPLICA_ID, null);
        };
        this.handleAck = (message, clientId) => {
            this.replicas.updateAcknowledged(message.replicaId, message.timestamp);
        };
        this.pendingRebaseTimeout = null;
        this.enqueueRebase = () => {
            if (!this.pendingRebaseTimeout) {
                setTimeout(this.rebase, 0);
            }
        };
        this.rebase = () => {
            console.log('Performing rebase check');
            // fundamentally a rebase occurs when some conditions are met:
            // 1. the replica which created an operation has dropped that operation
            //    from their history stack, i.e. their oldest timestamp is after it.
            // 2. all other replicas have acknowledged an operation since the
            //    operation which will be flattened to the baseline. i.e. global
            //    ack > timestamp.
            //
            // to determine which rebases we can do, we use a heuristic.
            // the maximal set of operations we could potentially rebase is
            // up to the newest 'oldest timestamp' of any replica. so we
            // grab that slice of the operations history, then iterate over it
            // and check if any rebase conditions are met.
            const replicas = this.replicas.getAll();
            // more convenient access
            const replicaMap = replicas.reduce((map, replica) => {
                map[replica.id] = replica;
                return map;
            }, {});
            // will be useful
            const globalAck = this.replicas.getGlobalAck();
            const newestOldestTimestamp = replicas
                .map((r) => r.oldestOperationLogicalTime)
                .reduce((a, b) => (a > b ? a : b), '');
            // these are in forward chronological order
            const ops = this.operations.getBefore(newestOldestTimestamp);
            const opsToApply = {};
            // if we encounter a sequential operation in history which does
            // not meet our conditions, we must ignore subsequent operations
            // applied to that document.
            const hardStops = {};
            for (const op of ops) {
                const creator = replicaMap[op.replicaId];
                const isBeforeCreatorsOldestHistory = creator.oldestOperationLogicalTime > op.timestamp;
                const isBeforeGlobalAck = globalAck > op.timestamp;
                if (!hardStops[op.documentId] &&
                    isBeforeCreatorsOldestHistory &&
                    isBeforeGlobalAck) {
                    opsToApply[op.documentId] = opsToApply[op.documentId] || [];
                    opsToApply[op.documentId].push(op);
                }
                else {
                    hardStops[op.documentId] = true;
                }
            }
            for (const [documentId, ops] of Object.entries(opsToApply)) {
                console.log('Rebasing', documentId);
                this.baselines.applyOperations(documentId, ops);
                this.operations.dropAll(ops);
            }
            // now that we know exactly which operations can be squashed,
            // we can summarize that for the clients so they don't have to
            // do this work!
            const rebases = Object.entries(opsToApply).map(([documentId, ops]) => ({
                documentId,
                collection: ops[0].collection,
                upTo: ops[ops.length - 1].timestamp,
            }));
            this.sender.broadcast(this.id, {
                type: 'rebases',
                rebases,
            });
        };
        this.setupServerReplica();
    }
}
export class ServerLibraryManager {
    constructor(db, sender) {
        this.db = db;
        this.sender = sender;
        this.cache = new Map();
        this.open = (id) => {
            if (!this.cache.has(id)) {
                this.cache.set(id, new ServerLibrary(this.db, this.sender, id));
            }
            return this.cache.get(id);
        };
        this.close = (id) => {
            this.cache.delete(id);
        };
    }
}
//# sourceMappingURL=ServerLibrary.js.map