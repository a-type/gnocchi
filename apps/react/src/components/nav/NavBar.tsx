import { useSizeCssVars } from '@/hooks/useSize.js';
import { ArchiveIcon, ListBulletIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { Link, useMatch } from 'react-router-dom';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '../primitives/Collapsible.jsx';
import * as classes from './NavBar.css.js';

export interface NavBarProps {}

export function NavBar({}: NavBarProps) {
	const matchGroceries = useMatch({
		path: '/',
		end: true,
	});
	const matchPurchased = useMatch({
		path: '/purchased',
	});

	if (!matchGroceries && !matchPurchased) {
		return null;
	}

	return (
		<div className={clsx(classes.root)}>
			<NavBarLink to="/" icon={<ListBulletIcon />}>
				Groceries
			</NavBarLink>
			<NavBarLink to="/purchased" icon={<ArchiveIcon />}>
				Purchased
			</NavBarLink>
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
				<CollapsibleContent
					data-horizontal
					css={{
						animationTimingFunction: 'linear',
						animationDuration: '150ms',
					}}
				>
					<span className={classes.buttonText} data-active={!!match}>
						{children}
					</span>
				</CollapsibleContent>
			</Link>
		</CollapsibleRoot>
	);
}
