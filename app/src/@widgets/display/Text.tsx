import React, { ReactNode } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  StyleSheet,
  TextStyle,
} from "react-native";

import { colors } from "../../themes/colors";

interface TextProps extends RNTextProps {
  children?: ReactNode;
  size?: number;
  weight?: "regular" | "medium" | "bold";
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  style?: StyleProp<TextStyle>;
  lineHeight?: number;
}

export const Text = ({
  children,
  size = 14,
  weight = "regular",
  color = colors.textColor,
  align,
  style,
  lineHeight,
  ...props
}: TextProps) => {
  const getFontFamily = () => {
    switch (weight) {
      case "medium":
        return "NotoSans-Medium";
      case "bold":
        return "NotoSans-Bold";
      case "regular":
      default:
        return "NotoSans-Regular";
    }
  };

  return (
    <RNText
      style={[
        styles.text,
        { fontSize: size },
        { fontFamily: getFontFamily() },
        { color },
        align && { textAlign: align },
        lineHeight !== undefined && { lineHeight },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontFamily: "NotoSans-Regular",
    color: colors.textColor,
  },
});
