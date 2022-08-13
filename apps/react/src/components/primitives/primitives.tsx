import useMergedRef from '@react-hook/merged-ref';
import React, { forwardRef, HTMLProps, useLayoutEffect, useRef } from 'react';
import { styled } from 'stitches.config';

const BaseBox = styled('div', {
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

export const Input = styled('input', {
	px: '$3',
	py: '$2',
	fontSize: '$md',
	fontFamily: '$sans',
	border: 'none',
	borderRadius: '$md',
	backgroundColor: '$gray20',
	userSelect: 'auto',

	'&:focus': {
		outline: 'none',
		backgroundColor: '$gray30',
	},
	'&:focus-visible': {
		outline: 'none',
		boxShadow: '$focus',
	},
});

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

const StyledTextArea = styled('textarea', {
	fontFamily: 'inherit',
	fontSize: 'inherit',
	overflow: 'hidden',
});

export const Button = styled('button', {
	px: '$3',
	py: '$2',
	fontSize: '$md',
	fontFamily: '$sans',
	border: 'none',
	borderRadius: '$md',
	cursor: 'pointer',
	fontWeight: 'bold',

	'&:focus': {
		outline: 'none',
	},
	'&:focus-visible': {
		outline: 'none',
		boxShadow: '$focus',
	},

	variants: {
		color: {
			primary: {
				color: '$black',
				backgroundColor: '$lemonDark',
			},
			default: {
				color: '$lemonDarker',
				backgroundColor: '$lemonLighter',

				'&:hover': {
					backgroundColor: '$lemonLight',
				},

				'&:focus': {
					backgroundColor: '$lemonLight',
				},
			},
			ghost: {
				color: '$darkBlend',
				backgroundColor: 'transparent',

				'&:hover': {
					backgroundColor: '$grayBlend',
				},
			},
			destructive: {
				color: '$white',
				backgroundColor: '$tomato',

				'&:hover': {
					backgroundColor: '$tomatoDark',
				},
			},
			ghostDestructive: {
				color: '$tomatoDark',
				backgroundColor: 'transparent',

				'&:hover': {
					backgroundColor: '$tomatoLight',
				},
			},
		},
		size: {
			default: {},
			small: {
				fontSize: '$sm',
				borderRadius: '$lg',
			},
		},
	},

	defaultVariants: {
		color: 'default',
		size: 'default',
	},
});

const headingCommonStyles = {
	mt: 0,
};
export const H1 = styled('h1', {
	...headingCommonStyles,
});
export const H2 = styled('h2', {
	...headingCommonStyles,

	variants: {
		size: {
			micro: {
				fontSize: '$sm',
				textTransform: 'uppercase',
			},
		},
	},
});
export const H3 = styled('h3', {
	...headingCommonStyles,
});
export const H4 = styled('h4', {
	...headingCommonStyles,
});
export const H5 = styled('h5', {
	...headingCommonStyles,
});
