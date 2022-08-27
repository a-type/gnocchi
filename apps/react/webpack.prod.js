import { merge } from 'webpack-merge';
import common from './webpack.config.js';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import webpack from 'webpack';

process.env.NODE_ENV = 'production';

export default merge(common, {
	// mode: 'production',
	mode: 'production',
	devtool: 'inline-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({
				NODE_ENV: 'production',
				PUBLIC_URL: process.env.PUBLIC_URL || 'https://aglio.gfor.rest',
				API_ORIIGN: process.env.API_ORIIGN || 'api.aglio.gfor.rest',
			}),
		}),
		new WorkboxWebpackPlugin.InjectManifest({
			swSrc: './src/service-worker.ts',
			exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
			maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
		}),
	],
});
