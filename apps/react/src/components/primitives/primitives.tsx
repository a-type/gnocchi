import useMergedRef from '@/hooks/useMergedRef.js';
import {
	ComponentProps,
	ComponentPropsWithRef,
	forwardRef,
	HTMLProps,
	useLayoutEffect,
	useRef,
} from 'react';
import { styled } from '@/stitches.config.js';

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
	fontWeight: 'normal',
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
