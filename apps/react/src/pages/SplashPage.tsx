import { withClassName } from '@aglio/ui/hooks';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import classNames from 'classnames';
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
import { DemoFrame } from '@/components/promotional/DemoFrame.jsx';
import { APP_NAME, PRICE_MONTHLY_DOLLARS } from '@/config.js';
import { PromoteSubscriptionButton } from '@/components/promotional/PromoteSubscriptionButton.jsx';
import { useOnVisible } from '@/hooks/useOnVisible.js';
import { useSearchParams } from '@verdant-web/react-router';
import { ProductHunt } from '@/components/promotional/ProductHunt.jsx';
import { H2, P } from '@aglio/ui/components/typography';
import { TextLink } from '@/components/nav/Link.jsx';
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
		<div className="bg-white color-black flex flex-col items-stretch">
			<div className="fixed top-0 left-0 w-full h-80% pointer-events-none">
				<Suspense>
					<Scene />
				</Suspense>
			</div>
			<Content className="bg-primary-light">
				<DemoGrid>
					<TitleWrap>
						<ProductHunt className="mb-8 w-250px block md:(fixed top-4 right-4 z-1000000)" />
						<h2 className="[font-family:'Londrina_Outline',_sans-serif] font-500 text-[6vmax] color-black mb-20vh">
							{APP_NAME}
						</h2>
						<Title>Your weekly cooking, in one place.</Title>
					</TitleWrap>
					<Demo demo="groceries" />
					<Section>
						<H2 className="gutter-bottom">How it works</H2>
						<Item>
							<Emoji>🧾</Emoji>
							<ItemText>
								Copy, paste, or share items directly into the app.
							</ItemText>
						</Item>
						<Item>
							<Emoji>🏷️</Emoji>
							<ItemText>
								Organize your run by aisle. {APP_NAME} will remember your
								categorizations!
							</ItemText>
						</Item>
						<Item>
							<Emoji>🛒</Emoji>
							<ItemText>
								Get helpful suggestions based on your past purchases.
							</ItemText>
						</Item>
					</Section>
					<Demo demo="recipe" />
					<Section>
						<H2 className="gutter-bottom">Collect recipes</H2>
						<p>
							{APP_NAME} is a recipe app, too. You can save recipes from the
							web, or add your own.
						</p>
						<Item>
							<Emoji>📝</Emoji>
							<ItemText>
								Edit recipes to your liking. Add notes, change the serving size,
								or even swap out your own ingredients.
							</ItemText>
						</Item>
						<Item>
							<Emoji>➕</Emoji>
							<ItemText>
								Add recipe ingredients directly to your grocery list.
							</ItemText>
						</Item>
					</Section>
					<Demo demo="groceries-lists" />
					<Section color="white">
						<H2 className="gutter-bottom">Less improv at the grocery store</H2>
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
				</DemoGrid>
			</Content>
			<Content
				className={classNames(
					'bg-primary border-t-20vh border-b-20vh border-solid border-primary-light',
					'theme-leek',
				)}
				ref={upgradeSectionRef}
			>
				<DemoGrid className="mt-20vh">
					<TitleWrap className="bg-primary-wash border-1 border-solid border-primary-dark rounded-lg p-4">
						<H2 className="[font-size:5vmax] gutter-bottom">
							Upgrade to the world's most collaborative cooking app
						</H2>
						<P>
							For ${PRICE_MONTHLY_DOLLARS}/mo, you can sync your list and
							recipes to all your devices, share your list with anyone you shop
							with, and coordinate with other chefs while cooking.
						</P>
					</TitleWrap>
					<Demo demo="multiplayer-groceries" />
					<Section>
						<H2 className="gutter-bottom">Collaborative groceries</H2>
						<p>
							Team up with your family, roommates, or friends to plan and shop
						</p>
						<Item>
							<Emoji>☁️</Emoji>
							<ItemText>
								Sync your list and recipes to all your devices.
							</ItemText>
						</Item>
						<Item>
							<Emoji>👯</Emoji>
							<ItemText>Share your list with anyone you shop with.</ItemText>
						</Item>
						<Item>
							<Emoji>📌</Emoji>
							<ItemText>
								In-store collaboration, like claiming sections and planning a
								place to meet up.
							</ItemText>
						</Item>
					</Section>
					<Demo demo="multiplayer-cooking" />
					<Section>
						<H2 className="gutter-bottom">Sous chef mode</H2>
						<p>Stay on task when cooking together</p>
						<Item>
							<Emoji>🖨️</Emoji>
							<ItemText>
								Scan a recipe page directly to the app to add all the
								ingredients to your list.
							</ItemText>
						</Item>
						<Item>
							<Emoji>🧑🏻‍🍳</Emoji>
							<ItemText>
								Assign tasks to each chef, and see who's done what.
							</ItemText>
						</Item>
					</Section>
					<div className="flex flex-row items-center justify-center gap-4 w-full md:[grid-column-end:span_2]">
						<PromoteSubscriptionButton color="primary">
							Upgrade now
						</PromoteSubscriptionButton>
					</div>
				</DemoGrid>
			</Content>
			<Content className={classNames('theme-leek', 'bg-primary-light pb-20vh')}>
				<div className="mt-6 gap-4 flex flex-col">
					<TextLink to="/privacy-policy" newTab>
						Read the privacy policy
					</TextLink>
					<TextLink to="/tos" newTab>
						Terms and Conditions of usage
					</TextLink>
					<TextLink to="https://github.com/a-type/gnocchi" newTab>
						Gnocchi is open source
					</TextLink>
				</div>
			</Content>
			<div
				className={classNames(
					'flex flex-col fixed bottom-0 bg-primary-light border-0 border-t border-solid border-t-primary-dark m-0 w-full p-6 items-center gap-3 z-2 transition-colors',
					staticSectionAccent ? 'theme-leek' : undefined,
				)}
			>
				<LinkButton
					to="/"
					data-test="get-started"
					className="justify-center self-center"
					color="default"
				>
					Get Started
				</LinkButton>

				<span className="text-sm">
					Free, no signup required. By continuing you agree to{' '}
					<TextLink to="/tos" newTab>
						the terms and conditions of usage.
					</TextLink>
				</span>
			</div>
		</div>
	);
}

export default SplashPage;

const DemoGrid = withClassName(
	'div',
	'grid grid-cols-[1fr] gap-5 items-start md:(grid-cols-[repeat(2,1fr)])',
);
const Demo = withClassName(DemoFrame, 'relative z-1 [grid-row-end:span_2]');
const TitleWrap = withClassName('div', 'md:[grid-column-end:span_2]');
const Item = withClassName('p', 'flex items-start gap-2');
const Emoji = withClassName('span', 'block');
const ItemText = withClassName('span', 'block relative');

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
			className={classNames(
				'bg-primary-wash relative flex flex-col items-start mb-auto p-6 rounded-lg text-sm border border-solid border-primary-dark [line-height:1.5] color-black',
				color === 'white' && 'bg-white border-default',
				className,
			)}
			{...rest}
		/>
	);
});

function Title({ children }: { children: string }) {
	return (
		<h1 className="w-full m-0 mb-6 font-title [font-size:7vmax] color-black font-black text-shadow-[0_0_4px_var(--color-white)] md:[font-size:7vmin]">
			{children}
		</h1>
	);
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
		<div
			ref={ref}
			className={classNames('w-full flex flex-col gap-6 bg-primary', className)}
			{...rest}
		>
			<div className="max-w-800px w-full my-0 mx-auto p-6 relative z-1">
				{children}
			</div>
		</div>
	);
});
