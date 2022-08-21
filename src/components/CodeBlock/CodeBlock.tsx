import './CodeBlock.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function CodeBlock({ codeString = '', title = '', language = 'js', header = 'show' }) {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
  };

  return (
    <div className='code-example'>
      {header === 'show' && (
        <div className='window-header'>
          <div className='control control--close'></div>
          <div className='control control--minimize'></div>
          <div className='control control--expand'></div>
          <span className='control-title'>{title}</span>
        </div>
      )}

      <button style={header !== 'show' ? { top: '1em' } : {}} onClick={copyToClipboard} className='clipboard-container'>
        <svg viewBox='0 0 16 16'>
          <path d='M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z' />
          <path d='M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z' />
        </svg>
      </button>
      <pre>
        <code
          className={'language-' + language}
          dangerouslySetInnerHTML={{ __html: hljs.highlight(codeString, { language }).value }}
        />
      </pre>
    </div>
  );
}
