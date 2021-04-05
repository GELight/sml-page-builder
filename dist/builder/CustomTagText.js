"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sml_1 = require("@gelight/sml");
const CustomTag_1 = __importDefault(require("./CustomTag"));
class CustomTagText extends CustomTag_1.default {
    constructor(tagName, node) {
        super(tagName, node);
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.node instanceof sml_1.SmlAttribute) {
                if (this.node.name === this.tagName) {
                    this.result = this.node.getValues().join(" ");
                }
            }
            return this.result;
        });
    }
}
exports.default = CustomTagText;
//# sourceMappingURL=CustomTagText.js.map