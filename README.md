# Markdown viewer

This project took shape in response to a specific requirement within a flight simulator community I was a developer for. The realization that our site lacked proper documentation led to the inception of this project, aiming to address the community's need for accessible and organized information.

> The content found on other pages was generated using AI for the purpose of this demo.

## How it works

Fetches markdown files from a defined routes array. It then parses the files to build HTML documents and hydrates a navigation component based on the content of the files.

> This is an example of what it looks like for this demo

```ts
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
```
