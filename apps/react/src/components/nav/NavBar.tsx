import { clsx } from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../groceries/state.js';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '../primitives/Collapsible.jsx';
import { CartIcon, FridgeIcon, RecipesIcon } from './icons.jsx';
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
			<PantryNavBarLink />
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
	shake,
}: {
	to: string;
	children: ReactNode;
	icon: ReactNode;
	shake?: boolean;
}) {
	const match = useMatch(to);

	return (
		<CollapsibleRoot open={!!match}>
			<Link to={to} className={classes.button} data-shake={shake}>
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

function PantryNavBarLink() {
	const recent = useSnapshot(groceriesState.recentlyPurchasedItems).size;
	const [shake, setShake] = useState(recent > 0);
	useEffect(() => {
		if (recent > 0) {
			setShake(true);
			const timeout = setTimeout(() => {
				setShake(false);
			}, 4000);
			return () => clearTimeout(timeout);
		} else {
			setShake(false);
		}
	}, [recent]);

	return (
		<NavBarLink to="/purchased" icon={<FridgeIcon />} shake={shake}>
			Purchased
		</NavBarLink>
	);
}
