import { ReactNode, Suspense } from 'react';
import * as classes from './ActionBar.css.js';

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
