import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ActionBar } from '@a-type/ui/components/actions';
import { Button } from '@a-type/ui/components/button';
import { ColorPicker, ThemeName } from '@a-type/ui/components/colorPicker';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import { Divider } from '@a-type/ui/components/divider';
import { Form, FormikForm, TextField } from '@a-type/ui/components/forms';
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
	const tags = hooks.useAllRecipeTagMetadata().sort((a, b) => {
		return a.get('name').localeCompare(b.get('name'));
	});

	const client = hooks.useClient();
	const deleteTag = (tagName: string) => {
		client.recipeTagMetadata.delete(tagName);
	};
	const createTag = (tagName: string) => {
		client.recipeTagMetadata.put({
			name: tagName,
		});
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
				<div className="flex flex-col gap-2 overflow-y-auto min-h-0 flex-1">
					{tags.map((tag) => (
						<>
							<div
								key={tag.get('name')}
								className={classNames(
									'flex flex-row gap-2 items-center flex-shrink-0',
								)}
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
							<Divider className="opacity-50" />
						</>
					))}
				</div>
				<div className="mt-4">
					<FormikForm
						initialValues={{ tagName: '' }}
						onSubmit={(values) => {
							createTag(values.tagName);
						}}
						className="flex flex-row gap-2 items-end"
					>
						<TextField
							className="flex-1 min-w-64px"
							name="tagName"
							label="New Tag Name"
						/>
						<Button type="submit" color="primary">
							Create
						</Button>
					</FormikForm>
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
