"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic frontend validation (more detailed validation will be added in T023)
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // Frontend validation for username
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (username.length < 3 || username.length > 20 || !usernameRegex.test(username)) {
      setError("Username must be 3-20 alphanumeric characters.");
      return;
    }

    // Frontend validation for password complexity
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain a lowercase letter.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain an uppercase letter.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must contain a digit.");
      return;
    }
    if (!/[@$!%*?&]/.test(password)) {
      setError("Password must contain a special character (@$!%*?&).");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Registration failed.";
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg).join(", ");
          } else {
            errorMessage = errorData.detail;
          }
        }
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      router.push("/"); // Redirect to dashboard on successful registration
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join TaskMaster today</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 animate-pulse">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 transform"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-green-600 hover:text-green-500 hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
