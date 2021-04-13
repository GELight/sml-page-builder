import { SmlAttribute, SmlElement } from "@gelight/sml";

interface ErrorConstructor {
    captureStackTrace(targetObject: Object, constructorOpt?: Function): void;
}

interface CustomTag {
    node: SmlAttribute | SmlElement;
    tagName: string;
    result: string;
    "constructor"(tagName: string, node: SmlAttribute | SmlElement): any;
    process(node: SmlAttribute | SmlElement): string;
}