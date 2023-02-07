import { withClassName } from '../../withClassName.jsx';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as classes from './Collapsible.css.js';

export const CollapsibleRoot = CollapsiblePrimitive.Root;
export const CollapsibleContent = withClassName(
	CollapsiblePrimitive.Content,
	classes.content,
);
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
