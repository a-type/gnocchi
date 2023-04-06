import { RecipeOverview } from '@/components/recipes/viewer/RecipeOverview.jsx';
import { useParams } from 'react-router-dom';

export interface RecipeOverviewPageProps {}

export function RecipeOverviewPage({}: RecipeOverviewPageProps) {
	const { slug } = useParams();

	return <RecipeOverview slug={slug as string} />;
}

export default RecipeOverviewPage;
