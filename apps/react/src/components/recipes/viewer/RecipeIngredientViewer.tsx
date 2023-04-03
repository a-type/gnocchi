import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { convertUnits, lookupUnit } from '@aglio/conversion';
import { RecipeIngredientsItem } from '@aglio/groceries-client';
import { fractionToText } from '@aglio/tools';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { NoteEditor } from '../editor/NoteEditor.jsx';
import { IngredientText } from './IngredientText.jsx';
import * as classes from './RecipeIngredientViewer.css.js';
import { Box } from '@aglio/ui/components/box';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@aglio/ui/components/dropdownMenu';
import { Tooltip } from '@aglio/ui/components/tooltip';
import { Button } from '@aglio/ui/components/button';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '@aglio/ui/components/collapsible';
import { Span } from '@aglio/ui/components/typography';
import { useToggle } from '@aglio/ui/hooks';

(window as any).convertUnits = convertUnits;

export interface RecipeIngredientViewerProps {
	ingredient: RecipeIngredientsItem;
	multiplier?: number;
	className?: string;
	disableAddNote?: boolean;
}

export function RecipeIngredientViewer({
	ingredient,
	multiplier = 1,
	className,
	disableAddNote,
}: RecipeIngredientViewerProps) {
	const { note, isSectionHeader, quantity, unit } = hooks.useWatch(ingredient);
	const officialUnit = lookupUnit(unit);

	const [showNote, toggleShowNote] = useToggle(false);

	const onNoteBlur = useCallback(() => {
		if (!note) {
			toggleShowNote();
		}
	}, [note, toggleShowNote]);

	const [conversion, setConversion] = useState<string>();

	const convertedValue = useMemo(() => {
		if (!conversion || !officialUnit) return undefined;
		const result = convertUnits(quantity)
			.from(officialUnit.abbr)
			.to(conversion);
		return `${fractionToText(result)} ${friendlyUnit(conversion, result <= 1)}`;
	}, [conversion, officialUnit, quantity]);

	const convertOptions: string[] = useMemo(() => {
		if (!officialUnit) return [];
		try {
			return convertUnits()
				.from(officialUnit.abbr)
				.possibilities()
				.filter((opt: string) => usefulUnits.includes(opt))
				.filter((opt: string) => opt !== officialUnit.abbr);
		} catch {
			return [];
		}
	}, [officialUnit]);

	const conversionEnabled =
		!!officialUnit && !!convertOptions.length && !isSectionHeader;

	return (
		<div
			className={classNames(
				classes.root,
				isSectionHeader && classes.sectionHeader,
				className,
			)}
		>
			<div className={classes.mainRow}>
				<IngredientText
					className={classes.text}
					multiplier={multiplier}
					ingredient={ingredient}
				/>
				<Box direction="row" gap={2} align="center">
					{conversionEnabled && (
						<>
							<DropdownMenu>
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
					{!disableAddNote && (
						<Button size="icon" color="ghost" onClick={toggleShowNote}>
							{!!note ? (
								<Icon
									name="note"
									className={showNote ? undefined : classes.noteIconWithNote}
								/>
							) : (
								<Icon name="add_note" className={classes.addNoteIcon} />
							)}
						</Button>
					)}
				</Box>
			</div>
			<CollapsibleRoot open={!!conversion} className={classes.conversion}>
				<CollapsibleContent className={classes.conversionContent}>
					<Span size="sm">Converted: {convertedValue}</Span>
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
	'tbsp',
	'pt',
	'qt',
	'gal',
	'fl oz',
	'cm',
	'm',
	'in',
	'ft',
];
