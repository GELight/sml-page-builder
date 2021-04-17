"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sml_1 = require("@gelight/sml");
class SmlToHtmlBuilder {
    constructor(page) {
        this.CHILDREN_ELEMENT_NAME = "Children";
        this.customTags = {};
        this.PAGE = page;
        return this;
    }
    getPage() {
        return this.PAGE;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.domString = yield this.generateDomStringFromSmlDocument(this.PAGE.getPageDocument()
                .getRoot()
                .getElements(this.CHILDREN_ELEMENT_NAME));
            return this;
        });
    }
    setPageBuilderInstance(pageBuilder) {
        this.PAGE_BUILDER = pageBuilder;
        return this;
    }
    setChildrenElementName(name) {
        this.CHILDREN_ELEMENT_NAME = name;
        return this;
    }
    getDomString() {
        return this.domString;
    }
    registerCustomTag(tagName, customTag) {
        if (!this.customTags[tagName]) {
            this.customTags[tagName] = customTag;
        }
        else {
            console.warn(`Custom tag '${tagName}' already registered!`);
        }
        return this;
    }
    generateDomStringFromSmlDocument(childrenElements) {
        return __awaiter(this, void 0, void 0, function* () {
            let domString = "";
            for (const element of childrenElements) {
                for (const node of element.nodes) {
                    const attrs = [];
                    let textContent = "";
                    let childrenContent = "";
                    if (node instanceof sml_1.SmlAttribute) {
                        if (this.isCustomTag(node)) {
                            textContent += yield this.resolveNode(node);
                        }
                        else {
                            attrs.push(this.buildAttribute(node));
                        }
                    }
                    if (node instanceof sml_1.SmlElement) {
                        if (this.isCustomTag(node)) {
                            textContent += yield this.resolveNode(node);
                        }
                        else {
                            for (const attr of node.getAttributes()) {
                                if (this.isCustomTag(attr)) {
                                    textContent += yield this.resolveNode(attr);
                                }
                                else {
                                    attrs.push(this.buildAttribute(attr));
                                }
                            }
                        }
                        if (node.hasElement(this.CHILDREN_ELEMENT_NAME)) {
                            childrenContent = yield this.generateDomStringFromSmlDocument(node.getElements(this.CHILDREN_ELEMENT_NAME));
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
        });
    }
    isCustomTag(node) {
        return node.name in this.customTags;
    }
    resolveNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = new this.customTags[node.name](node, this);
            return yield tag.process();
        });
    }
    buildAttribute(node) {
        const attribute = {};
        attribute[node.name.toLowerCase()] = node.getValues().join(" ");
        return attribute;
    }
    getAttributesAsString(attrs) {
        const attributes = attrs.map((a) => {
            return `${Object.entries(a)[0][0]}="${Object.entries(a)[0][1]}"`;
        });
        if (attributes.length) {
            return " " + attributes.join(" ");
        }
        return "";
    }
}
exports.default = SmlToHtmlBuilder;
//# sourceMappingURL=SmlToHtmlBuilder.js.map