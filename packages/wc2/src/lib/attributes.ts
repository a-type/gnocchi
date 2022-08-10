import { isRenderedNode } from './nodeRenderer';
import {
  isReactiveElement,
  isReactivePrimitive,
  isReactiveValue,
  subscribe,
  unwrap,
} from './reactives2';

export function applyAttribute(element: Element, name: string, value: any) {
  subscribeToReactives(element, name, value);
  doAttributeApplication(element, name, value);
}

function doAttributeApplication(element: Element, name: string, value: any) {
  const resolvedValue = isReactiveValue(value) ? unwrap(value) : value;
  if (isReactiveValue(resolvedValue)) {
    throw new Error('Cannot assign complex reactive to node attribute');
  }
  if (name === 'children') {
    applyChildren(element, resolvedValue);
  } else if (name === 'value') {
    (element as any).value = resolvedValue;
  } else if (name.startsWith('on')) {
    element.addEventListener(name.slice(2), resolvedValue);
  } else if (typeof resolvedValue === 'boolean') {
    if (resolvedValue) {
      element.setAttribute(name, '');
    }
  } else {
    element.setAttribute(name, resolvedValue);
  }
}

function subscribeToReactives(element: Element, name: string, value: any) {
  if (Array.isArray(value)) {
    function refreshAll() {
      doAttributeApplication(element, name, value);
    }
    for (const child of value) {
      if (isReactiveValue(child)) {
        subscribe(child, refreshAll);
      }
    }
  } else if (isReactiveValue(value)) {
    subscribe(value, () => {
      doAttributeApplication(element, name, value);
    });
  }
}

function applyChildren(element: Element, children: any) {
  element.innerHTML = '';

  if (Array.isArray(children)) {
    for (const child of children) {
      appendChild(element, child);
    }
  } else {
    appendChild(element, children);
  }
}

function appendChild(element: Element, child: any) {
  if (child instanceof Element) {
    element.append(child);
  } else if (isReactiveElement(child) || isReactivePrimitive(child)) {
    appendChild(element, child.current);
  } else if (child === null || child === undefined) {
    // do nothing
  } else if (isRenderedNode(child)) {
    element.append(child.element);
  } else {
    try {
      const textNode = document.createTextNode(`${child}`);
      element.append(textNode);
    } catch (e) {
      throw new Error(`Invalid child: ${JSON.stringify(child)}`);
    }
  }
}
