# Live Queries and Live Objects

A summary of reactivity in the library.

## Live Queries

TODO

### Memory management

If nobody is subscribing to the LiveQuery, it will be disposed, so you should always have at least one subscriber if you are referencing data from a live object.

If you have a separate update loop which wants to query the status of a particular document without subscribing to it, you should fetch that query every loop from storage rather than keeping a reference to an unsubscribed LiveQuery. This may feel less efficient, but it allows memory to be freed when the query is no longer needed. If any other part of the app is also subscribing to that query, it will be cached, so accessing it will be faster.

## Live Objects

Live objects are structured to allow access to all the data in a document, and have a `.subscribe` feature which is used to inform the user of changes. In most cases you will use LiveObjects as the results of LiveQueries, so you don't need to worry about subscribing directly.

### Data access

You can reference data in a LiveObject like a regular object. LiveObjects are Proxies. Any nested datastructures will be wrapped as well.

### Mutations

You can alter the data of the document represented by a live object using methods attached to the object.

All mutations made in a single frame will be applied as one atomic operation, even if they are called separately.

> To enable this, the LiveObject applies your changes locally in memory, then commits an update in a microtask which will run after the call stack is empty. Upon receiving the next internal storage update, it drops the in-memory changes and applies the latest version of the document.
>
> If you want to make multiple atomic changes in one frame, use .commit() to separate your changesets.
>
> To ensure data integrity for multiple atomic patches, the changesets will be committed together in a microtask in the same manner, and applied to the storage system concurrently, but they will remain separate operations which can be undone individually.

Mutations are exposed depending on the structure of your document. Top-level fields can be altered using `.$set(fieldName, value)` or `.$update(partialObject)`. Nested fields can be altered by accessing the nested object and using the same methods on it.

#### Array mutations

Arrays expose semantic mutations for common list operations. These are specially encoded as operations which will better preserve intent - for example, if you and a peer both push an item onto the list, they will both be added to the end in order (instead of both being 'inserted' at the same index and overwriting one another).
