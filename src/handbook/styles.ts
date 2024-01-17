export interface Styles {
    [key: string]: string | string[];
}

/**
 * Markdown styles
 */
export const md: Styles = {
    div: "mx-[-2rem] xl:mx-[-4rem] px-8 xl:px-16 pt-8 mt-8 bg-white border-t-2 border-light scroll-mt-[calc(80px+120px)]",
    hr: "border-light",
    h2: [
        "text-5xl text-brand leading-[4.5rem]",
        "font-bold mb-16 pb-4 pt-8 my-4",
        "md:-mx-8 md:px-8 xl:-mx-16 xl:px-16",
        "bg-white/80 backdrop-blur-md z-20",
        // "bg-white/80 backdrop-blur-md xl:sticky xl:top-[80px] z-20",
        "border-b-2 border-light",
    ],
    h3: [
        "text-3xl text-black/100 font-bold bg-white/100",
        "md:-mx-8 md:px-8 xl:-mx-16 xl:px-16 py-2 mb-2",
        "scroll-mt-[120px] md:scroll-mt-[170px] xl:scroll-mt-[calc(201px+2rem)] z-10",
        // "scroll-mt-[120px] md:scroll-mt-[170px] xl:scroll-mt-[calc(201px+2rem)] xl:sticky xl:top-[calc(121px+80px)] z-10",
    ],
    h4: [
        "text-2xl font-bold text-black/80 py-4 border-light",
        "scroll-mt-[140px] md:scroll-mt-[180px] xl:scroll-mt-[calc(201px+4rem)]",
    ],
    h5: [
        "text-xl text-brand py-4",
        "scroll-mt-[calc(var(--header-height)+50px)]",
    ],
    p: "my-2 text-black/80",
    li: "py-2 border-b-[1px] border-white px-4",
    ul: "list-none list-inside border-l-brand bg-light2 border-l-4 shadow my-2 rounded-r-lg",
    ol: "list-decimal list-inside border-l-brand bg-light2 border-l-4 shadow my-2 rounded-r-lg",
    table: "w-full border-l-brand bg-light2 border-l-4 shadow my-2 rounded-r-lg",
    th: "font-bold px-4 py-2 border-b-brand border-b-2 text-left",
    td: "px-4 py-2 border-white border-b-2 border-l-2",
    a: "hover:underline font-bold text-brand",
    img: "my-8 shadow-lg rounded-lg",
    blockquote:
        "text-black/100 py-2 px-4 my-4 block text-xl border-l-2 rounded-tr-lg rounded-br-lg border-brand bg-darker dark:bg-dark-lighter shadow-inner",
    code: "px-[4px] py-[2px] text-pop bg-light rounded-md",
};

/**
 * Navigation styles
 */
export const nav: Styles = {
    title: "text-brand text-xl py-4",
    list: "list-inside flex flex-col pl-2 pb-4",
    listItem: "opacity-80",
    listMainLink: [
        "py-2 transition rounded-r-lg text-xl border-l-4 pl-2 border-light/10 pr-4 dark:!text-brand-LS block !no-underline",
    ],
    listSecondaryLink: [
        "py-2 rounded-r-lg duration-300 transition border-l-4 pl-2 pr-4 border-light border- block !no-underline",
    ],
    pageActive: "opacity-100",
    pageActiveLink: "border-light/100",
    pageActiveLinkMain: [
        "!font-bold !border-pop !text-brand !bg-light flex justify-between items-center",
    ],
};
