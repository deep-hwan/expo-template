import React, { useEffect, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../@widgets/display";

interface SliderSwitchProps {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  sliderStyle?: StyleProp<ViewStyle>;
  textActiveStyle?: StyleProp<TextStyle>;
  textInactiveStyle?: StyleProp<TextStyle>;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  animationDuration?: number;
  height?: number;
  borderRadius?: number;
}

const SliderSwitch: React.FC<SliderSwitchProps> = ({
  options,
  value,
  onChange,
  containerStyle,
  sliderStyle,
  textActiveStyle,
  textInactiveStyle,
  activeColor = "#4594FD",
  inactiveColor = "#aaa",
  backgroundColor = "#f0f0f0",
  animationDuration = 100,
  height = 48,
  borderRadius = 18,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));

  // Handle selection change
  const handleSelect = (option: string) => {
    if (option !== value) {
      onChange(option);
    }
  };

  // Update animation when selected option changes
  useEffect(() => {
    const index = options.indexOf(value);
    if (index !== -1) {
      Animated.timing(slideAnim, {
        toValue: index,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [value, options, slideAnim, animationDuration]);

  // Handle the layout change to get the width of the container
  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Calculate slider position based on selected option index
  const optionWidth = containerWidth / options.length;
  const sliderPosition = slideAnim.interpolate({
    inputRange: Array.from({ length: options.length }, (_, i) => i),
    outputRange: Array.from(
      { length: options.length },
      (_, i) => i * optionWidth
    ),
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, height, borderRadius },
        containerStyle,
      ]}
      onLayout={onLayout}
    >
      <Animated.View
        style={[
          styles.slider,
          {
            width: `${100 / options.length}%`,
            height: "100%",
            backgroundColor: activeColor,
            borderRadius,
            transform: [{ translateX: sliderPosition }],
          },
          sliderStyle,
        ]}
      />

      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => handleSelect(option)}
        >
          <Text
            size={13}
            weight={value === option ? "medium" : "regular"}
            color={value === option ? "#fff" : inactiveColor}
            style={value === option ? textActiveStyle : textInactiveStyle}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "relative",
    width: "100%",
  },
  slider: {
    position: "absolute",
  },
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default SliderSwitch;
