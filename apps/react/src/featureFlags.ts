export const featureFlags = {
	recipes: true,
	recipePresence: true,
	hub: false,
	recipeImages: true,
};

export type FeatureFlagName = keyof typeof featureFlags;
