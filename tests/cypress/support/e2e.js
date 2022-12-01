// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.Commands.add('clearIndexedDB', async () => {
	const databases = await window.indexedDB.databases();

	await Promise.all(
		databases.map(
			({ name }) =>
				new Promise((resolve, reject) => {
					const request = window.indexedDB.deleteDatabase(name);

					request.addEventListener('success', resolve);
					// Note: we need to also listen to the "blocked" event
					// (and resolve the promise) due to https://stackoverflow.com/a/35141818
					request.addEventListener('blocked', resolve);
					request.addEventListener('error', reject);
				}),
		),
	);
});

Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from
	// failing the test
	if (err.message.includes('ResizeObserver loop limit exceeded')) {
		return false;
	}
	return true;
});
