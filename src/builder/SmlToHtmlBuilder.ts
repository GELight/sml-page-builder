import { SmlAttribute, SmlElement } from "@gelight/sml";
import CustomTag from "./CustomTag";
import Page from "./Page";

export default class SmlToHtmlBuilder {

    private PAGE: Page;
    private customTags: any = {};
    private domString: string;

    constructor(page: Page) {
        this.PAGE = page;
        return this;
    }

    public getPage() {
        return this.PAGE;
    }

    public async build(): Promise<SmlToHtmlBuilder> {
        this.domString = await this.generateDomStringFromSmlDocument(
            this.PAGE.getPageDocument()
                .getRoot()
                .getElements()
        );
        return this;
    }

    public getDomString(): string {
        return this.domString;
    }

    public registerCustomTag(tagName: string, customTag: any): SmlToHtmlBuilder {
        if (!this.customTags[tagName]) {
            this.customTags[tagName] = customTag;
        } else {
            console.warn(`Custom tag '${tagName}' already registered!`);
        }
        return this;
    }

    public getRegisteredCustomTags(): any {
        return this.customTags;
    }

    public setRegisteredCustomTags(tags: any): SmlToHtmlBuilder {
        this.customTags = tags;
        return this;
    }

    public setConfigFromHtmlBuilder(htmlBuilder: SmlToHtmlBuilder): any {
        this.setRegisteredCustomTags(htmlBuilder.getRegisteredCustomTags());
    }

    public async generateDomStringFromSmlDocument(childrenElements: SmlElement[]): Promise<string> {
        let domString = "";

        for (const element of childrenElements) {

            const attrs = [];
            let innerText = "";

            if (this.isCustomTag(element)) {
                const resolvedNode = await this.resolveNode(element);
                innerText += resolvedNode.getResult();
            } else {

                for (const node of element.getAttributes()) {
                    if (this.isCustomTag(node)) {
                        const resolvedNode = await this.resolveNode(node);
                        innerText += resolvedNode.getResult();
                    } else {
                        attrs.push(this.buildAttribute(node));
                    }
                }

                for (const node of element.getElements()) {

                    if (this.isCustomTag(node)) {
                        const resolvedNode = await this.resolveNode(node);
                        innerText += resolvedNode.getResult();
                    } else {
                        innerText += await this.generateDomStringFromSmlDocument([node]);
                    }

                }

            }

            let openTag = "";
            let closeTag = "";
            if (element instanceof SmlElement && !this.isCustomTag(element)) {
                openTag = `<${element.name.toLowerCase()}${this.getAttributesAsString(attrs)}>`;
                closeTag = `</${element.name.toLowerCase()}>`;
            }

            domString = domString.concat(openTag, innerText, closeTag);
        }

        return domString.replace(" >", ">");
    }

    private isCustomTag(node: SmlAttribute | SmlElement): boolean {
        return node.name in this.customTags;
    }

    private async resolveNode(node: SmlAttribute | SmlElement): Promise<CustomTag> {
        if (this.isCustomTag(node)) {
            const tag = new this.customTags[node.name](node, this);
            return await tag.process();
        }
        return new CustomTag(node, this);
    }

    private buildAttribute(node: SmlAttribute): any {
        const attribute = {};
        attribute[node.name.toLowerCase()] = node.getValues().join(" ");
        return attribute;
    }

    private getAttributesAsString(attrs): string {
        const attributes = attrs.map((a: string) => {
            return `${Object.entries(a)[0][0]}="${Object.entries(a)[0][1]}"`;
        });
        if (attributes.length) {
            return " " + attributes.join(" ");
        }
        return "";
    }
}
