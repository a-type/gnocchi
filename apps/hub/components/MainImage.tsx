import classNames from 'classnames';
import * as classes from './MainImage.css.js';
// @ts-ignore
import Image from 'next/image';
import { TopLineImage } from './layout.jsx';

export interface MainImageProps {
	url: string;
	title: string;
}

export function MainImage({ url, title }: MainImageProps) {
	return (
		<TopLineImage className={classes.root}>
			<Image
				src={url}
				fill
				itemProp="image"
				className={classNames('u-photo', classes.img)}
				alt={`A photo of ${title}`}
			/>
		</TopLineImage>
	);
}
