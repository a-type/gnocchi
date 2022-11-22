import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { Link, useMatch } from 'react-router-dom';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '../primitives/Collapsible.jsx';
import { CartIcon, FridgeIcon, RecipesIcon, Test } from './icons.jsx';
import * as classes from './NavBar.css.js';

export interface NavBarProps {}

const SHOW_RECIPES = false;

export function NavBar({}: NavBarProps) {
	const matchGroceries = useMatch({
		path: '/',
		end: true,
	});
	const matchPurchased = useMatch({
		path: '/purchased',
	});
	const matchRecipes = useMatch({
		path: '/recipes',
	});

	if (!matchGroceries && !matchPurchased && !matchRecipes) {
		return null;
	}

	return (
		<div className={clsx(classes.root)}>
			<NavBarLink to="/" icon={<CartIcon />}>
				Groceries
			</NavBarLink>
			<NavBarLink to="/purchased" icon={<FridgeIcon />}>
				Purchased
			</NavBarLink>
			{SHOW_RECIPES && (
				<NavBarLink to="/recipes" icon={<RecipesIcon />}>
					Recipes
				</NavBarLink>
			)}
		</div>
	);
}

function NavBarLink({
	to,
	children,
	icon,
}: {
	to: string;
	children: ReactNode;
	icon: ReactNode;
}) {
	const match = useMatch(to);

	return (
		<CollapsibleRoot open={!!match}>
			<Link to={to} className={classes.button}>
				{icon}
				<CollapsibleContent data-horizontal className={classes.collapsible}>
					<span className={classes.buttonText} data-active={!!match}>
						{children}
					</span>
				</CollapsibleContent>
			</Link>
		</CollapsibleRoot>
	);
}
