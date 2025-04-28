import React, { useEffect, useState } from "react";
import {
  ImageStyle,
  Platform,
  Image as RNImage,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

interface CustomImageProps {
  source: string | any; // 문자열(URL) 또는 require()로 가져온 이미지
  width?: number | string;
  height?: number | string;
  ratio?: {
    x: number | string;
    y: number | string;
  };
  style?: StyleProp<ImageStyle>;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const Image: React.FC<CustomImageProps> = ({
  source,
  width,
  height,
  ratio,
  style,
  resizeMode = "contain",
  onLoad,
  onError,
  ...props
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageSource, setImageSource] = useState<any>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // URL 또는 로컬 이미지 판별
  useEffect(() => {
    if (typeof source === "string") {
      // URL인지 확인 (http 또는 https로 시작하는지)
      if (source.startsWith("http://") || source.startsWith("https://")) {
        setImageSource({ uri: source });
      } else {
        // @/ 경로 또는 기타 문자열 경로 처리 시도
        try {
          // 여기서는 간단하게 require로 처리할 수 없어 에러 발생 가능성 있음
          console.warn(
            "문자열 형식의 로컬 이미지 경로는 지원하지 않습니다. require()를 사용해주세요."
          );
          setImageSource(null);
        } catch (error) {
          console.error("이미지 로드 에러:", error);
          setImageSource(null);
        }
      }
    } else {
      // require()로 가져온 로컬 이미지
      setImageSource(source);
    }
  }, [source]);

  // 이미지 크기 계산
  useEffect(() => {
    if (!imageSource) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (typeof imageSource === "number" || (imageSource && imageSource.uri)) {
      const getImageSize = () => {
        const uri =
          typeof imageSource === "number"
            ? RNImage.resolveAssetSource(imageSource).uri
            : imageSource.uri;

        RNImage.getSize(
          uri,
          (originalWidth, originalHeight) => {
            setImageSize({ width: originalWidth, height: originalHeight });
            setAspectRatio(originalWidth / originalHeight);
            setIsLoading(false);
            onLoad?.();
          },
          (error) => {
            console.error("이미지 크기 가져오기 실패:", error);
            setIsLoading(false);
            onError?.(error);
          }
        );
      };

      // 웹이 아닌 경우에만 RNImage.getSize 사용
      if (Platform.OS !== "web") {
        getImageSize();
      } else {
        // 웹에서는 기본값 설정
        setAspectRatio(1);
        setIsLoading(false);
      }
    }
  }, [imageSource, onLoad, onError]);

  // 비율 계산
  const calculateRatio = () => {
    if (ratio && ratio.x && ratio.y) {
      const x = typeof ratio.x === "string" ? parseFloat(ratio.x) : ratio.x;
      const y = typeof ratio.y === "string" ? parseFloat(ratio.y) : ratio.y;
      return x / y;
    }
    return aspectRatio || 1;
  };

  // 최종 크기 계산
  const getComputedSize = () => {
    const computedRatio = calculateRatio();
    let computedWidth: any = width;
    let computedHeight: any = height;

    // 너비가 퍼센트 문자열인 경우, 화면 크기에 비례하여 계산
    if (typeof width === "string" && width.includes("%")) {
      const percentage = parseFloat(width) / 100;
      computedWidth = screenWidth * percentage;
    }

    // 너비만 있는 경우, 비율로 높이 계산
    if (computedWidth && !computedHeight) {
      computedHeight =
        typeof computedWidth === "number"
          ? computedWidth / computedRatio
          : undefined;
    }
    // 높이만 있는 경우, 비율로 너비 계산
    else if (!computedWidth && computedHeight) {
      computedWidth =
        typeof computedHeight === "number"
          ? computedHeight * computedRatio
          : undefined;
    }

    return {
      width: computedWidth || undefined,
      height: computedHeight || undefined,
      aspectRatio:
        !computedWidth || !computedHeight ? computedRatio : undefined,
    };
  };

  if (!imageSource || isLoading) {
    return (
      <View
        style={[
          styles.placeholder,
          { width: width || 100, height: height || 100 } as ViewStyle,
        ]}
      />
    );
  }

  const sizeStyle = getComputedSize();

  return (
    <RNImage
      source={imageSource}
      style={[sizeStyle as ImageStyle, style]}
      resizeMode={resizeMode}
      onLoad={() => onLoad?.()}
      onError={(e) => onError?.(e)}
      {...(props as any)}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#f0f0f0",
  },
});

export default Image;
