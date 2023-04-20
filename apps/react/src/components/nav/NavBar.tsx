import { Link } from '@/components/nav/Link.jsx';
import { ProductHunt } from '@/components/promotional/ProductHunt.jsx';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { PageNav } from '@aglio/ui/components/layouts';
import { useMatch } from '@lo-fi/react-router';
import { clsx } from 'clsx';
import { ReactNode, Suspense, forwardRef, memo, useCallback } from 'react';
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
				<SettingsNavBarLink active={matchSettings} />
			</Suspense>
			<ProductHunt className={classes.productHunt} />
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
		<OnboardingTooltip
			content={
				<div>Add your favorite recipes to always have them on hand.</div>
			}
			onboarding={firstTimeOnboarding}
			step="recipes"
		>
			<NavBarLink
				to="/recipes"
				icon={<Icon name="book" className={classes.icon} />}
				active={active}
				onHover={preload}
			>
				Recipes
			</NavBarLink>
		</OnboardingTooltip>
	);
}

function PantryNavBarLink({ active }: { active: boolean }) {
	const { purchasedHidingItems } = useSnapshot(groceriesState);
	const recent = !!purchasedHidingItems.size;

	const [newExpiredTime, onSeen] = useHasNewExpirations();

	return (
		<OnboardingTooltip
			content={<div>When you purchase items, they'll show up here.</div>}
			onboarding={firstTimeOnboarding}
			step="pantry"
		>
			<NavBarLink
				to="/purchased"
				icon={<Icon name="fridge" className={classes.icon} />}
				animate={recent}
				active={active}
				onClick={onSeen}
			>
				<span>Purchased</span>
				{newExpiredTime && <div className={classes.pip} />}
			</NavBarLink>
		</OnboardingTooltip>
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
				icon={<Icon name="cart" className={classes.icon} />}
				active={active}
				animate={addedRecipe}
			>
				Groceries
			</NavBarLink>
		</OnboardingTooltip>
	);
}

function SettingsNavBarLink({ active }: { active: boolean }) {
	return (
		<OnboardingTooltip
			content={
				<div>Tap here to manage categories and upgrade your experience</div>
			}
			onboarding={firstTimeOnboarding}
			step="settings"
		>
			<NavBarLink
				to="/settings"
				icon={<Icon name="profile" className={classes.icon} />}
				active={active}
			>
				Settings
			</NavBarLink>
		</OnboardingTooltip>
	);
}
