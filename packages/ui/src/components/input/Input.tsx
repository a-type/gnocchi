import { withClassName } from '../../withClassName.jsx';
import {
	ComponentProps,
	ComponentPropsWithRef,
	forwardRef,
	HTMLProps,
} from 'react';
import { clsx } from 'clsx';
import * as classes from './Input.css.js';

export const Input = withClassName(
	forwardRef<HTMLInputElement, ComponentProps<'input'>>(function Input(
		props,
		ref,
	) {
		return <input {...props} ref={ref} />;
	}),
	classes.root,
);

export type InputProps = ComponentPropsWithRef<'input'>;
