import { LinkButton } from '@/components/nav/Link.jsx';
import { H1, P } from '@a-type/ui/components/typography';

export interface RecipeNotFoundProps {}

export function RecipeNotFound({}: RecipeNotFoundProps) {
	return (
		<div className="flex flex-col gap-6 items-start">
			<H1>Recipe not found</H1>
			<P>Perhaps it was deleted, or you typed the URL incorrectly.</P>
			<div>
				<LinkButton to="/recipes">Go back to recipes</LinkButton>
			</div>
		</div>
	);
}
