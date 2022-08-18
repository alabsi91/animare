import animare, { ease } from 'animare';
import { useAnimare } from 'animare/react';
import { useRef } from 'react';
import Player from '../Player/Player';

export default function HeroExample() {
  const playerProgress = useRef<HTMLDivElement>();

  const animation = useAnimare(() => {
    const ball = document.getElementById('ball') as HTMLDivElement;
    return animare(
      {
        to: [100, 100],
        duration: 2000,
        ease: [ease.linear, ease.out.bounce],
        autoPlay: false,
      },
      ([x, y], { timelineProgress }) => {
        ball.style.left = `${x}%`;
        ball.style.top = `${y}%`;
        // player progress
        if (playerProgress.current) playerProgress.current.style.width = `${timelineProgress * 100}%`;
      }
    );
  });

  return (
    <Player ref={playerProgress} title='Example' animation={animation}>
      <div className='hero-example-container'>
        <div id='ball' className='hero-example-ball' />
      </div>
    </Player>
  );
}
