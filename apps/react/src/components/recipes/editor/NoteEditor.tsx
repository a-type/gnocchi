import classNames from 'classnames';
import * as classes from './NoteEditor.css.js';
import { LiveUpdateTextField, Note } from '@aglio/ui';

export interface NoteEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	autoFocus?: boolean;
	onBlur?: () => void;
}

export function NoteEditor({
	className,
	autoFocus,
	value,
	onChange,
	onBlur,
}: NoteEditorProps) {
	return (
		<Note className={classNames(classes.note, className)}>
			<LiveUpdateTextField
				className={classes.unstyledTextarea}
				textArea
				value={value}
				onChange={onChange}
				autoFocus={autoFocus}
				onBlur={onBlur}
			/>
		</Note>
	);
}
