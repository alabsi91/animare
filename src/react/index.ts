import { useRef, useState, useEffect } from 'react';
import { animareReturnedObject } from '../methods/types';

/**
 * - custom hook for animare.
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
export function useAnimare(callback: () => animareReturnedObject) {
  const isLoaded = useRef(false);
  const [animation, setAnimation] = useState<animareReturnedObject>();

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;
    setAnimation(callback());
  }, []);

  return animation;
}
