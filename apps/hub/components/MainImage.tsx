import classNames from 'classnames';
// @ts-ignore
import Image from 'next/image';
import { TopLineImage } from './layout.jsx';

export interface MainImageProps {
	url: string;
	title: string;
}

export function MainImage({ url, title }: MainImageProps) {
	return (
		<TopLineImage className="block relative w-full h-30vh rounded-lg overflow-hidden">
			<Image
				src={url}
				fill
				itemProp="image"
				className={classNames('u-photo', 'object-cover object-center')}
				alt={`A photo of ${title}`}
			/>
		</TopLineImage>
	);
}
