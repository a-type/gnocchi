import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor.jsx';
import { useParams } from '@verdant-web/react-router';

export interface RecipeEditPageProps {}

export function RecipeEditPage({}: RecipeEditPageProps) {
	const { slug } = useParams();

	return <RecipeEditor slug={slug as string} />;
}

export default RecipeEditPage;
