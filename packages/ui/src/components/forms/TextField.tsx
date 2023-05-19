'use client';

import { useField } from 'formik';
import {
	ComponentProps,
	InputHTMLAttributes,
	useEffect,
	useRef,
	Ref,
	forwardRef,
} from 'react';
import useMergedRef from '../../hooks/useMergedRef.js';
import classNames from 'classnames';
import { Input } from '../input/Input.js';
import { TextArea, TextAreaProps } from '../textArea/TextArea.jsx';
import { withClassName } from '../../hooks.js';

export type TextFieldProps = {
	name: string;
	label?: string;
	required?: boolean;
	type?: InputHTMLAttributes<HTMLInputElement>['type'];
	className?: string;
	placeholder?: string;
	autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
	autoFocus?: InputHTMLAttributes<HTMLInputElement>['autoFocus'];
	autoFocusDelay?: number;
	inputRef?: Ref<HTMLInputElement>;
} & ComponentProps<typeof Input>;

const emptyRef = (() => {}) as any;

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
	function TextField(
		{
			name,
			label,
			className,
			autoFocusDelay,
			autoFocus,
			inputRef,
			onChange,
			onFocus,
			onBlur,
			...rest
		},
		ref,
	) {
		const [props] = useField({
			name,
			onChange,
			onFocus,
			onBlur,
		});
		const innerInputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (autoFocusDelay) {
				setTimeout(() => {
					if (innerInputRef.current) innerInputRef.current.focus();
				}, autoFocusDelay);
			}
		}, [autoFocusDelay]);

		return (
			<FieldRoot className={className} ref={ref}>
				{label && <FieldLabel>{label}</FieldLabel>}
				<Input
					{...props}
					{...rest}
					autoFocus={autoFocus}
					ref={useMergedRef(innerInputRef, inputRef || emptyRef)}
				/>
			</FieldRoot>
		);
	},
);

export type TextAreaFieldProps = {
	name: string;
	label?: string;
	required?: boolean;
	rows?: number;
	disabled?: boolean;
	className?: string;
	inputRef?: Ref<HTMLTextAreaElement>;
} & TextAreaProps;

export function TextAreaField({
	name,
	label,
	className,
	inputRef,
	...rest
}: TextAreaFieldProps) {
	const [props] = useField(name);
	return (
		<FieldRoot className={className}>
			{label && <FieldLabel>{label}</FieldLabel>}
			<TextArea ref={inputRef} {...props} {...rest} />
		</FieldRoot>
	);
}

const FieldRoot = withClassName(
	'div',
	'flex flex-col items-stretch gap-1 self-stretch',
);
const FieldLabel = withClassName(
	'label',
	'inline-flex flex-col gap-1 text-sm font-bold text-dark-blend mb-1',
);
