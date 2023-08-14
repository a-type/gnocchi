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
		<div className="flex flex-row gap-3">
			<LiveUpdateTextField
				placeholder="Search recipes"
				value={value}
				onChange={setValue}
				className={classNames('rounded-full', className)}
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
