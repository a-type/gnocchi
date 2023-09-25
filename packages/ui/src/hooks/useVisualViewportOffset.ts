import { useEffect, useState } from 'react';

/**
 * Applies bottom offset px as a CSS custom property to the document root.
 */
export function useVisualViewportOffset() {
	const viewport = window.visualViewport;

	useEffect(() => {
		if (!viewport) {
			return;
		}

		const update = () => {
			requestAnimationFrame(() => {
				const offset = viewport.height - viewport.offsetTop;
				console.log(viewport.height, viewport.offsetTop);
				document.documentElement.style.setProperty(
					'--viewport-bottom-offset',
					`${window.innerHeight - offset}px`,
				);
				document.documentElement.style.setProperty(
					'--viewport-height',
					`${viewport.height}px`,
				);
				console.log('bottom offset', window.innerHeight - offset);
			});
		};

		update();

		window.addEventListener('scroll', update, { passive: true });
		viewport.addEventListener('resize', update);

		return () => {
			viewport.removeEventListener('resize', update);
			window.removeEventListener('scroll', update);
		};
	}, []);
}
