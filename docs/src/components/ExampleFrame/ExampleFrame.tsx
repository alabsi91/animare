import { useEffect, useRef } from 'react';
import styles from './ExampleFrame.module.css';

import { Event, type GroupTimelineObject, type SingleObject, type TimelineObject } from 'animare';

type Props = {
  title: string;
  timeline: TimelineObject<string> | GroupTimelineObject | SingleObject;
  slider: React.MutableRefObject<HTMLInputElement | null>;
  children: React.ReactNode;
};
export default function Example(props: Props) {
  const playButtonIcon = useRef<SVGPathElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  props.slider.current = slider.current;

  useEffect(() => {
    if (!props.timeline) return;

    props.timeline.on(Event.Play, () => {
      togglePlayButtonIcon(false);
    });

    props.timeline.on(Event.Resume, () => {
      togglePlayButtonIcon(false);
    });

    props.timeline.on(Event.Pause, () => {
      togglePlayButtonIcon(true);
    });

    props.timeline.on(Event.Complete, () => {
      togglePlayButtonIcon(true);
    });
  }, [props.timeline]);

  const togglePlayButtonIcon = (play: boolean) => {
    if (!playButtonIcon.current) return;

    if (play) {
      playButtonIcon.current.style.d = 'path("M20,20 L80,50 L20,80 L20,80 Z M65,20 L80,20 L80,20 L65,20 Z")';
      return;
    }

    playButtonIcon.current.style.d = 'path("M20,20 L35,20 L35,80 L20,80 Z M65,20 L80,20 L80,80 L65,80 Z")';
  };

  function playPauseHandler() {
    if (props.timeline.timelineInfo.isPlaying) {
      props.timeline.pause();
      return;
    }

    const value = slider.current?.value ?? '0';
    const time = props.timeline.timelineInfo.isFinished ? 0 : props.timeline.timelineInfo.duration * parseFloat(value);
    props.timeline.play(time);
  }

  function inputRangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    props.timeline.seek(props.timeline.timelineInfo.duration * value);
    if (!props.timeline.timelineInfo.isPlaying) props.timeline.playOneFrame();
  }

  return (
    <div className={styles.wrapper}>
      <span>{props.title}</span>
      {props.children}

      <div className={styles.controlsContainer}>
        <button onClick={playPauseHandler}>
          <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 100 100' width='24px'>
            <path ref={playButtonIcon} d='M20,20 L80,50 L20,80 L20,80 Z M65,20 L80,20 L80,20 L65,20 Z' />
          </svg>
        </button>

        <input
          ref={slider}
          className={styles.slider}
          onChange={inputRangeHandler}
          type='range'
          min='0'
          max='1'
          defaultValue='0'
          step={0.001}
        />
      </div>
    </div>
  );
}
