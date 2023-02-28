import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	P,
} from '@aglio/ui';
import { ReactNode, useState } from 'react';

export function ResetToServer({ children }: { children?: ReactNode }) {
	const [show, setShow] = useState(false);
	const client = hooks.useClient();

	return (
		<Dialog open={show} onOpenChange={setShow}>
			<DialogTrigger asChild>
				{children || <Button color="destructive">Reset local data</Button>}
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Are you sure?</DialogTitle>
				<P>This will reset your local data to the server's version.</P>
				<P>
					Since you're already online and synced, you shouldn't lose anything,
					and it might fix any weirdness you happen to be experiencing.
				</P>
				<P>Are you sure you want to do this?</P>
				<DialogActions>
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<Button
						color="destructive"
						onClick={() => {
							client.__dangerous__resetLocal();
						}}
					>
						Reset
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
