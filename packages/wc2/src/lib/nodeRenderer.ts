import { applyAttribute } from './attributes';
import { ReactiveComponent } from './define';
import { AnyReactive, Reactify, ReactiveObject } from './reactives2';

const renderedNodeTag = Symbol('rendredNode');

export type RenderedNode = {
  [renderedNodeTag]: true;
  element: Element;
  cleanup: () => void;
};

export type NodeRendererFn<Props> = (props: Props) => RenderedNode;

type PropsOrReactives<Props> = {
  [K in keyof Props]: Props[K] extends AnyReactive
    ? Props[K]
    : Props[K] | Reactify<Props[K]>;
};

export function createNodeRenderer<Props>(tag: string) {
  return function (props: PropsOrReactives<Props>): RenderedNode {
    const element = document.createElement(tag);
    if (element instanceof ReactiveComponent) {
      element.setProps(props);
    }
    for (const [name, value] of Object.entries(props)) {
      applyAttribute(element, name, value);
    }
    return {
      [renderedNodeTag]: true,
      element,
      cleanup: () => {
        element.remove();
      },
    };
  };
}

export function isRenderedNode(node: any): node is RenderedNode {
  return node && node[renderedNodeTag];
}
