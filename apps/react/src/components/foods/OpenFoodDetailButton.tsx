import { Icon } from '@/components/icons/Icon.jsx';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import { useSearchParams } from '@verdant-web/react-router';
import { forwardRef } from 'react';

export interface OpenFoodDetailButtonProps extends ButtonProps {
	foodName: string;
}

export const OpenFoodDetailButton = forwardRef<
	HTMLButtonElement,
	OpenFoodDetailButtonProps
>(function OpenFoodDetailButton(
	{ foodName, size, color, children, ...rest },
	ref,
) {
	const [_, setParams] = useSearchParams();
	const openDialog = () => {
		setParams(
			(old) => {
				old.set('showFood', foodName);
				return old;
			},
			{ state: { noUpdate: true } },
		);
	};

	return (
		<Button
			ref={ref}
			onClick={openDialog}
			size={!children && size === undefined ? 'icon' : size}
			color={!children && color === undefined ? 'ghost' : color}
			{...rest}
		>
			{children || <Icon name="food" />}
		</Button>
	);
});
