import { useQuery } from '@aphro/react';
import {
	Box,
	Form,
	SubmitButton,
	TextAreaField,
	TextAreaFieldProps,
	TextField,
	TextFieldProps,
} from 'components/primitives';
import { useGroceryList, useGroceryListCtx } from 'contexts/GroceryListContext';
import { Formik, useFormikContext } from 'formik';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { addItems } from 'stores/groceries/mutations';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLFormElement, GroceryListAddProps>(
	function GroceryListAdd({ ...rest }, ref) {
		const inputRef = useRef<HTMLInputElement>(null);
		const list = useGroceryList();
		const ctx = useGroceryListCtx();

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
					await addItems(ctx, list.id, lines);
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
	const list = useGroceryList();
	const ctx = useGroceryListCtx();
	const formik = useFormikContext();

	return (
		<TextField
			{...props}
			onPaste={async (ev) => {
				const text = ev.clipboardData.getData('text/plain');
				if (text.match(/\n/)) {
					await addItems(ctx, list.id, text.split('\n').filter(Boolean));
					ev.preventDefault();
					formik.resetForm();
				}
			}}
		/>
	);
}
