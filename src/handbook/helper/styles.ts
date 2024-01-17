import type { Styles } from "../styles";

export function makeStylesIterable(styles: Styles) {
  for (const [key, value] of Object.entries(styles)) {
    let arr: string[];
    let str: string = value as string;

    if (typeof str !== "string" && !Array.isArray(str))
      throw new Error("Invalid style value");

    if (Array.isArray(value)) arr = value.join(" ").split(" ");

    styles[key] = arr ? arr : str.split(" ");
  }
  return styles;
}

export type ChevronDirectionX = "left" | "right";
export type ChevronDirectionY = "up" | "down";
export type ChevronDirection = ChevronDirectionX | ChevronDirectionY;

/**
 * Generates font awesome icon markup.
 * Not necessary, was testing something.
 */
export const makeIconMarkup = {
  /**
   * Generate a FA chevron.
   * @param direction Type of chevron.
   * @param extraClasses Classes to add on the icon.
   * @returns
   */
  chev: (direction: ChevronDirection, extraClasses: string = "") => {
    return `<i aria-hidden="true" class="${extraClasses} fa-solid fa-chevron-${direction}"></i>`;
  },
};
