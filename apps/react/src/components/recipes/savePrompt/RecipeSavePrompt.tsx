import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@aglio/ui';
import { Button, P } from '@aglio/ui';
import { addRecipeFromUrl } from '@/stores/groceries/recipeMutations.js';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { proxy, useSnapshot } from 'valtio';
import { HUB_HOST_HTTP } from '@/config.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

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

	if (!hasScannedBefore) {
		return (
			<Dialog
				open={!!url}
				onOpenChange={() => (recipeSavePromptState.url = '')}
			>
				<DialogContent>
					<DialogTitle>Welcome to Gnocchi.club!</DialogTitle>
					<P>
						You're about to {isGnocchi ? 'save' : 'scan'} a copy of a recipe to
						your collection.
					</P>
					<DialogActions>
						<DialogClose asChild>
							<Button>Cancel</Button>
						</DialogClose>
						<Button color="primary" onClick={save}>
							Save
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={!!url} onOpenChange={() => (recipeSavePromptState.url = '')}>
			<DialogContent>
				<DialogTitle>
					{isGnocchi ? 'Save recipe?' : 'Scan web recipe?'}
				</DialogTitle>
				<P>
					Add a copy of this recipe to your collection and access it any time.
				</P>
				{!isGnocchi && (
					<P style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{url}</P>
				)}

				<DialogActions>
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<Button color="primary" onClick={save}>
						Save
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
