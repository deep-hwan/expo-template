import React, { ReactNode } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
} from "react-native";
import { FontWeight } from "../src/utils/getFontSource";

interface TextWrapperProps extends TextProps {
  weight?: FontWeight;
  children: ReactNode;
}

interface InputWrapperProps extends TextInputProps {
  weight?: FontWeight;
}

/**
 * 노토 산스 폰트를 기본으로 사용하는 텍스트 컴포넌트
 *
 * 사용 예시:
 * <T>일반 텍스트</T>
 * <T weight="bold">굵은 텍스트</T>
 */
export function T(props: TextWrapperProps) {
  const { style, weight = "regular", children, ...rest } = props;

  const fontStyle: TextStyle = {
    fontFamily: getFontFamily(weight),
  };

  return (
    <Text style={[fontStyle, style]} {...rest}>
      {children}
    </Text>
  );
}

/**
 * 노토 산스 폰트를 기본으로 사용하는 텍스트 입력 컴포넌트
 *
 * 사용 예시:
 * <TInput placeholder="입력하세요" />
 * <TInput weight="medium" placeholder="폰트 굵기 조정" />
 */
export function TInput(props: InputWrapperProps) {
  const { style, weight = "regular", ...rest } = props;

  const fontStyle: TextStyle = {
    fontFamily: getFontFamily(weight),
  };

  return <TextInput style={[fontStyle, style]} {...rest} />;
}

// 폰트 패밀리 이름 가져오기
function getFontFamily(weight: FontWeight): string {
  return `NotoSans-${capitalizeFirstLetter(weight)}`;
}

// 첫 글자를 대문자로 변환
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default { T, TInput };
