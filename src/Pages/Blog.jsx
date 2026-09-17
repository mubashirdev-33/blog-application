import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import BlogModal from "../components/BlogModal.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";

const Blog = () => {
  const [blog, setBlog] = useState([]);

  const getBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));

      const blogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlog(blogs);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <>
      <Navbar setBlog={setBlog} />

      <div className="min-h-screen bg-gray-100 p-6">

        <BlogModal setBlog={setBlog} />

        {blog.length === 0 ? (
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
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">

            {blog.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md"
              >
                <img
                  src={item.blogImgUrl}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.title}
                  </h2>

                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </>
  );
};

export default Blog;