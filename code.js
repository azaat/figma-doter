"use strict";
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
function parseCSV(csvData) {
    return csvData.split('\n');
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    const selectedTextNodes = figma.currentPage.selection.filter((node) => node.type === "TEXT");
    if (msg.type === 'dots') {
        for (const textNode of selectedTextNodes) {
            yield Promise.all(textNode.getRangeAllFontNames(0, textNode.characters.length)
                .map(figma.loadFontAsync));
            let resultString = '';
            for (const text of textNode.characters.toString().split('\n')) {
                const isWhitespaceString = (text) => !/\S/.test(text);
                if (!text.endsWith('.') && !isWhitespaceString(text)) {
                    resultString += text + '.\n';
                }
                else {
                    resultString += text + '\n';
                }
            }
            textNode.characters = resultString;
        }
    }
    else if (msg.type == 'remove') {
        for (const textNode of selectedTextNodes) {
            yield Promise.all(textNode.getRangeAllFontNames(0, textNode.characters.length)
                .map(figma.loadFontAsync));
            let resultString = '';
            for (const text of textNode.characters.toString().split('\n')) {
                if (text.endsWith('.')) {
                    resultString += text.substring(0, text.length - 1) + '\n';
                }
                else {
                    resultString += text + '\n';
                }
            }
            textNode.characters = resultString.trim();
        }
    }
    figma.closePlugin();
});
