import { Scene } from '@/components/3d/Scene.jsx';
import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { Button, H1, P, Span } from '@/components/primitives/index.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { clsx } from 'clsx';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { CSSProperties, ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as classes from './SplashPage.css.js';
import { DemoFrame } from '@/components/promotional/DemoFrame.jsx';

export function SplashPage() {
	const [_, setHasSeen] = useLocalStorage('hasSeenWelcome', true);
	useEffect(() => {
		setHasSeen(true);
	}, []);

	return (
		<PageRoot color="lemon">
			<div className={classes.backgroundSceneContainer}>
				<Scene />
			</div>
			<PageContent>
				<div className={classes.demoGrid}>
					<h1 className={classes.title}>Aglio</h1>
					<DemoFrame
						demo="basics"
						className={classes.demo}
						style={{ gridArea: 'basic' }}
					/>
					<Section style={{ gridArea: 'basicText' }}>
						<H1>How it works</H1>
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
								Organize your run by aisle. Aglio will remember your
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
						<H1>Sign up for superpowers</H1>
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
						<H1>Less improv at the grocery store</H1>
						<p>
							If you're like me, you usually leave the grocery store with some
							foods you didn't plan on buying. But you also get home, start
							loading the fridge, and realize you forgot something, too.
						</p>
						<p>
							I built Aglio to plan grocery trips better, as a solo shopper or a
							family. It may seem like any old list app, but under the surface
							I've tried to design intentionally for the task at hand. Give it a
							shot this week (no account needed!) and let me know what you
							think.
						</p>
						<p>&ndash; Grant</p>
					</Section>
				</div>
			</PageContent>
			<PageContent
				className={classes.fixedContent}
				innerProps={{
					className: classes.fixedContentInner,
				}}
			>
				<Link to="/">
					<Button
						data-test="get-started"
						className={sprinkles({ justifyContent: 'center', width: 'full' })}
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
