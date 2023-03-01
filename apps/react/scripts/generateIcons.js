import axios from 'axios';
import fs from 'fs-extra';
import * as path from 'path';
import prettier from 'prettier';
import { camelCase } from 'change-case';
import * as url from 'url';
import { config } from 'dotenv';

config({
	debug: true,
	override: true,
});

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const figmaClient = axios.create({
	baseURL: 'https://api.figma.com/v1',
	headers: {
		'Content-Type': 'application/json',
		'X-Figma-Token': process.env.FIGMA_TOKEN,
	},
});

const FILE_ID = 'EjIaQMFX5kBnC59WS1clcA';
const PAGE = 'Page 1';
const FRAME = 'Icon';

const baseDir = path.join(__dirname, '../src/components/icons/generated');

const nameMatch = /^name=(.+?)$/;
function getIconName(iconNode) {
	return nameMatch.exec(iconNode.name)[1];
}

function renderIconDef(icon) {
	return `<symbol id="icon-${icon.name}" viewBox="0 0 ${icon.width} ${icon.height}">${icon.svg}</symbol>`;
}

function stripSvg(svgString) {
	return svgString.replaceAll(/<svg[^>]*>/g, '').replace(/<\/svg>/g, '');
}

// any svg with a fill of black will be replaced with 'currentColor
// this allows for secondary colors to exist in the svg
function fillCurrentColor(svgString) {
	return svgString.replaceAll(/fill="black"/g, `fill="currentColor"`);
}

function strokeCurrentColor(svgString) {
	return svgString.replaceAll(/stroke="black"/g, `stroke="currentColor"`);
}

function reactifyAttributes(svgString) {
	const camelized = svgString.replaceAll(
		/(\w+?(?:-\w+?)+)=/g,
		(match, p1) => `${camelCase(p1)}=`,
	);
	// replace style="key: value" with style={{ key: value }}
	return camelized.replace(
		/style="([^"]+)"/g,
		(match, p1) => `style={${convertStyleStringToObjectString(p1)}}`,
	);
}

function convertStyleStringToObjectString(styleString) {
	const objectVersion = styleString
		.split(';')
		.map((style) => style.split(':'))
		.reduce((acc, [key, value]) => {
			acc[camelCase(key)] = value;
			return acc;
		}, {});

	return JSON.stringify(objectVersion);
}

function processIconSvg(svgString) {
	return reactifyAttributes(
		fillCurrentColor(strokeCurrentColor(stripSvg(svgString))),
	);
}

async function downloadImage(url) {
	const response = await axios.get(url, { responseType: 'arrayBuffer' });
	return Buffer.from(response.data, 'binary').toString('utf-8');
}

async function genIcons() {
	const prettierConfig = await prettier.resolveConfig(__dirname);
	prettierConfig.parser = 'babel-ts';

	const figmaFile = await figmaClient.get(`/files/${FILE_ID}`);
	const figmaPage = figmaFile.data.document.children.find(
		(page) => page.name === PAGE,
	);
	const figmaFrame = figmaPage.children.find((frame) => frame.name === FRAME);
	const iconIds = figmaFrame.children.map((icon) => icon.id);

	const iconImagesResponse = await figmaClient.get(
		`/images/${FILE_ID}?format=svg&ids=${iconIds.join(',')}`,
	);
	const iconImages = iconImagesResponse.data.images;

	// match up images to icon metadata
	const icons = await Promise.all(
		figmaFrame.children.map(async (iconNode) => {
			const iconName = getIconName(iconNode);
			const iconImage = iconImages[iconNode.id];
			return {
				name: iconName,
				width: iconNode.absoluteBoundingBox.width,
				height: iconNode.absoluteBoundingBox.height,
				svg: processIconSvg(await downloadImage(iconImage)),
			};
		}),
	);

	// compile icons into a spritesheet
	const spritesheetSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }} {...props}>
      <defs>
${icons.map(renderIconDef).join('\n')}
      </defs>
    </svg>
  `;

	if (!fs.existsSync(baseDir)) {
		fs.mkdirSync(baseDir);
	}

	fs.writeFileSync(
		path.join(baseDir, 'IconSpritesheet.tsx'),
		prettier.format(
			`// WARNING: generated file! See 'yarn gen:icons'. Do not modify!
export const IconSpritesheet = (props: any) => (
  ${spritesheetSvg}
);
`,
			prettierConfig,
		),
	);

	fs.writeFileSync(
		path.join(baseDir, 'iconNames.ts'),
		prettier.format(
			`// WARNING: generated file! See 'yarn gen:icons'. Do not modify!
export const iconNames = [${icons
				.map((i) => `'${i.name}'`)
				.join(', ')}] as const;

export type IconName = typeof iconNames[number];
`,
			prettierConfig,
		),
	);
}

genIcons().catch((err) => {
	console.error(err);
});
