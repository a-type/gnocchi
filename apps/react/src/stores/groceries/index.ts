import { Groceries } from '@aglio/data';
import { createHooks } from '@aphro/react';

export const groceries = new Groceries();

export const { useQuery, useQueryOne, useBind } = createHooks(
	groceries.contextPromise,
);
