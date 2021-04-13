import { ReliableTxtFile } from "@gelight/sml";
import { SmlDocument } from "@gelight/sml";
import * as fs from "fs";
import * as fse from "fs-extra";
import mkdirp from "mkdirp";
import * as path from "path";
import SmlToHtmlBuilder from "./SmlToHtmlBuilder";

export default class SmlPageBuilder {

    private PAGES_PATH: string;
    private PAGES_OUTPUT_PATH: string;
    private CHILDREN_ELEMENT_NAME: string = "Children";
    private PAGE_CONFIG_ELEMENT_NAME: string = "PageConfig";
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

    public setPageConfigElementName(name: string): SmlPageBuilder {
        this.PAGE_CONFIG_ELEMENT_NAME = name;
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
                const fileContent: string = new ReliableTxtFile().load(`${filePath}/${file}`).getContent();
                const smlDocument: SmlDocument = SmlDocument.parse(fileContent);
                folder.push({
                    fileName: this.extractFileName(file),
                    filePath: this.extractFilePath(filePath),
                    page: smlDocument
                });
            }
        });

        return folder;
    }

    private extractFileName(file: string): string {
        const lastDotPos: number = file.lastIndexOf(".");
        const fileName: string = file.substr(0, lastDotPos < 0 ? file.length : lastDotPos) + ".html";
        return fileName.toLowerCase();
    }

    private extractFilePath(filePath: string): string {
        const extractedPath: string = filePath.replace(this.PAGES_PATH, "").toLowerCase();
        return extractedPath || "/";
    }

    private async generatePageStructure() {
        for (const pageItem of this.pages) {
            const htmlBuilder = new SmlToHtmlBuilder(pageItem.page)
                .setChildrenElementName(this.CHILDREN_ELEMENT_NAME)

            for (const [customTagName, customTag] of Object.entries(this.customTags)) {
                htmlBuilder.registerCustomTag(customTagName, customTag);
            }

            await htmlBuilder.build();
            this.saveHTMLFile(pageItem, htmlBuilder.getDomString());
        }

        this.provideAssets();
    }

    private saveHTMLFile(pageItem: any, domString: string): SmlPageBuilder {
        const folder = path.join(this.PAGES_OUTPUT_PATH, pageItem.filePath);
        const file = path.join(this.PAGES_OUTPUT_PATH, pageItem.filePath, pageItem.fileName);

        mkdirp.sync(folder);
        fs.writeFile(file, domString, () => {
            // ...
        });

        return this;
    }

    private provideAssets(): SmlPageBuilder {
        try {
            fse.copySync(this.ASSETS_PATH, this.PAGES_OUTPUT_PATH)
        } catch (e) {
            console.error(e);
        }

        return this;
    }

}
