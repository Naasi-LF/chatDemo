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
      const users = res.data;
      
      // 为每个用户获取最后一条消息
      const usersWithLastMessage = await Promise.all(
        users.map(async (user) => {
          try {
            const messagesRes = await axiosInstance.get(`/messages/${user._id}`);
            const messages = messagesRes.data;
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            return { ...user, lastMessage };
          } catch (error) {
            console.error(`Error fetching messages for user ${user._id}:`, error);
            return user;
          }
        })
      );

      // 根据最后一条消息的时间对用户列表进行排序
      const sortedUsers = usersWithLastMessage.sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return timeB - timeA; // 最新消息的用户排在前面
      });

      set({ users: sortedUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
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
    
    // 取消之前的消息订阅
    if (prevUser) {
      get().unsubscribeFromMessages();
    }
    
    // 如果选中了新用户，获取消息并订阅
    if (user) {
      try {
        const res = await axiosInstance.get(`/messages/${user._id}`);
        set({ messages: res.data });
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching messages");
        set({ messages: [] });
      }
      get().subscribeToMessages();
    }
  },

  updateLastMessage: (message) => {
    const { users } = get();
    const updatedUsers = users.map(user => {
      if (user._id === message.senderId || user._id === message.receiverId) {
        return { ...user, lastMessage: message };
      }
      return user;
    });
    
    // 根据最后一条消息的时间对用户列表进行排序
    const sortedUsers = updatedUsers.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA; // 最新消息的用户排在前面
    });
    
    set({ users: sortedUsers });
  },
}));