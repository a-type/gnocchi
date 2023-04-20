import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import * as classes from './PageFixedArea.css.js';

export function PageFixedArea({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div {...props} className={classNames(classes.fixedArea, className)} />
	);
}
