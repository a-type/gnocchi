import {
	getColorMode,
	setColorMode,
	subscribeToColorModeChange,
} from '@/darkMode.js';
import { Box } from '@aglio/ui/src/components/box';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@aglio/ui/src/components/select';
import { Span } from '@aglio/ui/src/components/typography';
import { useEffect, useState } from 'react';

export function ColorModeSelect() {
	const [colorMode, setColorModeInternal] = useState<
		'light' | 'dark' | 'system'
	>(getColorMode);
	useEffect(() => subscribeToColorModeChange(setColorModeInternal), []);

	return (
		<Box direction="row" gap={2} align="center">
			<Span>Color theme:</Span>
			<Select value={colorMode} onValueChange={setColorMode}>
				<SelectTrigger>
					<SelectValue />
					<SelectIcon />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="system">System</SelectItem>
					<SelectItem value="light">Light</SelectItem>
					<SelectItem value="dark">Dark</SelectItem>
				</SelectContent>
			</Select>
		</Box>
	);
}
