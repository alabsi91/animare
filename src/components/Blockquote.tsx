type quoteType = { children: React.ReactNode; title?: string };

export function Note({ children, title = 'Note' }: quoteType) {
  return (
    <>
      <blockquote
        style={{
          padding: '1px 1em',
          borderLeft: '.25em solid #5b85aa',
          backgroundColor: '#5b85aa0f',
        }}
      >
        <p>
          <span style={{ color: '#58a6ff' }}>
            <svg fill='#58a6ff' viewBox='0 0 16 16' width='16' height='16'>
              <path d='M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z' />
            </svg>{' '}
            {title}{' '}
          </span>
          {children}
        </p>
      </blockquote>
    </>
  );
}

export function Info({ children, title = 'Info' }: quoteType) {
  return (
    <>
      <blockquote
        style={{
          padding: '1px 1em',
          borderLeft: '.25em solid #5b85aa',
          backgroundColor: '#5b85aa0f',
        }}
      >
        <p>
          <span style={{ color: '#58a6ff' }}>
            <svg fill='#58a6ff' viewBox='2 2 20 20' width='16' height='16'>
              <path d='M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z' />
            </svg>{' '}
            {title}{' '}
          </span>
          {children}
        </p>
      </blockquote>
    </>
  );
}

export function Warning({ children, title = 'Warning' }: quoteType) {
  return (
    <>
      <blockquote
        style={{
          padding: '1px 1em',
          borderLeft: '.25em solid #d29922',
          backgroundColor: '#d299220f',
        }}
      >
        <p>
          <span style={{ color: '#d29922' }}>
            <svg fill='#d29922' viewBox='0 0 16 16' width='16' height='16'>
              <path d='M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z' />
            </svg>{' '}
            {title}{' '}
          </span>
          {children}
        </p>
      </blockquote>
    </>
  );
}

export function Danger({ children, title = 'Danger' }: quoteType) {
  return (
    <>
      <blockquote
        style={{
          padding: '1px 1em',
          borderLeft: '.25em solid #e13238',
          backgroundColor: '#e132380f',
        }}
      >
        <p>
          <span style={{ color: '#e13238' }}>
            <svg fill='#e13238' viewBox='0 0 12 16' width='20' height='20'>
              <path d='M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z' />
            </svg>{' '}
            {title}{' '}
          </span>
          {children}
        </p>
      </blockquote>
    </>
  );
}

export function Tip({ children, title = 'Tip' }: quoteType) {
  return (
    <>
      <blockquote
        style={{
          padding: '1px 1em',
          borderLeft: '.25em solid #5bc553',
          backgroundColor: '#0a8f000f',
        }}
      >
        <p>
          <span style={{ color: '#5bc553' }}>
            <svg fill='#5bc553' viewBox='0 0 12 16' width='16' height='16'>
              <path d='M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z' />
            </svg>{' '}
            {title}{' '}
          </span>
          {children}
        </p>
      </blockquote>
    </>
  );
}
