import { installState, triggerInstall } from '@/install.js';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import { useSnapshot } from 'valtio';

export function InstallButton(props: ButtonProps) {
	const { installReady } = useSnapshot(installState);

	if (!installReady) return null;

	return (
		<Button
			color="ghost"
			size="small"
			className="font-normal"
			onClick={triggerInstall}
			{...props}
		>
			{props.children || (
				<>
					<DownloadIcon />
					<span>Install app</span>
				</>
			)}
		</Button>
	);
}
