import { ReactNode, Suspense } from 'react';
import * as classes from './ActionBar.css.js';
import classNames from 'classnames';

export interface ActionBarProps {
	children: ReactNode;
	className?: string;
}

export function ActionBar({ children, className, ...rest }: ActionBarProps) {
	return (
		<Suspense fallback={null}>
			<div className={classNames(classes.root, className)} {...rest}>
				<div className={classes.content}>{children}</div>
			</div>
		</Suspense>
	);
}
