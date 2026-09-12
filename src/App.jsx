import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Pages/Auth/Login"
import SignUp from "./Pages/Auth/SignUP"
import Dashboard from "./Pages/Dashboard/Dashboard"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App




