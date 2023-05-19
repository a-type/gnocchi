import { hooks } from '@/stores/groceries/index.js';
import { Formik } from 'formik';
import { Form, SubmitButton, TextField } from '@aglio/ui/components/forms';

export interface NewTagFormProps {
	onCreate: (tag: string) => void;
}

export function NewTagForm({ onCreate }: NewTagFormProps) {
	const client = hooks.useClient();

	return (
		<Formik
			initialValues={{ name: '' }}
			onSubmit={async (values, bag) => {
				try {
					const name = values.name.toLocaleLowerCase();
					await client.recipeTagMetadata.put({
						name,
						color: ['lemon', 'blueberry', 'tomato', 'eggplant', 'leek'][
							Math.floor(Math.random() * 5)
						],
					});
					// create the metadata
					onCreate(name);
				} finally {
					bag.setSubmitting(false);
				}
			}}
		>
			<Form className="flex items-center gap-2 important:flex-row max-w-full">
				<TextField
					name="name"
					placeholder="tag name"
					className="flex-1-0-0 min-w-60px max-w-40vw"
					autoComplete="off"
				/>
				<SubmitButton>Create</SubmitButton>
			</Form>
		</Formik>
	);
}
