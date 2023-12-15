import { Icon } from '@/components/icons/Icon.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@a-type/ui/components/button';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { useState } from 'react';

export interface RecipeUrlFieldProps {
	recipe: Recipe;
}

export function RecipeUrlField({ recipe }: RecipeUrlFieldProps) {
	const { url } = hooks.useWatch(recipe);
	const [scanning, setScanning] = useState(false);
	const isSubscribed = useIsSubscribed();
	const updateRecipeFromUrl = hooks.useUpdateRecipeFromUrl();

	const scan = async () => {
		if (url) {
			try {
				setScanning(true);
				await updateRecipeFromUrl(recipe, url);
			} finally {
				setScanning(false);
			}
		}
	};

	return (
		<div className="flex gap-2 self-stretch w-full">
			<LiveUpdateTextField
				placeholder="Source URL"
				value={url || ''}
				onChange={(url) => recipe.set('url', url)}
				type="url"
				className="flex-1"
			/>
			{isSubscribed && url && (
				<Button color="primary" onClick={scan} disabled={!url || scanning}>
					<Icon name="scan" style={{ width: 15, height: 15 }} />
					<span className="ml-2">Scan</span>
				</Button>
			)}
		</div>
	);
}
