import { useField } from 'formik';
import {
	ComponentProps,
	InputHTMLAttributes,
	useEffect,
	useRef,
	Ref,
	forwardRef,
} from 'react';
import useMergedRef from '@/hooks/useMergedRef.js';
import { clsx } from 'clsx';
import * as classes from './TextField.css.js';
import { Input } from '../input/Input.js';
import { TextArea, TextAreaProps } from '../textArea/TextArea.jsx';

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
			<div className={clsx(classes.fieldGroup, className)} ref={ref}>
				{label && <label className={classes.fieldLabel}>{label}</label>}
				<Input
					{...props}
					{...rest}
					autoFocus={autoFocus}
					ref={useMergedRef(innerInputRef, inputRef || emptyRef)}
				/>
			</div>
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
		<div className={clsx(classes.fieldGroup, className)}>
			{label && <label className={classes.fieldLabel}>{label}</label>}
			<TextArea ref={inputRef} {...props} {...rest} />
		</div>
	);
}
