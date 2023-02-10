// vite.config.ts
import { defineConfig } from "vite";
import { default as react } from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import checker from "vite-plugin-checker";
var __vite_injected_original_import_meta_url = "file:///Users/grant/git/personal/aglio/apps/react/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.json",
        buildMode: true
      },
      overlay: {
        initialIsOpen: false,
        badgeStyle: "display: none"
      },
      enableBuild: false
    }),
    VitePWA({
      includeManifestIcons: true,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      manifest: {
        name: "Gnocchi",
        short_name: "Gnocchi",
        description: "Your grocery list, done better.",
        theme_color: "#fdfdff",
        background_color: "#fdfdff",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "android-chrome-512x512-mask.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        screenshots: [
          {
            src: "images/screenshots/list.png",
            type: "image/png",
            sizes: "1170x2532"
          },
          {
            src: "images/screenshots/recipe_overview.png",
            type: "image/png",
            sizes: "1170x2532"
          },
          {
            src: "images/screenshots/cooking.png",
            type: "image/png",
            sizes: "1170x2532"
          }
        ],
        categories: ["food"],
        display: "standalone",
        start_url: "/",
        share_target: {
          action: "share",
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            title: "title",
            text: "text",
            url: "url"
          }
        }
      },
      includeAssets: [
        "fonts/**/*",
        "images/**/*",
        "models/**/*",
        "assets/**/*"
      ],
      workbox: {
        sourcemap: true
      },
      devOptions: {
        enabled: false,
        type: "module",
        navigateFallback: "index.html"
      }
    })
  ],
  optimizeDeps: {
    exclude: [],
    include: ["react/jsx-runtime"]
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    port: 4444
  },
  build: {
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ3JhbnQvZ2l0L3BlcnNvbmFsL2FnbGlvL2FwcHMvcmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ncmFudC9naXQvcGVyc29uYWwvYWdsaW8vYXBwcy9yZWFjdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ3JhbnQvZ2l0L3BlcnNvbmFsL2FnbGlvL2FwcHMvcmVhY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgcmVhY3QgfSBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IHsgdmFuaWxsYUV4dHJhY3RQbHVnaW4gfSBmcm9tICdAdmFuaWxsYS1leHRyYWN0L3ZpdGUtcGx1Z2luJztcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdHJlYWN0KCksXG5cdFx0dmFuaWxsYUV4dHJhY3RQbHVnaW4oKSxcblx0XHRjaGVja2VyKHtcblx0XHRcdHR5cGVzY3JpcHQ6IHtcblx0XHRcdFx0dHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5qc29uJyxcblx0XHRcdFx0YnVpbGRNb2RlOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdG92ZXJsYXk6IHtcblx0XHRcdFx0aW5pdGlhbElzT3BlbjogZmFsc2UsXG5cdFx0XHRcdGJhZGdlU3R5bGU6ICdkaXNwbGF5OiBub25lJyxcblx0XHRcdH0sXG5cdFx0XHRlbmFibGVCdWlsZDogZmFsc2UsXG5cdFx0fSksXG5cdFx0Vml0ZVBXQSh7XG5cdFx0XHRpbmNsdWRlTWFuaWZlc3RJY29uczogdHJ1ZSxcblx0XHRcdHN0cmF0ZWdpZXM6ICdpbmplY3RNYW5pZmVzdCcsXG5cdFx0XHRzcmNEaXI6ICdzcmMnLFxuXHRcdFx0ZmlsZW5hbWU6ICdzZXJ2aWNlLXdvcmtlci50cycsXG5cdFx0XHRtYW5pZmVzdDoge1xuXHRcdFx0XHRuYW1lOiAnR25vY2NoaScsXG5cdFx0XHRcdHNob3J0X25hbWU6ICdHbm9jY2hpJyxcblx0XHRcdFx0ZGVzY3JpcHRpb246ICdZb3VyIGdyb2NlcnkgbGlzdCwgZG9uZSBiZXR0ZXIuJyxcblx0XHRcdFx0dGhlbWVfY29sb3I6ICcjZmRmZGZmJyxcblx0XHRcdFx0YmFja2dyb3VuZF9jb2xvcjogJyNmZGZkZmYnLFxuXHRcdFx0XHRpY29uczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJ2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nJyxcblx0XHRcdFx0XHRcdHNpemVzOiAnMTkyeDE5MicsXG5cdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJ2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJyxcblx0XHRcdFx0XHRcdHNpemVzOiAnNTEyeDUxMicsXG5cdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJ2FuZHJvaWQtY2hyb21lLTUxMng1MTItbWFzay5wbmcnLFxuXHRcdFx0XHRcdFx0c2l6ZXM6ICc1MTJ4NTEyJyxcblx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxuXHRcdFx0XHRcdFx0cHVycG9zZTogJ21hc2thYmxlJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRdLFxuXHRcdFx0XHRzY3JlZW5zaG90czogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJ2ltYWdlcy9zY3JlZW5zaG90cy9saXN0LnBuZycsXG5cdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdFx0XHRcdHNpemVzOiAnMTE3MHgyNTMyJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJ2ltYWdlcy9zY3JlZW5zaG90cy9yZWNpcGVfb3ZlcnZpZXcucG5nJyxcblx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxuXHRcdFx0XHRcdFx0c2l6ZXM6ICcxMTcweDI1MzInLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3JjOiAnaW1hZ2VzL3NjcmVlbnNob3RzL2Nvb2tpbmcucG5nJyxcblx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxuXHRcdFx0XHRcdFx0c2l6ZXM6ICcxMTcweDI1MzInLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGNhdGVnb3JpZXM6IFsnZm9vZCddLFxuXHRcdFx0XHRkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG5cdFx0XHRcdHN0YXJ0X3VybDogJy8nLFxuXHRcdFx0XHRzaGFyZV90YXJnZXQ6IHtcblx0XHRcdFx0XHRhY3Rpb246ICdzaGFyZScsXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdFx0ZW5jdHlwZTogJ211bHRpcGFydC9mb3JtLWRhdGEnLFxuXHRcdFx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRcdFx0dGl0bGU6ICd0aXRsZScsXG5cdFx0XHRcdFx0XHR0ZXh0OiAndGV4dCcsXG5cdFx0XHRcdFx0XHR1cmw6ICd1cmwnLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHR9IGFzIGFueSxcblx0XHRcdGluY2x1ZGVBc3NldHM6IFtcblx0XHRcdFx0J2ZvbnRzLyoqLyonLFxuXHRcdFx0XHQnaW1hZ2VzLyoqLyonLFxuXHRcdFx0XHQnbW9kZWxzLyoqLyonLFxuXHRcdFx0XHQnYXNzZXRzLyoqLyonLFxuXHRcdFx0XSxcblxuXHRcdFx0d29ya2JveDoge1xuXHRcdFx0XHRzb3VyY2VtYXA6IHRydWUsXG5cdFx0XHR9LFxuXG5cdFx0XHRkZXZPcHRpb25zOiB7XG5cdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHR0eXBlOiAnbW9kdWxlJyxcblx0XHRcdFx0bmF2aWdhdGVGYWxsYmFjazogJ2luZGV4Lmh0bWwnLFxuXHRcdFx0fSxcblx0XHR9KSxcblx0XSxcblx0b3B0aW1pemVEZXBzOiB7XG5cdFx0ZXhjbHVkZTogW10sXG5cdFx0aW5jbHVkZTogWydyZWFjdC9qc3gtcnVudGltZSddLFxuXHR9LFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdH0sXG5cdH0sXG5cdHNlcnZlcjoge1xuXHRcdHBvcnQ6IDQ0NDQsXG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0c291cmNlbWFwOiB0cnVlLFxuXHR9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsb0JBQW9CO0FBQzdVLFNBQVMsV0FBVyxhQUFhO0FBQ2pDLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsZUFBZTtBQUN4QixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLGFBQWE7QUFMd0ssSUFBTSwyQ0FBMkM7QUFRN08sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04scUJBQXFCO0FBQUEsSUFDckIsUUFBUTtBQUFBLE1BQ1AsWUFBWTtBQUFBLFFBQ1gsY0FBYztBQUFBLFFBQ2QsV0FBVztBQUFBLE1BQ1o7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNSLGVBQWU7QUFBQSxRQUNmLFlBQVk7QUFBQSxNQUNiO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDZCxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDUCxzQkFBc0I7QUFBQSxNQUN0QixZQUFZO0FBQUEsTUFDWixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsUUFDVCxNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixPQUFPO0FBQUEsVUFDTjtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNWO0FBQUEsUUFDRDtBQUFBLFFBQ0EsYUFBYTtBQUFBLFVBQ1o7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE1BQU07QUFBQSxZQUNOLE9BQU87QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsTUFBTTtBQUFBLFlBQ04sT0FBTztBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxNQUFNO0FBQUEsWUFDTixPQUFPO0FBQUEsVUFDUjtBQUFBLFFBQ0Q7QUFBQSxRQUNBLFlBQVksQ0FBQyxNQUFNO0FBQUEsUUFDbkIsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFFBQ1gsY0FBYztBQUFBLFVBQ2IsUUFBUTtBQUFBLFVBQ1IsUUFBUTtBQUFBLFVBQ1IsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFlBQ1AsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sS0FBSztBQUFBLFVBQ047QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2Q7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNEO0FBQUEsTUFFQSxTQUFTO0FBQUEsUUFDUixXQUFXO0FBQUEsTUFDWjtBQUFBLE1BRUEsWUFBWTtBQUFBLFFBQ1gsU0FBUztBQUFBLFFBQ1QsTUFBTTtBQUFBLFFBQ04sa0JBQWtCO0FBQUEsTUFDbkI7QUFBQSxJQUNELENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDYixTQUFTLENBQUM7QUFBQSxJQUNWLFNBQVMsQ0FBQyxtQkFBbUI7QUFBQSxFQUM5QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUNyRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNQO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTixXQUFXO0FBQUEsRUFDWjtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
