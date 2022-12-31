# Gnocchi

Gnocchi, a tiny cooking app.

The web app is designed to work local-first and local-only. Users can subscribe to sync their list between devices and unlock realtime collaboration with family or friends they shop with.

Future releases may focus on recipe management, meal ideas, and general sanity in the weekly meal preparation world.

## Repo structure

- `/apps/api` - the core API and websocket server. Handles user registration, access, and synchronization of local changes.
- `/apps/react` - React-based PWA.
- `/packages` - several common internal libraries.
