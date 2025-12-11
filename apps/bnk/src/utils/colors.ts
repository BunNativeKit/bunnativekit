/**
 * Terminal color utilities using Bun.color for styled CLI output.
 * @module
 */

const RESET = "\x1b[0m";

/** Create an ANSI-colored string */
function colorize(text: string, color: string): string {
    const ansi = Bun.color(color, "ansi");
    if (!ansi) return text;
    return `${ansi}${text}${RESET}`;
}

/** Color functions for terminal output */
export const colors = {
    red: (text: string) => colorize(text, "#ef4444"),
    green: (text: string) => colorize(text, "#22c55e"),
    yellow: (text: string) => colorize(text, "#eab308"),
    blue: (text: string) => colorize(text, "#3b82f6"),
    cyan: (text: string) => colorize(text, "#06b6d4"),
    magenta: (text: string) => colorize(text, "#d946ef"),
    gray: (text: string) => colorize(text, "#6b7280"),
    white: (text: string) => colorize(text, "#f9fafb"),
    error: (text: string) => colorize(text, "#ef4444"),
    success: (text: string) => colorize(text, "#22c55e"),
    warn: (text: string) => colorize(text, "#eab308"),
    info: (text: string) => colorize(text, "#3b82f6"),
    dim: (text: string) => colorize(text, "#6b7280"),
    bold: (text: string) => `\x1b[1m${text}${RESET}`,
    boldRed: (text: string) => `\x1b[1m${colorize(text, "#ef4444")}`,
    boldGreen: (text: string) => `\x1b[1m${colorize(text, "#22c55e")}`,
    boldYellow: (text: string) => `\x1b[1m${colorize(text, "#eab308")}`,
    boldBlue: (text: string) => `\x1b[1m${colorize(text, "#3b82f6")}`,
};

/** Print a formatted header */
export function header(title: string): void {
    console.log();
    console.log(colors.bold(title));
    console.log(colors.dim("-".repeat(title.length)));
}

/** Print a success message */
export function success(message: string): void {
    console.log(`${colors.green("[ok]")} ${message}`);
}

/** Print an error message */
export function error(message: string): void {
    console.error(`${colors.red("[error]")} ${message}`);
}

/** Print a warning message */
export function warn(message: string): void {
    console.log(`${colors.yellow("[warn]")} ${message}`);
}

/** Print an info message */
export function info(message: string): void {
    console.log(`${colors.blue("[info]")} ${message}`);
}

/** Print a status line with check/cross indicator */
export function status(label: string, ok: boolean, detail?: string): void {
    const indicator = ok ? colors.green("[ok]") : colors.red("[x]");
    const detailStr = detail ? colors.dim(` (${detail})`) : "";
    console.log(`  ${indicator} ${label}${detailStr}`);
}

/** Print a list item */
export function listItem(text: string, indent = 2): void {
    console.log(`${" ".repeat(indent)}- ${text}`);
}

/** Print a key-value pair */
export function keyValue(key: string, value: string, indent = 2): void {
    console.log(`${" ".repeat(indent)}${colors.dim(key + ":")} ${value}`);
}
