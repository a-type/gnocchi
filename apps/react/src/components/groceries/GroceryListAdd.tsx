import {
	Box,
	Form,
	SubmitButton,
	TextField,
	TextFieldProps,
} from '@/components/primitives/index.js';
import { Formik, useFormikContext } from 'formik';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { groceries } from '@/stores/groceries/index.js';
import { isUrl } from '@aglio/tools';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		const inputRef = useRef<HTMLInputElement>(null);

		return (
			<Formik
				initialValues={{ text: '' }}
				onSubmit={async ({ text }, { resetForm }) => {
					const lines = text.split('\n').filter(Boolean);
					if (!lines.length) return;
					if (lines.length === 1 && isUrl(lines[0])) {
						await groceries.addRecipe(lines[0]);
					} else {
						await groceries.addItems(lines);
					}
					resetForm();

					// focus the input
					inputRef.current?.focus();
				}}
			>
				<Form ref={ref} css={{ width: '$full' }} {...rest}>
					<Box w="full" direction="row" gap={2}>
						<AutoSubmitOnPasteLinesField
							inputRef={inputRef}
							name="text"
							required
							css={{ flex: 1 }}
							autoComplete="off"
							placeholder="Add an item..."
						/>
						<SubmitButton>Add</SubmitButton>
					</Box>
				</Form>
			</Formik>
		);
	},
);

function AutoSubmitOnPasteLinesField(props: TextFieldProps) {
	const formik = useFormikContext();

	return (
		<TextField
			{...props}
			onPaste={async (ev) => {
				const text = ev.clipboardData.getData('text/plain');
				if (text.match(/\n/)) {
					await groceries.addItems(text.split('\n').filter(Boolean));
					ev.preventDefault();
					formik.resetForm();
				}
			}}
		/>
	);
}
