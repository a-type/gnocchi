export const featureFlags = {
	recipes: true,
	recipePresence: true,
	hub: false,
	recipeImages: true,
	suggestions: false,
	pushNotifications: false,
	temporaryAccess: false,
};

export type FeatureFlagName = keyof typeof featureFlags;
