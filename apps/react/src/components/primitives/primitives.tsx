import useMergedRef from '@/hooks/useMergedRef.js';
import React, {
	ComponentProps,
	ComponentPropsWithRef,
	forwardRef,
	HTMLProps,
	useLayoutEffect,
	useRef,
} from 'react';
import { styled } from '@/stitches.config.js';

const BaseBox = styled('div' as const, {
	display: 'flex',
	variants: {
		w: {
			initial: {},
			full: {
				width: '$full',
			},
			auto: {
				width: 'auto',
			},
		},
		h: {
			initial: {},
			full: {
				height: '$full',
			},
			auto: {
				height: 'auto',
			},
		},
		p: {
			unset: {},
			0: { p: 0 },
			1: { p: '$1' },
			2: { p: '$2' },
			3: { p: '$3' },
			4: { p: '$4' },
			5: { p: '$5' },
			6: { p: '$6' },
			7: { p: '$7' },
			8: { p: '$8' },
		},

		m: {
			unset: {},
			0: { m: 0 },
			1: { m: '$1' },
			2: { m: '$2' },
			3: { m: '$3' },
			4: { m: '$4' },
			5: { m: '$5' },
			6: { m: '$6' },
			7: { m: '$7' },
			8: { m: '$8' },
		},

		direction: {
			row: {
				flexDirection: 'row',
			},
			rowReverse: {
				flexDirection: 'row-reverse',
			},
			column: {
				flexDirection: 'column',
			},
			columnReverse: {
				flexDirection: 'column-reverse',
			},
		},

		flex: {
			initial: {},
			1: { flex: 1 },
			2: { flex: 2 },
		},

		align: {
			initial: {},
			center: {
				alignItems: 'center',
			},
			start: {
				alignItems: 'flex-start',
			},
			end: {
				alignItems: 'flex-end',
			},
			stretch: {
				alignItems: 'stretch',
			},
		},

		justify: {
			initial: {},
			center: {
				justifyContent: 'center',
			},
			start: {
				justifyContent: 'flex-start',
			},
			end: {
				justifyContent: 'flex-end',
			},
			stretch: {
				justifyContent: 'stretch',
			},
			spaceBetween: {
				justifyContent: 'space-between',
			},
			spaceAround: {
				justifyContent: 'space-around',
			},
		},

		gap: {
			unset: {
				gap: 'unset',
			},
			auto: {
				gap: 'auto',
			},
			0: {
				gap: 0,
			},
			1: {
				gap: '$1',
			},
			2: {
				gap: '$2',
			},
			3: {
				gap: '$3',
			},
			4: {
				gap: '$4',
			},
			5: {
				gap: '$5',
			},
			6: {
				gap: '$6',
			},
			7: {
				gap: '$7',
			},
			8: {
				gap: '$8',
			},
			9: {
				gap: '$9',
			},
			10: {
				gap: '$10',
			},
			12: {
				gap: '$12',
			},
			14: {
				gap: '$14',
			},
			16: {
				gap: '$16',
			},
			24: {
				gap: '$24',
			},
			32: {
				gap: '$32',
			},
		},
	},

	defaultVariants: {
		p: 'unset',
		align: 'initial',
		justify: 'initial',
		direction: 'column',
		w: 'initial',
		h: 'initial',
		flex: 'initial',
	},
});
export const Box = BaseBox;

export const Input = styled('input' as const, {
	px: '$3',
	py: '$2',
	fontSize: '$md',
	fontFamily: '$sans',
	borderRadius: '$md',
	backgroundColor: '$grayBlend',
	userSelect: 'auto',
	minWidth: 120,

	border: '1px solid currentColor',

	'&:focus': {
		outline: 'none',
		backgroundColor: '$gray30',
	},
	'&:focus-visible': {
		outline: 'none',
		boxShadow: '$focus',
	},
});
export type InputProps = ComponentPropsWithRef<typeof Input>;

export interface TextAreaProps
	extends Omit<HTMLProps<HTMLTextAreaElement>, 'ref'> {
	className?: string;
	autoSize?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	function TextArea({ autoSize, ...rest }, ref) {
		const innerRef = useRef<HTMLTextAreaElement>(null);
		const finalRef = useMergedRef(innerRef, ref);

		useLayoutEffect(() => {
			if (!autoSize) return;
			const element = innerRef.current;
			if (element) {
				function refresh() {
					element!.style.height = 'auto';
					if (element!.value !== '') {
						element!.style.height = element!.scrollHeight + 'px';
					}
				}
				refresh();

				element.addEventListener('keyup', refresh);
				return () => {
					element.removeEventListener('keyup', refresh);
				};
			}
		}, [autoSize]);

		return (
			<StyledTextArea
				ref={finalRef}
				{...rest}
				rows={autoSize ? 1 : rest.rows}
			/>
		);
	},
);

