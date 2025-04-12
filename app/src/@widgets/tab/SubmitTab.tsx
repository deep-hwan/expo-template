import React, { ReactNode } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../themes/colors";
import { Text } from "../display";
import { LoadingSpinner } from "../loading/LoadingSpinner";

interface SubmitTabProps extends TouchableOpacityProps {
  name: string;
  isLoading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
  loadingSize?: number;
}

const SubmitTab: React.FC<SubmitTabProps> = ({
  name,
  isLoading = false,
  disabled = false,
  children,
  containerStyle,
  textStyle,
  loadingColor = "#fff",
  loadingSize = 23,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabledContainer,
        containerStyle,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.85}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner color={loadingColor} size={loadingSize} />
      ) : children ? (
        children
      ) : (
        <Text size={13} weight="medium" color="#fff">
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    backgroundColor: colors.keyColor,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  disabledContainer: {
    backgroundColor: "#ccc",
    opacity: 0.9,
  },
  text: {
    color: "#fff",
    fontSize: RFValue(13),
    fontWeight: "medium",
  },
});

export default SubmitTab;
