module.exports = {
    darkMode: "class",
    content: [
        "./handbook/**/*.html",
        "./assets/**/*.{ts,js}",
        "./src/**/*.{ts,js}",
    ],
    theme: {
        fontSize: {
            xs: ".75rem",
            sm: ".875rem",
            tiny: ".875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
            "5xl": "3rem",
            "6xl": "4rem",
            "7xl": "5rem",
        },
        container: {
            padding: {
                DEFAULT: "2rem",
                lg: "4rem",
            },
        },
        colors: {
            dark: "#020e17",
            "dark-lighter": "#072f4a",

            brand: "#9434a3",
            "brand-LS": "#6598ba",
            "brand-IC": "#0C639D",
            pop: "#b941cc",

            black: "#000000",
            gray: "#727779",
            transparent: "transparent",

            darker: "#e4ebf5",
            white: "#f0f3f7",
            light2: "#f5f8fc",
            light: "#dde4ed",
            lightpop: "#BCE4FF",

            blacktrans: "rgba(0,0,0,0.15)",
            whitetrans: "rgba(255,255,255,0.90)",
            brandtrans: "rgba(20,124,194, 0.65)",
            branddarktrans: "rgba(8,60,97, 0.85)",
        },
    },
    extend: {
        screens: {
            lg: "992px",
        },
    },
};
