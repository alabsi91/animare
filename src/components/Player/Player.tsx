import type { animareReturnedObject } from 'animare/lib/methods/types';
import { forwardRef } from 'react';
import './Player.css';

type PlayerT = {
  children?: React.ReactNode;
  title?: string;
  animation?: animareReturnedObject;
  style?: React.CSSProperties;
};

function Player({ children, title = 'Player', animation, style = {} }: PlayerT = {}, ref: React.Ref<any>) {
  return (
    <div style={style} className='player-container'>
      <div className='player-header'>
        <div className='control control--close' />
        <div className='control control--minimize' />
        <div className='control control--expand' />
        <p className='player-title'>{title}</p>
      </div>

      {/* <div className='player-progress-container' /> */}

      <div className='player-body'>{children}</div>

      <div className='player-progress-container'>
        <div ref={ref} />
      </div>

      <div className='player-controll-buttons'>
        <button title='play' onClick={() => animation?.resume()}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M8 5v14l11-7z' />
          </svg>
        </button>

        <button title='pause' onClick={() => animation?.pause()}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
          </svg>
        </button>

        <button title='stop' onClick={() => animation?.stop()}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M6 6h12v12H6z' />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default forwardRef(Player);
