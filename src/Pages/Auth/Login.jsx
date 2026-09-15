import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/config.js";
import { ToastContainer, toast } from "react-toastify";
import { saveData } from "./SignUP.jsx";
import Navbar from "../../components/Navbar.jsx";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const loginHandler = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      return toast.error("Please fill all fields");
    }
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      if (response.user) {
        toast.success("Login successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      if (
        error.message == "Firebase: Error (auth/invalid-credential)." ||
        error.code == "auth/invalid-credential"
      ) {
        return toast.error("Invalid Credentials!");
      }
    }
  };
  const signupWithGoogleHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      let response = await signInWithPopup(auth, provider);
      if (response.user) {
        saveData("", response.user);
        toast.success("Login successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
  <>
  <Navbar/>
   <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to your blog account</p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type={"email"}
            placeholder={"Enter your email"}
            name={"email"}
            handler={handleInputChange}
            value={form.username}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <Input
            type={"password"}
            placeholder={"Enter your password"}
            name={"password"}
            handler={handleInputChange}
            value={form.username}
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

{/* google */}
<button onClick={signupWithGoogleHandler}
          type="button"
          className="w-full mb-3  cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          
        >
         Login with Google
        </button>

        {/* Login */}
        <button
          onClick={loginHandler}
          type="button"
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login
        </button>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to={"/signup"}>
            <button
              type="button"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create Account
            </button>
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div></> 
  );
};

export default Login;
