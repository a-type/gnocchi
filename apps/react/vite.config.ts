import { defineConfig } from 'vite';
import { default as react } from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { VitePWA } from 'vite-plugin-pwa';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		vanillaExtractPlugin(),
		VitePWA({
			includeManifestIcons: true,
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			manifest: {
				name: 'Gnocchi',
				short_name: 'Gnocchi',
				description: 'Your grocery list, done better',
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
				],
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
			// injectManifest: {
			// 	globPatterns: [
			// 		'**/*.{js,css,html,png,jpg,jpeg,gif,svg,eot,ttf,woff,woff,woff2}',
			// 	],
			// },

			workbox: {
				sourcemap: true,
				cleanupOutdatedCaches: true,
			},

			devOptions: {
				enabled: false,
				type: 'module',
				navigateFallback: 'index.html',
			},
		}),
		checker({
			typescript: {
				tsconfigPath: './tsconfig.json',
				buildMode: true,
			},
			overlay: {
				initialIsOpen: false,
				badgeStyle: 'display: none',
			},
			enableBuild: false,
		}),
	],
	optimizeDeps: {
		exclude: [],
		include: ['react/jsx-runtime'],
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 3000,
	},
	build: {
		sourcemap: true,
	},
});
