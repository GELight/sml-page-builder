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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sml_1 = require("@gelight/sml");
const CustomTag_1 = __importDefault(require("./CustomTag"));
class SmlToHtmlBuilder {
    constructor(page) {
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
                .getElements());
            return this;
        });
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
    getRegisteredCustomTags() {
        return this.customTags;
    }
    setRegisteredCustomTags(tags) {
        this.customTags = tags;
        return this;
    }
    setConfigFromHtmlBuilder(htmlBuilder) {
        this.setRegisteredCustomTags(htmlBuilder.getRegisteredCustomTags());
    }
    generateDomStringFromSmlDocument(childrenElements) {
        return __awaiter(this, void 0, void 0, function* () {
            let domString = "";
            for (const element of childrenElements) {
                const attrs = [];
                let innerText = "";
                if (this.isCustomTag(element)) {
                    const resolvedNode = yield this.resolveNode(element);
                    innerText += resolvedNode.getResult();
                }
                else {
                    for (const node of element.getAttributes()) {
                        if (this.isCustomTag(node)) {
                            const resolvedNode = yield this.resolveNode(node);
                            innerText += resolvedNode.getResult();
                        }
                        else {
                            attrs.push(this.buildAttribute(node));
                        }
                    }
                    for (const node of element.getElements()) {
                        if (this.isCustomTag(node)) {
                            const resolvedNode = yield this.resolveNode(node);
                            innerText += resolvedNode.getResult();
                        }
                        else {
                            innerText += yield this.generateDomStringFromSmlDocument([node]);
                        }
                    }
                }
                let openTag = "";
                let closeTag = "";
                if (element instanceof sml_1.SmlElement && !this.isCustomTag(element)) {
                    openTag = `<${element.name.toLowerCase()}${this.getAttributesAsString(attrs)}>`;
                    closeTag = `</${element.name.toLowerCase()}>`;
                }
                domString = domString.concat(openTag, innerText, closeTag);
            }
            return domString.replace(" >", ">");
        });
    }
    isCustomTag(node) {
        return node.name in this.customTags;
    }
    resolveNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isCustomTag(node)) {
                const tag = new this.customTags[node.name](node, this);
                return yield tag.process();
            }
            return new CustomTag_1.default(node, this);
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