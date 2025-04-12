import React, {ForwardedRef, forwardRef, memo} from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';
import {SpaceType} from '../_types/SpaceType';

interface Props extends ViewProps {
  children?: never[];
  direction?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
  size?: number;
  color?: string;
  zIndex?: number;
  spacing?: SpaceType;
}

export const Divider = memo(
  forwardRef(function Solid(
    {
      direction = 'horizontal',
      size = 1,
      color = '#e9e9e9',
      spacing,
      width,
      height,
      zIndex = 2,
      ...props
    }: Props,
    ref: ForwardedRef<View>, // ref 타입 수정
  ) {
    // 반환 타입을 명시적으로 지정
    const Types = (): ViewStyle => {
      if (direction === 'horizontal') {
        return {width: width ?? '100%', height: size};
      }
      if (direction === 'vertical') {
        return {width: size, height: height ?? '100%'};
      }
      return {};
    };

    return (
      <View
        ref={ref}
        style={[
          Types(),
          {
            zIndex,
            backgroundColor: color,
            marginVertical: spacing?.vertical,
            marginHorizontal: spacing?.horizontal,
            marginLeft: spacing?.left,
            marginRight: spacing?.right,
            marginTop: spacing?.top,
            marginBottom: spacing?.bottom,
            marginStart: spacing?.start,
            marginEnd: spacing?.end,
          },
        ]}
        {...props}
      />
    );
  }),
);
