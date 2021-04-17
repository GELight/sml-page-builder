import { SmlAttribute, SmlElement } from "@gelight/sml";
import CustomTag from "./CustomTag";
import Page from "./Page";

export default class SmlToHtmlBuilder {

    private PAGE: Page;

    private CHILDREN_ELEMENT_NAME: string = "Children";
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
                .getElements(this.CHILDREN_ELEMENT_NAME)
        );
        return this;
    }

    public setChildrenElementName(name: string): SmlToHtmlBuilder {
        this.CHILDREN_ELEMENT_NAME = name;
        return this;
    }

    public getChildrenElementName(): string {
        return this.CHILDREN_ELEMENT_NAME;
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
        this.setChildrenElementName(htmlBuilder.getChildrenElementName());
        this.setRegisteredCustomTags(htmlBuilder.getRegisteredCustomTags());
    }

    public async generateDomStringFromSmlDocument(childrenElements: SmlElement[]): Promise<string> {
        let domString = "";

        for (const element of childrenElements) {
            for (const node of element.nodes) {
                const attrs = [];
                let innerText = "";

                if (node instanceof SmlAttribute) {
                    if (this.isCustomTag(node)) {
                        const resolvedNode = await this.resolveNode(node);
                        innerText += resolvedNode.getResult();
                    }
                }

                if (node instanceof SmlElement) {
                    if (this.isCustomTag(node)) {
                        const resolvedNode = await this.resolveNode(node);
                        innerText += resolvedNode.getResult();
                    } else {
                        for (const attr of node.getAttributes()) {
                            if (this.isCustomTag(attr)) {
                                const resolvedNode = await this.resolveNode(attr);
                                innerText += resolvedNode.getResult();
                            } else {
                                attrs.push(this.buildAttribute(attr));
                            }
                        }
                        if (node.hasElement(this.CHILDREN_ELEMENT_NAME)) {
                            innerText = await this.generateDomStringFromSmlDocument(
                                node.getElements(this.CHILDREN_ELEMENT_NAME)
                            );
                        }
                    }
                }

                let openTag = "";
                let closeTag = "";
                if (node instanceof SmlElement && !this.isCustomTag(node)) {
                    openTag = `<${node.name.toLowerCase()}${this.getAttributesAsString(attrs)}>`;
                    closeTag = `</${node.name.toLowerCase()}>`;
                }

                domString = domString.concat(openTag, innerText, closeTag);
            }
        }

        return domString.replace(" >", ">");
    }

    private isCustomTag(node: SmlAttribute | SmlElement): boolean {
        return node.name in this.customTags;
    }

    private async resolveNode(node: SmlAttribute | SmlElement): Promise<CustomTag> {
        if (node.name in this.customTags) {
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
