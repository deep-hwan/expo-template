import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, UIManager, View } from "react-native";
import "react-native-reanimated";
import AppProvider from "./src/providers/AppProvider";
import { useAuth } from "./src/providers/AuthProvider";
import { useTheme } from "./src/providers/ThemeProvider";
import { replaceTo } from "./src/utils/navigationUtils";

// 안드로이드에서 LayoutAnimation 활성화
// 컴포넌트가 나타나거나 사라질 때, 크기나 위치가 변경될 때 자연스러운 애니메이션 효과를 제공
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 로딩이 완료되기 전에 스플래시 화면이 자동으로 숨는 것을 방지
SplashScreen.preventAutoHideAsync();

// 인증 상태에 따른 리디렉션 제어를 위한 컴포넌트
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  // Use state to track redirections with a reference to previous values
  const [redirected, setRedirected] = useState(false);
  const prevAuthState = useRef({
    isLoggedIn,
    isLoading,
    segments: String(segments[0] || ""),
  });

  // Reset redirection state when auth state changes significantly
  useEffect(() => {
    const currentSegment = String(segments[0] || "");
    const prevSegment = prevAuthState.current.segments;

    if (
      prevAuthState.current.isLoggedIn !== isLoggedIn ||
      currentSegment !== prevSegment
    ) {
      console.log("AuthGuard: 상태 변경 감지", {
        prevLoggedIn: prevAuthState.current.isLoggedIn,
        currentLoggedIn: isLoggedIn,
        prevSegment,
        currentSegment,
      });

      // 상태가 변경되었으므로 리디렉션 플래그 초기화
      setRedirected(false);

      // 현재 상태 업데이트
      prevAuthState.current = {
        isLoggedIn,
        isLoading,
        segments: currentSegment,
      };
    }
  }, [isLoggedIn, segments, isLoading]);

  // 리디렉션 로직
  useEffect(() => {
    if (isLoading || redirected) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)"; // (auth) 그룹에 로그인 화면 포함
    console.log("AuthGuard: 리디렉션 체크", {
      isLoggedIn,
      inAuthGroup,
      redirected,
    });

    if (
      // 로그인하지 않았고, 인증 그룹이 아닌 경우
      !isLoggedIn &&
      !inAuthGroup
    ) {
      // 로그인 화면으로 리디렉션
      console.log("AuthGuard: 로그인 화면으로 리디렉션");
      setRedirected(true);
      replaceTo("/(auth)/login");
    } else if (
      // 로그인했고, 인증 그룹인 경우
      isLoggedIn &&
      inAuthGroup
    ) {
      // 메인 화면으로 리디렉션
      console.log("AuthGuard: 메인 화면으로 리디렉션");
      setRedirected(true);
      replaceTo("/(tabs)");
    }
  }, [isLoggedIn, segments, isLoading, redirected]);

  if (isLoading) {
    // 로딩 화면
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const { isDarkMode } = useTheme();

  return (
    <AppProvider>
      <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <AuthGuard>
          <Stack
            screenOptions={{
              // 헤더 텍스트 스타일에 폰트 적용
              headerTitleStyle: {
                fontFamily: "NotoSans-Medium",
                color: isDarkMode ? "#FFFFFF" : "#000000", // 테마에 맞는 텍스트 색상
              },
              // 헤더 백 버튼 텍스트 스타일에 폰트 적용
              headerBackTitleStyle: {
                fontFamily: "NotoSans-Regular",
              },
              headerStyle: {
                backgroundColor: isDarkMode ? "#121212" : "#FFFFFF", // 테마에 맞는 배경색
              },
              contentStyle: {
                backgroundColor: isDarkMode ? "#121212" : "#FFFFFF", // 테마에 맞는 배경색
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthGuard>
      </NavigationThemeProvider>
    </AppProvider>
  );
}
