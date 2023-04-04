import { Box } from '@aglio/ui/components/box';
import { LinkButton } from '@/components/nav/Link.jsx';
import { H1, P } from '@aglio/ui/components/typography';

export interface RecipeNotFoundProps {}

export function RecipeNotFound({}: RecipeNotFoundProps) {
	return (
		<Box gap={6} direction="column" align="flex-start">
			<H1>Recipe not found</H1>
			<P>Perhaps it was deleted, or you typed the URL incorrectly.</P>
			<Box>
				<LinkButton to="/recipes">Go back to recipes</LinkButton>
			</Box>
		</Box>
	);
}
