'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select/Select.jsx';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { withClassName } from '../../hooks/withClassName.js';

export type ThemeName = 'lemon' | 'tomato' | 'leek' | 'blueberry' | 'eggplant';

export interface ColorPickerProps {
	value: ThemeName | null;
	onChange: (value: ThemeName) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
	const resolvedValue = [
		'lemon',
		'tomato',
		'leek',
		'blueberry',
		'eggplant',
	].includes(value || '')
		? (value as ThemeName)
		: 'lemon';

	return (
		<Select value={resolvedValue} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="z-[calc(var(--z-dialog)+1)]">
				<SelectItem value="lemon">
					<ColorSwatch value="lemon" />
					<ItemLabel>Lemon</ItemLabel>
				</SelectItem>
				<SelectItem value="tomato">
					<ColorSwatch value="tomato" />
					<ItemLabel>Tomato</ItemLabel>
				</SelectItem>
				<SelectItem value="leek">
					<ColorSwatch value="leek" />
					<ItemLabel>Leek</ItemLabel>
				</SelectItem>
				<SelectItem value="blueberry">
					<ColorSwatch value="blueberry" />
					<ItemLabel>Blueberry</ItemLabel>
				</SelectItem>
				<SelectItem value="eggplant">
					<ColorSwatch value="eggplant" />
					<ItemLabel>Eggplant</ItemLabel>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

const ItemLabel = withClassName('span', 'display-none');

export function ColorSwatch({
	value,
	children,
}: {
	value: ThemeName;
	children?: ReactNode;
}) {
	return (
		<div
			className={classNames(
				'bg-primary w-16px h-16px rounded-sm',
				`theme-${value ?? 'lemon'}`,
			)}
		>
			{children}
		</div>
	);
}
