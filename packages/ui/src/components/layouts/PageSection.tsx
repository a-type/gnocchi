import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import * as classes from './PageSection.css.js';
import { withClassName } from '../../styles/withClassName.js';

export function PageSection({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={classNames(classes.section, className)} />;
}

export const PageSectionGrid = withClassName('div', classes.sectionGrid);
