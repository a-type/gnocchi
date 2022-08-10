import { AnyReactive, Reactify } from './reactives2';
declare const renderedNodeTag: unique symbol;
export declare type RenderedNode = {
    [renderedNodeTag]: true;
    element: Element;
    cleanup: () => void;
};
export declare type NodeRendererFn<Props> = (props: Props) => RenderedNode;
declare type PropsOrReactives<Props> = {
    [K in keyof Props]: Props[K] extends AnyReactive ? Props[K] : Props[K] | Reactify<Props[K]>;
};
export declare function createNodeRenderer<Props>(tag: string): (props: PropsOrReactives<Props>) => RenderedNode;
export declare function isRenderedNode(node: any): node is RenderedNode;
export {};
//# sourceMappingURL=nodeRenderer.d.ts.map