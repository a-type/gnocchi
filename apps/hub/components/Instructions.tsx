import { HubPublishedRecipeInfo } from '@/../../packages/trpc/src';
import { H3, P } from '@aglio/ui';

export interface InstructionsProps {
	instructions: HubPublishedRecipeInfo['instructions'];
}

export function Instructions({ instructions }: InstructionsProps) {
	return (
		<div className="e-instructions" itemProp="recipeInstructions">
			{instructions.map((item) => (
				<InstructionsItem key={item.id} item={item} />
			))}
		</div>
	);
}

function InstructionsItem({
	item,
}: {
	item: HubPublishedRecipeInfo['instructions'][0];
}) {
	if (item.type === 'sectionTitle') {
		return <H3>{item.content}</H3>;
	} else {
		return <P>{item.content}</P>;
	}
}
