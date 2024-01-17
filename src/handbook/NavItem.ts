import {
    createIntersectionObserver,
    IntersectionObserverOptions,
} from "./helper/observer";
import type { Router } from "./Router";

/**
 *  Class representing an item in a `Nav` instance
 */
export class NavItem {
    /** Path associated with the item. */
    path: string;

    /** Router that controls the parent `Nav` */
    router: Router;

    /**Name of the item */
    name: string;

    /** List element of the item */
    el: HTMLElement;

    /** Anchor element of the item  */
    link: HTMLAnchorElement;

    /** Heading element associated with the item */
    heading: HTMLHeadingElement;

    sectionContainerID: string;

    /** Does the item link to a main anchor? */
    isMain: Boolean;

    observer: IntersectionObserver;

    isActive: boolean;

    constructor(el: HTMLElement, heading: HTMLHeadingElement, router: Router) {
        this.router = router;
        this.name = heading.id;
        this.el = el;
        this.link = el.querySelector("a");
        this.heading = heading;
        this.isMain = heading.tagName === "H2";
        this.sectionContainerID = `${this.heading.id}-container`;
    }

    /**
     * Sets all path related properties.
     * @param path Path to associate.
     */
    setPath(path: string): void {
        this.path = path.substring(
            this.router.basePath.length,
            path.indexOf("#")
        );
        this.link.href = path;
        this.link.setAttribute("data-path", path);
    }

    /**
     * Start observing this instance's section's container.
     *
     * **Behavior**
     * ```
     * if doesnt have observer instance
     *  Create observer and assign it to the instance
     * else
     *  Disconnect and call observe w/updated reference
     * ```
     *
     * If the instance doesn't have an observer, create one and assign it to the instance.
     *
     * Else, update target refs on the current one.
     *
     *
     * @param observerCallback Callback for the observer.
     * @returns The section container.
     */
    observeSectionContainer(
        observerCallback: IntersectionObserverCallback,
        options: IntersectionObserverOptions = {}
    ): void {
        if (!this.sectionContainerID)
            throw new Error("Content not in a section!");

        const target = document.getElementById(this.sectionContainerID);

        if (!target) return;

        const updateObserverRefs = () => {
            this.observer.disconnect();
            this.observer.observe(target);
        };

        if (!this.observer) {
            this.observer = createIntersectionObserver(
                target,
                observerCallback,
                options
            );
        } else updateObserverRefs();
    }
}
