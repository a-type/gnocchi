import { groceries } from '@/stores/groceries/index.js';
import { ReactNode, Suspense } from 'react';
import { CategoryManager } from '../groceries/categories/CategoryManager.js';
import { Box } from '../primitives/box/Box.jsx';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../primitives/Dialog.js';
import { Button } from '../primitives/index.js';
import { menuState } from './state.js';

export function ManageCategoriesDialog({ children }: { children: ReactNode }) {
	const resetToDefaults = async () => {
		await groceries.resetCategoriesToDefault();
	};
	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					menuState.open = false;
				}
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogTitle>Categories</DialogTitle>
				<Suspense fallback={null}>
					<CategoryManager />
				</Suspense>
				<Box
					flexDirection="row"
					justify="space-between"
					align="center"
					gap={3}
					pt={3}
				>
					<Button color="ghost" onClick={resetToDefaults}>
						Reset to defaults
					</Button>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
