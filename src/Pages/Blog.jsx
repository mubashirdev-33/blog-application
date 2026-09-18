import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import BlogModal from "../components/BlogModal.jsx";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config.js";
import { onAuthStateChanged } from "firebase/auth";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [editBlog, setEditBlog] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);

  const navigate = useNavigate();

  const getBlogs = async (currentUser) => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "blogs"),
        where("authorId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlog(blogs);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getBlogs(currentUser);
      } else {
        setBlog([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const openDeleteDialog = (item) => {
    setSelectedBlog(item);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setSelectedBlog(null);
  };

  const deleteBlog = async () => {
    if (!selectedBlog) {
      return;
    }

    try {
      await deleteDoc(doc(db, "blogs", selectedBlog.id));

      setBlog((prev) =>
        prev.filter((item) => item.id !== selectedBlog.id)
      );

      toast.success("Blog deleted successfully");

      closeDeleteDialog();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const openEdit = (item) => {
    setEditBlog(item);
  };

  const handleBlogUpdated = (updatedBlog) => {
    setBlog((prev) =>
      prev.map((item) =>
        item.id === updatedBlog.id ? updatedBlog : item
      )
    );

    setEditBlog(null);
  };

  const getDate = (createdAt) => {
    if (!createdAt) {
      return "Just now";
    }

    if (createdAt.toDate) {
      return createdAt.toDate().toLocaleDateString();
    }

    return "Just now";
  };

  const toggleDescription = (id) => {
    setExpandedBlog(
      expandedBlog === id ? null : id
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-7">

        <BlogModal
          setBlog={setBlog}
          editBlog={editBlog}
          setEditBlog={setEditBlog}
          onBlogUpdated={handleBlogUpdated}
        />

        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>

              <p className="mt-3 text-sm text-gray-500">
                Loading blogs...
              </p>
            </div>
          </div>
        ) : blog.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-700">
                No Blog Created Yet
              </h2>

              <p className="text-gray-500 mt-2">
                Create your first blog to see it here.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-6 mt-8">

            {blog.map((item) => {
              const isExpanded =
                expandedBlog === item.id;

              return (
                <article
                  key={item.id}
                  className="w-full sm:w-[380px] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >

                  <div className="flex items-center justify-between px-4 py-3">

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="cursor-pointer"
                      >
                        {item.authorPhoto ? (
                          <img
                            src={item.authorPhoto}
                            alt={item.authorName || "User"}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 hover:ring-indigo-300 transition"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold hover:bg-indigo-700 transition">
                            {item.authorName
                              ? item.authorName
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>
                        )}
                      </button>

                      <div>
                        <button
                          type="button"
                          onClick={() => navigate("/profile")}
                          className="font-semibold text-gray-800 text-sm hover:text-indigo-600 transition cursor-pointer"
                        >
                          {item.authorName || "User"}
                        </button>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {getDate(item.createdAt)}
                        </p>
                      </div>

                    </div>

                    <MoreVert
                      sx={{
                        color: "#9ca3af",
                        fontSize: 21,
                      }}
                    />

                  </div>

                  <div className="px-4 pb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h2>
                  </div>

                  <div className="w-full h-52 overflow-hidden bg-gray-100">
                    <img
                      src={item.blogImgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="px-4 py-4">

                    <p
                      className={`text-gray-600 text-sm leading-6 break-words ${
                        isExpanded
                          ? ""
                          : "line-clamp-3"
                      }`}
                    >
                      {item.description}
                    </p>

                    {item.description &&
                      item.description.length > 180 && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleDescription(item.id)
                          }
                          className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer transition"
                        >
                          {isExpanded
                            ? "See less"
                            : "See more"}
                        </button>
                      )}

                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">

                      <IconButton
                        onClick={() => openEdit(item)}
                        size="small"
                        sx={{
                          color: "#4f46e5",
                          "&:hover": {
                            backgroundColor: "#eef2ff",
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          openDeleteDialog(item)
                        }
                        size="small"
                        sx={{
                          color: "#dc2626",
                          "&:hover": {
                            backgroundColor: "#fef2f2",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}
      </div>

      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>
          Delete Blog
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete this blog?
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDeleteDialog}>
            No
          </Button>

          <Button
            onClick={deleteBlog}
            color="error"
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default Blog;