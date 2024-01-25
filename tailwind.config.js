
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#FF6363",
        "secondary": {
          100: "#E2E2D5",
          200: "#888883",
        },
      },
      fontFamily: {
        "body": ["Nunito"],
      },
      borderWidth: {
        "10": "10px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    
  ],
}