import { hooks } from '@/stores/groceries/index.js';
import { Form, randomTheme, SubmitButton, TextField } from '@aglio/ui';
import { Formik } from 'formik';
import * as classes from './NewTagForm.css.js';

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
						color: randomTheme(),
					});
					// create the metadata
					onCreate(name);
				} finally {
					bag.setSubmitting(false);
				}
			}}
		>
			<Form className={classes.form}>
				<TextField
					name="name"
					placeholder="tag name"
					className={classes.input}
					autoComplete="off"
				/>
				<SubmitButton>Create</SubmitButton>
			</Form>
		</Formik>
	);
}
