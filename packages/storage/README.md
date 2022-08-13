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

### Determining the undo window

To actually achieve this the server needs to keep track of a few things.

**A bounded operation history for each client it knows about.**

Then it can know when all clients undo window has passed a delete operation.

This is bounded to the size of the window, so if the history no longer contains the delete, it's no longer undoable.

That means the computation to determine if a delete is finalized is "does any client history include the latest delete operation?" This can be recomputed each time the history changes I guess. Seems easy to optimize from there.
