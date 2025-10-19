/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      lineClamp: {
        7:'7',
        8: '8', // now line-clamp-8 works
        9:'9',
        10:'10',
        11:'11',
        12:'12'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // now `font-sans` uses Poppins
      },
      zIndex: {
        '-10': '-10',
        '-20': '-20',
      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
