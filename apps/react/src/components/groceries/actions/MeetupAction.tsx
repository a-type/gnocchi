import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import { SelectValue } from '@/components/primitives/select/Select.jsx';
import { MeetupIcon } from '@/components/sync/meetup/MeetupIcon.jsx';
import { MeetupSelect } from '@/components/sync/meetup/MeetupSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';

export interface MeetupActionProps {}

export function MeetupAction({}: MeetupActionProps) {
	const hasPeers = hooks.usePeerIds().length > 0;

	return (
		<MeetupSelect>
			{(location) => (
				<ActionButton
					size="small"
					icon={<MeetupIcon />}
					color={!!location ? 'accent' : 'default'}
					visible={hasPeers}
				>
					<SelectValue />
				</ActionButton>
			)}
		</MeetupSelect>
	);
}
