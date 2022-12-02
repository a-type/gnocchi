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
