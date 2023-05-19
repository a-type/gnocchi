import { Icon } from '@/components/icons/Icon.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Tooltip } from '@aglio/ui/components/tooltip';

export function OfflineIndicator() {
	const { error } = useAuth();

	if (!error) return null;

	return (
		<Tooltip content="Offline - but your changes will be saved!">
			<Icon className="opacity-50" name="offline" />
		</Tooltip>
	);
}
