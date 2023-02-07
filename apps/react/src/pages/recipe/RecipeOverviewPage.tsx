import { Box } from '@aglio/ui';
import { RecipeOverview } from '@/components/recipes/viewer/RecipeOverview.jsx';
import { useParams } from 'react-router-dom';

export interface RecipeOverviewPageProps {}

export function RecipeOverviewPage({}: RecipeOverviewPageProps) {
	const { slug } = useParams();

	return (
		<Box direction="column" align="start" gap={6}>
			<RecipeOverview slug={slug as string} />
		</Box>
	);
}

export default RecipeOverviewPage;
