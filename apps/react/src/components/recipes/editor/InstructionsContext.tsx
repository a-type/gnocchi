import { createContext } from 'react';

export const InstructionsContext = createContext<{
	isEditing: boolean;
	hasPeers: boolean;
	showTools: boolean;
}>({
	isEditing: false,
	hasPeers: false,
	showTools: false,
});
