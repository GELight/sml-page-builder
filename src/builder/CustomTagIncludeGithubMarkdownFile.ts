import { SmlAttribute, SmlElement } from "@gelight/sml";
import * as https from "https";
import marked from "marked";
import CustomTag from "./CustomTag";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTagIncludeGithubMarkdownFile extends CustomTag {

    private HOST: string = "";
    private FILE_PATH: string = "";

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        super(node, htmlBuilder);
    }

    public async process(): Promise<CustomTagIncludeGithubMarkdownFile> {
        if (this.node instanceof SmlAttribute) {
            this.result = await this.include(this.node);
        }
        return this;
    }

    private include(node: SmlAttribute): Promise<string> {
        this.HOST = node.getValues()[0];
        this.FILE_PATH = node.getValues()[1];

        const url = this.HOST + this.FILE_PATH;

        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let body = "";
                res.on("data", (chunk) => {
                    body += chunk;
                });
                res.on("end", () => {
                    body = this.fixBrokenLineBreaks(body);
                    body = this.fixImageSrc(body);
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
            .replace(/^[\w<>*][^\n]*\n+/mg, (m) => {
                return /\n{2}/.test(m) ? m : m.replace(/\s+$/, "") + "  \n";
            });
    }

    private fixImageSrc(content: string): string {
        /**
         * Example:
         * ![Preambles](/Images/Preambles.svg)
         * to
         * ![Preambles](https://............./Images/Preambles.svg)
         */
        return content.replace(/]\(\//g, `](${this.HOST}/`);
    }

}
