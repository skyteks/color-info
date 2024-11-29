import Color from "./Color";

export function toStringRGB(color: Color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function toStringHex(color: Color): string {
    function toHex(value: number): string {
        return value.toString(16).padStart(2, '0');
    };
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}