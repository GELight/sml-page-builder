import { SmlAttribute, SmlElement } from "@gelight/sml";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTag implements CustomTag {

    public node: SmlAttribute | SmlElement;
    public htmlBuilder: SmlToHtmlBuilder;
    public result: string = "";

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        this.node = node;
        this.htmlBuilder = htmlBuilder;
        this.result = "";
    }

    public getResult(): string {
        return this.result;
    }

    public async process(): Promise<CustomTag> {
        return this;
    }
}
