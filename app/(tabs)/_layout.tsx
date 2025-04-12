import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "../src/providers/ThemeProvider";
import { colors } from "../src/themes/colors";

/**
 * 앱의 탭 네비게이션 레이아웃
 */
export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        // 탭 공통 스타일
        tabBarActiveTintColor: colors.keyColor,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: "NotoSans-Medium",
          color: isDarkMode ? "#FFFFFF" : "#000000", // 테마에 맞는 텍스트 색상
        },
        tabBarLabelStyle: {
          fontFamily: "NotoSans-Regular",
        },
        // 테마에 맞는 스타일 적용
        headerStyle: {
          backgroundColor: isDarkMode ? "#121212" : "#FFFFFF", // 테마에 맞는 배경색
        },
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#121212" : "#FFFFFF", // 테마에 맞는 배경색
          borderTopColor: isDarkMode ? "#2C2C2C" : "#E0E0E0", // 테마에 맞는 테두리
        },
        tabBarInactiveTintColor: isDarkMode ? "#AAAAAA" : "#757575", // 테마에 맞는 비활성 탭 색상
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "채팅",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "프로필",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
