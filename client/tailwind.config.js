content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'];
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})

module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            backgroundImage: {
                'moodiary-gradient': 'linear-gradient(135deg, #CDB4DB, #FFCDB2, #D8F3DC)',
            },
            animation: {
                'bg-pan': 'bg-pan 15s ease infinite',
            },
            keyframes: {
                'bg-pan': {
                    '0%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                    '100%': { 'background-position': '0% 50%' },
                },
            },
        },
    },
};

// /** @type {import('tailwindcss').Config} */
// export const content = [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
// ];
// export const theme = {
//     extend: {
//         colors: {
//             primary: "#f91736",
//         },
//         fontFamily: {
//             sans: ["Dosis", "sans-serif"],
//             playwrite: ["Playwrite DK Loopet", "sans-serif"],
//         },
//         container: {
//             center: true,
//             padding: {
//                 DEFAULT: "1rem",
//                 sm: "2rem",
//                 lg: "4rem",
//                 xl: "5rem",
//                 "2xl": "6rem",
//             },
//         },
//     },
// };
// export const plugins = [];

// /** @type {import('tailwindcss').Config} */
// export default {
//     content: [
//         "./index.html",
//         "./src/**/*.{js,ts,jsx,tsx}",
//     ],
//     theme: {
//         extend: {
//             colors: {
//                 primary: "#f91736",
//             },
//             fontFamily: {
//                 sans: ["Dosis", "sans-serif"],
//                 playwrite: ["'Playwrite DK Loopet'", "sans-serif"],
//             },
//             container: {
//                 center: true,
//                 padding: {
//                     DEFAULT: "1rem",
//                     sm: "2rem",
//                     lg: "4rem",
//                     xl: "5rem",
//                     "2xl": "6rem",
//                 },
//             },
//         },
//     },
//     plugins: [],
// };
