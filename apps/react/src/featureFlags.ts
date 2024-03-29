export const featureFlags = {
	recipes: true,
	recipePresence: true,
	hub: false,
	recipeImages: true,
	suggestions: true,
	pushNotifications: true,
	temporaryAccess: false,
	ocr: false,
	paprikaImport: true,
	pinnedRecipes: true,
	multipliedIngredients: false,
};

export type FeatureFlagName = keyof typeof featureFlags;
