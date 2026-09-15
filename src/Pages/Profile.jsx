import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarMonth,
  Edit,
  CameraAlt,
  Close,
} from "@mui/icons-material";

import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/config.js";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    location: "",
    bio: "",
  });

  const fileInputRef = useRef(null);

  const handleEdit = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      profession: user.profession || "",
      location: user.location || "",
      bio: user.bio || "",
    });

    setImage(user.photoURL || "");
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const getCurrentUser = async (currentUser) => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "users"),
        where("email", "==", currentUser.email)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        setUser(userData);
        setImage(userData.photoURL || "");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];

        await updateDoc(userDoc.ref, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          profession: form.profession,
          location: form.location,
          bio: form.bio,
        });

        setUser({
          ...user,
          name: form.name,
          email: form.email,
          phone: form.phone,
          profession: form.profession,
          location: form.location,
          bio: form.bio,
        });

        setOpen(false);

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getCurrentUser(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar  userimg={user?.photoURL ? user.photoURL : user?.name ? user.name.charAt(0).toUpperCase() : ""} />

      {loading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : user ? (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">

              <Avatar
                src={user.photoURL || ""}
                sx={{
                  width: 110,
                  height: 110,
                  fontSize: "42px",
                  backgroundColor: "#4f46e5",
                }}
              >
                {!user.photoURL && user.name
                  ? user.name.charAt(0).toUpperCase()
                  : ""}
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-slate-800">
                  {user.name || "User"}
                </h1>

                <p className="text-slate-500 mt-1">
                  {user.email}
                </p>

                <p className="text-indigo-600 mt-2">
                  {user.profession || "Frontend Developer"}
                </p>
              </div>

              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>

            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-5">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="flex items-center gap-3">
                <Person className="text-indigo-600" />
                <div>
                  <p className="text-sm text-slate-400">Full Name</p>
                  <p className="text-slate-700">
                    {user.name || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Email className="text-indigo-600" />
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-slate-700">
                    {user.email || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-indigo-600" />
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="text-slate-700">
                    {user.phone || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Work className="text-indigo-600" />
                <div>
                  <p className="text-sm text-slate-400">Profession</p>
                  <p className="text-slate-700">
                    {user.profession || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LocationOn className="text-indigo-600" />
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-slate-700">
                    {user.location || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarMonth className="text-indigo-600" />
                <div>
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="text-slate-700">
                    {user.createdAt && user.createdAt.toDate
                      ? user.createdAt.toDate().toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* About Me */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              About Me
            </h2>

            <p className="text-slate-600 leading-7">
              {user.bio || "No biography added yet."}
            </p>
          </div>

          {/* Profile Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Profile Status
            </h2>

            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700">
              {user.active ? "Active" : "Inactive"}
            </span>
          </div>

        </main>
      ) : (
        <div className="min-h-[80vh] flex items-center justify-center">
          <p className="text-slate-500">
            User not found
          </p>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
          }}
        >

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              Edit Profile
            </h2>

            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-5">
            <div className="relative">

              <Avatar
                src={image || ""}
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: "38px",
                  backgroundColor: "#4f46e5",
                }}
              >
                {!image && form.name
                  ? form.name.charAt(0).toUpperCase()
                  : ""}
              </Avatar>

              <IconButton
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0"
                sx={{
                  backgroundColor: "#fff",
                  boxShadow: 2,
                }}
              >
                <CameraAlt />
              </IconButton>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>
          </div>

          <div className="flex flex-col gap-4">

            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Profession"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Biography"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
            >
              Save Changes
            </Button>

          </div>

        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Profile;