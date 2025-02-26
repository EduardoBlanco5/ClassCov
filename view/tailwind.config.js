/** @type {import('tailwindcss').Config} */
const {heroui} = require("@heroui/react");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('./utils/patron.jpg')",
      }

    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          // ...
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              50: "#afbf73aa",
              100: "#afba53",
              200: "#84ab9d",
              300: "#f5f3d8",
              400: "#afd06e",
              500: "#bbcf9b",
              600: "#437118",
              700:"#404423",
              900: "#a0a742",
              foreground : '#ffffff'
            },
            secondary:{
              50: "#daedeaaa",
              100: "#dafeff",
              200: "#84ab9d",
              300: "#87aece",
              400: "#33576e",
              500: "#5c91a4",
              600: "#123456",
              700: "#1f3d3b",
              800: "#1d2a62",
              900: "#001731",
              foreground : '#ffffff'
            },
            auxColors:{
              50:"#FFDEE9",
              100:"#B5FFFC",
              200:"#85FFBD",
              250:"#ec489a",
              300:"#FFFB7D",
              350:"#f67316",
              400:"#8BC6EC",
              500:"#9599E2",
              550:"#6d63c8",
              600:"#272442"
            }
          },
        },
        dark: {
          // ...
          colors: {},
        },
      },
    }),
  ],
}

