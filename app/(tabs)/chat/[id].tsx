import { Spacing, Text } from "@/app/src/@widgets/display";
import { V } from "@/app/src/@widgets/flex/V";
import { useAuth } from "@/app/src/providers/AuthProvider";
import { Message, useChat } from "@/app/src/providers/ChatProvider";
import { useRouter } from "@/app/src/providers/RouterProvider";
import { colors } from "@/app/src/themes/colors";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const {
    rooms,
    messages,
    currentRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
    inviteToRoom,
  } = useChat();
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  // 로컬 변수 정의
  const roomMessages = id ? messages[id] || [] : [];
  // 역순으로 메시지 정렬 (최신 메시지가 아래에 표시되도록)
  const reversedMessages = [...roomMessages].reverse();

  // 채팅방 참여
  useEffect(() => {
    if (id) {
      joinRoom(id);
    }
  }, [id]);

  // 메시지 목록 초기 스크롤 설정
  useEffect(() => {
    if (roomMessages.length > 0) {
      // inverted 리스트이므로 초기 스크롤은 자동으로 설정됨
      // 하지만 추가적인 레이아웃 이슈를 방지하기 위해 타이머 설정
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToOffset({ offset: 0, animated: false });
        }
      }, 100);
    }
  }, [roomMessages.length]);

  if (!currentRoom || !id) {
    return (
      <V.Column flex={1} align="center" justify="center">
        <Text>채팅방을 찾을 수 없습니다.</Text>
      </V.Column>
    );
  }

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage(id, text.trim());
    setText("");
  };

  const handleInvite = () => {
    router.push({
      pathname: "/(tabs)/chat/invite",
      params: { roomId: id },
    });
  };

  const handleLeave = async () => {
    Alert.alert("채팅방 나가기", "정말로 이 채팅방을 나가시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "나가기",
        style: "destructive",
        onPress: async () => {
          await leaveRoom(id);
          router.back();
        },
      },
    ]);
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {!isMyMessage && (
          <Text size={12} color={colors.grey[500]} style={styles.senderName}>
            {item.senderName}
          </Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            color={isMyMessage ? colors.white : colors.textColor}
            style={styles.messageText}
          >
            {item.text}
          </Text>
        </View>
        <Text size={10} color={colors.grey[400]} style={styles.messageTime}>
          {messageTime}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "padding" })}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
    >
      <V.Column flex={1} backgroundColor={colors.white}>
        {/* 헤더 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <V.Column
            padding={{ horizontal: 16, top: 16 }}
            backgroundColor={colors.white}
            style={styles.header}
          >
            <Text size={18} weight="bold" color={colors.textColor}>
              {currentRoom.name}
            </Text>

            <Spacing size={4} />

            <Text size={14} color={colors.grey[400]}>
              참여자: {currentRoom.participants.length}명
            </Text>

            <V.Row padding={{ vertical: 8 }}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleInvite}
              >
                <Text size={12} color={colors.keyColor}>
                  초대하기
                </Text>
              </TouchableOpacity>

              <Spacing direction="row" size={8} />

              <TouchableOpacity
                style={[styles.actionButton, styles.leaveButton]}
                onPress={handleLeave}
              >
                <Text size={12} color={colors.red[500]}>
                  나가기
                </Text>
              </TouchableOpacity>
            </V.Row>
          </V.Column>
        </TouchableWithoutFeedback>

        {/* 메시지 목록 - 역순으로 표시 */}
        <FlatList
          ref={listRef}
          data={reversedMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          style={styles.flatListContainer}
          inverted={true} // 역순 스크롤 (최신 메시지가 아래에 표시됨)
          keyboardShouldPersistTaps="handled" // 스크롤 중 키보드 유지
          keyboardDismissMode="interactive" // 스크롤 시 키보드가 자연스럽게 사라짐
          showsVerticalScrollIndicator={false}
          initialNumToRender={20} // 초기 렌더링 개수 증가
          maxToRenderPerBatch={10} // 배치당 렌더링 개수
          windowSize={10} // 렌더링 윈도우 크기
          scrollEnabled={true} // 스크롤 명시적 활성화
          bounces={true} // 스크롤 바운스 효과 활성화
          onLayout={() => {
            // 레이아웃 초기화 시 스크롤 위치 설정
            if (listRef.current) {
              listRef.current.scrollToOffset({ offset: 0, animated: false });
            }
          }}
        />

        {/* 입력 영역 - 터치했을 때 키보드 닫히지 않도록 함 */}
        <TouchableWithoutFeedback onPress={() => null}>
          <V.Row
            padding={{ vertical: 8, horizontal: 16 }}
            backgroundColor={colors.white}
            style={styles.inputContainer}
          >
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="메시지를 입력하세요..."
              value={text}
              onChangeText={setText}
              multiline
              returnKeyType="send"
              onSubmitEditing={text.trim() ? handleSend : undefined}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !text.trim() ? styles.disabledSendButton : null,
              ]}
              onPress={handleSend}
              disabled={!text.trim()}
            >
              <Text size={14} weight="bold" color={colors.white}>
                전송
              </Text>
            </TouchableOpacity>
          </V.Row>
        </TouchableWithoutFeedback>
      </V.Column>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.chiffon[300],
    zIndex: 10,
  },
  flatListContainer: {
    flex: 1,
    marginTop: 8, // 헤더와의 간격 추가
  },
  messagesList: {
    padding: 16,
    paddingTop: 8, // 상단 여백 줄임
    paddingBottom: 16, // 하단 여백 유지
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  senderName: {
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: colors.keyColor,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.chiffon[200],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
  },
  messageTime: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.chiffon[300],
    zIndex: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.chiffon[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: colors.keyColor,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    backgroundColor: colors.grey[300],
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.keyColor,
  },
  leaveButton: {
    borderColor: colors.red[500],
  },
});
