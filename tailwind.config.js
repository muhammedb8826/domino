/* eslint-env node */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class-based toggling
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    },
  },
  theme: {
    extend: {
      colors: {
        primary: '#FF6363',
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
        },
      },
      fontFamily: {
        body: ['Nunito'],
      },
      borderWidth: {
        '10': '10px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    // Add any additional plugins you may need
  ],
};
