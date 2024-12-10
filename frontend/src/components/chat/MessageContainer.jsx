import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2, Send, Image as ImageIcon, Menu, Smile } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';

const MessageContainer = ({ onOpenSidebar }) => {
  const { messages, selectedUser, getMessages, sendMessage, isMessagesLoading } = useChatStore();
  const { authUser } = useAuthStore();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 点击外部关闭 emoji 选择器
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    const formData = {
      text: message,
      image: image,
    };

    await sendMessage(formData);
    setMessage("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-none p-4 border-b border-base-200 flex items-center gap-4 bg-base-100 md:hidden">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 hover:bg-base-200 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center bg-base-200/50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to Chat!</h2>
            <p className="text-base-content/60">Select a user to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - 固定在顶部 */}
      <div className="flex-none p-4 border-b border-base-200 flex items-center gap-4 bg-base-100">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 -ml-2 hover:bg-base-200 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={selectedUser.profilePic || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                alt={selectedUser.fullName}
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">{selectedUser.fullName}</h3>
          </div>
        </div>
      </div>

      {/* Messages - 固定高度的可滚动区域 */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto">
          <div className="p-4 space-y-4">
            {isMessagesLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === authUser._id;
                  return (
                    <div
                      key={message._id}
                      className={`flex items-end gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="avatar flex-none">
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={
                              isOwnMessage
                                ? authUser.profilePic || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                : selectedUser.profilePic || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                            }
                            alt="avatar"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className={`flex flex-col gap-1 max-w-[70%]`}>
                        {message.text && (
                          <div
                            className={`px-4 py-2 rounded-2xl break-words ${
                              isOwnMessage
                                ? "bg-primary text-primary-content rounded-br-none"
                                : "bg-base-200 text-base-content rounded-bl-none"
                            }`}
                          >
                            {message.text}
                          </div>
                        )}
                        {message.image && (
                          <img
                            src={message.image}
                            alt="message"
                            className="max-w-full rounded-lg"
                          />
                        )}
                        <span className={`text-xs text-base-content/60 ${isOwnMessage ? "text-right" : "text-left"}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Input - 固定在底部 */}
      <div className="flex-none p-4 border-t border-base-200 bg-base-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="input input-bordered w-full"
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="btn btn-circle btn-ghost"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-0 mb-2"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={400}
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-circle btn-ghost"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          <button type="submit" className="btn btn-circle btn-primary">
            <Send className="w-5 h-5" />
          </button>
        </form>
        {image && (
          <div className="mt-2 relative w-40">
            <img
              src={image}
              alt="Selected"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              onClick={() => setImage(null)}
              className="btn btn-circle btn-xs absolute top-1 right-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
