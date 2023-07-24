import { RedoAction } from '@/components/groceries/actions/RedoAction.jsx';
import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { ActionBar, ActionButton } from '@aglio/ui/components/actions';
import { AddItemAction } from './AddItemAction.jsx';
import { useFilter } from '@/components/pantry/hooks.js';
import { Icon } from '@/components/icons/Icon.jsx';

export interface PantryActionBarProps {}

export function PantryActionBar({}: PantryActionBarProps) {
	const [filter, setFilter] = useFilter();
	const toggleFilter = () => {
		setFilter(filter === 'all' ? 'purchased' : 'all');
	};
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<AddItemAction />
			<ActionButton onClick={toggleFilter} icon={<Icon name="filter" />}>
				{filter === 'all' ? 'All' : 'Only Purchased'}
			</ActionButton>
		</ActionBar>
	);
}
