import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';
import { VitePWA } from 'vite-plugin-pwa';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		UnoCSS(),
		react(),
		// vanillaExtractPlugin(),
		// checker({
		// 	typescript: {
		// 		tsconfigPath: './tsconfig.json',
		// 		buildMode: true,
		// 	},
		// 	overlay: {
		// 		initialIsOpen: false,
		// 		badgeStyle: 'display: none',
		// 	},
		// 	enableBuild: false,
		// }),
		VitePWA({
			includeManifestIcons: true,
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			manifest: {
				name: 'Gnocchi',
				short_name: 'Gnocchi',
				description: 'Your grocery list, done better.',
				theme_color: '#fdfdff',
				background_color: '#fdfdff',
				icons: [
					{
						src: 'android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'android-chrome-512x512-mask.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
				screenshots: [
					{
						src: 'images/screenshots/list.png',
						type: 'image/png',
						sizes: '1170x2532',
					},
					{
						src: 'images/screenshots/recipe_overview.png',
						type: 'image/png',
						sizes: '1170x2532',
					},
					{
						src: 'images/screenshots/cooking.png',
						type: 'image/png',
						sizes: '1170x2532',
					},
				],
				categories: ['food'],
				display: 'standalone',
				start_url: '/',
				share_target: {
					action: 'share',
					method: 'POST',
					enctype: 'multipart/form-data',
					params: {
						title: 'title',
						text: 'text',
						url: 'url',
					},
				},
			} as any,
			includeAssets: [
				'fonts/**/*',
				'images/**/*',
				'models/**/*',
				'assets/**/*',
			],

			workbox: {
				sourcemap: true,
			},

			devOptions: {
				enabled: false,
				type: 'module',
				navigateFallback: 'index.html',
			},
		}),
	],
	optimizeDeps: {
		exclude: ['@aglio/ui'],
		include: ['react/jsx-runtime', 'react', 'react-dom'],
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 4444,
	},
	build: {
		sourcemap: true,
	},
});
