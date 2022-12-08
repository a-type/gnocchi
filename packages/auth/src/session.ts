export interface Session {
	userId: string;
	name: string | null;
	planId: string;
	role: 'admin' | 'user';
}
