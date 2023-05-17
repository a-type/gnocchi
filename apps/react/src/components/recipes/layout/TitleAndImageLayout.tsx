import { withClassName } from '@aglio/ui/hooks';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';

export const TitleAndImageLayout = withClassName(
	'div',
	classNames(
		'grid grid-cols-[1fr] grid-rows-[repeat(2,auto)] grid-areas-[image]-[title] gap-4 w-full items-stretch',
		'lg:(grid-cols-[1fr_auto] grid-rows-[1fr] grid-areas-[title_image] gap-4 items-start)',
	),
);

export const TitleContainer = withClassName(
	'div',
	'[grid-area:title] flex flex-col items-start gap-4 min-w-300px',
);

export const ImageContainer = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	const enabled = useFeatureFlag('recipeImages');

	if (!enabled) return null;

	return (
		<div
			className={classNames(
				'[grid-area:image] w-full h-300px lg:(w-200px h-200px)',
				className,
			)}
			{...props}
		/>
	);
};
