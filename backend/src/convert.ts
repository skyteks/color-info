import Color from "../../Color";

export function toStringRGB(color:Color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}