import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Spacing, Text } from "@/app/src/@widgets/display";
import { V } from "@/app/src/@widgets/flex/V";
import { useAuth } from "@/app/src/providers/AuthProvider";
import { ThemePreference, useTheme } from "@/app/src/providers/ThemeProvider";
import { colors } from "@/app/src/themes/colors";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, themePreference, setTheme, isDarkMode } = useTheme();

  // 테마 옵션 배경 및 텍스트 색상 스타일 계산
  const getThemeOptionStyles = (option: ThemePreference) => {
    const isSelected = themePreference === option;

    return {
      container: {
        backgroundColor: isDarkMode
          ? isSelected
            ? colors.keyColor
            : "#2C2C2C"
          : isSelected
          ? colors.keyColor
          : colors.chiffon[100],
        padding: 12,
        borderRadius: 8,
        alignItems: "center" as const,
        flex: 1,
        marginHorizontal: 4,
      },
      text: {
        color: isSelected ? "#FFFFFF" : isDarkMode ? "#FFFFFF" : "#000000",
        weight: isSelected ? ("bold" as "bold") : ("regular" as "regular"),
      },
    };
  };

  // 테마 변경 핸들러
  const handleThemeChange = (newTheme: ThemePreference) => {
    setTheme(newTheme);
  };

  return (
    <V.Column
      flex={1}
      backgroundColor={isDarkMode ? "#121212" : colors.white}
      padding={{ horizontal: 16, vertical: 16 }}
    >
      <V.Column
        padding={{ horizontal: 20, vertical: 20 }}
        backgroundColor={isDarkMode ? "#2C2C2C" : colors.pastel_blue[100]}
        borderRadius={12}
      >
        <Text
          size={24}
          weight="bold"
          color={isDarkMode ? "#FFFFFF" : colors.textColor}
        >
          {user?.name || "사용자"}
        </Text>

        <Spacing size={8} />

        <Text size={16} color={isDarkMode ? "#CCCCCC" : colors.grey[500]}>
          {user?.email || "email@example.com"}
        </Text>

        <Spacing size={16} />

        <Text size={14} color={isDarkMode ? "#AAAAAA" : colors.grey[400]}>
          ID: {user?.id || "N/A"}
        </Text>
      </V.Column>

      <Spacing size={32} />

      <Text
        size={18}
        weight="bold"
        color={isDarkMode ? "#FFFFFF" : colors.textColor}
      >
        사용자 정보
      </Text>

      <Spacing size={16} />

      <V.Column
        padding={{ vertical: 12, horizontal: 16 }}
        backgroundColor={isDarkMode ? "#2C2C2C" : colors.chiffon[100]}
        borderRadius={8}
      >
        <Text size={16} color={isDarkMode ? "#FFFFFF" : colors.textColor}>
          가입일: 2023년 12월 1일
        </Text>
      </V.Column>

      <Spacing size={12} />

      <V.Column
        padding={{ vertical: 12, horizontal: 16 }}
        backgroundColor={isDarkMode ? "#2C2C2C" : colors.chiffon[100]}
        borderRadius={8}
      >
        <Text size={16} color={isDarkMode ? "#FFFFFF" : colors.textColor}>
          활동 채팅방: {3}개
        </Text>
      </V.Column>

      <Spacing size={32} />

      <Text
        size={18}
        weight="bold"
        color={isDarkMode ? "#FFFFFF" : colors.textColor}
      >
        앱 테마 설정
      </Text>

      <Spacing size={16} />

      <View style={styles.themeOptionsContainer}>
        {/* 자동 테마 설정 */}
        <TouchableOpacity
          style={getThemeOptionStyles("auto").container}
          onPress={() => handleThemeChange("auto")}
        >
          <Text
            color={getThemeOptionStyles("auto").text.color}
            weight={getThemeOptionStyles("auto").text.weight}
          >
            자동
          </Text>
        </TouchableOpacity>

        {/* 라이트 테마 설정 */}
        <TouchableOpacity
          style={getThemeOptionStyles("light").container}
          onPress={() => handleThemeChange("light")}
        >
          <Text
            color={getThemeOptionStyles("light").text.color}
            weight={getThemeOptionStyles("light").text.weight}
          >
            라이트
          </Text>
        </TouchableOpacity>

        {/* 다크 테마 설정 */}
        <TouchableOpacity
          style={getThemeOptionStyles("dark").container}
          onPress={() => handleThemeChange("dark")}
        >
          <Text
            color={getThemeOptionStyles("dark").text.color}
            weight={getThemeOptionStyles("dark").text.weight}
          >
            다크
          </Text>
        </TouchableOpacity>
      </View>

      <Spacing size={8} />

      <V.Column
        padding={{ vertical: 12, horizontal: 16 }}
        backgroundColor={isDarkMode ? "#2C2C2C" : colors.chiffon[100]}
        borderRadius={8}
      >
        <Text size={16} color={isDarkMode ? "#FFFFFF" : colors.textColor}>
          현재 테마:{" "}
          {themePreference === "auto"
            ? "자동 (시스템)"
            : themePreference === "light"
            ? "라이트"
            : "다크"}
        </Text>
        <Text size={14} color={isDarkMode ? "#AAAAAA" : colors.grey[400]}>
          적용된 테마: {theme === "light" ? "라이트" : "다크"}
        </Text>
      </V.Column>

      <Spacing size={32} />

      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            backgroundColor: isDarkMode ? "#121212" : colors.white,
            borderColor: colors.red[500],
          },
        ]}
        onPress={async () => {
          await logout();
        }}
      >
        <Text size={16} weight="medium" color={colors.red[500]}>
          로그아웃
        </Text>
      </TouchableOpacity>
    </V.Column>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  themeOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
