import classNames from 'classnames';

export const TopLineRoot = (props: any) => (
	<div
		className={classNames(
			'grid grid-areas-[image]-[title] grid-cols-[1fr] grid-rows-[auto_1fr] mb-6 gap-4',
			'lg:grid-areas-[title_image] lg:grid-cols-[auto_minmax(min-content,1fr)]',
		)}
		{...props}
	/>
);

export const TopLineTitle = (props: any) => (
	<div
		className={classNames('[grid-area:title] flex flex-col gap-2')}
		{...props}
	/>
);

export const TopLineImage = (props: any) => (
	<div
		className={classNames(
			'[grid-area:image] w-full h-30vh lg:w-full lg:min-w-200px lg:h-200px',
		)}
		{...props}
	/>
);
