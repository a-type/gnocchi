import { recipeTagEditorState } from '@/components/recipes/tags/recipeTagEditorState.js';
import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuRoot,
	ContextMenuTrigger,
} from '@a-type/ui/components/contextMenu';
import { ReactNode } from 'react';

export interface RecipeTagMenuWrapperProps {
	tagName: string;
	children: ReactNode;
}

export function RecipeTagMenuWrapper({
	tagName,
	children,
}: RecipeTagMenuWrapperProps) {
	return (
		<ContextMenuRoot>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => (recipeTagEditorState.editingTag = tagName)}
				>
					Edit
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenuRoot>
	);
}
