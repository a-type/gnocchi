import { groceries } from '@/stores/groceries/index.js';
import { ReactNode, Suspense } from 'react';
import { CategoryManager } from '../groceries/categories/CategoryManager.js';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Button,
	DialogActions,
} from '@aglio/ui';
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
				<DialogActions>
					<Button color="ghost" onClick={resetToDefaults}>
						Reset to defaults
					</Button>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
