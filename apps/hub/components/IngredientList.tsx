import { ReactNode } from 'react';
import * as classes from './IngredientList.css.js';

export interface IngredientListProps {
	children?: ReactNode;
}

export function IngredientList({ children }: IngredientListProps) {
	return <ul className={classes.list}>{children}</ul>;
}

export function IngredientListItem({ children }: IngredientListProps) {
	return (
		<li>
			<div className={classes.item}>{children}</div>
		</li>
	);
}
