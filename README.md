# Aglio (web)

Aglio, a tiny groceries list app.

The web app is designed to work local-first and local-only. If this project continues, the goal is to include a server which subscribed users can connect to to synchronize data between their own devices and collaborate with a partner or friend, etc.

## Local-first tech

To make the app work locally out of the box with no server, I've experimented with using [Aphrodite](https://aphrodite.sh/). A very young project, but the goals align very well.

The data model for the grocery list is in `/web/stores/groceries/domain.aphro`. This schema defines how data is structured and mutated in the app.

From there the contents of `/web/stores/groceries/.generated` are created. I'm currently committing those since they include some handwritten code in the `XImpl.ts` files.

The React app queries these models to reactively display the data.

Data is persisted between sessions using IndexedDB, wrapped with a SQLite-compatible API.

## Features

Here are some planned features for the first iteration of the app:

- [x] Add items to the list
- [x] Remove items from the list
- [x] Merge items with the same detected food
- [x] Categorize items
- [ ] Remember which foods belong in which categories
- [ ] Default categories based on common grocery sections
- [ ] Sync to your devices (subscribers)
- [ ] Collaborate with a group on one list (subscribers)
- [ ] Import groceries from a recipe website (subscribers)
