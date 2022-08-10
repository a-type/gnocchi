import { Disposable } from './disposable';
import { createNodeRenderer, RenderedNode } from './nodeRenderer';
import {
	ReactiveObject,
	UnwrappedListOfReactives,
	reactive,
	ListOfReactives,
	subscribe,
} from './reactives2';
import { stylesheet } from './stylesheet';

type CleanupFn = () => void;

type WatchEffect = <Reactives extends ListOfReactives>(
	deps: Reactives,
	run: (
		...args: UnwrappedListOfReactives<Reactives>
	) => void | CleanupFn | Disposable<any>,
) => void;

type Tools = {
	cleanup: (fn: CleanupFn) => void;
	ui: (node: RenderedNode) => RenderedNode;
	watch: WatchEffect;
	reactive: typeof reactive;
	stylesheet: typeof stylesheet;
};

type CreatorFn<Props extends Record<any, any>> = (
	props: ReactiveObject<Props>,
	tools: Tools,
) => CleanupFn | void;

export class ReactiveComponent<
	Props extends Record<any, any>,
> extends HTMLElement {
	private _cleanups: CleanupFn[] = [];
	private shadow: ShadowRoot;
	private props: ReactiveObject<Props> = reactive({}) as any;

	constructor(private _creator: CreatorFn<Props>) {
		super();
		this.shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
	}

	initialize = () => {
		const self = this;

		function doCleanup(cleanup: CleanupFn | Disposable<any>) {
			if (typeof cleanup === 'function') {
				cleanup();
			} else {
				cleanup.dispose();
			}
		}

		function ui(node: RenderedNode): RenderedNode {
			self.shadow.appendChild(node.element);
			self._cleanups.push(node.cleanup);
			return node;
		}

		const uncreate = this._creator(this.getProps(), {
			cleanup: (fn: CleanupFn) => {
				this._cleanups.push(fn);
			},
			ui,
			watch: (deps, run) => {
				let cleanup: CleanupFn | Disposable<any> | undefined = undefined;
				const callback = () => {
					if (cleanup) {
						doCleanup(cleanup);
					}
					cleanup =
						run(...(deps.map((dep) => dep.current) as any)) || undefined;
				};
				callback();
				const allCleanups = deps.map((dep) => subscribe(dep, callback));
				this._cleanups.push(() => {
					allCleanups.forEach((cleanup) => cleanup());
					if (cleanup) {
						doCleanup(cleanup);
					}
				});
			},
			reactive,
			stylesheet: (rules) => {
				const sheet = stylesheet(rules);
				return ui(sheet);
			},
		});
		if (uncreate) {
			this._cleanups.push(uncreate);
		}
	};

	connectedCallback() {
		console.debug(this.tagName, 'connectedCallback');
		this.initialize();
	}

	disconnectedCallback() {
		console.debug(this.tagName, 'disconnectedCallback');
		this._cleanups.forEach((fn) => fn());
	}

	setProps = (props: Props) => {
		this.props = reactive(props) as ReactiveObject<Props>;
	};

	getProps = (): ReactiveObject<Props> => {
		const props = this.props;
		// attribute overrides
		// for (const attr of this.attributes) {
		//   if (props[attr.name]) {
		//     props[attr.name].value = attr.value;
		//   }
		// }
		return props;
	};
}

export function define<Props>(name: string, creator: CreatorFn<Props>) {
	class DefinedComponent extends ReactiveComponent<Props> {
		constructor() {
			super(creator);
		}
	}

	customElements.define(`x-${name}`, DefinedComponent);

	return createNodeRenderer<Props>(`x-${name}`);
}
