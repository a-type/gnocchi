import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { RecipeInstructionsDocument } from '@/lib/tiptap.js';
import { Link } from '@verdant-web/react-router';
import { ConfirmedButton } from '@aglio/ui/src/components/button';
import { Cross2Icon } from '@radix-ui/react-icons';

export function RecipeNowPlayingLink({ recipe }: { recipe: Recipe }) {
	const { title, instructions, session } = hooks.useWatch(recipe);

	const rawInstructions =
		instructions.getSnapshot() as RecipeInstructionsDocument | null;
	const stepsLength =
		rawInstructions?.content.filter((c) => c.type === 'step').length ?? 0;

	hooks.useWatch(session);
	const completedSteps = session?.get('completedInstructions').length ?? 0;

	const progress = stepsLength > 0 ? completedSteps / stepsLength : 0;

	const stopCooking = () => {
		recipe.set('session', null);
	};

	return (
		<div className="flex flex-row items-center justify-between gap-2 pr-2">
			<Link
				to={makeRecipeLink(recipe, '')}
				className="flex flex-row gap-2 items-center p-2 w-full overflow-hidden"
			>
				<PieProgress value={progress} />
				<div className="font-bold max-w-full text-ellipsis whitespace-nowrap text-sm overflow-hidden min-w-0">
					{title}
				</div>
			</Link>
			<ConfirmedButton
				confirmText="This will reset recipe progress"
				confirmTitle={`Stop cooking ${title}?`}
				confirmAction="Stop"
				cancelAction="Keep Cooking"
				onConfirm={stopCooking}
				color="ghost"
				skip={progress === 1}
			>
				<Cross2Icon />
			</ConfirmedButton>
		</div>
	);
}

function PieProgress({ value }: { value: number }) {
	const circumference = 32 * Math.PI;
	return (
		<svg
			viewBox="0 0 32 32"
			className="w-32px h-32px flex-shrink-0 rounded-full overflow-hidden border-light"
		>
			<circle
				r="50%"
				cx="50%"
				cy="50%"
				strokeDasharray="100"
				strokeDashoffset="100"
				className="fill-gray2"
			/>
			<circle
				r="50%"
				cx="50%"
				cy="50%"
				fill="transparent"
				strokeDasharray={`${value * circumference} ${circumference}`}
				className="stroke-primary stroke-32px transform rotate-270 origin-center"
				opacity={0.7 + value * 0.3}
			/>
			{value >= 1 && (
				<>
					<circle r="50%" cx="50%" cy="50%" className="fill-accent" />
					<path
						d="M 12 16 L 16 20 L 22 12"
						fill="none"
						className="stroke-white stroke-2"
					/>
				</>
			)}
		</svg>
	);
}
