"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=animare;function _toConsumableArray(arr){return _arrayWithoutHoles(arr)||_iterableToArray(arr)||_unsupportedIterableToArray(arr)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var source,i=1;i<arguments.length;i++)source=null==arguments[i]?{}:arguments[i],i%2?ownKeys(Object(source),!0).forEach(function(key){_defineProperty(target,key,source[key])}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))});return target}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _typeof(obj){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}var DIRECTION={NORMAL:"normal",REVERSE:"reverse",ALTERNATE:"alternate",ALTERNATE_REVERSE:"alternate-reverse"},TIMELINE_TYPE={WAIT:"wait",IMMEDIATE:"immediate"};function animare(options,callback){var _options$from,_options$delay,_options$delayOnce,_options$duration,_options$direction,_options$repeat,_options$ease,_options$autoPlay,_options$type;if("object"!==_typeof(options)||Array.isArray(options))throw new Error("animare: expects an object as the first argument.");var userInput=_objectSpread({},options);null!==(_options$from=options.from)&&void 0!==_options$from?_options$from:options.from=0,options.to=Array.isArray(options.to)?options.to:[options.to],null!==(_options$delay=options.delay)&&void 0!==_options$delay?_options$delay:options.delay=0,null!==(_options$delayOnce=options.delayOnce)&&void 0!==_options$delayOnce?_options$delayOnce:options.delayOnce=!1,null!==(_options$duration=options.duration)&&void 0!==_options$duration?_options$duration:options.duration=350,null!==(_options$direction=options.direction)&&void 0!==_options$direction?_options$direction:options.direction=DIRECTION.NORMAL,null!==(_options$repeat=options.repeat)&&void 0!==_options$repeat?_options$repeat:options.repeat=0,null!==(_options$ease=options.ease)&&void 0!==_options$ease?_options$ease:options.ease=function(x){return x},null!==(_options$autoPlay=options.autoPlay)&&void 0!==_options$autoPlay?_options$autoPlay:options.autoPlay=!0,null!==(_options$type=options.type)&&void 0!==_options$type?_options$type:options.type=TIMELINE_TYPE.IMMEDIATE;var checkInputs=function(options){if("number"!=typeof options.from&&!Array.isArray(options.from)||Array.isArray(options.from)&&options.from.some(function(e){return"number"!=typeof e}))throw new Error("animare: [from] must be a number or an array of numbers");if("number"!=typeof options.to&&!Array.isArray(options.to)||Array.isArray(options.to)&&options.to.some(function(e){return"number"!=typeof e}))throw new Error("animare: [to] must be a number or an array of numbers");if("number"!=typeof options.delay&&!Array.isArray(options.delay)||Array.isArray(options.delay)&&options.delay.some(function(e){return"number"!=typeof e||0>e})||"number"==typeof options.delay&&0>options.delay)throw new Error("animare: [delay] must be a number or an array of numbers greater than or equal to 0");if("boolean"!=typeof options.delayOnce&&!Array.isArray(options.delayOnce)||Array.isArray(options.delayOnce)&&options.delayOnce.some(function(e){return"boolean"!=typeof e}))throw new Error("animare: [delayOnce] must be a boolean or an array of booleans");if("number"!=typeof options.duration&&!Array.isArray(options.duration)||Array.isArray(options.duration)&&options.duration.some(function(e){return"number"!=typeof e||0>e})||"number"==typeof options.duration&&0>options.duration)throw new Error("animare: [duration] must be a number or an array of numbers greater than or equal to 0");if("string"==typeof options.direction&&!Object.values(DIRECTION).includes(options.direction)||Array.isArray(options.direction)&&options.direction.some(function(e){return"string"!=typeof e&&!Object.values(DIRECTION).includes(e)}))throw new Error("animare: [direction] must be a string or an array of strings and one of the following: "+Object.values(DIRECTION).join(", "));if("number"!=typeof options.repeat&&!Array.isArray(options.repeat)||Array.isArray(options.repeat)&&options.repeat.some(function(e){return"number"!=typeof e}))throw new Error("animare: [repeat] must be a number or an array of numbers");if("function"!=typeof options.ease&&!Array.isArray(options.ease)||Array.isArray(options.ease)&&options.ease.some(function(e){return"function"!=typeof e}))throw new Error("animare: [ease] must be a function or an array of functions");if("boolean"!=typeof options.autoPlay)throw new Error("animare: [autoPlay] must be a boolean");if("function"!=typeof callback)throw new Error("animare: [callback] must be a function")};checkInputs(options);var fpsTimeStamp,excuteTimeStamp,excuteDuration,isFirstFrame,pausedAt,isStoped,resolveAsyncOnFinish,resolveAsyncOnProgress,reqId,start=[],progresses=_toConsumableArray(options.to).fill(0),isReversePlay=!1,repeatCount=Array.isArray(options.repeat)?_toConsumableArray(options.repeat):_toConsumableArray(options.to).fill(options.repeat),alternateCycle=_toConsumableArray(options.to).fill(1),finished=new Set,lastKnownValue=_toConsumableArray(options.to),timeline=[{options:_objectSpread({},options),userInput:userInput}],timelineAt=_toConsumableArray(options.to).fill(0),tlOptions={repeat:0,speed:1},tlRepeatCount=_toConsumableArray(options.to).fill(tlOptions.repeat),listeners={onProgress:[],onStart:[],onFinish:[]},progressTimeSet=new Set,startAnim=function(timeStamp){start=_toConsumableArray(options.to).fill(timeStamp),excuteTimeStamp=fpsTimeStamp=timeStamp,listeners.onStart.forEach(function(_ref){var cb=_ref.cb;return cb()}),isFirstFrame=!0,excute(timeStamp),isFirstFrame=!1},excute=function(now){for(var callbackParams=[],i=0;i<options.to.length;i++){var _op$direction$i,_op$repeat$i,_op$delayOnce$i,_op$delay$i,_op$duration$i,_op$ease$i,_op$from$i,_op$from$i2;if(finished.has(i)){callbackParams.push(lastKnownValue[i]);continue}var op=timeline[timelineAt[i]].options,direction=Array.isArray(op.direction)?null!==(_op$direction$i=op.direction[i])&&void 0!==_op$direction$i?_op$direction$i:DIRECTION.NORMAL:op.direction,isReversed=direction===DIRECTION.REVERSE||direction===DIRECTION.ALTERNATE_REVERSE&&1===alternateCycle[i]||direction===DIRECTION.ALTERNATE&&2===alternateCycle[i];isReversed=isReversePlay?direction.includes(DIRECTION.ALTERNATE)?isReversed:!isReversed:isReversed;var repeat=Array.isArray(op.repeat)?null!==(_op$repeat$i=op.repeat[i])&&void 0!==_op$repeat$i?_op$repeat$i:0:op.repeat,delayOnce=Array.isArray(op.delayOnce)?null!==(_op$delayOnce$i=op.delayOnce[i])&&void 0!==_op$delayOnce$i&&_op$delayOnce$i:op.delayOnce,delay=(2===alternateCycle[i]||delayOnce&&repeatCount[i]<repeat||delayOnce&&tlRepeatCount[i]<tlOptions.repeat?0:Array.isArray(op.delay)?null!==(_op$delay$i=op.delay[i])&&void 0!==_op$delay$i?_op$delay$i:0:op.delay)*tlOptions.speed,duration=Array.isArray(op.duration)?null!==(_op$duration$i=op.duration[i])&&void 0!==_op$duration$i?_op$duration$i:op.duration.at(-1):op.duration;duration=(direction.includes(DIRECTION.ALTERNATE)?duration/2:duration)*tlOptions.speed;var ease=Array.isArray(op.ease)?null!==(_op$ease$i=op.ease[i])&&void 0!==_op$ease$i?_op$ease$i:function(x){return x}:op.ease,from=isReversed?op.to[i]:Array.isArray(op.from)?null!==(_op$from$i=op.from[i])&&void 0!==_op$from$i?_op$from$i:0:op.from,to=isReversed?Array.isArray(op.from)?null!==(_op$from$i2=op.from[i])&&void 0!==_op$from$i2?_op$from$i2:0:op.from:op.to[i];if(0>now-start[i]-delay){callbackParams.push(from);continue}var p=(now-(start[i]+delay))/duration;p=1<=p||Number.isNaN(p)?1:p;var x=from+(to-from)*ease(p);if(callbackParams.push(x),progresses[i]=p,1===p&&(lastKnownValue[i]=x),!(now-(start[i]+delay)<duration)){if(direction.includes(DIRECTION.ALTERNATE)&&1===alternateCycle[i]){start[i]=now,alternateCycle[i]=2;continue}if(0<repeat&&0<repeatCount[i]){repeatCount[i]--,start[i]=now,alternateCycle[i]=1;continue}if(-1===repeat){-1===repeatCount[i]&&(repeatCount[i]=-2),start[i]=now,alternateCycle[i]=1;continue}if(isReversePlay&&0<timelineAt[i]||!isReversePlay&&timelineAt[i]<timeline.length-1){var nextTimelineType=timeline[isReversePlay?timelineAt[i]-1:timelineAt[i]+1].options.type;if(nextTimelineType===TIMELINE_TYPE.IMMEDIATE){var _nextRepeat$i;isReversePlay?timelineAt[i]--:timelineAt[i]++;var nextRepeat=timeline[timelineAt[i]].options.repeat;nextRepeat=Array.isArray(nextRepeat)?null!==(_nextRepeat$i=nextRepeat[i])&&void 0!==_nextRepeat$i?_nextRepeat$i:0:nextRepeat,alternateCycle[i]=1,start[i]=now;continue}}var isTimelineFinished=isReversePlay&&0===timelineAt[i]||!isReversePlay&&timelineAt[i]===timeline.length-1;if(isTimelineFinished&&(0<tlOptions.repeat&&0<tlRepeatCount[i]||-1===tlOptions.repeat&&isTimelineFinished)&&timeline.at(isReversePlay?-1:0).options.type===TIMELINE_TYPE.IMMEDIATE){var _op$repeat$i2;-1!==tlOptions.repeat&&tlRepeatCount[i]--,-1===tlRepeatCount[i]&&(tlRepeatCount[i]=-2);var _op=timeline.at(reverse?-1:0).options;repeatCount[i]=Array.isArray(_op.repeat)?null!==(_op$repeat$i2=_op.repeat[i])&&void 0!==_op$repeat$i2?_op$repeat$i2:0:_op.repeat,timelineAt[i]=isReversePlay?timeline.length-1:0,alternateCycle[i]=1,finished.delete(i),start[i]=now;continue}finished.add(i)}}callbackParams.length!==options.to.length&&console.warn("callbackParams length is not equal to to length.");var fps=isFinite(Math.round(1e3/(now-fpsTimeStamp)))?Math.round(1e3/(now-fpsTimeStamp)):0;fpsTimeStamp=now;var isFinished=finished.size===options.to.length&&timelineAt.every(function(t){return isReversePlay?0===t:t===timeline.length-1})&&repeatCount.every(function(x){return 0===x})&&tlRepeatCount.every(function(x){return 0===x}),time=~~(now-excuteTimeStamp),progress=-1===excuteDuration?-1:+(1<time/excuteDuration?1:time/excuteDuration).toFixed(3);if(callback(callbackParams,{fps:fps,isFirstFrame:isFirstFrame,isFinished:isFinished,time:time,timelineProgress:progress,progress:progresses,timelineIndex:timelineAt,repeatCount:repeatCount,timelineRepeatCount:tlRepeatCount,alternateCycle:alternateCycle,play:play,reverse:reverse,pause:pause,stop:stop,getOptions:getOptions}),-1!==progress){for(var _i=0;_i<listeners.onProgress.length;_i++){var listener=listeners.onProgress[_i],at=listener.at,cb=listener.cb,id=listener.id;progress>=at&&!progressTimeSet.has(id)&&(cb(),progressTimeSet.add(id))}if(resolveAsyncOnProgress){var _resolveAsyncOnProgre=resolveAsyncOnProgress,_at=_resolveAsyncOnProgre.at,resolve=_resolveAsyncOnProgre.resolve;progress>=_at&&!progressTimeSet.has(time)&&(progressTimeSet.add(time),resolve(),resolveAsyncOnProgress=null)}}if(finished.size!==options.to.length&&!isStoped)return void(reqId=requestAnimationFrame(excute));if(1!==new Set(timelineAt).size&&console.warn("[timelineAt] array elements are not the same."),isReversePlay&&0<timelineAt[0]||!isReversePlay&&timelineAt[0]<timeline.length-1){var timelineType=timeline[isReversePlay?timelineAt[0]-1:timelineAt[0]+1].options.type;if(timelineType!==TIMELINE_TYPE.WAIT)return;timelineAt.fill(isReversePlay?timelineAt[0]-1:timelineAt[0]+1);var _nextRepeat=timeline[timelineAt[0]].options.repeat;return repeatCount=Array.isArray(_nextRepeat)?_toConsumableArray(_nextRepeat):_toConsumableArray(options.to).fill(_nextRepeat),alternateCycle.fill(1),finished.clear(),start.fill(now),void(reqId=requestAnimationFrame(excute))}if(0<tlOptions.repeat&&0<tlRepeatCount[0]||-1===tlOptions.repeat){var _timelineType=timeline.at(isReversePlay?-1:0).options.type;if(_timelineType!==TIMELINE_TYPE.WAIT)return;-1!==tlOptions.repeat&&tlRepeatCount.fill(tlRepeatCount[0]-1),-1===tlRepeatCount[0]&&tlRepeatCount.fill(-2);var _op2=timeline.at(isReversePlay?-1:0).options;return repeatCount=Array.isArray(_op2.repeat)?_toConsumableArray(_op2.repeat):_toConsumableArray(_op2.to).fill(_op2.repeat),isReversePlay?timelineAt.fill(timeline.length-1):timelineAt.fill(0),alternateCycle.fill(1),finished.clear(),start.fill(now),void(reqId=requestAnimationFrame(excute))}listeners.onFinish.forEach(function(_ref2){var cb=_ref2.cb;return cb()}),resolveAsyncOnFinish&&(resolveAsyncOnFinish(),resolveAsyncOnFinish=null),reqId=null,finished.clear()},calculateTime=function(){var time=0,isInfinitive=-1===tlOptions.repeat||timeline.some(function(x){return Array.isArray(x.options.repeat)?x.options.repeat.some(function(r){return-1===r}):-1===x.options.repeat});if(isInfinitive)return time=-1,time;for(var tl=isReversePlay?[].concat(timeline).reverse():timeline,columns=[],columnsWithoutDelay=[],t=0;t<tl.length;t++){for(var column=[],columnWithoutDelay=[],i=0;i<options.to.length;i++){var _options$delay$i,_options$duration$i,_options$repeat$i,_options$delayOnce$i,_options=tl[t].options,delay=Array.isArray(_options.delay)?null!==(_options$delay$i=_options.delay[i])&&void 0!==_options$delay$i?_options$delay$i:0:_options.delay,duration=Array.isArray(_options.duration)?null!==(_options$duration$i=_options.duration[i])&&void 0!==_options$duration$i?_options$duration$i:_options.duration[i].at(-1):_options.duration,repeat=(Array.isArray(_options.repeat)?null!==(_options$repeat$i=_options.repeat[i])&&void 0!==_options$repeat$i?_options$repeat$i:0:_options.repeat)+1,delayOnce=Array.isArray(_options.delayOnce)?null!==(_options$delayOnce$i=_options.delayOnce[i])&&void 0!==_options$delayOnce$i&&_options$delayOnce$i:_options.delayOnce,withDelay=(delayOnce?duration*repeat+delay:(delay+duration)*repeat)*tlOptions.speed;column.push(withDelay),columnWithoutDelay.push(duration*repeat*tlOptions.speed)}columns.push(column),columnsWithoutDelay.push(columnWithoutDelay)}for(var immediateGroups=[],waitGroups=[],_i2=0;_i2<tlOptions.repeat+1;_i2++)for(var _t=0;_t<tl.length;_t++){var _next=_t+1>=tl.length?0:_t+1,isLastIteration=_i2===tlOptions.repeat&&_t===tl.length-1,op=tl[_next];if(op.options.type===TIMELINE_TYPE.IMMEDIATE){var _immediateGroups$at,_immediateGroups$at$a,isDelayOnce=0<_i2&&tl[_t].options.delayOnce,isNextDelayOnce=_t+1>=tl.length&&tl[0].options.delayOnce||0<_i2&&tl[_next].options.delayOnce,putNext=!!(isLastIteration&&_t+1<tl.length)||!isLastIteration;(null===immediateGroups||void 0===immediateGroups||null===(_immediateGroups$at=immediateGroups.at(-1))||void 0===_immediateGroups$at||null===(_immediateGroups$at$a=_immediateGroups$at.at(-1))||void 0===_immediateGroups$at$a?void 0:_immediateGroups$at$a[0])===_t?putNext&&immediateGroups.at(-1).push([_next,isNextDelayOnce]):putNext?immediateGroups.push([[_t,isDelayOnce],[_next,isNextDelayOnce]]):immediateGroups.push([[_t,isDelayOnce]])}var isNextWait=tl[_next].options.type===TIMELINE_TYPE.WAIT,isCurrentWait=tl[_t].options.type===TIMELINE_TYPE.WAIT||0===_i2&&0===_t;if(isCurrentWait&&isNextWait){var cl=0<_i2&&tl[_t].options.delayOnce?columnsWithoutDelay[_t]:columns[_t];waitGroups.push(Math.max.apply(Math,_toConsumableArray(cl)))}}for(var mixed=[],_i3=0;_i3<immediateGroups.length;_i3++){for(var group=immediateGroups[_i3],last=null,_loop=function(g){var _group,_group2,a=group[g][0],b=null===(_group=group[g+1])||void 0===_group?void 0:_group[0],columnA=group[g][1]?columnsWithoutDelay:columns,columnB=null!==(_group2=group[g+1])&&void 0!==_group2&&_group2[1]?columnsWithoutDelay:columns,ab=void 0===b?columnA[a]:columnA[a].map(function(num,i){return num+columnB[b][i]});last=last?last.map(function(num,i){return num+ab[i]}):ab},g=0;g<group.length;g+=2)_loop(g);mixed.push(Math.max.apply(Math,_toConsumableArray(last)))}var overall=[].concat(mixed,waitGroups).reduce(function(a,b){return a+b});return time=overall,time+=25*tlOptions.repeat,time},reset=function(reverse){cancelAnimationFrame(reqId);var op=timeline.at(reverse?-1:0).options;repeatCount=Array.isArray(op.repeat)?_toConsumableArray(op.repeat):_toConsumableArray(op.to).fill(op.repeat),tlRepeatCount=_toConsumableArray(options.to).fill(tlOptions.repeat),alternateCycle.fill(1),finished.clear(),progressTimeSet.clear(),fpsTimeStamp=0,isStoped=!1},play=function(){reset(!1),isReversePlay=!1,timelineAt.fill(0),excuteDuration=calculateTime(),reqId=requestAnimationFrame(startAnim)},reverse=function(){reset(!0),isReversePlay=!0,timelineAt.fill(timeline.length-1),excuteDuration=calculateTime(),reqId=requestAnimationFrame(startAnim)},pause=function(){cancelAnimationFrame(reqId),pausedAt=performance.now()},resume=function(){if(pausedAt){var now=performance.now(),delta=now-pausedAt;start=start.map(function(s){return s+delta}),excuteTimeStamp+=delta,pausedAt=null}isStoped=!1,reqId=requestAnimationFrame(excute)},stop=function(){var stopAtStart=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];stopAtStart?play():reverse(),isStoped=!0,reqId=null},next=function(op){var _op$duration,_op$ease,_op$type,_op$repeat,_op$direction,_op$delay,_op$delayOnce;if("object"!==_typeof(op))throw new Error("animare: next() expects an object as the first argument.");if(!Array.isArray(op.to)&&"number"!=typeof op.to)throw new Error("animare: next() [to] must be a number or an array of numbers.");var userInput=_objectSpread({},op),previousTimeline=_objectSpread({},timeline.at(-1));if(previousTimeline.options.to.length!==op.to.length)throw new Error("animare: next() [to] must have the same length as the previous animation.");if("undefined"==typeof op.from)if(Array.isArray(previousTimeline.options.direction)){for(var from=[],i=0;i<options.to.length;i++){var _previousTimeline$opt,_previousTimeline$opt2,prevDirection=null!==(_previousTimeline$opt=previousTimeline.options.direction[i])&&void 0!==_previousTimeline$opt?_previousTimeline$opt:DIRECTION.NORMAL,isPrevReverse=prevDirection===DIRECTION.REVERSE,isPrevAlternate=prevDirection===DIRECTION.ALTERNATE,prevFrom=Array.isArray(previousTimeline.options.from)?null!==(_previousTimeline$opt2=previousTimeline.options.from[i])&&void 0!==_previousTimeline$opt2?_previousTimeline$opt2:0:previousTimeline.options.from;from[i]=isPrevAlternate||isPrevReverse?prevFrom:previousTimeline.options.to[0]}op.from=from}else{var _op$from,_prevDirection=previousTimeline.options.direction,_isPrevReverse=_prevDirection===DIRECTION.REVERSE,_isPrevAlternate=_prevDirection===DIRECTION.ALTERNATE;null!==(_op$from=op.from)&&void 0!==_op$from?_op$from:op.from=_isPrevAlternate||_isPrevReverse?previousTimeline.options.from:previousTimeline.options.to}return null!==(_op$duration=op.duration)&&void 0!==_op$duration?_op$duration:op.duration=previousTimeline.options.duration,null!==(_op$ease=op.ease)&&void 0!==_op$ease?_op$ease:op.ease=previousTimeline.options.ease,null!==(_op$type=op.type)&&void 0!==_op$type?_op$type:op.type=previousTimeline.options.type,null!==(_op$repeat=op.repeat)&&void 0!==_op$repeat?_op$repeat:op.repeat=_toConsumableArray(op.to).fill(0),null!==(_op$direction=op.direction)&&void 0!==_op$direction?_op$direction:op.direction=DIRECTION.NORMAL,null!==(_op$delay=op.delay)&&void 0!==_op$delay?_op$delay:op.delay=0,null!==(_op$delayOnce=op.delayOnce)&&void 0!==_op$delayOnce?_op$delayOnce:op.delayOnce=!1,op.autoPlay=!1,checkInputs(op),timeline.some(function(t){return Array.isArray(t.options.repeat)?t.options.repeat.some(function(r){return-1===r}):-1===t.options.repeat})&&console.warn("animare: next() Some animations are blocked by infinite repeat."),timeline.push({options:op,userInput:userInput}),returned},setTimelineOptions=function(op){if("object"!==_typeof(op))throw new Error("animare: setTimelineOptions() expects an object as the first argument.");if(op.repeat&&"number"!=typeof op.repeat)throw new Error("animare: setTimelineOptions() [repeat] must be a number.");tlOptions=_objectSpread(_objectSpread({},tlOptions),op),tlRepeatCount=_toConsumableArray(options.to).fill(tlOptions.repeat),reqId&&(excuteDuration=calculateTime())},onFinishAsync=function(){return resolveAsyncOnFinish?void 0:new Promise(function(resolve){resolveAsyncOnFinish=resolve})},onProgressAsync=function(at){if("number"!=typeof at)throw new Error("animare: [onProgress] accept a number as the first argument.");if(0>at||1<at)throw new Error("animare: [onProgress] first argument must be a number between 0 and 1");return resolveAsyncOnProgress?void 0:new Promise(function(resolve){resolveAsyncOnProgress={at:at,resolve:resolve}})},setOptions=function(op){var index=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;if("object"!==_typeof(op)||Array.isArray(op))throw new Error("animare: setOptions() expects an object as the first argument.");if("number"!=typeof index)throw new Error("animare: setOptions() expects a number as the second argument.");if(0>index||index>=timeline.length)throw new Error("animare: setOptions() [index] is out of range.");var isTo=void 0!==op.to,isDuration=void 0!==op.duration,isDelay=void 0!==op.delay,isRepeat=void 0!==op.repeat,nextTl=null===timeline||void 0===timeline?void 0:timeline[index+1],tlDurationChanged=[];if(nextTl){isTo&&void 0===nextTl.userInput.from&&(nextTl.options.from=op.to);for(var nextAnim,i=index+1;i<timeline.length;i++)nextAnim=timeline[i],op.ease&&!nextAnim.userInput.ease&&(nextAnim.options.ease=op.ease),isDuration&&"undefined"==typeof nextAnim.userInput.duration&&(nextAnim.options.duration=op.duration,tlDurationChanged.push(i))}if(isDuration||isDelay)for(var _i4=0;_i4<timelineAt.length;_i4++){var _OldOp$duration$_i,_op$duration$_i,_OldOp$delayOnce$_i,_OldOp$repeat$_i,_timeline$timelineAt$,_currentDelay$_i,isMounted=timelineAt[_i4]===index||tlDurationChanged.includes(timelineAt[_i4]),OldOp=timeline[index].options,oldDuration=Array.isArray(OldOp.duration)?null!==(_OldOp$duration$_i=OldOp.duration[_i4])&&void 0!==_OldOp$duration$_i?_OldOp$duration$_i:OldOp.duration.at(-1):OldOp.duration,duration=isDuration?Array.isArray(op.duration)?null!==(_op$duration$_i=op.duration[_i4])&&void 0!==_op$duration$_i?_op$duration$_i:op.duration.at(-1):op.duration:oldDuration,delayOnce=Array.isArray(OldOp.delayOnce)?null!==(_OldOp$delayOnce$_i=OldOp.delayOnce[_i4])&&void 0!==_OldOp$delayOnce$_i&&_OldOp$delayOnce$_i:OldOp.delayOnce,repeat=Array.isArray(OldOp.repeat)?null!==(_OldOp$repeat$_i=OldOp.repeat[_i4])&&void 0!==_OldOp$repeat$_i?_OldOp$repeat$_i:0:OldOp.repeat,currentDelay=isDelay&&timelineAt[_i4]===index?op.delay:timeline[timelineAt[_i4]].options.delay,oldDelay=2===alternateCycle[_i4]||delayOnce&&repeatCount[_i4]<repeat||delayOnce&&tlRepeatCount[_i4]<tlOptions.repeat?0:Array.isArray(timeline[timelineAt[_i4]].options.delay)?null!==(_timeline$timelineAt$=timeline[timelineAt[_i4]].options.delay[_i4])&&void 0!==_timeline$timelineAt$?_timeline$timelineAt$:0:timeline[timelineAt[_i4]].options.delay,delay=2===alternateCycle[_i4]||delayOnce&&repeatCount[_i4]<repeat||delayOnce&&tlRepeatCount[_i4]<tlOptions.repeat?0:Array.isArray(currentDelay)?null!==(_currentDelay$_i=currentDelay[_i4])&&void 0!==_currentDelay$_i?_currentDelay$_i:0:currentDelay;if(isMounted){var p=(performance.now()-(start[_i4]+oldDelay))/oldDuration;start[_i4]=performance.now()-duration*p-delay,pausedAt&&(start[_i4]=pausedAt-duration*((pausedAt-(start[_i4]+oldDelay))/oldDuration)-delay)}}timeline[index].options=_objectSpread(_objectSpread({},timeline[index].options),op),timeline[index].userInput=_objectSpread(_objectSpread({},timeline[index].userInput),op),(isDuration||isDelay||isRepeat)&&(excuteDuration=calculateTime()),checkInputs(timeline[index].options)},getOptions=function(){var index=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0;if(index>timeline.length-1)throw new Error("animare: getOptions() index out of range.");return timeline[index].options},returned={play:play,reverse:reverse,pause:pause,resume:resume,stop:stop,next:next,setTimelineOptions:setTimelineOptions,onStart:function onStart(cb){if("function"!=typeof cb)throw new Error("[onStart] param must be a callback function");var id="onStart_".concat(100*Math.random());return listeners.onStart.push({cb:cb,id:id}),function(){listeners.onStart=listeners.onStart.filter(function(listener){return listener.id!==id})}},onFinish:function onFinish(cb){if("function"!=typeof cb)throw new Error("animare: [onFinish] accept a callback function only");var id="onFinish_".concat(Math.random());return listeners.onFinish.push({cb:cb,id:id}),function(){listeners.onFinish=listeners.onFinish.filter(function(listener){return listener.id!==id})}},onFinishAsync:onFinishAsync,onProgress:function onProgress(at,cb){if("number"!=typeof at)throw new Error("animare: [onProgress] accept a number as the first argument.");if(0>at||1<at)throw new Error("animare: [onProgress] [at] must be between 0 and 1");if("function"!=typeof cb)throw new Error("animare: [onFinish] accept a callback function only");var id="onProgress_".concat(Math.random());return listeners.onProgress.push({at:at,cb:cb,id:id}),function(){listeners.onProgress=listeners.onProgress.filter(function(listener){return listener.id!==id})}},onProgressAsync:onProgressAsync,setOptions:setOptions,getOptions:getOptions};return options.autoPlay&&play(),returned}