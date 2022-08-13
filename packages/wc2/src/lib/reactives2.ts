/**
 * Creates a Proxy wrapper for any object/array value
 * which acts as a tree of tracking reactive values,
 * down to the primitive leaf nodes, which are essentially
 * reactive ref containers.
 *
 * const value = reactive({
 *  a: {
 *   b: {
 *    c: 'hello',
 *   },
 *  },
 * });
 *
 * value.a.b.c.value // 'hello'
 * value.a.b.c.set('goodbye');
 * value.a.b // Proxy{ c: Proxy{'goodbye'} };
 *
 * Additionally, any Proxy reactive must be referentially
 * equal to another Proxy reactive if the targets are 'the same'
 * this is done with a WeakMap
 */
const IS_REACTIVE = Symbol('@@isReactive');
const SUBSCRIBERS = Symbol('@@subscribers');
const SUBSCRIBE = Symbol('@@subscribe');
const NOTIFY = Symbol('@@notify');
const ASSIGN = Symbol('@@assign');
const PRIMITIVE = Symbol('@@primitive');
const ELEMENT = Symbol('@@element');
const PRIMITIVE_CACHE = Symbol('@@primitiveCache');
const REF = Symbol('@@ref');

type BaseReactive<T> = {
	[IS_REACTIVE]: true;
	[SUBSCRIBERS]: Set<(value: T) => void>;
	[SUBSCRIBE]: (callback: (value: T) => void) => () => void;
	[NOTIFY]: (value: T) => void;
	[ASSIGN]: (value: any) => void;
	[REF]: { current: T };
};

export type ReactiveObject<T extends object = any> = BaseReactive<T> &
	ReactifiedProperties<T> & {
		[PRIMITIVE_CACHE]: Record<string, ReactivePrimitive<any>>;
	};

type ReactifiedProperties<T extends object> = {
	[K in keyof T]: WrappedReactiveProperty<T[K]>;
};

export type ListOfReactives = Array<AnyReactive>;

export type UnwrappedListOfReactives<ListOfReactives> = {
	[K in keyof ListOfReactives]: ListOfReactives[K] extends ReactiveObject<
		infer T
	>
		? T
		: never;
};

export type AnyReactive =
	| ReactiveObject
	| ReactivePrimitive<any>
	| ReactiveElement<any>;

export type Reactify<T> = T extends AnyReactive
	? T
	: T extends Primitive
	? ReactivePrimitive<T>
	: T extends Element
	? ReactiveElement<T>
	: T extends AnyReactive
	? T
	: T extends object
	? ReactiveObject<T>
	: never;

export type UnwrappedReactive<T extends AnyReactive> = T extends ReactiveObject<
	infer U
>
	? U
	: T extends ReactivePrimitive<infer U>
	? U
	: T extends ReactiveElement<infer U>
	? U
	: never;

type UnwrappedAnyReactiveAsList<T extends AnyReactive | ListOfReactives> =
	T extends ReactiveObject<infer U>
		? [U]
		: T extends ListOfReactives
		? UnwrappedListOfReactives<T>
		: never;

type Primitive = string | number | boolean | symbol | null | undefined;

function isPrimitive(value: unknown): value is Primitive {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		typeof value === 'symbol' ||
		value === null ||
		value === undefined
	);
}

type ReactivePrimitive<T extends Primitive> = BaseReactive<T> & {
	current: T;
	[PRIMITIVE]: true;
};

type ReactiveElement<T extends Element> = BaseReactive<T> & {
	current: T;
	[ELEMENT]: true;
};

export function isReactiveElement<T extends Element>(
	value: any,
): value is ReactiveElement<T> {
	return isReactiveValue(value) && value.current instanceof Element;
}

// primitive values are wrapped in a ref container,
// others are just Reactives of themselves.
type WrappedReactiveProperty<T> = T extends Primitive
	? ReactivePrimitive<T>
	: T extends Element
	? ReactiveElement<T>
	: T extends object
	? ReactiveObject<T>
	: never;

export function isReactiveValue(value: any): value is ReactiveObject {
	return !!value && value[IS_REACTIVE];
}

export function isReactivePrimitive(
	value: any,
): value is ReactivePrimitive<any> {
	return !!isReactiveValue(value) && !!(value as any)[PRIMITIVE];
}

const wrappedCache = new WeakMap<any, BaseReactive<any>>();

export function reactive<T>(value: T, hydrateId?: string): Reactify<T> {
	let reactiveToHydrate;
	if (isReactiveValue(value)) {
		reactiveToHydrate = value as Reactify<T>;
	} else if (isPrimitive(value)) {
		reactiveToHydrate = createReactivePrimitive(value) as any;
	} else if (value instanceof Element) {
		reactiveToHydrate = createReactiveElement(value) as any;
	} else if (typeof value === 'object') {
		reactiveToHydrate = createReactiveObject(value as any) as any;
	} else {
		throw new Error('unsupported reactive type');
	}

	if (hydrateId) {
	}

	return reactiveToHydrate;
}

