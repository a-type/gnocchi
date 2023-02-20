import { ReactNode } from 'react';
import classnames from 'classnames';
import * as classes from './Note.css.js';

export interface NoteProps {
	className?: string;
	children?: ReactNode;
}

export function Note({ className, children }: NoteProps) {
	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.inner}>
				{children}
				<div className={classes.edge}>
					<div className={classes.corner} />
				</div>
			</div>
		</div>
	);
}
