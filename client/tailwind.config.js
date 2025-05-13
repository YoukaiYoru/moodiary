// content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'];

/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        colors: {
            primary: "#f91736",
        },
        fontFamily: {
            sans: ["Dosis", "sans-serif"],
            playwrite: ["Playwrite DK Loopet", "sans-serif"],
        },
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
        },
    },
};
export const plugins = [];

