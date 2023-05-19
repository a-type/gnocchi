import { fractionToText } from '@aglio/tools';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { Button } from '../button.js';

export interface NumberStepperProps {
	value: number;
	onChange: (value: number) => void;
	highlightChange?: boolean;
	steps?: number[];
	increment?: number;
	renderValue?: (value: number) => ReactNode;
	className?: string;
}

export function NumberStepper({
	value,
	onChange,
	highlightChange,
	steps,
	increment: incrementAmount = 1,
	renderValue = fractionToText,
	className,
	...rest
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
			className={classNames(
				'flex items-center border-default rounded-lg overflow-hidden w-min-content flex-shrink-0',
				{
					'bg-accent-wash color-black': !!highlightChange && value !== 1,
				},
				className,
			)}
			{...rest}
		>
			<Button color="ghost" onClick={decrement} disabled={!canDecrement}>
				<MinusIcon />
			</Button>
			<div className="w-80px text-center">{renderValue(value)}</div>
			<Button color="ghost" onClick={increment} disabled={!canIncrement}>
				<PlusIcon />
			</Button>
		</div>
	);
}
