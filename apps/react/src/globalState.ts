import { proxy } from 'valtio';
import { ThemeName } from '@a-type/ui/components/colorPicker';

export const globalState = proxy({
	theme: 'lemon' as ThemeName,
});
