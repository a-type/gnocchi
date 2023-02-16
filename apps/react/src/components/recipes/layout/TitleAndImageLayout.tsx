import { withClassName } from '@/hocs/withClassName.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import classnames from 'classnames';
import { HTMLAttributes } from 'react';
import * as classes from './TitleAndImageLayout.css.js';

export const TitleAndImageLayout = withClassName('div', classes.root);

export const TitleContainer = withClassName('div', classes.title);

export const ImageContainer = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	const enabled = useFeatureFlag('recipeImages');

	if (!enabled) return null;

	return <div className={classnames(classes.image, className)} {...props} />;
};
