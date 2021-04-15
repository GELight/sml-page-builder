import { SmlAttribute, SmlElement } from "@gelight/sml";
import SmlToHtmlBuilder from "../src/builder/SmlToHtmlBuilder";

interface ErrorConstructor {
    captureStackTrace(targetObject: Object, constructorOpt?: Function): void;
}

interface CustomTag {
    node: SmlAttribute | SmlElement;
    result: string;
    "constructor"(node: SmlAttribute | SmlElement, htmlBuilder: SmlToHtmlBuilder): any;
    process(node: SmlAttribute | SmlElement): string;
}