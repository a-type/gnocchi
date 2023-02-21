import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	H2,
} from '@aglio/ui';
import { Button, P } from '@aglio/ui';
import { addRecipeFromUrl } from '@/stores/groceries/recipeMutations.js';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { proxy, useSnapshot } from 'valtio';
import { HUB_HOST_HTTP } from '@/config.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { OnboardingBanner } from '@/components/onboarding/OnboardingBanner.jsx';

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
	useEffect(() => {
		if (isGnocchi && !hasScannedBefore) {
			beginOnboarding();
		}
	}, [isGnocchi, hasScannedBefore, beginOnboarding]);

	const save = async () => {
		const recipe = await addRecipeFromUrl(url);
		setHasScannedBefore(true);
		if (recipe) {
			navigate(`/recipes/${recipe.get('slug')}?firstTimeScanFlow=true`, {
				replace: true,
			});
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
