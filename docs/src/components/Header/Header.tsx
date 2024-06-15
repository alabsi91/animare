import animare, { AnimationTiming, Direction } from 'animare';
import { ease } from 'animare/plugins';
import { useAnimare } from 'animare/react';
import styles from './Header.module.css';
import { useEffect } from 'react';

let count = 0;

const delay = 500;
const Title = 'animare';

export default function Header() {
  const logoAnimation = useAnimare(() => {
    const svg = document.querySelector(`.${styles.logo} svg`) as SVGAElement;
    return animare.single(
      { from: 1, to: 0.9, duration: 500, direction: Direction.Alternate, ease: ease.out.quart, autoPlay: false },
      ({ value }) => {
        svg.style.transform = `scale(${value})`;
      },
    );
  });

  const titleAnimation_0 = useAnimare(() => {
    const spans = document.querySelectorAll<HTMLSpanElement>(`.${styles.logoTitle} span`);
    return animare.group(
      {
        to: new Array(spans.length).fill([0, 1]).flat(),
        from: i => (i % 2 === 0 ? 40 : 0),
        duration: 1200,
        delay: i => delay + ~~(i / 2) * 50,
        ease: new Array(spans.length).fill([ease.out.expo, ease.linear]).flat(),
        timing: AnimationTiming.FromStart,
        autoPlay: false,
      },
      values => {
        for (let i = 0; i < values.length; i += 2) {
          spans[i / 2].style.transform = `translateX(${values[i]}px)`;
          spans[i / 2].style.opacity = values[i + 1].value + '';
        }
      },
    );
  });

  const titleAnimation_1 = useAnimare(() => {
    const spans = document.querySelectorAll<HTMLSpanElement>(`.${styles.logoTitle} span`);
    return animare.group(
      {
        to: new Array(spans.length).fill([0, 1, 0]).flat(),
        from: i => (i % 3 === 0 ? -40 : i % 3 === 1 ? 0 : 2),
        delay: i => delay + ~~(i / 3) * 50,
        duration: 800,
        ease: new Array(spans.length).fill([ease.out.expo, ease.out.expo, ease.linear]).flat(),
        timing: AnimationTiming.FromStart,
        autoPlay: false,
      },
      values => {
        for (let i = 0; i < values.length; i += 3) {
          spans[i / 3].style.transform = `translateX(${values[i]}px)`;
          spans[i / 3].style.opacity = values[i + 1].value + '';
          spans[i / 3].style.filter = `blur(${values[i + 2].value}px)`;
        }
      },
    );
  });

  const titleAnimation_2 = useAnimare(() => {
    const spans = document.querySelectorAll<HTMLSpanElement>(`.${styles.logoTitle} span`);
    return animare.group(
      {
        to: new Array(spans.length).fill(1),
        duration: i => 1000 + i * 50,
        delay: i => delay + i * 50,
        ease: ease.spring({ mass: 2, damping: 12, stiffness: 70, velocity: 9, duration: 2500 }),
        timing: AnimationTiming.FromStart,
        autoPlay: false,
      },
      values => spans.forEach((span, i) => (span.style.transform = `scale(${values[i].value})`)),
    );
  });

  const titleAnimation_3 = useAnimare(() => {
    const spans = document.querySelectorAll<HTMLSpanElement>(`.${styles.logoTitle} span`);
    const parent = spans[0].parentElement as HTMLHeadingElement;
    parent.style.overflow = 'hidden';
    return animare.group(
      {
        to: new Array(spans.length * 3).fill(0),
        from: i => (i % 3 === 0 ? 0.55 : i % 3 === 1 ? 1.1 : 180),
        duration: 750,
        delay: i => delay + ~~(i / 3) * 50,
        ease: ease.out.expo,
        timing: AnimationTiming.FromStart,
        autoPlay: false,
      },
      (values, { isFinished }) => {
        for (let i = 0; i < values.length; i += 3)
          spans[i / 3].style.transform =
            `translateX(${values[i].value}em) translateY(${values[i + 1].value}em) rotateZ(${values[i + 2].value}deg)`;
        if (isFinished) parent.style.removeProperty('overflow');
      },
    );
  });

  const animations = [titleAnimation_0, titleAnimation_1, titleAnimation_2, titleAnimation_3];

  useEffect(() => {
    const anim = animations[Math.floor(Math.random() * animations.length)];
    if (!anim) return;
    anim.play();
    logoAnimation.play();
  }, [logoAnimation]);

  return (
    <div className={styles.logo + ' not-content'}>
      <svg
        onClick={() => {
          animations[count % animations.length].play();
          logoAnimation.play();
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

      <h1 className={styles.logoTitle}>
        {[...Title].map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </h1>
    </div>
  );
}
