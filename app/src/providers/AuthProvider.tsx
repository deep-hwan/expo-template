import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: any | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

// 기본값으로 초기화된 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
});

// AuthProvider 프롭스 타입 정의
interface AuthProviderProps {
  children: ReactNode;
}

// 인증 상태 관리 프로바이더
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  // 앱 시작시 자동 로그인 처리
  useEffect(() => {
    // 저장된 유저 정보 가져오기
    const checkLoginStatus = async () => {
      try {
        // Clear storage for testing (REMOVE THIS IN PRODUCTION)
        // await AsyncStorage.clear();

        const userToken = await AsyncStorage.getItem("@auth_token");
        const userData = await AsyncStorage.getItem("@user_data");

        console.log("자동 로그인 체크:", {
          hasToken: !!userToken,
          hasUserData: !!userData,
        });

        if (userToken && userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            console.log("자동 로그인 성공:", parsedUserData);
            setUser(parsedUserData);
            setIsLoggedIn(true);
          } catch (parseError) {
            console.error("저장된 사용자 데이터 파싱 오류:", parseError);
            // 손상된 데이터 정리
            await AsyncStorage.removeItem("@auth_token");
            await AsyncStorage.removeItem("@user_data");
          }
        } else {
          console.log("저장된 로그인 정보 없음");
        }
      } catch (error) {
        console.error("자동 로그인 중 오류 발생:", error);
      } finally {
        // 약간 지연시켜 로딩 상태 업데이트 (UI가 너무 빨리 깜빡이는 것 방지)
        setTimeout(() => {
          setIsLoading(false);
          console.log("로딩 상태 해제");
        }, 300);
      }
    };

    checkLoginStatus();
  }, []);

  // 로그인 함수
  const login = async (userData: any) => {
    console.log("=== 로그인 함수 호출됨 ===");

    try {
      if (!userData) {
        console.error("로그인 실패: 유저 데이터가 없습니다");
        throw new Error("유저 데이터가 없습니다");
      }

      // 필수 필드 검증
      if (!userData.email) {
        console.error("로그인 실패: 이메일이 없습니다");
        throw new Error("이메일이 없습니다");
      }

      // 토큰 생성 - 실제 앱에서는 서버에서 받아야 함
      const token = userData.token || `token-${Date.now()}`;

      console.log("로그인 처리 중...", { userData, token });

      try {
        // 토큰과 사용자 데이터 저장
        await AsyncStorage.setItem("@auth_token", token);
        console.log("토큰 저장 완료:", token);

        await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
        console.log("사용자 데이터 저장 완료:", JSON.stringify(userData));
      } catch (storageError: any) {
        console.error("AsyncStorage 저장 중 오류:", storageError);
        throw new Error(
          "로그인 정보를 저장할 수 없습니다: " + storageError.message
        );
      }

      // 상태 업데이트 - setTimeout으로 상태 업데이트 순서 보장
      setUser(userData);
      console.log("사용자 상태 업데이트 완료:", userData);

      // 약간의 지연 후 로그인 상태 업데이트
      setTimeout(() => {
        setIsLoggedIn(true);
        console.log("로그인 상태 업데이트 완료 (true)");
      }, 100);

      // 로그인 성공 확인
      return userData;
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 저장된 인증 데이터 삭제
      await AsyncStorage.removeItem("@auth_token");
      await AsyncStorage.removeItem("@user_data");

      // 상태 초기화
      setUser(null);
      setIsLoggedIn(false);

      console.log("로그아웃 완료");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      throw error;
    }
  };

  // 개발용 인증 상태 로그
  useEffect(() => {
    console.log("Auth 상태 변경:", {
      isLoggedIn,
      isLoading,
      user: user?.email,
    });
  }, [isLoggedIn, isLoading, user]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅으로 인증 컨텍스트 사용
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다");
  }
  return context;
}

export default AuthProvider;
