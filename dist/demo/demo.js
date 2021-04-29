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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const CustomTagIncludeGithubMarkdownFile_1 = __importDefault(require("./../builder/CustomTagIncludeGithubMarkdownFile"));
const CustomTagSlot_1 = __importDefault(require("./../builder/CustomTagSlot"));
const CustomTagText_1 = __importDefault(require("./../builder/CustomTagText"));
const SmlPageBuilder_1 = __importDefault(require("./../builder/SmlPageBuilder"));
const PATH = path.resolve(__dirname, "..", "pages");
const OUTPUT_PATH = path.resolve(__dirname, "..", "sites");
const ASSETS_PATH = path.resolve(__dirname, "..", "src", "assets");
new SmlPageBuilder_1.default()
    .setAssetsPath(ASSETS_PATH)
    .setPagesPath(PATH)
    .setOutputPath(OUTPUT_PATH)
    .registerCustomTag("Text", CustomTagText_1.default)
    .registerCustomTag("Slot", CustomTagSlot_1.default)
    .registerCustomTag("IncludeGithubMarkdownFile", CustomTagIncludeGithubMarkdownFile_1.default)
    .build();
//# sourceMappingURL=demo.js.map