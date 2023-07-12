"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHtmlTemplate = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const decorator_1 = require("../../utils/decorator");
const templatePath = process.env.NODE_ENV === 'development'
    ? path_1.default.resolve(process.cwd(), '..', 'index.html')
    : path_1.default.resolve(process.cwd(), 'dist', 'client', 'index.html');
const getUndecoratedTemplate = () => fs_1.default.readFileSync(templatePath, { encoding: 'utf-8' });
const buildHtmlTemplate = async () => {
    const templateWithDecorator = await (0, decorator_1.injectWithDecorator)(templatePath);
    if (!templateWithDecorator) {
        console.error(`Failed to fetch decorator, using undecorated template`);
        return getUndecoratedTemplate();
    }
    return templateWithDecorator;
};
exports.buildHtmlTemplate = buildHtmlTemplate;
