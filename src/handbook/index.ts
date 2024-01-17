import { Router } from "./Router";
import { Nav } from "./Nav";

import type { Route } from "./Router";

import { nav, md } from "./styles";

const root = document.getElementById("content");
const navRoot = document.getElementById("side-nav");

export const routes: Route[] = [
    {
        path: "/",
        index: true,
        ext: "md",
        content: null,
    },
    {
        path: "/flight-sim",
        pathAlias: "/fly",
        ext: "md",
        navOptions: { ignoreSections: false },
    },
    {
        path: "/web-development",
        ext: "md",
        pathAlias: "web",
    },
    { path: "/typescript", ext: "md", navOptions: { ignoreSections: true } },
    {
        path: "/f1",
        ext: "md",
    },
];

const router = new Router(routes, root, "/handbook");

const sidebar = new Nav(navRoot, router);

(async function () {
    sidebar.init({ title: "Markdown viewer - Demo", styles: nav });

    await router.init({ markdownStyle: md });

    // Hydrate side nav with route content
    sidebar.hydrate(router.allRoutes);
})();
