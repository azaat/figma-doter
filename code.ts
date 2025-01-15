// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);


function parseCSV(csvData: string): any[] {
   return csvData.split('\n');
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: {text: string, type: string}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  const selectedTextNodes = figma.currentPage.selection.filter(
    (node) => node.type === "TEXT"
  ) as TextNode[];

  if (msg.type === 'dots') {
    for (const textNode of selectedTextNodes) {
          await Promise.all(
            textNode.getRangeAllFontNames(0, textNode.characters.length)
              .map(figma.loadFontAsync)
          )
          let resultString = ''
          for (const text of textNode.characters.toString().split('\n')) {
            const isWhitespaceString = (text: string) => !/\S/.test(text);

            if (!text.endsWith('.') && !text.endsWith('?') && !text.endsWith('!') && !isWhitespaceString(text)) {
              resultString += text + '.\n';
            }
            else {
              resultString += text + '\n';
            }
          }

          textNode.characters = resultString.trim();
        }
  } 
  else if (msg.type == 'remove') {
    for (const textNode of selectedTextNodes) {
      await Promise.all(
        textNode.getRangeAllFontNames(0, textNode.characters.length)
          .map(figma.loadFontAsync)
      )
      let resultString = ''
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
};
