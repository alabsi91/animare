import animare, { organize } from 'animare';
import { useAnimare } from 'animare/react';
import { useEffect } from 'react';

export default function App() {
  const mouseMove = () => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mediaQuery.matches) return;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement,
      ctx = canvas.getContext('2d')!;

    let mouseX = canvas.width / 2,
      mouseY = canvas.height / 2,
      centerX = mouseX,
      centerY = mouseY;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      centerX = e.clientX;
      centerY = e.clientY;
    });

    window.addEventListener('scroll', () => {
      centerX = mouseX;
      centerY = mouseY;
    });

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const secondary = window.getComputedStyle(document.documentElement).getPropertyValue('--secondary');
    const purple = window.getComputedStyle(document.documentElement).getPropertyValue('--purple-blue');

    const { from, to, duration, delay, direction, get } = organize({
      angel: { to: 360, duration: 6000 },
      motionRadius: { from: 20, to: 40, duration: 10000, delay: 100, direction: 'alternate' },
      color: { from: purple, to: secondary, duration: 5 * 1000, direction: 'alternate' },
    });

    return animare({ from, to, duration, delay, direction, repeat: -1 }, values => {
      const { angel, motionRadius, color } = get(values);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      const x = centerX + motionRadius * Math.cos((angel * Math.PI) / 180);
      const y = centerY + motionRadius * Math.sin((angel * Math.PI) / 180);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useAnimare(mouseMove);

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = document.body.scrollWidth;
    canvas.height = document.body.scrollHeight;
  }, []);

  return <canvas id='canvas' />;
}
