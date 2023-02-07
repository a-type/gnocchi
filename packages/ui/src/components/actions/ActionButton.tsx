import {
	Button,
	ButtonProps,
	CollapsibleContent,
	CollapsibleRoot,
} from '../index.js';
import { clsx } from 'clsx';
import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react';
import * as classes from './ActionButton.css.js';

export interface ActionButtonProps extends ButtonProps {
	icon?: ReactNode;
	visible?: boolean;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
	function ActionButton(
		{ icon, children, className, visible = true, ...rest },
		ref,
	) {
		// this rather convoluted logic is meant to do:
		// - when button goes invisible, wait for collapse and then
		//   stop rendering
		// - when button goes visible, render immediately and
		//   set collapsible open next frame.
		const [render, setRender] = useState(visible);
		useEffect(() => {
			if (!visible) {
				const timeout = setTimeout(() => {
					setRender(visible);
				}, 300);
				return () => clearTimeout(timeout);
			} else {
				setRender(visible);
			}
		}, [visible]);

		if (!render && !visible) {
			return null;
		}

		return (
			<CollapsibleRoot open={!visible ? false : render}>
				<CollapsibleContent data-horizontal className={classes.outer}>
					<Button
						ref={ref}
						size="small"
						className={clsx(classes.root)}
						{...rest}
					>
						{icon}
						{children}
					</Button>
				</CollapsibleContent>
			</CollapsibleRoot>
		);
	},
);
