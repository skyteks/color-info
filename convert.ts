import Color from "./Color";

export function toStringRGB(color: Color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function toStringHex(color: Color): string {
    function toHex(value: number): string {
        return value.toString(16).padStart(2, "0");
    };
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

export function toStringBinary(color: Color): string {
    const toBinary = (value: number): string => {
        return value.toString(2).padStart(8, "0");
    };
    return `${toBinary(color.r)} ${toBinary(color.g)} ${toBinary(color.b)}`;
}

export function toStringDecimal(color: Color): string {
    const toDecimal = (value: number): string => {
        return value.toString().padStart(3, "0");
    };
    return `${toDecimal(color.r)}${toDecimal(color.g)}${toDecimal(color.b)}`;
}

export function toStringHSL(color: Color): string {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Calculate Hue
    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h *= 60;
        if (h < 0) h += 360;
    }

    // Calculate Lightness
    const l = (max + min) / 2;

    // Calculate Saturation
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Format to integers for output
    const hRounded = Math.round(h);
    const sRounded = Math.round(s * 100);
    const lRounded = Math.round(l * 100);

    return `hsl(${hRounded}, ${sRounded}%, ${lRounded}%)`;
}