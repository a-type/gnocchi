import { useRecipeTitleFilter } from '@/components/recipes/collection/hooks.js';
import { Button } from '@aglio/ui/src/components/button';
import { LiveUpdateTextField } from '@aglio/ui/src/components/liveUpdateTextField';
import { Cross2Icon } from '@radix-ui/react-icons';

export function RecipeSearchBar(props: { className?: string }) {
	const [value, setValue] = useRecipeTitleFilter();

	return (
		<div className="flex flex-row gap-3">
			<LiveUpdateTextField
				placeholder="Search recipes"
				value={value}
				onChange={setValue}
				{...props}
			/>
			{!!value && (
				<Button size="icon" color="ghost" onClick={() => setValue('')}>
					<Cross2Icon />
				</Button>
			)}
		</div>
	);
}
