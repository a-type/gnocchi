import { ReactNode, Suspense } from 'react';
import * as classes from './ActionBar.css.js';
import classNames from 'classnames';

export interface ActionBarProps {
	children: ReactNode;
	className?: string;
	wrap?: boolean;
}

export function ActionBar({
	children,
	className,
	wrap,
	...rest
}: ActionBarProps) {
	return (
		<Suspense fallback={null}>
			<div className={classNames(classes.root, className)} {...rest}>
				<div className={classNames(classes.content, wrap && classes.wrap)}>
					{children}
				</div>
			</div>
		</Suspense>
	);
}
