/** @type {import('tailwindcss').Config} */
export default {
  content: ["../frontend/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        gob: "#611232",
        golden: "#a57f2c",
        "imt-dark": "#06205C",
        "imt-nat": "#016099",
        "imt-light": "#1EA2E9",
      },
      width: {
        18: "4.5rem",
      },
      height: {
        18: "4,5rem",
      },
      size: {
        18: "4.5rem",
      },
      fontFamily: {
        gob: "GMX-Regular",
        montserrat: "Montserrat",
      },
    },
  },
  plugins: [],
};
