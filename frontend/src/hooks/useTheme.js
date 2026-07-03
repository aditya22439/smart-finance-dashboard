import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("expense_theme") || "light");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("expense_theme", theme);
  }, [theme]);

  return {
    isDark: theme === "dark",
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
  };
}
