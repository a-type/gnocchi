import { Cart } from '../graphics/Cart.jsx';
import { Box, H3, P } from '@aglio/ui';
import { InfrequentSubscriptionHint } from '../promotional/InfrequentSubscriptionHint.jsx';
import { InstallHint } from '../promotional/InstallHint.jsx';
import { OnboardingBanner } from '../onboarding/OnboardingBanner.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';

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
				<Cart width="15vmax" />
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
