import { useRecipeTitleFilter } from '@/components/recipes/collection/hooks.js';
import { LiveUpdateTextField } from '@aglio/ui/src/components/liveUpdateTextField';

export function RecipeSearchBar(props: { className?: string }) {
	const [value, setValue] = useRecipeTitleFilter();

	return (
		<LiveUpdateTextField
			placeholder="Search recipes"
			value={value}
			onChange={setValue}
			{...props}
		/>
	);
}
