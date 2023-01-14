import { adminRouter } from './admin.js';
import { authRouter } from './auth.js';
import { categoriesRouter } from './categories.js';
import { t } from './common.js';
import { featureFlagsRouter } from './featureFlags.js';
import { invitesRouter } from './invites.js';
import { recipesRouter } from './recipes.js';
import { scansRouter } from './scans.js';
import { planRouter } from './plan.js';

export const appRouter = t.router({
	invites: invitesRouter,
	categories: categoriesRouter,
	scans: scansRouter,
	auth: authRouter,
	admin: adminRouter,
	featureFlags: featureFlagsRouter,
	recipes: recipesRouter,
	plan: planRouter,
});

export type AppRouter = typeof appRouter;

export { createContext } from './common.js';
