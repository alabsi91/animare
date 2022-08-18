import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <p className='copyright'>
        Released under the
        <a style={{ display: 'inline-block', color: 'var(--purple-blue)' }} href='https://opensource.org/licenses/MIT'>
          MIT License.
        </a>
        <br /> Copyright © 2022 animare, Inc.{' '}
      </p>
    </footer>
  );
}
