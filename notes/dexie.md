Dexie's pretty nice to get started with, but there are some quirks...

1. `id` field should be optional so it can autoincrement, but then the output models have `id?` when `id` should always be defined for them.