import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { PageNav } from '@aglio/ui';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import { ReactNode, Suspense, forwardRef, memo, useCallback } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../groceries/state.js';
import { Icon } from '../icons/Icon.jsx';
import { OnboardingTooltip } from '../onboarding/OnboardingTooltip.jsx';
import { useHasNewExpirations } from '../pantry/hooks.js';
import * as classes from './NavBar.css.js';
import { PopEffect } from './PopEffect.jsx';

export interface NavBarProps {}

export function NavBar({}: NavBarProps) {
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
	const matchSettings = !!useMatch({
		path: '/settings',
		end: false,
	});

	if (matchesWelcome) {
		return null;
	}

	return (
		<PageNav innerClassName={clsx(classes.root)}>
			<Suspense>
				<div className={classes.logo}>
					<img
						src="/android-chrome-192x192.png"
						className={classes.logoImage}
					/>
					<h1 className={classes.logoText}>Gnocchi</h1>
				</div>
				<GroceriesNavBarLink active={matchGroceries} />
				<PantryNavBarLink active={matchPurchased} />
				<RecipesNavBarLink active={matchRecipes} />
				<NavBarLink
					to="/settings"
					icon={<HamburgerMenuIcon />}
					active={matchSettings}
				>
					Settings
				</NavBarLink>
			</Suspense>
		</PageNav>
	);
}

const NavBarLink = memo(
	forwardRef<
		HTMLAnchorElement,
		{
			to: string;
			children: ReactNode;
			icon: ReactNode;
			animate?: boolean;
			active: boolean;
			onClick?: () => void;
			onHover?: () => void;
		}
	>(function NavBarLink(
		{ to, children, icon, animate, active, onClick, onHover },
		ref,
	) {
		// reset undo history when navigating
		const client = hooks.useClient();
		const handleClick = useCallback(() => {
			client.undoHistory.clear();
			onClick?.();
		}, [client]);

		return (
			<Link
				to={to}
				className={clsx(classes.button, {
					[classes.buttonActive]: active,
				})}
				onClick={handleClick}
				onMouseOver={onHover}
				ref={ref}
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
	}),
);

function RecipesNavBarLink({ active }: { active: boolean }) {
	const client = hooks.useClient();
	const preload = useCallback(() => {
		// fire off the query to preload it
		client.recipes.findAll();
	}, []);

	return (
		<NavBarLink
			to="/recipes"
			icon={<Icon name="book" />}
			active={active}
			onHover={preload}
		>
			Recipes
		</NavBarLink>
	);
}

function PantryNavBarLink({ active }: { active: boolean }) {
	const { purchasedHidingItems } = useSnapshot(groceriesState);
	const recent = !!purchasedHidingItems.size;

	const [newExpiredTime, onSeen] = useHasNewExpirations();

	return (
		<NavBarLink
			to="/purchased"
			icon={<Icon name="fridge" />}
			animate={recent}
			active={active}
			onClick={onSeen}
		>
			<span>Purchased</span>
			{newExpiredTime && <div className={classes.pip} />}
		</NavBarLink>
	);
}

function GroceriesNavBarLink({ active }: { active: boolean }) {
	const addedRecipe = useSnapshot(groceriesState).justAddedRecipe;

	return (
		<OnboardingTooltip
			content={<div>You'll find your groceries here.</div>}
			onboarding={saveHubRecipeOnboarding}
			step="viewList"
		>
			<NavBarLink
				to="/"
				icon={<Icon name="cart" />}
				active={active}
				animate={addedRecipe}
			>
				Groceries
			</NavBarLink>
		</OnboardingTooltip>
	);
}
