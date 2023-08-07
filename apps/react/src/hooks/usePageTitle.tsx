import { useEffect } from 'react';

export function usePageTitle(title: string) {
	useEffect(() => {
		document.title = title + ' | Gnocchi';
		return () => {
			document.title = 'Gnocchi';
		};
	}, [title]);
}
