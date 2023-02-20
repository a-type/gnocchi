import classNames from 'classnames';
import * as classes from './NoteEditor.css.js';
import { LiveUpdateTextField, Note } from '@aglio/ui';

export interface NoteEditorProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

export function NoteEditor({ className, value, onChange }: NoteEditorProps) {
	return (
		<Note className={classNames(classes.note, className)}>
			<LiveUpdateTextField
				className={classes.unstyledTextarea}
				textArea
				value={value}
				onChange={onChange}
			/>
		</Note>
	);
}
