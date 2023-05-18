import UnoCSS from '@unocss/webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { dev, buildId }) => {
		config.resolve.extensionAlias = {
			'.js': ['.ts', '.tsx', '.js', '.jsx'],
			'.jsx': ['.ts', '.tsx', '.js', '.jsx'],
		};
		config.mode = dev ? 'production' : config.mode;

		config.plugins.push(UnoCSS());

		if (buildId !== 'development') {
			// * disable filesystem cache for build
			// * https://github.com/unocss/unocss/issues/419
			// * https://webpack.js.org/configuration/cache/
			config.cache = false;
		}

		return config;
	},
	transpilePackages: ['@aglio/ui', '@aglio/trpc'],
	images: {
		domains: ['localhost', 's3.amazonaws.com'],
	},
};

export default nextConfig;
