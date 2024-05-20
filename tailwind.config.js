module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,tsx,ts,js,jsx}"],
  theme: {
    extend: {
      colors: {
        darkBackground: "#1f2937", 
        darkError: "#dc2626", 
        darkPrimary: "#6D28D9", 
        darkAccent: "#0E7490", 
        lightBackground: "#f3f4f6",
        lightError: "#ef4444",
        lightPrimary: "#9CA3AF", 
        lightAccent: "#FBBF24",
        lighTextColor: "#FFFFFF",
        navbarTextColor: '#FFFFFF',
        layoutTextColor: '#f3f4f6',
        primaryText: '#4B5563', 
        sky600: '#87CEEB', 
        email: '#00b1b7',
        facebook: '#3d59c4'
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        fadeOut: 'fadeOut 1.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
