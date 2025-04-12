import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: number;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: User[];
  createdBy: number;
  lastMessage?: Message;
  createdAt: number;
}

interface ChatContextType {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messages: Record<string, Message[]>;
  users: User[];

  createRoom: (name: string, participants: User[]) => Promise<string>;
  sendMessage: (roomId: string, text: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  inviteToRoom: (roomId: string, userIds: number[]) => Promise<void>;
  fetchUsers: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  rooms: [],
  currentRoom: null,
  messages: {},
  users: [],

  createRoom: async () => "",
  sendMessage: async () => {},
  joinRoom: async () => {},
  leaveRoom: async () => {},
  inviteToRoom: async () => {},
  fetchUsers: async () => {},
});

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [users, setUsers] = useState<User[]>([]);

  // Load chat data from storage when user logs in
  useEffect(() => {
    if (user) {
      loadChatData();
      fetchUsers();
    }
  }, [user]);

  const loadChatData = async () => {
    try {
      const roomsData = await AsyncStorage.getItem("@chat_rooms");
      const messagesData = await AsyncStorage.getItem("@chat_messages");

      if (roomsData) {
        setRooms(JSON.parse(roomsData));
      }

      if (messagesData) {
        setMessages(JSON.parse(messagesData));
      }
    } catch (error) {
      console.error("채팅 데이터 로드 중 오류:", error);
    }
  };

  const saveChatData = async () => {
    try {
      await AsyncStorage.setItem("@chat_rooms", JSON.stringify(rooms));
      await AsyncStorage.setItem("@chat_messages", JSON.stringify(messages));
    } catch (error) {
      console.error("채팅 데이터 저장 중 오류:", error);
    }
  };

  // Mock implementation of fetching users
  const fetchUsers = async () => {
    // In a real app, this would be an API call
    const mockUsers: User[] = [
      { id: 2, name: "홍길동", email: "hong@example.com" },
      { id: 3, name: "김철수", email: "kim@example.com" },
      { id: 4, name: "이영희", email: "lee@example.com" },
      { id: 5, name: "박지훈", email: "park@example.com" },
      { id: 6, name: "최민지", email: "choi@example.com" },
    ];

    // Add the current user to the list if logged in
    if (user) {
      const currentUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      console.log("ChatProvider: 현재 사용자 정보", currentUser);

      // Check if user is already in the list (avoid duplicates)
      if (!mockUsers.some((u) => u.id === currentUser.id)) {
        mockUsers.unshift(currentUser); // Add current user at the beginning
      }
    }

    setUsers(mockUsers);
  };

  const createRoom = async (
    name: string,
    participants: User[]
  ): Promise<string> => {
    if (!user) throw new Error("로그인이 필요합니다");

    // Create a new room with the current user as creator and participant
    const currentUser = { id: user.id, name: user.name, email: user.email };
    const allParticipants = [...participants];

    // Add current user if not already in participants
    if (!allParticipants.some((p) => p.id === currentUser.id)) {
      allParticipants.push(currentUser);
    }

    const roomId = `room_${Date.now()}`;
    const newRoom: ChatRoom = {
      id: roomId,
      name,
      participants: allParticipants,
      createdBy: user.id,
      createdAt: Date.now(),
    };

    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    setCurrentRoom(newRoom);

    // Initialize empty messages array for this room
    setMessages((prev) => ({
      ...prev,
      [roomId]: [],
    }));

    await saveChatData();
    return roomId;
  };

  const sendMessage = async (roomId: string, text: string) => {
    if (!user) throw new Error("로그인이 필요합니다");

    const messageId = `msg_${Date.now()}`;
    const newMessage: Message = {
      id: messageId,
      roomId,
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp: Date.now(),
    };

    // Add message to the specific room
    const roomMessages = messages[roomId] || [];
    const updatedRoomMessages = [...roomMessages, newMessage];

    setMessages((prev) => ({
      ...prev,
      [roomId]: updatedRoomMessages,
    }));

    // Update the last message in the room
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, lastMessage: newMessage } : room
      )
    );

    await saveChatData();
  };

  const joinRoom = async (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setCurrentRoom(room);
    }
  };

  const leaveRoom = async (roomId: string) => {
    if (!user) return;

    // Remove the room from the user's room list
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms(updatedRooms);

    if (currentRoom?.id === roomId) {
      setCurrentRoom(null);
    }

    await saveChatData();
  };

  const inviteToRoom = async (roomId: string, userIds: number[]) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const newParticipants = users.filter(
      (u) =>
        userIds.includes(u.id) && !room.participants.some((p) => p.id === u.id)
    );

    if (newParticipants.length === 0) return;

    const updatedRoom = {
      ...room,
      participants: [...room.participants, ...newParticipants],
    };

    setRooms((prev) => prev.map((r) => (r.id === roomId ? updatedRoom : r)));

    if (currentRoom?.id === roomId) {
      setCurrentRoom(updatedRoom);
    }

    await saveChatData();
  };

  return (
    <ChatContext.Provider
      value={{
        rooms,
        currentRoom,
        messages,
        users,
        createRoom,
        sendMessage,
        joinRoom,
        leaveRoom,
        inviteToRoom,
        fetchUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat는 ChatProvider 내부에서만 사용할 수 있습니다");
  }
  return context;
}

export default ChatProvider;
