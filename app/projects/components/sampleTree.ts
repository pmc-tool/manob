// sampleTree.ts

export type FileNode = {
    id: string;
    name: string;
    path: string;
    type: "file" | "folder";
    children?: FileNode[];
};

const sampleTree: FileNode[] = [
    {
        id: "1",
        name: "app",
        path: "/app",
        type: "folder",
        children: [
            { id: "1-1", name: "page.tsx", path: "/app/page.tsx", type: "file" },
        ],
    },
    {
        id: "2",
        name: "components",
        path: "/components",
        type: "folder",
        children: [
            {
                id: "2-1",
                name: "Header.tsx",
                path: "/components/Header.tsx",
                type: "file",
            },
            {
                id: "2-2",
                name: "Footer.tsx",
                path: "/components/Footer.tsx",
                type: "file",
            },
        ],
    },
    {
        id: "3",
        name: "hooks",
        path: "/hooks",
        type: "folder",
        children: [
            {
                id: "3-1",
                name: "use-mobile.ts",
                path: "/hooks/use-mobile.ts",
                type: "file",
            },
            {
                id: "3-2",
                name: "use-toast.ts",
                path: "/hooks/use-toast.ts",
                type: "file",
            },
        ],
    },
    {
        id: "4",
        name: "context",
        path: "/context",
        type: "folder",
        children: [
            {
                id: "4-1",
                name: "UserContext.tsx",
                path: "/context/UserContext.tsx",
                type: "file",
            },
        ],
    },
    {
        id: "5",
        name: "styles",
        path: "/styles",
        type: "folder",
        children: [
            {
                id: "5-1",
                name: "global.css",
                path: "/styles/global.css",
                type: "file",
            },
        ],
    },
    {
        id: "6",
        name: "utils",
        path: "/utils",
        type: "folder",
        children: [
            { id: "6-1", name: "format.ts", path: "/utils/format.ts", type: "file" },
        ],
    },
    {
        id: "7",
        name: "data",
        path: "/data",
        type: "folder",
        children: [
            { id: "7-1", name: "menu.json", path: "/data/menu.json", type: "file" },
        ],
    },
    {
        id: "8",
        name: "api",
        path: "/api",
        type: "folder",
        children: [
            { id: "8-1", name: "user.ts", path: "/api/user.ts", type: "file" },
        ],
    },
    { id: "9", name: "package.json", path: "/package.json", type: "file" },
    { id: "10", name: "README.md", path: "/README.md", type: "file" },
];

export default sampleTree;
