import { useSearch } from '@/components/pantry/hooks.js';
import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';

export function PantrySearch() {
	const [search, setSearch] = useSearch();
	return (
		<LiveUpdateTextField
			placeholder="Search foods"
			value={search}
			onChange={setSearch}
		/>
	);
}
