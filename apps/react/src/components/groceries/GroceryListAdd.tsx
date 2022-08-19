import {
	Box,
	Form,
	SubmitButton,
	TextField,
	TextFieldProps,
} from 'components/primitives';
import { Formik, useFormikContext } from 'formik';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { groceries } from 'stores/groceries';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		const inputRef = useRef<HTMLInputElement>(null);

		// prevent immediate input focus on touch so the keyboard has
		// time to appear
		const handleInputTouch = useCallback((ev: TouchEvent) => {
			ev.preventDefault();
			setTimeout(() => {
				inputRef.current?.focus();
			}, 300);
		}, []);

		useEffect(() => {
			const input = inputRef.current;
			if (!input) return;
			input.addEventListener('touchstart', handleInputTouch, true);
		}, [handleInputTouch]);

		return (
			<Formik
				initialValues={{ text: '' }}
				onSubmit={async ({ text }, { resetForm }) => {
					const lines = text.split('\n').filter(Boolean);
					await groceries.addItems(lines);
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
