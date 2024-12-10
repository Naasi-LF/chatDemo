import React from 'react'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/chat/Sidebar";
import MessageContainer from "../components/chat/MessageContainer";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate("/login");
    }
  }, [authUser, isCheckingAuth, navigate]);

  useEffect(() => {
    if (authUser) {
      subscribeToMessages();
      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [authUser, subscribeToMessages, unsubscribeFromMessages]);

  if (isCheckingAuth) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="w-80 border-r border-base-200 flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageContainer />
      </div>
    </div>
  );
};

export default HomePage;
