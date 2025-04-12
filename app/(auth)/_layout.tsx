import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // 인증 화면 공통 스타일 옵션 추가
        contentStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    />
  );
}
