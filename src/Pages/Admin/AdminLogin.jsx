
const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your password to continue
          </p>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Login Button */}
        <button
          type="button"
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login
        </button>

      </div>
    </div>
  );
};

export default AdminLogin;



