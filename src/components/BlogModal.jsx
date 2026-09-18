import React, { useEffect, useState } from "react";
import { Modal, Box, Button, IconButton } from "@mui/material";
import { Close, Image } from "@mui/icons-material";
import Input from "../components/Input";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { uploadImageToCloudinary } from "../Cloudimg/cloudimage.js";
import { ToastContainer, toast } from "react-toastify";

const BlogModal = ({
  setBlog,
  editBlog,
  setEditBlog,
  onBlogUpdated,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    img: "",
  });

  useEffect(() => {
    if (editBlog) {
      setForm({
        title: editBlog.title || "",
        description: editBlog.description || "",
        img: "",
      });

      setOpen(true);
    }
  }, [editBlog]);

  const handleOpen = () => {
    setForm({
      title: "",
      description: "",
      img: "",
    });

    setOpen(true);
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setOpen(false);

    setForm({
      title: "",
      description: "",
      img: "",
    });

    if (setEditBlog) {
      setEditBlog(null);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveData = async (url, data) => {
    try {
      if (!auth.currentUser) {
        toast.error("Please login first");
        return null;
      }

      const userId = auth.currentUser.uid;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      let authorName = auth.currentUser.displayName || "User";
      let authorPhoto = auth.currentUser.photoURL || "";

      if (userDoc.exists()) {
        const userData = userDoc.data();

        authorName = userData.name || authorName;
        authorPhoto = userData.photoURL || authorPhoto;
      }

      const blogData = {
        blogImgUrl: url,
        title: data.title,
        description: data.description,
        authorId: userId,
        authorName: authorName,
        authorPhoto: authorPhoto,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "blogs"),
        blogData
      );

      return {
        id: docRef.id,
        ...blogData,
      };
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const createBlog = async () => {
    try {
      if (
        !form.title.trim() ||
        !form.description.trim() ||
        !form.img
      ) {
        toast.error("Please fill all fields");
        return;
      }

      setLoading(true);

      const imgURL = await uploadImageToCloudinary(form.img);

      const savedBlog = await saveData(imgURL, form);

      if (savedBlog) {
        setBlog((prev) => [...prev, savedBlog]);

        setForm({
          title: "",
          description: "",
          img: "",
        });

        setOpen(false);

        toast.success("Blog created successfully");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async () => {
    try {
      if (!editBlog) {
        return;
      }

      if (!form.title.trim() || !form.description.trim()) {
        toast.error("Please fill all fields");
        return;
      }

      if (!auth.currentUser) {
        toast.error("Please login first");
        return;
      }

      setLoading(true);

      const blogRef = doc(db, "blogs", editBlog.id);

      let imageURL = editBlog.blogImgUrl;

      if (form.img) {
        imageURL = await uploadImageToCloudinary(form.img);
      }

      const updatedData = {
        blogImgUrl: imageURL,
        title: form.title,
        description: form.description,
      };

      await updateDoc(blogRef, updatedData);

      const updatedBlog = {
        ...editBlog,
        ...updatedData,
      };

      onBlogUpdated(updatedBlog);

      setForm({
        title: "",
        description: "",
        img: "",
      });

      setOpen(false);

      setEditBlog(null);

      toast.success("Blog updated successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end pr-6 pt-2">
        <button
          id="create-blog-btn"
          onClick={handleOpen}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-semibold transition cursor-pointer flex items-center gap-2"
        >
          Create a Blog
        </button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%",
              sm: 500,
            },
            bgcolor: "white",
            borderRadius: "16px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editBlog ? "Edit Blog" : "Create Blog"}
            </h2>

            <IconButton
              onClick={handleClose}
              disabled={loading}
            >
              <Close />
            </IconButton>
          </div>

          <Input
            type="text"
            placeholder="Enter blog title"
            name="title"
            id="title"
            handler={handleInputChange}
            value={form.title}
          />

          <div className="mt-3">
            <textarea
              name="description"
              id="description"
              placeholder="Write your blog description..."
              value={form.description}
              onChange={(e) =>
                handleInputChange(
                  "description",
                  e.target.value
                )
              }
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none overflow-y-auto text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="mb-5 mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-indigo-500 transition cursor-pointer">

              <Image className="text-gray-400 text-4xl mb-2" />

              <p className="text-gray-500 text-sm mb-3">
                {editBlog
                  ? "Upload new image or keep existing image"
                  : "Upload your blog image"}
              </p>

              <Input
                type="file"
                placeholder="Upload blog image"
                name="img"
                id="img"
                handler={handleInputChange}
              />
            </div>
          </div>

          <Button
            onClick={editBlog ? updateBlog : createBlog}
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                {editBlog
                  ? "Updating Blog..."
                  : "Creating Blog..."}
              </span>
            ) : editBlog ? (
              "Update Blog"
            ) : (
              "Create Blog"
            )}
          </Button>
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default BlogModal;