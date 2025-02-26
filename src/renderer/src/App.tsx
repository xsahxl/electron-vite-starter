import Versions from '@renderer/components/Versions'
import Login from '@renderer/components/Login'
import { Routes, Route } from "react-router";

function App(): JSX.Element {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/versions" element={<Versions />} />
    </Routes>
  )
}

export default App
