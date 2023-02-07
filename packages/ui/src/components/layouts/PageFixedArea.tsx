import { HTMLAttributes } from 'react';
import classnames from 'classnames';
import * as classes from './PageFixedArea.css.js';

export function PageFixedArea({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div {...props} className={classnames(classes.fixedArea, className)} />
	);
}
