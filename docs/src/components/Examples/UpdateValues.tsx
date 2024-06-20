import animare, { Direction } from 'animare';
import { useAnimare, useAutoPause } from 'animare/react';
import { useRef } from 'react';

import Frame from '../ExampleFrame/ExampleFrame';

export default function UpdateAnimationValues() {
  const container = useRef<HTMLDivElement>(null!);
  const slider = useRef<HTMLInputElement>(null);

  const animation = useAnimare(() => {
    const circle = container.current.querySelector<HTMLDivElement>('span');

    const timeline = animare.single(
      { to: 100, duration: 1000, direction: Direction.Alternate, autoPlay: false, playCount: -1 },
      info => {
        if (slider.current) slider.current.value = info.progress.toString();

        if (!circle) return;

        const value = info.value;

        circle.style.marginLeft = `${value}%`;
        circle.style.translate = `-${value}%`;
      },
    );

    return timeline;
  }, [container]);

  useAutoPause(animation, container.current);

  const updateDuration = (e: React.PointerEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    animation.updateValues({ duration: value });
  };

  return (
    <Frame title='Update Values' slider={slider} timeline={animation}>
      <div ref={container} style={{ paddingInline: 10 }}>
        <span style={letterStyle}></span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, width: '100%' }}>
          <p>Duration</p>
          <input
            style={{ flex: 1, maxWidth: 460, accentColor: 'var(--secondary)' }}
            onPointerUp={updateDuration}
            type='range'
            min={50}
            max={5000}
            defaultValue={1000}
          />
        </div>
      </div>
    </Frame>
  );
}

const letterStyle: React.CSSProperties = {
  display: 'block',
  width: 100,
  height: 100,
  backgroundColor: 'var(--secondary)',
  color: '#fff',
  textAlign: 'center',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  paddingInline: '0.5rem',
  borderRadius: '50%',
  margin: '10px 10px 10px 0%',
  whiteSpace: 'nowrap',
};
