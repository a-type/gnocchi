import classNames from 'classnames';
import { Note } from '@aglio/ui/components/note';
import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';

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
		<Note className={classNames('focus-within:shadow-focus', className)}>
			<LiveUpdateTextField
				className="important:(border-none outline-none resize-none w-full rounded-none h-full p-0 m-0 [font-family:inherit] text-inherit [font-size:inherit] [font-style:inherit] bg-inherit focus:(outline-none bg-transparent border-transparent shadow-none))"
				textArea
				value={value}
				onChange={onChange}
				autoFocus={autoFocus}
				onBlur={onBlur}
			/>
		</Note>
	);
}
