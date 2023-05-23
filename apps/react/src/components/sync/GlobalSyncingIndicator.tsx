import { hooks } from '@/stores/groceries/index.js';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

export interface GlobalSyncingIndicatorProps {}

export function GlobalSyncingIndicator({}: GlobalSyncingIndicatorProps) {
	const [syncing, setSyncing] = useState(false);
	const client = hooks.useClient();
	useEffect(() => {
		return client.sync.subscribe('syncingChange', setSyncing);
	}, [client]);

	if (syncing) {
		return (
			<div className="fixed top-2 right-2 z-tooltip bg-gray-1 rounded-full p-1 text-xs flex flex-row gap-1 items-center animate-fade-in animate-delay-500">
				<ReloadIcon className="animate-spin" />
				<span>Syncing</span>
			</div>
		);
	}

	return null;
}