import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@aglio/ui/components/dialog';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { proxy, useSnapshot } from 'valtio';
import { HUB_HOST_HTTP } from '@/config.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { OnboardingBanner } from '@/components/onboarding/OnboardingBanner.jsx';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import { H2, P, Span } from '@aglio/ui/components/typography';
import { TextLink } from '@/components/nav/Link.jsx';
import { Button } from '@aglio/ui/components/button';
import { hooks } from '@/stores/groceries/index.js';

export interface RecipeSavePromptProps {}

export const recipeSavePromptState = proxy({
	url: '',
	hubSlug: '',
});

export function RecipeSavePrompt({}: RecipeSavePromptProps) {
	const { url } = useSnapshot(recipeSavePromptState);
	const navigate = useNavigate();
	const [search] = useSearchParams();
	const [hasScannedBefore, setHasScannedBefore] = useLocalStorage(
		'hasScannedBefore',
		false,
	);

	const urlParam = search.get('recipeUrl');
	useEffect(() => {
		if (urlParam) {
			recipeSavePromptState.url = urlParam;
		}
	}, [urlParam]);
	const slugParam = search.get('recipeSlug');
	useEffect(() => {
		if (slugParam) {
			recipeSavePromptState.hubSlug = slugParam;
		}
	}, [slugParam]);

	const isGnocchi = url?.startsWith(HUB_HOST_HTTP);

	const beginOnboarding = saveHubRecipeOnboarding.useBegin();
	const cancelOnboarding = saveHubRecipeOnboarding.useCancel();
	const cancelFirstTimeOnboarding = firstTimeOnboarding.useCancel();
	useEffect(() => {
		if (isGnocchi && !hasScannedBefore) {
			beginOnboarding();
			// abort first-time onboarding; superseded by this flow.
			cancelFirstTimeOnboarding();
		}
	}, [isGnocchi, hasScannedBefore, beginOnboarding, cancelFirstTimeOnboarding]);

	const addRecipeFromUrl = hooks.useAddRecipeFromUrl();
	const save = async () => {
		const recipe = await addRecipeFromUrl(url);
		setHasScannedBefore(true);
		if (recipe) {
			navigate(
				`/recipes/${recipe.get(
					'slug',
				)}?firstTimeScanFlow=true&skipWelcome=true`,
				{
					replace: true,
				},
			);
		}
		recipeSavePromptState.url = '';
	};

	return (
		<Dialog open={!!url} onOpenChange={() => (recipeSavePromptState.url = '')}>
			<DialogContent>
				<DialogTitle>
					{isGnocchi ? 'Save recipe?' : 'Scan web recipe?'}
				</DialogTitle>
				<OnboardingBanner
					disableNext
					onboarding={saveHubRecipeOnboarding}
					step="save"
				>
					<H2>Welcome to Gnocchi.club!</H2>
					<P>
						You're about to save a copy of a recipe to your collection. Press
						the Save button to get started.
					</P>
				</OnboardingBanner>
				<P>
					Add a copy of this recipe to your collection and access it any time.
				</P>
				{!isGnocchi && (
					<P style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{url}</P>
				)}

				<Span size="sm">
					By continuing you agree to{' '}
					<TextLink to="/tos" newTab>
						the terms and conditions of usage.
					</TextLink>
				</Span>
				<DialogActions>
					<DialogClose asChild>
						<Button onClick={cancelOnboarding}>Cancel</Button>
					</DialogClose>
					<Button color="primary" onClick={save}>
						Save
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
