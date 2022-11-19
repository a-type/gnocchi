import { clsx } from 'clsx';
import { HTMLAttributes } from 'react';
import { root } from './TextField.css.js';

export interface TextFieldRootProps extends HTMLAttributes<HTMLDivElement> {}
export function TextFieldRoot({ className, ...props }: TextFieldRootProps) {
	return <div className={clsx(root, className)} {...props} />;
}

export interface TextFieldLabelProps extends HTMLAttributes<HTMLLabelElement> {}
export function TextFieldLabel({ className, ...props }: TextFieldLabelProps) {
	return <label className={clsx(className)} {...props} />;
}
