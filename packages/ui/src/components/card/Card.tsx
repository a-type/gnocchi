import { MouseEvent, ReactNode, forwardRef } from 'react';
import { withClassName } from '../../hooks.js';
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';

export const CardRoot = withClassName(
	'div',
	'layer-components:(flex flex-col border-light rounded-lg text-lg overflow-hidden h-max-content relative bg-gray1)',
);

export const CardMain = forwardRef<
	any,
	{
		asChild?: boolean;
		className?: string;
		onClick?: (ev: MouseEvent) => void;
		children?: ReactNode;
		compact?: boolean;
	}
>(function CardMain({ asChild, className, compact, ...rest }, ref) {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			ref={ref}
			className={classNames(
				'layer-components:(flex flex-col gap-1 cursor-pointer transition p-4 pb-2 flex-1 relative z-1 bg-transparent border-none text-start)',
				'layer-components:hover:(bg-lightBlend color-black)',
				'layer-components:md:pt-4',
				compact && 'layer-variants:(p-1 bg-white gap-0)',
				className,
			)}
			data-compact={compact}
			{...rest}
		/>
	);
});

export const CardTitle = withClassName(
	'div',
	'layer-components:(flex flex-col gap-1 mt-auto bg-white p-2 rounded-lg w-auto mr-auto border border-solid border-grayDarkBlend text-md max-h-80px overflow-hidden text-ellipsis max-w-full)',
	'[data-compact=true]>&:(bg-transparent border-none p-2 whitespace-nowrap text-ellipsis overflow-hidden)',
);

export const CardImage = withClassName(
	'div',
	'layer-components:(absolute z-0 right-0 top-0 bottom-0 w-full h-full)',
);

export const CardFooter = withClassName(
	'div',
	'layer-components:(flex flex-row p-2 bg-white relative z-1 border-0 border-t border-t-grayDarkBlend border-solid)',
);

export const CardActions = withClassName(
	'div',
	'layer-components:(ml-0 mr-auto flex flex-row gap-1 items-center)',
);

export const CardMenu = withClassName(
	'div',
	'layer-components:(mr-0 ml-auto flex flex-row gap-1 items-center)',
);

export const CardGrid = withClassName(
	'div',
	'layer-components:(grid grid-cols-[1fr] [grid-auto-rows:auto] gap-4 p-0 m-0)',
	'layer-components:md:(grid-cols-[repeat(2,1fr)] [grid-auto-rows:1fr] items-end)',
);
