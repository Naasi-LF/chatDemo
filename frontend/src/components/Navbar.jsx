import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageCircle, Settings, User } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 border-b border-base-200">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          <MessageCircle className="w-6 h-6" />
          <span className="ml-2">ChatDemo</span>
        </Link>
      </div>

      <div className="navbar-end">
        {authUser ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img
                    alt="user avatar"
                    src={authUser.profilePic || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                  />
                </div>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link to="/profile" className="flex items-center gap-2 text-base font-medium">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className="flex items-center gap-2 text-base font-medium">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </li>
              <div className="divider my-0"></div>
              <li>
                <button onClick={logout} className="flex items-center gap-2 text-base font-medium text-error">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
