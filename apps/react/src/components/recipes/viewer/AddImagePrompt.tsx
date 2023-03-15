import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Box, ImageUploader, P, useToggle } from '@aglio/ui';
import * as classes from './AddImagePrompt.css.js';
import { animated, useSpring } from '@react-spring/web';
import { useScroll } from '@use-gesture/react';

export interface AddImagePromptProps {
	recipe: Recipe;
}

export function AddImagePrompt({ recipe }: AddImagePromptProps) {
	const { mainImage } = hooks.useWatch(recipe);
	const [show, setShow] = useToggle(!mainImage);
	const [style, spring] = useSpring(() => ({
		opacity: 0,
	}));

	useScroll(
		({ xy: [, y] }) => {
			// fade in during the last 20% of window scroll
			const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
			const adjusted = totalScrollHeight - 200;
			const space = 0.3 * adjusted;
			const threshold = Math.max(0, adjusted - space);
			const overflow = Math.max(0, y - threshold);
			const opacity = Math.min(1, overflow / space);

			spring.start({
				opacity,
			});
		},
		{
			target: window,
		},
	);

	if (!show) {
		return null;
	}

	return (
		<animated.div style={style} className={classes.root}>
			<P>Enjoy! Now would be a good time to add a photo to this recipe 🙂</P>
			<ImageUploader
				value={mainImage?.url || null}
				onChange={(image) => {
					recipe.update({
						mainImage: image,
						updatedAt: Date.now(),
					});
				}}
				className={classes.uploader}
				maxDimension={1080}
			/>
		</animated.div>
	);
}
