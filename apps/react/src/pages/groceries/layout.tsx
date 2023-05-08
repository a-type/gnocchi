import { ReactNode, Suspense, useEffect } from 'react';
import * as classes from './layout.css.js';
import { PageFixedArea, PageRoot } from '@aglio/ui/components/layouts';
import { GroceriesActionBar } from '@/components/groceries/actions/GroceriesActionBar.jsx';
import { GroceryListAdd } from '@/components/groceries/addBar/GroceryListAdd.jsx';
import GroceryList from '@/components/groceries/GroceryList.jsx';
import { useListThemeClass } from '@/components/groceries/lists/hooks.js';
import { hooks } from '@/stores/groceries/index.js';
import { useNavigate } from '@verdant-web/react-router';

export const TopControls = ({
	children,
	...props
}: {
	children: ReactNode;
}) => (
	<div className={classes.topControlsRoot} {...props}>
		{children}
	</div>
);

export const ListSelectWrapper = ({
	children,
	...props
}: {
	children: ReactNode;
}) => (
	<div className={classes.listSelectRoot} {...props}>
		<Suspense fallback={<div className={classes.listSelectFallback} />}>
			{children}
		</Suspense>
	</div>
);

export const AddBar = () => (
	<PageFixedArea className={classes.addBarRoot}>
		<Suspense fallback={<div className={classes.addBarFallback} />}>
			<GroceryListAdd />
		</Suspense>
		<GroceriesActionBar />
	</PageFixedArea>
);

export const List = () => (
	<>
		<Suspense>
			<GroceryList />
		</Suspense>
	</>
);

export function ThemedPageRoot({
	children,
	listId,
}: {
	children: ReactNode;
	listId: string | null | undefined;
}) {
	return (
		<Suspense fallback={<PageRoot>{children}</PageRoot>}>
			<ThemedPageRootInner listId={listId}>{children}</ThemedPageRootInner>
		</Suspense>
	);
}

function ThemedPageRootInner({
	children,
	listId,
}: {
	children: ReactNode;
	listId: string | null | undefined;
}) {
	const theme = useListThemeClass(listId);

	return (
		<Suspense fallback={children}>
			<PageRoot className={theme}>{children}</PageRoot>
		</Suspense>
	);
}

function UnknownListRedirectInner({ listId }: { listId: string }) {
	const list = hooks.useList(listId);
	const navigate = useNavigate();

	useEffect(() => {
		if (!list) {
			navigate('/');
		}
	}, [list, navigate]);

	return null;
}

export function UnknownListRedirect({ listId }: { listId?: string | null }) {
	if (!listId) return null;
	return (
		<Suspense>
			<UnknownListRedirectInner listId={listId} />
		</Suspense>
	);
}
