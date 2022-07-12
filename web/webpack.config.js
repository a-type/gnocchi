import HtmlWebpackPlugin from 'html-webpack-plugin';
import ResolveTypeScriptPlugin from 'resolve-typescript-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve tsconfig.json paths to Webpack aliases
 * @param  {string} tsconfigPath           - Path to tsconfig
 * @param  {string} webpackConfigBasePath  - Path from tsconfig to Webpack config to create absolute aliases
 * @return {object}                        - Webpack alias config
 */
function resolveTsconfigPathsToAlias({
	tsconfigPath = './tsconfig.json',
	webpackConfigBasePath = __dirname,
} = {}) {
	const { paths } = require(tsconfigPath).compilerOptions;

	const aliases = {};

	Object.keys(paths).forEach((item) => {
		const key = item.replace('/*', '');
		const value = path.resolve(
			webpackConfigBasePath,
			paths[item][0].replace('/*', '').replace('*', ''),
		);

		aliases[key] = value;
	});

	return aliases;
}

const config = {
	devServer: {
		static: {
			directory: path.resolve(__dirname),
			publicPath: '/',
		},
		allowedHosts: 'all',
		hot: true,
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
	},
	entry: './src/main.tsx',
	mode: 'development',
	resolve: {
		plugins: [new ResolveTypeScriptPlugin()],
		extensions: ['.dev.js', '.js', '.json', '.wasm', '.ts', '.tsx'],
		fallback: {
			crypto: false,
			path: false,
			fs: false,
		},
		roots: [path.resolve(__dirname, 'src')],
		alias: {
			components: path.resolve(__dirname, 'src/components'),
			contexts: path.resolve(__dirname, 'src/contexts'),
			lib: path.resolve(__dirname, 'src/lib'),
			stores: path.resolve(__dirname, 'src/stores'),
			'stitches.config': path.resolve(__dirname, 'src/stitches.config'),
		},
	},
	plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
	module: {
		rules: [
			{
				test: /\.sql$/i,
				use: 'raw-loader',
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},
};

export default config;
