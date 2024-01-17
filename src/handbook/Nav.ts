import { createIntersectionObserver } from "./helper/observer";
import { makeStylesIterable, makeIconMarkup } from "./helper/styles";
import { NavItem } from "./NavItem";

import type { Route, Router } from "./Router";
import type { Styles } from "./styles";

/**
 * Navigation config object
 * @param title Navigation title.
 * @param styles Navigation's source of styles
 */
export interface NavConfig {
    title: string;
    styles: Styles;
}

/**
 * Class representing a navigation element
 */
export class Nav {
    /** HTML element where we hydrate the nav content. */
    root: HTMLElement;

    /** Button element used to toggle the side nav */
    toggle: HTMLElement;

    /** Nav bar is expanded */
    isExpanded: boolean;

    /** `Router` associated witht this instance.*/
    router: Router;

    /** Source of styles for this instance.*/
    styles: Styles;

    /** List element containing all the `li` elements in this instance.*/
    content: NavItem[];

    /** List of elements contained in the current route */
    lastDisplayedItems: NavItem[];

    /** `nav` element of this instance.*/
    nav: HTMLElement;

    constructor(root: HTMLElement, router: Router) {
        this.root = root;
        this.router = router;
        this.isExpanded = false;
    }

    /**
     * Executes initial configuration.
     * @param config Navigation configuration object
     */
    init({ title, styles }: NavConfig) {
        if (styles) this.styles = makeStylesIterable(styles);

        this.makeTitle(title);

        this.nav = document.createElement("nav");

        this.toggle = document.getElementById(this.root.id + "-toggle");

        if (!this.toggle)
            throw new Error("No navigation toggle button provided!");

        this.root.addEventListener("pointerenter", (e) => this.root.focus());
        this.toggle.addEventListener("click", () => this.toggleIsExpanded());

        this.root.insertBefore(this.nav, null);
    }

    private toggleIsExpanded() {
        if (window.innerWidth > 767) return;
        const expanded = [
            "!translate-x-[0]",
            "shadow-lg",
            "border-brand",
            "bg-white",
            "border-2",
        ];

        const chevElem = this.toggle.querySelector("svg");

        const changeState = (action: "open" | "close"): boolean => {
            const open = action === "open";

            const method = open ? "add" : "remove";

            this.root.classList[method](...expanded);

            chevElem.remove();

            const chevLeft =
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>';
            const chevright =
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>';

            const chev = open ? chevright : chevLeft;

            this.toggle.insertAdjacentHTML(
                open ? "beforeend" : "afterbegin",
                chev
            );

            this.isExpanded = !this.isExpanded;

            return open ? true : false;
        };

        const newState: boolean = this.isExpanded
            ? changeState("close")
            : changeState("open");

        this.isExpanded = newState;
        console.log(this.isExpanded);
    }

    private createTitleElement(title) {
        const h2 = document.createElement("h2");
        const text = document.createTextNode(title);
        h2.appendChild(text);
        this.styleElem(h2, this.styles.title);

        return h2;
    }

    private makeTitle(title: string) {
        this.root.insertBefore(
            this.createTitleElement(title),
            this.root.querySelector(".loader")
        );
    }

    private styleElem(elem: HTMLElement, styles: Iterable<string>) {
        elem.classList.add(...styles);
    }

    private formatText(str: string) {
        return (str[0].toUpperCase() + str.substring(1)).replaceAll("-", " ");
    }

    private createListItemFor(heading: HTMLHeadingElement, route: Route) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        const text = document.createTextNode(
            this.formatText(heading.innerText)
        );

        a.appendChild(text);

        li.appendChild(a);

        const item = new NavItem(li, heading, this.router);

