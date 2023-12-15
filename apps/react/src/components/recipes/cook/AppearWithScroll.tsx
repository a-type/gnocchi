import { animated, useSpring } from '@react-spring/web';
import { ReactNode, useEffect, useRef } from 'react';

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

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					spring.start({
						opacity: entry.intersectionRatio,
					});
				}
			},
			{
				threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
				rootMargin: '0px 0px -100px 0px',
			},
		);

		observer.observe(el);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<animated.div ref={ref} style={style} className={className}>
			{children}
		</animated.div>
	);
}
