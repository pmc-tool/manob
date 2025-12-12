export function detectLanguage(filename: string = ""): string {
  const ext = filename.split(".").pop()?.toLowerCase();

  const map: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    html: "html",
    css: "css",
    scss: "scss",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    sql: "sql",
    py: "python",
    php: "php",
    go: "go",
    rs: "rust",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    java: "java",
    sh: "shell",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",
    vue: "vue",
    svelte: "svelte",
    astro: "astro",
  };

  return map[ext ?? ""] ?? "plaintext";
}
