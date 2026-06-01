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

try {

    const result =
        await app.processor.process(question);

    console.log(result);

} catch (error) {

    if (error instanceof Error) {
        console.log(error.message);
        process.exit(1);
    }

    throw error;
}