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
		config.resolve.conditionNames = dev
			? ['development', 'import', 'module', 'default']
			: ['production', 'import', 'module', 'default'];

		return config;
	},
	transpilePackages: ['@aglio/trpc', '@a-type/ui'],
	images: {
		domains: ['localhost', 's3.amazonaws.com'],
	},
};

export default nextConfig;