function createBaseReactive<T>() {
	const subscribers = new Set<(value: T) => void>();
	return {
		[IS_REACTIVE]: true,
		[SUBSCRIBERS]: subscribers,
		[SUBSCRIBE]: (callback: (value: T) => void) => {
			subscribers.add(callback);
			return () => subscribers.delete(callback);
		},
		[NOTIFY]: (value: T) => {
			subscribers.forEach((callback) => callback(value));
		},
	};
}

function createReactivePrimitive<T extends Primitive>(value: T) {
	const ref = { current: value };
	const base = createBaseReactive();
	return new Proxy(
		{
			...base,
			get current() {
				return ref.current;
			},
			[ASSIGN]: (newValue: T) => {
				ref.current = newValue;
				base[NOTIFY](newValue);
			},
			[PRIMITIVE]: true as const,
			[REF]: ref,
		},
		{
			set(target, prop, value) {
				if (prop === 'current') {
					ref.current = value;
					target[NOTIFY](value);
					return true;
				}
				return false;
			},
		},
	) as ReactivePrimitive<T>;
}

function createReactiveElement<T extends Element>(value: T) {
	if (wrappedCache.has(value)) {
		return wrappedCache.get(value) as ReactiveElement<T>;
	}
	const ref = { current: value };
	const base = createBaseReactive();
	const rValue = new Proxy(
		{
			...base,
			get current() {
				return ref.current;
			},
			[ASSIGN]: (newValue: T) => {
				ref.current = newValue;
				base[NOTIFY](newValue);
			},
			[ELEMENT]: true as const,
			[REF]: ref,
		},
		{
			set(target, prop, value) {
				if (prop === 'current') {
					ref.current = value;
					target[NOTIFY](value);
					return true;
				}
				return false;
			},
		},
	) as ReactiveElement<T>;
	wrappedCache.set(value, rValue);
	return rValue;
}

function reactiveObjectRef<T extends object>(
	value: T,
	base: { [NOTIFY]: (value: T) => void },
) {
	return new Proxy(value, {
		set(target, prop, value) {
			Reflect.set(target, prop, value);
			base[NOTIFY](target);
			return true;
		},
	});
}

function createReactiveObject<T extends Record<string | symbol, any>>(
	value: T,
) {
	if (wrappedCache.has(value)) {
		return wrappedCache.get(value) as ReactiveObject<T>;
	}
	const base = createBaseReactive();
	const ref = {
		current: reactiveObjectRef(value, base),
	};
	const rValue = new Proxy(
		{
			...base,
			[ASSIGN]: (newValue: T) => {
				ref.current = reactiveObjectRef(newValue, base);
				base[NOTIFY](newValue);
			},
			[PRIMITIVE_CACHE]: {},
			[REF]: ref,
		},
		{
			get(target, prop) {
				if (Reflect.has(ref.current, prop)) {
					if (isPrimitive(ref.current[prop])) {
						if (!target[PRIMITIVE_CACHE].hasOwnProperty(prop)) {
							// FIXME: is this wrong? it won't sync with underlying
							// ref?
							(target[PRIMITIVE_CACHE] as any)[prop] = reactive(
								ref.current[prop],
							);
						}
						return (target[PRIMITIVE_CACHE] as any)[prop];
					} else {
						// TODO: should functions be reactive?
						if (typeof ref.current[prop] === 'function') {
							return ref.current[prop].bind(ref.current);
						}
						return reactive(ref.current[prop]);
					}
				}
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				Reflect.set(ref.current, prop, value);
				target[NOTIFY](ref.current);
				return true;
			},
		},
	) as unknown as ReactiveObject<T>;
	wrappedCache.set(value, rValue);
	return rValue;
}

export function subscribe<T extends AnyReactive>(
	reactive: T,
	callback: (value: UnwrappedReactive<T>) => void,
) {
	return reactive[SUBSCRIBE](callback);
}

function unwrapRefs<T extends AnyReactive>(value: T) {
	if (isReactivePrimitive(value) || isReactiveElement(value)) {
		return value.current;
	}
	return value;
}

export function from<In extends AnyReactive | ListOfReactives, Out>(
	dependencies: In,
	process: (...dependencies: UnwrappedAnyReactiveAsList<In>) => Out,
) {
	const depsArray: ListOfReactives = Array.isArray(dependencies)
		? dependencies
		: [dependencies];
	const collapseDependencies = () =>
		depsArray.map((dep) => unwrapRefs(dep)) as UnwrappedAnyReactiveAsList<In>;
	const rValue = reactive(process(...collapseDependencies()));
	for (const dependency of depsArray) {
		subscribe(dependency, () => {
			rValue[ASSIGN](process(...collapseDependencies()));
		});
	}
	return rValue;
}

export function unwrap<T extends AnyReactive>(value: T): UnwrappedReactive<T> {
	return value[REF].current;
}

export function view<In>(
	subscribe: (cb: () => void) => void | (() => void),
	snapshot: () => In,
) {
	const rValue = reactive(snapshot());
	const cleanup = subscribe(() => {
		rValue[ASSIGN](snapshot());
	});
	// TODO: what with cleanup?
	return rValue;
}

export function map<In extends object, Out>(
	input: ReactiveObject<In>,
	process: (value: In) => Out,
) {
	const rValue = reactive(process(unwrap(input) as In));
	subscribe(input, () => {
		rValue[ASSIGN](process(unwrap(input) as In));
	});
	return rValue;
}
