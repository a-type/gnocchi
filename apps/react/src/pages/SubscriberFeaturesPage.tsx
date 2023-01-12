import {
	PageContent,
	PageFixedArea,
	PageRoot,
	PageSection,
	PageSectionGrid,
} from '@/components/layouts/index.jsx';
import { H1, H2, P } from '@/components/primitives/index.js';
import { LoginButton } from '@/components/sync/LoginButton.jsx';
import { APP_NAME } from '@/config.js';
import { useIsLoggedIn } from '@/contexts/AuthContext.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { sprinkles } from '@/styles/sprinkles.css.js';

export function SubscriberFeaturesPage() {
	const recipePresence = useFeatureFlag('recipePresence');
	const isLoggedIn = useIsLoggedIn();

	return (
		<PageRoot>
			<PageContent nav={false}>
				<H1>Subscriber Features</H1>
				<P>Here's everything you get with your {APP_NAME} subscription.</P>
				<PageSectionGrid>
					<PageSection>
						<H2>Sync your list across devices</H2>
						<P>
							Now your list goes with you everywhere. Realized you need eggs
							while at work? Drop it in the list from your laptop. Sync makes it
							easier than ever to stay on top of your grocery list.
						</P>
					</PageSection>
					<PageSection>
						<H2>Invite your family or friends</H2>
						<P>
							You can invite any number of people to cook and shop with you for
							free, all on the same subscription.
						</P>
						<P>
							When you get to the store, you'll see everyone's changes as they
							happen, so you're good to divide and conquer the aisles. You can
							even claim specific categories to keep everyone in sync.
						</P>
					</PageSection>
					<PageSection>
						<H2>Scan web recipes</H2>
						<P>
							Use the Recipe Scanner to quickly pull a web recipe into your
							personal collection. {APP_NAME} will do its best to grab the
							ingredients and instructions and save you some copy + paste
							effort.
						</P>
						<P>
							You can use the scanner either by installing the app to your phone
							and using your phone's built-in Share dialog to share a website to{' '}
							{APP_NAME}, or by entering a URL into a new recipe and clicking
							the Scan button.
						</P>
					</PageSection>
					{recipePresence && (
						<PageSection>
							<H2>Collaborative cooking</H2>
							<P>
								When you're cooking together, you can use the app to keep track
								of who's doing what, assign specific tasks to different cooks,
								and mark off what's been done.
							</P>
						</PageSection>
					)}
				</PageSectionGrid>
				{!isLoggedIn && (
					<PageFixedArea
						className={sprinkles({
							display: 'flex',
							flexDirection: 'column',
							top: 'auto',
							bottom: 0,
							align: 'center',
							borderColor: 'black',
							borderWidth: 0,
							borderStyle: 'solid',
							mt: 6,
							py: 4,
						})}
						style={{ borderTopWidth: 1 }}
					>
						<LoginButton color="primary">Sign up now</LoginButton>
					</PageFixedArea>
				)}
			</PageContent>
		</PageRoot>
	);
}

export default SubscriberFeaturesPage;
