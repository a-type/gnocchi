import type { Storage } from '@aglio/storage';
import puppeteer from 'puppeteer';
import cuid from 'cuid';

const browserPromise = puppeteer.launch({
	headless: true,
});

export async function start(id: string) {
	const browser = await browserPromise;
	const page = await browser.newPage();
	await page.goto(`http://localhost:8888/client/${id}`);

	return {
		createTodo: async (text: string) => {
			return page.evaluate(async function () {
				const item = await window.client.get('todo').create({
					id: cuid(),
					title: text,
					done: false,
					tags: [],
				});
				return item;
			});
		},
		updateTodo: async (
			id: string,
			props: { done?: boolean; text?: string },
		) => {
			return page.evaluate(function () {
				window.client.get('todo').update(id, props);
			});
		},
		addTodoTag: async (id: string, tag: string) => {
			return page.evaluate(async function () {
				const current = await window.client.get('todo').get(id).resolved;
				if (!current) {
					throw new Error('Todo not found: ' + id);
				}
				window.client.get('todo').update(id, {
					tags: (current.tags as string[]).concat(tag),
				});
			});
		},
		deleteTodo: async (id: string) => {
			return page.evaluate(function () {
				window.client.get('todo').delete(id);
			});
		},
		getTodos: async () => {
			return page.evaluate(function () {
				return window.client.get('todo').getAll().resolved;
			});
		},
		stop: () => {
			return page.close();
		},
	};
}

export async function stop() {
	return (await browserPromise).close();
}

declare global {
	interface Window {
		client: Storage<any>;
	}
}
