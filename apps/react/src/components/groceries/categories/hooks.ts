import { hooks } from '@/stores/groceries/index.js';
import { Category } from '@aglio/groceries-client';

export function useCategoryClaimPresence(category: Category | null) {
	hooks.useWatch(category);
	const claim = category?.get('claim');
	const self = hooks.useSelf();
	const peer = hooks.usePeer(claim?.get('claimedBy') ?? null);
	const user = self.id === claim?.get('claimedBy') ? self : peer;
	// only return claims in the last day
	if (!claim || claim?.get('claimedAt') < Date.now() - 1000 * 60 * 60 * 24) {
		return {
			claimer: null,
			isMyClaim: false,
		};
	}
	return {
		claimer: user,
		isMyClaim: user?.id === self.id,
	};
}
