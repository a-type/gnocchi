import { PantryAdd } from '@/components/pantry/PantryAdd.jsx';
import { Box } from '@aglio/ui/src/components/box';
import { Button } from '@aglio/ui/src/components/button';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/src/components/collapsible';
import { H1 } from '@aglio/ui/src/components/typography';
import { sprinkles } from '@aglio/ui/styles';
import { PlusIcon } from '@radix-ui/react-icons';

export function PantryHeader() {
	return (
		<CollapsibleRoot>
			<Box direction="column">
				<Box direction="row" justify="space-between" align="center">
					<H1
						className={sprinkles({
							fontSize: 'md',
						})}
						gutterBottom={false}
					>
						Purchased
					</H1>
					<CollapsibleTrigger asChild>
						<Button size="icon" color="default">
							<PlusIcon className="transition-transform [div[data-state=open]_&]:rotate-45" />
						</Button>
					</CollapsibleTrigger>
				</Box>
				<CollapsibleContent>
					<Box p={1}>
						<PantryAdd />
					</Box>
				</CollapsibleContent>
			</Box>
		</CollapsibleRoot>
	);
}
