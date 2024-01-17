import { adminRouter } from './admin.js';
import { authRouter } from './auth.js';
import { categoriesRouter } from './categories.js';
import { t } from './common.js';
import { featureFlagsRouter } from './featureFlags.js';
import { invitesRouter } from './invites.js';
import { recipesRouter } from './recipes.js';
import { scansRouter } from './scans.js';
import { planRouter } from './plan.js';
import { hubRouter } from './hub.js';
import { foodRouter } from './food.js';
import { suggestionsRouter } from './suggestions.js';
import { changelogRouter } from './changelog.js';

export const appRouter = t.router({
	invites: invitesRouter,
	categories: categoriesRouter,
	scans: scansRouter,
	auth: authRouter,
	admin: adminRouter,
	featureFlags: featureFlagsRouter,
	recipes: recipesRouter,
	plan: planRouter,
	hub: hubRouter,
	food: foodRouter,
	suggestions: suggestionsRouter,
	changelog: changelogRouter,
});

export type AppRouter = typeof appRouter;

export { createContext } from './common.js';
export type { HubPublishedRecipeInfo } from './hub.js';
export type { Response, Request } from 'express';
export type { ExtractorData, DetailedStep } from '@aglio/scanning';
