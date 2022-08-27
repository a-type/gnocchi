import React, { ComponentPropsWithoutRef } from 'react';
import { styled } from 'stitches.config.js';
import { Box } from 'components/primitives/index.js';

export function PageContent({
	children,
	css,
	fullHeight,
	noPadding,
	...rest
}: ComponentPropsWithoutRef<typeof Box> & {
	fullHeight?: boolean;
	noPadding?: boolean;
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
			<Box
				direction="column"
				css={{
					width: '$full',
					maxWidth: '$content',
					flex: fullHeight ? 1 : 'initial',
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

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
