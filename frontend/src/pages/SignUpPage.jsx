import React from 'react';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import AuthLayout from "../components/auth/AuthLayout";
import { Loader2 } from "lucide-react";

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
    navigate("/");
  };

  return (
    <AuthLayout title="Create an Account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="label-text mb-2 inline-block">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-100"
            required
          />
        </div>

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
            minLength={6}
          />
          <p className="text-xs text-base-content/60 mt-1">
            Password must be at least 6 characters
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={isSigningUp}
        >
          {isSigningUp ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-center text-sm mt-4 text-base-content/70">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary font-medium">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;