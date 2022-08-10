export declare type Disposable<T> = {
    dispose(): void;
    readonly value: T;
};
export declare function disposable<T>(setup: () => T, dispose: (current: T) => void): Disposable<T>;
//# sourceMappingURL=disposable.d.ts.map