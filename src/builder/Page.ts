import { ReliableTxtFile, SmlDocument } from "@gelight/sml";
import * as path from "path";

export default class Page {

    private PAGES_PATH: string;

    private doc: SmlDocument;
    private file: string;
    private filePath: string;

    constructor(file: string) {
        const fileContent: string = new ReliableTxtFile().load(file).getContent();
        this.doc = SmlDocument.parse(fileContent);
        this.file = file;
    }

    public getPageDocument(): SmlDocument {
        return this.doc;
    }

    public getFolder(): string {
        return path.dirname(this.file);
    }

    public getFileName(): string {
        return path.basename(this.file);
    }

    public getFile(): string {
        return this.file;
    }

    public getFilePath(): string {
        return this.filePath;
    }

    public getHtmlFileName(): string {
        return this.getFileName()
            .replace(path.extname(this.getFile()), ".html");
    }

    public setPagesFolder(p: string) {
        this.PAGES_PATH = p;
        this.filePath = this.getFile()
            .replace(this.PAGES_PATH, "")
            .replace(this.getFileName(), "");
    }

    public getPagesFolder(): string {
        return this.PAGES_PATH;
    }
}
