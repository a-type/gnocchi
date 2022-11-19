import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor.jsx';
import { recipesDescriptor, hooks } from '@/stores/recipes/index.js';
import { useParams } from 'react-router-dom';

export interface RecipeEditPageProps {}

export function RecipeEditPage({}: RecipeEditPageProps) {
	const { slug } = useParams();

	return (
		<hooks.Provider value={recipesDescriptor}>
			<PageRoot>
				<PageContent>
					<RecipeEditor slug={slug as string} />
				</PageContent>
			</PageRoot>
		</hooks.Provider>
	);
}
