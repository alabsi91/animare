import './Hero.css';
import CodeBlock from '../CodeBlock/CodeBlock';
import HeroExample from './HeroExample';

const codeString = `import animare, { ease } from 'animare';

const ball = document.getElementById('ball');

animare({
  to: [100, 100],
  duration: 2000, // 🕐
  ease: [ease.linear, ease.out.bounce], // 📉
}, 
([x, y]) => {
  ball.style.left = x + '%';
  ball.style.top = y + '%';
});`;

export default function Hero() {
  return (
    <>
      <section id='hero'>
        <div className='intro'>
          <h1 className='title'>
            Add <span className='highlight'>motion</span> to your apps with ease.
          </h1>
          <p>
            🔸Light animation library for modern JavaScript.
            <br />
            🔸Based on <code className='code'>requestAnimationFrame</code>.
            <br />
            🔸Contains the most popular easing functions.
          </p>

          <div className='hero-buttons'>
            <a href='#nav' className='cssbuttons-io-button'>
              {' '}
              Get started
              <div className='icon'>
                <svg height='24' width='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z'
                    fill='currentColor'
                  />
                </svg>
              </div>
            </a>
            <a className='button button--alt' href='https://github.com/alabsi91/animare' target='_blank' rel='noreferrer'>
              GitHub
              <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120.78 117.79'>
                <path
                  className='cls-1'
                  d='M60.39,0A60.39,60.39,0,0,0,41.3,117.69c3,.56,4.12-1.31,4.12-2.91,0-1.44-.05-6.19-.08-11.24C28.54,107.19,25,96.42,25,96.42c-2.75-7-6.71-8.84-6.71-8.84-5.48-3.75.41-3.67.41-3.67,6.07.43,9.26,6.22,9.26,6.22,5.39,9.23,14.13,6.57,17.57,5,.55-3.9,2.11-6.56,3.84-8.07C36,85.55,21.85,80.37,21.85,57.23A23.35,23.35,0,0,1,28.08,41c-.63-1.52-2.7-7.66.58-16,0,0,5.07-1.62,16.61,6.19a57.36,57.36,0,0,1,30.25,0C87,23.42,92.11,25,92.11,25c3.28,8.32,1.22,14.46.59,16a23.34,23.34,0,0,1,6.21,16.21c0,23.2-14.12,28.3-27.57,29.8,2.16,1.87,4.09,5.55,4.09,11.18,0,8.08-.06,14.58-.06,16.57,0,1.61,1.08,3.49,4.14,2.9A60.39,60.39,0,0,0,60.39,0Z'
                />
              </svg>
            </a>
          </div>
        </div>

        <br />
        <br />
        <div className='hero-code-example'>
          <HeroExample />
          <CodeBlock codeString={codeString} title='App.js' />
        </div>
      </section>
    </>
  );
}
