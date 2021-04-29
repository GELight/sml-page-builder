import { SmlAttribute, SmlElement } from "@gelight/sml";
import * as path from "path";
import CustomTag from "./CustomTag";
import Page from "./Page";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class CustomTagSlot extends CustomTag {

    private file: string;

    constructor(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder) {
        super(node, htmlBuilder);
    }

    protected async process(): Promise<CustomTagSlot> {
        if (this.node instanceof SmlElement) {
            this.result = await this.toProcessElement();
        } else if (this.node instanceof SmlAttribute) {
            this.result = await this.toProcessAttribute();
        }
        return this;
    }

    private async toProcessElement(): Promise<string> {
        this.file = this.node.getAttribute("From").getValues()[0];
        const folder = this.htmlBuilder.getPage().getFolder();
        const filePath = path.join(folder, this.file);

        const page = new Page(filePath);
        page.setPagesFolder(folder);

        console.log(this.node);
        page.setSlot(this.node);

        const newHtmlBuilder = new SmlToHtmlBuilder(page);
        newHtmlBuilder.setConfigFromHtmlBuilder(this.htmlBuilder);

        await newHtmlBuilder.build();
        return newHtmlBuilder.getDomString();
    }

    private async toProcessAttribute(): Promise<string> {
        const currentSlot = this.node.getValues()[0];
        const slotName = this.htmlBuilder.getPage().getSlot().getAttribute("Name").getValues()[0];
        console.log(currentSlot, slotName);
        console.log(this.htmlBuilder.getPage().getSlot());
        if (currentSlot === slotName) {
            return this.htmlBuilder.generateDomStringFromSmlDocument(
                this.htmlBuilder.getPage().getSlot().getElements()
            );
        }

        return "";
    }
}
