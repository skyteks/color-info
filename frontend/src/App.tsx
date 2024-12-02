import { Route, Routes } from "react-router-dom";
import InputPage from "./pages/InputPage";
import ColorPage from "./pages/ColorPage";
import "./BorderAnim.css";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<InputPage />} />
                <Route path="/color/:hex" element={<ColorPage />} />
            </Routes>
        </>
    )
}

export default App
