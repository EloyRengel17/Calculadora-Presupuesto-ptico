import { Routes, Route } from "react-router-dom"
import Login from "./components/login"
import Dashboard from "./components/principal"
import ProtectedRoute from "./components/protectedRoute"

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  )
}