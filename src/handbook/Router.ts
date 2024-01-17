import showdown from "showdown";
import DOMPurify from "dompurify";

import { makeStylesIterable } from "./helper/styles";
import { nextSiblingUntil } from "../utils/dom";
import type { Styles } from "./styles";

const showdownConfig = {
    ghCompatibleHeaderId: true,
    headerLevelStart: 2,
    tables: true,
    parseImgDimensions: true,
};

const parser = new DOMParser();
const converter = new showdown.Converter(showdownConfig);

export interface RouterConfig {
    markdownStyle: Styles;
}

export interface PathObj {
    route: string;
    hash: string;
}

export interface NavOptions {
    alias?: string;
    ignoreSections?: boolean;
}

export interface Route {
    path: string;
    ext: string;
    index?: boolean;

    pathAlias?: string;
    content?: HTMLElement;

    navOptions?: NavOptions;
}

/**
 * Class representing a router
 */
export class Router {
    /** `HTMLElement` to hydrate with content. */
    readonly root: HTMLElement;

    /** `basePath` to prepend in navigation. */
    readonly basePath: string;

    /** List of routes in this instance. */
    private routes: Route[];

    /** Current route of this instance. */
    current: Route;

    /** Style source for generated markdown. */
    private markdownStyle: Styles;

    constructor(routes: Route[], root: HTMLElement, basePath: string = "") {
        this.root = root;
        this.routes = routes;
        this.basePath = basePath;
    }

    /** Get current route of this instance. */
    get currentRoute() {
        return this.current;
    }

    /** Get list of routes in this instance. */
    get allRoutes() {
        return this.routes;
    }

    /**
     * Converts markdown string to an`HTMLBodyElement`.
     * @param rawMD Markdown string to process.
     * @returns Content of `rawMD` as an`HTMLBodyElement`.
     */
    private markdown2html(rawMD: string) {
        const rawHTML = converter.makeHtml(rawMD);

        // Parse and get element for manipulation
        const body: HTMLBodyElement = parser
            .parseFromString(rawHTML, "text/html")
            .querySelector("body");

        // Title of the page
        const title = body.querySelector("h2");

        // Content that preceding first section
        const baseContent = nextSiblingUntil(title, "h3");

        // Get every main section ## = h3
        const sections = [...body.querySelectorAll("h3")];

        // Skip if page doesn't include at least one a main section
        if (sections.length > 0) {
            // Blank body
            const processedBody = document.implementation
                .createHTMLDocument("")
                .querySelector("body");

            // Insert page title
            processedBody.insertAdjacentElement("afterbegin", title);

            // Insert preceding content
            baseContent.forEach((el) =>
                processedBody.insertAdjacentElement("beforeend", el)
            );

            // Wrap all sections into a div
            sections.forEach((el) => {
                const container = document.createElement("div");
                const title = document.createElement("h3");
                const titleText = document.createTextNode(el.textContent);

                title.id = el.id;
                title.append(titleText);

                // Insert section title
                container.append(title);

                container.id = `${el.id}-container`;

                // Insert all sections children
                nextSiblingUntil(el, "h3").forEach((child) => {
                    container.append(child);
                });

                processedBody.append(container);
            });

            return processedBody;
        }

        return body;
    }

    /**
     * Apply styles to provided element.
     * @param body Apply styles to all children.
     * @returns
     */
    private styleHTML(body: HTMLBodyElement): HTMLBodyElement {
        if (!this.markdownStyle) throw new Error("No style source.");

        const { markdownStyle } = this;

        // TODO: Assign Type for all the valid tag name.

        // We'll push all keys from the style object so we can loop through later.
        const queries = [];

        for (const [key] of Object.entries(markdownStyle)) {
            queries.push(key);
        }

        // Get all elements that we can style.
        const elems = Array.from(body.querySelectorAll(queries.join(",")));

        elems.forEach((elem: HTMLElement) => {
            const key = elem.tagName.toLowerCase();

            const process = (elem: HTMLElement) => {
                // Insert plane icons in blockquote elements.
                if (key === "blockquote") {
                    elem.querySelector("p").insertAdjacentHTML(
                        "afterbegin",
                        // '<i aria-hidden="true" class="mr-2 fa-solid fa-plane text-brand"></i>'
                        "⚙️ "
                    );
                }

                elem.classList.add(...markdownStyle[key]);
            };

            process(elem);
        });

        return body;
    }

