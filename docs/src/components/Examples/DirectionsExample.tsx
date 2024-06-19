import animare, { Direction } from 'animare';
import { useAnimare } from 'animare/react';
import { useRef } from 'react';

import Frame from '../ExampleFrame/ExampleFrame';

export default function DirectionExample() {
  const container = useRef<HTMLDivElement>(null!);
  const slider = useRef<HTMLInputElement>(null);

  const animation = useAnimare(() => {
    const circles = container.current.querySelectorAll<HTMLDivElement>('span');

    return animare.group(
      {
        to: Array<number>(circles.length).fill(100),
        duration: 1500,
        direction: [Direction.Forward, Direction.Reverse, Direction.Alternate, Direction.AlternateReverse],
        autoPlay: false,
      },
      (info, tlInfo) => {
        if (slider.current) slider.current.value = tlInfo.progress.toString();

        for (let i = 0; i < circles.length; i++) {
          const el = circles[i];
          if (!el) return;

          const value = info[i].value;

          el.style.marginLeft = `${value}%`;
          el.style.translate = `-${value}%`;
        }
      },
    );
  }, [container]);

  return (
    <Frame title='Direction' slider={slider} timeline={animation}>
      <div ref={container} style={{ paddingInline: 10 }}>
        <span style={letterStyle}>Forward</span>
        <span
          style={{
            ...letterStyle,
            margin: '10px 10px 10px 100%',
            translate: '-100%',
          }}
        >
          Reverse
        </span>
        <span style={letterStyle}>Alternate</span>
        <span
          style={{
            ...letterStyle,
            margin: '10px 10px 10px 100%',
            translate: '-100%',
          }}
        >
          AlternateReverse
        </span>
      </div>
    </Frame>
  );
}

const letterStyle: React.CSSProperties = {
  display: 'block',
  width: 130,
  backgroundColor: 'var(--secondary)',
  color: '#fff',
  textAlign: 'center',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  paddingInline: '0.5rem',
  borderRadius: '0.2rem',
  margin: '10px 10px 10px 0%',
  whiteSpace: 'nowrap',
};
