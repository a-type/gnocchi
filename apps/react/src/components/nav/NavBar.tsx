import { useIsLoggedIn } from '@/contexts/AuthContext.jsx';
import { trpc } from '@/trpc.js';
import { clsx } from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../groceries/state.js';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '../primitives/Collapsible.jsx';
import { Tooltip } from '../primitives/Tooltip.jsx';
import { CartIcon, FridgeIcon, RecipesIcon } from './icons.jsx';
import * as classes from './NavBar.css.js';

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
	});

	const { data: showRecipesOverride } =
		trpc.featureFlags.getValue.useQuery('recipes');

	const finalShowRecipes = showRecipesOverride;

	if (!loggedIn || matchesWelcome) {
		return null;
	}

	return (
		<div className={clsx(classes.root)}>
			<NavBarLink to="/" icon={<CartIcon />} active={matchGroceries}>
				Groceries
			</NavBarLink>
			<PantryNavBarLink active={matchPurchased} />
			{finalShowRecipes && (
				<NavBarLink to="/recipes" icon={<RecipesIcon />} active={matchRecipes}>
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
	active,
}: {
	to: string;
	children: ReactNode;
	icon: ReactNode;
	shake?: boolean;
	active: boolean;
}) {
	return (
		<Tooltip content={children}>
			<CollapsibleRoot open={!!active}>
				<Link to={to} className={classes.button} data-shake={shake}>
					{icon}
					<CollapsibleContent data-horizontal className={classes.collapsible}>
						<span className={classes.buttonText} data-active={!!active}>
							{children}
						</span>
					</CollapsibleContent>
				</Link>
			</CollapsibleRoot>
		</Tooltip>
	);
}

function PantryNavBarLink({ active }: { active: boolean }) {
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
		<NavBarLink
			to="/purchased"
			icon={<FridgeIcon />}
			shake={shake}
			active={active}
		>
			Purchased
		</NavBarLink>
	);
}
