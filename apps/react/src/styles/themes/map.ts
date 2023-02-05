import { blueberryTheme } from './blueberry.css.js';
import { lemonTheme } from './lemon.css.js';
import { tomatoTheme } from './tomato.css.js';
import { eggplantTheme } from './eggplant.css.js';
import { leekTheme } from './leek.css.js';

export const themeMap = {
	blueberry: blueberryTheme,
	eggplant: eggplantTheme,
	leek: leekTheme,
	lemon: lemonTheme,
	tomato: tomatoTheme,
};

export function randomTheme() {
	const themes = Object.keys(themeMap);
	const randomIndex = Math.floor(Math.random() * themes.length);
	return themes[randomIndex];
}
