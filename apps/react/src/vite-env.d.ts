/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// declare module 'prosemirror-state' {
// 	export * from 'prosemirror-state/dist/index.d.ts';
// }

// extend navigator with wakelock API
declare interface Navigator {
	wakeLock: any;
}

// declare global WakeLockSentinel type
declare type WakeLockSentinel = any;
