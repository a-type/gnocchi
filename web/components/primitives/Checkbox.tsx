import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { styled } from 'stitches.config';

export const Checkbox = styled(CheckboxPrimitive.Root, {
	width: 24,
	height: 24,
	backgroundColor: '$white',
	border: '2px solid $lemonDark',
	position: 'relative',
	borderRadius: '$sm',

	'&[data-state="checked"]': {
		backgroundColor: '$lemon',
	},
});

export const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%)',
});
