class Color {
    r: number;
    g: number;
    b: number;
    constructor(red: number, green: number, blue: number) {
        this.r = red;
        this.g = green;
        this.b = blue;
    }

    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}
export default Color;

function clamp(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)));
}

function extractColor(input: string): Color | null {

    // Match HEX colors (#RRGGBB or #RGB)
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

    // Match RGB(a) colors (rgb(r, g, b) or rgba(r, g, b, a))
    const rgbaRegex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*[\d.]+)?\)$/;
    const rgbaMatch = input.match(rgbaRegex);
    if (rgbaMatch) {
        const r = clamp(parseInt(rgbaMatch[1], 10));
        const g = clamp(parseInt(rgbaMatch[2], 10));
        const b = clamp(parseInt(rgbaMatch[3], 10));
        return new Color(r, g, b);
    }

    // Match HSL(a) colors (hsl(h, s%, l%) or hsla(h, s%, l%, a))
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
        r = clamp((r + m) * 255);
        g = clamp((g + m) * 255);
        b = clamp((b + m) * 255);

        return new Color(r, g, b);
    }

    // Match Binary colors (0bRRGGBB)
    const binaryRegex = /^0b[01]{24}$/;
    const binaryMatch = input.match(binaryRegex);
    if (binaryMatch) {
        const num = parseInt(input.slice(2), 2);
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        return new Color(r, g, b);
    }

    // Match Decimal colors (0-16777215)
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

    // If no matches, return null
    return null;
}