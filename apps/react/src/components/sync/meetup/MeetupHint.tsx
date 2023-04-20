import { hooks } from '@/stores/groceries/index.js';
import { MeetupIcon } from './MeetupIcon.jsx';
import classNames from 'classnames';
import * as classes from './MeetupHint.css.js';

export interface MeetupHintProps {
	className?: string;
}

export function MeetupHint({ className, ...props }: MeetupHintProps) {
	const info = hooks.useCollaborationInfo('default');
	hooks.useWatch(info);
	const meetup = info?.get('meetup');

	if (meetup && meetup.get('createdAt') > Date.now() - 1000 * 60 * 60) {
		return (
			<div className={classNames(classes.root, className)} {...props}>
				<MeetupIcon />
			</div>
		);
	}

	return null;
}
