"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sml_1 = require("@gelight/sml");
const path = __importStar(require("path"));
class Page {
    constructor(file) {
        const fileContent = new sml_1.ReliableTxtFile().load(file).getContent();
        this.doc = sml_1.SmlDocument.parse(fileContent);
        this.file = file;
    }
    getPageDocument() {
        return this.doc;
    }
    getFolder() {
        return path.dirname(this.file);
    }
    getFileName() {
        return path.basename(this.file);
    }
    getFile() {
        return this.file;
    }
    getFilePath() {
        return this.filePath;
    }
    getHtmlFileName() {
        return this.getFileName()
            .replace(path.extname(this.getFile()), ".html");
    }
    getPagesFolder() {
        return this.PAGES_PATH;
    }
    setPagesFolder(p) {
        this.PAGES_PATH = p;
        this.filePath = this.getFile()
            .replace(this.PAGES_PATH, "")
            .replace(this.getFileName(), "");
    }
    setSlot(slot) {
        this.slot = slot;
    }
    getSlot() {
        return this.slot;
    }
    hasSlot() {
        return this.slot !== null;
    }
}
exports.default = Page;
//# sourceMappingURL=Page.js.map