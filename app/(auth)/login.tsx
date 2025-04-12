import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { T, TInput } from "../components/TextWrapper";
import { Text } from "../src/@widgets/display";
import { useAuth } from "../src/providers/AuthProvider";

export default function LoginScreen() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isLoggedIn, user } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 임시 로그인 구현 - 아무 이메일/비밀번호로도 로그인 가능
      const userData = {
        id: Math.floor(Math.random() * 1000) + 1, // 랜덤 ID 생성
        email,
        name: email.split("@")[0] || "사용자", // 이메일에서 이름 추출 또는 기본값
        token: `demo-token-${Date.now()}`, // 고유 토큰 생성
      };

      console.log("로그인 시도:", userData);

      // 현재 인증 상태 확인
      console.log("로그인 전 상태:", { isLoggedIn, user });

      // 데이터가 제대로 전달되는지 확인
      Alert.alert(
        "디버그 정보",
        `로그인 시도 중:\nEmail: ${email}\nName: ${userData.name}\nID: ${userData.id}`,
        [
          {
            text: "계속",
            onPress: async () => {
              try {
                const result = await login(userData);
                console.log("로그인 함수 반환값:", result);
                console.log("로그인 후 상태:", {
                  isLoggedIn: true,
                  user: userData,
                });
                Alert.alert("로그인 성공", "로그인이 완료되었습니다.");
              } catch (loginError: any) {
                console.error("로그인 중 오류 발생:", loginError);
                setError(
                  `로그인 실패: ${loginError?.message || "알 수 없는 오류"}`
                );
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("로그인 오류:", err);
      setError(`로그인에 실패했습니다: ${err?.message || "알 수 없는 오류"}`);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text weight="bold" style={styles.title}>
          로그인
        </Text>

        <TInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <T style={styles.errorText}>{error}</T> : null}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <T weight="medium" style={styles.loginButtonText}>
              로그인
            </T>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.loginButton,
            { marginTop: 10, backgroundColor: "#4CAF50" },
          ]}
          onPress={() => {
            // 자동 로그인 - 바로 로그인 실행
            const testUserData = {
              id: 999,
              email: "test@example.com",
              name: "테스트계정",
              token: `test-token-${Date.now()}`,
            };

            setLoading(true);
            setError("");

            // 즉시 로그인 시도
            login(testUserData)
              .then(() => {
                console.log("테스트 로그인 성공!");
                Alert.alert("테스트 로그인 성공", "로그인이 완료되었습니다.");
              })
              .catch((err) => {
                console.error("테스트 로그인 실패:", err);
                setError(
                  `테스트 로그인 실패: ${err?.message || "알 수 없는 오류"}`
                );
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <T weight="medium" style={styles.loginButtonText}>
            테스트 로그인 (원클릭)
          </T>
        </TouchableOpacity>

        <View style={styles.debugContainer}>
          <T style={styles.debugText}>
            디버그 모드: 아무 정보나 입력하여 로그인 가능
          </T>
          {isLoggedIn && (
            <T style={styles.debugText}>현재 상태: 로그인됨 ({user?.email})</T>
          )}
          {!isLoggedIn && (
            <T style={styles.debugText}>현재 상태: 로그인되지 않음</T>
          )}
        </View>

        <TouchableOpacity style={styles.registerLink}>
          <T style={styles.registerText}>계정이 없으신가요? 회원가입</T>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  errorText: {
    color: "#ff3b30",
    marginBottom: 16,
  },
  registerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  registerText: {
    color: "#007AFF",
  },
  debugContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  debugText: {
    color: "#666666",
    fontSize: 12,
  },
});
