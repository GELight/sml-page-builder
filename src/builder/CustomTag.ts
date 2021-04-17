import { SmlAttribute, SmlElement } from "@gelight/sml";
import { CustomTagText } from "..";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTag {

    protected node: SmlAttribute | SmlElement;
    protected htmlBuilder: SmlToHtmlBuilder;
    protected result: string = "";
    protected recursion: boolean = true;

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        this.node = node;
        this.htmlBuilder = htmlBuilder;
        this.result = "";
    }

    public getResult(): string {
        return this.result;
    }

    public recursionAllowed(): void {
        this.recursion = true;
    }

    public recursionForbidden(): void {
        this.recursion = false;
    }

    public isRecursionAllowed(): boolean {
        return this.recursion;
    }

    protected async process(): Promise<CustomTag> {
        return this;
    }
}