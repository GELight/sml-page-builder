import { SmlAttribute, SmlElement } from "@gelight/sml";

export default class CustomTag {

    protected node: SmlAttribute | SmlElement;
    protected tagName: string = "";
    protected result: string = "";

    constructor(tagName: string, node: SmlAttribute | SmlElement) {
        this.tagName = tagName;
        this.node = node;
        this.result = "";
        this.process();
    }

    protected async process(): Promise<string> {
        return this.result;
    }
}