// /** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors');

const flowbitePlugin = require('flowbite/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        'heading-large': ['48px', '52px'],
        'paragraph-small': ['14px', '24px'],
        'paragraph-xsmall': ['14px', '18px'],
        'terminal-file-name': ['12px', '16px'],
        'paragraph-medium': ['16px', '28px'],
        'heading-small': ['24px', '32px'],
      },
      fontFamily: {
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
        poppinsSemiBold: ['Poppins-SemiBold', 'ui-sans-serif', 'system-ui'],
        poppinsBold: ['Poppins-Bold', 'ui-sans-serif', 'system-ui'],
        author: ['Author'],
      },
      colors: {
        'light-pastel': '#F4F5F4',
        'ghost-white': '#F8F8FA',
        'rye-lime': '#C8FE62',
        'choice-active': '#EFEFF5',
        'choice-hover': '#F1F1F3',
        'brand-green': '#CDFF77',
        'action-light-grey': '#DCDDE3',
        'alerts-success': '#01B71C',
        'alerts-danger': '#D90C1F',
        'neutral-content-grey': '#7E7F98',
        'brand-hover-green': '#b8e56b',
        'brand-active-green': '#a5ce60',
        'terminal-black': '#222222',
        base: {
          50: '#f4f8fd',
          100: '#e8f1fb',
          200: '#c6ddf4',
          300: '#a3c8ed',
          400: '#5e9fe0',
          500: '#1976d2',
          600: '#176abd',
          700: '#13599e',
          800: '#0f477e',
          900: '#0c3a67',
          DEFAULT: '#1976d2', //500
          on: '#f4f8fd', //50
          dark: {
            DEFAULT: '#C8FE62', //300
            on: '#C8FE62', //800
          },
        },
        secondary: {
          50: '#f4fbfa',
          100: '#e9f6f5',
          200: '#c9e9e6',
          300: '#C8FE62',
          400: '#67c1b8',
          500: '#26a69a',
          600: '#22958b',
          700: '#1d7d74',
          800: '#17645c',
          900: '#13514b',
          DEFAULT: '#26a69a', //500
          on: '#f4fbfa', //50
          dark: {
            DEFAULT: '#C8FE62', //300
            on: '#C8FE62', //800
          },
        },
        tertiary: {
          50: '#faf4fb',
          100: '#f5e9f7',
          200: '#e6c9eb',
          300: '#d7a9df',
          400: '#ba68c8',
          500: '#9c27b0',
          600: '#8c239e',
          700: '#751d84',
          800: '#5e176a',
          900: '#4c1356',
          DEFAULT: '#9c27b0', //500
          on: '#faf4fb', //50
          dark: {
            DEFAULT: '#d7a9df', //300
            on: '#5e176a', //800
          },
        },
        error: {
          50: '#fcf2f3',
          100: '#f9e6e8',
          200: '#f0bfc5',
          300: '#e699a1',
          400: '#d44d5b',
          500: '#c10015',
          600: '#ae0013',
          700: '#910010',
          800: '#74000d',
          900: '#5f000a',
          DEFAULT: '#c10015', //500
          on: '#fcf2f3', //50
          dark: {
            DEFAULT: '#e699a1', //300
            on: '#74000d', //800
          },
        },
      },
    },
  },
  plugins: [flowbitePlugin],
};
