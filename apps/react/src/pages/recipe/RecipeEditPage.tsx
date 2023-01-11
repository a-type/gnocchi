import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor.jsx';
import { useParams } from 'react-router-dom';

export interface RecipeEditPageProps {}

export function RecipeEditPage({}: RecipeEditPageProps) {
	const { slug } = useParams();

	return <RecipeEditor slug={slug as string} />;
}

export default RecipeEditPage;
