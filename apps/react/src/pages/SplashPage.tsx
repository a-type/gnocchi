import { Scene } from '@/components/3d/Scene.jsx';
import { PageContent, PageRoot } from '@/components/layouts/index.js';
import {
	Box,
	Button,
	H1,
	P,
	Span,
} from '@/components/primitives/primitives.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { styled } from '@/stitches.config.js';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function SplashPage() {
	const [_, setHasSeen] = useLocalStorage('hasSeenWelcome', true);
	useEffect(() => {
		setHasSeen(true);
	}, []);

	return (
		<PageRoot color="lemon">
			<BackgroundSceneContainer>
				<Scene />
			</BackgroundSceneContainer>
			<PageContent>
				<Title>Aglio</Title>
				<Section css={{ mt: '40vh' }} color="white">
					<H1>Less improv at the grocery store</H1>
					<P>
						If you're like me, you usually leave the grocery store with some
						foods you didn't plan on buying. But you also get home, start
						loading the fridge, and realize you forgot something, too.
					</P>
					<P>
						I built Aglio to plan grocery trips better, as a solo shopper or a
						family. It may seem like any old list app, but under the surface
						I've tried to design intentionally for the task at hand. Give it a
						shot this week (no account needed!) and let me know what you think.
					</P>
					<P>&ndash; Grant</P>
				</Section>
				<Section>
					<H1>How it works</H1>
					<P>
						Copy, paste, or share ingredients from recipes directly into the
						app.
					</P>
					<P>Organize your run by aisle.</P>
					<P>
						Y'know, grocery stuff. All of this works without even signing in.
					</P>
				</Section>
				<Section>
					<H1>Sign up for superpowers</H1>
					<P>
						An affordable account keeps things running and nets you some cool
						stuff:
					</P>
					<P>Sync your list to all your devices.</P>
					<P>Share your list with anyone you shop with.</P>
					<P>
						Scan a recipe page directly to the app to add all the ingredients to
						your list.
					</P>
				</Section>
			</PageContent>
			<PageContent
				direction="column"
				css={{
					position: 'fixed',
					bottom: 0,
					backgroundColor: '$lemon',
					borderTop: '1px solid $lemonDark',
				}}
				innerProps={{
					gap: 3,
					align: 'stretch',
				}}
			>
				<Link to="/">
					<Button
						css={{ justifyContent: 'center', width: '100%' }}
						color="default"
					>
						Get Started
					</Button>
				</Link>
				<Span size="sm">Free, no signup required</Span>
			</PageContent>
		</PageRoot>
	);
}

const Title = styled('h1', {
	margin: 0,
	fontFamily: '"Londrina Outline", sans-serif',
	fontSize: '15vmax',
	color: '$black',
	fontWeight: 'lighter',
});

const BackgroundSceneContainer = styled('div', {
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '80%',
	pointerEvents: 'none',
});

const Section = styled('div', {
	backgroundColor: '$lemon',
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'start',
	mb: '120px',
	p: '$6',
	borderRadius: '$lg',
	fontSize: '$sm',
	border: '1px solid $lemonDark',

	variants: {
		color: {
			white: {
				backgroundColor: '$white',
				border: '1px solid $black',
			},
		},
	},
});
