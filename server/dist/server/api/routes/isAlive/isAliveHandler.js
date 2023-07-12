"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAliveHandler = void 0;
const isAliveHandler = (req, res) => {
    return res.status(200).send('I am alive!');
};
exports.isAliveHandler = isAliveHandler;
