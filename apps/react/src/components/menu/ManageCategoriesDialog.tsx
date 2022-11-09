import { groceries } from '@/stores/groceries/index.js';
import React, { ReactNode } from 'react';
import { CategoryManager } from '../groceries/categories/CategoryManager.js';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../primitives/Dialog.js';
import { Box, Button } from '../primitives/primitives.js';

export function ManageCategoriesDialog({ children }: { children: ReactNode }) {
	const resetToDefaults = async () => {
		await groceries.resetCategoriesToDefault();
	};
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogTitle>Categories</DialogTitle>
				<CategoryManager />
				<Box
					direction="row"
					justify="spaceBetween"
					align="center"
					gap={3}
					css={{ pt: '$3' }}
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
