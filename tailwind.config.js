import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    heroui({
      addCommonColors: true,
      layout: {
        dividerWeight: '1px', // h-divider the default height applied to the divider component
        disabledOpacity: 0.5, // this value is applied as opacity-[value] when the component is disabled
        fontSize: {
          tiny: '0.75rem', // text-tiny
          small: '0.875rem', // text-small
          medium: '1rem', // text-medium
          large: '1.125rem', // text-large
        },
        lineHeight: {
          tiny: '1rem', // text-tiny
          small: '1.25rem', // text-small
          medium: '1.5rem', // text-medium
          large: '1.75rem', // text-large
        },
        radius: {
          small: '4px', // rounded-small
          medium: '6px', // rounded-medium
          large: '8px', // rounded-large
        },
        borderWidth: {
          small: '1px', // border-small
          medium: '1px', // border-medium (default)
          large: '2px', // border-large
        },
      },
      themes: {
        light: {
          layout: {
            hoverOpacity: 0.8, //  this value is applied as opacity-[value] when the component is hovered
          },
          colors: {
            background: 'white',
            foreground: '#111111',
            primary: {
              foreground: '#FFFFFF',
              DEFAULT: '#9818C8',
            },
            secondary: {
              foreground: '#9818C8',
              DEFAULT: '#ffffff',
            },
            outline: {
              foreground: '#616161',
              DEFAULT: '#616161',
            },
            accent: {
              DEFAULT: '#9818C8',
            },
            neutral: {},
            blue: {},
          },
        },
      },
    }),
  ],
};
