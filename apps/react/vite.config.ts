import { defineConfig } from 'vite';
import { default as react } from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { VitePWA } from 'vite-plugin-pwa';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		vanillaExtractPlugin(),
		VitePWA({
			registerType: 'autoUpdate',
			includeManifestIcons: true,
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			manifest: {
				name: 'Aglio',
				short_name: 'Aglio',
				description: 'Your grocery list, done better',
				theme_color: '#fdfdff',
				background_color: '#fdfdff',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
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
			injectManifest: {
				globPatterns: [
					'**/*.{js,css,html,png,jpg,jpeg,gif,svg,eot,ttf,woff,woff,woff2}',
				],
			},
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
