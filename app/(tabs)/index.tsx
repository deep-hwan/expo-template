import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Spacing, Text } from "@/app/src/@widgets/display";
import { V } from "@/app/src/@widgets/flex/V";
import { useAuth } from "@/app/src/providers/AuthProvider";
import { colors } from "@/app/src/themes/colors";
import { useRouter } from "../src/providers/RouterProvider";
import { useTheme } from "../src/providers/ThemeProvider";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();

  const goToChat = () => {
    // Navigate to the chat tab
    router.replace("/(tabs)/chat");
  };

  return (
    <V.Column
      flex={1}
      padding={{ horizontal: 16, vertical: 16 }}
      backgroundColor={colors.white}
    >
      <Text size={24} weight="bold" color={colors.textColor}>
        안녕하세요, {user?.name || "사용자"}님!
      </Text>

      <Spacing size={16} />

      <Text size={16} color={colors.grey[500]}>
        채팅 앱에 오신 것을 환영합니다.
      </Text>

      <Spacing size={32} />

      <TouchableOpacity style={styles.chatButton} onPress={goToChat}>
        <Text size={16} weight="medium" color={colors.white}>
          채팅하러 가기
        </Text>
      </TouchableOpacity>

      <Spacing size={16} />

      <TouchableOpacity
        style={styles.logoutButton}
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
  chatButton: {
    backgroundColor: colors.keyColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.red[500],
  },
  modeButton: {
    backgroundColor: colors.grey[100],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: colors.keyColor,
  },
});
