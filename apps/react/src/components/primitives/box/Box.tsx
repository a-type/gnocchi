import {
	createElement,
	AllHTMLAttributes,
	ElementType,
	forwardRef,
} from 'react';
import { clsx } from 'clsx';
import * as resetStyles from '@/styles/reset.css.js';
import { sprinkles, Sprinkles } from '@/styles/sprinkles.css.js';

export interface BoxProps
	extends Omit<
			AllHTMLAttributes<HTMLElement>,
			| 'className'
			| 'content'
			| 'height'
			| 'translate'
			| 'color'
			| 'width'
			| 'cursor'
			| 'as'
		>,
		Sprinkles {
	as?: ElementType;
	className?: Parameters<typeof clsx>[0];
}

export const Box = forwardRef<any, BoxProps>(function Box(
	{
		as: asProp = 'div',
		className,
		padding,
		paddingX,
		paddingY,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		margin,
		marginX,
		marginY,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		display,
		alignItems,
		justifyContent,
		flexDirection,
		flexWrap,
		flexGrow,
		flexShrink,
		borderRadius,
		position,
		top,
		bottom,
		left,
		right,
		inset,
		background,
		color,
		width,
		zIndex,
		opacity,
		pointerEvents,
		cursor,
		textAlign,
		minWidth,
		transition,
		overflow,
		mx,
		my,
		px,
		py,
		m,
		p,
		mb,
		mt,
		ml,
		mr,
		pb,
		pt,
		pl,
		pr,
		gap,
		align,
		justify,
		maxWidth,
		direction,
		...restProps
	},
	ref,
) {
	const atomClasses = clsx(
		resetStyles.base,
		resetStyles.element[asProp as keyof typeof resetStyles.element],
		sprinkles({
			padding: p ?? padding,
			paddingX: px ?? paddingX,
			paddingY: py ?? paddingY,
			paddingTop: pt ?? paddingTop,
			paddingBottom: pb ?? paddingBottom,
			paddingLeft: pl ?? paddingLeft,
			paddingRight: pr ?? paddingRight,
			margin: m ?? margin,
			marginX: mx ?? marginX,
			marginY: my ?? marginY,
			marginTop: mt ?? marginTop,
			marginBottom: mb ?? marginBottom,
			marginLeft: ml ?? marginLeft,
			marginRight: mr ?? marginRight,
			display: display ?? 'flex',
			alignItems: align ?? alignItems,
			justifyContent: justify ?? justifyContent,
			flexDirection: direction ?? flexDirection ?? 'column',
			flexWrap,
			flexGrow,
			flexShrink,
			borderRadius,
			position,
			top,
			bottom,
			left,
			right,
			inset,
			background,
			color,
			width,
			zIndex,
			opacity,
			pointerEvents,
			cursor,
			textAlign,
			minWidth,
			maxWidth,
			transition,
			overflow,
			gap,
		}),
		className,
	);

	return createElement(asProp, { className: atomClasses, ref, ...restProps });
});