import animare, { ScrollElementEdge } from 'animare';
import { lerp, vecToRGB } from 'animare/plugins';
import { useAnimare, useScrollAnimation } from 'animare/react';
import { useRef } from 'react';

import Frame from '../ExampleFrame/ExampleFrame';

export default function ScrollAnimation() {
  const slider = useRef<HTMLInputElement>(null);
  const text = useRef<HTMLHeadingElement>(null!);
  const root = useRef<HTMLDivElement>(null!);

  const animation = useAnimare(() => {
    return animare.single({ to: 1, autoPlay: false }, info => {
      if (slider.current) slider.current.value = info.progress.toString();

      if (!text.current || !root.current) return;

      text.current.style.translate = `0px ${info.value * (root.current.clientHeight / 2 + text.current.clientHeight / 2)}px`;

      text.current.style.letterSpacing = lerp(40, 0, info.value) + 'px';
      text.current.style.scale = lerp(0.5, 1, info.value).toString();
      text.current.style.color = vecToRGB(lerp([255, 255, 255], [244, 96, 54], info.value));
    });
  }, [text.current, root.current]);

  useScrollAnimation({
    timeline: animation,
    root: root.current,
    element: text.current,
    start: ScrollElementEdge.Bottom,
    startOffset: root.current?.clientHeight / 2 - text.current?.clientHeight / 2,
  });

  return (
    <Frame title='Scroll Animation' slider={slider} timeline={animation}>
      <div ref={root} className='animate-color-element' style={{ margin: 'auto', height: 200, overflow: 'hidden auto' }}>
        <div style={{ height: 500 }} />
        <h1 ref={text} style={{ textAlign: 'center', margin: 0, color: 'var(--secondary)', whiteSpace: 'nowrap' }}>
          animare
        </h1>
        <div style={{ height: 500 }} />
      </div>
    </Frame>
  );
}