        return item;
    }

    private generateListContent(routes: Route[]): NavItem[] {
        const items = [];

        const headings = this.getAllHeadings(routes);

        headings.forEach((heading, index) => {
            const main = this.createListItemFor(heading.main, routes[index]);
            const subs = [];

            let path = this.router.basePath + `/${heading.main.id}#`;
            main.setPath(path);

            this.styleElem(main.link, this.styles.listMainLink);

            if (!routes[index]?.navOptions?.ignoreSections) {
                heading.sub.forEach((sub: HTMLHeadingElement) => {
                    const subItem = this.createListItemFor(sub, routes[index]);

                    let subPath = path + `${sub.id}`;

                    subItem.setPath(subPath);

                    this.styleElem(subItem.link, this.styles.listSecondaryLink);
                    this.styleElem(subItem.el, this.styles.listItem);

                    subs.push(subItem);
                });
            }

            items.push(main);
            items.push(...subs);
        });

        return items;
    }

    private getAllHeadings(routes: Route[]) {
        return routes.map(({ content }) => {
            const tree: {
                main: HTMLHeadingElement;
                sub: NodeListOf<HTMLHeadingElement>;
            } = {
                main: content.querySelector("h2"),
                sub: content.querySelectorAll("h3"),
            };

            return tree;
        });
    }

    /**
     * Calls its router for navigation to the requested resource.
     * @param event DOM click event
     */
    private handleNavigation = (event: Event): void => {
        event.preventDefault();

        const el = event.target as HTMLElement;
        const oldRoute = this.router.currentRoute;

        if (el.tagName !== "A") return;

        //Find the NavItem targeted by the event
        const item = this.content.find((item) => item.link === event.target);

        // If secondary, add name as hash
        const anchor: string = item.isMain ? null : "#" + item.name;

        const newRoute = this.router.navigate(
            item.path + (anchor ? anchor : "")
        );

        if (newRoute instanceof Error) {
            console.log(newRoute.message);
            return;
        }

        const routeChanged = newRoute !== oldRoute;

        this.toggleIsExpanded();
        this.syncActivePage(routeChanged);
    };

    /**
     *
     * @param item `NavItem` targeted
     * @param remove `Remove the styles?`
     * @returns
     */
    private syncStyles = (item: NavItem, remove: boolean = false): void => {
        const { pageActive, pageActiveLink, pageActiveLinkMain } = this.styles;
        const action = remove ? "remove" : "add";

        const linkClasses = item.isMain ? pageActiveLinkMain : pageActiveLink;

        item.el.classList[action](...pageActive);
        item.link.classList[action](...linkClasses);

        if (!item.isMain) return;

        const scrollTopSpan = item.link.querySelector("span");

        remove && scrollTopSpan
            ? scrollTopSpan.remove()
            : item.link.insertAdjacentHTML(
                  "beforeend",
                  '<span class="pointer-events-none"><i aria-hidden="true" class="ml-2 fa-solid fa-arrow-up"></i></span>'
              );
    };

    private watchSectionVisibility =
        (item: NavItem): IntersectionObserverCallback =>
        (entries: IntersectionObserverEntry[]) => {
            const [{ isIntersecting }] = entries;

            const visibleStyles = [
                "!text-brand",
                "bg-light",
                "scale-x-[0.97]",
                "!border-brand",
            ];

            if (isIntersecting) {
                //Clear other simblimb items
                item.link.classList.add(...visibleStyles);
                return;
            }

            item.link.classList.remove(...visibleStyles);
        };

    /**
     * Syncs navbar with its router's state.
     * @param routeChanged Has the route changed since the last sync?
     */
    private syncActivePage(routeChanged: boolean = false) {
        // If the route is not different or the item is main, no need to call observer helpers.
        const observerIsOutofSync = ({ isMain }: NavItem) =>
            routeChanged && !isMain;

        // Get elements that are part of this route.
        const onThisPage = this.content.filter(
            (item) => item.path === this.router.current.path
        );

        // If had previously displayed items, remove the "ActivePage" styles.
        if (this.lastDisplayedItems) {
            this.lastDisplayedItems.forEach((prevItem) => {
                this.syncStyles(prevItem, true);
            });
        }

        onThisPage.forEach((newItem) => {
            this.syncStyles(newItem);
            if (observerIsOutofSync(newItem)) {
                // Observe section container
                newItem.observeSectionContainer(
                    this.watchSectionVisibility(newItem),
                    {
                        root: null,
                        rootMargin: "-35% 0px -60% 0px",
                    }
                );
            }
        });

        this.lastDisplayedItems = onThisPage;
    }

    private hydrateNav(routes: Route[]): void {
        const ul = document.createElement("ul");

        const ulContent = this.generateListContent(routes);
        this.content = ulContent;

        ul.addEventListener("click", (e) => this.handleNavigation(e));

        ulContent.forEach((li) => {
            ul.appendChild(li.el);
        });

        this.styleElem(ul, this.styles.list);

        const navCallback = (entries) => {
            const [{ target, isIntersecting }] = entries;

            // Can be improved
            const classes = [
                "!overflow-y-scroll",
                "!overflow-x-hidden",
                "md:max-h-[calc(100vh-var(--sticky-md-t-offset))]",
                "lg:max-h-[calc(100vh-var(--sticky-lg-t-offset))]",
                "xl:max-h-[calc(100vh-var(--sticky-xl-t-offset))]",
            ];

            if (!isIntersecting) {
                target.classList.add(...classes);
                return;
            }
            target.classList.remove(...classes);
        };

        createIntersectionObserver(this.root, navCallback, {
            root: null,
            threshold: 1,
            rootMargin: "0px 0px -10px 0px",
        });

        this.nav.appendChild(ul);
    }

    hydrate(routes: Route[]) {
        this.hydrateNav(routes);
        this.syncActivePage(true);
    }
}
