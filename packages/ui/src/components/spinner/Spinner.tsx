import { HTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import * as classes from './Spinner.css.js';
import { Box } from '../box.js';

const CIRCLE_SIZE = 44;

export interface SpinnerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	size?: number;
	thickness?: number;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
	function Spinner(
		{ size = 40, thickness = 7.2, className, style, ...props },
		ref,
	) {
		return (
			<div
				ref={ref}
				role="progressbar"
				{...props}
				className={classNames(classes.root, className)}
				style={{ width: size, height: size, ...style }}
			>
				<svg
					className={classes.svg}
					viewBox={`${CIRCLE_SIZE / 2} ${
						CIRCLE_SIZE / 2
					} ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
				>
					<circle
						className={classes.circle}
						cx={CIRCLE_SIZE}
						cy={CIRCLE_SIZE}
						r={(CIRCLE_SIZE - thickness) / 2}
						fill="none"
						strokeWidth={thickness}
					/>
				</svg>
			</div>
		);
	},
);

export const FullScreenSpinner = forwardRef<HTMLDivElement, SpinnerProps>(
	function FullScreenSpinner(props, ref) {
		return (
			<Box
				ref={ref}
				direction="row"
				gap={4}
				width="full"
				flex={1}
				justifyContent="center"
				alignItems="center"
				alignSelf="stretch"
			>
				<Spinner {...props} />
			</Box>
		);
	},
);
