import { merge } from 'webpack-merge';
import common from './webpack.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'public'),
			publicPath: '/',
		},
		allowedHosts: 'all',
		hot: true,
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({
				NODE_ENV: process.env.NODE_ENV,
				PUBLIC_URL: 'http://localhost:8080',
			}),
		}),
	],
});
