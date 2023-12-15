import { Button } from '@a-type/ui/components/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui/components/popover';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

export interface HelpTipProps {
	children: ReactNode;
}

export function HelpTip({ children }: HelpTipProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button color="ghost" size="icon">
					<QuestionMarkCircledIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<span className="text-sm">{children}</span>
			</PopoverContent>
		</Popover>
	);
}
