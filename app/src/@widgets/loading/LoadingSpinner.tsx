import React, {forwardRef, memo} from 'react';
import {Animated, Easing, View, ViewProps} from 'react-native';

// --------------------------------------------
// -------------- Type Interface --------------
// --------------------------------------------
interface Props extends ViewProps {
  size?: number;
  strokeSize?: number;
  color?: string;
}

// --------------------------------------------
// -------------- LoadingSpinner --------------
// --------------------------------------------
const LoadingSpinnerUi = forwardRef(
  (
    {size = 25, strokeSize = 2.5, color = '#f0f0f0', style, ...props}: Props,
    ref: any,
  ) => {
    const spinValue = new Animated.Value(0);

    React.useEffect(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    }, []);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View
        ref={ref}
        style={[
          {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
        {...props}>
        <Animated.View
          style={{
            width: size,
            height: size,
            borderWidth: strokeSize,
            borderColor: color,
            borderBottomColor: 'transparent',
            borderRadius: size / 2,
            transform: [{rotate: spin}],
          }}
        />
      </View>
    );
  },
);

export const LoadingSpinner = memo(LoadingSpinnerUi);
