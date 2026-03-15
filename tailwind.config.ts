/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: '#224c87',
                    red: '#da3832',
                    gray: '#919090',
                    darkGray: '#6b6a6a',
                    bg: '#f5f7fa',
                }
            },
        },
    },
    plugins: [],
};
