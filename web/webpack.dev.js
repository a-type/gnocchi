import { merge } from 'webpack-merge';
import common from './webpack.config.js';

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
});
