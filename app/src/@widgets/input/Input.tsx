import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "../../themes/colors";

interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: string;
}

export const Input = ({
  containerStyle,
  inputStyle,
  error,
  ...props
}: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, inputStyle]}
        placeholderTextColor={colors.grey[300]}
        {...props}
      />
      {error ? <View style={styles.errorLine} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
  },
  input: {
    fontFamily: "NotoSans-Regular",
    backgroundColor: colors.chiffon[100],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textColor,
    borderWidth: 1,
    borderColor: colors.chiffon[300],
  },
  inputError: {
    borderColor: colors.red[400],
  },
  errorLine: {
    height: 2,
    backgroundColor: colors.red[400],
    borderRadius: 1,
  },
});
