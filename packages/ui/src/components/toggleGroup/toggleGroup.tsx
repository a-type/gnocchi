import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { withClassName } from '../../hooks/withClassName.js';

export const ToggleGroupRoot = withClassName(
	ToggleGroup.Root,
	'inline-flex bg-gray1 rounded-lg gap-1',
);
export const ToggleGroupItem = withClassName(
	ToggleGroup.Item,
	'rounded-xl bg-gray2 py-1 px-2 flex items-center justify-center cursor-pointer hover:bg-gray3 active:bg-gray4 focus-visible:(shadow-focus outline-off) [&[data-state=on]]:(bg-primary-light border-black)',
);
