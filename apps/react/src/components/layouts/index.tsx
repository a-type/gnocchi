import { ComponentPropsWithoutRef, HTMLAttributes } from 'react';
import { styled } from '@/stitches.config.js';
import { Box } from '@/components/primitives/index.js';
import { clsx } from 'clsx';
import * as classes from './index.css.js';

export function PageContent({
	children,
	css,
	fullHeight,
	noPadding,
	innerProps,
	...rest
}: ComponentPropsWithoutRef<typeof Box> & {
	fullHeight?: boolean;
	noPadding?: boolean;
	innerProps?: ComponentPropsWithoutRef<typeof Box>;
}) {
	return (
		<Box
			css={
				{
					gridArea: 'content',
					width: '$full',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					overflowX: 'hidden',
					position: 'relative',
					px: noPadding ? 0 : '$4',
					py: noPadding ? 0 : '$6',
					...css,
				} as any
			}
			{...rest}
		>
			<InnerContent fullHeight={fullHeight} {...innerProps}>
				{children}
			</InnerContent>
		</Box>
	);
}

const InnerContent = styled(Box, {
	width: '100%',
	maxWidth: '$content',
	flexDirection: 'column',
	variants: {
		fullHeight: {
			true: {
				flex: 1,
			},
			false: {},
		},
	},
});

export const PageRoot = styled('div', {
	display: 'grid',
	gridTemplateAreas: '"content" "nowPlaying" "navBar"',
	gridTemplateRows: '1fr auto auto',
	flex: `1 1 0`,
	minHeight: 0,

	'@md': {
		gridTemplateAreas: '"navBar content" "navBar nowPlaying"',
		gridTemplateRows: '1fr',
		gridTemplateColumns: 'auto 1fr',
	},

	variants: {
		color: {
			default: {},
			lemon: {
				backgroundColor: '$lemon',
			},
		},
	},

	defaultVariants: {
		color: 'default',
	},
});

export const PageNavBar = styled('div', {
	gridArea: 'navBar',
	height: 'auto',
	borderTopWidth: '$thin',
	borderTopStyle: '$solid',
	borderTopColor: '$gray20',
	backgroundColor: '$gray10',

	'@md': {
		height: '100%',
	},
});

export function PageNowPlayingBar({
	children,
	css,
	innerCss,
	...rest
}: ComponentPropsWithoutRef<typeof Box> & {
	innerCss?: ComponentPropsWithoutRef<typeof Box>['css'];
}) {
	return (
		<Box
			css={
				{
					gridArea: 'nowPlaying',
					width: '$full',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '$2',
					...css,
				} as any
			}
			{...rest}
		>
			<Box
				direction="row"
				css={
					{
						width: '$full',
						maxWidth: '$content',
						overflow: 'hidden',
						position: 'relative',
						backgroundColor: '$white',
						borderRadius: '$md',
						boxShadow: '$xl',
						...innerCss,
					} as any
				}
			>
				{children}
			</Box>
		</Box>
	);
}

export function PageFixedArea({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx(classes.fixedArea, className)} />;
}
