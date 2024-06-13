import animare, { AnimationTiming, createAnimations } from 'animare';
import { useAnimare, useAutoPause } from 'animare/react';
import { useRef } from 'react';
import styles from './Ease.module.css';

// called by `eval`
import { ease } from 'animare/plugins';
ease;

import type { OnUpdateCallback, TimelineGlobalOptions } from 'animare';

type Props = {
  title?: string;
  duration?: number;
  padding?: number;
  easing?: string;
};

const size = 200;
const ballRadius = 5;
const ballColor = '#f46036';
const lineThickness = 1;
const lineColor = '#fff';

export default function Ease({ title = 'Linear', padding = 10, duration = 2000, easing = 'ease.linear' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pad = padding / 2 + 1; // the one pixel represent the border-width

  const timeline = useAnimare(() => {
    const animations = createAnimations([
      { name: 'x', from: ballRadius + pad, to: size - ballRadius - pad },
      { name: 'y', from: size - ballRadius - pad, to: ballRadius + pad, ease: eval(easing) },
      { name: 'empty', to: 0, duration: 1000, timing: AnimationTiming.AfterPrevious },
    ]);

    const globalOptions: TimelineGlobalOptions = {
      autoPlay: false,
      timelinePlayCount: -1,
      duration,
      timing: AnimationTiming.FromStart,
    };

    const ctx = canvasRef.current?.getContext('2d');

    const endAngle = 2 * Math.PI;

    const points: { x: number; y: number }[] = [];

    const onUpdate: OnUpdateCallback<typeof animations> = (info, tlInfo) => {
      if (!ctx) return;

      if (tlInfo.progress === 0) points.length = 0;

      ctx.clearRect(0, 0, size, size);

      points.push({ x: info.x.value, y: info.y.value });
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const nextP = points[i + 1] ?? p;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nextP.x, nextP.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineThickness;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(info.x.value, info.y.value, ballRadius, 0, endAngle);
      ctx.fillStyle = ballColor;
      ctx.fill();
    };

    return animare.timeline(animations, onUpdate, globalOptions);
  });

  useAutoPause(timeline, canvasRef.current);

  return (
    <div className={styles.wrapper + ' not-content'}>
      <div className={styles.container}>
        <div className={styles.frame} style={{ width: size - padding, height: size - padding }}></div>
        <canvas ref={canvasRef} width={size} height={size} className={styles.canvas}></canvas>
      </div>
      <p className={styles.title}>{title}</p>
    </div>
  );
}
