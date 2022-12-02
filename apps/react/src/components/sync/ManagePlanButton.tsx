import React from 'react';
import { Button, ButtonProps } from '../primitives/index.js';

export function ManagePlanButton(props: ButtonProps) {
	return (
		<Button as="a" href="/plan" {...props}>
			Manage plan
		</Button>
	);
}
