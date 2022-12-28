import { vars } from '@/theme.css.js';
import {
	defineProperties,
	createSprinkles,
	createMapValueFn,
	createNormalizeValueFn,
	ConditionalValue,
} from '@vanilla-extract/sprinkles';
import { calc } from '@vanilla-extract/css-utils';
// for specificity's sake...
import './reset.css.js';

function mapValues<In, Out>(
	values: Record<string, In>,
	fn: (value: In) => Out,
) {
	let result: Record<string, Out> = {};
	for (const key in values) {
		result[key] = fn(values[key]);
	}
	return result;
}

const negativeSpace = {
	['-1']: `${calc(vars.space[1]).negate()}`,
	['-2']: `${calc(vars.space[2]).negate()}`,
	['-3']: `${calc(vars.space[3]).negate()}`,
	['-4']: `${calc(vars.space[4]).negate()}`,
	['-5']: `${calc(vars.space[5]).negate()}`,
	['-6']: `${calc(vars.space[6]).negate()}`,
	['-7']: `${calc(vars.space[7]).negate()}`,
	['-8']: `${calc(vars.space[8]).negate()}`,
	['-9']: `${calc(vars.space[9]).negate()}`,
	['-10']: `${calc(vars.space[10]).negate()}`,
	['-11']: `${calc(vars.space[11]).negate()}`,
	['-12']: `${calc(vars.space[12]).negate()}`,
};

const margins = {
	auto: 'auto',
	...vars.space,
	...negativeSpace,
};

const breakpoints = {
	mobile: 0,
	tablet: 640,
	desktop: 1024,
};

const responsiveProperties = defineProperties({
	conditions: mapValues(breakpoints, (bp) => {
		if (bp === 0) return {};
		return { '@media': `screen and (min-width: ${bp}px)` };
	}),
	defaultCondition: 'mobile',
	properties: {
		position: ['absolute', 'relative', 'fixed', 'sticky'],
		display: ['block', 'inline-block', 'inline', 'flex', 'grid', 'none'],
		flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
		alignItems: [
			'flex-start',
			'flex-end',
			'center',
			'baseline',
			'stretch',
			'start',
			'end',
		],
		justifyContent: [
			'flex-start',
			'flex-end',
			'center',
			'space-between',
			'space-around',
			'space-evenly',
			'start',
			'end',
			'stretch',
		],
		alignContent: [
			'flex-start',
			'flex-end',
			'center',
			'space-between',
			'space-around',
			'space-evenly',
			'stretch',
			'start',
			'end',
		],
		alignSelf: [
			'auto',
			'flex-start',
			'flex-end',
			'center',
			'baseline',
			'stretch',
			'start',
			'end',
		],
		justifySelf: [
			'auto',
			'flex-start',
			'flex-end',
			'center',
			'stretch',
			'start',
			'end',
		],
		overflow: ['visible', 'hidden', 'scroll', 'auto'],
		overflowX: ['visible', 'hidden', 'scroll', 'auto'],
		overflowY: ['visible', 'hidden', 'scroll', 'auto'],
		paddingTop: vars.space,
		paddingRight: vars.space,
		paddingBottom: vars.space,
		paddingLeft: vars.space,
		marginTop: margins,
		marginRight: margins,
		marginBottom: margins,
		marginLeft: margins,
		gap: vars.space,
		pointerEvents: ['auto', 'none'],
		opacity: [0, 1],
		textAlign: ['left', 'right', 'center', 'justify'],
		minWidth: [0, '100%'],
		minHeight: [0, '100%'],
		maxWidth: vars.sizes,
		transition: vars.transitions,
		fill: { ...vars.colors, currentColor: 'currentColor' },
		stroke: { ...vars.colors, currentColor: 'currentColor' },
		strokeWidth: [0, 1],
	},
	shorthands: {
		padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
		p: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
		paddingX: ['paddingLeft', 'paddingRight'],
		paddingY: ['paddingTop', 'paddingBottom'],
		px: ['paddingLeft', 'paddingRight'],
		py: ['paddingTop', 'paddingBottom'],
		pb: ['paddingBottom'],
		pt: ['paddingTop'],
		pl: ['paddingLeft'],
		pr: ['paddingRight'],
		margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
		m: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
		marginX: ['marginLeft', 'marginRight'],
		marginY: ['marginTop', 'marginBottom'],
		mx: ['marginLeft', 'marginRight'],
		my: ['marginTop', 'marginBottom'],
		mb: ['marginBottom'],
		mt: ['marginTop'],
		ml: ['marginLeft'],
		mr: ['marginRight'],
		align: ['alignItems'],
		justify: ['justifyContent'],
		direction: ['flexDirection'],
	},
});

export const mapResponsiveValue = createMapValueFn(responsiveProperties);
export const normalizeResponsiveValue =
	createNormalizeValueFn(responsiveProperties);

export type ResponsiveValue<Value extends string | number> = ConditionalValue<
	typeof responsiveProperties,
	Value
>;

export const lightMode = 'light';
export const darkMode = 'dark';

const colorProperties = defineProperties({
	conditions: {
		lightMode: {},
		darkMode: { selector: `.${darkMode} & ` },
	},
	defaultCondition: 'lightMode',
	properties: {
		background: vars.colors,
		color: vars.colors,
	},
});

const unresponsiveProperties = defineProperties({
	properties: {
		flexWrap: ['wrap', 'nowrap', 'wrap-reverse'],
		top: [0],
		right: [0],
		bottom: [0],
		left: [0],
		flexShrink: [0],
		flexGrow: [0, 1],
		zIndex: vars.zIndices,
		width: {
			full: '100%',
			minContent: 'min-content',
			maxContent: 'max-content',
			auto: 'auto',
		},
		borderRadius: vars.radii,
		cursor: ['pointer', 'default'],
		borderWidth: vars.borderWidths,
		borderColor: vars.colors,
		borderStyle: ['solid', 'dashed', 'dotted', 'none'],
		fontWeight: vars.fontWeights,
		fontSize: vars.fontSizes,
		fontFamily: vars.fonts,
	},
	shorthands: {
		inset: ['top', 'bottom', 'left', 'right'],
		flex: ['flexGrow'],
	},
});

export const sprinkles = createSprinkles(
	responsiveProperties,
	unresponsiveProperties,
	colorProperties,
);

export type Sprinkles = Parameters<typeof sprinkles>[0];
