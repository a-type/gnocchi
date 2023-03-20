import { useIsLoggedIn } from '@/hooks/useAuth.jsx';
import { featureFlags } from '@/featureFlags.js';
import { trpc } from '@/trpc.js';

export function useFeatureFlag(name: keyof typeof featureFlags) {
	const globalValue = featureFlags[name];
	const isLoggedIn = useIsLoggedIn();
	const { data: remoteValue } = trpc.featureFlags.getValue.useQuery(name, {
		// don't bother fetching if global is already enabled or the user doesn't have
		// an account.
		enabled: !globalValue && isLoggedIn,
	});

	return globalValue || !!remoteValue;
}
