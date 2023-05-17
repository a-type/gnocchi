import { PantryAdd } from '@/components/pantry/PantryAdd.jsx';
import { Button } from '@aglio/ui/src/components/button';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/src/components/collapsible';
import { H1 } from '@aglio/ui/src/components/typography';
import { PlusIcon } from '@radix-ui/react-icons';

export function PantryHeader() {
	return (
		<CollapsibleRoot>
			<div className="flex flex-col">
				<div className="flex flex-row justify-between items-center">
					<H1 className="text-md">Purchased</H1>
					<CollapsibleTrigger asChild>
						<Button size="icon" color="default">
							<PlusIcon className="transition-transform [div[data-state=open]_&]:rotate-45" />
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<div className="p-1">
						<PantryAdd />
					</div>
				</CollapsibleContent>
			</div>
		</CollapsibleRoot>
	);
}
