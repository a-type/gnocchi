import { Preset, presetUno } from 'unocss';
import { entriesToCss, toArray, PreflightContext } from '@unocss/core';

export default function presetAglio(): Preset {
	return {
		name: 'aglio',
		enforce: 'post',
		theme: {
			colors: {
				none: '',
				black: 'var(--color-black)',
				white: 'var(--color-white)',
				wash: 'var(--color-wash)',
				attentionLight: 'var(--color-attention-light)',
				'attention-light': 'var(--color-attention-light)',
				attention: 'var(--color-attention)',
				attentionDark: 'var(--color-attention-dark)',
				'attention-dark': 'var(--color-attention-dark)',
				accent: 'var(--color-accent)',
				accentWash: 'var(--color-accent-wash)',
				'accent-wash': 'var(--color-accent-wash)',
				accentLight: 'var(--color-accent-light)',
				'accent-light': 'var(--color-accent-light)',
				accentDark: 'var(--color-accent-dark)',
				'accent-dark': 'var(--color-accent-dark)',
				primary: 'var(--color-primary)',
				primaryLight: 'var(--color-primary-light)',
				'primary-light': 'var(--color-primary-light)',
				primaryDark: 'var(--color-primary-dark)',
				'primary-dark': 'var(--color-primary-dark)',
				primaryWash: 'var(--color-primary-wash)',
				'primary-wash': 'var(--color-primary-wash)',
				gray: {
					1: 'var(--color-gray-1)',
					2: 'var(--color-gray-2)',
					3: 'var(--color-gray-3)',
					4: 'var(--color-gray-4)',
					5: 'var(--color-gray-5)',
					6: 'var(--color-gray-6)',
					7: 'var(--color-gray-7)',
					8: 'var(--color-gray-8)',
					9: 'var(--color-gray-9)',
					0: 'var(--color-gray-0)',
				},
				grayBlend: 'var(--color-gray-blend)',
				'gray-blend': 'var(--color-gray-blend)',
				grayDarkBlend: 'var(--color-gray-dark-blend)',
				'gray-dark-blend': 'var(--color-gray-dark-blend)',
				darkBlend: 'var(--color-dark-blend)',
				'dark-blend': 'var(--color-dark-blend)',
				lightBlend: 'var(--color-light-blend)',
				'light-blend': 'var(--color-light-blend)',
				overlay: 'var(--color-overlay)',
			},
			fontFamily: {
				sans: '"Inter", sans-serif',
				serif: '"Domine", serif',
				title: '"Inter", sans-serif',
			},
			fontSize: {
				xxs: ['0.625rem', '0.75rem'],
				xs: ['0.75rem', '1rem'],
				sm: ['1rem', '1.25rem'],
				md: ['1.125rem', '1.5rem'],
				lg: ['1.25rem', '1.75rem'],
				xl: ['1.5rem', '2rem'],
				'2xl': ['1.75rem', '2.25rem'],
				'3xl': ['2rem', '2.5rem'],
				'4xl': ['2.5rem', '3rem'],
				'5xl': ['3rem', '3.5rem'],
				'6xl': ['4rem', '4.5rem'],
				'7xl': ['5rem', '5.5rem'],
				'8xl': ['6rem', '6.5rem'],
				'9xl': ['7rem', '7.5rem'],
			},
			spacing: {
				0: '0',
				1: '0.25rem',
				2: '0.5rem',
				3: '0.75rem',
				4: '1rem',
				5: '1.25rem',
				6: '1.5rem',
				7: '1.75rem',
				8: '2rem',
				9: '2.25rem',
				10: '2.5rem',
				11: '2.75rem',
				12: '3rem',
				20: '5rem',
			},
			borderRadius: {
				sm: '0.25rem',
				md: '0.5rem',
				lg: '0.75rem',
				xl: '1rem',
			},
			width: {
				content: '700px',
				full: '100%',
				'min-content': 'min-content',
				'max-content': 'max-content',
			},
			height: {
				'min-content': 'min-content',
				'max-content': 'max-content',
			},
			boxShadow: {
				sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

				// focus outlines
				focus: `0 0 0 3px var(--color-primary-light)`,
			},
			easing: {
				springy: 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
				default: 'ease',
				linear: 'linear',
			},
			animation: {
				keyframes: {
					'progress-bar': `{0% { width: 0% } 100% { width: 100% }}`,
					'pop-up': `{from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); }}`,
					// TODO: move this out to app
					'item-disappear': `{
					0% {opacity:1;transform:translateY(0);height:var(--height);}
					25% {opacity:1;transform:translateY(0);height:var(--height);}
					100% {opacity:0;transform:translateY(30px);height:0;margin-top:0;}
				}`,
					'expand-scale-x': `{
					from { transform: scaleX(0) }
					to { transform: scaleX(1) }
				}`,
					pop: `{
					0% {
						transform: translate(-50%, -50%) scale(0);
						opacity: 1;
					}
					25% {
						transform: translate(-50%, -50%) scale(1);
						opacity: 1;
					}
					100% {
						transform: translate(-50%, -50%) scale(1);
						opacity: 0;
					}
				}`,
					'scan-line': `{
					0% { top: 0% }
					30% { top: 100% }
					70% { top: 100% }
					100% { top: 0% }
				}`,
					'pop-in-from-half': `{
					0% { opacity: 0; transform: scale(0.5) }
					100% { opacity: 1; transform: scale(1) }
				}`,
					'radix-collapsible-open-vertical': `{
            from { height: 0 }
            to { height: var(--radix-collapsible-content-height) }
          }`,
					'radix-collapsible-close-vertical': `{
            from { height: var(--radix-collapsible-content-height) }
            to { height: 0 }
          }`,
					'radix-collapsible-open-horizontal': `{
            from { width: 0 }
            to { width: var(--radix-collapsible-content-width) }
          }`,
					'radix-collapsible-close-horizontal': `{
            from { width: var(--radix-collapsible-content-width) }
            to { width: 0 }
          }`,
					'radix-collapsible-open-both': `{
						from { width: 0; height: 0 }
						to { width: var(--radix-collapsible-content-width); height: var(--radix-collapsible-content-height) }
					}`,
					'radix-collapsible-close-both': `{
						from { width: var(--radix-collapsible-content-width); height: var(--radix-collapsible-content-height) }
						to { width: 0; height: 0 }
					}`,
					'peek-close': `{
						from { height: calc(var(--collapsible-height) + 80px); max-height: none; }
						to { height: min(var(--peek-height, 120px), var(--collapsible-height)); max-height: var(--peek-height, 120px); }
					}`,
					'peek-open': `{
						from { height: min(var(--peek-height, 120px), var(--collapsible-height)); }
						to { height: calc(var(--collapsible-height) + 80px); }
					}`,
					skeleton: `{
						from { background-position: 0% 50%; }
						to { background-position: 100% 50%; }
					}`,
					'spinner-stroke': `{
						0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
						50% { stroke-dasharray: 100, 200; stroke-dashoffset: -15; }
						100% { stroke-dasharray: 100, 200; stroke-dashoffset: -125; }
					}`,
					'fade-and-pop': `{
						0% { opacity: 0.2; transform: scale(0.6); }
						40% { opacity: 0.5; transform: scale(0.7); }
						50% { opacity: 1; transform: scale(1.1) rotate(2deg); }
						55% { opacity: 1; transform: scale(1); }
						70% { opacity: 1; transform: scale(1); }
						100% { opacity: 0.2; transform: scale(0.6); }
					}`,
					'fade-in-down': `{
						0% { opacity: 0; transform: translate3d(0, -100px, 0); }
						100% { opacity: 1; transform: translate3d(0, 0, 0); }
					}`,
					'fade-in-left': `{
						0% { opacity: 0; transform: translate3d(-100px, 0, 0); }
						100% { opacity: 1; transform: translate3d(0, 0, 0); }
					}`,
					'fade-in-bottom': `{
						0% { opacity: 0; transform: translate3d(0, 100px, 0); }
						100% { opacity: 1; transform: translate3d(0, 0, 0); }
					}`,
					'fade-in-right': `{
						0% { opacity: 0; transform: translate3d(100px, 0, 0); }
						100% { opacity: 1; transform: translate3d(0, 0, 0); }
					}`,
					'fade-out-down': `{
						0% { opacity: 1; transform: translate3d(0, 0, 0); }
						100% { opacity: 0; transform: translate3d(0, -100px, 0); }
					}`,
					'fade-out-left': `{
						0% { opacity: 1; transform: translate3d(0, 0, 0); }
						100% { opacity: 0; transform: translate3d(-100px, 0, 0); }
					}`,
					'fade-out-bottom': `{
						0% { opacity: 1; transform: translate3d(0, 0, 0); }
						100% { opacity: 0; transform: translate3d(0, 100px, 0); }
					}`,
					'fade-out-right': `{
						0% { opacity: 1; transform: translate3d(0, 0, 0); }
						100% { opacity: 0; transform: translate3d(100px, 0, 0); }
					}`,
				},
				timingFns: {
					linear: 'linear',
					springy: 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'ease-out': 'ease-out',
					'fade-in-up': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in-down': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in-left': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in-right': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-out-up': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-out-down': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-out-left': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-out-right': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in-up-big': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in-down-big': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in-left-big': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in-right-big': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-in': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'fade-out': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'scan-line': 'linear',
					'radix-collapsible-open-vertical':
						'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'radix-collapsible-close-vertical':
						'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'radix-collapsible-open-horizontal':
						'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'radix-collapsible-close-horizontal':
						'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'radix-collapsible-open-both': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'radix-collapsible-close-both': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
					'item-disappear': 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
				},
				durations: {
					'fade-in-up': '200ms',
					'fade-in-down': '200ms',
					'fade-in-left': '200ms',
					'fade-in-right': '200ms',
					'fade-out-up': '200ms',
					'fade-out-down': '200ms',
					'fade-out-left': '200ms',
					'fade-out-right': '200ms',
					'fade-in-up-big': '300ms',
					'fade-in-down-big': '300ms',
					'fade-in-left-big': '300ms',
					'fade-in-right-big': '300ms',
					'fade-in': '200ms',
					'fade-out': '200ms',
					'scan-line': '1.5s',
					'radix-collapsible-open-vertical': '200ms',
					'radix-collapsible-close-vertical': '200ms',
					'radix-collapsible-open-horizontal': '200ms',
					'radix-collapsible-close-horizontal': '200ms',
					'radix-collapsible-open-both': '200ms',
					'radix-collapsible-close-both': '200ms',
					'item-disappear': '300ms',
				},
				fillModes: {
					'peek-open': 'forwards',
					'peek-close': 'forwards',
				},
			},
		},

		rules: [
			[
				/^gutter-bottom$/,
				(_, { theme }) => ({ 'margin-bottom': (theme as any).spacing[2] }),
			],
		],

		variants: [
			/** Selects &+&, good for top borders */
			(matcher) => {
				if (!matcher.startsWith('repeated:')) return matcher;
				return {
					matcher: matcher.slice('repeated:'.length),
					selector: (s) => `${s} + ${s}`,
				};
			},
		],

		shortcuts: {
			'border-default': 'border border-solid border-black',
			'border-light': 'border border-solid border-gray5',
			'flex-1-0-0': 'flex-grow-1 flex-shrink-0 flex-basis-0',
			'flex-0-0-auto': 'flex-grow-0 flex-shrink-0 flex-basis-auto',
			'hidden-input':
				'op-0 absolute z--1 pointer-events-none [&::webkit-file-upload-button]:display-none',
			center: 'left-50% top-50%',
			'z-nav': 'z-[var(--z-nav)]',
			'z-menu': 'z-[var(--z-menu)]',
			'z-dialog': 'z-[var(--z-dialog)]',
			'z-dialog-backdrop': 'z-[var(--z-dialogBackdrop)]',
			'z-tooltip': 'z-[var(--z-tooltip)]',
			'z-overdraw': 'z-[var(--z-overdraw)]',
			'z-now-playing': 'z-[var(--z-nowPlaying)]',
			'outline-off': '[outline:none]',
			'bg-wash': 'bg-[var(--color-wash)]',
			unset: '[all:unset]',
		},

		preflights: [
			{
				layer: 'preflights',
				getCSS: (ctx: PreflightContext<any>) => {
					if (ctx.theme.preflightBase) {
						const css = entriesToCss(Object.entries(ctx.theme.preflightBase));
						const roots = toArray(
							ctx.theme.preflightRoot ?? ['*,::before,::after', '::backdrop'],
						);
						return roots
							.map((root) => `@layer preflightBase{${root}{${css}}}`)
							.join('');
					}
				},
			} as any,
			{
				getCSS: (ctx) => `
				@layer preflightBase, components, variants, utilities;

				:root {
					--palette-red-90: #ffede7;
					--palette-red-80: #ffdbcf;
					--palette-red-70: #ffb59b;
					--palette-red-60: #ff8c60;
					--palette-red-50: #e66d3d;
					--palette-red-40: #c55427;
					--palette-red-30: #a43d0f;
					--palette-red-20: #943102;
					--palette-red-10: #812900;
					--palette-red-00: #380d00;
					--palette-green-90: #e9fff1;
					--palette-green-80: #c2ffe1;
					--palette-green-70: #8ff8c4;
					--palette-green-60: #73dba0;
					--palette-green-50: #56bf80;
					--palette-green-40: #38a368;
					--palette-green-30: #0f8850;
					--palette-green-20: #006d3e;
					--palette-green-10: #005f35;
					--palette-green-00: #00391d;
					--palette-yellow-90: #fff9ef;
					--palette-yellow-80: #fff1c7;
					--palette-yellow-70: #ffe17c;
					--palette-yellow-60: #f7d352;
					--palette-yellow-50: #c9a829;
					--palette-yellow-40: #ac8e04;
					--palette-yellow-30: #8e7500;
					--palette-yellow-20: #715c00;
					--palette-yellow-10: #635100;
					--palette-yellow-00: #3b2f00;
					--palette-blue-90: #e3f3ff;
					--palette-blue-80: #c4e7ff;
					--palette-blue-70: #7bd0ff;
					--palette-blue-60: #2db7f2;
					--palette-blue-50: #009bd1;
					--palette-blue-40: #0080ad;
					--palette-blue-30: #00668a;
					--palette-blue-20: #005979;
					--palette-blue-10: #004c69;
					--palette-blue-00: #00354a;
					--palette-purple-90: #f1efff;
					--palette-purple-80: #e0e0ff;
					--palette-purple-70: #bdc2ff;
					--palette-purple-60: #9ba4ff;
					--palette-purple-50: #7c87f3;
					--palette-purple-40: #626dd7;
					--palette-purple-30: #4953bc;
					--palette-purple-20: #3c47af;
					--palette-purple-10: #2f3aa3;
					--palette-purple-00: #000767;
					--palette-dark-blend-warm: rgba(10, 0, 0, 0.75);
					--palette-dark-blend-cool: rgba(0, 10, 0, 0.75);
					--palette-light-blend-warm: rgba(255, 250, 250, 0.6);
					--palette-light-blend-cool: rgba(250, 255, 255, 0.6);
					--palette-light-blend: rgba(255, 250, 250, 0.6);
					--palette-overlay: rgba(0, 0, 0, 0.025);
					--palette-black: #303030;
					--palette-white: #fff;
					--palette-light: #fdfdff;
					--palette-dark: #080808;
					--palette-gray-1: #fafafa;
					--palette-gray-2: #f5f5f5;
					--palette-gray-3: #eeeef0;
					--palette-gray-4: #e0e0e3;
					--palette-gray-5: #bdbdbf;
					--palette-gray-6: #939ea0;
					--palette-gray-7: #6f7a7c;
					--palette-gray-8: #4d5658;
					--palette-gray-9: #3c3c3c;
					--palette-gray-0: #2b2b2b;
					--palette-gray-ex-1: #232323;
					--palette-gray-ex-2: #1b1b1b;
					--palette-gray-blend: rgba(0, 0, 20, 0.025);
					--palette-gray-dark-blend: rgba(0, 0, 20, 0.05);
					--palette-light-gray-blend: rgba(255, 255, 255, 0.05);
					--palette-light-gray-dark-blend: rgba(255, 255, 255, 0.1);

					--z-nowPlaying: 40;
					--z-nav: 50;
					--z-menu: 100;
					--z-menuTrigger: 101;
					--z-dialog: 1000;
					--z-dialogBackdrop: 900;
					--z-tooltip: 10000;
					--z-overdraw: 100000;
				}

				/* LIGHT THEME */
				html {
					${lightColors}
					--color-dark-blend-warm: var(--palette-dark-blend-warm);
					--color-dark-blend-cool: var(--palette-dark-blend-cool);
					--color-light-blend-warm: var(--palette-light-blend-warm);
					--color-light-blend-cool: var(--palette-light-blend-cool);
					--color-light-blend: var(--palette-light-blend);
					--color-overlay: var(--palette-overlay);
					--color-black: var(--palette-black);
					--color-white: var(--palette-white);
					--color-wash: var(--palette-light);
					--color-gray-1: var(--palette-gray-1);
					--color-gray-2: var(--palette-gray-2);
					--color-gray-3: var(--palette-gray-3);
					--color-gray-4: var(--palette-gray-4);
					--color-gray-5: var(--palette-gray-5);
					--color-gray-6: var(--palette-gray-6);
					--color-gray-7: var(--palette-gray-7);
					--color-gray-8: var(--palette-gray-8);
					--color-gray-9: var(--palette-gray-9);
					--color-gray-0: var(--palette-gray-0);
					--color-gray-blend: var(--palette-gray-blend);
					--color-gray-dark-blend: var(--palette-gray-dark-blend);


					/* DEFAULT THEME (LEMON) */
					--color-attention-light: var(--color-red-light);
					--color-attention: var(--color-red);
					--color-attention-dark: var(--color-red-dark);
					--color-accent: var(--color-green);
					--color-accent-wash: var(--color-green-wash);
					--color-accent-light: var(--color-green-light);
					--color-accent-dark: var(--color-green-dark);
					--color-primary: var(--color-yellow);
					--color-primary-light: var(--color-yellow-light);
					--color-primary-dark: var(--color-yellow-dark);
					--color-primary-wash: var(--color-yellow-wash);
					--color-light-blend: var(--color-light-blend-warm);
					--color-dark-blend: var(--color-dark-blend-warm);
				}

				/* INTRINSIC DARK THEME */
				@media(prefers-color-scheme: dark) {
					html {
						${darkColors}
						--color-dark-blend-warm: var(--palette-light-blend-warm);
						--color-dark-blend-cool: var(--palette-light-blend-cool);
						--color-light-blend-warm: var(--palette-dark-blend-warm);
						--color-light-blend-cool: var(--palette-dark-blend-cool);
						--color-light-blend: var(--palette-light-blend);
						--color-overlay: var(--palette-overlay);
						--color-black: var(--palette-white);
						--color-white: var(--palette-black);
						--color-wash: var(--palette-dark);
						--color-gray-1: var(--palette-gray-ex-1);
						--color-gray-2: var(--palette-gray-0);
						--color-gray-3: var(--palette-gray-9);
						--color-gray-4: var(--palette-gray-8);
						--color-gray-5: var(--palette-gray-7);
						--color-gray-6: var(--palette-gray-6);
						--color-gray-7: var(--palette-gray-5);
						--color-gray-8: var(--palette-gray-4);
						--color-gray-9: var(--palette-gray-3);
						--color-gray-0: var(--palette-gray-2);
						--color-gray-blend: var(--palette-light-gray-blend);
						--color-gray-dark-blend: var(--palette-gray-dark-blend);
					}
				}

				/** SYSTEM OVERRIDES **/
				@media(prefers-color-scheme: dark) {
					html.override-light {
						${lightColors}
						--color-dark-blend-warm: var(--palette-dark-blend-warm);
						--color-dark-blend-cool: var(--palette-dark-blend-cool);
						--color-light-blend-warm: var(--palette-light-blend-warm);
						--color-light-blend-cool: var(--palette-light-blend-cool);
						--color-light-blend: var(--palette-light-blend);
						--color-overlay: var(--palette-overlay);
						--color-black: var(--palette-black);
						--color-white: var(--palette-white);
						--color-wash: var(--palette-light);
						--color-gray-1: var(--palette-gray-1);
						--color-gray-2: var(--palette-gray-2);
						--color-gray-3: var(--palette-gray-3);
						--color-gray-4: var(--palette-gray-4);
						--color-gray-5: var(--palette-gray-5);
						--color-gray-6: var(--palette-gray-6);
						--color-gray-7: var(--palette-gray-7);
						--color-gray-8: var(--palette-gray-8);
						--color-gray-9: var(--palette-gray-9);
						--color-gray-0: var(--palette-gray-0);
						--color-gray-blend: var(--palette-gray-blend);
						--color-gray-dark-blend: var(--palette-gray-dark-blend);
					}
				}

				@media(prefers-color-scheme: light) {
					html.override-dark {
						${darkColors}
						--color-dark-blend-warm: var(--palette-light-blend-warm);
						--color-dark-blend-cool: var(--palette-light-blend-cool);
						--color-light-blend-warm: var(--palette-dark-blend-warm);
						--color-light-blend-cool: var(--palette-dark-blend-cool);
						--color-light-blend: var(--palette-light-blend);
						--color-overlay: var(--palette-overlay);
						--color-black: var(--palette-white);
						--color-white: var(--palette-black);
						--color-wash: var(--palette-dark);
						--color-gray-1: var(--palette-gray-ex-1);
						--color-gray-2: var(--palette-gray-0);
						--color-gray-3: var(--palette-gray-9);
						--color-gray-4: var(--palette-gray-8);
						--color-gray-5: var(--palette-gray-7);
						--color-gray-6: var(--palette-gray-6);
						--color-gray-7: var(--palette-gray-5);
						--color-gray-8: var(--palette-gray-4);
						--color-gray-9: var(--palette-gray-3);
						--color-gray-0: var(--palette-gray-2);
						--color-gray-blend: var(--palette-light-gray-blend);
						--color-gray-dark-blend: var(--palette-gray-dark-blend);
					}
				}

				.theme-lemon {
					--color-attention-light: var(--color-red-light);
					--color-attention: var(--color-red);
					--color-attention-dark: var(--color-red-dark);
					--color-accent: var(--color-green);
					--color-accent-wash: var(--color-green-wash);
					--color-accent-light: var(--color-green-light);
					--color-accent-dark: var(--color-green-dark);
					--color-primary: var(--color-yellow);
					--color-primary-light: var(--color-yellow-light);
					--color-primary-dark: var(--color-yellow-dark);
					--color-primary-wash: var(--color-yellow-wash);
					--color-light-blend: var(--color-light-blend-warm);
					--color-dark-blend: var(--color-dark-blend-warm);
				}

				.theme-blueberry {
					--color-attention-light: var(--color-red-light);
					--color-attention: var(--color-red);
					--color-attention-dark: var(--color-red-dark);
					--color-accent: var(--color-green);
					--color-accent-wash: var(--color-green-wash);
					--color-accent-light: var(--color-green-light);
					--color-accent-dark: var(--color-green-dark);
					--color-primary: var(--color-blue);
					--color-primary-light: var(--color-blue-light);
					--color-primary-dark: var(--color-blue-dark);
					--color-primary-wash: var(--color-blue-wash);
					--color-light-blend: var(--color-light-blend-cool);
					--color-dark-blend: var(--color-dark-blend-cool);
				}

				.theme-eggplant {
					--color-attention-light: var(--color-red-light);
					--color-attention: var(--color-red);
					--color-attention-dark: var(--color-red-dark);
					--color-accent: var(--color-green);
					--color-accent-wash: var(--color-green-wash);
					--color-accent-light: var(--color-green-light);
					--color-accent-dark: var(--color-green-dark);
					--color-primary: var(--color-purple);
					--color-primary-light: var(--color-purple-light);
					--color-primary-dark: var(--color-purple-dark);
					--color-primary-wash: var(--color-purple-wash);
					--color-light-blend: var(--color-light-blend-warm);
					--color-dark-blend: var(--color-dark-blend-warm);
				}

				.theme-leek {
					--color-attention-light: var(--color-red-light);
					--color-attention: var(--color-red);
					--color-attention-dark: var(--color-red-dark);
					--color-accent: var(--color-yellow);
					--color-accent-wash: var(--color-yellow-wash);
					--color-accent-light: var(--color-yellow-light);
					--color-accent-dark: var(--color-yellow-dark);
					--color-primary: var(--color-green);
					--color-primary-light: var(--color-green-light);
					--color-primary-dark: var(--color-green-dark);
					--color-primary-wash: var(--color-green-wash);
					--color-light-blend: var(--color-light-blend-warm);
					--color-dark-blend: var(--color-dark-blend-warm);
				}

				.theme-tomato {
					--color-attention-light: var(--color-blue-light);
					--color-attention: var(--color-blue);
					--color-attention-dark: var(--color-blue-dark);
					--color-accent: var(--color-green);
					--color-accent-wash: var(--color-green-wash);
					--color-accent-light: var(--color-green-light);
					--color-accent-dark: var(--color-green-dark);
					--color-primary: var(--color-red);
					--color-primary-light: var(--color-red-light);
					--color-primary-dark: var(--color-red-dark);
					--color-primary-wash: var(--color-red-wash);
					--color-light-blend: var(--color-light-blend-warm);
					--color-dark-blend: var(--color-dark-blend-warm);
				}

        html, body {
          margin: 0;
          padding: 0;
          font-family: "Inter", sans-serif;
          font-size: 16px;
          height: 100%;
          --webkit-font-smoothing: antialiased;
        }

        body {
          height: 100%;
          background-color: var(--color-wash);
          color: var(--color-black);
          overflow: overlay;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        @font-face {
          font-family: "Inter";
          src: url("/fonts/Inter-VariableFont_slnt,wght.ttf") format("truetype-variations");
          font-weight: 1 999;
          font-style: oblique 0deg 5deg;
          font-display: block;
        }

        @font-face {
          font-family: "Londrina Outline";
          src: url("/fonts/LondrinaOutline-Regular.ttf") format("truetype");
          font-display: block;
          font-style: normal;
        }

				@media (display-mode: standalone) {
					html, body {
						overscroll-behavior: none;
					}
				}
			`,
			},
		],

		presets: [
			presetUno({
				preflight: false,
			}),
		],
	};
}

const themeColors = ['red', 'green', 'yellow', 'blue', 'purple'];
function roundTens(num: number) {
	return Math.round(num / 10) * 10;
}
function asPaletteValue(num: number) {
	return roundTens(num).toString().padStart(2, '0');
}
function generateColors(from: number, to: number) {
	const increment = (to - from) / 3;
	const map = themeColors.reduce((acc, color) => {
		acc[`--color-${color}-wash`] = `var(--palette-${color}-${asPaletteValue(
			from,
		)})`;
		acc[`--color-${color}-light`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment),
		)})`;
		acc[`--color-${color}`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment * 2),
		)})`;
		acc[`--color-${color}-dark`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment * 3),
		)})`;
		return acc;
	}, {} as Record<string, string>);
	return Object.entries(map).reduce(
		(str, [key, value]) => str + `${key}: ${value};\n`,
		'',
	);
}

const lightColors = generateColors(90, 40);
const darkColors = generateColors(0, 60);
