"use client";

import React, { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { apiRegister } from "@/services/apiService";
import { useSessionStore } from "@/stores/sessionStore";
import { AxiosError } from "axios"; // 1. Import AxiosError

// 2. Define the shape of the Laravel validation error response
interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>; // e.g., { email: ["The email has already been taken."] }
}

const RegisterPage = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Hooks
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);

  // Mutation for registering
  const registerMutation = useMutation({
    mutationFn: apiRegister,
    onSuccess: (data) => {
      // On success, save session and redirect
      toast.success("Registration successful!");
      setSession({ accessToken: data.token, role: data.user.type });
      router.push("/"); // Redirect to homepage
    },
    // 3. Type the error parameter explicitly
    onError: (
      error: AxiosError<LaravelValidationError | { message: string }>
    ) => {
      let errorMessage = "Registration failed. Please try again.";

      // Check if it's a response error and has data
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        // Check if it's a Laravel validation error (has 'errors' object)
        if ("errors" in errorData && errorData.errors) {
          // Get the first error message from the object
          errorMessage = Object.values(errorData.errors).flat()[0];
        }
        // Check if it's a general error message (has 'message' property)
        else if ("message" in errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        // Fallback for network errors or other issues
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  // Form submit handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Client-side password check
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match!");
      return;
    }

    registerMutation.mutate({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
