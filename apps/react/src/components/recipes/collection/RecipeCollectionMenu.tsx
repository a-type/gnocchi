import PaprikaImporter from '@/components/import/PaprikaImporter.jsx';
import { TagManager } from '@/components/recipes/tags/TagManager.jsx';
import { Button } from '@a-type/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Suspense, lazy, useCallback, useState } from 'react';

export interface RecipeCollectionMenuProps {
	className?: string;
}

export function RecipeCollectionMenu({ className }: RecipeCollectionMenuProps) {
	const [open, setOpen] = useState(false);
	const onSubmenuClose = useCallback(() => setOpen(false), []);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button size="icon" color="ghost" className={className}>
					<DotsVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<Suspense>
					<DropdownMenuItem
						onSelect={(ev) => {
							ev.preventDefault();
						}}
						asChild
					>
						<PaprikaImporter onClose={onSubmenuClose}>
							Import from Paprika 3
						</PaprikaImporter>
					</DropdownMenuItem>
				</Suspense>
				<Suspense>
					<TagManager onClose={onSubmenuClose}>
						<DropdownMenuItem onSelect={(ev) => ev.preventDefault()}>
							Edit Tags
						</DropdownMenuItem>
					</TagManager>
				</Suspense>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
