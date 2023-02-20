import { H4, H2, H3, P, Peek } from '@aglio/ui';
import { HubPublishedRecipeInfo } from '@aglio/trpc';

export interface PreludeProps {
	content: Exclude<HubPublishedRecipeInfo['prelude'], null>;
}

export function Prelude({ content }: PreludeProps) {
	return (
		<Peek peekHeight={400}>
			<div className="p-summary" itemProp="description">
				{content.content.map((item, index) => (
					<PreludeItem key={index} item={item} />
				))}
			</div>
		</Peek>
	);
}

function PreludeItem({
	item,
}: {
	item: Exclude<HubPublishedRecipeInfo['prelude'], null>['content'][0];
}) {
	if (item.type === 'heading') {
		if (item.attrs.level === 1) {
			return <H2>{item.content[0].text}</H2>;
		} else if (item.attrs.level === 2) {
			return <H3>{item.content[0].text}</H3>;
		} else {
			return <H4>{item.content[0].text}</H4>;
		}
	} else {
		return <P>{item.content[0].text}</P>;
	}
}
