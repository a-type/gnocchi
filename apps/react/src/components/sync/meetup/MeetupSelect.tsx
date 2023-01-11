import {
	Select,
	SelectContent,
	SelectGroup,
	SelectIcon,
	SelectItem,
	SelectItemRoot,
	SelectItemText,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	UnstyledSelectTrigger,
} from '@/components/primitives/select/Select.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ReactNode, useCallback, useEffect } from 'react';
import * as classes from './MeetupSelect.css.js';
import { Button } from '@/components/primitives/index.js';
import { Cross2Icon } from '@radix-ui/react-icons';

export interface MeetupSelectProps {
	children?: (value: string | undefined) => ReactNode;
}

export function MeetupSelect({ children }: MeetupSelectProps) {
	const client = hooks.useClient();
	const info = hooks.useCollaborationInfo('default');
	hooks.useWatch(info);
	const meetup = info?.get('meetup') ?? null;
	hooks.useWatch(meetup);

	useEffect(() => {
		if (!info) {
			client.collaborationInfo.put({});
		}
	}, [info]);

	let location = meetup?.get('location');
	const createdAt = meetup?.get('createdAt') || 0;
	if (createdAt < Date.now() - 1000 * 60 * 60) {
		location = undefined;
	}

	const categories = hooks.useAllCategories();
	const options = categories.map((cat) => cat.get('name'));

	const setMeetup = useCallback(
		(value: string) => {
			client
				.batch({ undoable: false })
				.run(() => {
					info?.set('meetup', {
						location: value,
					});
				})
				.flush();
		},
		[info, client],
	);
	const clearMeetup = useCallback(() => {
		info?.set('meetup', undefined);
	}, [info]);
	const Trigger = children ? UnstyledSelectTrigger : SelectTrigger;

	return (
		<Select value={location || ''} onValueChange={setMeetup}>
			<Trigger asChild={!!children}>
				{children ? (
					children(location)
				) : (
					<>
						<SelectValue />
						<SelectIcon />
					</>
				)}
			</Trigger>
			<SelectContent>
				<SelectItem value="">{location ? 'Clear' : 'Regroup'}</SelectItem>
				<SelectGroup>
					<SelectLabel>Choose a location</SelectLabel>
					<SelectItem value="Checkout Lanes">Checkout Lanes</SelectItem>
					<SelectItem value="Self Checkout">Self Checkout</SelectItem>
					{options.map((option) => (
						<SelectItem value={option} key={option}>
							{option}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
