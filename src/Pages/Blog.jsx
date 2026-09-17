import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import BlogModal from "../components/BlogModal.jsx";

const Blog = () => {
  const [blog, setBlog] = useState(null);

  return (
    <>
      <Navbar setBlog={setBlog}/>

      <div className="min-h-screen bg-gray-100 p-6">
        {/* Create Blog Button / Modal */}
        <BlogModal setBlog={setBlog} />

        {!blog ? (
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
            <div className="bg-white rounded-2xl overflow-hidden shadow-md">
              <img
                src={blog.blogImgUrl}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {blog.title}
                </h2>

                <p className="text-gray-600 mt-3 line-clamp-3">
                  {blog.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;