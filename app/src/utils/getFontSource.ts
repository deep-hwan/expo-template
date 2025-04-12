/**
 * 폰트 웨이트 타입 정의
 */
export type FontWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

/**
 * 앱에서 사용할 모든 폰트 소스를 반환하는 유틸리티 함수
 * 폰트 추가/제거 시 이 파일만 수정하면 됩니다.
 *
 * @returns 폰트 소스 객체
 */
export function getFontSource() {
  return {
    // Noto Sans KR 폰트 - 모든 웨이트
    "NotoSans-Thin": require("../../../assets/fonts/NotoSansKR-Thin.ttf"),
    "NotoSans-ExtraLight": require("../../../assets/fonts/NotoSansKR-ExtraLight.ttf"),
    "NotoSans-Light": require("../../../assets/fonts/NotoSansKR-Light.ttf"),
    "NotoSans-Regular": require("../../../assets/fonts/NotoSansKR-Regular.ttf"),
    "NotoSans-Medium": require("../../../assets/fonts/NotoSansKR-Medium.ttf"),
    "NotoSans-SemiBold": require("../../../assets/fonts/NotoSansKR-SemiBold.ttf"),
    "NotoSans-Bold": require("../../../assets/fonts/NotoSansKR-Bold.ttf"),
    "NotoSans-ExtraBold": require("../../../assets/fonts/NotoSansKR-ExtraBold.ttf"),
    "NotoSans-Black": require("../../../assets/fonts/NotoSansKR-Black.ttf"),

    // 기타 폰트를 여기에 추가할 수 있습니다.
    // 예: 'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
  };
}

/**
 * 폰트 이름과 웨이트를 매핑하는 유틸리티 객체
 */
export const FontMap = {
  thin: "NotoSans-Thin",
  extralight: "NotoSans-ExtraLight",
  light: "NotoSans-Light",
  regular: "NotoSans-Regular",
  medium: "NotoSans-Medium",
  semibold: "NotoSans-SemiBold",
  bold: "NotoSans-Bold",
  extrabold: "NotoSans-ExtraBold",
  black: "NotoSans-Black",
};

export default getFontSource;
