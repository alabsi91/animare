"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.easing=void 0;var easing={linear:function linear(a){return a},easeInSine:function easeInSine(a){return 1-Math.cos(a*Math.PI/2)},easeOutSine:function easeOutSine(a){return Math.sin(a*Math.PI/2)},easeInOutSine:function easeInOutSine(a){return-(Math.cos(Math.PI*a)-1)/2},easeInQuad:function easeInQuad(a){return a*a},easeOutQuad:function easeOutQuad(a){return 1-(1-a)*(1-a)},easeInOutQuad:function easeInOutQuad(a){return .5>a?2*a*a:1-Math.pow(-2*a+2,2)/2},easeInCubic:function easeInCubic(a){return a*a*a},easeOutCubic:function easeOutCubic(a){return 1-Math.pow(1-a,3)},easeInOutCubic:function easeInOutCubic(a){return .5>a?4*a*a*a:1-Math.pow(-2*a+2,3)/2},easeInQuart:function easeInQuart(a){return a*a*a*a},easeOutQuart:function easeOutQuart(a){return 1-Math.pow(1-a,4)},easeInOutQuart:function easeInOutQuart(a){return .5>a?8*a*a*a*a:1-Math.pow(-2*a+2,4)/2},easeInQuint:function easeInQuint(a){return a*a*a*a*a},easeOutQuint:function easeOutQuint(a){return 1-Math.pow(1-a,5)},easeInOutQuint:function easeInOutQuint(a){return .5>a?16*a*a*a*a*a:1-Math.pow(-2*a+2,5)/2},easeInExpo:function easeInExpo(a){return 0===a?0:Math.pow(2,10*a-10)},easeOutExpo:function easeOutExpo(a){return 1===a?1:1-Math.pow(2,-10*a)},easeInOutExpo:function easeInOutExpo(a){var b=Math.pow;return 0===a?0:1===a?1:.5>a?b(2,20*a-10)/2:(2-b(2,-20*a+10))/2},easeInCirc:function easeInCirc(a){return 1-Math.sqrt(1-Math.pow(a,2))},easeOutCirc:function easeOutCirc(a){return Math.sqrt(1-Math.pow(a-1,2))},easeInOutCirc:function easeInOutCirc(a){var b=Math.sqrt,c=Math.pow;return .5>a?(1-b(1-c(2*a,2)))/2:(b(1-c(-2*a+2,2))+1)/2},easeInBack:function easeInBack(a){var b=1.70158;return(b+1)*a*a*a-b*a*a},easeOutBack:function easeOutBack(a){var b=Math.pow,c=1.70158;return 1+(c+1)*b(a-1,3)+c*b(a-1,2)},easeInOutBack:function easeInOutBack(a){var b=Math.pow,c=1.70158*1.525;return .5>a?b(2*a,2)*(2*(c+1)*a-c)/2:(b(2*a-2,2)*((c+1)*(2*a-2)+c)+2)/2},easeInElastic:function easeInElastic(a){var b=2*Math.PI/3;return 0===a?0:1===a?1:-Math.pow(2,10*a-10)*Math.sin((10*a-10.75)*b)},easeOutElastic:function easeOutElastic(a){var b=2*Math.PI/3;return 0===a?0:1===a?1:Math.pow(2,-10*a)*Math.sin((10*a-.75)*b)+1},easeInOutElastic:function easeInOutElastic(a){var b=Math.pow,c=Math.sin,d=2*Math.PI/4.5;return 0===a?0:1===a?1:.5>a?-(b(2,20*a-10)*c((20*a-11.125)*d))/2:b(2,-20*a+10)*c((20*a-11.125)*d)/2+1},easeInBounce:function easeInBounce(a){return 1-easing.easeOutBounce(1-a)},easeOutBounce:function easeOutBounce(a){var b=7.5625,c=2.75;return a<1/c?b*a*a:a<2/c?b*(a-=1.5/c)*a+.75:a<2.5/c?b*(a-=2.25/c)*a+.9375:b*(a-=2.625/c)*a+.984375},easeInOutBounce:function easeInOutBounce(a){return .5>a?(1-easing.easeOutBounce(1-2*a))/2:(1+easing.easeOutBounce(2*a-1))/2}};exports.easing=easing;