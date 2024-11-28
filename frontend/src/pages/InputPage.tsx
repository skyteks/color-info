import { useEffect, useState } from "react";
import "./Form.css";
import useAxiosAPI, { Result } from "../axiosAPI"
import { useNavigate, useParams } from "react-router-dom";
import Color, { checkStringForColorInfo } from "../Color";

function InputPage({ colorValue, setColorValue }: { colorValue: Color | null, setColorValue: Function }) {
    const [formChanged, setFormChanged] = useState(false);
    const { axiosPost } = useAxiosAPI();
    const [responseMessage, setResponseMessage] = useState("");
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [inputString, setInputString] = useState("");


    function handleFormInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.name || !e.target.value) {
            return;
        }
        console.log("Color: ", e.target.value);
        setInputString(e.target.value);
        setFormChanged(true);
        setResponseMessage("");
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        //postData();

        try {
            const newColor = checkStringForColorInfo(inputString);
            setColorValue(newColor);
            setResponseMessage("Success!");
        } catch (error) {
            setResponseMessage("Failed to recognice color.");
        }
    }

    async function postData() {
        setSubmitted(true);
        const result = await axiosPost("/check", { colorValue });
        setResponseMessage(result.message);
        if (result.success) {
            setTimeout(() => {
                setSubmitted(false);
                navigate("/");
            }, 1000);
        }
        else {
            handleClear(false);
        }
    }

    function handleClear(clearResponseMessage: boolean) {
        setFormChanged(false);
        setColorValue(null);
        if (clearResponseMessage) {
            setResponseMessage("");
        }
        setSubmitted(false);
    }

    return (
        <main id="Form">
            <h1>COLOR INFO</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="color" onChange={handleFormInput} required={true} defaultValue="" />
                <div className="form-block">
                    <button type="reset" onClick={() => handleClear(true)}>Clear</button>
                    <button type="submit" disabled={(!formChanged || submitted)}>Search</button>
                </div>
                <span>{responseMessage ? responseMessage : " "}</span>
                <span className="color-preview" style={{ backgroundColor: colorValue?.toString()}} />
            </form>
        </main>
    );
}

export default InputPage;
