import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Spacing, Text } from "@/app/src/@widgets/display";
import { V } from "@/app/src/@widgets/flex/V";
import { User, useChat } from "@/app/src/providers/ChatProvider";
import { useRouter } from "@/app/src/providers/RouterProvider";
import { colors } from "@/app/src/themes/colors";

export default function CreateChatScreen() {
  const router = useRouter();
  const { users, createRoom } = useChat();
  const [roomName, setRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

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
      router.back();
    } catch (error) {
      Alert.alert("오류", "채팅방 생성에 실패했습니다.");
    }
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.some((u) => u.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected ? styles.selectedUserItem : null]}
        onPress={() => toggleUserSelection(item)}
      >
        <V.Column flex={1}>
          <Text
            size={16}
            weight="medium"
            color={isSelected ? colors.white : colors.textColor}
          >
            {item.name}
          </Text>
          <Spacing size={4} />
          <Text size={14} color={isSelected ? colors.white : colors.grey[400]}>
            {item.email}
          </Text>
        </V.Column>
        {isSelected && (
          <V.Column
            width={24}
            height={24}
            align="center"
            backgroundColor={colors.white}
            borderRadius={12}
          >
            <Text size={14} weight="bold" color={colors.keyColor}>
              ✓
            </Text>
          </V.Column>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <V.Column flex={1} backgroundColor={colors.white}>
      <V.Column padding={{ horizontal: 16, top: 16 }} flex={1}>
        <Text size={20} weight="bold" color={colors.textColor}>
          새 채팅방 만들기
        </Text>

        <Spacing size={20} />

        <Text size={16} weight="medium" color={colors.grey[500]}>
          채팅방 이름
        </Text>
        <Spacing size={8} />
        <TextInput
          style={styles.input}
          placeholder="채팅방 이름을 입력하세요"
          value={roomName}
          onChangeText={setRoomName}
          placeholderTextColor={colors.grey[300]}
        />

        <Spacing size={20} />

        <Text size={16} weight="medium" color={colors.grey[500]}>
          참여자 선택 ({selectedUsers.length}명)
        </Text>
        <Spacing size={8} />

        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <V.Column padding={{ vertical: 16 }}>
          <TouchableOpacity
            style={[
              styles.createButton,
              !roomName.trim() || selectedUsers.length === 0
                ? styles.disabledButton
                : null,
            ]}
            onPress={handleCreateRoom}
            disabled={!roomName.trim() || selectedUsers.length === 0}
          >
            <Text size={16} weight="medium" color={colors.white}>
              채팅방 만들기
            </Text>
          </TouchableOpacity>
        </V.Column>
      </V.Column>
    </V.Column>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.chiffon[100],
  },
  selectedUserItem: {
    backgroundColor: colors.blue[500],
  },
  input: {
    backgroundColor: colors.chiffon[100],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textColor,
    borderWidth: 1,
    borderColor: colors.chiffon[300],
  },
  createButton: {
    backgroundColor: colors.keyColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: colors.grey[300],
  },
});
