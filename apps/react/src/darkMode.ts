export function setColorMode(mode: 'system' | 'light' | 'dark') {
	if (mode === 'system') {
		window.localStorage.removeItem('colorMode');
	} else {
		window.localStorage.setItem('colorMode', mode);
	}
	window.dispatchEvent(new Event('colorModeChanged'));
}

const updateMode = () => {
	const mode = window.localStorage.getItem('colorMode');
	document.documentElement.classList.remove('override-light', 'override-dark');
	if (mode) {
		document.documentElement.classList.add('override-' + mode);
	}
};
updateMode();

// listen for changes and apply an override-mode to the html
window.addEventListener('colorModeChanged', updateMode);

export function getColorMode(): 'system' | 'light' | 'dark' {
	return (window.localStorage.getItem('colorMode') as any) || 'system';
}

export function subscribeToColorModeChange(
	callback: (mode: 'system' | 'light' | 'dark') => void,
) {
	const update = () => callback(getColorMode());
	window.addEventListener('colorModeChanged', update);
	return () => {
		window.removeEventListener('colorModeChanged', update);
	};
}

(window as any).setColorMode = setColorMode;
