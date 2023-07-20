import UnoCSS from '@unocss/webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	webpack: (config, { dev, buildId }) => {
		config.resolve.extensionAlias = {
			'.js': ['.ts', '.tsx', '.js', '.jsx'],
			'.jsx': ['.ts', '.tsx', '.js', '.jsx'],
		};

		return config;
	},
	transpilePackages: ['@aglio/ui', '@aglio/trpc'],
	images: {
		domains: ['localhost', 's3.amazonaws.com'],
	},
};

export default nextConfig;
