export async function readRawIdb(
	database: string,
	version: number,
	store: string,
	iterator: (value: any) => void,
) {
	const db = await openDB(database, version);
	const tx = db.transaction(store, 'readonly');
	const storeObj = tx.objectStore(store);
	const request = storeObj.openCursor();
	request.onsuccess = () => {
		const cursor = request.result;
		if (cursor) {
			iterator(cursor.value);
			cursor.continue();
		}
	};
	await new Promise((resolve, reject) => {
		tx.oncomplete = resolve;
		tx.onerror = reject;
	});
}

async function openDB(name: string, version: number) {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(name, version);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
