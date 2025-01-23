/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/MyComponents/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ['var(--font-noto-sans-arabic)'],
      },
      colors: {
        brand: {
          primary: '#71308A',
          light: '#8B44A5',
          dark: '#5A2670',
        },
      },
      width: {
        'fit-content': 'fit-content', // Add fit-content width
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
