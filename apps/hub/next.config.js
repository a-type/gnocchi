import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	webpack: (config, { dev }) => {
		config.resolve.extensionAlias = {
			'.js': ['.ts', '.tsx', '.js', '.jsx'],
			'.jsx': ['.ts', '.tsx', '.js', '.jsx'],
		};
		config.mode = dev ? 'production' : config.mode;

		return config;
	},
	transpilePackages: ['@aglio/ui'],
};

export default withVanillaExtract(nextConfig);
