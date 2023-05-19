import { Person, hooks } from '@/stores/groceries/index.js';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItemRoot as SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectLabel,
	SelectProps,
	SelectTrigger,
	SelectValue,
} from '@aglio/ui/components/select';
import { useCallback } from 'react';
import { PersonAvatar } from './PersonAvatar.jsx';

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
			<SelectTrigger
				className="border-none p-0 rounded-full [&[data-state=open]]:scale-[1.05]"
				contentEditable={false}
			>
				<SelectValue contentEditable={false}>
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
						<SelectItem
							className="flex flex-row gap-2 items-center"
							value="null"
						>
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
		<SelectItem value={person.id} className="flex flex-row gap-2 items-center">
			<PersonAvatar popIn={false} person={person} />
			<SelectItemText>{person.profile.name}</SelectItemText>
			<SelectItemIndicator />
		</SelectItem>
	);
}
