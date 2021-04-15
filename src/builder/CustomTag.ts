import { SmlAttribute, SmlElement } from "@gelight/sml";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTag {

    protected node: SmlAttribute | SmlElement;
    protected htmlBuilder: SmlToHtmlBuilder;
    protected result: string = "";

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        this.node = node;
        this.htmlBuilder = htmlBuilder;
        this.result = "";
        this.process();
    }

    protected async process(): Promise<string> {
        return this.result;
    }
}