# How Aglio syncs changes between devices and realtime users

The client works offline for as long as it likes before it ever learns of the server. A user only connects to the server after they've signed up for syncing.

Data is synced in the scope of a Plan. For the initial app, a Plan just owns a Grocery List.

The server keeps a list of unique client IDs for every client which has access to a particular Plan's data. Alongside each client ID it stores the last version it saw from that client. This is how the server knows which clients have seen which data.

```
+--------------+------------+
| Client ID    | Last Seen  |
+--------------+------------+
| client-1     | 2          |
| client-2     | 8          |
| client-3     | 8          |
+--------------+------------+
```

The server tries to keep a patch history all the way back to the oldest known client version. However, to save on space, if the server detects a client hasn't joined in a while, it will forget the client and recompute the history to the new oldest version.

Keeping this history means that whenever data is stored, it's in the form of a `base` object and a list of `patch`es.

```
+-----------------------------+--------------------------------+
| Base                        | Patch                          |
+-----------------------------+--------------------------------+
| {                           |
|   "name": "Grocery List",   |
|   "items": [                |
|     {                       |
|       "name": "Milk",       |
|       "quantity": 1         |
|     },                      |
|   ]                         |
| }                           |
+-----------------------------+--------------------------------+
                              | {                              |
                              |    "range": "items.0.quantity" |
                              |    "value": 2                  |
                              | }                              |
                              +--------------------------------+
                              | {                              |
                              |    "range": "items.1"          |
                              |    "value": { ... etc }        |
                              | }                              |
                              +--------------------------------+
```

Each patch is associated with a version (not shown).

When a client connects to the server, it sends a `hello` message. If the server has never seen this client before, it adds it to the list of clients with unknown version.

## Tricky scenarios

Suppose we have two clients which talk to the server like so...

```
+-----------------------------+--------------------------------+-----------------------------+
| Client 1                    | Client 2                       | Server                      |
+-----------------------------+--------------------------------+-----------------------------+
| ---- OFFLINE ----           | ---- OFFLINE ----              |                             |
| Set item A qty to 1    [a1] |                                |                             |
| Set item B qty to 3    [a2] |                                |                             |
| Set item A qty to 4    [a3] |                                |                             |
| ---- ONLINE ----            |                                |                             |
| Sends all changes to server |                                | Got changes from client 1   |
|                             |                                | Client 1 is at "a0"         |
|                             |                                | Client 2 is at "a0"         |
|                             |                                | base: {}                    |
|                             |                                | patches: [                  |
|                             |                                |   {                         |
|                             |                                |     "ver":   "a1"           |
|                             |                                |     "range": "A.qty"        |
|                             |                                |     "value": 1              |
|                             | Set item A qty to 2       [b1] |   }                         |
|                             | Set item B qty to 8       [b2] |   {                         |
|                             | Create item C, qty 1      [b3] |     "ver":   "a2"           |
|                             |                                |     "range": "B.qty"        |
|                             |                                |     "value": 3              |
|                             |                                |   },                        |
|                             |                                |   {                         |
|                             |                                |     "ver":   "a3"           |
|                             |                                |     "range": "A.qty"        |
|                             |                                |     "value": 4              |
|                             |                                |   }                         |
|                             |                                | ]                           |
|                             |                                | Client 1 is at "a3"         |
|                             |                                |                             |
| What should I keep?         |                                | Everything back to a0       |
| Ok.                         |                                |                             |
| ---- OFFLINE ----           |                                |                             |
|                             | ---- ONLINE ----               |                             |
|                             |  Hi                            | Hey, here's new changes     |
|                             |                                | a1, a2, a3                  |
|                             |                                |                             |
|                             |  Ok here's my changes          | Got changes from client 2   |
|                             |                                | Client 1 is at "a3"         |
|                             |                                | Client 2 is at "a0"         |
|                             |                                | base: {}                    |
|                             |                                | patches: [                  |
|                             |                                |   {                         |
|                             |                                |     "ver":   "a1"           |
|                             |                                |     "range": "A.qty"        |
|                             |                                |     "value": 1              |
|                             |                                |   },                        |
|                             |                                |   {                         |
|                             |                                |     "ver":   "b1"           |
|                             |                                |     "range": "A.qty"        |
|                             |                                |     "value": 2              |
|                             |                                |   },                        |
|                             |                                |   {                         |
|                             |                                |     "ver":   "a2"           |
|                             |                                |     "range": "B.qty"        |
|                             |                                |     "value": 3              |
|                             |                                |   },                        |
|                             |                                |   {                         |
|                             |                                |     "ver":   "b2"           |
|                             |                                |     "range": "B.qty"        |
|                             |                                |     "value": 8              |
|                             |                                |   },                        |
|                             |                                |   {                         |
|                             |                                |     "ver":   "a3"           |
|                             |                                |     "range": "A.qty"        |
|                             |                                |     "value": 4              |
|                             |                                |   },                        |
|                             |                                |   {                         |
|                             |                                |     "ver":   "b3"           |
|                             |                                |     "range": "C"            |
|                             |                                |     "value": { qty: 1}      |
|                             |                                |   }                         |
|                             |                                |                             |
|                             |                                |                             |
|                             |                                | client 1 is at "a3"         |
|                             |                                | client 2 is at "b3"         |
|                             |                                |                             |
|                             |                                | Looks like Client 1 needs   |
|                             |                                | to rewind to "a1"           |
|                             |                                |                             |
|                             |                                | client 1 is at "a1"         |
| --- ONLINE ----             |                                |                             |
|  Hi                         |                                | Hey, here's new changes     |
|                             |                                | b1, a2, b2, a3, b3          |
| Ok, I already have          |                                |                             |
| a2 and a3 but I'll          |                                |                             |
| add b1, b2, b3              |                                |                             |
|                             |                                |                             |
```

