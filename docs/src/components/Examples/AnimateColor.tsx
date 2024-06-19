import animare from 'animare';
import { ease, lerp, vecToRGB } from 'animare/plugins';
import { useAnimare } from 'animare/react';
import { useRef } from 'react';

import Frame from '../ExampleFrame/ExampleFrame';

import type { Vec3Array } from 'animare';

export default function AnimateColor() {
  const slider = useRef<HTMLInputElement>(null);

  const animation = useAnimare(() => {
    const el = document.querySelector<HTMLDivElement>('.animate-color-element');
    const fromColor: Vec3Array = [255, 0, 0];
    const toColor: Vec3Array = [0, 255, 0];

    return animare.single({ from: 0, to: 1, duration: 1000, ease: ease.linear, autoPlay: false }, info => {
      if (!el) return;
      const mixed = lerp(fromColor, toColor, info.value);
      const rgbString = vecToRGB(mixed);
      el.style.backgroundColor = rgbString;
      if (slider.current) slider.current.value = info.progress.toString();
    });
  });

  return (
    <Frame title='Animate Color' slider={slider} timeline={animation}>
      <div
        className='animate-color-element'
        style={{ backgroundColor: 'red', width: '100px', height: '100px', borderRadius: '50%', margin: '30px auto' }}
      />
    </Frame>
  );
}
