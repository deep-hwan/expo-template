import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../themes/colors";

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  inputStyle?: StyleProp<TextStyle>;
  activeColor?: string;
  error?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  inputStyle,
  activeColor = "#46474a",
  error,
  onFocus,
  ...props
}) => {
  const inactiveColor = "#ccc";

  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelPosition = useRef(
    new Animated.Value(value ? 1 : 0)
  ).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(animatedLabelPosition, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Add keyboard listeners to handle focus loss when keyboard is dismissed
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (isFocused) {
          inputRef.current?.blur();
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      animatedLabelPosition.stopAnimation();
    };
  }, [isFocused, value, animatedLabelPosition]);

  const labelTop = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [19, 10], // Move from middle of input to top
  });

  const labelFontSize = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(14), RFValue(8)], // Shrink font size when it moves up
  });

  const labelColor = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: ["#98999a", activeColor],
  });

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handlePress = () => {
    if (!isFocused) {
      inputRef.current?.focus();
    }
  };

  return (
    <View style={{ position: "relative", width: "100%" }}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View style={{ position: "relative", width: "100%" }}>
          <Animated.Text
            style={[
              styles.label,
              {
                top: labelTop,
                fontSize: labelFontSize,
                color: isFocused
                  ? activeColor
                  : error
                  ? colors.red[400]
                  : labelColor,
              },
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                borderColor: isFocused
                  ? activeColor
                  : error
                  ? colors.red[400]
                  : inactiveColor,
                color: "#48494a",
              },
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={(e) => {
              handleFocus();
              onFocus?.(e);
            }}
            onBlur={handleBlur}
            placeholderTextColor="transparent"
            {...props}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      {error ? <View style={styles.errorLine} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 62,
    paddingHorizontal: 15,
    paddingTop: 17,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "#fff",
    fontFamily: "NotoSans-Regular",
    fontSize: RFValue(14),
  },
  label: {
    position: "absolute",
    left: 15,
    backgroundColor: "transparent",
    fontFamily: "NotoSans-Regular",
    zIndex: 1,
  },
  errorLine: {
    height: 2,
    backgroundColor: colors.red[400],
    borderRadius: 1,
  },
});
