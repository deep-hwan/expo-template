import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet } from "react-native";
import { useTheme } from "../providers/ThemeProvider";

interface SplashProps {
  onAnimationComplete: () => void;
}

/**
 * 커스텀 스플래시 스크린 컴포넌트
 * 앱 실행 시 표시되는 스플래시 화면으로, 서서히 확대되는 애니메이션이 적용됩니다.
 * 1.5초 이내에 전체 애니메이션이 완료됩니다.
 */
export function Splash({ onAnimationComplete }: SplashProps) {
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 시스템 컬러 스킴을 이용해 다크모드 여부 판단
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    // 네이티브 스플래시 화면 숨기기
    SplashScreen.hideAsync();

    // 애니메이션 즉시 시작 (페이드아웃 및 확대)
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 1500, // 1.5초 동안 페이드아웃
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.25, // 애니메이션 완료 시 원본 크기의 1.25배로 제한
        duration: 1500, // 1.5초 동안 확대
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후 콜백 실행
      onAnimationComplete();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.splashContainer,
        {
          opacity: opacityAnim,
          backgroundColor: "#fff",
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Image
          source={require("../../../assets/images/splash-icon.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  splashImage: {
    width: 80,
    height: 80,
  },
});
