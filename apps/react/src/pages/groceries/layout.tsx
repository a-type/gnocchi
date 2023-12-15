import { ReactNode, Suspense, useEffect } from 'react';
import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@a-type/ui/components/layouts';
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
	<div
		className="w-full flex flex-row justify-between items-center gap-2 p-2 mt-1"
		{...props}
	>
		{children}
	</div>
);

export const ListSelectWrapper = ({
	children,
	...props
}: {
	children: ReactNode;
}) => (
	<div className="flex flex-row items-center gap-2 pl-1" {...props}>
		<Suspense fallback={<div className="h-28px w-full" />}>{children}</Suspense>
	</div>
);

export const AddBar = () => (
	<PageFixedArea className="flex flex-col gap-2 px-3 py-2">
		<Suspense fallback={<div className="w-full h-41px" />}>
			<GroceryListAdd />
		</Suspense>
		<GroceriesActionBar />
	</PageFixedArea>
);

export const List = () => (
	<>
		{/* <Suspense> */}
		<GroceryList />
		{/* </Suspense> */}
	</>
);

export function ThemedPageContent({
	children,
	listId,
}: {
	children: ReactNode;
	listId: string | null | undefined;
}) {
	return (
		<Suspense fallback={<PageRoot>{children}</PageRoot>}>
			<ThemedPageContentInner listId={listId}>
				{children}
			</ThemedPageContentInner>
		</Suspense>
	);
}

function ThemedPageContentInner({
	children,
	listId,
}: {
	children: ReactNode;
	listId: string | null | undefined;
}) {
	const theme = useListThemeClass(listId);

	return (
		<Suspense fallback={children}>
			<PageContent fullHeight noPadding className={theme}>
				{children}
			</PageContent>
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
