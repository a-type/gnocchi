import { HubRecipeInfo } from '@aglio/tools';
import { H3, P } from '@aglio/ui';

export interface InstructionsProps {
	instructions: HubRecipeInfo['instructions'];
}

export function Instructions({ instructions }: InstructionsProps) {
	return (
		<div>
			{instructions.map((item) => (
				<InstructionsItem key={item.id} item={item} />
			))}
		</div>
	);
}

function InstructionsItem({
	item,
}: {
	item: HubRecipeInfo['instructions'][0];
}) {
	if (item.type === 'sectionTitle') {
		return <H3>{item.content}</H3>;
	} else {
		return <P>{item.content}</P>;
	}
}
