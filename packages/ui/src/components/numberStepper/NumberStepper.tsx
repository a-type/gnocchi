import { Button } from '../../index.js';
import { fractionToText } from '@aglio/tools';
import {
	Cross1Icon,
	MinusIcon,
	PlusIcon,
} from '@radix-ui/react-icons/dist/react-icons.esm.js';
import { clsx } from 'clsx';
import { ReactNode } from 'react';
import * as classes from './NumberStepper.css.js';

export interface NumberStepperProps {
	value: number;
	onChange: (value: number) => void;
	highlightChange?: boolean;
	steps?: number[];
	increment?: number;
	renderValue?: (value: number) => ReactNode;
}

export function NumberStepper({
	value,
	onChange,
	highlightChange,
	steps,
	increment: incrementAmount = 1,
	renderValue = fractionToText,
}: NumberStepperProps) {
	const index = steps?.indexOf(value) ?? 0;

	const increment = () => {
		if (steps) {
			if (index === steps.length - 1) {
				return;
			}
			onChange(steps[index + 1]);
		} else {
			onChange(value + incrementAmount);
		}
	};

	const decrement = () => {
		if (steps) {
			if (index === 0) {
				return;
			}
			onChange(steps[index - 1]);
		} else {
			onChange(value - incrementAmount);
		}
	};

	const canIncrement = steps ? index < steps.length - 1 : true;
	const canDecrement = steps ? index > 0 : true;

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
				disabled={!canDecrement}
			>
				<MinusIcon />
			</Button>
			<div className={classes.display}>{renderValue(value)}</div>
			<Button
				className={classes.button}
				color="ghost"
				onClick={increment}
				disabled={!canIncrement}
			>
				<PlusIcon />
			</Button>
		</div>
	);
}
