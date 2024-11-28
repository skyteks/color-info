import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import InputPage from './pages/InputPage'
import Color from './Color'

function App() {
    const [color, setColor] = useState<Color | null>(null)

    return (
        <>
            <Routes>
                <Route path="/" element={<InputPage colorValue={color} setColorValue={setColor} />} />
            </Routes>
        </>
    )
}

export default App
