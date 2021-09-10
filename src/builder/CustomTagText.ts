import { SmlAttribute, SmlElement } from "@gelight/sml";
import CustomTag from "./CustomTag";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTagText extends CustomTag {

    public result: string = "";

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
            super(node, htmlBuilder);
    }

    public async process(): Promise<CustomTag> {
        if (this.node instanceof SmlAttribute) {
            this.result = this.node.getValues().join(" ");
        }
        return this;
    }

    public getResult(): string {
        return this.result;
    }

}
