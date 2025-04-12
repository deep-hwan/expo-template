import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { Spacing, Text } from "@/app/src/@widgets/display";
import { V } from "@/app/src/@widgets/flex/V";
import { User, useChat } from "@/app/src/providers/ChatProvider";
import { useRouter } from "@/app/src/providers/RouterProvider";
import { colors } from "@/app/src/themes/colors";

export default function InviteScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const { users, rooms, currentRoom, inviteToRoom } = useChat();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // 현재 채팅방에 없는 사용자만 표시
  const availableUsers = users.filter(
    (user) => !currentRoom?.participants.some((p) => p.id === user.id)
  );

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleInvite = async () => {
    if (!roomId) {
      Alert.alert("오류", "채팅방 정보를 찾을 수 없습니다.");
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert("알림", "초대할 사용자를 선택해주세요.");
      return;
    }

    try {
      await inviteToRoom(
        roomId,
        selectedUsers.map((u) => u.id)
      );
      Alert.alert("알림", "사용자를 채팅방에 초대했습니다.");
      router.back();
    } catch (error) {
      Alert.alert("오류", "사용자 초대에 실패했습니다.");
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
          채팅방에 초대하기
        </Text>

        <Spacing size={8} />

        <Text size={14} color={colors.grey[400]}>
          {currentRoom?.name || ""}
        </Text>

        <Spacing size={20} />

        <Text size={16} weight="medium" color={colors.grey[500]}>
          초대할 사용자 선택 ({selectedUsers.length}명)
        </Text>

        <Spacing size={8} />

        {availableUsers.length === 0 ? (
          <V.Column padding={{ vertical: 40 }} align="center">
            <Text size={16} color={colors.grey[400]}>
              초대할 수 있는 사용자가 없습니다.
            </Text>
          </V.Column>
        ) : (
          <FlatList
            data={availableUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <V.Column padding={{ vertical: 16 }}>
          <TouchableOpacity
            style={[
              styles.inviteButton,
              !roomId || selectedUsers.length === 0
                ? styles.disabledButton
                : null,
            ]}
            onPress={handleInvite}
            disabled={!roomId || selectedUsers.length === 0}
          >
            <Text size={16} weight="medium" color={colors.white}>
              초대하기
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
  inviteButton: {
    backgroundColor: colors.keyColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: colors.grey[300],
  },
});
