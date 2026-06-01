import { readFile } from "node:fs/promises";

import { App } from "./app";

const app = new App();

await app.bootstrap();

const content = await readFile(
    "./prompt.txt",
    "utf-8"
);

const question =
    content.split("\n")[0]?.trim() ?? "";

const result = app.analyzer.analyze(
    question
);

console.log(result);