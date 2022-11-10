/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import {
	precacheAndRoute,
	createHandlerBoundToURL,
	cleanupOutdatedCaches,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

// auto-update on ready
self.skipWaiting();
clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
	// Add in any other file extensions or routing criteria as needed.
	({ url }) =>
		url.origin === self.location.origin && url.pathname.endsWith('.png'),
	// Customize this strategy as needed, e.g., by changing to CacheFirst.
	new StaleWhileRevalidate({
		cacheName: 'images',
		plugins: [
			// Ensure that once this runtime cache reaches a maximum size the
			// least-recently used images are removed.
			new ExpirationPlugin({ maxEntries: 50 }),
		],
	}),
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

// Any other custom service worker logic can go here.

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);

	// detect a share event from the PWA
	if (event.request.method === 'POST' && url.pathname === '/share') {
		console.log('SHARE', event);
		event.respondWith(
			(async () => {
				const formData = await event.request.formData();
				const text = formData.get('text');
				if (text && typeof text === 'string') {
					// check if text is a URL
					try {
						const url = new URL(text);
						postMessage({ type: 'pwa-share', url });
					} catch (e) {
						// not a URL, could be ingredients list
						const items = text.split('\n');
						postMessage({ type: 'pwa-share', items });
					}
				}

				return Response.redirect('/', 303);
			})(),
		);
	}
});
