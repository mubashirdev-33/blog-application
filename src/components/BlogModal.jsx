import React, { useState } from "react";
import { Modal, Box, Button, IconButton } from "@mui/material";
import { Close, Image } from "@mui/icons-material";
import Input from "../components/Input";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { uploadImageToCloudinary } from "../Cloudimg/cloudimage.js";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./Navbar.jsx";

const BlogModal = ({setBlog}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    img: "",
  });

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveData = async (url, data) => {
    try {
      const userId = auth.currentUser.uid;
      await addDoc(collection(db, "blogs"), {
        blogImgUrl: url,
        title: data.title,
        description: data.description,
        authorId: userId,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const blogUploadFn = async () => {
    try {
      const imgURL = await uploadImageToCloudinary(form.img);
      const save = await saveData(imgURL, form);
    
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex justify-end pr-6 pt-2">
        <button
          id="create-blog-btn"
          onClick={handleOpen}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold transition cursor-pointer"
        >
          Create a Blog
        </button>
      </div>

      <Modal open={open} onClose={handleClose}>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Blog</h2>

            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>

          {/* Title */}
          <Input
            type="text"
            placeholder="Enter blog title"
            name="title"
            id="title"
            handler={handleInputChange}
            // value={form.title}
          />

          {/* Description */}
          <div className="mt-3">
            <Input
              type="text"
              placeholder="Write your blog description..."
              name="description"
              id="description"
              handler={handleInputChange}
              // value={form.description}
            />
          </div>

          {/* Image */}
          <div className="mb-5 mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-indigo-500 transition cursor-pointer">
              <Image className="text-gray-400 text-4xl mb-2" />

              <p className="text-gray-500 text-sm">Upload your blog image</p>

              <Input
                type="file"
                placeholder="Upload blog image"
                name="img"
                id="img"
                handler={handleInputChange}
              />
            </div>
          </div>

          {/* Create Button */}
          <Button
            onClick={blogUploadFn}
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Create Blog
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default BlogModal;
