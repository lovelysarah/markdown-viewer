# Markdown viewer

This project took shape in response to a specific requirement within a flight simulator community I was a developer for. The realization that our site lacked proper documentation led to the inception of this project, aiming to address the community's need for accessible and organized information.

> The content found on other pages was generated using AI for the purpose of this demo.

**Live demo**: https://md.viewer.sarahrobichaud.dev

As this was extracted from another fairly big project, I just "made it work" quickly to put up a demo. It was written years ago and needs clean up, the routing and styles system could benefit from an overhaul, I plan to slowly improve this over time to properly make it into its own thing.

## Deploy locally 

Clone the repo
```sh
git clone https://github.com/sarahrobichaud/markdown-viewer.git
```
```sh
cd markdown-viewer
```
Add and remove content by adding or removing files from the `handbook` directory and adjuste the `routes` in `src/index.ts`

Install dependencies and build the project
```sh
npm i && npm run build
```
Start the server
```
node server.js
```


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
## In production

![Production image 1](https://media.githubusercontent.com/media/sarahrobichaud/markdown-viewer/main/assets/images/handbook-2.png)


![Production image 1](https://media.githubusercontent.com/media/sarahrobichaud/markdown-viewer/main/assets/images/handbook-1.png)
