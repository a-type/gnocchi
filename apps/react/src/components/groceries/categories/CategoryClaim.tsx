import { useCategoryClaimPresence } from '@/components/groceries/categories/hooks.js';
import {
	PeopleList,
	PeopleListAvatar,
} from '@/components/sync/people/People.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Category } from '@aglio/groceries-client';
import { Button } from '@a-type/ui/components/button';
import classNames from 'classnames';
import { forwardRef, memo, useCallback, useEffect, useState } from 'react';

export const CategoryClaim = memo(function CategoryClaim({
	category,
}: {
	category: Category;
}) {
	const { isMyClaim, claimer } = useCategoryClaimPresence(category);
	const me = hooks.useSelf();
	const isSubscribed = useIsSubscribed();

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

	const [showTooltip, setShowTooltip] = useState(false);
	useEffect(() => {
		if (claimer) {
			setShowTooltip(true);
		}
	}, [claimer?.id]);
	useEffect(() => {
		if (showTooltip) {
			const timeout = setTimeout(() => {
				setShowTooltip(false);
			}, 2000);
			return () => {
				clearTimeout(timeout);
			};
		}
	}, [showTooltip]);

	const presences = hooks.useFindPeers(
		(peer) =>
			!!peer.presence?.lastInteractedCategory &&
			peer.presence?.lastInteractedCategory === category?.get('id'),
	);

	if (!isSubscribed) {
		return null;
	}

	const people = [...presences];
	if (claimer && !people.some((p) => p.id === claimer?.id)) {
		people.push(claimer);
	}

	const peopleCount = Math.max(1, people.length);

	return (
		<Button color="ghost" size="small" className="p-2px h-30px" onClick={claim}>
			<PeopleList count={peopleCount} size={18}>
				{people.map((person, index) => (
					<PeopleListAvatar
						key={person.id}
						index={index}
						person={person}
						popIn
					/>
				))}
				{!people.length && (
					<PeopleListAvatar
						index={0}
						person={null}
						popIn
						className="opacity-50"
					/>
				)}
			</PeopleList>
		</Button>
	);
});

const ClaimIcon = forwardRef<SVGSVGElement, { active?: boolean }>(
	function ClaimIcon({ active }, ref) {
		return (
			<svg
				width="15"
				height="15"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				ref={ref}
				className="z-1 relative"
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
	},
);
