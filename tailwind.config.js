/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Brand uses Tailwind's sky palette for a bluish theme
                brand: colors.sky,
            },
        },
    },
    plugins: ["daisyui"],
};
