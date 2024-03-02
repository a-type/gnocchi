import {
	Cross2Icon,
	DrawingPinFilledIcon,
	DrawingPinIcon,
} from '@radix-ui/react-icons';

export interface PinIconProps {
	isPinned: boolean;
}

export function PinIcon({ isPinned }: PinIconProps) {
	if (isPinned) {
		return (
			<>
				<DrawingPinIcon className="relative top--2px left-0px" />
				<Cross2Icon className="absolute w-10px h-10px bottom-5px right-8px" />
			</>
		);
	}

	return <DrawingPinFilledIcon />;
}
