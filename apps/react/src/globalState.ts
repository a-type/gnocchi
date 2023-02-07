import { proxy } from 'valtio';
import { ThemeName } from '@aglio/ui';

export const globalState = proxy({
	theme: 'lemon' as ThemeName,
});
