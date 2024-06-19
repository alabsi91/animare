import animare, { Timing } from 'animare';
import { useAnimare } from 'animare/react';
import { useRef } from 'react';

import Frame from '../ExampleFrame/ExampleFrame';

export default function TimingExample() {
  const container = useRef<HTMLDivElement>(null!);
  const slider = useRef<HTMLInputElement>(null);

  const animation = useAnimare(() => {
    const circles = container.current.querySelectorAll<HTMLDivElement>('span');

    return animare.group(
      {
        to: Array<number>(circles.length).fill(100),
        duration: 1000,
        timing: [Timing.FromStart, Timing.AfterPrevious, Timing.AfterPrevious, Timing.WithPrevious, Timing.FromStart],
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
    <Frame title='Timing' slider={slider} timeline={animation}>
      <div ref={container} style={{ paddingInline: 10 }}>
        <span style={letterStyle}>FromStart</span>
        <span style={letterStyle}>AfterPrevious</span>
        <span style={letterStyle}>AfterPrevious</span>
        <span style={letterStyle}>WithPrevious</span>
        <span style={letterStyle}>FromStart</span>
      </div>
    </Frame>
  );
}

const letterStyle: React.CSSProperties = {
  display: 'block',
  width: 100,
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
