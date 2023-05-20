import { hooks } from '@/stores/groceries/index.js';
import { ActionButton } from '@aglio/ui/src/components/actions';
import { Button } from '@aglio/ui/src/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/src/components/dialog';
import {
	FormikForm,
	SubmitButton,
	TextField,
} from '@aglio/ui/src/components/forms';
import { PlusIcon } from '@radix-ui/react-icons';

export function AddItemAction() {
	const addItems = hooks.useAddItems();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<ActionButton icon={<PlusIcon />}>Add items</ActionButton>
			</DialogTrigger>
			<DialogContent>
				<FormikForm
					initialValues={{ name: '' }}
					onSubmit={async (values) => {
						await addItems([values.name], { purchased: true });
					}}
				>
					<TextField name="name" label="Name" placeholder="garlic" />
					<DialogActions>
						<DialogClose asChild>
							<Button>Done</Button>
						</DialogClose>
						<SubmitButton>Add</SubmitButton>
					</DialogActions>
				</FormikForm>
			</DialogContent>
		</Dialog>
	);
}
