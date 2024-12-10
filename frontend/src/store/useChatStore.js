import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  updateLastMessage: (message) => {
    const { users } = get();
    const updatedUsers = users.map(user => {
      if (user._id === message.senderId || user._id === message.receiverId) {
        const currentLastMessage = user.lastMessage;
        // 只有当新消息的时间比当前最后一条消息新时才更新
        if (!currentLastMessage || new Date(message.createdAt) > new Date(currentLastMessage.createdAt)) {
          return { ...user, lastMessage: message };
        }
      }
      return user;
    });
    set({ users: updatedUsers });
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      console.log("Send message response:", res.data); // 添加调试日志
      set({ messages: [...messages, res.data] });
      get().updateLastMessage(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (message) => {
      console.log("New message received:", message); // 添加调试日志
      const { messages, selectedUser } = get();
      if (message.senderId === selectedUser._id || message.receiverId === selectedUser._id) {
        set({ messages: [...messages, message] });
      }
      get().updateLastMessage(message);
    });

    socket.on("messageUpdate", (updatedMessage) => {
      console.log("Message update received:", updatedMessage); // 添加调试日志
      const { messages } = get();
      const updatedMessages = messages.map((msg) =>
        msg._id === updatedMessage._id ? updatedMessage : msg
      );
      set({ messages: updatedMessages });
      get().updateLastMessage(updatedMessage);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messageUpdate");
  },

  setSelectedUser: async (user) => {
    const prevUser = get().selectedUser;
    set({ selectedUser: user });
    
    // 如果之前有选中的用户，先取消订阅
    if (prevUser) {
      get().unsubscribeFromMessages();
    }
    
    // 如果选中了新用户，获取消息并订阅
    if (user) {
      try {
        const res = await axiosInstance.get(`/messages/${user._id}`);
        set({ messages: res.data });
        // 如果有消息，更新最后一条消息
        if (res.data.length > 0) {
          const lastMessage = res.data[res.data.length - 1];
          get().updateLastMessage(lastMessage);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching messages");
        set({ messages: [] });
      }
      get().subscribeToMessages();
    }
  },
}));