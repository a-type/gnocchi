export function getGroceryLibraryName(planId: string) {
	return planId;
}

export function getRecipesLibraryName(planId: string) {
	return `${planId}_recipes`;
}

export function getPlanIdFromGroceryLibraryId(libraryId: string) {
	return libraryId;
}
