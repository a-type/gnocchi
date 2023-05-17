import { withClassName } from '@aglio/ui/hooks';

export const TopLineRoot = withClassName(
	'div',
	'grid grid-areas-[image]-[title] grid-cols-[1fr] grid-rows-[auto_1fr] mb-6 gap-4',
	'lg:(grid-areas-[title_image] grid-cols-[auto_minmax(min-content,1fr)])',
);

export const TopLineTitle = withClassName(
	'div',
	'[grid-area:title] flex flex-col gap-2',
);

export const TopLineImage = withClassName(
	'div',
	'[grid-area:image] w-full h-30vh lg:(w-full min-w-200px h-200px)',
);
