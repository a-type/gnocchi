import { groceries } from '@/stores/groceries/index.js';
import { Category } from '@aglio/groceries-client';
import { Box, Form, sprinkles, SubmitButton, TextField } from '@aglio/ui';
import { Formik } from 'formik';

export function NewCategoryForm({
	onDone,
	autoFocus,
}: {
	onDone: (category: Category) => void;
	autoFocus?: boolean;
}) {
	return (
		<Box flexDirection="column" gap={2} align="stretch" width="full">
			<Formik
				initialValues={{ name: '' }}
				onSubmit={async ({ name }) => {
					// create the category
					const category = await groceries.createCategory(name);
					onDone(category);
				}}
			>
				<Form className={sprinkles({ width: 'full' })}>
					<Box
						flexDirection="row"
						align="end"
						justify="stretch"
						width="full"
						gap={2}
					>
						<TextField
							placeholder="Dairy & Eggs"
							autoFocusDelay={autoFocus ? 100 : undefined}
							name="name"
							className={sprinkles({ flex: 1 })}
							autoComplete="off"
						/>
						<SubmitButton>Add</SubmitButton>
					</Box>
				</Form>
			</Formik>
		</Box>
	);
}
