import { Button, ButtonProps } from '@/components/primitives/primitives.jsx';
import { clsx } from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import * as classes from './ActionButton.css.js';

export interface ActionButtonProps extends ButtonProps {
	icon?: ReactNode;
}

export function ActionButton({
	icon,
	children,
	className,
	...rest
}: ActionButtonProps) {
	return (
		<Button size="small" className={clsx(classes.root, className)} {...rest}>
			{icon}&nbsp;{children}
		</Button>
	);
}
