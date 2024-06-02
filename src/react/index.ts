import { useRef, useState, useEffect } from 'react';
import { AnimareReturnedObject } from '../methods/types.js';

/**
 * - `useAnimare` custom react hook.
 * @example
 * ```javascript
 * import animare, { ease } from 'animare';
 * import { useAnimare } from 'animare/react';
 *
 * function MyComponent() {
 *
 *   const ballAnimation = useAnimare(() => {
 *     const ball = document.getElementById('ball');
 *
 *     const options = {
 *       to: 1,
 *       duration: 1000,
 *       ease: ease.out.quad,
 *       autoPlay: false,
 *     };
 *
 *     const onUpdate = ([scale]) => {
 *       ball.style.transform = `scale(${scale})`;
 *     };
 *
 *     return animare(options, onUpdate);
 *
 *   });
 *
 *   const onClick = () => {
 *     ballAnimation?.play();
 *   };
 *
 * // ...
 *
 * };
 *
 * ```
 */
export function useAnimare(callback: () => AnimareReturnedObject | undefined) {
  const count = useRef(0);
  const [animation, setAnimation] = useState<AnimareReturnedObject>();

  useEffect(() => {
    if (count.current === 0) {
      count.current = 1;

      const anim = callback();
      if (anim) setAnimation(anim);
    }
    return () => {
      animation?.pause(); // pause animation on unmount.
    };
  }, []);

  return animation;
}
