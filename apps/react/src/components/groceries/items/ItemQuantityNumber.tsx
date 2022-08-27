import React, { forwardRef } from 'react';
import { styled } from 'stitches.config.js';
import { animated, config, useSpring } from '@react-spring/web';

export interface ItemQuantityNumberProps {
	className?: string;
	value: number;
}

/**
 * Animates quantity changes to draw user attention to merged items
 */
export const ItemQuantityNumber = forwardRef<
	HTMLSpanElement,
	ItemQuantityNumberProps
>(function ItemQuantityNumber({ value, ...rest }, ref) {
	const { value: animatedNumber } = useSpring({
		value,
		config: config.slow,
	});
	return (
		<StyledSpan ref={ref} {...rest}>
			{animatedNumber.to((n) => Math.round(n))}
		</StyledSpan>
	);
});

const StyledSpan = styled(animated.span, {
	display: 'inline-block',
});
