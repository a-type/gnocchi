import { Icon } from '@/components/icons/Icon.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Tooltip, sprinkles } from '@aglio/ui';

export function OfflineIndicator() {
	const { error } = useAuth();

	if (!error) return null;

	return (
		<Tooltip content="Offline - but your changes will be saved!">
			<Icon
				className={sprinkles({
					opacity: 0.5,
				})}
				name="offline"
			/>
		</Tooltip>
	);
}
