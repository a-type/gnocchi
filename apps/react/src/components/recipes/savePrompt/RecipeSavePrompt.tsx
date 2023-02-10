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

export interface RecipeSavePromptProps {}

export const recipeSavePromptState = proxy({
	url: '',
});

export function RecipeSavePrompt({}: RecipeSavePromptProps) {
	const { url } = useSnapshot(recipeSavePromptState);
	const navigate = useNavigate();
	const [search] = useSearchParams();

	const urlParam = search.get('recipeUrl');
	useEffect(() => {
		if (urlParam) {
			recipeSavePromptState.url = urlParam;
		}
	}, [urlParam]);

	return (
		<Dialog open={!!url} onOpenChange={() => (recipeSavePromptState.url = '')}>
			<DialogContent>
				<DialogTitle>Scan web recipe?</DialogTitle>
				<P>Would you like to save this recipe to your collection?</P>
				<P style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{url}</P>

				<DialogActions>
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<Button
						color="primary"
						onClick={async () => {
							const recipe = await addRecipeFromUrl(url);
							if (recipe) {
								navigate(`/recipes/${recipe.get('slug')}`, {
									replace: true,
								});
							}
							recipeSavePromptState.url = '';
						}}
					>
						Save
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
