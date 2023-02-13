export type HubRecipeInfo = {
	id: string;
	version: number;
	title: string;
	publishedAt: string;
	publisher: {
		id: string;
		fullName: string;
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
		type: 'step' | 'sectionTitle';
		content: string;
	}[];
};
