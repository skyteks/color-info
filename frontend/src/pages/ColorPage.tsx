import "./Form.css";
import useAxiosAPI, { Result } from "../axiosAPI"
import Color from "../../../Color";
import { toStringBinary, toStringDecimal, toStringHex, toStringHSL, toStringRGB } from "../../../convert";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ContrastBoxPreview from "../components/ContrastBoxPreview";
import { Colorful, Wheel } from "@uiw/react-color";
import CopyAbleTextField from "../components/CopyAbleTextField";

function ColorPage() {
    const [colorNames, setColorNames] = useState<string[] | null>(null);
    const { axiosPost } = useAxiosAPI();
    const param = useParams()?.hex;
    const colorHex = "#" + param;
    const colorValue = checkHexadecimal(colorHex) as Color;

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
            const names = result.content as string[];
            setColorNames(names);
        }
        else {
            setColorNames([]);
        }
    }
    console.log("Names", colorNames, (!colorNames) == false);
    return !param ? (
        <Navigate to="/" />
    ) : (
        <main id="Form">
            <h1>COLOR INFO</h1>
            <form className="border-anim">
                <div className="form-group">
                    <div className="form-group">
                        <label>Contrast:</label>
                        <div className="content centered">
                            <ContrastBoxPreview color={colorHex} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Preview:</label>
                        <div className="content centered">
                            <Colorful color={colorHex} disableAlpha={true} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Spectrum:</label>
                        <div className="content centered">
                            <Wheel color={colorHex} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rgb">HSL:</label>
                        <div className="content">
                            <CopyAbleTextField value={toStringHSL(colorValue)} />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group">
                        <label>CSS Name:</label>
                        <div className="content">
                            {!colorNames || colorNames.length == 0 ? (
                                <span>{colorNames === null ? "loading..." : "none found."}</span>
                            ) : (
                                colorNames.map((name) =>
                                    <CopyAbleTextField value={name} key={name} />
                                )
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rgb">RGB:</label>
                        <div className="content">
                            <CopyAbleTextField value={toStringRGB(colorValue)} />
                            <div className="rows">
                                <span>R</span>
                                <CopyAbleTextField value={colorValue.r.toString()} />
                            </div>
                            <div className="rows">
                                <span>G</span>
                                <CopyAbleTextField value={colorValue.g.toString()} />
                            </div>
                            <div className="rows">
                                <span>B</span>
                                <CopyAbleTextField value={colorValue.b.toString()} />
                            </div>
                            <CopyAbleTextField value={toStringDecimal(colorValue).toUpperCase()} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hex">Hex:</label>
                        <div className="content">
                            <CopyAbleTextField value={toStringHex(colorValue).toUpperCase()} />
                            <div className="rows">
                                <span>R</span>
                                <CopyAbleTextField value={colorValue.r.toString(16).padStart(2, "0").toUpperCase()} />
                            </div>
                            <div className="rows">
                                <span>G</span>
                                <CopyAbleTextField value={colorValue.g.toString(16).padStart(2, "0").toUpperCase()} />
                            </div>
                            <div className="rows">
                                <span>B</span>
                                <CopyAbleTextField value={colorValue.b.toString(16).padStart(2, "0").toUpperCase()} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hex">Binary:</label>
                        <div className="content">
                            <CopyAbleTextField value={toStringBinary(colorValue)} />
                            <div className="rows">
                                <span>R</span>
                                <CopyAbleTextField value={colorValue.r.toString(2).padStart(8, "0").toUpperCase()} />
                            </div>
                            <div className="rows">
                                <span>G</span>
                                <CopyAbleTextField value={colorValue.g.toString(2).padStart(8, "0").toUpperCase()} />
                            </div>
                            <div className="rows">
                                <span>B</span>
                                <CopyAbleTextField value={colorValue.b.toString(2).padStart(8, "0").toUpperCase()} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}

export default ColorPage;
