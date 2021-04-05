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
                res.on("data", (d) => {
                    if (res.statusCode === 200) {
                        const content = marked(d.toString());
                        resolve(content);
                    }
                });
            }).on("error", (e) => {
                reject(e);
            });
        });
    }

}
