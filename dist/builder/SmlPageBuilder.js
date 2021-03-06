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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const fse = __importStar(require("fs-extra"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path = __importStar(require("path"));
const Page_1 = __importDefault(require("./Page"));
const SmlToHtmlBuilder_1 = __importDefault(require("./SmlToHtmlBuilder"));
class SmlPageBuilder {
    constructor() {
        this.pages = [];
        this.customTags = {};
        return this;
    }
    setPagesPath(url) {
        this.PAGES_PATH = url;
        return this;
    }
    setOutputPath(p) {
        this.PAGES_OUTPUT_PATH = p;
        return this;
    }
    setAssetsPath(p) {
        this.ASSETS_PATH = p;
        return this;
    }
    build() {
        this.pages = this.getAllFiles(this.PAGES_PATH, []);
        this.generatePageStructure();
        return this;
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
    getAllFiles(filePath, filesList) {
        const files = fs.readdirSync(filePath);
        let folder = filesList || [];
        files.forEach((file) => {
            if (fs.statSync(filePath + "/" + file).isDirectory()) {
                folder = this.getAllFiles(`${filePath}/${file}`, folder);
            }
            else {
                const page = new Page_1.default(`${filePath}/${file}`);
                page.setPagesFolder(this.PAGES_PATH);
                folder.push(page);
            }
        });
        return folder;
    }
    generatePageStructure() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const smlPage of this.pages) {
                const htmlBuilder = new SmlToHtmlBuilder_1.default(smlPage);
                for (const [customTagName, customTag] of Object.entries(this.customTags)) {
                    htmlBuilder.registerCustomTag(customTagName, customTag);
                }
                yield htmlBuilder.build();
                this.saveHTMLFile(smlPage, htmlBuilder.getDomString());
            }
            this.provideAssets();
        });
    }
    saveHTMLFile(page, domString) {
        const folder = path.join(this.PAGES_OUTPUT_PATH, page.getFilePath());
        const file = path.join(this.PAGES_OUTPUT_PATH, page.getFilePath(), page.getHtmlFileName());
        mkdirp_1.default.sync(folder);
        fs.writeFile(file, domString, () => {
            // ...
        });
        return this;
    }
    provideAssets() {
        try {
            fse.copySync(this.ASSETS_PATH, this.PAGES_OUTPUT_PATH);
        }
        catch (e) {
            console.error(e);
        }
        return this;
    }
}
exports.default = SmlPageBuilder;
//# sourceMappingURL=SmlPageBuilder.js.map