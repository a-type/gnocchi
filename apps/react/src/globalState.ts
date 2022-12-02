import { proxy } from 'valtio';
import { ThemeName } from './components/primitives/colorPicker/ColorPicker.jsx';

export const globalState = proxy({
	theme: 'lemon' as ThemeName,
});
