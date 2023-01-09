import React from 'react';
import { Button, ButtonProps } from '../primitives/index.js';

export interface BugButtonProps extends ButtonProps {}

export function BugButton(props: BugButtonProps) {
	return (
		<a href="mailto:hi@gnocchi.club" target="_blank" rel="noopener noreferrer">
			<Button size="small" color="default" {...props}>
				Report a bug
			</Button>
		</a>
	);
}