    private async load(route: Route) {
        try {
            let tempPath = route.path;

            if (route.index) tempPath = "/index";

            const filename = `${tempPath}.${route.ext}`;

            // Fetch resource
            const res = await fetch(this.basePath + filename, {
                headers: {
                    "Cache-Control": "no-cache",
                },
            });

            // Remove route from Router if not found.
            if (res.status !== 200)
                this.routes.splice(this.routes.indexOf(route), 1);

            const raw = await res.text();

            // Sanitize html, convert if markdown
            const cleanHTMLString = DOMPurify.sanitize(
                route.ext === "md" ? this.markdown2html(raw) : raw
            );

            const addLinksTarget = (body: HTMLBodyElement, target: string) => {
                body.querySelectorAll("a").forEach((a) => {
                    if (a.href.includes(this.basePath)) return;
                    a.target = target;
                    a.rel = "noreferrer";
                });
                return body;
            };

            const body: HTMLBodyElement = addLinksTarget(
                parser
                    .parseFromString(cleanHTMLString, "text/html")
                    .querySelector("body"),
                "_blank"
            );

            const title = body.querySelector("h2");

            // If title id doesn't match the path (without '/'), correct it.
            if (title.id !== route.path.slice(1))
                title.id = route.path !== "/" ? route.path.slice(1) : "";

            if (this.markdownStyle) this.styleHTML(body);

            route.content = body;
        } catch (err) {
            console.log(err.message);
        }
    }

    private validateRoute(path: string) {
        const needle = path;

        const found = this.routes.find(({ path }) => path === needle);

        if (!found && path !== this.basePath) return false;
        return true;
    }

    /**
     * Takes care hydrating the root element with the right content, also
     * scrolls the user to the provided hash anchor.
     *
     * @param path Navigate to this path.
     * @param popState Was called by the `PopState` event?
     * @returns
     */
    navigate(path: string, popState: boolean = false): Route | Error {
        // Format path | Trim basePath, ect..
        const { route, hash } = this.decomposePath(path);

        //Verify route exists
        if (!this.validateRoute(route)) return new Error("Invalid route");

        const target = this.routes.find(
            (availRoute) => availRoute.path === route
        );

        const newPath =
            this.basePath + (route === "/" ? "" : route) + (hash ? hash : "");

        const alreadyLoaded = route === this.current?.path;
        const sameRoute = window.history.state?.hash === hash && alreadyLoaded;

        if (!alreadyLoaded) {
            this.current = target;
            this.root.innerHTML = target.content.innerHTML;
        }

        if (!popState && !sameRoute) {
            window.history.pushState(hash ? { hash: hash } : null, "", newPath);
        }

        const heading: Element | null =
            hash !== "#" ? document.querySelector(hash) : null;

        const options: ScrollToOptions = {
            behavior: alreadyLoaded ? "smooth" : "auto",
            top: 0,
        };

        const container = document.querySelector(hash + "-container");

        hash !== "#" && heading
            ? container
                ? container.scrollIntoView(true)
                : document.querySelector(hash).scrollIntoView(true)
            : window.scroll(options);

        return target;
    }

    /**
     * Decomposes provided path into an object containing a trimmed route path key and a hash key,
     * trims the basePath from the route.
     *
     * Returns '#' for no hashs, '/' for the root route.
     *
     * @param path Path to decompose.
     * @returns
     */
    private decomposePath(path: string): PathObj {
        let [route, hash] = path.split("#");

        if (route.startsWith(this.basePath))
            route = route.substring(this.basePath.length);

        if (route.length === 0) route = "/";

        return { route, hash: hash ? "#" + hash : "#" };
    }

    /**
     * Initializes the router.
     * @param RouterConfig Config object for `Router`.
     */
    async init({ markdownStyle }: RouterConfig) {
        const hash = location.hash;

        // Assign styles for markdown
        if (markdownStyle)
            this.markdownStyle = makeStylesIterable(markdownStyle);

        // Load routes
        await Promise.all(
            this.routes.map(async (route) => await this.load(route))
        );

        //Verify route exists, if not redirect to root
        if (!this.validateRoute(this.decomposePath(location.pathname).route))
            this.navigate("/");

        const trimmedPath = location.pathname.substring(this.basePath.length);

        let requestPath = trimmedPath.length === 0 ? "/" : trimmedPath;

        if (hash) requestPath = requestPath + hash;

        this.navigate(requestPath);

        window.onpopstate = ({ state }: PopStateEvent) => {
            let hash = state?.hash ? state.hash : "";

            let previousPath = window.location.pathname;

            if (hash) previousPath + "#" + hash;

            this.navigate(previousPath, true);
        };
    }
}
