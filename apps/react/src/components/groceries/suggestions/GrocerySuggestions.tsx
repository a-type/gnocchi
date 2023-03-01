import { groceries, hooks } from '@/stores/groceries/index.js';
import {
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui';
import addWeeks from 'date-fns/addWeeks';
import startOfDay from 'date-fns/startOfDay';
import { title, titleRow } from '../categories/GroceryListCategory.css.js';
import classNames from 'classnames';
import * as classes from './GrocerySuggestions.css.js';
import { Food } from '@aglio/groceries-client';
import { CaretDownIcon, PlusIcon } from '@radix-ui/react-icons';
import { MagicIcon } from '@/components/icons/MagicIcon.jsx';
import addDays from 'date-fns/addDays';
import { Icon } from '@/components/icons/Icon.jsx';

export interface GrocerySuggestionsProps {}

const NOW = startOfDay(new Date()).getTime();
const SUGGESTION_INTERVAL_END = addDays(NOW, 5).getTime();

export function GrocerySuggestions({}: GrocerySuggestionsProps) {
	const guessedFoodsRaw = hooks.useAllFoods({
		index: {
			where: 'repurchaseAfter',
			gt: NOW,
			lt: SUGGESTION_INTERVAL_END,
			order: 'desc',
		},
	});
	const guessedFoods = guessedFoodsRaw.slice(0, 5);

	if (!guessedFoods.length) return null;

	return (
		<CollapsibleRoot defaultOpen className={classes.root}>
			<CollapsibleTrigger asChild>
				<div className={classNames(classes.trigger, titleRow)}>
					<CaretDownIcon className={classes.triggerIcon} />
					<div className={classNames(title, classes.title)}>Suggested</div>
					<Icon name="magic" className={classes.titleIcon} />
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className={classes.list}>
				{guessedFoods.map((food) => (
					<SuggestionItem key={food.get('canonicalName')} food={food} />
				))}
			</CollapsibleContent>
		</CollapsibleRoot>
	);
}

function SuggestionItem({ food }: { food: Food }) {
	return (
		<div className={classes.item}>
			<div className={classes.name}>{food.get('canonicalName')}</div>
			<Button
				size="icon"
				color="ghost"
				className={classes.addButton}
				onClick={async () => {
					await groceries.addItems([food.get('canonicalName')], {});
				}}
			>
				<PlusIcon />
			</Button>
		</div>
	);
}
