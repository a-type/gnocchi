import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { microdata } from './microdata.js';

describe('microdata extractor', () => {
	it('extracts detailed steps', async () => {
		const html = `
      <html>
        <body>
          <div itemscope itemtype="http://schema.org/Recipe">
            <h1 itemprop="name">The Best Chocolate Chip Cookies</h1>
            <div itemprop="author" itemscope itemtype="http://schema.org/Person">
              <span itemprop="name">Some One</span>
            </div>
            <img itemprop="image" itemscope itemtype="http://schema.org/ImageObject" src="https://fakesite.com/wp-content/uploads/2019/08/best-chocolate-chip-cookies.jpg" alt="The Best Chocolate Chip Cookies" />
            <div itemprop="description">
              <p>These are the best chocolate chip cookies ever!</p>
            </div>
            <div>
              <ul>
                <li itemprop="recipeIngredient">2 1/4 cups all-purpose flour</li>
                <li itemprop="recipeIngredient">1 teaspoon baking soda</li>
                <li itemprop="recipeIngredient">1 teaspoon salt</li>
                <li itemprop="recipeIngredient">1 cup (2 sticks) unsalted butter, at room temperature</li>
                <li itemprop="recipeIngredient">1/2 cup granulated sugar</li>
                <li itemprop="recipeIngredient">1 cup packed light brown sugar</li>
                <li itemprop="recipeIngredient">2 large eggs</li>
                <li itemprop="recipeIngredient">1 teaspoon vanilla extract</li>
                <li itemprop="recipeIngredient">2 cups semisweet chocolate chips</li>
              </ul>
            </div>
            <div itemprop="recipeInstructions">
              <h2>Make the dough</h2>
              <p>Preheat oven to 350 degrees F. Line a baking sheet with parchment paper.</p>
              <p>In a medium bowl, whisk together the flour, baking soda, and salt. Set aside.</p>
              <p>In the bowl of a stand mixer fitted with the paddle attachment, beat the butter, granulated sugar, and brown sugar together on medium speed until light and fluffy, about 3 to 4 minutes. Add the eggs and vanilla and mix well. Add the dry ingredients and mix on low speed until just combined. Add the chocolate chips and mix on low speed until evenly distributed throughout the dough.</p>
              <h2>Bake the cookies</h2>
              <p>Using a small cookie scoop or a tablespoon, drop the dough onto the prepared baking sheet, spacing the cookies about 2 inches apart. Bake for 10 to 12 minutes, until the edges are set and the cookies are golden brown. Let the cookies cool on the baking sheet for 5 minutes, then transfer them to a wire rack to cool completely.</p>
            </div>
          </div>
        </body>
      </html>
    `;

		const $ = load(html);
		const data = await microdata($);

		expect(data).not.toBeNull();
		expect(data!.title).toBe('The Best Chocolate Chip Cookies');
		expect(data!.author).toBe('Some One');
		expect(data!.image).toBe(
			'https://fakesite.com/wp-content/uploads/2019/08/best-chocolate-chip-cookies.jpg',
		);
		expect(data!.description).toBe(
			'These are the best chocolate chip cookies ever!',
		);
		expect(data!.rawIngredients).toEqual([
			'2 1/4 cups all-purpose flour',
			'1 teaspoon baking soda',
			'1 teaspoon salt',
			'1 cup (2 sticks) unsalted butter, at room temperature',
			'1/2 cup granulated sugar',
			'1 cup packed light brown sugar',
			'2 large eggs',
			'1 teaspoon vanilla extract',
			'2 cups semisweet chocolate chips',
		]);
		expect(data!.detailedSteps).toEqual([
			{ type: 'sectionTitle', content: 'Make the dough' },
			{
				type: 'step',
				content:
					'Preheat oven to 350 degrees F. Line a baking sheet with parchment paper.',
			},
			{
				type: 'step',
				content:
					'In a medium bowl, whisk together the flour, baking soda, and salt. Set aside.',
			},
			{
				type: 'step',
				content:
					'In the bowl of a stand mixer fitted with the paddle attachment, beat the butter, granulated sugar, and brown sugar together on medium speed until light and fluffy, about 3 to 4 minutes. Add the eggs and vanilla and mix well. Add the dry ingredients and mix on low speed until just combined. Add the chocolate chips and mix on low speed until evenly distributed throughout the dough.',
			},
			{ type: 'sectionTitle', content: 'Bake the cookies' },
			{
				type: 'step',
				content:
					'Using a small cookie scoop or a tablespoon, drop the dough onto the prepared baking sheet, spacing the cookies about 2 inches apart. Bake for 10 to 12 minutes, until the edges are set and the cookies are golden brown. Let the cookies cool on the baking sheet for 5 minutes, then transfer them to a wire rack to cool completely.',
			},
		]);
		expect(data!.steps).toEqual([
			'Make the dough',
			'Preheat oven to 350 degrees F. Line a baking sheet with parchment paper.',
			'In a medium bowl, whisk together the flour, baking soda, and salt. Set aside.',
			'In the bowl of a stand mixer fitted with the paddle attachment, beat the butter, granulated sugar, and brown sugar together on medium speed until light and fluffy, about 3 to 4 minutes. Add the eggs and vanilla and mix well. Add the dry ingredients and mix on low speed until just combined. Add the chocolate chips and mix on low speed until evenly distributed throughout the dough.',
			'Bake the cookies',
			'Using a small cookie scoop or a tablespoon, drop the dough onto the prepared baking sheet, spacing the cookies about 2 inches apart. Bake for 10 to 12 minutes, until the edges are set and the cookies are golden brown. Let the cookies cool on the baking sheet for 5 minutes, then transfer them to a wire rack to cool completely.',
		]);
	});

	// hi, smitten kitchen
	it('extracts detailed steps from really weird formatting', async () => {
		const html = `
      <html>
        <body>
          <div itemscope itemtype="http://schema.org/Recipe">
            <h1 itemprop="name">The Best Chocolate Chip Cookies</h1>
            <div itemprop="author" itemscope itemtype="http://schema.org/Person">
              <span itemprop="name">Some One</span>
            </div>
            <img itemprop="image" itemscope itemtype="http://schema.org/ImageObject" src="https://fakesite.com/wp-content/uploads/2019/08/best-chocolate-chip-cookies.jpg" alt="The Best Chocolate Chip Cookies" />
            <div itemprop="description">
              <p>These are the best chocolate chip cookies ever!</p>
            </div>
            <div>
              <ul>
                <li itemprop="recipeIngredient">2 1/4 cups all-purpose flour</li>
                <li itemprop="recipeIngredient">1 teaspoon baking soda</li>
                <li itemprop="recipeIngredient">1 teaspoon salt</li>
                <li itemprop="recipeIngredient">1 cup (2 sticks) unsalted butter, at room temperature</li>
                <li itemprop="recipeIngredient">1/2 cup granulated sugar</li>
                <li itemprop="recipeIngredient">1 cup packed light brown sugar</li>
                <li itemprop="recipeIngredient">2 large eggs</li>
                <li itemprop="recipeIngredient">1 teaspoon vanilla extract</li>
                <li itemprop="recipeIngredient">2 cups semisweet chocolate chips</li>
              </ul>
            </div>
            <ul itemprop="recipeInstructions">
              <strong>Make the dough</strong>
              Preheat oven to 350 degrees F. Line a baking sheet with parchment paper.
              <p>
                <strong>Make the batter</strong>
                In a medium bowl, whisk together the flour, baking soda, and salt. Set aside.
              </p>
              <p>
              In the bowl of a stand mixer fitted with the paddle attachment, beat the butter, granulated sugar, and brown sugar together on medium speed until light and fluffy, about 3 to 4 minutes. Add the eggs and vanilla and mix well. Add the dry ingredients and mix on low speed until just combined. Add the chocolate chips and mix on low speed until evenly distributed throughout the dough.
              </p>
              <p>
                <strong>Bake the cookies</strong>
                Using a small cookie scoop or a tablespoon, drop the dough onto the prepared baking sheet, spacing the cookies about 2 inches apart. Bake for 10 to 12 minutes, until the edges are set and the cookies are golden brown. Let the cookies cool on the baking sheet for 5 minutes, then transfer them to a wire rack to cool completely.
              </p>
              <p>
                <strong>Notes / anticipated questions:</strong>
              </p>
              <li class="jetpack-recipe-directions"><strong>Can I make these gluten-free?</strong> Yes, use a gluten-free flour.</li>
              <li class="jetpack-recipe-directions"><strong>Can I make these vegan?</strong> Yes, use a vegan butter substitute and flax eggs.</li>
              <p></p>
            </ul>
          </div>
        </body>
      </html>
    `;

		const $ = load(html);
		const data = await microdata($);

		expect(data!.title).toBe('The Best Chocolate Chip Cookies');
		expect(data!.author).toBe('Some One');
		expect(data!.image).toBe(
			'https://fakesite.com/wp-content/uploads/2019/08/best-chocolate-chip-cookies.jpg',
		);
		expect(data!.description).toBe(
			'These are the best chocolate chip cookies ever!',
		);
		expect(data!.detailedSteps).toEqual([
			{ type: 'sectionTitle', content: 'Make the dough' },
			{
				type: 'step',
				content:
					'Preheat oven to 350 degrees F. Line a baking sheet with parchment paper.',
			},
			{ type: 'sectionTitle', content: 'Make the batter' },
			{
				type: 'step',
				content:
					'In a medium bowl, whisk together the flour, baking soda, and salt. Set aside.',
			},
			{
				type: 'step',
				content:
					'In the bowl of a stand mixer fitted with the paddle attachment, beat the butter, granulated sugar, and brown sugar together on medium speed until light and fluffy, about 3 to 4 minutes. Add the eggs and vanilla and mix well. Add the dry ingredients and mix on low speed until just combined. Add the chocolate chips and mix on low speed until evenly distributed throughout the dough.',
			},
			{ type: 'sectionTitle', content: 'Bake the cookies' },
			{
				type: 'step',
				content:
					'Using a small cookie scoop or a tablespoon, drop the dough onto the prepared baking sheet, spacing the cookies about 2 inches apart. Bake for 10 to 12 minutes, until the edges are set and the cookies are golden brown. Let the cookies cool on the baking sheet for 5 minutes, then transfer them to a wire rack to cool completely.',
			},
			{ type: 'sectionTitle', content: 'Notes / anticipated questions:' },
			{ type: 'sectionTitle', content: 'Can I make these gluten-free?' },
			{ type: 'step', content: 'Yes, use a gluten-free flour.' },
			{ type: 'sectionTitle', content: 'Can I make these vegan?' },
			{
				type: 'step',
				content: 'Yes, use a vegan butter substitute and flax eggs.',
			},
		]);
	});
});
