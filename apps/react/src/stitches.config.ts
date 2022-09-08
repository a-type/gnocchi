import { createStitches, PropertyValue } from '@stitches/react';

export const { getCssText, styled, css, keyframes, globalCss, theme, reset } =
	createStitches({
		prefix: 'ag',
		theme: {
			colors: {
				black: '#3c3c3c',
				white: '#ffffff',
				light: '#fdfdff',
				tomatoLight: '#ffc0c0',
				tomato: '#fd7e4d',
				tomatoDark: '#732207',
				leek: '#e0f8bb',
				garlic: '#f7f0e1',
				onion: '#f6d7f2',
				wood: '#ebab5c',
				lemonLighter: '#fff1ba',
				lemonLight: '#f9e794',
				lemon: '#f9f083',
				lemonDark: '#f7d352',
				lemonDarker: '#b38507',
				gray10: '#fafafa',
				gray20: '#f5f5f5',
				gray30: '#eeeef0',
				gray40: '#e0e0e3',
				gray50: '#bdbdbf',
				gray60: '#939ea0',
				gray70: '#757580',
				gray80: '#616168',
				gray90: '#42424a',
				gray0: '#21212b',
				grayBlend: 'rgba(0, 0, 20, 0.025)',
				darkBlend: 'rgba(30, 0, 0, 0.5)',
				lightBlend: 'rgba(255, 250, 250, 0.5)',
			},
			fonts: {
				sans: '"Open Sans", sans-serif',
				serif: '"Lora", serif',
				title: '"Kufam", sans-serif',
			},
			fontSizes: {
				xs: '0.75rem',
				sm: '0.88888888888888888888rem',
				md: '1rem',
				lg: '1.25rem',
				xl: '1.33333333333333333333rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
				'4xl': '2.666666666666666666666rem',
				'5xl': '3rem',
				'6xl': '4rem',
				'7xl': '5rem',
				'8xl': '6rem',
				'9xl': '7rem',
			},
			space: {
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
			},
			radii: {
				sm: '0.25rem',
				md: '0.5rem',
				lg: '0.75rem',
				xl: '1rem',
			},
			borderWidths: {
				thin: '1px',
				default: '2px',
			},
			borderStyles: {
				solid: 'solid',
			},
			sizes: {
				content: '700px',
				full: '100%',
			},
			shadows: {
				sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

				// focus outlines
				focus: '0 0 0 3px #f7e794',
			},
			transitions: {
				springy: 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
			},
			zIndices: {
				menu: 100,
				dialog: 1000,
				dialogBackdrop: 900,
			},
		},
		media: {
			sm: '(min-width: 640px)',
			md: '(min-width: 768px)',
			lg: '(min-width: 1024px)',
			xl: '(min-width: 1280px)',
			'2xl': '(min-width: 1536px)',
		},
		utils: {
			// Abbreviated margin properties
			m: (value: PropertyValue<'marginTop'>) => ({
				marginTop: value,
				marginBottom: value,
				marginLeft: value,
				marginRight: value,
			}),
			mt: (value: PropertyValue<'marginTop'>) => ({
				marginTop: value,
			}),
			mr: (value: PropertyValue<'marginTop'>) => ({
				marginRight: value,
			}),
			mb: (value: PropertyValue<'marginTop'>) => ({
				marginBottom: value,
			}),
			ml: (value: PropertyValue<'marginTop'>) => ({
				marginLeft: value,
			}),
			mx: (value: PropertyValue<'marginTop'>) => ({
				marginLeft: value,
				marginRight: value,
			}),
			my: (value: PropertyValue<'marginTop'>) => ({
				marginTop: value,
				marginBottom: value,
			}),

			// Abbreviated padding properties
			p: (value: PropertyValue<'paddingTop'>) => ({
				paddingTop: value,
				paddingBottom: value,
				paddingLeft: value,
				paddingRight: value,
			}),
			pt: (value: PropertyValue<'paddingTop'>) => ({
				paddingTop: value,
			}),
			pr: (value: PropertyValue<'paddingTop'>) => ({
				paddingRight: value,
			}),
			pb: (value: PropertyValue<'paddingTop'>) => ({
				paddingBottom: value,
			}),
			pl: (value: PropertyValue<'paddingTop'>) => ({
				paddingLeft: value,
			}),
			px: (value: PropertyValue<'paddingTop'>) => ({
				paddingLeft: value,
				paddingRight: value,
			}),
			py: (value: PropertyValue<'paddingTop'>) => ({
				paddingTop: value,
				paddingBottom: value,
			}),

			// A property for applying width/height together
			size: (value: PropertyValue<'width'>) => ({
				width: value,
				height: value,
			}),

			// An abbreviated property for border-radius
			br: (value: PropertyValue<'borderRadius'>) => ({
				borderRadius: value,
			}),

			// Creates focus ring effects
			focusRing: (color: string) => ({
				boxShadow:
					color === 'none' ? '0 0 0 0 transparent' : `0 0 0 4px ${color}`,
			}),

			// Easing animation
			transitionEase: () => (propertyNames: string) => ({
				transition: propertyNames
					.split(/,\s+/)
					.map((propName) => `${propName} 300ms cubic-bezier(0.4, 0, 0.2, 1)`)
					.join(','),
			}),
		},
	});
