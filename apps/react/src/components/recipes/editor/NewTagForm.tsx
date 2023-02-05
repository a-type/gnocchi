import {
	Form,
	SubmitButton,
	TextField,
} from '@/components/primitives/forms.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { randomTheme } from '@/styles/themes/map.js';
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
				/>
				<SubmitButton>Create</SubmitButton>
			</Form>
		</Formik>
	);
}
