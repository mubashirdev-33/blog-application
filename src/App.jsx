import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Pages/Auth/Login"
import SignUp from "./Pages/Auth/SignUP"
// import Dashboard from "./Pages/Dashboard/Dashboard"
import Home from "./Pages/Home"

import { ProtectedRoute } from "./components/ProtectedRoute"
import Blog from "./Pages/Blog"
import Profile from "./Pages/Profile"
import AdminLogin from "./Pages/Admin/AdminLogin"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App




