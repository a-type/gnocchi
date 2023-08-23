import { Icon } from '@/components/icons/Icon.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { trpc } from '@/trpc.js';
import { Button } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import classNames from 'classnames';
import { useState } from 'react';

export interface ChangelogDisplayProps {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	hideOnSeen?: boolean;
	className?: string;
}

export function ChangelogDisplay({
	children,
	hideOnSeen,
	className,
	...rest
}: ChangelogDisplayProps) {
	const [seen, setSeen] = useLocalStorage<string | null>(
		'changelog-seen',
		null,
	);
	const [capturedSeen] = useState(seen);
	const { data = [] } = trpc.changelog.getChangelogs.useQuery({
		limit: 5,
	});
	const lastSeenIndex = data.findIndex((x) => x.id === capturedSeen);
	const hasUnseen = lastSeenIndex !== 0;
	const hasNew = data.findIndex((x) => x.id === seen) !== 0;

	if (!hasUnseen && hideOnSeen) return null;

	return (
		<Dialog
			{...rest}
			onOpenChange={(open) => {
				rest.onOpenChange?.(open);
				if (open) {
					setSeen(data[0].id);
				}
			}}
		>
			<DialogTrigger
				asChild
				className={classNames(className)}
				data-new={hasNew}
			>
				{children || (
					<Button
						color="ghost"
						className={hasNew ? 'color-accent-dark bg-accent-wash' : undefined}
						size="icon"
					>
						<Icon name="gift" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>What's new</DialogTitle>
				<div className="flex flex-col overflow-y-auto gap-4">
					{data.map((item, idx) => (
						<div key={item.id} className="relative">
							<p className="text-xs italic text-gray-7 mb-1">
								{new Date(item.createdAt).toLocaleDateString()}
							</p>
							<h3 className="text-lg font-bold mt-0 mb-2">{item.title}</h3>
							<p className="text-sm mt-0">{item.details}</p>
							{(lastSeenIndex === -1 || idx < lastSeenIndex) && (
								<div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full" />
							)}
						</div>
					))}
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button>Close</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
