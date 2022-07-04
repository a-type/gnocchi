import { styled } from 'stitches.config';
import { useField } from 'formik';
import { ComponentProps, InputHTMLAttributes, useEffect, useRef } from 'react';
import { Button, Input } from './primitives';
import { Form as FormikForm } from 'formik';

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

export function TextField({
	name,
	label,
	css,
	className,
	autoFocusDelay,
	autoFocus,
	...rest
}: {
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
}) {
	const [props] = useField(name);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (autoFocusDelay) {
			console.log('focusing input');
			setTimeout(() => {
				if (inputRef.current) inputRef.current.focus();
			}, autoFocusDelay);
		}
	}, [autoFocusDelay]);

	return (
		<FieldGroup className={className} css={css}>
			{label && <FieldLabel css={{ mb: '$1' }}>{label}</FieldLabel>}
			<Input {...props} {...rest} autoFocus={autoFocus} ref={inputRef} />
		</FieldGroup>
	);
}

export function TextAreaField({
	name,
	label,
	className,
	css,
	...rest
}: {
	name: string;
	label?: string;
	required?: boolean;
	rows?: number;
	disabled?: boolean;
	className?: string;
	css?: ComponentProps<typeof FieldGroup>['css'];
}) {
	const [props] = useField(name);
	return (
		<FieldGroup className={className} css={css}>
			{label && <FieldLabel>{label}</FieldLabel>}
			<Input as="textarea" {...props} {...rest} />
		</FieldGroup>
	);
}

export function SubmitButton(props: ComponentProps<typeof Button>) {
	return <Button color="primary" type="submit" {...props} />;
}
