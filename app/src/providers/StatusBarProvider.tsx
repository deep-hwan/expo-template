import React from "react";
import { StatusBar } from "react-native";
import { useTheme } from "./ThemeProvider";

export function StatusBarProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </>
  );
}
