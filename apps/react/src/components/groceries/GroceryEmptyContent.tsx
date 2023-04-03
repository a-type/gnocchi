import { Box } from '@aglio/ui/components/box';
import { P } from '@aglio/ui/components/typography';
import { Cart } from '../graphics/Cart.jsx';
import { InfrequentSubscriptionHint } from '../promotional/InfrequentSubscriptionHint.jsx';
import { InstallHint } from '../promotional/InstallHint.jsx';

export function GroceryEmptyContent() {
	return (
		<Box direction="column" p={4} gap={6}>
			<Box
				align="center"
				justify="center"
				flexGrow={1}
				textAlign="center"
				color="gray70"
				fontStyle="italic"
				fontSize="sm"
				gap={3}
				p={4}
			>
				<Cart
					width="15vmax"
					style={{
						maxWidth: 200,
					}}
				/>
				<P size="inherit" gutterBottom={false}>
					Your list is empty
				</P>
				<P size="inherit" gutterBottom={false}>
					Use the bar above to add items
				</P>
			</Box>
			<InstallHint />
			<InfrequentSubscriptionHint />
		</Box>
	);
}
