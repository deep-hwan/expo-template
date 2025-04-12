import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type SpaceType =
  | number
  | {
      horizontal?: number;
      vertical?: number;
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };

interface Props {
  children: ReactNode;
  flex?: number;
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  align?: "flex-start" | "flex-end" | "center" | "stretch";
  padding?: SpaceType;
  margin?: SpaceType;
  style?: StyleProp<ViewStyle>;
}

const getSpacing = (value?: SpaceType): ViewStyle | undefined => {
  if (value === undefined) return undefined;

  if (typeof value === "number") {
    return {
      padding: value,
    };
  }

  const result: ViewStyle = {};

  if (value.horizontal !== undefined) {
    result.paddingHorizontal = value.horizontal;
  }

  if (value.vertical !== undefined) {
    result.paddingVertical = value.vertical;
  }

  if (value.top !== undefined) {
    result.paddingTop = value.top;
  }

  if (value.bottom !== undefined) {
    result.paddingBottom = value.bottom;
  }

  if (value.left !== undefined) {
    result.paddingLeft = value.left;
  }

  if (value.right !== undefined) {
    result.paddingRight = value.right;
  }

  return result;
};

const Row = ({
  children,
  flex,
  justify,
  align,
  padding,
  margin,
  style,
}: Props) => {
  return (
    <View
      style={[
        styles.row,
        flex !== undefined && { flex },
        justify !== undefined && { justifyContent: justify },
        align !== undefined && { alignItems: align },
        getSpacing(padding),
        margin !== undefined &&
          (typeof margin === "number"
            ? { margin }
            : {
                marginHorizontal: margin.horizontal,
                marginVertical: margin.vertical,
                marginTop: margin.top,
                marginBottom: margin.bottom,
                marginLeft: margin.left,
                marginRight: margin.right,
              }),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});

export const H = {
  Row,
};
