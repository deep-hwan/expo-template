import React, { ReactNode } from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import { borderProps } from "../_style/borderProps";
import { dimensionProps } from "../_style/dimensionProps";
import { flexProps } from "../_style/flexProps";
import { spaceProps } from "../_style/spaceProps";
import { BorderType } from "../_types/BorderType";
import { DimensionType } from "../_types/DimensionType";
import { FlexType } from "../_types/FlexType";
import { SpaceType } from "../_types/SpaceType";

interface Props extends ViewProps, DimensionType, FlexType, BorderType {
  children: ReactNode;
  padding?: SpaceType;
  margin?: SpaceType;
  flexReverse?: boolean;
  backgroundColor?: string;
  borderRadius?: number;
}

export default function Row({ children, style, ...props }: Props) {
  return (
    <View
      style={{
        backgroundColor: props?.backgroundColor,

        ...flexProps({
          direction: props?.flexReverse ? "row-reverse" : "row",
          ...props,
        }),
        ...spaceProps({ padding: props.padding, margin: props?.margin }),
        ...dimensionProps({ ...props, width: props?.width ?? "100%" }),
        ...borderProps(props),
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {children}
    </View>
  );
}
