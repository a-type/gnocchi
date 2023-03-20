import { Icon } from '@/components/icons/Icon.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { updateRecipeFromUrl } from '@/stores/groceries/recipeMutations.js';
import { Recipe } from '@aglio/groceries-client';
import { Box, Button, LiveUpdateTextField, sprinkles } from '@aglio/ui';
import { useState } from 'react';

export interface RecipeUrlFieldProps {
	recipe: Recipe;
}

export function RecipeUrlField({ recipe }: RecipeUrlFieldProps) {
	const { url } = hooks.useWatch(recipe);
	const [scanning, setScanning] = useState(false);
	const isSubscribed = useIsSubscribed();

	const scan = async () => {
		if (url) {
			try {
				setScanning(true);
				updateRecipeFromUrl(recipe, url);
			} finally {
				setScanning(false);
			}
		}
	};

	return (
		<Box direction="row" gap={2} alignSelf="stretch" width="full">
			<LiveUpdateTextField
				placeholder="Source URL"
				value={url || ''}
				onChange={(url) => recipe.set('url', url)}
				type="url"
				className={sprinkles({ flex: 1 })}
			/>
			{isSubscribed && url && (
				<Button color="primary" onClick={scan} disabled={!url || scanning}>
					<Icon name="scan" style={{ width: 15, height: 15 }} />
					<span className={sprinkles({ ml: 2 })}>Scan</span>
				</Button>
			)}
		</Box>
	);
}
