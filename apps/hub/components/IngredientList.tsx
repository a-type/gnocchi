import { ReactNode } from 'react';

export interface IngredientListProps {
	children?: ReactNode;
}

export function IngredientList({ children }: IngredientListProps) {
	return <ul className="pl-4 m-0">{children}</ul>;
}

export function IngredientListItem({ children }: IngredientListProps) {
	return (
		<li>
			<div className="flex flex-col items-start gap-2 mb-3">{children}</div>
		</li>
	);
}
