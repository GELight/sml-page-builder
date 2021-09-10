import { SmlAttribute, SmlElement } from "@gelight/sml";
import SmlToHtmlBuilder from "../src/builder/SmlToHtmlBuilder";

interface ErrorConstructor {
    captureStackTrace(targetObject: unknown, constructorOpt?: () => void): void;
}

interface CustomTag {
    node: SmlAttribute | SmlElement;
    result: string;
    process(node: SmlAttribute | SmlElement): Promise<CustomTag>;
    getResult(): string;
    recursionAllowed?(): void;
    recursionForbidden?(): void;
    isRecursionAllowed?(): boolean;
}
