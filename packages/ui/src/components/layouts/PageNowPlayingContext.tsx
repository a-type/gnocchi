import { createContext } from 'react';

export const NowPlayingContext = createContext<{
	container: HTMLDivElement | undefined;
	setContainer: (container: HTMLDivElement) => void;
}>({ container: undefined, setContainer: () => {} });
