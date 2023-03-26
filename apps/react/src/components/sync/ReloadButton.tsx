import { Button, ButtonProps } from '@aglio/ui';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRegisterSW } from 'virtual:pwa-register/react';

export interface ReloadButtonProps extends ButtonProps {}

export function ReloadButton({ onClick, ...props }: ReloadButtonProps) {
	const { updateServiceWorker } = useRegisterSW();

	const refresh = () => {
		updateServiceWorker();
		window.location.reload();
	};

	return (
		<Button
			{...props}
			onClick={(ev) => {
				onClick?.(ev);
				refresh();
			}}
		>
			<ReloadIcon />
			<span>Refresh</span>
		</Button>
	);
}
