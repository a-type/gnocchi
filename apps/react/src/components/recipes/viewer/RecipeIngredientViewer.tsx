import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { convertUnits, lookupUnit } from '@aglio/conversion';
import { RecipeIngredientsItem } from '@aglio/groceries-client';
import { fractionToText } from '@aglio/tools';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { NoteEditor } from '../editor/NoteEditor.jsx';
import { IngredientText } from './IngredientText.jsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import { Tooltip } from '@a-type/ui/components/tooltip';
import { Button } from '@a-type/ui/components/button';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '@a-type/ui/components/collapsible';
import { useToggle } from '@a-type/ui/hooks';
import { useUnitConversion } from '@/components/recipes/viewer/unitConversion.js';
import pluralize from 'pluralize';
import { useLookupFoodName } from '@/components/foods/FoodName.jsx';

(window as any).convertUnits = convertUnits;

export interface RecipeIngredientViewerProps {
	ingredient: RecipeIngredientsItem;
	multiplier?: number;
	className?: string;
	disableAddNote?: boolean;
	recipeId: string;
}

export function RecipeIngredientViewer({
	ingredient,
	multiplier = 1,
	className,
	disableAddNote,
	recipeId,
}: RecipeIngredientViewerProps) {
	const { note, isSectionHeader, quantity, unit, food } =
		hooks.useWatch(ingredient);
	const officialUnit = lookupUnit(unit);
	const [conversion, setConversion] = useUnitConversion(officialUnit?.abbr);

	const [showNote, toggleShowNote] = useToggle(!!note);

	const onNoteBlur = useCallback(() => {
		if (!note) {
			toggleShowNote();
		}
	}, [note, toggleShowNote]);

	const convertedValue = useMemo(() => {
		if (!conversion || !officialUnit) return undefined;
		const result = convertUnits(quantity * multiplier)
			.from(officialUnit.abbr)
			.to(conversion);
		return `${fractionToText(result)} ${friendlyUnit(
			conversion,
			result === 1,
		)}`;
	}, [conversion, officialUnit, quantity, multiplier]);

	const convertOptions: string[] = useMemo(() => {
		if (!officialUnit) return [];
		try {
			const possibilities = convertUnits()
				.from(officialUnit.abbr)
				.possibilities();
			return possibilities
				.filter((opt: string) => usefulUnits.includes(opt))
				.filter((opt: string) => opt !== officialUnit.abbr);
		} catch {
			return [];
		}
	}, [officialUnit]);

	const conversionEnabled =
		!!officialUnit && !!convertOptions.length && !isSectionHeader;

	const resetConversion = useCallback(() => {
		setConversion(undefined);
	}, [setConversion]);

	const add = hooks.useAddItems();
	const foodName = useLookupFoodName(food);
	const addToList = useCallback(async () => {
		const totalQuantity = quantity * (multiplier || 1);
		const textOverride = foodName || undefined;
		add(
			[
				{
					original: ingredient.get('text'),
					quantity: totalQuantity,
					unit,
					food: ingredient.get('food') || 'Unknown',
					// for items added from this view, we add the food
					// name as the text, not the ingredient text
					textOverride,
				},
			],
			{
				sourceInfo: {
					multiplier: multiplier !== 1 ? multiplier : undefined,
					recipeId,
				},
				showToast: true,
			},
		);
	}, [ingredient, multiplier, add, recipeId, foodName]);

	return (
		<div
			className={classNames(
				'flex flex-col items-end gap-1',
				isSectionHeader && 'font-bold',
				className,
			)}
		>
			<div className="flex flex-row w-full items-start">
				<IngredientText
					className="flex-1 block mt-1"
					multiplier={multiplier}
					ingredient={ingredient}
				/>
				<div className="flex flex-row gap-2 items-center relative top--1">
					{conversionEnabled && (
						<>
							<DropdownMenu
								onOpenChange={(open) => {
									if (open) resetConversion();
								}}
							>
								<Tooltip content="Convert">
									<DropdownMenuTrigger asChild>
										<Button size="icon" color="ghost">
											<Icon name="convert" />
										</Button>
									</DropdownMenuTrigger>
								</Tooltip>
								<DropdownMenuContent>
									<DropdownMenuLabel>Convert to:</DropdownMenuLabel>
									{convertOptions.map((opt) => (
										<DropdownMenuItem
											key={opt}
											onSelect={() => setConversion(opt)}
										>
											{friendlyUnit(opt)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					)}
					{!isSectionHeader && (
						<Button size="icon" color="ghost" onClick={addToList}>
							<Icon name="add_to_list" className="color-gray7" />
						</Button>
					)}
					{!disableAddNote && (
						<Button size="icon" color="ghost" onClick={toggleShowNote}>
							{!!note ? (
								<Icon
									name="note"
									className={
										showNote
											? undefined
											: 'color-primaryDark fill-primary stroke-primaryDark'
									}
								/>
							) : (
								<Icon name="add_note" className="color-gray7" />
							)}
						</Button>
					)}
				</div>
			</div>
			<CollapsibleRoot
				open={!!conversion}
				className="mr-auto self-start italic color-gray7"
			>
				<CollapsibleContent className="pr-2">
					<span className="text-xs inline-flex items-center gap-1">
						<Icon name="convert" size={15} />
						{convertedValue}
					</span>
				</CollapsibleContent>
			</CollapsibleRoot>
			<CollapsibleRoot open={showNote}>
				<CollapsibleContent>
					<NoteEditor
						value={note || ''}
						onChange={(val) => ingredient.set('note', val)}
						autoFocus={!note}
						onBlur={onNoteBlur}
					/>
				</CollapsibleContent>
			</CollapsibleRoot>
		</div>
	);
}

const defaultConvert = convertUnits();
function friendlyUnit(abbr: string, singular = false) {
	const details = defaultConvert.describe(abbr);
	if (!details) return '';
	return singular ? details.singular : details.plural;
}

const usefulUnits = [
	'ml',
	'g',
	'kg',
	'oz',
	'lb',
	'cup',
	'tsp',
	'Tbs',
	'pt',
	'qt',
	'gal',
	'fl oz',
	'cm',
	'm',
	'in',
	'ft',
];
