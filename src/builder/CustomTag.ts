import { SmlAttribute, SmlElement } from "@gelight/sml";
import { CustomTagText } from "..";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTag {

    protected node: SmlAttribute | SmlElement;
    protected htmlBuilder: SmlToHtmlBuilder;
    protected result: string = "";

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        this.node = node;
        this.htmlBuilder = htmlBuilder;
        this.result = "";
    }

    public getResult(): string {
        return this.result;
    }

    protected async process(): Promise<CustomTag> {
        return this;
    }
}