import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import classNames from 'classnames';
import * as classes from './RecipeNowPlayingLink.css.js';
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
		<div className={classes.root}>
			<Link
				to={makeRecipeLink(recipe, '/cook/steps')}
				className={classes.recipeLink}
			>
				<PieProgress value={progress} />
				<div className={classes.recipeTitle}>{title}</div>
			</Link>
			<ConfirmedButton
				confirmText="This will reset recipe progress"
				confirmTitle={`Stop cooking ${title}?`}
				confirmAction="Stop Cooking"
				onConfirm={stopCooking}
				color="ghost"
			>
				<Cross2Icon />
			</ConfirmedButton>
		</div>
	);
}

function PieProgress({ value }: { value: number }) {
	const circumference = 32 * Math.PI;
	return (
		<svg viewBox="0 0 32 32" className={classes.pieProgress}>
			<circle
				r="50%"
				cx="50%"
				cy="50%"
				strokeDasharray="100"
				strokeDashoffset="100"
				className={classes.pieProgressBackground}
			/>
			<circle
				r="50%"
				cx="50%"
				cy="50%"
				fill="transparent"
				strokeDasharray={`${value * circumference} ${circumference}`}
				className={classes.pieProgressForeground}
				opacity={0.7 + value * 0.3}
			/>
			{value >= 1 && (
				<>
					<circle
						r="50%"
						cx="50%"
						cy="50%"
						className={classes.pieProgressComplete}
					/>
					<path
						d="M 12 16 L 16 20 L 22 12"
						fill="none"
						className={classes.pieProgressCheck}
					/>
				</>
			)}
		</svg>
	);
}
