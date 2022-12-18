import { Button } from '@/components/primitives/index.js';
import { fractionToText } from '@aglio/tools';
import { Cross1Icon, MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import * as classes from './MultiplierStepper.css.js';

export interface MultiplierStepperProps {
	value: number;
	onChange: (value: number) => void;
	highlightChange?: boolean;
}

const STEPS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function MultiplierStepper({
	value,
	onChange,
	highlightChange,
}: MultiplierStepperProps) {
	const index = STEPS.indexOf(value);

	const increment = () => {
		if (index === STEPS.length - 1) {
			return;
		}
		onChange(STEPS[index + 1]);
	};

	const decrement = () => {
		if (index === 0) {
			return;
		}
		onChange(STEPS[index - 1]);
	};

	return (
		<div
			className={clsx(classes.container, {
				[classes.highlightChange]: !!highlightChange && value !== 1,
			})}
		>
			<Button
				className={classes.button}
				color="ghost"
				onClick={decrement}
				disabled={index === 0}
			>
				<MinusIcon />
			</Button>
			<div className={classes.display}>
				<Cross1Icon style={{ width: 10, height: 10 }} /> {fractionToText(value)}
			</div>
			<Button
				className={classes.button}
				color="ghost"
				onClick={increment}
				disabled={index === STEPS.length - 1}
			>
				<PlusIcon />
			</Button>
		</div>
	);
}
