import * as path from "path";
import CustomTagIncludeGithubMarkdownFile from "./../builder/CustomTagIncludeGithubMarkdownFile";
import CustomTagText from "./../builder/CustomTagText";
import SmlPageBuilder from "./../builder/SmlPageBuilder";

const PATH = path.resolve(__dirname, "..", "pages");
const OUTPUT_PATH = path.resolve(__dirname, "..", "sites");

new SmlPageBuilder()
    .setChildrenElementName("Children")
    .setPagesPath(PATH)
    .setOutputPath(OUTPUT_PATH)
    .registerCustomTag("Text", CustomTagText)
    .registerCustomTag("Include", CustomTagIncludeGithubMarkdownFile)
    .build();

export default {};
