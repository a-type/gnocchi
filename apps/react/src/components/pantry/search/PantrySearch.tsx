import { useSearch } from '@/components/pantry/hooks.js';
import { Button } from '@a-type/ui/components/button';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { Cross2Icon } from '@radix-ui/react-icons';

export function PantrySearch() {
	const [search, setSearch] = useSearch();
	return (
		<div className="flex flex-row gap-1 items-center">
			<LiveUpdateTextField
				placeholder="Search foods"
				value={search}
				onChange={setSearch}
				className="flex-1 rounded-full"
			/>
			{!!search && (
				<Button size="icon" color="default" onClick={() => setSearch('')}>
					<Cross2Icon />
				</Button>
			)}
		</div>
	);
}
