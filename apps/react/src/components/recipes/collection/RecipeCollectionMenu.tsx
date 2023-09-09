import PaprikaImporter from '@/components/import/PaprikaImporter.jsx';
import { TagManager } from '@/components/recipes/tags/TagManager.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { Button } from '@aglio/ui/src/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@aglio/ui/src/components/dropdownMenu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Suspense, lazy, useCallback, useState } from 'react';

export interface RecipeCollectionMenuProps {
	className?: string;
}

export function RecipeCollectionMenu({ className }: RecipeCollectionMenuProps) {
	const [open, setOpen] = useState(false);
	const paprika = useFeatureFlag('paprikaImport');
	const onSubmenuClose = useCallback(() => setOpen(false), []);

	if (!paprika) return null;

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button size="icon" color="ghost" className={className}>
					<DotsVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
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
				<TagManager onClose={onSubmenuClose}>
					<DropdownMenuItem onSelect={(ev) => ev.preventDefault()}>
						Edit Tags
					</DropdownMenuItem>
				</TagManager>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
