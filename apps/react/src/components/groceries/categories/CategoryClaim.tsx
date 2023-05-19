import { PersonAvatar } from '@/components/sync/people/PersonAvatar.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Category } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '@aglio/ui/components/collapsible';
import classNames from 'classnames';
import { memo, useCallback } from 'react';

export const CategoryClaim = memo(function CategoryClaim({
	category,
}: {
	category: Category;
}) {
	const claimer = useCategoryClaimPresence(category);
	const me = hooks.useSelf();
	const isMyClaim = claimer?.id === me.id;

	const claim = useCallback(() => {
		if (isMyClaim) {
			category.set('claim', null);
		} else {
			category.set('claim', {
				claimedBy: me.id,
				claimedAt: Date.now(),
			});
		}
	}, [me.id, isMyClaim]);

	const isSubscribed = useIsSubscribed();

	if (!isSubscribed) {
		return null;
	}

	return (
		<Button color="ghost" size="small" className="py-0 h-30px" onClick={claim}>
			<CollapsibleRoot open={!!claimer}>
				<CollapsibleContent data-horizontal>
					<div className="flex flex-row items-center justify-center gap-1">
						<span className="text-xs font-sans font-normal color-gray-5 whitespace-nowrap">
							claimed
						</span>
						{!!claimer ? (
							<PersonAvatar className="w-20px h-20px" person={claimer} />
						) : (
							<div className="w-20px h-20px" />
						)}
					</div>
				</CollapsibleContent>
			</CollapsibleRoot>
			<ClaimIcon active={!!claimer} />
		</Button>
	);
});

// TODO: elevate this to a reusable hook in lo-fi?
function useCategoryClaimPresence(category: Category) {
	const { claim } = hooks.useWatch(category);
	const self = hooks.useSelf();
	const peer = hooks.usePeer(claim?.get('claimedBy') ?? null);
	const user = self.id === claim?.get('claimedBy') ? self : peer;
	// only return claims in the last day
	if (!claim || claim?.get('claimedAt') < Date.now() - 1000 * 60 * 60 * 24) {
		return null;
	}
	return user;
}

function ClaimIcon({ active }: { active?: boolean }) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.5 14.5L10.6429 4.99999M10.6429 4.99999L11.5 0.999986C11.5 0.999986 9 1.99999 7.5 0.999986C6 -1.35601e-05 3.5 0.999986 3.5 0.999986L3 4.99999C3 4.99999 5 3.49999 6.8258 4.60521C8.6516 5.71043 10.6429 4.99999 10.6429 4.99999Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={classNames(
					'opacity-50 transition-all duration-200 ease-springy',
					active
						? 'opacity-100 stroke-accentDark fill-accentLight'
						: 'opacity-50 stroke-current fill-none',
				)}
			/>
		</svg>
	);
}
