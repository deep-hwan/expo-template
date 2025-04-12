import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Spacing, Text } from "@/app/src/@widgets/display";

import { V } from "@/app/src/@widgets/flex/V";
import { useAuth } from "@/app/src/providers/AuthProvider";
import { ChatRoom, User, useChat } from "@/app/src/providers/ChatProvider";
import { useRouter } from "@/app/src/providers/RouterProvider";
import { colors } from "@/app/src/themes/colors";

export default function ChatListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { rooms, createRoom, users } = useChat();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert("알림", "채팅방 이름을 입력해주세요.");
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert("알림", "최소 한 명 이상의 참여자를 선택해주세요.");
      return;
    }

    try {
      const roomId = await createRoom(roomName.trim(), selectedUsers);
      setIsCreatingRoom(false);
      setRoomName("");
      setSelectedUsers([]);
      router.push({
        pathname: "/(tabs)/chat/[id]",
        params: { id: roomId },
      });
    } catch (error) {
      Alert.alert("오류", "채팅방 생성에 실패했습니다.");
    }
  };

  const renderRoomItem = ({ item }: { item: ChatRoom }) => {
    const participantsText = item.participants
      .map((p) => p.name)
      .slice(0, 3)
      .join(", ");

    const extraParticipants =
      item.participants.length > 3
        ? ` 외 ${item.participants.length - 3}명`
        : "";

    return (
      <TouchableOpacity
        style={styles.roomItem}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/chat/[id]",
            params: { id: item.id },
          })
        }
      >
        <V.Column padding={{ horizontal: 15, vertical: 15 }} flex={1}>
          <V.Row justify="space-between" align="center">
            <Text size={16} weight="medium" color={colors.textColor}>
              {item.name}
            </Text>
            <Text size={12} color={colors.grey[300]}>
              {item.lastMessage
                ? new Date(item.lastMessage.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </V.Row>

          <Spacing size={6} />

          <Text size={14} color={colors.grey[400]} numberOfLines={1}>
            참여자: {participantsText}
            {extraParticipants}
          </Text>

          {item.lastMessage && (
            <>
              <Spacing size={6} />
              <Text size={14} color={colors.grey[500]} numberOfLines={1}>
                {item.lastMessage.senderName}: {item.lastMessage.text}
              </Text>
            </>
          )}
        </V.Column>
      </TouchableOpacity>
    );
  };

  return (
    <V.Column flex={1} backgroundColor={colors.white}>
      <V.Column padding={{ horizontal: 16, top: 16 }} flex={1}>
        <V.Row justify="space-between" align="center">
          <Text size={20} weight="bold" color={colors.textColor}>
            채팅
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/chat/create",
              })
            }
          >
            <Text size={14} weight="medium" color={colors.white}>
              새 채팅방
            </Text>
          </TouchableOpacity>
        </V.Row>

        <Spacing size={16} />

        {rooms.length === 0 ? (
          <V.Column flex={1} align="center" justify="center">
            <Text size={16} color={colors.grey[400]}>
              아직 채팅방이 없습니다.
            </Text>
            <Spacing size={12} />
            <Text size={14} color={colors.grey[300]}>
              새 채팅방을 만들어 대화를 시작해보세요.
            </Text>
          </V.Column>
        ) : (
          <FlatList
            data={rooms}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </V.Column>
    </V.Column>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  roomItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.chiffon[300],
    marginVertical: 8,
  },
  createButton: {
    backgroundColor: colors.keyColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
