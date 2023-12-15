import { ComponentPropsWithoutRef, useState } from 'react';
import { TabsRoot, TabsTrigger } from '@a-type/ui/components/tabs';
import { Link, useOnLocationChange } from '@verdant-web/react-router';

export const NavigationTabsRoot = (
	props: ComponentPropsWithoutRef<typeof TabsRoot>,
) => {
	const [path, setPath] = useState(() => window.location.pathname);
	useOnLocationChange(() => setPath(window.location.pathname));

	return <TabsRoot {...props} value={path} />;
};

export const NavigationTab = (
	props: ComponentPropsWithoutRef<typeof TabsTrigger>,
) => {
	return (
		<TabsTrigger asChild {...props}>
			<Link to={props.value} />
		</TabsTrigger>
	);
};
