import { useRecipeTitleFilter } from '@/components/recipes/collection/hooks.js';
import { Button } from '@aglio/ui/src/components/button';
import { LiveUpdateTextField } from '@aglio/ui/src/components/liveUpdateTextField';
import { Cross2Icon } from '@radix-ui/react-icons';
import classNames from 'classnames';

export function RecipeSearchBar({
	className,
	...props
}: {
	className?: string;
}) {
	const [value, setValue] = useRecipeTitleFilter();

	return (
		<div className={classNames('flex flex-row gap-3', className)}>
			<LiveUpdateTextField
				placeholder="Search recipes"
				value={value}
				onChange={setValue}
				className="rounded-full flex-1"
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
