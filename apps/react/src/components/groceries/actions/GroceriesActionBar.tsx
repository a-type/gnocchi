import { DeleteAllAction } from '@/components/groceries/actions/DeleteAllAction.jsx';
import { PurchaseAllAction } from '@/components/groceries/actions/PurchaseAllAction.jsx';
import { People } from '@/components/sync/people/People.jsx';
import { ActionBar } from '@aglio/ui/components/actions';
import { MeetupAction } from './MeetupAction.jsx';
import { RedoAction } from './RedoAction.jsx';
import { UndoAction } from './UndoAction.jsx';

export interface GroceriesActionBarProps {}

export function GroceriesActionBar({}: GroceriesActionBarProps) {
	return (
		<ActionBar>
			<People hideIfAlone />
			<UndoAction />
			<RedoAction />
			<MeetupAction />
			<PurchaseAllAction />
			<DeleteAllAction />
		</ActionBar>
	);
}
