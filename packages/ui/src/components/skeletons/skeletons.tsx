import { useState } from 'react';
import classNames from 'classnames';
import * as classes from './skeletons.css.js';

export const TextSkeleton = ({
	maxLength,
	className,
}: {
	maxLength: number;
	className?: string;
}) => {
	const [length] = useState(() =>
		Math.round(Math.random() * (maxLength - 5) + 5),
	);

	return (
		<span
			className={classNames(classes.blob, className)}
			style={{
				width: `${length}ch`,
				height: '1.2em',
			}}
		/>
	);
};
