import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { Splash } from "../contexts/Splash";
import getFontSource from "../utils/getFontSource";
import { AuthProvider } from "./AuthProvider";
import { ChatProvider } from "./ChatProvider";
import { RouterProvider } from "./RouterProvider";
import { StatusBarProvider } from "./StatusBarProvider";
import { ThemeProvider } from "./ThemeProvider";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // 포커스 시 데이터 다시 가져오기 비활성화
        retry: 1, // 실패 시 재시도 횟수
      },
    },
  });

  const fontSources = getFontSource();
  // 폰트 로드
  const [loaded] = useFonts(fontSources);
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

  // 앱이 준비되었는지 확인
  useEffect(() => {
    if (loaded) {
      setAppIsReady(true);
    }
  }, [loaded]);

  // 스플래시 애니메이션 완료 핸들러
  const handleSplashAnimationComplete = () => {
    setSplashAnimationComplete(true);
  };

  if (!loaded) {
    return null;
  }

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <ChatProvider>
              <ThemeProvider>
                <StatusBarProvider>
                  <RouterProvider>
                    {!splashAnimationComplete ? (
                      <Splash
                        onAnimationComplete={handleSplashAnimationComplete}
                      />
                    ) : (
                      children
                    )}
                  </RouterProvider>
                </StatusBarProvider>
              </ThemeProvider>
            </ChatProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
