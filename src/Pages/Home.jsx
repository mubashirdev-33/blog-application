import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading,setLoading] =useState(true)

  const getBlogs = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://dummyjson.com/posts");
      setBlogs(response.data.posts);
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

 return (
  <>
    <Navbar />

    {loading ? (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    ) : (
      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold text-center mb-8">
          Latest Blogs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-7xl mx-auto">

          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >

              {/* Image */}
              <img
                src={`https://picsum.photos/600/400?random=${blog.id}`}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />

              {/* Content */}
              <div className="p-5">

                <h2 className="text-xl font-bold text-gray-800 capitalize line-clamp-2">
                  {blog.title}
                </h2>

                <p className="text-gray-600 mt-3 leading-6 line-clamp-3">
                  {blog.body}
                </p>

                <button className="mt-5 text-indigo-600 font-semibold hover:text-indigo-800 transition">
                  Read More →
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    )}
  </>
);
};

export default Home;