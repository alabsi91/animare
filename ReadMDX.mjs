export default function ReadMDX() {
  return function (tree) {
    replaceCodeBlock(tree);
    replaceQuote(tree);
  };
}

function replaceCodeBlock(tree) {
  const CodeBlock = {
    type: 'mdxjsEsm',
    value: "import Code from '../components/CodeBlock/Code.astro';",
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [{ type: 'ImportDefaultSpecifier', local: { type: 'Identifier', name: 'Code' } }],
            source: { type: 'Literal', value: '../components/CodeBlock/Code.astro', raw: "'../components/CodeBlock/Code.astro'" },
          },
        ],
        sourceType: 'module',
      },
    },
  };

  let isImported = tree.children.findIndex(node => node.value === CodeBlock.value) !== -1;

  const newNode = node => {
    // import CodeBlock component if not imported.
    if (!isImported) {
      tree.children.push(CodeBlock);
      isImported = true;
    }

    const { value, position, lang, meta } = node,
      title = meta?.match(/title=['|"](?<title>[^'|"]+)/)?.groups?.title || ''; // meta title

    return {
      type: 'mdxJsxFlowElement',
      name: 'Code',
      attributes: [
        { type: 'mdxJsxAttribute', name: 'codeString', value },
        { type: 'mdxJsxAttribute', name: 'language', value: lang },
        { type: 'mdxJsxAttribute', name: 'title', value: title },
      ],
      children: [],
      position,
      data: { _mdxExplicitJsx: true },
    };
  };

  const recursiveSearch = node => {
    if (node.children)
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'code') node.children[i] = newNode(child);
        recursiveSearch(child);
      }
  };

  recursiveSearch(tree);
}

function replaceQuote(tree) {
  const BlockQuote = {
    type: 'mdxjsEsm',
    value: "import { Note, Warning, Tip, Danger } from '../components/Blockquote'",
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'Note' },
                local: { type: 'Identifier', name: 'Note' },
              },
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'Info' },
                local: { type: 'Identifier', name: 'Info' },
              },
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'Warning' },
                local: { type: 'Identifier', name: 'Warning' },
              },
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'Tip' },
                local: { type: 'Identifier', name: 'Tip' },
              },
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'Danger' },
                local: { type: 'Identifier', name: 'Danger' },
              },
            ],
            source: { type: 'Literal', value: '../components/Blockquote', raw: "'../components/Blockquote'" },
          },
        ],
        sourceType: 'module',
      },
    },
  };

  let isImported = tree.children.findIndex(node => node.value === BlockQuote.value) !== -1;

  const quotes = ['Note:', 'Info:', 'Tip:', 'Warning:', 'Danger:']; // available quote types

  const newNode = node => {
    // import CodeBlock component if not imported.
    if (!isImported) {
      tree.children.push(BlockQuote);
      isImported = true;
    }

    const quoteText = node.children[0].children[0].value;
    const isQuote = quotes.some(q => quoteText.trim().startsWith(q));
    if (!isQuote) return node;

    const selectedQuote = quoteText.trim().match(/.+:\s?/)[0]; // get the quote text
    // remove quote type from the original quote text
    node.children[0].children[0].value = quoteText.replace(selectedQuote, '');

    return {
      type: 'mdxJsxFlowElement',
      name: selectedQuote.replace(':', ''),
      attributes: [],
      children: node.children[0].children,
      position: node.position,
      data: {
        _mdxExplicitJsx: true,
      },
    };
  };

  const recursiveSearch = node => {
    if (node.children)
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'blockquote') node.children[i] = newNode(child);
        recursiveSearch(child);
      }
  };

  recursiveSearch(tree);
}
