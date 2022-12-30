import { useIsLoggedIn } from '@/contexts/AuthContext.jsx';
import { trpc } from '@/trpc.js';
import { clsx } from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../groceries/state.js';
import { PageNav } from '../layouts/index.jsx';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '../primitives/Collapsible.jsx';
import { Tooltip } from '../primitives/index.js';
import { CartIcon, FridgeIcon, RecipesIcon } from './icons.jsx';
import * as classes from './NavBar.css.js';
import { PopEffect } from './PopEffect.jsx';

export interface NavBarProps {}

export function NavBar({}: NavBarProps) {
	const loggedIn = useIsLoggedIn();

	const matchDefaultList = !!useMatch({
		path: '/',
		end: true,
	});
	const matchesWelcome = !!useMatch({
		path: '/welcome',
		end: false,
	});
	const matchList = !!useMatch({
		path: '/list',
		end: false,
	});
	const matchGroceries = matchDefaultList || matchList;
	const matchPurchased = !!useMatch({
		path: '/purchased',
	});
	const matchRecipes = !!useMatch({
		path: '/recipes',
		end: false,
	});

	const { data: showRecipesOverride } =
		trpc.featureFlags.getValue.useQuery('recipes');

	const finalShowRecipes = showRecipesOverride;

	if (matchesWelcome) {
		return null;
	}

	return (
		<PageNav className={clsx(classes.root)}>
			<img src="/android-chrome-192x192.png" className={classes.logo} />
			<GroceriesNavBarLink active={matchGroceries} />
			<PantryNavBarLink active={matchPurchased} />
			{finalShowRecipes && (
				<NavBarLink to="/recipes" icon={<RecipesIcon />} active={matchRecipes}>
					Recipes
				</NavBarLink>
			)}
		</PageNav>
	);
}

function NavBarLink({
	to,
	children,
	icon,
	animate,
	active,
}: {
	to: string;
	children: ReactNode;
	icon: ReactNode;
	animate?: boolean;
	active: boolean;
}) {
	return (
		<Link
			to={to}
			className={clsx(classes.button, {
				[classes.buttonActive]: active,
			})}
		>
			<div className={classes.iconContainer}>
				<PopEffect active={animate} />
				{icon}
			</div>
			<span className={classes.buttonText} data-active={!!active}>
				{children}
			</span>
		</Link>
	);
}

function PantryNavBarLink({ active }: { active: boolean }) {
	const recent = useSnapshot(groceriesState.recentlyPurchasedItems).size;

	return (
		<NavBarLink
			to="/purchased"
			icon={<FridgeIcon />}
			animate={recent > 0}
			active={active}
		>
			Purchased
		</NavBarLink>
	);
}

function GroceriesNavBarLink({ active }: { active: boolean }) {
	const addedRecipe = useSnapshot(groceriesState).justAddedRecipe;

	return (
		<NavBarLink
			to="/"
			icon={<CartIcon />}
			active={active}
			animate={addedRecipe}
		>
			Groceries
		</NavBarLink>
	);
}
