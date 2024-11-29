import { useState } from "react";
import "./Form.css";
import useAxiosAPI, { Result } from "../axiosAPI"
import { useNavigate } from "react-router-dom";
import Color from "../../../Color";
import { toStringHex } from "../../../convert";

function InputPage() {
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
    }

    function checkString(input: string): boolean {
        if (!input) {
            setResponseMessage("Input is empty.");
            return false;
        }
        if (typeof input !== "string") {
            setResponseMessage("Input is not a string.");
            return false;
        }
        if (input.length > 64) {
            setResponseMessage("Input too long. Abborting.");
            return false;
        }
        return true;
    }

    async function postData() {
        setSubmitted(true);
        console.log("check inputString", { content: inputString });
        const result: Result = await axiosPost("/check", { content: inputString });
        setResponseMessage(result.message);
        if (result.success) {
            console.log("check content:", result.content);
            setSubmitted(false);
            const color: Color = result.content as Color;
            navigate("/color/" + toStringHex(color).substring(1));
        }
        else {
            handleClear(false);
        }
    }

    function handleClear(clearResponseMessage: boolean) {
        setFormChanged(false);
        if (clearResponseMessage) {
            setResponseMessage("");
        }
        setSubmitted(false);
    }

    return (
        <main id="Form">
            <h1>COLOR INFO</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" name="color" onChange={handleFormInput} required={true} defaultValue="" />
                    <div className="form-block">
                        <button type="reset" onClick={() => handleClear(true)}>Clear</button>
                        <button type="submit" disabled={/*(!formChanged || submitted)*/false}>Search</button>
                    </div>
                    <span>{responseMessage ? responseMessage : " "}</span>
                </div>
            </form>
        </main>
    );
}

export default InputPage;
