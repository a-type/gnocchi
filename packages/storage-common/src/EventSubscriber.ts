export class EventSubscriber<
	Events extends Record<string, (...args: any[]) => void>,
> {
	protected subscribers: Record<keyof Events, Set<(...args: any[]) => void>> =
		{} as any;

	subscribe = <K extends keyof Events>(event: K, callback: Events[K]) => {
		if (!this.subscribers[event]) {
			this.subscribers[event] = new Set();
		}
		this.subscribers[event].add(callback);
		return () => {
			this.subscribers[event].delete(callback);
		};
	};

	emit = <K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) => {
		if (this.subscribers[event]) {
			this.subscribers[event].forEach((c) => c(...args));
		}
	};
}

export type EventsOf<T extends EventSubscriber<any>> =
	T extends EventSubscriber<infer E> ? keyof E : never;
