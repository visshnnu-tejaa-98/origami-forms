"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
var openai_1 = require("~/app/config/openai");
exports.openai = (0, openai_1.checkOpenAI)();
console.log({ openai: exports.openai });
