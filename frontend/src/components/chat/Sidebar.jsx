import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2 } from "lucide-react";

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    console.log("Current users:", users);
  }, [users]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-base-200">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isUsersLoading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {users.map((user) => {
              console.log("Rendering user:", user.fullName, "lastMessage:", user.lastMessage);
              
              return (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center p-2 rounded-lg hover:bg-base-200 transition-all ${
                    selectedUser?._id === user._id ? "bg-base-200" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img 
                          src={user.profilePic || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} 
                          alt={user.fullName}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <span 
                      className={`absolute -right-1 top-0 w-4 h-4 rounded-full border-[3px] border-base-100 shadow-md ${
                        onlineUsers.includes(user._id) 
                          ? "bg-success animate-pulse" 
                          : "bg-error"
                      }`}
                    ></span>
                  </div>
                  <div className="flex-1 min-w-0 ml-5 text-left">
                    <span className="font-semibold text-lg tracking-wide truncate">{user.fullName}</span>
                    {user.lastMessage && (
                      <p className="text-sm text-base-content/70 truncate mt-0.5">
                        {user.lastMessage.image ? "Sent an image" : user.lastMessage.text}
                      </p>
                    )}
                  </div>
                  {user.lastMessage && (
                    <div className="text-xs text-base-content/60 ml-2 whitespace-nowrap">
                      {new Date(user.lastMessage.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
