import { Icon } from '@/components/icons/Icon.jsx';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import { useSearchParams } from '@verdant-web/react-router';

export interface OpenFoodDetailButtonProps extends ButtonProps {
	foodName: string;
}

export function OpenFoodDetailButton({
	foodName,
	size,
	color,
	children,
	...rest
}: OpenFoodDetailButtonProps) {
	const [_, setParams] = useSearchParams();
	const openDialog = () => {
		setParams((old) => {
			old.set('showFood', foodName);
			return old;
		});
	};

	return (
		<Button
			onClick={openDialog}
			size={!children && size === undefined ? 'icon' : size}
			color={!children && color === undefined ? 'ghost' : color}
			{...rest}
		>
			{children || <Icon name="food" />}
		</Button>
	);
}
