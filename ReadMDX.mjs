export default function ReadMDX() {
  return function (tree) {
    findQuote(tree);
    findCodeBlock(tree);
  };
}

function findQuote(tree) {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];

    if (node.type !== 'blockquote') continue;

    const quotes = ['Note:', 'Tip:', 'Warning:', 'Danger:']; // available quote types
    const quoteText = node.children[0].children[0].value;
    const margin = quoteText.match(/^(\**)/)?.[0]?.length || 0;
    const isQuote = quotes.some(q => quoteText.trim().replace(/^\**/, '').startsWith(q)); // check if the quote is one of the available types

    if (!isQuote) continue;

    const importQuotes = JSON.parse(
      `{"type":"mdxjsEsm","value":"import { Note, Warning, Tip, Danger } from '../components/Blockquote'","data":{"estree":{"type":"Program","body":[{"type":"ImportDeclaration","specifiers":[{"type":"ImportSpecifier","imported":{"type":"Identifier","name":"Note"},"local":{"type":"Identifier","name":"Note"}},{"type":"ImportSpecifier","imported":{"type":"Identifier","name":"Warning"},"local":{"type":"Identifier","name":"Warning"}},{"type":"ImportSpecifier","imported":{"type":"Identifier","name":"Tip"},"local":{"type":"Identifier","name":"Tip"}},{"type":"ImportSpecifier","imported":{"type":"Identifier","name":"Danger"},"local":{"type":"Identifier","name":"Danger"}}],"source":{"type":"Literal","value":"../components/Blockquote","raw":"'../components/Blockquote'"}}],"sourceType":"module"}}}`
    );
    const selectedQuote = quoteText.trim().match(/.+:\s?/)[0]; // get the quote text

    const isImported = tree.children.findIndex(node => node.value === importQuotes.value) !== -1;
    if (!isImported) tree.children.push(importQuotes);

    // remove quote type from the original quote text
    node.children[0].children[0].value = quoteText.replace(selectedQuote, '');

    tree.children[i] = {
      type: 'mdxJsxFlowElement',
      name: selectedQuote.replace(/^\**/, '').replace(':', ''),
      attributes: [{ type: 'mdxJsxAttribute', name: 'margin', value: margin * 5 }],
      children: node.children[0].children,
      position: node.position,
      data: {
        _mdxExplicitJsx: true,
      },
    };
  }
}

function findCodeBlock(tree) {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type !== 'code') continue;

    const { value: codeString, position, lang, meta } = node;
    const title = meta?.match(/title=['|"](?<title>[^'|"]+)/)?.groups?.title || '';

    const importCode = JSON.parse(
      `{"type":"mdxjsEsm","value":"import Code from '../components/CodeBlock/Code.astro';","data":{"estree":{"type":"Program","body":[{"type":"ImportDeclaration","specifiers":[{"type":"ImportDefaultSpecifier","start":7,"end":11,"local":{"type":"Identifier","name":"Code"}}],"source":{"type":"Literal","value":"../components/CodeBlock/Code.astro","raw":"'../components/CodeBlock/Code.astro'"}}],"sourceType":"module"}}}`
    );

    const isCodeImported = tree.children.findIndex(node => node.value === importCode.value) !== -1;
    if (!isCodeImported) tree.children.push(importCode);

    tree.children[i] = {
      type: 'mdxJsxFlowElement',
      name: 'Code',
      attributes: [
        { type: 'mdxJsxAttribute', name: 'codeString', value: codeString },
        { type: 'mdxJsxAttribute', name: 'language', value: lang },
        { type: 'mdxJsxAttribute', name: 'title', value: title },
      ],
      children: [],
      position,
      data: { _mdxExplicitJsx: true },
    };
  }
}
