import React from 'react';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import AuthLayout from "../components/auth/AuthLayout";
import { Loader2 } from "lucide-react";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    navigate("/");
  };

  return (
    <AuthLayout title="Welcome Back!">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="label-text mb-2 inline-block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-100"
            required
          />
        </div>

        <div>
          <label className="label-text mb-2 inline-block">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-100"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm mt-4 text-base-content/70">
          Don't have an account?{" "}
          <Link to="/signup" className="link link-primary font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;