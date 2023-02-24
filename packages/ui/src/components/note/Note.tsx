import { HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';
import * as classes from './Note.css.js';

export interface NoteProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

export function Note({ className, children, ...rest }: NoteProps) {
	return (
		<div className={classnames(classes.root, className)} {...rest}>
			<div className={classes.inner}>
				{children}
				<div className={classes.edge}>
					<div className={classes.corner} />
				</div>
			</div>
		</div>
	);
}
