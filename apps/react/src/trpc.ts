import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '@aglio/trpc';

export const trpc = createReactQueryHooks<AppRouter>();
