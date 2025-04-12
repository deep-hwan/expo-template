import { colors } from "@/app/src/themes/colors";
import { Stack } from "expo-router";
import React from "react";

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "NotoSans-Medium",
          color: colors.textColor,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "채팅",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "채팅방",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "새 채팅방",
        }}
      />
      <Stack.Screen
        name="invite"
        options={{
          title: "사용자 초대",
        }}
      />
    </Stack>
  );
}
