import animare from 'animare';
import { ease, lerp } from 'animare/plugins';
import { useAnimare } from 'animare/react';
import { useRef } from 'react';

import Frame from '../ExampleFrame/ExampleFrame';

import type { AnimationGroupOptions } from 'animare';

export default function ReuseValues() {
  const slider = useRef<HTMLInputElement>(null);

  const animation = useAnimare(() => {
    const elements = document.querySelectorAll<HTMLSpanElement>('.reuse-values-letter');

    const animations: AnimationGroupOptions = {
      to: Array<number>(elements.length).fill(1), // create an animation for each element
      offset: i => (i === 0 ? 0 : -300),
      duration: 500, // for each animation
      autoPlay: false,
    };

    return animare.group(animations, (info, tlInfo) => {
      if (slider.current) slider.current.value = tlInfo.progress.toString();

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el) return;

        const t = info[i].value; // represents the progress of the animation

        // opacity
        el.style.opacity = t.toString();

        // rotate
        const rotate = lerp(i % 2 === 0 ? 90 : -90, 0, ease.out.back(5)(t));
        el.style.rotate = `${rotate}deg`;

        // scale
        const scale = lerp(2, 1, ease.in.wobble(1.6)(t));
        el.style.scale = `${scale}`;

        // blur
        const blur = lerp(3, 0, t);
        el.style.filter = `blur(${blur}px)`;
      }
    });
  });

  return (
    <Frame title='Reuse Values' slider={slider} timeline={animation}>
      <div className='animate-color-element' style={{ margin: '30px auto' }}>
        <h1 style={{ textAlign: 'center', color: 'var(--secondary)' }}>
          {[...'animare'].map((c, i) => (
            <span style={{ display: 'inline-block' }} key={c + i} className='reuse-values-letter'>
              {c}
            </span>
          ))}
        </h1>
      </div>
    </Frame>
  );
}
