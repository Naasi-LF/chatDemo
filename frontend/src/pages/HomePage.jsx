import React, { useState } from 'react'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className="flex h-full">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 min-w-0">
          <MessageContainer 
            onOpenSidebar={() => setIsSidebarOpen(true)} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
