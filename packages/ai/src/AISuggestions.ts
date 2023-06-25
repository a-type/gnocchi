import { assert } from '@aglio/tools';
import { Configuration, OpenAIApi } from 'openai';

export class AISuggestions {
	private openai: OpenAIApi | null = null;
	constructor(apiKey?: string) {
		if (apiKey) {
			this.openai = new OpenAIApi(new Configuration({ apiKey }));
		}
	}

	async suggestGroceryItems(currentList: string[]) {
		if (!this.openai) {
			console.error('No OpenAI API key provided. Cannot use AI suggestions.');
			return [];
		}

		const prompt = `Here is a list of grocery items:
${currentList.join('\n')}

Please suggest some more items to add to the list, for example:
- apples
- bananas
- milk

The items you suggest should be in the same format as the items above, with a dash and a space before the item name.
Your suggestions should include foods that go together with the items already on the list.
Please don't suggest items that are already on the list.
Please don't include preparation instructions, such as "chopped" or "sliced". Only list names of foods.
Provide at least 3 suggestions, and no more than 10.

`;
		const response = await this.openai.createCompletion({
			model: 'text-davinci-003',
			prompt,
			temperature: 0.6,
		});
		if (response.status !== 200)
			throw new Error(`OpenAI API returned status ${response.status}`);
		const firstResponse = response.data.choices[0].text ?? '';

		console.debug('AI response:', firstResponse);

		const parsedList = firstResponse
			.split('\n')
			.map((item) => item.trim().replace(/^- /, ''))
			.filter((item) => item.length > 1);

		return parsedList;
	}
}
