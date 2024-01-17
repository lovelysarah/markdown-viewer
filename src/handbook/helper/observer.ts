/**
 * `IntersectionObserver` options.
 */
export interface IntersectionObserverOptions {
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number;
}

export function createIntersectionObserver(
  elems: HTMLElement | HTMLElement[],
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions = {}
) {
  let observer = new IntersectionObserver(callback, options);

  Array.isArray(elems)
    ? elems.forEach((elem) => observer.observe(elem))
    : observer.observe(elems);

  return observer;
}
