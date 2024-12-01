import Color from "../../Color"
import prisma from "./middleware/prisma";
import NamedColor from "../prisma/NamedColor.types";

const deasync = require("deasync");

function testAllChecks(input: string): Color | null {
    const testHex = checkHexadecimal(input);
    if (testHex) {
        console.log("Hex check success.");
        return testHex;
    }
    console.log("Hex check failed.");

    const testRGB = checkRGB(input);
    if (testRGB) {
        console.log("RGB check success.");
        return testRGB;
    }
    console.log("RGB check failed.");

    const testCustomRGB = checkCustomRGB(input);
    if (testCustomRGB) {
        console.log("Custom RGB check success.");
        return testCustomRGB;
    }
    console.log("Custom RGB check failed.");

    const testHSL = checkHSL(input);
    if (testHSL) {
        console.log("HSL check success.");
        return testHSL;
    }
    console.log("HSL check failed.");

    const testBinary = checkBinary(input);
    if (testBinary) {
        console.log("Binary check success.");
        return testBinary;
    }
    console.log("Binary check failed.");

    const testDecimal = checkDecimal(input);
    if (testDecimal) {
        console.log("Decimal check success.");
        return testDecimal;
    }
    console.log("Decimal check failed.");

    const testNamedColor = checkNamedColor(input);
    if (testNamedColor) {
        console.log("Named Color check success.");
        return testNamedColor;
    }
    console.log("Named Color check failed.");

    return null;
}
export default testAllChecks;

export function searchColorName(color: Color):string[] {
    let result: string[] = [];
    let done = false;

    const promise = prisma.namedColor.findMany({ where: { r: color.r, g: color.g, b: color.b } });
    promise
        .then((named: NamedColor[] | null) => {
            if (named) {
                result = named.map((singleNamed) => singleNamed.name) as string[];
            } else {
                console.log("Could not find Color.");
            }
            done = true;
        })
        .catch((error: Error) => {
            console.log("Error searching Color Name in DB.", error);
            done = true;
        });

    while (!done) {
        deasync.runLoopOnce();
    }

    return result;
}

function checkNamedColor(input: string): Color | null {
    let result: Color | null = null;
    let done = false;

    //const promise:Promise<NamedColor | null> = prisma.$queryRaw`SELECT * FROM "NamedColor" WHERE LOWER("name") = ${input.toLowerCase()}`;
    const promise = prisma.namedColor.findUnique({ where: { name: input } });
    promise
        .then((named: NamedColor | null) => {
            if (named) {
                result = new Color(named.r, named.g, named.b);
            } else {
                console.log("Could not find Color.");
            }
            done = true;
        })
        .catch((error: Error) => {
            console.log("Error searching Named Color in DB.", error);
            done = true;
        });

    while (!done) {
        deasync.runLoopOnce();
    }

    return result;
}

function clamp0To255(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)));
}

// Match HEX colors (#RRGGBB or #RGB)
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

// Match RGB(a) colors (rgb(r, g, b) or rgba(r, g, b, a))
function checkRGB(input: string): Color | null {
    const rgbaRegex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*[\d.]+)?\)$/;
    const rgbaMatch = input.match(rgbaRegex);
    if (rgbaMatch) {
        const r = clamp0To255(parseInt(rgbaMatch[1], 10));
        const g = clamp0To255(parseInt(rgbaMatch[2], 10));
        const b = clamp0To255(parseInt(rgbaMatch[3], 10));
        return new Color(r, g, b);
    }
    return null;
}

function checkCustomRGB(input: string): Color | null {
    // Regex for supported formats
    const formats = [
        /^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/,                      // "255 0 0"
        /^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/,                    // "255,0,0" or "255, 0, 0"
        /^\((\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\)$/,                  // "(255 0 0)"
        /^\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,                // "(255, 0, 0)"
        /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i,            // "rgb(255, 0, 0)" (case insensitive)
        /^color\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i,          // "Color(255, 0, 0)" or "color(255, 0, 0)"
        /^col\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i,            // "col(255, 0, 0)"
        /^\[(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\]$/,                  // "[255 0 0]"
        /^\[(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\]$/,                // "[255, 0, 0]"
    ];

    for (const regex of formats) {
        const match = input.match(regex);
        if (match) {
            const r = clamp0To255(parseInt(match[1], 10));
            const g = clamp0To255(parseInt(match[2], 10));
            const b = clamp0To255(parseInt(match[3], 10));
            return new Color(r, g, b);
        }
    }
    return null;
}

// Match HSL(a) colors (hsl(h, s%, l%) or hsla(h, s%, l%, a))
function checkHSL(input: string): Color | null {
    const hslaRegex = /^hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%(?:,\s*[\d.]+)?\)$/;
    const hslaMatch = input.match(hslaRegex);
    if (hslaMatch) {
        const h = parseInt(hslaMatch[1], 10) % 360;
        const s = parseInt(hslaMatch[2], 10) / 100;
        const l = parseInt(hslaMatch[3], 10) / 100;

        // Convert HSL to RGB
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r = 0, g = 0, b = 0;
        if (h < 60) {
            r = c; g = x; b = 0;
        } else if (h < 120) {
            r = x; g = c; b = 0;
        } else if (h < 180) {
            r = 0; g = c; b = x;
        } else if (h < 240) {
            r = 0; g = x; b = c;
        } else if (h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        r = clamp0To255((r + m) * 255);
        g = clamp0To255((g + m) * 255);
        b = clamp0To255((b + m) * 255);

        return new Color(r, g, b);
    }
    return null;
}

// Match Binary colors (0bRRGGBB)
function checkBinary(input: string): Color | null {
    const binaryRegex = /^0b[01]{24}$/;
    const binaryMatch = input.match(binaryRegex);
    if (binaryMatch) {
        const num = parseInt(input.slice(2), 2);
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        return new Color(r, g, b);
    }
    return null;
}

// Match Decimal colors (0-16777215)
function checkDecimal(input: string): Color | null {
    const decimalRegex = /^\d+$/;
    const decimalMatch = input.match(decimalRegex);
    if (decimalMatch) {
        const num = parseInt(input, 10);
        if (num >= 0 && num <= 16777215) {
            const r = (num >> 16) & 0xff;
            const g = (num >> 8) & 0xff;
            const b = num & 0xff;
            return new Color(r, g, b);
        }
    }
    return null;
}