/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import animare, { ease, organize } from 'animare';
import { useAnimare } from 'animare/react';
import { useEffect, useState } from 'react';
import './Nav.css';

export default function Nav({ titles }: { titles: string[] }) {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 42em)');

    // Register event listener
    mediaQuery.addListener(e => setShowNav(e.matches));

    // Initial check
    setShowNav(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (!showNav) return;
    const list = document.getElementById('nav-list') as HTMLUListElement;
    const height = titles.length * 35;
    const { from, to, get } = organize({
      opacity: { from: 0, to: 1 },
      height: { from: 0, to: height },
      translateY: { from: -15, to: 0 },
    });

    animare({ from, to, duration: 250, ease: ease.out.quad }, values => {
      if (!list) return;
      const { height, opacity, translateY } = get(values);
      list.style.height = `${height}px`;
      list.style.opacity = `${opacity}`;
      list.style.transform = `translateY(${translateY}px)`;
    });
  }, [showNav]);

  const toggleNav = () => {
    const mediaQuery = window.matchMedia('(min-width: 42em)');
    if (mediaQuery.matches) return;

    if (!showNav) {
      setShowNav(true);
      return;
    }

    const list = document.getElementById('nav-list') as HTMLUListElement;

    const { from, to, get } = organize({
      opacity: { from: 1, to: 0 },
      height: { from: titles.length * 35, to: 1 },
      padding: { from: 8 , to: 0 },
    });

    animare({ from, to, duration: 250, ease: ease.out.expo }, (values, { isFinished }) => {
      if (!list) return;
      const { height, opacity, padding } = get(values);
      list.style.height = `${height}px`;
      list.style.opacity = `${opacity}`;
      list.style.padding = `${padding}px 0px`;
      if (isFinished) setShowNav(false);
    });
  };

  const navAnimation = useAnimare(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement,
      ctx = canvas.getContext('2d')!,
      nav = document.querySelector('nav') as HTMLElement;

    const { from, to, get } = organize({
      opacity: { from: 255, to: 0 },
      line: { from: 0, to: 1 },
    });

    return animare({ from, to, duration: 1000, ease: ease.out.expo, autoPlay: false }, values => {
      const { opacity, line } = get(values);

      const { left, width, top, height } = nav.getBoundingClientRect(), // navigation el position
        lineShift = 4, // the space between the line and the navigation el
        alpha = parseInt(opacity.toString(), 10).toString(16).padStart(2, '0'), // int to hex
        topLeft = { x: left - lineShift, y: top - lineShift }, // top left corner
        topRight = { x: left + width + lineShift, y: top - lineShift }, // top right corner
        bottomLeft = { x: left - lineShift, y: top + height + lineShift }, // bottom left corner
        bottomRight = { x: left + width + lineShift, y: top + height + lineShift }, // bottom right corner
        color1 = '#f46036' + alpha, // gradient color position 1
        color05 = '#a370f0' + alpha, // gradient color position 0.5
        color0 = '#231c2c' + alpha; // gradient color position 0

      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      const grd1 = ctx.createLinearGradient(topLeft.x, topLeft.y, bottomLeft.x, bottomLeft.y);
      grd1.addColorStop(0, color0);
      grd1.addColorStop(0.5, color05);
      grd1.addColorStop(1, color1);
      ctx.strokeStyle = grd1;

      ctx.beginPath();
      ctx.moveTo(topLeft.x, topLeft.y);
      ctx.lineTo(bottomLeft.x, topLeft.y + line * (height + lineShift * 2));
      ctx.stroke();

      const grd2 = ctx.createLinearGradient(bottomLeft.x, bottomLeft.y, bottomRight.x, bottomRight.y);
      grd2.addColorStop(0, color0);
      grd2.addColorStop(0.5, color05);
      grd2.addColorStop(1, color1);
      ctx.strokeStyle = grd2;

      ctx.beginPath();
      ctx.moveTo(bottomLeft.x, bottomLeft.y);
      ctx.lineTo(bottomLeft.x + line * (width + lineShift * 2), bottomLeft.y);
      ctx.stroke();

      const grd3 = ctx.createLinearGradient(bottomRight.x, bottomRight.y, topRight.x, topRight.y);
      grd3.addColorStop(0, color0);
      grd3.addColorStop(0.5, color05);
      grd3.addColorStop(1, color1);
      ctx.strokeStyle = grd3;

      ctx.beginPath();
      ctx.moveTo(bottomRight.x, bottomRight.y);
      ctx.lineTo(bottomRight.x, bottomRight.y - line * (height + lineShift * 2));
      ctx.stroke();

      const grd4 = ctx.createLinearGradient(topRight.x, topRight.y, topLeft.x, topLeft.y);
      grd4.addColorStop(0, color0);
      grd4.addColorStop(0.5, color05);
      grd4.addColorStop(1, color1);
      ctx.strokeStyle = grd4;

      ctx.beginPath();
      ctx.moveTo(topRight.x, topRight.y);
      ctx.lineTo(topRight.x - line * (width + lineShift * 2), topRight.y);
      ctx.stroke();
    });
  });

  const titleAnimation = (id: string) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement,
      ctx = canvas.getContext('2d')!,
      title = document.querySelector(id + ' > *:first-child') as HTMLHeadingElement;

    const { from, to, get } = organize({
      color0: { from: '#f46036', to: '#f4603600' },
      color1: { from: '#231c2c', to: '#231c2c00' },
      line: { from: 0, to: 1 },
    });

    const shift = 5;
    const anim = animare({ from, to, duration: 500, ease: ease.in.sine, autoPlay: false }, values => {
      const { color1, color0, line } = get(values),
        { left, width, bottom } = title.getBoundingClientRect();

      // ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      const grd = ctx.createLinearGradient(left, bottom + shift, left + width, bottom + shift);
      grd.addColorStop(1, color1);
      grd.addColorStop(0, color0);
      ctx.strokeStyle = grd;

      ctx.beginPath();
      ctx.moveTo(left, bottom + shift);
      ctx.lineTo(left + width * line, bottom + shift);
      ctx.stroke();
    });

    const checkTitleInView = () => {
      const { top } = title.getBoundingClientRect();
      if (Math.floor(top) !== 0) return false;
      anim.play();
      window.removeEventListener('scroll', checkTitleInView);
      return true;
    };

    if (!checkTitleInView()) window.addEventListener('scroll', checkTitleInView);
  };

  const NavEls = titles.map(title => (
    <li key={title}>
      <a href={'#' + title.toLowerCase().replace(/ /g, '-')}>{title}</a>
    </li>
  ));

  return (
    <nav
      id='nav'
      onClick={e => {
        if (navAnimation && window.matchMedia('(min-width: 42em)').matches) {
          navAnimation.play();
          if (e.target instanceof Element) {
            const id = e.target.getAttribute('href');
            if (id) titleAnimation(id);
          }
        }
      }}
    >
      <button onClick={toggleNav} className='active'>
        <span className='active-title'>Docs Navigation</span>
        <svg className='down' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
          <path d='M113.95,36.55c-2.73-2.73-7.17-2.73-9.9,0l-40.05,40.05L23.95,36.55c-2.73-2.73-7.17-2.73-9.9,0-2.73,2.73-2.73,7.17,0,9.9l45,45c1.37,1.37,3.16,2.05,4.95,2.05s3.58-.68,4.95-2.05l45-45c2.73-2.73,2.73-7.17,0-9.9Z'></path>
        </svg>
      </button>

      {showNav && (
        <ul id='nav-list' onClick={toggleNav}>
          {NavEls}
        </ul>
      )}
    </nav>
  );
}
