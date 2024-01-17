/**
 * Returns all siblings after an element until a specified type of element.
 * @param start Start the scan at this element.
 * @param stopAtNext Stop when element with tagname is found.
 * @returns
 */
export const nextSiblingUntil = (
  start: HTMLElement,
  stopAtNext: string
): HTMLElement[] => {
  const results = [];

  let el = start.nextElementSibling;

  results.push(el);

  while (el && el.tagName.toLowerCase() !== stopAtNext.toLowerCase()) {
    el = el.nextElementSibling;
    results.push(el);
  }

  results.pop();
  return results;
};
