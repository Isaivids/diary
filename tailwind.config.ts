import type { Config } from "tailwindcss";
import daisyui from 'daisyui'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'd-white': '#FAFAFA',
        'd-white2': '#dcdcdc',
        'd-black': '#2C2E48',
        'd-green': '#59C174',
      },
    },
  },
  plugins: [
    daisyui
  ],
};
export default config;
