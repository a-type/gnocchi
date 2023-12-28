import { DeleteAllAction } from '@/components/groceries/actions/DeleteAllAction.jsx';
import { PurchaseAllAction } from '@/components/groceries/actions/PurchaseAllAction.jsx';
import { ActionBar } from '@a-type/ui/components/actions';
import { MeetupAction } from './MeetupAction.jsx';
import { RedoAction } from './RedoAction.jsx';
import { UndoAction } from './UndoAction.jsx';

export interface GroceriesActionBarProps {}

export function GroceriesActionBar({}: GroceriesActionBarProps) {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<MeetupAction />
			<PurchaseAllAction />
			<DeleteAllAction />
		</ActionBar>
	);
}
