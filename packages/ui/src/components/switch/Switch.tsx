import { withClassName } from '../../withClassName.jsx';
import { Root, SwitchProps, Thumb } from '@radix-ui/react-switch';
import * as classes from './Switch.css.js';
import { forwardRef } from 'react';

const SwitchRoot = withClassName(Root, classes.root);

const SwitchThumb = withClassName(Thumb, classes.thumb);

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	function Switch(props, ref) {
		return (
			<SwitchRoot {...props} ref={ref}>
				<SwitchThumb />
			</SwitchRoot>
		);
	},
);
