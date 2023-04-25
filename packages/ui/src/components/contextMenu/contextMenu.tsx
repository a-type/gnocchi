import * as ContextMenu from '@radix-ui/react-context-menu';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { withClassName } from '../../styles.js';
import * as classes from './contextMenu.css.js';
import classNames from 'classnames';

export const ContextMenuRoot = ContextMenu.Root;

export const ContextMenuContent = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof ContextMenu.Content>
>(function Content({ className, onClick, ...props }, ref) {
	return (
		<ContextMenu.Portal>
			<ContextMenu.Content
				className={classNames(classes.content, className)}
				onClick={(ev) => {
					ev.stopPropagation();
					onClick?.(ev);
				}}
				ref={ref}
				{...props}
			/>
		</ContextMenu.Portal>
	);
});

export const ContextMenuArrow = withClassName(ContextMenu.Arrow, classes.arrow);

export const ContextMenuItem = withClassName(ContextMenu.Item, classes.item);

export const ContextMenuTrigger = withClassName(
	ContextMenu.Trigger,
	classes.trigger,
);
