import { withClassName } from '@aglio/ui/hooks';

export const CategoryTitleRow = withClassName(
	'div',
	'flex flex-row items-center py-1 px-3',
);

export const CategoryTitle = withClassName(
	'h2',
	'text-xs font-sans font-normal uppercase italic text-black m-0 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis flex-1-0-0',
	'[[data-is-item-dragging=true]_&]:(text-sm mt-2)',
);
