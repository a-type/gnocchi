import { styled } from 'stitches.config.js';
import { useField } from 'formik';
import React, {
	ComponentProps,
	InputHTMLAttributes,
	useEffect,
	useRef,
	Ref,
} from 'react';
import { Button, Input, TextArea, TextAreaProps } from './primitives.js';
import { Form as FormikForm } from 'formik';
import useMergedRef from '@react-hook/merged-ref';

export const FieldGroup = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	gap: '$1',
});

export const FieldLabel = styled('label', {
	display: 'inline-flex',
	flexDirection: 'column',
	gap: '$1',
	fontSize: '$sm',
	fontWeight: 'bold',
	color: '$darkBlend',
});

export const Form = styled(FormikForm, {
	display: 'flex',
	flexDirection: 'column',
	gap: '$2',
});

const emptyRef = (() => {}) as any;

export type TextFieldProps = {
	name: string;
	label?: string;
	required?: boolean;
	type?: InputHTMLAttributes<HTMLInputElement>['type'];
	className?: string;
	css?: ComponentProps<typeof FieldGroup>['css'];
	placeholder?: string;
	autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
	autoFocus?: InputHTMLAttributes<HTMLInputElement>['autoFocus'];
	autoFocusDelay?: number;
	inputRef?: Ref<HTMLInputElement>;
} & ComponentProps<typeof Input>;

export function TextField({
	name,
	label,
	css,
	className,
	autoFocusDelay,
	autoFocus,
	inputRef,
	...rest
}: TextFieldProps) {
	const [props] = useField(name);
	const innerInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (autoFocusDelay) {
			setTimeout(() => {
				if (innerInputRef.current) innerInputRef.current.focus();
			}, autoFocusDelay);
		}
	}, [autoFocusDelay]);

	return (
		<FieldGroup className={className} css={css}>
			{label && <FieldLabel css={{ mb: '$1' }}>{label}</FieldLabel>}
			<Input
				{...props}
				{...rest}
				autoFocus={autoFocus}
				ref={useMergedRef(inputRef || emptyRef, innerInputRef)}
			/>
		</FieldGroup>
	);
}

export type TextAreaFieldProps = {
	name: string;
	label?: string;
	required?: boolean;
	rows?: number;
	disabled?: boolean;
	className?: string;
	css?: ComponentProps<typeof FieldGroup>['css'];
	inputRef?: Ref<HTMLTextAreaElement>;
} & TextAreaProps;

export function TextAreaField({
	name,
	label,
	className,
	css,
	inputRef,
	...rest
}: TextAreaFieldProps) {
	const [props] = useField(name);
	return (
		<FieldGroup className={className} css={css}>
			{label && <FieldLabel>{label}</FieldLabel>}
			<Input ref={inputRef} as={TextArea} {...props} {...rest} />
		</FieldGroup>
	);
}

export function SubmitButton(props: ComponentProps<typeof Button>) {
	return <Button color="primary" type="submit" {...props} />;
}
