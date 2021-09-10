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
const https = __importStar(require("https"));
const marked_1 = __importDefault(require("marked"));
const CustomTag_1 = __importDefault(require("./CustomTag"));
class CustomTagIncludeGithubMarkdownFile extends CustomTag_1.default {
    constructor(node, htmlBuilder) {
        super(node, htmlBuilder);
        this.HOST = "";
        this.FILE_PATH = "";
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.node instanceof sml_1.SmlAttribute) {
                this.result = yield this.include(this.node);
            }
            return this;
        });
    }
    include(node) {
        this.HOST = node.getValues()[0];
        this.FILE_PATH = node.getValues()[1];
        const url = this.HOST + this.FILE_PATH;
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let body = "";
                res.on("data", (chunk) => {
                    body += chunk;
                });
                res.on("end", () => {
                    body = this.fixBrokenLineBreaks(body);
                    body = this.fixImageSrc(body);
                    const content = (0, marked_1.default)(body);
                    resolve(content);
                });
            }).on("error", (e) => {
                reject(e);
            });
        });
    }
    fixBrokenLineBreaks(content) {
        return content
            .replace(/\r\n|\r/g, "\n")
            .replace(/\t/g, "    ")
            .replace(/^[\w<>*][^\n]*\n+/mg, (m) => {
            return /\n{2}/.test(m) ? m : m.replace(/\s+$/, "") + "  \n";
        });
    }
    fixImageSrc(content) {
        /**
         * Example:
         * ![Preambles](/Images/Preambles.svg)
         * to
         * ![Preambles](https://............./Images/Preambles.svg)
         */
        return content.replace(/]\(\//g, `](${this.HOST}/`);
    }
}
exports.default = CustomTagIncludeGithubMarkdownFile;
//# sourceMappingURL=CustomTagIncludeGithubMarkdownFile.js.map