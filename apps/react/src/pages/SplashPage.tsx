import { leekTheme, sprinkles } from '@aglio/ui/styles';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { clsx } from 'clsx';
import {
	CSSProperties,
	forwardRef,
	lazy,
	ReactNode,
	Suspense,
	useEffect,
	useRef,
	useState,
} from 'react';
import * as classes from './SplashPage.css.js';
import { DemoFrame } from '@/components/promotional/DemoFrame.jsx';
import { APP_NAME, PRICE_MONTHLY_DOLLARS } from '@/config.js';
import { PromoteSubscriptionButton } from '@/components/promotional/PromoteSubscriptionButton.jsx';
import { useOnVisible } from '@/hooks/useOnVisible.js';
import { useSearchParams } from '@lo-fi/react-router';
import { ProductHunt } from '@/components/promotional/ProductHunt.jsx';
import { H2, P, Span } from '@aglio/ui/components/typography';
import { Box } from '@aglio/ui/components/box';
import { TextLink } from '@aglio/ui/components/textLink';
import { LinkButton } from '@/components/nav/Link.jsx';

// dynamically import Scene
const Scene = lazy(() => import('@/components/3d/Scene.jsx'));

export function SplashPage() {
	const [_, setHasSeen] = useLocalStorage('hasSeenWelcome', true);
	useEffect(() => {
		setHasSeen(true);
	}, []);

	const upgradeSectionRef = useRef<HTMLDivElement>(null);
	const [staticSectionAccent, setStaticSectionAccent] = useState(false);
	useOnVisible(upgradeSectionRef, setStaticSectionAccent, {
		threshold: 0.05,
	});

	const [params] = useSearchParams();
	const jumpToUpgrade = params.get('upgrade') === 'true';
	useEffect(() => {
		if (jumpToUpgrade && upgradeSectionRef.current) {
			window.scrollTo(0, upgradeSectionRef.current.offsetTop);
		}
	}, [jumpToUpgrade]);

	return (
		<div className={classes.root}>
			<div className={classes.backgroundSceneContainer}>
				<Suspense>
					<Scene />
				</Suspense>
			</div>
			<Content className={classes.mainContent}>
				<div className={classes.demoGrid}>
					<div className={classes.titleWrap}>
						<ProductHunt className={classes.productHunt} />

						<h2 className={classes.appName}>{APP_NAME}</h2>
						<Title>Your weekly cooking, in one place.</Title>
					</div>
					<DemoFrame demo="groceries" className={classes.demo} />
					<Section>
						<H2>How it works</H2>
						<p className={classes.item}>
							<span className={classes.emoji}>🧾</span>
							<span className={classes.itemText}>
								Copy, paste, or share items directly into the app.
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
								Get helpful suggestions based on your past purchases.
							</span>
						</p>
					</Section>
					<DemoFrame
						demo="recipe"
						className={classes.demo}
						// style={{
						// 	gridArea: 'recipes',
						// }}
					/>
					<Section>
						<H2>Collect recipes</H2>
						<p>
							{APP_NAME} is a recipe app, too. You can save recipes from the
							web, or add your own.
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>📝</span>
							<span className={classes.itemText}>
								Edit recipes to your liking. Add notes, change the serving size,
								or even swap out your own ingredients.
							</span>
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>➕</span>
							<span className={classes.itemText}>
								Add recipe ingredients directly to your grocery list.
							</span>
						</p>
					</Section>
					<DemoFrame
						demo="groceries-lists"
						className={classes.demo}
						// style={{ gridArea: 'lists' }}
					/>
					<Section color="white">
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
				</div>
			</Content>
			<Content
				className={clsx(classes.upgradeContent, leekTheme)}
				ref={upgradeSectionRef}
			>
				<div className={classes.upgradeSection}>
					<div className={classes.upgradeTitleWrap}>
						<H2 className={classes.upgradeTitle}>
							Upgrade to the world's most collaborative cooking app
						</H2>
						<P>
							For ${PRICE_MONTHLY_DOLLARS}/mo, you can sync your list and
							recipes to all your devices, share your list with anyone you shop
							with, and coordinate with other chefs while cooking.
						</P>
					</div>
					<DemoFrame demo="multiplayer-groceries" className={classes.demo} />
					<Section>
						<H2>Collaborative groceries</H2>
						<p>
							Team up with your family, roommates, or friends to plan and shop
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>☁️</span>
							<span className={classes.itemText}>
								Sync your list and recipes to all your devices.
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
								In-store collaboration, like claiming sections and planning a
								place to meet up.
							</span>
						</p>
					</Section>
					<DemoFrame demo="multiplayer-cooking" className={classes.demo} />
					<Section>
						<H2>Sous chef mode</H2>
						<p>Stay on task when cooking together</p>
						<p className={classes.item}>
							<span className={classes.emoji}>🖨️</span>
							<span className={classes.itemText}>
								Scan a recipe page directly to the app to add all the
								ingredients to your list.
							</span>
						</p>
						<p className={classes.item}>
							<span className={classes.emoji}>🧑🏻‍🍳</span>
							<span className={classes.itemText}>
								Assign tasks to each chef, and see who's done what.
							</span>
						</p>
					</Section>
					<div className={classes.upgradeCta}>
						<PromoteSubscriptionButton color="primary">
							Upgrade now
						</PromoteSubscriptionButton>
					</div>
				</div>
			</Content>
			<Content
				className={clsx(leekTheme, classes.endContent)}
				style={{ paddingBottom: '20vh' }}
			>
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
			</Content>
			<div
				className={clsx(
					classes.fixedContent,
					staticSectionAccent ? leekTheme : undefined,
				)}
			>
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
		</div>
	);
}

export default SplashPage;

const Section = forwardRef<
	HTMLDivElement,
	{
		color?: 'white' | 'default';
		className?: string;
		children: ReactNode;
		style?: CSSProperties;
	}
>(function Section({ color = 'default', className, ...rest }, ref) {
	return (
		<section
			ref={ref}
			className={clsx(classes.section[color], className)}
			{...rest}
		/>
	);
});

function Title({ children }: { children: string }) {
	return <h1 className={classes.title}>{children}</h1>;
}

const Content = forwardRef<
	HTMLDivElement,
	{
		children: ReactNode;
		className?: string;
		style?: CSSProperties;
	}
>(function Content({ children, className, ...rest }, ref) {
	return (
		<div ref={ref} className={clsx(classes.content, className)} {...rest}>
			<div className={classes.contentInner}>{children}</div>
		</div>
	);
});
