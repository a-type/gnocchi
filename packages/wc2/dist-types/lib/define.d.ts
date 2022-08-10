import { Disposable } from './disposable';
import { RenderedNode } from './nodeRenderer';
import { ReactiveObject, UnwrappedListOfReactives, reactive, ListOfReactives } from './reactives2';
import { stylesheet } from './stylesheet';
declare type CleanupFn = () => void;
declare type WatchEffect = <Reactives extends ListOfReactives>(deps: Reactives, run: (...args: UnwrappedListOfReactives<Reactives>) => void | CleanupFn | Disposable<any>) => void;
declare type Tools = {
    cleanup: (fn: CleanupFn) => void;
    ui: (node: RenderedNode) => RenderedNode;
    watch: WatchEffect;
    reactive: typeof reactive;
    stylesheet: typeof stylesheet;
};
declare type CreatorFn<Props extends Record<any, any>> = (props: ReactiveObject<Props>, tools: Tools) => CleanupFn | void;
export declare class ReactiveComponent<Props extends Record<any, any>> extends HTMLElement {
    private _creator;
    private _cleanups;
    private shadow;
    private props;
    constructor(_creator: CreatorFn<Props>);
    initialize: () => void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    setProps: (props: Props) => void;
    getProps: () => ReactiveObject<Props>;
}
export declare function define<Props>(name: string, creator: CreatorFn<Props>): (props: { [K in keyof Props]: Props[K] extends import("./reactives2").AnyReactive ? Props[K] : Props[K] | import("./reactives2").Reactify<Props[K]>; }) => RenderedNode;
export {};
//# sourceMappingURL=define.d.ts.map