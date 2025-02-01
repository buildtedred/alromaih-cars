/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
	'./src/**/*.{html,js,ts,jsx,tsx}',
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/MyComponents/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			noto: [
  				'var(--font-noto-sans-arabic)'
  			]
  		},
  		colors: {
  			brand: {
  				primary: '#71308A',
  				light: '#8B44A5',
  				dark: '#5A2670'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		width: {
  			'fit-content': 'fit-content'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
