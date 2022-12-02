import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select/Select.jsx';
import { clsx } from 'clsx';
import * as classes from './ColorPicker.css.js';
import { themeMap } from '@/styles/themes/map.js';

export type ThemeName = 'lemon' | 'tomato' | 'leek' | 'blueberry' | 'eggplant';

export interface ColorPickerProps {
	value: ThemeName | null;
	onChange: (value: ThemeName) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
	const resolvedValue = Object.keys(themeMap).includes(value || '')
		? (value as ThemeName)
		: 'lemon';

	return (
		<Select value={resolvedValue} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className={classes.pickerContent}>
				<SelectItem value="lemon">
					<ColorSwatch value="lemon" />
					<span className={classes.itemLabel}>Lemon</span>
				</SelectItem>
				<SelectItem value="tomato">
					<ColorSwatch value="tomato" />
					<span className={classes.itemLabel}>Tomato</span>
				</SelectItem>
				<SelectItem value="leek">
					<ColorSwatch value="leek" />
					<span className={classes.itemLabel}>Leek</span>
				</SelectItem>
				<SelectItem value="blueberry">
					<ColorSwatch value="blueberry" />
					<span className={classes.itemLabel}>Blueberry</span>
				</SelectItem>
				<SelectItem value="eggplant">
					<ColorSwatch value="eggplant" />
					<span className={classes.itemLabel}>Eggplant</span>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

export function ColorSwatch({ value }: { value: ThemeName }) {
	return (
		<div className={clsx(classes.swatch, themeMap[value] ?? themeMap.lemon)} />
	);
}
