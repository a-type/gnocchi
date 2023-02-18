export const featureFlags = {
	recipes: true,
	recipePresence: true,
	hub: false,
	recipeImages: false,
};

export type FeatureFlagName = keyof typeof featureFlags;
