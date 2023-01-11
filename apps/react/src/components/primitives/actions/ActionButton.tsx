import { Button, ButtonProps } from '@/components/primitives/index.js';
import { clsx } from 'clsx';
import { forwardRef, ReactNode, useEffect, useState } from 'react';
import * as classes from './ActionButton.css.js';

export interface ActionButtonProps extends ButtonProps {
	icon?: ReactNode;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
	function ActionButton({ icon, children, className, ...rest }, ref) {
		return (
			<Button
				ref={ref}
				size="small"
				className={clsx(classes.root, className)}
				{...rest}
			>
				{icon}&nbsp;{children}
			</Button>
		);
	},
);
