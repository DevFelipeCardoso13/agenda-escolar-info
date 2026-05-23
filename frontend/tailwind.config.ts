import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jdm: {
          azul: "#1B3A8C",
          medio: "#1565C0",
          gelo: "#F5F7FF",
          amarelo: "#F5C800",
          verde: "#2E7D32",
          bege: "#E8E0D0",
          branco: "#FFFFFF",
        },
      },
      boxShadow: {
        soft: "0 20px 50px rgba(27, 58, 140, 0.12)",
      },
    },
  },
};

export default config;
