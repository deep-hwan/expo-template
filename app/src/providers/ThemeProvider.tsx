import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

// Theme 타입 정의
export type ThemeMode = "light" | "dark";
export type ThemePreference = ThemeMode | "auto";

// ThemeContext 타입 정의
interface ThemeContextType {
  theme: ThemeMode; // 현재 적용된 테마 ('light' | 'dark')
  themePreference: ThemePreference; // 사용자 선호 테마 ('light' | 'dark' | 'auto')
  setTheme: (mode: ThemePreference) => void; // 테마 변경 함수
  isDarkMode: boolean; // 다크모드 여부 (편의를 위한 플래그)
}

// 기본값으로 초기화된 컨텍스트 생성
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  themePreference: "auto",
  setTheme: () => {},
  isDarkMode: false,
});

// ThemeProvider 프롭스 타입 정의
interface ThemeProviderProps {
  children: ReactNode;
}

// 저장소 키 상수
const THEME_PREFERENCE_KEY = "@theme_preference";

// 테마 상태 관리 프로바이더
export function ThemeProvider({ children }: ThemeProviderProps) {
  // 시스템 테마 설정 가져오기
  const systemColorScheme = useColorScheme();

  // 사용자 테마 설정
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("auto");

  // 최종 테마 (사용자 설정 또는 시스템 설정에 기반)
  const [theme, setThemeState] = useState<ThemeMode>(
    themePreference === "auto"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themePreference
  );

  // isDarkMode 플래그
  const isDarkMode = theme === "dark";

  // 앱 시작시 저장된 설정 불러오기
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // 테마 설정 로드
        const savedPreference = await AsyncStorage.getItem(
          THEME_PREFERENCE_KEY
        );
        if (savedPreference) {
          setThemePreference(savedPreference as ThemePreference);
        }
      } catch (error) {
        console.error("테마 설정 로드 중 오류:", error);
      }
    };

    loadSettings();
  }, []);

  // 테마 선호도 변경 시 계산된 테마 업데이트
  useEffect(() => {
    if (themePreference === "auto") {
      setThemeState(systemColorScheme === "dark" ? "dark" : "light");
    } else {
      setThemeState(themePreference);
    }
  }, [themePreference, systemColorScheme]);

  // 테마 변경 함수
  const setTheme = async (mode: ThemePreference) => {
    setThemePreference(mode);

    // 설정 저장
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      console.error("테마 설정 저장 중 오류:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themePreference,
        setTheme,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// 커스텀 훅으로 테마 컨텍스트 사용
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme는 ThemeProvider 내부에서만 사용할 수 있습니다");
  }
  return context;
}

export default ThemeProvider;
