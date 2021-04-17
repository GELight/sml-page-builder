import { SmlAttribute, SmlElement } from "@gelight/sml";
import * as fs from "fs";
import CustomTag from "./CustomTag";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTagLayout extends CustomTag {

    private file: string;

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        super(node, htmlBuilder);
    }

    protected async process(): Promise<string> {
        if (this.node instanceof SmlElement) {
            this.file = this.node.getAttribute("file").getValues()[0];

            // console.log(this.htmlBuilder.getPage().getFolder());

            // try {
            //     const data = fs.readFileSync(this.file, "utf8");
            //     console.log(data);
            // } catch (e) {
            //     console.error(e);
            // }

        }
        return this.result;
    }
}
