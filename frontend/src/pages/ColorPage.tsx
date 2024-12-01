import "./Form.css";
import useAxiosAPI, { Result } from "../axiosAPI"
import Color from "../../../Color";
import { toStringHex, toStringRGB } from "../../../convert";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ContrastBoxPreview from "../components/ContrastBoxPreview";

function ColorPage() {
    const [colorName, setColorName] = useState<string | null | undefined>(undefined);
    const { axiosPost } = useAxiosAPI();
    const colorHex = "#" + useParams()?.hex;
    const colorValue = checkHexadecimal(colorHex) as Color;
    console.log("colorValue", colorValue);

    useEffect(() => {
        getData();
    }, []);

    function checkHexadecimal(input: string): Color | null {
        const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
        const hexMatch = input.match(hexRegex);
        if (hexMatch) {
            let r: number, g: number, b: number;
            const hex = hexMatch[1];
            if (hex.length === 3) {
                // #RGB format
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else {
                // #RRGGBB format
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }
            return new Color(r, g, b);
        }
        return null;
    }

    async function getData() {
        const result: Result = await axiosPost("/name", { content: colorValue });
        if (result.success) {
            const names = result.content as string[] ;
            console.log("Name", names);
            setColorName(names.reduce((prev, curr) => prev = prev.concat(" \n", curr)));
        }
        else {
            setColorName(null);
        }
    }

    return !colorValue ? (
        <h1>FAILED</h1>
        /*<Navigate to="/" />*/
    ) : (
        <main id="Form">
            <h1>COLOR INFO</h1>
            <form>
                <div className="form-group">
                    <div className="form-group">
                        <label>Preview:</label>
                        <ContrastBoxPreview color={colorHex} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">CSS Name:</label>
                        {colorName ? (
                            <input type="text" name="name" disabled={true} defaultValue={colorName} />
                        ) : (
                            <span>{colorName === null ? "none found." : "loading..."}</span>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group">
                        <label htmlFor="rgb">RGB:</label>
                        <input type="text" name="rgb" disabled={true} defaultValue={toStringRGB(colorValue)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hex">Hex:</label>
                        <input type="text" name="hex" disabled={true} defaultValue={toStringHex(colorValue)} />
                    </div>
                </div>
            </form>
        </main>
    );
}

export default ColorPage;
