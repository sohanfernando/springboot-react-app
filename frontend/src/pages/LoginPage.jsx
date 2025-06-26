import React, { useState } from 'react'
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    setError("");

    try {
      // Replace "/api/login" with your actual backend endpoint
      const response = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });

      // Handle successful login (e.g., redirect or store token)
      console.log("Login successful:", response.data);
      alert("Login successful! Redirecting...");
      // Example: Redirect to dashboard
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
            required
            minLength="6"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 hover:scale-105 shadow-md ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginPage