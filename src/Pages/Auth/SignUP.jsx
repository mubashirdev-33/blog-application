import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import Input from "../../components/Input";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const signupHandler = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      return toast.error("Please fill all fields");
    }

    try {
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
        return toast.error("Email already exists!");
      }

      if (error.code === "auth/invalid-email") {
        return toast.error("Please enter a valid email");
      }

      if (error.code === "auth/weak-password") {
        return toast.error("Password must be at least 6 characters");
      }

      toast.error(error.message);
    }
  };

  const signupWithGoogleHandler = async () => {
    try {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
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
          className="w-full mb-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Sign Up with Google
        </button>

        <button
          type="button"
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          onClick={signupHandler}
        >
          Sign Up
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