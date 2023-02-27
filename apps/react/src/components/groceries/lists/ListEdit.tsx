import { ColorPicker, DialogActions, ThemeName, useToggle } from '@aglio/ui';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@aglio/ui';
import { Box } from '@aglio/ui';
import { LiveUpdateTextField } from '@aglio/ui';
import { Button, H2 } from '@aglio/ui';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { GearIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export interface ListEditProps {
	listId: string;
}

export function ListEdit({ listId }: ListEditProps) {
	const list = hooks.useList(listId);
	hooks.useWatch(list);

	const [open, setOpen] = useState(false);

	if (!list) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button color="ghost" size="small">
					<GearIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Box gap={2} align="flex-start">
					<H2>Edit List</H2>
					<Box flexDirection="row" gap={2}>
						<LiveUpdateTextField
							value={list.get('name')}
							onChange={(name) => list.set('name', name)}
							required
						/>
						<ColorPicker
							value={list.get('color') as ThemeName}
							onChange={(color) => list.set('color', color)}
						/>
					</Box>
					<Button
						color="destructive"
						onClick={async () => {
							await groceries.deleteList(list.get('id'));
							setOpen(false);
						}}
					>
						Delete List
					</Button>
					<DialogActions>
						<DialogClose asChild>
							<Button color="primary">Done</Button>
						</DialogClose>
					</DialogActions>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
