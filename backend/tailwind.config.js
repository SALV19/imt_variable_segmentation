/** @type {import('tailwindcss').Config} */
export default {
  content: ["../frontend/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        gob: '#611232',
        golden: '#a57f2c',
      },
      width: {
        '18': '4.5rem',
      },
      height: {
        '18': '4,5rem'
      },
      size: {
        '18': '4.5rem'
      },
      fontFamily: {
        gob: 'GMX-Regular',
        montserrat: 'Montserrat',
      },
    },
  },
  plugins: [],
}

