/**
 * @typedef {object} animareReturned
 * @property {function} play - play forward
 * @property {function} reverse - play backward
 * @property {function} pause - pause the animation
 * @property {function} resume - resume the animation
 * @property {stop} stop - stop the animation at the start or end
 * @property {next} next - add a new animation to the timeline
 * @property {setTimelineOptions} setTimelineOptions - set options for the timeline
 * @property {onStart} onStart - add a callback function to be called when the animation starts
 * @property {function} onFinish - add a callback function to be called when the animation is finished
 * @property {onFinishAsync} onFinishAsync - return a promise that resolves when the animation is finished
 * @property {onProgressAsync} onProgress - add a callback function to be called when the animation is in progress
 * @property {function} onProgressAsync - return a promise that resolves when the animation is in progress
 * @property {setOptions} setOptions - set options for an animation in the timeline
 * @property {getOptions} getOptions - get options for an animation in the timeline
 */
/**
 * @typedef {object} animareOptions
 * @property {number|number[]} [from=0] - start value
 * @property {number|number[]} to - end value
 * @property {number|number[]} [delay=0] - delay before animation start
 * @property {number|number[]} [duration=350] - duration of animation
 * @property {number|number[]} [repeat=0] - number of times to play the animation
 * @property {boolean|boolean[]} [delayOnce=false] - delay only once per repeat
 * @property {boolean} [autoPlay=true] - play the animation immediately
 * @property {function|function[]} [ease=(x)=>x] - easing function
 * @property {'normal'|'reverse'|'alternate'|'alternate-reverse'|Array<'normal'|'reverse'|'alternate'|'alternate-reverse'>} [direction=DIRECTION.NORMAL] - direction of animation
 * @property {'wait'|'immediate'} [type='immediate'] - animation next behavior, wait or immediate
 */
/**
 * @typedef {object} callbakObject
 * @property {number} fps - frames per second
 * @property {boolean} isFirstFrame - is first frame
 * @property {boolean} isFinished - is animation finished
 * @property {number} time - progress time
 * @property {number} timelineProgress - progress of timeline including repeats
 * @property {number[]} progress - progress of each animation
 * @property {number[]} timelineIndex - current timeline for each animation 
 * @property {number[]} repeatCount - number of repeats for each animation
 * @property {number} timelineRepeatCount - number of repeats for the timeline desending
 * @property {function} play - play the animation
 * @property {function} reverse - reverse the animation
 * @property {function} pause - pause the animation
 * @property {function} stop - stop the animation
 * @property {getOptions} getOptions - get options of the animation
 */
/**
 * @callback animationCallback
 * @param {number[]} - animated values
 * @param {callbakObject} - animation info
 */
/**
 * @callback stop
 * @param {boolean} stopAtStart - stop at start or stop at end of animation
 */
/**
 * @callback next
 * @param {animareOptions} op - options for the next animation
 * @returns {animareReturned} - animare returned object
 */
/**
 * @typedef {object} setTimelineOptionsOptions
 * @property {number} [repeat=0] - number of times to repeat the timeline after the first play.
 * @property {number} [speed=1] // multiplier for durations and delays of all animations in the timeline.
 */
/**
 * @callback setTimelineOptions
 * @param {setTimelineOptionsOptions} op
 */
/**
 * @callback onStart
 * @param {function} cb - callback
 * @returns {function} - cancel function
 */
/**
 * @callback onFinish
 * @param {function} cb - callback
 * @returns {function} - cancel function
 */
/**
 * @callback onFinishAsync
 * @returns {Promise} - promise that resolves when the animation finishes
 */
/**
 * @callback onProgress
 * @param {number} at - at which progress to fire the callback
 * @param {function} cb - callback
 * @returns {function} - cancel function
 */
/**
 * @callback onProgressAsync
 * @param {number} at - at which progress to fire the callback
 * @returns {Promise} - a promise that resolves when the progress reaches the given value.
 */
/**
 * @callback setOptions
 * @param {animareOptions} - returns the animation options.
 * @param {number} [index=0] - animation index in the timeline.
 */
/**
 * @callback getOptions
 * @param {number} [index=0] - animation index in the timeline.
 * @returns {animareOptions} - returns the animation options.
 */

/*
  * default options
  - from -> 0 (inherited from the end of the previous animation)
  - delay -> 0
  - delayOnce -> false
  - duration -> if not specified -> 350 , if not found in duration array -> last value in duration array (inherited from the previous animation)
  - direction -> 'normal'
  - ease -> 'linear' (inherited from the previous animation)
  - repeat -> 0
  - type -> 'immediate' (inherited from the previous animation)
  - autoPlay -> true (only for first animation in the timeline)

  * timeline type 'wait'
  - the next animation in the timeline will not play until all animations in previous timeline are finished.

  ================      |=========================== 
  ====================  |=================           
  ================      |=========================    <-- animations in the timeline
  ======================|======================      
    ^ first timeline    |   ^ second timeline   

  * timeline type 'immediate'
  - the next animation in the timeline will play immediately. which make the overall animation shorter.
  - the first animation in the timeline type will be used if the timeline is playing in reverse or repeating.

  ================|===========================
  ====================|=================
  ================|=========================         <-- animations in the timeline
  ======================|======================
   ^ first timeline    |   ^ second timeline

 */