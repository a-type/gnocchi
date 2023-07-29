import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ActionBar } from '@aglio/ui/components/actions';
import { Button } from '@aglio/ui/components/button';
import { ColorPicker, ThemeName } from '@aglio/ui/components/colorPicker';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { Divider } from '@aglio/ui/components/divider';
import { TrashIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { ReactNode } from 'react';

export function TagManager({
	children,
	onClose,
}: {
	children: ReactNode;
	onClose?: () => void;
}) {
	const tags = hooks.useAllRecipeTagMetadata();

	const client = hooks.useClient();
	const deleteTag = (tagName: string) => {
		client.recipeTagMetadata.delete(tagName);
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) onClose?.();
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<ActionBar>
					<UndoAction />
				</ActionBar>
				<div className="flex flex-col gap-2">
					{tags.map((tag) => (
						<>
							<div
								key={tag.get('name')}
								className={classNames('flex flex-row gap-2 items-center')}
							>
								<ColorPicker
									onChange={(color) => tag.set('color', color)}
									value={tag.get('color') as ThemeName}
								/>
								<div className="flex-1 text-md">{tag.get('name')}</div>
								<Button
									size="icon"
									color="ghostDestructive"
									onClick={() => deleteTag(tag.get('name'))}
								>
									<TrashIcon />
								</Button>
							</div>
							<Divider />
						</>
					))}
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
