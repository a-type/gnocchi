import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const categoryContent = style({
	zIndex: `calc(${vars.zIndices.dialog} + 10)`,
});
