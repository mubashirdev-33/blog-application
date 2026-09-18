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

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loginHandler = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const response = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      if (response.user) {
        toast.success("Login successfully");

        setForm({
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid Credentials!");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email");
      } else if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please signup first");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Wrong password");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogleHandler = async () => {
    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      const response = await signInWithPopup(auth, provider);

      if (response.user) {
        await saveData("", response.user);

        toast.success("Login successfully!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-2">
              Login to your blog account
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <Input
              type={"email"}
              placeholder={"Enter your email"}
              name={"email"}
              handler={handleInputChange}
              value={form.email}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <Input
              type={"password"}
              placeholder={"Enter your password"}
              name={"password"}
              handler={handleInputChange}
              value={form.password}
            />
          </div>

          <div className="text-right mb-6">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            onClick={signupWithGoogleHandler}
            type="button"
            disabled={googleLoading || loading}
            className="w-full mb-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            {googleLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login with Google"
            )}
          </button>

          <button
            onClick={loginHandler}
            type="button"
            disabled={loading || googleLoading}
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

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
      </div>
    </>
  );
};

export default Login;