const StyledTextArea = styled('textarea' as const, {
	fontFamily: 'inherit',
	fontSize: 'inherit',
	overflow: 'hidden',
});

export const Button = styled('button' as const, {
	$$bg: 'transparent',
	$$active: '$colors$grayDarkBlend',

	'-webkit-tap-highlight-color': 'transparent',

	background: '$$bg',
	px: '$3',
	py: '$2',
	fontSize: '$md',
	fontFamily: '$sans',
	border: 'none',
	borderRadius: '$md',
	cursor: 'pointer',
	fontWeight: 'bold',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',

	// expanding background
	position: 'relative',
	overflow: 'visible',

	userSelect: 'none',

	transition: 'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',

	'&:hover:not(:disabled)': {
		boxShadow: '0 0 0 6px $$bg',
	},

	'&:focus': {
		outline: 'none',
	},
	'&:focus-visible:not(:disabled)': {
		outline: 'none',
		boxShadow: '$focus',
	},

	'&:disabled': {
		opacity: 0.5,
	},

	'&:active:not(:disabled)': {
		boxShadow: '0 0 0 6px $$active',
		backgroundColor: '$$active',
	},

	variants: {
		color: {
			default: {
				color: '$black',
				$$bg: '$colors$white',
				border: '1px solid currentColor',
			},
			primary: {
				color: '$lemonDarker',
				$$bg: '$colors$lemonLighter',
				$$active: '$colors$lemonLight',
				border: '1px solid currentColor',

				'&:hover:not(:disabled)': {
					$$bg: '$colors$lemonLight',
				},

				'&:focus:not(:disabled)': {
					$$bg: '$colors$lemonLight',
				},
			},
			ghost: {
				color: '$darkBlend',
				$$bg: 'transparent',

				'&:hover:not(:disabled)': {
					$$bg: '$colors$grayBlend',
				},
			},
			destructive: {
				color: '$black',
				$$bg: '$colors$tomatoLight',
				$$active: '$colors$tomatoLight',
				border: '1px solid currentColor',

				'&:hover:not(:disabled)': {
					$$bg: '$colors$tomato',
				},
			},
			ghostDestructive: {
				color: '$tomatoDark',
				$$bg: 'transparent',
				$$active: '$tomatoLight',

				'&:hover:not(:disabled)': {
					$$bg: '$colors$tomatoLight',
				},
			},
		},
		size: {
			default: {},
			small: {
				fontSize: '$sm',
				borderRadius: '$lg',
				px: '$3',
				py: '$1',
			},
		},
	},

	defaultVariants: {
		color: 'default',
		size: 'default',
	},
});
export type ButtonProps = ComponentProps<typeof Button>;

const headingCommonStyles = {
	mt: 0,
};
export const H1 = styled('h1' as const, {
	...headingCommonStyles,
	fontFamily: '$title',
	fontSize: '$3xl',
});
export const H2 = styled('h2' as const, {
	...headingCommonStyles,

	fontSize: '$lg',
	fontFamily: '$title',
	fontWeight: 'bold',
	color: '$gray90',

	variants: {
		size: {
			micro: {
				fontSize: '$sm',
				textTransform: 'uppercase',
			},
		},
	},
});
export const H3 = styled('h3' as const, {
	...headingCommonStyles,
});
export const H4 = styled('h4' as const, {
	...headingCommonStyles,
});
export const H5 = styled('h5', {
	...headingCommonStyles,
});

export const Span = styled('span' as const, {
	variants: {
		size: {
			xs: {
				fontSize: '$xs',
			},
			small: {
				fontSize: '$sm',
			},
			sm: {
				fontSize: '$sm',
			},
			default: {
				fontSize: '$md',
			},
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

export const P = styled('p' as const, {
	lineHeight: 1.5,
	variants: {
		size: {
			xs: {
				fontSize: '$xs',
			},
			small: {
				fontSize: '$sm',
			},
			sm: {
				fontSize: '$sm',
			},
			default: {
				fontSize: '$md',
			},
		},
	},
	defaultVariants: {
		size: 'default',
	},
});
