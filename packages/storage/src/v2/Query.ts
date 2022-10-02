export const SUBSCRIBE = '@@subscribe';
export const UPDATE = '@@update';

export class Query<T> {
	private _current: T | null = null;
	private _subscribers: Set<(value: T | null) => void> = new Set();
	resolved: Promise<T>;

	constructor(
		private readonly query: () => Promise<T>,
		private readonly onActivate: (query: Query<T>) => void,
		private readonly onDispose: (query: Query<T>) => void,
	) {
		this.resolved = this.execute();
	}

	private execute = async (): Promise<T> => {
		this._current = await this.query();
		this._subscribers.forEach((subscriber) => subscriber(this._current));
		return this._current;
	};

	get current() {
		return this._current;
	}

	[UPDATE] = () => {
		this.resolved = this.execute();
	};

	[SUBSCRIBE] = (callback: (value: T | null) => void) => {
		this._subscribers.add(callback);
		if (this._subscribers.size === 1) {
			this.onActivate(this);
		}
		return () => {
			this._subscribers.delete(callback);
			if (this._subscribers.size === 0) {
				queueMicrotask(() => {
					if (this._subscribers.size === 0) {
						this.onDispose(this);
					}
				});
			}
		};
	};

	get subscriberCount() {
		return this._subscribers.size;
	}

	get isActive() {
		return this.subscriberCount > 0;
	}
}
