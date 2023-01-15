import {
	Select,
	SelectContent,
	SelectItemRoot as SelectItem,
	SelectTrigger,
	SelectValue,
	SelectItemText,
	SelectItemIndicator,
	SelectLabel,
	SelectGroup,
	SelectProps,
} from '@/components/primitives/select/Select.jsx';
import { hooks, Person } from '@/stores/groceries/index.js';
import { useCallback } from 'react';
import { PersonAvatar } from './PersonAvatar.jsx';
import classnames from 'classnames';
import * as classes from './PersonSelect.css.js';
import {} from '@radix-ui/react-select';

export interface PersonSelectProps
	extends Omit<SelectProps, 'value' | 'onChange'> {
	filter?: (person: Person) => boolean;
	includeSelf?: boolean;
	allowNone?: boolean;
	value: string | null;
	onChange: (value: string | null, person: Person | null) => void;
	label?: string;
}

function everyone() {
	return true;
}

export function PersonSelect({
	filter = everyone,
	includeSelf = false,
	value,
	allowNone,
	onChange,
	label,
	...rest
}: PersonSelectProps) {
	const people = hooks.useFindPeers(filter, { includeSelf });

	const onChangeInternal = useCallback(
		(value: string) => {
			const person = people.find((person) => person.id === value);
			onChange(value === 'null' ? null : value, person || null);
		},
		[people, onChange],
	);

	return (
		<Select
			value={value === null ? 'null' : value}
			onValueChange={onChangeInternal}
			{...rest}
		>
			<SelectTrigger className={classes.trigger} contentEditable={false}>
				<SelectValue>
					{value === null ? (
						<PersonAvatar popIn={false} person={null} />
					) : (
						<PersonAvatar
							popIn={false}
							person={people.find((person) => person.id === value) || null}
						/>
					)}
				</SelectValue>
			</SelectTrigger>

			<SelectContent>
				<SelectGroup>
					{label && <SelectLabel>{label}</SelectLabel>}
					{allowNone && (
						<SelectItem className={classes.item} value="null">
							<PersonAvatar popIn={false} person={null} />{' '}
							<SelectItemText>None</SelectItemText>
							<SelectItemIndicator />
						</SelectItem>
					)}
					{people.map((person) => (
						<PersonSelectItem key={person.id} person={person} />
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function PersonSelectItem({ person }: { person: Person }) {
	return (
		<SelectItem value={person.id} className={classes.item}>
			<PersonAvatar popIn={false} person={person} />
			<SelectItemText>{person.profile.name}</SelectItemText>
			<SelectItemIndicator />
		</SelectItem>
	);
}
