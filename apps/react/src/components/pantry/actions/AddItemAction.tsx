import { hooks } from '@/stores/groceries/index.js';
import { preventDefault } from '@aglio/tools';
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
			<DialogContent onOpenAutoFocus={preventDefault}>
				<FormikForm
					initialValues={{ name: '' }}
					onSubmit={async (values, bag) => {
						await addItems([values.name], { purchased: true });
						bag.resetForm();
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
