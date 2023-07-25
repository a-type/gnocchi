import { useSearch } from '@/components/pantry/hooks.js';
import { Button } from '@aglio/ui/components/button';
import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';
import { Cross2Icon } from '@radix-ui/react-icons';

export function PantrySearch() {
	const [search, setSearch] = useSearch();
	return (
		<div className="flex flex-row gap-1 items-stretch">
			<LiveUpdateTextField
				placeholder="Search foods"
				value={search}
				onChange={setSearch}
				className="flex-1"
			/>
			{!!search && (
				<Button size="small" color="default" onClick={() => setSearch('')}>
					<Cross2Icon />
				</Button>
			)}
		</div>
	);
}
