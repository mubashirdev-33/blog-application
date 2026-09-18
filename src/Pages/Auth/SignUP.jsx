import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../components/Input";
import { auth, db } from "../../firebase/config.js";

export const saveData = async (name = "", data) => {
  try {
    await setDoc(doc(db, "users", data.uid), {
      uid: data.uid,
      email: data.email,
      name: data.displayName ? data.displayName : name,
      photoURL: data.photoURL ? data.photoURL : "",
      role: "user",
      createdAt: serverTimestamp(),
      active: true,
    });
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const signupHandler = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const response = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      if (response.user) {
        await saveData(form.username, response.user);

        toast.success("Account created successfully");

        setForm({
          email: "",
          password: "",
          username: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists!");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters");
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

        toast.success("Account created successfully!");

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account and join our blog
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>

          <Input
            type={"text"}
            name={"username"}
            placeholder={"Enter username"}
            handler={handleInputChange}
            value={form.username}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <Input
            name={"email"}
            type={"email"}
            placeholder={"Enter your email"}
            handler={handleInputChange}
            value={form.email}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <Input
            name={"password"}
            type={"password"}
            placeholder={"Enter your password"}
            handler={handleInputChange}
            value={form.password}
          />
        </div>

        <button
          onClick={signupWithGoogleHandler}
          type="button"
          disabled={loading || googleLoading}
          className="w-full mb-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          {googleLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Signing up...
            </>
          ) : (
            "Sign Up with Google"
          )}
        </button>

        <button
          type="button"
          onClick={signupHandler}
          disabled={loading || googleLoading}
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to={"/login"}>
            <button
              type="button"
              className="cursor-pointer text-indigo-600 font-semibold hover:underline"
            >
              Login
            </button>
          </Link>
        </p>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;