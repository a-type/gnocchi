import React from 'react';
import { groceries, GroceryCategory } from '@/stores/groceries/index.js';
import { Formik } from 'formik';
import { Form, SubmitButton, TextField } from '../primitives/forms.js';
import { Box } from '../primitives/primitives.js';

export function NewCategoryForm({
	onDone,
	autoFocus,
}: {
	onDone: (category: GroceryCategory) => void;
	autoFocus?: boolean;
}) {
	return (
		<Box direction="column" gap={2} align="stretch" w="full">
			<Formik
				initialValues={{ name: '' }}
				onSubmit={async ({ name }) => {
					// create the category
					const category = await groceries.createCategory(name);
					onDone(category);
				}}
			>
				<Form css={{ width: '100%' }}>
					<Box direction="row" align="end" justify="stretch" w="full" gap={2}>
						<TextField
							placeholder="Dairy & Eggs"
							autoFocusDelay={autoFocus ? 100 : undefined}
							name="name"
							css={{ flex: 1 }}
							autoComplete="off"
						/>
						<SubmitButton>Add</SubmitButton>
					</Box>
				</Form>
			</Formik>
		</Box>
	);
}
