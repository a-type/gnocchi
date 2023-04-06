import { animated, useSpring } from '@react-spring/web';
import { useScroll } from '@use-gesture/react';
import { ReactNode } from 'react';

export interface AppearWithScrollProps {
	children: ReactNode;
	className?: string;
}

export function AppearWithScroll({
	children,
	className,
}: AppearWithScrollProps) {
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

	return (
		<animated.div style={style} className={className}>
			{children}
		</animated.div>
	);
}
