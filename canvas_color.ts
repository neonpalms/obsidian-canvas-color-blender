import { CanvasNodeData } from "./types/canvas";

export default class CanvasColor {
    private readonly UNCOLORED: RGBColor = { r: 0, g: 0, b: 0 }
    private c: RGBColor;

    constructor(arg: string | undefined) {
        // Uncolored node
        if (arg === undefined || arg === '')
            this.c = this.UNCOLORED;
        // Hex code supplied
        else if (/#[\dABCDEFabcdef]{6}/.test(arg))
            this.c = this.hexToRGB(arg);
        // Obsidian color index supplied
        else if (/^[1-6]$/.test(arg))
            this.c = this.indexToRGB(arg);
        // Else, that's invalid input
        else
            throw new Error(`Invalid argument ${arg}; should either be a full hex code like '#4000FF', an index '1' thru '6', or empty string literal''`);
    }

    hexToRGB(hex: string): RGBColor {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r: r, g: g, b: b };
    }

    indexToRGB(colorIdx: string): RGBColor {
        const colorsAsHex: Map<string, string> = new Map([
            ['1', '#fb464c'],
            ['2', '#e9973f'],
            ['3', '#e0de71'],
            ['4', '#44cf6e'],
            ['5', '#53dfdd'],
            ['6', '#a882ff'],
        ]);
        const hexColor: string | null = colorsAsHex.get(colorIdx) ?? null;
        if (hexColor == null)
            throw new Error(`Invalid color index ${colorIdx}; should be 1 through 6.`);
        else
            return this.hexToRGB(hexColor);
    }

    static avg(arg: string[] | CanvasNodeData[]): string {
        let totalR = 0; let totalG = 0; let totalB = 0;

        const colorsForDebug: string[] = [];

        const colors = typeof arg[0] === 'string'
            ? (arg as string[]).map(hex => new CanvasColor(hex))
            : (arg as CanvasNodeData[]).map(node => new CanvasColor(node.color));

        colors.forEach((color, index) => {
            totalR += color.c.r; totalG += color.c.g; totalB += color.c.b;

            const hexColor = `#${((1 << 24) + (color.c.r << 16) + (color.c.g << 8) + color.c.b).toString(16).slice(1).toUpperCase()}`;
            colorsForDebug.push(`Node ${index + 1}: \x1b[38;2;${color.c.r};${color.c.g};${color.c.b}m${hexColor}\x1b[0m`);
        });

        const count = colors.length;
        const avgColor: RGBColor = {
            r: Math.round(totalR / count), g: Math.round(totalG / count), b: Math.round(totalB / count),
        };

        const avgHex = `#${((1 << 24) + (avgColor.r << 16) + (avgColor.g << 8) + avgColor.b).toString(16).slice(1).toUpperCase()}`;

        console.debug('Node colors:');
        console.debug(colorsForDebug.join('\n'));
        console.debug(`Average Color: \x1b[38;2;${avgColor.r};${avgColor.g};${avgColor.b}m${avgHex}\x1b[0m`);

        return avgHex;
    }

    toString() {
        return `#${((1 << 24) + (this.c.r << 16) + (this.c.g << 8) + this.c.b).toString(16).slice(1).toUpperCase()}`;
    }
}

interface RGBColor {
    r: number;
    g: number;
    b: number;
}
