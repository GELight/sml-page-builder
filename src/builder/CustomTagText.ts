import { SmlAttribute, SmlElement, StringUtil } from "@gelight/sml";
import CustomTag from "./CustomTag";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTagText extends CustomTag {

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        super(node, htmlBuilder);
    }

    protected async process(): Promise<string> {
        if (this.node instanceof SmlAttribute) {
            this.result = this.node.getValues().join(" ");
        }
        return this.result;
    }
}
