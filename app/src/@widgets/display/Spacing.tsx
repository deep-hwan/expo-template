import React from "react";
import { View } from "react-native";

interface SpacingProps {
  size?: number;
  direction?: "row" | "column";
  horizontal?: boolean;
}

export const Spacing = ({
  size = 10,
  direction = "column",
  horizontal = false,
}: SpacingProps) => {
  // If horizontal prop is provided, it overrides direction
  const effectiveDirection = horizontal ? "row" : direction;

  return (
    <View
      style={{
        width: effectiveDirection === "column" ? "100%" : size,
        height: effectiveDirection === "column" ? size : "100%",
      }}
    />
  );
};
