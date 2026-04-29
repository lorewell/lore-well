import { Routes, Route, Navigate } from "react-router-dom"
import MainMenuScreen from "./screens/MainMenuScreen"
import GameScreen from "./screens/GameScreen"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenuScreen />} />
      <Route path="/game" element={<GameScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

