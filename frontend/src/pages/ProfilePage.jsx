import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isCheckingAuth, updateProfile, isUpdatingProfile } = useAuthStore();
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate("/login");
    }
  }, [authUser, isCheckingAuth, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewImage) return;

    await updateProfile({ profilePic: previewImage });
    setPreviewImage(null);
  };

  if (isCheckingAuth || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto bg-base-100 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    previewImage ||
                    authUser.profilePic ||
                    "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  }
                  alt={authUser.fullName}
                />
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-circle btn-sm absolute bottom-0 right-0"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>

          {previewImage && (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile Picture"
                )}
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="divider"></div>

          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5" />
              <span className="font-medium">Full Name</span>
            </div>
            <p className="text-base-content/70">{authUser.fullName}</p>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <span className="font-medium">Email</span>
            </div>
            <p className="text-base-content/70">{authUser.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;