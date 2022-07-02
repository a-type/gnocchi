import { styled } from '@stitches/react';
import { useField } from 'formik';
import { ComponentProps, InputHTMLAttributes } from 'react';
import { Button, Input } from './primitives';
import { Form as FormikForm } from 'formik';

export const FieldGroup = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	gap: '$1',
});

export function FieldLabel({ className, ...rest }: ComponentProps<'label'>) {
	return (
		<label className={`${className} inline-flex flex-col gap-1`} {...rest} />
	);
}

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
}) {
	const [props] = useField(name);
	return (
		<FieldGroup className={className} css={css}>
			{label && <FieldLabel>{label}</FieldLabel>}
			<Input {...props} {...rest} />
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
	return <Button type="submit" {...props} />;
}
