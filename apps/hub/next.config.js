// import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin({});

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { dev }) => {
		config.resolve.extensionAlias = {
			'.js': ['.ts', '.tsx', '.js', '.jsx'],
			'.jsx': ['.ts', '.tsx', '.js', '.jsx'],
		};
		config.mode = dev ? 'production' : config.mode;

		config.module.rules.unshift({
			test: /@aglio/, // Can also be your individual package name
			resolve: {
				mainFields: ['module'],
			},
		});

		return config;
	},
	transpilePackages: [
		'@aglio/ui',
		// '@aglio/tools',
		// '@aglio/auth',
		// '@aglio/conversion',
		// '@aglio/email',
		// '@aglio/scanning',
		// '@aglio/prisma',
		'@aglio/trpc',
	],
};

// export default withVanillaExtract(nextConfig);
module.exports = withVanillaExtract(nextConfig);
