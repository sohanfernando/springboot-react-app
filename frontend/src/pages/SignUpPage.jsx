import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCrown } from 'react-icons/fa';
import signupImage from '../assets/T-shirts/Women/5.webp';
import API from '../utils/axiosConfig';

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      setError("Please fix the errors below");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setFieldErrors({ password: "Password must be at least 6 characters" });
      setError("Please fix the errors below");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/users/signup", {
        name,
        email,
        password,
        role: "USER", // Always USER for regular signup
      });

      console.log("Signup successful:", response.data);
      
      // Auto-login after successful signup
      // First login to get the JWT token
      const loginResponse = await API.post("/users/login", {
        email,
        password,
      });

      login(loginResponse.data);
      navigate("/");
      
    } catch (err) {
      console.error("Signup error:", err);
      
      if (err.response?.status === 400 && err.response?.data?.errors) {
        // Handle validation errors
        setFieldErrors(err.response.data.errors);
        setError("Please fix the errors below");
      } else if (err.response?.status === 409) {
        setError("An account with this email already exists");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 pt-32">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 relative">
              <img
                src={signupImage}
                alt="Fashion Model"
                className="w-full h-[82vh] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Join FashionHub</h2>
                <p className="text-lg opacity-90">Create your account and start your fashion journey</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaUser className="text-white text-2xl" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h1>
                  <p className="text-gray-600">Create your FashionHub account</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-100 ${
                        fieldErrors.name 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-red-500'
                      }`}
                      disabled={loading}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-100 ${
                        fieldErrors.email 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-red-500'
                      }`}
                      disabled={loading}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-100 ${
                        fieldErrors.password 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-red-500'
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-100 ${
                        fieldErrors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-red-500'
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-4">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-red-500 hover:text-red-600 font-semibold transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <Link to="/admin-signup" className="hover:text-red-500 transition-colors">
                      Admin Signup
                    </Link>
                    <span>•</span>
                    <Link to="/aboutus" className="hover:text-red-500 transition-colors">
                      About Us
                    </Link>
                  </div>

                  {/* Terms and Privacy */}
                  <p className="text-xs text-gray-500 mt-6">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-red-500 hover:text-red-600">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-red-500 hover:text-red-600">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}