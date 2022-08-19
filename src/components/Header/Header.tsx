/* eslint-disable react-hooks/exhaustive-deps */
import './Header.css';
import animare, { ease } from 'animare';
import { useEffect } from 'react';

let count = 0;

const delay = 500;
const Title = 'animare';

export default function Header() {
  const logoAnimation = () => {
    const svg = document.querySelector('.logo svg') as SVGAElement;
    animare(
      { from: 1, to: 0.9, duration: 500, direction: 'alternate', ease: ease.out.quart },
      ([scale]) => (svg.style.transform = `scale(${scale})`)
    );
  };

  const titleAnimation_0 = () => {
    const spans = document.querySelectorAll<HTMLSpanElement>('.logoTitle span');
    animare(
      {
        to: new Array(spans.length).fill([0, 1]).flat(),
        from: i => (i % 2 === 0 ? 40 : 0),
        duration: 1200,
        delay: i => delay + ~~(i / 2) * 50,
        ease: new Array(spans.length).fill([ease.out.expo, ease.linear]).flat(),
      },
      values => {
        for (let i = 0; i < values.length; i += 2) {
          spans[i / 2].style.transform = `translateX(${values[i]}px)`;
          spans[i / 2].style.opacity = values[i + 1] + '';
        }
      }
    );
  };

  const titleAnimation_1 = () => {
    const spans = document.querySelectorAll<HTMLSpanElement>('.logoTitle span');
    animare(
      {
        to: new Array(spans.length).fill([0, 1, 0]).flat(),
        from: i => (i % 3 === 0 ? -40 : i % 3 === 1 ? 0 : 2),
        delay: i => delay + ~~(i / 3) * 50,
        duration: 800,
        ease: new Array(spans.length).fill([ease.out.expo, ease.out.expo, ease.linear]).flat(),
      },
      values => {
        for (let i = 0; i < values.length; i += 3) {
          spans[i / 3].style.transform = `translateX(${values[i]}px)`;
          spans[i / 3].style.opacity = values[i + 1] + '';
          spans[i / 3].style.filter = `blur(${values[i + 2]}px)`;
        }
      }
    );
  };

  const titleAnimation_2 = () => {
    const spans = document.querySelectorAll<HTMLSpanElement>('.logoTitle span');
    animare(
      {
        to: new Array(spans.length).fill(1),
        duration: i => 1000 + i * 50,
        delay: i => delay + i * 50,
        ease: ease.spring({ mass: 2, damping: 12, stiffness: 70, velocity: 9, duration: 2500 }),
      },
      values => spans.forEach((span, i) => (span.style.transform = `scale(${values[i]})`))
    );
  };

  const titleAnimation_3 = () => {
    const spans = document.querySelectorAll<HTMLSpanElement>('.logoTitle span');
    const parent = spans[0].parentElement as HTMLHeadingElement;
    parent.style.overflow = 'hidden';
    animare(
      {
        to: new Array(spans.length * 3).fill(0),
        from: i => (i % 3 === 0 ? 0.55 : i % 3 === 1 ? 1.1 : 180),
        duration: 750,
        delay: i => delay + ~~(i / 3) * 50,
        ease: ease.out.expo,
      },
      (values, { isFinished }) => {
        for (let i = 0; i < values.length; i += 3)
          spans[i / 3].style.transform = `translateX(${values[i]}em) translateY(${values[i + 1]}em) rotateZ(${values[i + 2]}deg)`;
        if (isFinished) parent.style.removeProperty('overflow');
      }
    );
  };

  const animations = [titleAnimation_0, titleAnimation_1, titleAnimation_2, titleAnimation_3];

  useEffect(() => {
    animations[Math.floor(Math.random() * animations.length)]();
    logoAnimation();
  }, []);

  return (
    <header className='App-header'>
      <div className='logo'>
        <svg
          onClick={() => {
            animations[count % animations.length]();
            logoAnimation();
            count++;
          }}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 500 500'
          enableBackground='new 0 0 500 500'
          xmlSpace='preserve'
          x='0px'
          y='0px'
        >
          <path d='M250-0.006C111.926-0.006,0,111.932,0,250.006c0,138.062,111.926,250,250,250   c138.062,0,250-111.938,250-250C500,111.932,388.062-0.006,250-0.006z M250,469.371c-120.961,0-219.365-98.404-219.365-219.365   S129.039,30.629,250,30.629c120.955,0,219.365,98.416,219.365,219.377S370.955,469.371,250,469.371z' />
          <polygon points='173.005,250.006 173.005,349.953 361.28,250.006 173.005,150.059  ' />
        </svg>

        <h1 className='logoTitle'>
          {[...Title].map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </h1>
      </div>

      <div className='buttons'>
        <a href='https://github.com/alabsi91/animare' target='_blank' rel='noreferrer'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
          </svg>
        </a>

        <a href='https://twitter.com/alabsi91' target='_blank' rel='noreferrer'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z' />
          </svg>
        </a>
      </div>
    </header>
  );
}
