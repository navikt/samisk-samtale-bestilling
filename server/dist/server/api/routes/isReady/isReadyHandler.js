"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReadyHandler = void 0;
const isReadyHandler = (req, res) => {
    return res.status(200).json({ message: 'I am ready!' });
};
exports.isReadyHandler = isReadyHandler;
