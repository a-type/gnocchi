import { Box, H1, LinkButton, P } from '../primitives/index.js';

export interface RecipeNotFoundProps {}

export function RecipeNotFound({}: RecipeNotFoundProps) {
	return (
		<Box gap={6} direction="column" align="start">
			<H1>Recipe not found</H1>
			<P>Perhaps it was deleted, or you typed the URL incorrectly.</P>
			<Box>
				<LinkButton to="/recipes">Go back to recipes</LinkButton>
			</Box>
		</Box>
	);
}