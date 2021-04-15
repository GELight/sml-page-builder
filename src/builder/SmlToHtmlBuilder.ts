import { SmlAttribute, SmlDocument, SmlElement, StringUtil } from "@gelight/sml";
import * as https from "https";

export default class SmlToHtmlBuilder {

    private doc: SmlDocument;
    private CHILDREN_ELEMENT_NAME: string = "Children";

    private domString: string;
    private customTags: any = {};

    constructor(doc: SmlDocument) {
        this.doc = doc;
        return this;
    }

    public async build(): Promise<SmlToHtmlBuilder> {
        this.domString = await this.generateDomStringFromSmlDocument(
            this.doc.getRoot().getElements(this.CHILDREN_ELEMENT_NAME)
        );
        return this;
    }

    public setChildrenElementName(name: string): SmlToHtmlBuilder {
        this.CHILDREN_ELEMENT_NAME = name;
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

    private async generateDomStringFromSmlDocument(childrenElements: SmlElement[]): Promise<string> {
        let domString = "";

        for (const element of childrenElements) {
            for (const node of element.nodes) {

                const attrs = [];
                let textContent = "";
                let childrenContent = "";

                if (node instanceof SmlAttribute) {
                    if (this.isCustomTag(node)) {
                        textContent += await this.resolveNode(node);
                    } else {
                        attrs.push(this.buildAttribute(node));
                    }
                }

                if (node instanceof SmlElement) {
                    if (this.isCustomTag(node)) {
                        textContent += await this.resolveNode(node);
                    } else {
                        for (const attr of node.getAttributes()) {
                            if (this.isCustomTag(attr)) {
                                textContent += await this.resolveNode(attr);
                            } else {
                                attrs.push(this.buildAttribute(attr));
                            }
                        }
                    }

                    if (node.hasElement(this.CHILDREN_ELEMENT_NAME)) {
                        childrenContent = await this.generateDomStringFromSmlDocument(
                            node.getElements(this.CHILDREN_ELEMENT_NAME)
                        );
                    }
                }

                let openTag = "";
                let closeTag = "";
                if (!this.isCustomTag(node)) {
                    openTag = `<${node.name.toLowerCase()}${this.getAttributesAsString(attrs)}>`;
                    closeTag = `</${node.name.toLowerCase()}>`;
                }

                domString = domString.concat(openTag, textContent, childrenContent, closeTag);
            }
        }

        return domString.replace(" >", ">");
    }

    private isCustomTag(node: SmlAttribute | SmlElement): boolean {
        return node.name in this.customTags;
    }

    private async resolveNode(node: SmlAttribute | SmlElement): Promise<string> {
        const tag = new this.customTags[node.name](node, this);
        return await tag.process();
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
