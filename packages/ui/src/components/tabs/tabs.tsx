import * as Tabs from '@radix-ui/react-tabs';
import { withClassName } from '../../hooks/withClassName.js';

export const TabsRoot = withClassName(Tabs.Root, '');

export const TabsList = withClassName(
	Tabs.List,
	'flex flex-row py-2 px-2 justify-center',
);

export const TabsTrigger = withClassName(
	Tabs.Trigger,
	'flex flex-row items-center justify-center gap-2 color-black py-1 px-4 bg-wash text-md font-bold min-w-100px border border-solid border-gray-4',
	'hover:bg-gray-3 focus-visible:(shadow-focus outline-off) [&[data-state=active]]:(bg-primary-wash border-primary hover:bg-primary-wash relative z-1)',
	'first:rounded-l-full last:rounded-r-full',
);

export const TabsContent = withClassName(Tabs.Content, '');
