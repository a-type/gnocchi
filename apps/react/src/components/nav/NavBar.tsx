import { Link } from '@/components/nav/Link.jsx';
import { ProductHunt } from '@/components/promotional/ProductHunt.jsx';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { PageNav } from '@aglio/ui/components/layouts';
import { useMatch } from '@verdant-web/react-router';
import classNames from 'classnames';
import {
	ReactNode,
	Suspense,
	forwardRef,
	memo,
	useCallback,
	useEffect,
} from 'react';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../groceries/state.js';
import { Icon } from '../icons/Icon.jsx';
import { OnboardingTooltip } from '../onboarding/OnboardingTooltip.jsx';
import { useHasNewExpirations } from '../pantry/hooks.js';
import { PopEffect } from './PopEffect.jsx';
import { withClassName } from '@aglio/ui/styles';

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
		<PageNav
			innerClassName={classNames(
				'flex flex-row items-stretch justify-around w-full rounded-0 shadow-lg overflow-hidden z-50 bg-light border-t border-t-solid border-gray5 p-1 h-auto',
				'pb-[calc(2px+env(safe-area-inset-bottom,0px))]',
				'sm:(bg-transparent flex flex-col rounded-0 border-none border-transparent shadow-none h-min-content overflow-y-auto overflow-x-hidden justify-start items-stretch gap-2 pb-10)',
			)}
		>
			<Suspense>
				<div className="display-none sm:(flex flex-row gap-1 items-center justify-center px-2 py-4)">
					<img src="/android-chrome-192x192.png" className="w-40px h-40px" />
					<h1 className="text-md font-title font-medium">Gnocchi</h1>
				</div>
				<GroceriesNavBarLink active={matchGroceries} />
				<PantryNavBarLink active={matchPurchased} />
				<RecipesNavBarLink active={matchRecipes} />
				<SettingsNavBarLink active={matchSettings} />
			</Suspense>
			<ProductHunt className="display-none md:(display-block w-160px)" />
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
				className={classNames(
					'flex flex-col items-center justify-center whitespace-nowrap py-1 px-3 bg-transparent rounded-md border-none cursor-pointer text-sm transition-colors h-full gap-6px relative',
					'sm:(flex-row-reverse h-auto justify-start gap-2 overflow-visible)',
					'hover:bg-primaryWash',
					'focus-visible:(outline-none bg-primaryWash)',
					'active:bg-primaryWash',
					{
						'important:(color-black bg-primaryWash)': active,
						active: active,
					},
				)}
				data-active={active}
				onClick={handleClick}
				onMouseOver={onHover}
				ref={ref}
			>
				<div className="relative flex sm:(p-6px rounded-full bg-lightBlend)">
					<PopEffect active={animate} />
					{icon}
				</div>
				<span
					className="overflow-hidden pl-1 inline-block text-xxs whitespace-nowrap text-ellipsis sm:text-md"
					data-active={!!active}
				>
					{children}
				</span>
			</Link>
		);
	}),
);

const NavIcon = withClassName(
	Icon,
	'relative z-1 [button.active>&]:fill-primaryLight',
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
				icon={<NavIcon name="book" />}
				active={active}
				onHover={preload}
			>
				Recipes
			</NavBarLink>
		</OnboardingTooltip>
	);
}

const Pip = withClassName(
	'div',
	'absolute top-6px right-6px w-6px h-6px rounded-full bg-attention shadow-sm',
);

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
				icon={<NavIcon name="fridge" />}
				animate={recent}
				active={active}
				onClick={onSeen}
			>
				<span>Purchased</span>
				{newExpiredTime && <Pip />}
			</NavBarLink>
		</OnboardingTooltip>
	);
}

function GroceriesNavBarLink({ active }: { active: boolean }) {
	const justAddedSomething = useSnapshot(groceriesState).justAddedSomething;

	useEffect(() => {
		if (justAddedSomething) {
			navigator.vibrate?.([50, 50, 50]);

			const timeout = setTimeout(() => {
				groceriesState.justAddedSomething = false;
			}, 1500);
			return () => clearTimeout(timeout);
		}
	}, [justAddedSomething]);

	return (
		<OnboardingTooltip
			content={<div>You'll find your groceries here.</div>}
			onboarding={saveHubRecipeOnboarding}
			step="viewList"
		>
			<NavBarLink
				to="/"
				icon={<NavIcon name="cart" />}
				active={active}
				animate={justAddedSomething}
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
				icon={<NavIcon name="profile" />}
				active={active}
			>
				<span>Settings</span>
			</NavBarLink>
		</OnboardingTooltip>
	);
}
