import { groceries, hooks } from '@/stores/groceries/index.js';
import { CheckboxIcon, ResetIcon, TrashIcon } from '@radix-ui/react-icons';
import { ReactNode, Suspense } from 'react';
import * as classes from './ActionBar.css.js';
import { ActionButton } from './ActionButton.jsx';

export interface ActionBarProps {
	children: ReactNode;
}

export function ActionBar({ children }: ActionBarProps) {
	return (
		<Suspense fallback={null}>
			<div className={classes.root}>
				<div className={classes.content}>{children}</div>
			</div>
		</Suspense>
	);
}
