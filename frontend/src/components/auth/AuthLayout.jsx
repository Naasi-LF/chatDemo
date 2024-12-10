import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* 左侧装饰区域 */}
      <div className="hidden md:flex flex-col items-center justify-center bg-primary text-primary-content p-8">
        <MessageCircle className="w-16 h-16 mb-6" />
        <h1 className="text-4xl font-bold mb-4">CIT Chat App</h1>
        <p className="text-lg text-center max-w-md opacity-90">
          22030531 XiCheng Yang <br /> teacher: Mr Li
        </p>
      </div>

      {/* 右侧表单区域 */}
      <div className="flex items-center justify-center p-4 bg-base-200">
        <div className="w-full max-w-sm">
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center md:hidden mb-6">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
