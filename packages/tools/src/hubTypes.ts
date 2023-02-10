export type HubRecipeInfo = {
	id: string;
	version: number;
	title: string;
	publishedAt: string;
	author: {
		id: string;
		name: string;
	};
	ingredients: {
		id: string;
		text: string;
		unit?: string;
		food: string;
		quantity: number;
		comments: string[];
	}[];
	instructions: {
		id: string;
		type: 'step' | 'heading';
		content: string;
	}[];
};
