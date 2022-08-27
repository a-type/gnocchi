# Storage

An experimental IndexedDB ORM.

## Sync approach

Just jotting down some ideas.

Fundamentally, idb is a basic document store.

Each document can be a LWW-map.

The full collection of documents can be a Set of some kind.

## Changes to documents

Fairly simple - use a clock to order changes, LWW on the changes themselves. [link](https://www.youtube.com/watch?v=DEcwa68f-jY)

## What kind of CRDT?

State-based or operation based? I guess I'm partial to operation-based, it just makes sense to me. But I don't understand how you query data which is actually a list of operations, not a literal object stored in the database.

I guess you can store the current view of the final document where it would normally be, then also store the history. If anything gets inserted in history, you'd recompute the document and store it again.

## Some assumptions

- Only one client (the first) will ever connect to the server for the first time with local changes. All other clients will connect to the server with no local changes and receive their initial state entirely.
  - Therefore, the server will always know about all clients who have access to the shared collections.
- A client is the only one who can undo their own operations. No other client can undo an operation from a different client.

## Deleting documents

I'd prefer not to have unbounded growth of the set of documents. That means actually deleting things.

When can you actually delete something?

One option is, casually described, when everyone agrees that it should be deleted.

Defining terms...

- "Everyone" - all clients who have registered as peers with access to a document in the backend (and who have recently been seen\*).
- "Agrees" - everyone has connected to the server and reached the latest changes indicating the document should be deleted.
- "Should be deleted" - the document is in a deleted state and no client is in a position to undo it\*\*

\*: Clients that haven't been seen in a while are by definition not in a position to undo deletes and will have to accept the delete whenever they come online, discarding any changes to that document.
\*\*: A client is only in a position to undo a delete for a set length of logical time, called an Undo Window, which could be configurable. This is the number of operations in the 'undo stack.' If it's 100, for example, the window ends when the client is 100 operations past the point it deleted the document. A client which did not delete a document is never in a position to undo the delete.

The server is the one in a position to best decide when a document is deleted 'for real' and can be cleaned up. It will always be present during a connection which signals the final deletion is ready.

When the server knows a document is ready to be deleted, it marks it with a set of all clients who have seen the document before. Each time the server sees a client in that set, it informs the client of the final deletion and removes the client from the set. When the set is empty, the server can also delete the document.

Once a document has been deleted, all messages related to that document can also be cleaned out.

## What the server knows

To actually achieve this the server needs to keep track of a few things.

### A bounded operation history for each client it knows about.

Then it can know when all clients undo window has passed a delete operation.

This is bounded to the size of the window, so if the history no longer contains the delete, it's no longer undoable.

That means the computation to determine if a delete is finalized is "does any client history include the latest delete operation?" This can be recomputed each time the history changes I guess. Seems easy to optimize from there.

### For each document, a history of changes and a baseline

Past operations are stored alongside each document's current state. A 'baseline' is also stored - a snapshot of the document before any of the operations were applied.

```
[Baseline] - [Operation History] -> [Current State]
- Snapshot   - Client ID            - Snapshot
- Timestamp  - Key/Value            - Timestamp
             - Timestamp            - Vector clocks?
```

As known client histories are updated, the operation history of each object can also be recomputed. You could take the oldest item in history and determine if its identifier is still included in the client history for the client who made the change. If not, it can be applied to the baseline and dropped.

When a client connects to the server, it receives the baselines for any changed objects. When it receives a baseline it can rebase its local operation history based on the timestamp of the baseline - drop any older items.

#### Can a client connect to a server and receive a rebase which overtakes its own local changes?

Is it logically possible for the server to perform a rebase, and then later a client connects with unacknowledged local changes which are timestamped before the new baseline?

Recalling that a server only drops operations which are no longer included in their client's history window. "No longer" because every operation the server stores is guaranteed to be included in the client's history window at the point it is received. Therefore if it is missing from the history window set, it is only because it is too far in the past relative to the client's history.

Since a client will not connect and present new history items which occurred _before_ their previous connection, a client will never present operations which are older than a rebase which occurred by dropping the client's _own_ operations.

What about operations from a different client?

Suppose a server knows only of clients A and B, and the history window size is 10, and the operation history for object X looks like this:

```
Timestamp | Client ID
---------------------
1         | A
2         | B
3         | A
4         | A
5         | A
6         | A
```

Client histories look like this:

```
A: 1, 3, 4, 5, 6, 7, 8, 9, 10, 11
B: 2
```

Now client A adds `12` to its history, dropping `1`. This sets up a potential rebase to drop `1` from the operation history.

Logically we know this is valid because the latest entry from B is `2`, which is newer than `1`. We therefore know that B cannot deliver any history prior to `2`, so even if it connects with new operations, they will not disrupt a rebase up to timestamp `2`.

**Therefore we add one rule to our rebasing requirements:** all known clients in good standing must have an entry in their history window which is later than the proposed rebase timestamp. We can verify this cheaply by looking at the client's latest history timestamp.

What if a client has no history at all? In such a case we cannot know if it will connect and provide operations from the distant past at any time in the future. We are therefore blocked from rebasing any documents at all until the ambiguity is resolved.

This seems unlikely in practice. We can also rely on the client being evicted eventually if it stops reconnecting. However, if there were a read-only client which connected frequently, that would be a problem.

To resolve this, rather than relying on history for the latest known timestamp for any client, we could just track a timestamp of their last connection.

### Summing up: what the server knows

For each known client, the server stores:

```
ClientConnectionData {
  // the library this client has access to
  libraryId: String
  // the client represented by this metadata
  clientId: String
  // the wall clock time the server last saw this client
  lastSeenWallClock: DateTime
  // the logical clock timestamp of when the server last saw this client
  lastSeenLogical: String
  // the oldest operation the client has in its "undo stack," as reported
  // to the server by the client after each operation.
  oldestOperationTimestamp: String
}
```

For the whole library of collections accessible to a group of clients, the server stores:

```
OperationHistory {
  // unique ID of the operation
  id: String
  // which replica created the operation
  replicaId: String
  // the library this history is for
  libraryId: String
  // the collection the document is in
  collection: String
  // the ID of the document
  documentId: String
  // the operation applied to the document. the format of this patch
  // is not semantically important at this point.
  patch: Json
  // the logical clock timestamp of when the operation was applied
  timestamp: String
}[]
```

Note that the entire operation history for the library is stored as a single list. This synergizes with the client histories also being global. Instead of checking each individual document for rebases, we just look at the oldest X items in the global history.

For each individual document, the server stores:

```
DocumentBaseline {
  // the document's id
  id: String
  // the snapshot of the baseline state of the document
  snapshot: Json
  // the logical clock timestamp of the baseline
  timestamp: String
}

Document {
  // the document's id
  id: String
  // collection the document belongs to
  collection: String
  // the snapshot of the current state of the document
  snapshot: Json
  // the logical clock timestamp of the last operation applied
  timestamp: String
}
```

## What the client knows

On the other side, the client needs to know less to make the same decisions.

Particularly, it only needs a `globalAck` timestamp instead of tracking the latest ack of each replica.

It also only needs a `globalPrehistory` timestamp instead of tracking the earliest operation in the history window of each replica.

The server can summarize both of these for each client.

## 'Evicting' clients

Seems like eventually if a client is offline long enough they get evicted from the general consensus stuff.

Like if the server hasn't seen you in 30 days, it drops your history.

# Migrations

Changing the shape of data is hard in a distributed system! Luckily we again get some advantages by using an authoritative server.

When a client is offline and a new change to the app is deployed which modifies how data is stored, it will continue making changes using its old code, of course.

The process of coming back online looks kind of like this:

1. The client connects and requests sync, stating its schema version.
2. The server rejects the clients request because it has an old version.
3. Meanwhile, the client's service worker has been downloading the latest client code.
4. When the client gets the rejection, it prompts the user to update the app in order to resume sync.
5. Updating of course triggers the reload from the newly downloaded client files.

So far so good - we haven't synced any invalid operations.

Now, once the client reloads with the latest code, it will begin the migration process.

To migrate, we need a transformer for each changed document shape, which converts one document shape to another. To enable more complex refactorings, we could also allow reading other documents\*.

The trick is that rather than simply migrating each stored document, we need to migrate _each operation._ So in fact, what we do is iterate through the entire operation history, incrementally apply the operation to the document, apply the migration transform to the document, and then rewrite the operation to be the patch from MigratedDocument -> MigratedDocument'.

Example:

- Migrate Baseline = MigratedBaseline
- Apply Operation 1 to **unmigrated** baseline = MigratedDocument 1
- Rewrite Operation 1 to be diff(MigratedBaseline, MigratedDocument 1)
- Apply Operation 2 to MigratedDocument 1 = MigratedDocument 2
- Rewrite Operation 2 to be diff(MigratedDocument 1, MigratedDocument 2)
- Etc.

The client has to do all this work before it syncs to the server again.

After that, the sync process is normal.

\* doing this is a little ambiguous. In theory we'd want to keep a copy of the entire unmigrated dataset so that the migration can reference 'old' documents no matter where we are in the migration process.

## How does the server migrate? What happens to stored operations?

Good point. The server is always the first one to see new schema changes. It can do the same migration as the client, though, as long as it has the schema information, too.

## Data consistency

It would be easy to make a mistake and end up with invalid, unmigrated operations. One way to avoid this might be to add a schema version field to each operation.

It's probably possible to make a system which guarantees this state can't be reached though. If server and client both immediately migrate all stored data when a schema change is detected, and if the server rejects operations from unmigrated clients, then every operation should be valid.
