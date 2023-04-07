import { proxy } from 'valtio';

export const signupDialogState = proxy({
	status: 'closed' as 'closed' | 'open',
});
