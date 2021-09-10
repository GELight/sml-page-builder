import * as path from "path";
import CustomTagText from "./../builder/CustomTagText";
// import CustomTagSlot from "./../builder/CustomTagSlot";
// import CustomTagIncludeGithubMarkdownFile from "./../builder/CustomTagIncludeGithubMarkdownFile";
import SmlPageBuilder from "./../builder/SmlPageBuilder";

const PATH = path.resolve(__dirname, "..", "pages");
const OUTPUT_PATH = path.resolve(__dirname, "..", "sites");
const ASSETS_PATH = path.resolve(__dirname, "..", "src", "assets");

new SmlPageBuilder()
    .setAssetsPath(ASSETS_PATH)
    .setPagesPath(PATH)
    .setOutputPath(OUTPUT_PATH)
    .registerCustomTag("Text", CustomTagText)
//     .registerCustomTag("Slot", CustomTagSlot)
//     .registerCustomTag("IncludeGithubMarkdownFile", CustomTagIncludeGithubMarkdownFile)
    .build();
