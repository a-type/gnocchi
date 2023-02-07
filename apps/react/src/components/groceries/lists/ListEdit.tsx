import { ColorPicker, ThemeName } from '@aglio/ui';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@aglio/ui';
import { Box } from '@aglio/ui';
import { LiveUpdateTextField } from '@aglio/ui';
import { Button, H2 } from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import { GearIcon } from '@radix-ui/react-icons';

export interface ListEditProps {
	listId: string;
}

export function ListEdit({ listId }: ListEditProps) {
	const list = hooks.useList(listId);

	if (!list) {
		return null;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button color="ghost" size="small">
					<GearIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Box gap={2} align="start">
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
					<DialogClose asChild>
						<Button color="primary">Done</Button>
					</DialogClose>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
