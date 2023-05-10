import * as Tabs from '@radix-ui/react-tabs';
import { withClassName } from '../../styles.js';
import * as classes from './tabs.css.js';

export const TabsRoot = withClassName(Tabs.Root, classes.root);

export const TabsList = withClassName(Tabs.List, classes.list);

export const TabsTrigger = withClassName(Tabs.Trigger, classes.trigger);

export const TabsContent = withClassName(Tabs.Content, classes.content);
