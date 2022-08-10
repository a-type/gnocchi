import { style } from './natives';
import { RenderedNode } from './nodeRenderer';

export function stylesheet(rules: string): RenderedNode {
	return style({
		children: [rules],
	});
}
