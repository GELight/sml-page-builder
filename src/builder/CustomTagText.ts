import { SmlAttribute, SmlElement, StringUtil } from "@gelight/sml";
import CustomTag from "./CustomTag";

export default class CustomTagText extends CustomTag {

    constructor(tagName: string, node: SmlAttribute | SmlElement) {
        super(tagName, node);
    }

    protected async process(): Promise<string> {
        if (this.node instanceof SmlAttribute) {
            if (this.node.name === this.tagName) {
                this.result = this.node.getValues().join(" ");
            }
        }
        return this.result;
    }
}
