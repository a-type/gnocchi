import { FoodName, LookupFoodName } from '@/components/foods/FoodName.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Food, Item } from '@aglio/groceries-client';
import { Button } from '@a-type/ui/components/button';
import { H2 } from '@a-type/ui/components/typography';
import {
	ClockIcon,
	ExclamationTriangleIcon,
	OpenInNewWindowIcon,
	PlusIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useCallback } from 'react';
import { useExpiresSoonItems, useExpiresText } from '../hooks.js';
import { groceriesState } from '@/components/groceries/state.js';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import {
	CardActions,
	CardFooter,
	CardMain,
	CardRoot,
	CardTitle,
} from '@a-type/ui/components/card';
import { RelativeTime } from '@a-type/ui/components/relativeTime';
import { PantryListItem } from '../items/PantryListItem.jsx';

export interface ExpiresSoonSectionProps {
	className?: string;
}

export function ExpiresSoonSection({ className }: ExpiresSoonSectionProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<div className={classNames('flex flex-col mb-6', className)}>
			<H2 className="important:text-md gutter-bottom ml-3">Expiring soon</H2>
			<div className="flex flex-col gap-3">
				{expiresSoonItems.map((item) => (
					<PantryListItem
						item={item}
						key={item.get('canonicalName')}
						showLabels
						snoozable
					/>
				))}
			</div>
		</div>
	);
}
