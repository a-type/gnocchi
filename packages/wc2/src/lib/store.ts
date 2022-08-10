import { reactive } from './reactives2';

export function makeStore<T extends Record<any, any>>(
  id: string,
  initialState: T,
) {
  return reactive(initialState);
}
