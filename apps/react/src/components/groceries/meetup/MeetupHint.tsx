import { MeetupSelect } from '@/components/sync/meetup/MeetupSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';

export function MeetupHint() {
	const peers = hooks.usePeerIds();

	if (peers.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col items-center justify-center flex-grow-1 text-center gap-3 p-4">
			<p className="color-gray-7 italic text-sm max-w-300px">
				Time to regroup? Pick a location to meet up.
			</p>
			<label htmlFor="meetupHintSelect" className="text-xs color-gray-7 italic">
				Meet at:
			</label>
			<MeetupSelect id="meetupHintSelect" emptyLabel="Choose..." />
		</div>
	);
}
