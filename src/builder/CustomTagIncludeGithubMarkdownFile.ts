import { SmlAttribute, SmlElement } from "@gelight/sml";
import * as https from "https";
import marked from "marked";
import CustomTag from "./CustomTag";

export default class CustomTagIncludeGithubMarkdownFile extends CustomTag {

    constructor(tagName: string, node: SmlAttribute | SmlElement) {
        super(tagName, node);
    }

    protected async process(): Promise<string> {
        if (this.node instanceof SmlAttribute) {
            if (this.node.name === this.tagName) {
                this.result = await this.include(this.node);
            }
        }
        return this.result;
    }

    private include(node: SmlAttribute): Promise<string> {
        const url = node.getValues()[0];
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let body = "";
                res.on("data", (chunk) => {
                    body += chunk;
                });
                res.on("end", () => {
                    body = this.fixBrokenLineBreaks(body);
                    const content = marked(body);
                    resolve(content);
                });
            }).on("error", (e) => {
                reject(e);
            });
        });
    }

    private fixBrokenLineBreaks(content: string): string {
        return content
            .replace(/\r\n|\r/g, "\n")
            .replace(/\t/g, "    ")
            .replace(/^[\w\<\>\*][^\n]*\n+/mg, (m) => {
                return /\n{2}/.test(m) ? m : m.replace(/\s+$/, "") + "  \n";
            });
    }

}