In this scenario, clients 1 and 2 make offline changes which fork the history into 2 branches.
Since 1 connects first, it sets the initial history. Then it disconnects, thinking its
own history is the authoritative one. The server records that 1 has reached "a3" version.

2 then connects and the server lets it know about 1's changes. But 2 also was changing history
from the last known synced point, a0. So 2 must merge the patches from the a-branch history
into its b-branch history. It interleaves them in an arbitrary order starting from their
common parent. [[NOTE: Interleaving? Arbitrary? Is that OK?]]. The merge algorithm will combine this
interleaved history into a final view in memory.

Meanwhile 2 pushes its own b-branch changes to the server. The server does the exact same
interleaving in the same order. The server records that 2 has reached "b3" version.

Now the server also realizes that history has diverged for client 1. In order to get the whole history
it needs to go back to the common ancestor at "a1". So it resets client 1 to there.

Now when client 1 reconnects, it will get the history since its divergence - even though that
history includes some of its own patches. It will just discard duplicates.

At the end of this, both 1 and 2 will be at "b3". Since these are the only 2 clients the server
knows about, it can flatten and discard history up to b3.

### Another wrinkle

Suppose another client connects later on. In this case, it will not have a common
history ancestor at all! The server will respond that it can't sync with that client.
The client will have to decide whether to reset itself to the server's world or
not sync.

### What about 3? Does it generalize?

Pretty sure yeah.

### How do clients get informed of historical changes to objects they haven't changed locally?

In the above examples, it's all about 1 object the clients are both modifying. But what
if 1 makes a change to a different object that 2 didn't change?

The server will still know 2's latest version for that object. When 2 connects it can
compare versions of all objects to 2's last knowns and send over histories for all
the ones that differ.

### How do clients learn about created objects?

Same thing - the server will see that the client doesn't have a version for the object,
so it will send the whole history. That's also how all new clients bootstrap.

### How does the client know which patches to send to the server?

Well, it's not illustrated here, but the client is actually keeping a "last seen"
version for the server, too. In fact the client views the server basically the same
as the server views the client.

The main difference between server and client is that the server is the authority
on how much patch history to keep.

### What does a client do before it ever sees a server?

Perhaps if a client has never seen a peer, it should just not store history. When it does see a peer,
it will have to choose whether to take the peer's history or push its own, if the peer has
a different history. Their histories won't otherwise be reconcilable from parents as there
are no common ancestors.

# Notes after testing implementation

It looks like merge patches are needed - or else some smarter way of representing history than a list.

If client 2 inserts a patch into history between two patches from client 1, the server's view of client 1's
point in history doesn't change, so it won't inform client 1 of client 2's insertion.

Instead, client 2's changes should branch, and the server should see the branch and create a merge when history is
synced up to date again, then push that merge to both clients.

Can this happen for each 1-patch branch length? Like we just keep merging each branched patch into its sibling?

```
a0

a1->a0  b1->a0

c2->[a1, b1]

a3->c2

a4->a3  b4->a3

c5->[a4, b4]
```

Like that?

Could it still be stored in a list - just a list of lists?

```
[
  [a0],
  [a1, b1],
  [c2],
  [a3, b3],
  [a4, b4],
  [c5]
]
```

Does it generalize to n? Seems like it should.

```
[
  [a0],
  [a1, b1, c1],
  [d2],
  [a3, b3],
  [d4],
  [a5],
  [b6, c6],
  [d7]
]
```

Suppose the sequence `b1<-b2<-b3` comes in that order in the examples above. How does
the client know how to interleave the patches if there's now a merge patch between
b1 and b2?

Ok, what does a merge patch even represent? It wouldn't have its own changeset? Or would it have a merged version of its parents changesets?

Do we need a merge patch? Or just to store siblings in an array?

Answer: merge patch has value because that's how we solve the original problem of this section: informing a client another client inserted something
into history behind where they are.

But it doesn't, actually... if I make a merge for [a1, b1] as [c2], it doesn't tell client a that b1 exists...

### I'd forgotten about history rewind

When a client adds a patch back in history, the server rewinds other clients to the parent so
they replay the rest of the history.

### What if we store history as a map?

```
{
  a0: { parent: null, patches: [...] },
  a1: { parent: a0, patches: [...] },
  ...
}
```

Then traversal from start to finish would be quite hard.

What if we went the other way around for storage...

```
{
  a0: { children: ['a1', 'b1'], patches: [...] },
  a1: { children: ['c2'], patches: [...] },
  b1: { children: ['c2'], patches: [...] },
  c2: { children: [], patches: [...] },
}
```