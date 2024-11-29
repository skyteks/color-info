import { useState } from "react";
import "./Form.css";
import useAxiosAPI, { Result } from "../axiosAPI"
import { useNavigate } from "react-router-dom";
import Color from "../../../Color";

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

        if (checkString(inputString)) {
            setResponseMessage("Testing...");
            postData();
        }
        else {
            setResponseMessage("Invalid Input string.");
        }
    }

    function checkString(input: string): boolean {
        if (!input) {
            console.error("Input is empty.");
            return false;
        }
        if (typeof input !== "string") {
            console.error("Input is not a string.");
            return false;
        }
        if (input.length > 64) {
            console.error("Input too long. Abborting.");
            return false;
        }
        return true;
    }

    async function postData() {
        setSubmitted(true);
        const result: Result = await axiosPost("/check", { data: inputString });
        setResponseMessage(result.message);
        if (result.success) {
            setSubmitted(false);
            setResponseMessage(String(result.data));
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
                <span className="color-preview" style={{ backgroundColor: colorValue?.toString() }} />
            </form>
        </main>
    );
}

export default InputPage;
