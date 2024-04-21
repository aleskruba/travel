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
        // Define your color variables for light mode
        lightBackground: "#f3f4f6",
        lightError: "#ef4444",
        lightPrimary: "#9CA3AF", 
        lightAccent: "#FBBF24",

        navbarTextColor:'#FFFFFF',
        primaryText: '#4B5563', 
        sky600: '#87CEEB', 
      },
    },
  },
  plugins: [],
};
