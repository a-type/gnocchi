import { ComponentPropsWithoutRef } from 'react';
import { styled } from 'stitches.config';
import { Box } from 'components/primitives';

export function PageContent({
	children,
	css,
	fullHeight,
	...rest
}: ComponentPropsWithoutRef<typeof Box> & {
	fullHeight?: boolean;
}) {
	return (
		<Box
			css={{
				gridArea: 'content',
				width: '$full',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				overflowX: 'hidden',
				position: 'relative',
				px: '$4',
				py: '$6',
				...css,
			}}
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
	...rest
}: ComponentPropsWithoutRef<typeof Box>) {
	return (
		<Box
			css={{
				gridArea: 'nowPlaying',
				width: '$full',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '$2',
				...css,
			}}
			{...rest}
		>
			<Box
				direction="row"
				css={{
					width: '$full',
					maxWidth: '$content',
					overflow: 'hidden',
					position: 'relative',
					backgroundColor: '$lemonDark',
					borderRadius: '$md',
					boxShadow: '$md',
					borderColor: '$lemonDarker',
					borderWidth: '$thin',
					borderStyle: 'solid',
				}}
			>
				{children}
			</Box>
		</Box>
	);
}
