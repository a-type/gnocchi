import { TabsList, TabsRoot, TabsTrigger } from '@a-type/ui/components/tabs';
import { useFilter } from '../hooks.js';

export interface PantryListSectionTabsProps {}

export function PantryListSectionTabs({}: PantryListSectionTabsProps) {
	const [filter, setFilter] = useFilter();

	return (
		<TabsRoot
			value={filter}
			onValueChange={(f) => setFilter(f as 'purchased' | 'all' | 'frozen')}
		>
			<TabsList>
				<TabsTrigger value="purchased">Purchased</TabsTrigger>
				<TabsTrigger value="frozen" className="theme-leek">
					Frozen
				</TabsTrigger>
				<TabsTrigger value="all">All foods</TabsTrigger>
			</TabsList>
		</TabsRoot>
	);
}
