import React from 'react';
import { Button, ButtonProps } from '../primitives/primitives.js';

export interface BugButtonProps extends ButtonProps {}

export function BugButton(props: BugButtonProps) {
	return (
		<Button
			as="a"
			size="small"
			color="default"
			href="mailto:gaforres@gmail.com"
			target="_blank"
			rel="noopener noreferrer"
			{...props}
		>
			Report a bug
		</Button>
	);
}
