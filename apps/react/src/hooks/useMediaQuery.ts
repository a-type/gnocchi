import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia(query).matches;
	});
	useEffect(() => {
		const mediaQueryList = window.matchMedia(query);
		const listener = (e: MediaQueryListEvent) => {
			setMatches(e.matches);
		};
		mediaQueryList.addEventListener('change', listener);
		return () => {
			mediaQueryList.removeEventListener('change', listener);
		};
	}, [query]);
	return matches;
}
