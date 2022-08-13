import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import React, { ComponentProps, forwardRef } from 'react';
import { styled } from 'stitches.config';
import { CheckIcon } from '@radix-ui/react-icons';

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
	width: 24,
	height: 24,
	backgroundColor: '$white',
	border: '2px solid $black',
	position: 'relative',
	borderRadius: '$sm',

	'&[data-state="checked"]': {
		backgroundColor: '$lemon',
		borderColor: '$lemon',
	},
});

const OuterCheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%)',
});

export function CheckboxIndicator({
	children,
	...props
}: ComponentProps<typeof OuterCheckboxIndicator>) {
	return (
		<OuterCheckboxIndicator {...props}>
			{children ?? <CheckIcon width={18} height={18} />}
		</OuterCheckboxIndicator>
	);
}

export const Checkbox = forwardRef<
	HTMLButtonElement,
	ComponentProps<typeof CheckboxRoot>
>(function Checkbox(props, ref) {
	return (
		<CheckboxRoot ref={ref} {...props}>
			<CheckboxIndicator />
		</CheckboxRoot>
	);
});
