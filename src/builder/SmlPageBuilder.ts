import { ReliableTxtFile } from "@gelight/sml";
import { SmlDocument } from "@gelight/sml";
import * as fs from "fs";
import * as fse from "fs-extra";
import mkdirp from "mkdirp";
import * as path from "path";
import Page from "./Page";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class SmlPageBuilder {

    private PAGES_PATH: string;
    private PAGES_OUTPUT_PATH: string;
    private CHILDREN_ELEMENT_NAME: string = "Children";
    private ASSETS_PATH: string;

    private pages: any[] = [];
    private customTags: any = {};

    constructor() {
        return this;
    }

    public setChildrenElementName(name: string): SmlPageBuilder {
        this.CHILDREN_ELEMENT_NAME = name;
        return this;
    }

    public setPagesPath(url: string): SmlPageBuilder {
        this.PAGES_PATH = url;
        return this;
    }

    public setOutputPath(p: string): SmlPageBuilder {
        this.PAGES_OUTPUT_PATH = p;
        return this;
    }

    public setAssetsPath(p: string): SmlPageBuilder {
        this.ASSETS_PATH = p;
        return this;
    }

    public build(): SmlPageBuilder {
        this.pages = this.getAllFiles(this.PAGES_PATH, []);
        this.generatePageStructure();
        return this;
    }

    public registerCustomTag(tagName: string, customTag: any): SmlPageBuilder {
        if (!this.customTags[tagName]) {
            this.customTags[tagName] = customTag;
        } else {
            console.warn(`Custom tag '${tagName}' already registered!`);
        }
        return this;
    }

    private getAllFiles(filePath: string, filesList: string[]): string[] {
        const files = fs.readdirSync(filePath);
        let folder: any = filesList || [];

        files.forEach((file) => {
            if (fs.statSync(filePath + "/" + file).isDirectory()) {
                folder = this.getAllFiles(`${filePath}/${file}`, folder);
            } else {
                const page = new Page(`${filePath}/${file}`);
                page.setPagesFolder(this.PAGES_PATH);
                folder.push(page);
            }
        });

        return folder;
    }

    private async generatePageStructure() {
        for (const smlPage of this.pages) {
            const htmlBuilder = new SmlToHtmlBuilder(smlPage)
                .setChildrenElementName(this.CHILDREN_ELEMENT_NAME);

            for (const [customTagName, customTag] of Object.entries(this.customTags)) {
                htmlBuilder.registerCustomTag(customTagName, customTag);
            }

            await htmlBuilder.build();
            this.saveHTMLFile(smlPage, htmlBuilder.getDomString());
        }

        this.provideAssets();
    }

    private saveHTMLFile(page: Page, domString: string): SmlPageBuilder {
        const folder = path.join(this.PAGES_OUTPUT_PATH, page.getFilePath());
        const file = path.join(this.PAGES_OUTPUT_PATH, page.getFilePath(), page.getHtmlFileName());

        mkdirp.sync(folder);
        fs.writeFile(file, domString, () => {
            // ...
        });

        return this;
    }

    private provideAssets(): SmlPageBuilder {
        try {
            fse.copySync(this.ASSETS_PATH, this.PAGES_OUTPUT_PATH);
        } catch (e) {
            console.error(e);
        }

        return this;
    }

}
