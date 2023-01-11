import { RecipeCookView } from '@/components/recipes/viewer/RecipeCookView.jsx';
import { useParams } from 'react-router-dom';

export interface RecipeCookPageProps {}

export function RecipeCookPage({}: RecipeCookPageProps) {
	const params = useParams();
	const slug = params.slug as string;

	return <RecipeCookView slug={slug} />;
}

export default RecipeCookPage;
