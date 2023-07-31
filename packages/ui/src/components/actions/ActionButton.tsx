'use client';

import classNames from 'classnames';
import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react';
import { Button, ButtonProps } from '../button/Button.js';
import { CollapsibleContent, CollapsibleRoot } from '../collapsible.js';

export interface ActionButtonProps extends ButtonProps {
	icon?: ReactNode;
	/**
	 * Controls whether the action button is collapsed
	 */
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
				<CollapsibleContent data-horizontal>
					<Button
						ref={ref}
						size="small"
						className={classNames(
							'font-normal whitespace-nowrap my-2 mx-2 flex flex-row gap-2 items-center h-30px rounded-15px mx-1',
							// 'important:focus-visible:shadow-[0_0_0_3px_var(--color-gray-4)]',
							rest.color === 'default' && 'border-gray-7 hover:bg-gray2',
							// make the focus shadow smaller
							'important:focus-visible:shadow-[0_0_0_2px_var(--focus,var(--hover))]',
							className,
						)}
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
