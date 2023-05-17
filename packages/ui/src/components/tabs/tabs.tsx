import * as Tabs from '@radix-ui/react-tabs';
import { withClassName } from '../../hooks/withClassName.js';

export const TabsRoot = withClassName(Tabs.Root, '');

export const TabsList = withClassName(
	Tabs.List,
	'flex flex-row gap-2 py-3 px-2 justify-center',
);

export const TabsTrigger = withClassName(
	Tabs.Trigger,
	'flex flex-row items-center justify-center gap-2 color-black py-1 px-4 rounded-lg bg-wash text-md font-bold min-w-100px border border-solid border-gray2 hover:bg-gray2 focus-visible:(shadow-focus outline-off) [&[data-state=active]]:(bg-primary-light border-primary-light)',
);

export const TabsContent = withClassName(Tabs.Content, '');
