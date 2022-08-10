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
declare const IS_REACTIVE: unique symbol;
declare const SUBSCRIBERS: unique symbol;
declare const SUBSCRIBE: unique symbol;
declare const NOTIFY: unique symbol;
declare const ASSIGN: unique symbol;
declare const PRIMITIVE: unique symbol;
declare const ELEMENT: unique symbol;
declare const PRIMITIVE_CACHE: unique symbol;
declare const REF: unique symbol;
declare type BaseReactive<T> = {
    [IS_REACTIVE]: true;
    [SUBSCRIBERS]: Set<(value: T) => void>;
    [SUBSCRIBE]: (callback: (value: T) => void) => () => void;
    [NOTIFY]: (value: T) => void;
    [ASSIGN]: (value: any) => void;
    [REF]: {
        current: T;
    };
};
export declare type ReactiveObject<T extends object = any> = BaseReactive<T> & ReactifiedProperties<T> & {
    [PRIMITIVE_CACHE]: Record<string, ReactivePrimitive<any>>;
};
declare type ReactifiedProperties<T extends object> = {
    [K in keyof T]: WrappedReactiveProperty<T[K]>;
};
export declare type ListOfReactives = Array<AnyReactive>;
export declare type UnwrappedListOfReactives<ListOfReactives> = {
    [K in keyof ListOfReactives]: ListOfReactives[K] extends ReactiveObject<infer T> ? T : never;
};
export declare type AnyReactive = ReactiveObject | ReactivePrimitive<any> | ReactiveElement<any>;
export declare type Reactify<T> = T extends AnyReactive ? T : T extends Primitive ? ReactivePrimitive<T> : T extends Element ? ReactiveElement<T> : T extends AnyReactive ? T : T extends object ? ReactiveObject<T> : never;
export declare type UnwrappedReactive<T extends AnyReactive> = T extends ReactiveObject<infer U> ? U : T extends ReactivePrimitive<infer U> ? U : T extends ReactiveElement<infer U> ? U : never;
declare type UnwrappedAnyReactiveAsList<T extends AnyReactive | ListOfReactives> = T extends ReactiveObject<infer U> ? [U] : T extends ListOfReactives ? UnwrappedListOfReactives<T> : never;
declare type Primitive = string | number | boolean | symbol | null | undefined;
declare type ReactivePrimitive<T extends Primitive> = BaseReactive<T> & {
    current: T;
    [PRIMITIVE]: true;
};
declare type ReactiveElement<T extends Element> = BaseReactive<T> & {
    current: T;
    [ELEMENT]: true;
};
export declare function isReactiveElement<T extends Element>(value: any): value is ReactiveElement<T>;
declare type WrappedReactiveProperty<T> = T extends Primitive ? ReactivePrimitive<T> : T extends Element ? ReactiveElement<T> : T extends object ? ReactiveObject<T> : never;
export declare function isReactiveValue(value: any): value is ReactiveObject;
export declare function isReactivePrimitive(value: any): value is ReactivePrimitive<any>;
export declare function reactive<T>(value: T, hydrateId?: string): Reactify<T>;
export declare function subscribe<T extends AnyReactive>(reactive: T, callback: (value: UnwrappedReactive<T>) => void): () => void;
export declare function from<In extends AnyReactive | ListOfReactives, Out>(dependencies: In, process: (...dependencies: UnwrappedAnyReactiveAsList<In>) => Out): Reactify<Out>;
export declare function unwrap<T extends AnyReactive>(value: T): UnwrappedReactive<T>;
export {};
//# sourceMappingURL=reactives2.d.ts.map