import type { EventsOf } from './EventSubscriber.js';
import { CollectionEvents, StorageCollectionSchema } from './types.js';

export class LiveQuery<
	Collection extends StorageCollectionSchema<any, any>,
	T,
> {
	private _current: T | null = null;
	private _subscribers: Set<(value: T | null) => void> = new Set();
	resolved: Promise<T | null>;

	constructor(
		private exec: () => Promise<T>,
		private events: CollectionEvents<Collection>,
		listen: EventsOf<CollectionEvents<Collection>>[],
	) {
		this.resolved = this.update();
		for (const event of listen) {
			this.events.subscribe(event, () => {
				this.resolved = this.update();
			});
		}
	}

	get current() {
		return this._current;
	}

	private update = async () => {
		this._current = await this.exec();
		this._subscribers.forEach((subscriber) => subscriber(this._current));
		return this._current;
	};

	subscribe = (callback: (value: T | null) => void) => {
		this._subscribers.add(callback);
		return () => {
			this._subscribers.delete(callback);
		};
	};
}
