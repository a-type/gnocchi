import { PageContent, PageRoot } from '@aglio/ui';
import { Box, Button, H2, LinkButton, P, Span, TextLink } from '@aglio/ui';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { clsx } from 'clsx';
import { sprinkles } from '@aglio/ui';
import { CSSProperties, lazy, ReactNode, Suspense, useEffect } from 'react';
import * as classes from './SplashPage.css.js';
import { DemoFrame } from '@/components/promotional/DemoFrame.jsx';
import { APP_NAME } from '@/config.js';

// dynamically import Scene
const Scene = lazy(() => import('@/components/3d/Scene.jsx'));

export function SplashPage() {
	const [_, setHasSeen] = useLocalStorage('hasSeenWelcome', true);
	useEffect(() => {
		setHasSeen(true);
	}, []);

	return (
		<PageRoot color="lemon">
			<div className={classes.backgroundSceneContainer}>
				<Suspense>
					<Scene />
				</Suspense>
			</div>
			<PageContent nav={false}>
				<div className={classes.demoGrid}>
					<div className={classes.titleWrap}>
						<h2 className={classes.appName}>{APP_NAME}</h2>
						<Title>Your weekly cooking, in one place.</Title>
					</div>
					<DemoFrame
						demo="basics"
						className={classes.demo}
						style={{ gridArea: 'basic' }}
					/>
					<Section style={{ gridArea: 'basicText' }}>
						<H2>How it works</H2>
						<p className={classes.item}>
							<span className={classes.emoji}>🧾</span>
							<span className={classes.itemText}>
								Copy, paste, or share ingredients from recipes directly into the
								app.
							</span>
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>🏷️</span>
							<span className={classes.itemText}>
								Organize your run by aisle. {APP_NAME} will remember your
								categorizations!
							</span>
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>🛒</span>
							<span className={classes.itemText}>
								Y'know, grocery stuff. All of this works without even signing
								in.
							</span>
						</p>
					</Section>
					<DemoFrame
						demo="multiplayer"
						className={classes.demo}
						style={{ gridArea: 'multiplayer' }}
					/>
					<Section style={{ gridArea: 'multiplayerText' }}>
						<H2>Sign up for superpowers</H2>
						<p>
							An affordable account keeps things running and nets you some cool
							stuff:
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>☁️</span>
							<span className={classes.itemText}>
								Sync your list to all your devices.
							</span>
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>👯</span>
							<span className={classes.itemText}>
								Share your list with anyone you shop with.
							</span>
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>📌</span>
							<span className={classes.itemText}>
								In-store superpowers, like claiming sections and planning a
								place to meet up
							</span>
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>🖨️</span>
							<span className={classes.itemText}>
								Scan a recipe page directly to the app to add all the
								ingredients to your list.{' '}
								<span className={classes.beta}>BETA</span>
							</span>
						</p>
					</Section>
					<DemoFrame
						demo="lists"
						className={classes.demo}
						style={{ gridArea: 'lists' }}
					/>
					<Section color="white" style={{ gridArea: 'outroText' }}>
						<H2>Less improv at the grocery store</H2>
						<p>
							If you're like me, you usually leave the grocery store with some
							foods you didn't plan on buying. But you also get home, start
							loading the fridge, and realize you forgot something, too.
						</p>
						<p>
							I built {APP_NAME} to plan grocery trips better, as a solo shopper
							or a family. It may seem like any old list app, but under the
							surface I've tried to design intentionally for the task at hand.
							Give it a shot this week (no account needed!) and let me know what
							you think.
						</p>
						<p>&ndash; Grant</p>
					</Section>
					<Box mt={6} gap={4}>
						<TextLink
							href="/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read the privacy policy
						</TextLink>
						<TextLink href="/tos" target="_blank" rel="noopener noreferrer">
							Terms and Conditions of usage
						</TextLink>
						<TextLink
							href="https://github.com/a-type/gnocchi"
							target="_blank"
							rel="noopener noreferrer"
						>
							Gnocchi is open source
						</TextLink>
					</Box>
				</div>
			</PageContent>
			<div className={classes.fixedContent}>
				<LinkButton
					to="/"
					data-test="get-started"
					className={sprinkles({
						justifyContent: 'center',

						alignSelf: 'center',
					})}
					color="default"
				>
					Get Started
				</LinkButton>

				<Span size="sm">
					Free, no signup required. By continuing you agree to{' '}
					<TextLink href="/tos" target="_blank" rel="noopener noreferrer">
						the terms and conditions of usage.
					</TextLink>
				</Span>
			</div>
		</PageRoot>
	);
}

export default SplashPage;

function Section({
	color = 'default',
	className,
	...rest
}: {
	color?: 'white' | 'default';
	className?: string;
	children: ReactNode;
	style?: CSSProperties;
}) {
	return (
		<section className={clsx(classes.section[color], className)} {...rest} />
	);
}

function Title({ children }: { children: string }) {
	return <h1 className={classes.title}>{children}</h1>;
}
