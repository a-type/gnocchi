export type Session = {
	name: string | null;
	planId: string;
	isProductAdmin: boolean;
	userId: string;
	role: 'admin' | 'user';
};

export type TemporaryAccessSession = {
	name: string | null;
	planId: string;
	temporaryAccessId: string;
};
