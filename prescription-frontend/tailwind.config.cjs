// module.exports = {
//    content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}", // include all your React files
//   ],
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }




// tailwind.config.cjs

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // ✅ scans all your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
