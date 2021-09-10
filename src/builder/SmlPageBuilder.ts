import * as fs from "fs";
import * as fse from "fs-extra";
import mkdirp from "mkdirp";
import * as path from "path";
import { CustomTag } from "..";
import Page from "./Page";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class SmlPageBuilder {

    private PAGES_PATH: string;
    private PAGES_OUTPUT_PATH: string;
    private ASSETS_PATH: string;

    private pages: Page[];
    private customTags: any = {};

    constructor() {
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
        this.pages = this.getAllFiles(this.PAGES_PATH);
        this.generatePageStructure();
        return this;
    }

    public registerCustomTag(tagName: string, customTag: CustomTag): SmlPageBuilder {
        if (!this.customTags[tagName]) {
            this.customTags[tagName] = customTag;
        } else {
            console.warn(`Custom tag '${tagName}' already registered!`);
        }
        return this;
    }

    private getAllFiles(filePath: string): Page[] {
        const directoryFiles: string[] = fs.readdirSync(filePath);
        let pages: Page[] = [];

        directoryFiles.forEach((file) => {
            if (fs.statSync(filePath + "/" + file).isDirectory()) {
                pages = this.getAllFiles(`${filePath}/${file}`);
            } else {
                const page: Page = new Page(`${filePath}/${file}`);
                page.setPagesFolder(this.PAGES_PATH);
                pages.push(page);
            }
        });
        return pages;
    }

    private async generatePageStructure() {
        console.log(this.pages);
        // for (const page of this.pages) {
        //     const htmlBuilder = new SmlToHtmlBuilder(page);

        //     for (const [customTagName, customTag] of Object.entries(this.customTags)) {
        //         htmlBuilder.registerCustomTag(customTagName, customTag);
        //     }

        //     await htmlBuilder.build();
        //     this.saveHTMLFile(page, htmlBuilder.getDomString());
        // }

        // this.provideAssets();
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
