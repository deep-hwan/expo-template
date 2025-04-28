import React, { useRef, useState } from "react";
import { Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function KeyboardAwareView({
  children,
  extraHeight = 20,
  keyboardOpenScrollEnabled = false,
}: {
  children: React.ReactNode;
  extraHeight?: number;
  keyboardOpenScrollEnabled?: boolean;
}) {
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      enableOnAndroid={true}
      extraScrollHeight={extraHeight}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      enableAutomaticScroll={true}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardDismissMode="interactive"
      style={{ flex: 1 }}
      scrollEnabled={keyboardOpenScrollEnabled ? true : !isKeyboardVisible}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
