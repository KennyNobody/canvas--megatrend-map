/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/hammerjs/hammer.js":
/*!*****************************************!*\
  !*** ./node_modules/hammerjs/hammer.js ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return Hammer;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}

})(window, document, 'Hammer');


/***/ }),

/***/ "./node_modules/normalize.css/normalize.css":
/*!**************************************************!*\
  !*** ./node_modules/normalize.css/normalize.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/main.scss":
/*!***************************!*\
  !*** ./src/css/main.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/data-markers.js":
/*!********************************!*\
  !*** ./src/js/data-markers.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "data": () => (/* binding */ data)
/* harmony export */ });
let data = [
    {
        role: 'Vector_106',
        data: 'M1519.16 171.009C1515.84 171.009 1513.14 168.311 1513.14 164.997C1513.14 161.682 1515.84 158.985 1519.16 158.985C1522.47 158.985 1525.17 161.682 1525.17 164.997C1525.17 168.311 1522.47 171.009 1519.16 171.009Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_108',
        data: 'M1345.93 171.009C1342.61 171.009 1339.92 168.312 1339.92 164.997C1339.92 161.681 1342.61 158.984 1345.93 158.984C1349.24 158.984 1351.94 161.681 1351.94 164.997C1351.94 168.312 1349.24 171.009 1345.93 171.009Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_110',
        data: 'M1432.54 171.009C1429.23 171.009 1426.53 168.311 1426.53 164.997C1426.53 161.682 1429.23 158.985 1432.54 158.985C1435.86 158.985 1438.55 161.682 1438.55 164.997C1438.55 168.311 1435.86 171.009 1432.54 171.009Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_112',
        data: 'M1276.64 240.3C1273.32 240.3 1270.62 237.603 1270.62 234.288C1270.62 230.973 1273.32 228.276 1276.64 228.276C1279.95 228.276 1282.65 230.973 1282.65 234.288C1282.65 237.603 1279.95 240.3 1276.64 240.3Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_114',
        data: 'M1276.64 302.663C1273.32 302.663 1270.62 299.966 1270.62 296.651C1270.62 293.336 1273.32 290.639 1276.64 290.639C1279.95 290.639 1282.65 293.336 1282.65 296.651C1282.65 299.966 1279.95 302.663 1276.64 302.663Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_116',
        data: 'M1345.93 306.128C1342.61 306.128 1339.92 303.431 1339.92 300.116C1339.92 296.8 1342.61 294.103 1345.93 294.103C1349.24 294.103 1351.94 296.8 1351.94 300.116C1351.94 303.431 1349.24 306.128 1345.93 306.128Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_118',
        data: 'M1349.39 472.426C1346.08 472.426 1343.38 469.729 1343.38 466.414C1343.38 463.098 1346.08 460.401 1349.39 460.401C1352.71 460.401 1355.4 463.098 1355.4 466.414C1355.4 469.729 1352.71 472.426 1349.39 472.426Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_120',
        data: 'M1543.34 403.135C1540.03 403.135 1537.33 400.438 1537.33 397.123C1537.33 393.807 1540.03 391.111 1543.34 391.111C1546.66 391.111 1549.35 393.807 1549.35 397.123C1549.35 400.438 1546.66 403.135 1543.34 403.135Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_122',
        data: 'M1519.15 302.663C1515.84 302.663 1513.14 299.966 1513.14 296.651C1513.14 293.336 1515.84 290.639 1519.15 290.639C1522.47 290.639 1525.17 293.336 1525.17 296.651C1525.17 299.966 1522.47 302.663 1519.15 302.663Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_124',
        data: 'M1307.82 514.001C1304.5 514.001 1301.81 511.304 1301.81 507.989C1301.81 504.673 1304.5 501.976 1307.82 501.976C1311.13 501.976 1313.83 504.673 1313.83 507.989C1313.83 511.304 1311.13 514.001 1307.82 514.001Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_126',
        data: 'M1276.64 690.693C1273.32 690.693 1270.62 687.996 1270.62 684.681C1270.62 681.366 1273.32 678.669 1276.64 678.669C1279.95 678.669 1282.65 681.366 1282.65 684.681C1282.65 687.996 1279.95 690.693 1276.64 690.693Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_128',
        data: 'M1422.15 621.402C1418.83 621.402 1416.14 618.705 1416.14 615.39C1416.14 612.074 1418.83 609.377 1422.15 609.377C1425.46 609.377 1428.16 612.074 1428.16 615.39C1428.16 618.705 1425.46 621.402 1422.15 621.402Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_130',
        data: 'M1248.92 514.001C1245.6 514.001 1242.91 511.304 1242.91 507.989C1242.91 504.673 1245.6 501.976 1248.92 501.976C1252.23 501.976 1254.93 504.673 1254.93 507.989C1254.93 511.304 1252.23 514.001 1248.92 514.001Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_132',
        data: 'M1349.39 624.867C1346.08 624.867 1343.38 622.17 1343.38 618.855C1343.38 615.539 1346.08 612.842 1349.39 612.842C1352.71 612.842 1355.4 615.539 1355.4 618.855C1355.4 622.17 1352.71 624.867 1349.39 624.867Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_134',
        data: 'M1349.39 801.559C1346.08 801.559 1343.38 798.862 1343.38 795.547C1343.38 792.231 1346.08 789.534 1349.39 789.534C1352.71 789.534 1355.4 792.231 1355.4 795.547C1355.4 798.862 1352.71 801.559 1349.39 801.559Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_136',
        data: 'M1349.39 746.126C1346.08 746.126 1343.38 743.429 1343.38 740.114C1343.38 736.798 1346.08 734.102 1349.39 734.102C1352.71 734.102 1355.4 736.798 1355.4 740.114C1355.4 743.429 1352.71 746.126 1349.39 746.126Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_138',
        data: 'M1276.64 794.631C1273.32 794.631 1270.62 791.934 1270.62 788.619C1270.62 785.303 1273.32 782.606 1276.64 782.606C1279.95 782.606 1282.65 785.303 1282.65 788.619C1282.65 791.934 1279.95 794.631 1276.64 794.631Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_142',
        data: 'M1224.67 954C1221.35 954 1218.66 951.303 1218.66 947.988C1218.66 944.672 1221.35 941.976 1224.67 941.976C1227.98 941.976 1230.68 944.672 1230.68 947.988C1230.68 951.303 1227.98 954 1224.67 954Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_144',
        data: 'M1131.12 954C1127.81 954 1125.11 951.303 1125.11 947.988C1125.11 944.673 1127.81 941.976 1131.12 941.976C1134.44 941.976 1137.14 944.673 1137.14 947.988C1137.14 951.303 1134.44 954 1131.12 954Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_146',
        data: 'M1103.41 863.922C1100.09 863.922 1097.4 861.225 1097.4 857.91C1097.4 854.594 1100.09 851.898 1103.41 851.898C1106.72 851.898 1109.42 854.594 1109.42 857.91C1109.42 861.225 1106.72 863.922 1103.41 863.922Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_148',
        data: 'M885.141 1005.97C881.826 1005.97 879.129 1003.27 879.129 999.957C879.129 996.641 881.826 993.944 885.141 993.944C888.456 993.944 891.153 996.641 891.153 999.957C891.153 1003.27 888.456 1005.97 885.141 1005.97Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_150',
        data: 'M1224.67 794.63C1221.35 794.63 1218.66 791.933 1218.66 788.618C1218.66 785.302 1221.35 782.606 1224.67 782.606C1227.98 782.606 1230.68 785.302 1230.68 788.618C1230.68 791.933 1227.98 794.63 1224.67 794.63Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_152',
        data: 'M926.715 967.858C923.4 967.858 920.703 965.161 920.703 961.846C920.703 958.53 923.4 955.833 926.715 955.833C930.03 955.833 932.727 958.53 932.727 961.846C932.727 965.161 930.03 967.858 926.715 967.858Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_154',
        data: 'M1034.12 694.158C1030.8 694.158 1028.1 691.461 1028.1 688.146C1028.1 684.83 1030.8 682.133 1034.12 682.133C1037.43 682.133 1040.13 684.83 1040.13 688.146C1040.13 691.461 1037.43 694.158 1034.12 694.158Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_156',
        data: 'M1169.23 690.694C1165.92 690.694 1163.22 687.997 1163.22 684.682C1163.22 681.366 1165.92 678.67 1169.23 678.67C1172.55 678.67 1175.25 681.366 1175.25 684.682C1175.25 687.997 1172.55 690.694 1169.23 690.694Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_158',
        data: 'M1096.48 514C1093.16 514 1090.47 511.303 1090.47 507.988C1090.47 504.673 1093.16 501.976 1096.48 501.976C1099.79 501.976 1102.49 504.673 1102.49 507.988C1102.49 511.303 1099.79 514 1096.48 514Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_160',
        data: 'M583.724 479.355C580.409 479.355 577.712 476.658 577.712 473.343C577.712 470.028 580.409 467.331 583.724 467.331C587.039 467.331 589.736 470.028 589.736 473.343C589.736 476.658 587.039 479.355 583.724 479.355Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_162',
        data: 'M1103.41 791.166C1100.09 791.166 1097.4 788.469 1097.4 785.154C1097.4 781.839 1100.09 779.142 1103.41 779.142C1106.72 779.142 1109.42 781.839 1109.42 785.154C1109.42 788.469 1106.72 791.166 1103.41 791.166Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_164',
        data: 'M1169.23 739.197C1165.92 739.197 1163.22 736.5 1163.22 733.185C1163.22 729.869 1165.92 727.172 1169.23 727.172C1172.55 727.172 1175.25 729.869 1175.25 733.185C1175.25 736.5 1172.55 739.197 1169.23 739.197Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_166',
        data: 'M874.747 586.757C871.432 586.757 868.735 584.06 868.735 580.745C868.735 577.43 871.432 574.733 874.747 574.733C878.062 574.733 880.759 577.43 880.759 580.745C880.759 584.06 878.062 586.757 874.747 586.757Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_168',
        data: 'M947.503 586.757C944.188 586.757 941.491 584.06 941.491 580.745C941.491 577.429 944.188 574.732 947.503 574.732C950.818 574.732 953.515 577.429 953.515 580.745C953.515 584.06 950.818 586.757 947.503 586.757Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_170',
        data: 'M978.684 638.725C975.369 638.725 972.672 636.028 972.672 632.713C972.672 629.397 975.369 626.701 978.684 626.701C981.999 626.701 984.696 629.397 984.696 632.713C984.696 636.028 981.999 638.725 978.684 638.725Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_172',
        data: 'M874.747 475.891C871.432 475.891 868.735 473.194 868.735 469.879C868.735 466.563 871.432 463.867 874.747 463.867C878.062 463.867 880.759 466.563 880.759 469.879C880.759 473.194 878.062 475.891 874.747 475.891Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_174',
        data: 'M770.81 479.355C767.495 479.355 764.798 476.658 764.798 473.343C764.798 470.028 767.495 467.331 770.81 467.331C774.125 467.331 776.822 470.028 776.822 473.343C776.822 476.658 774.125 479.355 770.81 479.355Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_176',
        data: 'M687.66 385.812C684.345 385.812 681.648 383.115 681.648 379.8C681.648 376.485 684.345 373.788 687.66 373.788C690.975 373.788 693.672 376.485 693.672 379.8C693.672 383.115 690.975 385.812 687.66 385.812Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_178',
        data: 'M635.692 534.788C632.377 534.788 629.68 532.091 629.68 528.776C629.68 525.46 632.377 522.764 635.692 522.764C639.007 522.764 641.704 525.46 641.704 528.776C641.704 532.091 639.007 534.788 635.692 534.788Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_180',
        data: 'M736.164 697.622C732.849 697.622 730.152 694.925 730.152 691.61C730.152 688.294 732.849 685.598 736.164 685.598C739.479 685.598 742.176 688.294 742.176 691.61C742.176 694.925 739.479 697.622 736.164 697.622Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_182',
        data: 'M327.346 850.063C324.031 850.063 321.334 847.366 321.334 844.051C321.334 840.735 324.031 838.038 327.346 838.038C330.661 838.038 333.358 840.735 333.358 844.051C333.358 847.366 330.661 850.063 327.346 850.063Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_184',
        data: 'M583.724 586.757C580.409 586.757 577.712 584.06 577.712 580.745C577.712 577.43 580.409 574.733 583.724 574.733C587.039 574.733 589.736 577.43 589.736 580.745C589.736 584.06 587.039 586.757 583.724 586.757Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_186',
        data: 'M791.597 382.347C788.282 382.347 785.585 379.65 785.585 376.335C785.585 373.019 788.282 370.322 791.597 370.322C794.912 370.322 797.609 373.019 797.609 376.335C797.609 379.65 794.912 382.347 791.597 382.347Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_188',
        data: 'M895.534 309.592C892.219 309.592 889.522 306.895 889.522 303.58C889.522 300.264 892.219 297.568 895.534 297.568C898.849 297.568 901.546 300.264 901.546 303.58C901.546 306.895 898.849 309.592 895.534 309.592Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_190',
        data: 'M1498.37 358.096C1495.05 358.096 1492.36 355.399 1492.36 352.084C1492.36 348.768 1495.05 346.072 1498.37 346.072C1501.68 346.072 1504.38 348.768 1504.38 352.084C1504.38 355.399 1501.68 358.096 1498.37 358.096Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_192',
        data: 'M964.825 184.867C961.51 184.867 958.813 182.17 958.813 178.855C958.813 175.54 961.51 172.843 964.825 172.843C968.14 172.843 970.837 175.54 970.837 178.855C970.837 182.17 968.14 184.867 964.825 184.867Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_194',
        data: 'M826.243 240.301C822.928 240.301 820.231 237.604 820.231 234.289C820.231 230.973 822.928 228.276 826.243 228.276C829.558 228.276 832.255 230.973 832.255 234.289C832.255 237.604 829.558 240.301 826.243 240.301Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_196',
        data: 'M687.66 184.867C684.345 184.867 681.648 182.17 681.648 178.855C681.648 175.54 684.345 172.843 687.66 172.843C690.975 172.843 693.672 175.54 693.672 178.855C693.672 182.17 690.975 184.867 687.66 184.867Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_198',
        data: 'M687.66 250.694C684.345 250.694 681.648 247.997 681.648 244.682C681.648 241.366 684.345 238.669 687.66 238.669C690.975 238.669 693.672 241.366 693.672 244.682C693.672 247.997 690.975 250.694 687.66 250.694Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_200',
        data: 'M583.724 281.875C580.409 281.875 577.712 279.178 577.712 275.863C577.712 272.547 580.409 269.85 583.724 269.85C587.039 269.85 589.736 272.547 589.736 275.863C589.736 279.178 587.039 281.875 583.724 281.875Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_202',
        data: 'M583.724 205.655C580.409 205.655 577.712 202.958 577.712 199.643C577.712 196.328 580.409 193.631 583.724 193.631C587.039 193.631 589.736 196.328 589.736 199.643C589.736 202.958 587.039 205.655 583.724 205.655Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_204',
        data: 'M549.078 171.009C545.763 171.009 543.066 168.312 543.066 164.997C543.066 161.681 545.763 158.984 549.078 158.984C552.393 158.984 555.09 161.681 555.09 164.997C555.09 168.312 552.393 171.009 549.078 171.009Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_206',
        data: 'M687.66 316.521C684.345 316.521 681.648 313.824 681.648 310.509C681.648 307.193 684.345 304.496 687.66 304.496C690.975 304.496 693.672 307.193 693.672 310.509C693.672 313.824 690.975 316.521 687.66 316.521Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_208',
        data: 'M635.692 333.843C632.377 333.843 629.68 331.146 629.68 327.831C629.68 324.516 632.377 321.819 635.692 321.819C639.007 321.819 641.704 324.516 641.704 327.831C641.704 331.146 639.007 333.843 635.692 333.843Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_210',
        data: 'M964.825 309.592C961.51 309.592 958.813 306.895 958.813 303.58C958.813 300.264 961.51 297.568 964.825 297.568C968.14 297.568 970.837 300.264 970.837 303.58C970.837 306.895 968.14 309.592 964.825 309.592Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_212',
        data: 'M1034.12 375.418C1030.8 375.418 1028.1 372.721 1028.1 369.406C1028.1 366.091 1030.8 363.394 1034.12 363.394C1037.43 363.394 1040.13 366.091 1040.13 369.406C1040.13 372.721 1037.43 375.418 1034.12 375.418Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_214',
        data: 'M1172.7 302.663C1169.38 302.663 1166.69 299.966 1166.69 296.651C1166.69 293.335 1169.38 290.639 1172.7 290.639C1176.01 290.639 1178.71 293.335 1178.71 296.651C1178.71 299.966 1176.01 302.663 1172.7 302.663Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_216',
        data: 'M1207.34 371.954C1204.03 371.954 1201.33 369.257 1201.33 365.942C1201.33 362.626 1204.03 359.929 1207.34 359.929C1210.66 359.929 1213.36 362.626 1213.36 365.942C1213.36 369.257 1210.66 371.954 1207.34 371.954Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_218',
        data: 'M1151.91 423.923C1148.6 423.923 1145.9 421.226 1145.9 417.911C1145.9 414.595 1148.6 411.899 1151.91 411.899C1155.23 411.899 1157.92 414.595 1157.92 417.911C1157.92 421.226 1155.23 423.923 1151.91 423.923Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_220',
        data: 'M583.724 742.662C580.409 742.662 577.712 739.965 577.712 736.65C577.712 733.335 580.409 730.638 583.724 730.638C587.039 730.638 589.736 733.335 589.736 736.65C589.736 739.965 587.039 742.662 583.724 742.662Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_222',
        data: 'M770.81 746.126C767.495 746.126 764.798 743.429 764.798 740.114C764.798 736.798 767.495 734.102 770.81 734.102C774.125 734.102 776.822 736.798 776.822 740.114C776.822 743.429 774.125 746.126 770.81 746.126Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_224',
        data: 'M1103.41 281.875C1100.09 281.875 1097.4 279.178 1097.4 275.863C1097.4 272.548 1100.09 269.851 1103.41 269.851C1106.72 269.851 1109.42 272.548 1109.42 275.863C1109.42 279.178 1106.72 281.875 1103.41 281.875Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_226',
        data: 'M1103.41 205.655C1100.09 205.655 1097.4 202.958 1097.4 199.643C1097.4 196.327 1100.09 193.63 1103.41 193.63C1106.72 193.63 1109.42 196.327 1109.42 199.643C1109.42 202.958 1106.72 205.655 1103.41 205.655Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_228',
        data: 'M1051.44 472.426C1048.12 472.426 1045.43 469.729 1045.43 466.414C1045.43 463.098 1048.12 460.401 1051.44 460.401C1054.75 460.401 1057.45 463.098 1057.45 466.414C1057.45 469.729 1054.75 472.426 1051.44 472.426Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_230',
        data: 'M961.36 475.891C958.045 475.891 955.348 473.194 955.348 469.879C955.348 466.563 958.045 463.867 961.36 463.867C964.675 463.867 967.372 466.563 967.372 469.879C967.372 473.194 964.675 475.891 961.36 475.891Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_232',
        data: 'M1072.23 895.102C1068.91 895.102 1066.21 892.405 1066.21 889.09C1066.21 885.775 1068.91 883.078 1072.23 883.078C1075.54 883.078 1078.24 885.775 1078.24 889.09C1078.24 892.405 1075.54 895.102 1072.23 895.102Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_234',
        data: 'M756.952 898.567C753.637 898.567 750.94 895.87 750.94 892.555C750.94 889.239 753.637 886.542 756.952 886.542C760.267 886.542 762.964 889.239 762.964 892.555C762.964 895.87 760.267 898.567 756.952 898.567Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_236',
        data: 'M1519.15 759.985C1515.84 759.985 1513.14 757.288 1513.14 753.973C1513.14 750.657 1515.84 747.961 1519.15 747.961C1522.47 747.961 1525.17 750.657 1525.17 753.973C1525.17 757.288 1522.47 759.985 1519.15 759.985Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_238',
        data: 'M999.471 895.102C996.156 895.102 993.459 892.405 993.459 889.09C993.459 885.775 996.156 883.078 999.471 883.078C1002.79 883.078 1005.48 885.775 1005.48 889.09C1005.48 892.405 1002.79 895.102 999.471 895.102Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_240',
        data: 'M847.03 1044.08C843.715 1044.08 841.018 1041.38 841.018 1038.07C841.018 1034.75 843.715 1032.05 847.03 1032.05C850.345 1032.05 853.042 1034.75 853.042 1038.07C853.042 1041.38 850.345 1044.08 847.03 1044.08Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_242',
        data: 'M982.148 1019.83C978.833 1019.83 976.136 1017.13 976.136 1013.82C976.136 1010.5 978.833 1007.8 982.148 1007.8C985.463 1007.8 988.16 1010.5 988.16 1013.82C988.16 1017.13 985.463 1019.83 982.148 1019.83Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_244',
        data: 'M930.18 843.135C926.865 843.135 924.168 840.438 924.168 837.123C924.168 833.807 926.865 831.11 930.18 831.11C933.495 831.11 936.192 833.807 936.192 837.123C936.192 840.438 933.495 843.135 930.18 843.135Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_246',
        data: 'M687.66 1037.15C684.345 1037.15 681.648 1034.45 681.648 1031.14C681.648 1027.82 684.345 1025.12 687.66 1025.12C690.975 1025.12 693.672 1027.82 693.672 1031.14C693.672 1034.45 690.975 1037.15 687.66 1037.15Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_248',
        data: 'M185.299 1019.83C181.984 1019.83 179.287 1017.13 179.287 1013.82C179.287 1010.5 181.984 1007.8 185.299 1007.8C188.614 1007.8 191.311 1010.5 191.311 1013.82C191.311 1017.13 188.614 1019.83 185.299 1019.83Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_250',
        data: 'M185.299 787.702C181.984 787.702 179.287 785.005 179.287 781.69C179.287 778.374 181.984 775.678 185.299 775.678C188.614 775.678 191.311 778.374 191.311 781.69C191.311 785.005 188.614 787.702 185.299 787.702Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_252',
        data: 'M653.015 933.213C649.7 933.213 647.003 930.516 647.003 927.201C647.003 923.885 649.7 921.188 653.015 921.188C656.33 921.188 659.027 923.885 659.027 927.201C659.027 930.516 656.33 933.213 653.015 933.213Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_254',
        data: 'M687.66 967.858C684.345 967.858 681.648 965.161 681.648 961.846C681.648 958.531 684.345 955.834 687.66 955.834C690.975 955.834 693.672 958.531 693.672 961.846C693.672 965.161 690.975 967.858 687.66 967.858Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_256',
        data: 'M410.495 967.858C407.18 967.858 404.483 965.161 404.483 961.846C404.483 958.531 407.18 955.834 410.495 955.834C413.81 955.834 416.507 958.531 416.507 961.846C416.507 965.161 413.81 967.858 410.495 967.858Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_258',
        data: 'M479.787 898.567C476.472 898.567 473.775 895.87 473.775 892.555C473.775 889.239 476.472 886.542 479.787 886.542C483.102 886.542 485.799 889.239 485.799 892.555C485.799 895.87 483.102 898.567 479.787 898.567Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_260',
        data: 'M341.204 1037.15C337.889 1037.15 335.192 1034.45 335.192 1031.14C335.192 1027.82 337.889 1025.13 341.204 1025.13C344.519 1025.13 347.216 1027.82 347.216 1031.14C347.216 1034.45 344.519 1037.15 341.204 1037.15Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_262',
        data: 'M237.267 967.858C233.952 967.858 231.255 965.161 231.255 961.846C231.255 958.53 233.952 955.833 237.267 955.833C240.582 955.833 243.279 958.53 243.279 961.846C243.279 965.161 240.582 967.858 237.267 967.858Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_264',
        data: 'M237.267 915.89C233.952 915.89 231.255 913.193 231.255 909.878C231.255 906.562 233.952 903.865 237.267 903.865C240.582 903.865 243.279 906.562 243.279 909.878C243.279 913.193 240.582 915.89 237.267 915.89Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_266',
        data: 'M237.267 850.064C233.952 850.064 231.255 847.367 231.255 844.052C231.255 840.736 233.952 838.039 237.267 838.039C240.582 838.039 243.279 840.736 243.279 844.052C243.279 847.367 240.582 850.064 237.267 850.064Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_268',
        data: 'M237.267 787.702C233.952 787.702 231.255 785.005 231.255 781.69C231.255 778.374 233.952 775.677 237.267 775.677C240.582 775.677 243.279 778.374 243.279 781.69C243.279 785.005 240.582 787.702 237.267 787.702Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_270',
        data: 'M306.558 718.41C303.243 718.41 300.546 715.713 300.546 712.398C300.546 709.083 303.243 706.386 306.558 706.386C309.873 706.386 312.57 709.083 312.57 712.398C312.57 715.713 309.873 718.41 306.558 718.41Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_272',
        data: 'M306.558 621.402C303.243 621.402 300.546 618.705 300.546 615.39C300.546 612.074 303.243 609.377 306.558 609.377C309.873 609.377 312.57 612.074 312.57 615.39C312.57 618.705 309.873 621.402 306.558 621.402Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_274',
        data: 'M379.314 552.111C375.999 552.111 373.302 549.414 373.302 546.099C373.302 542.784 375.999 540.087 379.314 540.087C382.629 540.087 385.326 542.784 385.326 546.099C385.326 549.414 382.629 552.111 379.314 552.111Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_276',
        data: 'M382.779 621.402C379.464 621.402 376.767 618.705 376.767 615.39C376.767 612.074 379.464 609.377 382.779 609.377C386.094 609.377 388.791 612.074 388.791 615.39C388.791 618.705 386.094 621.402 382.779 621.402Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_278',
        data: 'M756.951 586.757C753.636 586.757 750.939 584.06 750.939 580.745C750.939 577.43 753.636 574.733 756.951 574.733C760.266 574.733 762.963 577.43 762.963 580.745C762.963 584.06 760.266 586.757 756.951 586.757Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_280',
        data: 'M483.251 586.757C479.936 586.757 477.239 584.06 477.239 580.745C477.239 577.429 479.936 574.733 483.251 574.733C486.566 574.733 489.263 577.429 489.263 580.745C489.263 584.06 486.566 586.757 483.251 586.757Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_282',
        data: 'M483.252 694.158C479.937 694.158 477.24 691.461 477.24 688.146C477.24 684.83 479.937 682.133 483.252 682.133C486.567 682.133 489.264 684.83 489.264 688.146C489.264 691.461 486.567 694.158 483.252 694.158Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_284',
        data: 'M583.724 694.158C580.409 694.158 577.712 691.461 577.712 688.146C577.712 684.83 580.409 682.133 583.724 682.133C587.039 682.133 589.736 684.83 589.736 688.146C589.736 691.461 587.039 694.158 583.724 694.158Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_286',
        data: 'M653.015 694.158C649.7 694.158 647.003 691.461 647.003 688.146C647.003 684.83 649.7 682.133 653.015 682.133C656.33 682.133 659.027 684.83 659.027 688.146C659.027 691.461 656.33 694.158 653.015 694.158Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_288',
        data: 'M653.015 798.094C649.7 798.094 647.003 795.397 647.003 792.082C647.003 788.767 649.7 786.07 653.015 786.07C656.33 786.07 659.027 788.767 659.027 792.082C659.027 795.397 656.33 798.094 653.015 798.094Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_290',
        data: 'M666.873 850.063C663.558 850.063 660.861 847.366 660.861 844.051C660.861 840.736 663.558 838.039 666.873 838.039C670.188 838.039 672.885 840.736 672.885 844.051C672.885 847.366 670.188 850.063 666.873 850.063Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_292',
        data: 'M826.243 694.158C822.928 694.158 820.231 691.461 820.231 688.146C820.231 684.83 822.928 682.133 826.243 682.133C829.558 682.133 832.255 684.83 832.255 688.146C832.255 691.461 829.558 694.158 826.243 694.158Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_294',
        data: 'M382.779 694.158C379.464 694.158 376.767 691.461 376.767 688.146C376.767 684.831 379.464 682.134 382.779 682.134C386.094 682.134 388.791 684.831 388.791 688.146C388.791 691.461 386.094 694.158 382.779 694.158Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_296',
        data: 'M306.558 479.355C303.243 479.355 300.546 476.658 300.546 473.343C300.546 470.027 303.243 467.33 306.558 467.33C309.873 467.33 312.57 470.027 312.57 473.343C312.57 476.658 309.873 479.355 306.558 479.355Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_298',
        data: 'M219.944 475.891C216.629 475.891 213.932 473.194 213.932 469.879C213.932 466.563 216.629 463.867 219.944 463.867C223.259 463.867 225.956 466.563 225.956 469.879C225.956 473.194 223.259 475.891 219.944 475.891Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_300',
        data: 'M237.267 552.111C233.952 552.111 231.255 549.414 231.255 546.099C231.255 542.784 233.952 540.087 237.267 540.087C240.582 540.087 243.279 542.784 243.279 546.099C243.279 549.414 240.582 552.111 237.267 552.111Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_302',
        data: 'M544.078 967.858C540.763 967.858 538.066 965.161 538.066 961.846C538.066 958.531 540.763 955.834 544.078 955.834C547.393 955.834 550.09 958.531 550.09 961.846C550.09 965.161 547.393 967.858 544.078 967.858Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_304',
        data: 'M492.11 1019.83C488.795 1019.83 486.098 1017.13 486.098 1013.81C486.098 1010.5 488.795 1007.8 492.11 1007.8C495.425 1007.8 498.122 1010.5 498.122 1013.81C498.122 1017.13 495.425 1019.83 492.11 1019.83Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_306',
        data: 'M1345.93 954C1342.61 954 1339.92 951.303 1339.92 947.988C1339.92 944.673 1342.61 941.976 1345.93 941.976C1349.24 941.976 1351.94 944.673 1351.94 947.988C1351.94 951.303 1349.24 954 1345.93 954Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_308',
        data: 'M1276.64 1071.8C1273.32 1071.8 1270.62 1069.1 1270.62 1065.78C1270.62 1062.47 1273.32 1059.77 1276.64 1059.77C1279.95 1059.77 1282.65 1062.47 1282.65 1065.78C1282.65 1069.1 1279.95 1071.8 1276.64 1071.8Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_310',
        data: 'M1006.4 427.387C1003.09 427.387 1000.39 424.69 1000.39 421.375C1000.39 418.059 1003.09 415.363 1006.4 415.363C1009.72 415.363 1012.41 418.059 1012.41 421.375C1012.41 424.69 1009.72 427.387 1006.4 427.387Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_312',
        data: 'M1138.05 468.962C1134.74 468.962 1132.04 466.265 1132.04 462.95C1132.04 459.634 1134.74 456.937 1138.05 456.937C1141.37 456.937 1144.07 459.634 1144.07 462.95C1144.07 466.265 1141.37 468.962 1138.05 468.962Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_314',
        data: 'M1311.28 1037.15C1307.97 1037.15 1305.27 1034.45 1305.27 1031.14C1305.27 1027.82 1307.97 1025.12 1311.28 1025.12C1314.6 1025.12 1317.29 1027.82 1317.29 1031.14C1317.29 1034.45 1314.6 1037.15 1311.28 1037.15Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_316',
        data: 'M1415.22 863.921C1411.9 863.921 1409.21 861.224 1409.21 857.909C1409.21 854.593 1411.9 851.897 1415.22 851.897C1418.53 851.897 1421.23 854.593 1421.23 857.909C1421.23 861.224 1418.53 863.921 1415.22 863.921Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_318',
        data: 'M1415.22 954C1411.9 954 1409.21 951.303 1409.21 947.988C1409.21 944.673 1411.9 941.976 1415.22 941.976C1418.53 941.976 1421.23 944.673 1421.23 947.988C1421.23 951.303 1418.53 954 1415.22 954Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_320',
        data: 'M1463.72 1002.5C1460.41 1002.5 1457.71 999.807 1457.71 996.492C1457.71 993.176 1460.41 990.479 1463.72 990.479C1467.04 990.479 1469.73 993.176 1469.73 996.492C1469.73 999.807 1467.04 1002.5 1463.72 1002.5Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_322',
        data: 'M1526.08 1002.5C1522.77 1002.5 1520.07 999.807 1520.07 996.492C1520.07 993.177 1522.77 990.48 1526.08 990.48C1529.4 990.48 1532.1 993.177 1532.1 996.492C1532.1 999.807 1529.4 1002.5 1526.08 1002.5Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_324',
        data: 'M1463.72 1054.47C1460.41 1054.47 1457.71 1051.78 1457.71 1048.46C1457.71 1045.14 1460.41 1042.45 1463.72 1042.45C1467.04 1042.45 1469.73 1045.14 1469.73 1048.46C1469.73 1051.78 1467.04 1054.47 1463.72 1054.47Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_326',
        data: 'M1345.93 863.921C1342.61 863.921 1339.92 861.224 1339.92 857.909C1339.92 854.593 1342.61 851.897 1345.93 851.897C1349.24 851.897 1351.94 854.593 1351.94 857.909C1351.94 861.224 1349.24 863.921 1345.93 863.921Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_328',
        data: 'M1138.05 829.276C1134.74 829.276 1132.04 826.579 1132.04 823.264C1132.04 819.948 1134.74 817.252 1138.05 817.252C1141.37 817.252 1144.07 819.948 1144.07 823.264C1144.07 826.579 1141.37 829.276 1138.05 829.276Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_330',
        data: 'M1467.19 811.951C1463.87 811.951 1461.18 809.254 1461.18 805.939C1461.18 802.623 1463.87 799.927 1467.19 799.927C1470.5 799.927 1473.2 802.623 1473.2 805.939C1473.2 809.254 1470.5 811.951 1467.19 811.951Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_332',
        data: 'M1349.39 371.954C1346.08 371.954 1343.38 369.257 1343.38 365.942C1343.38 362.627 1346.08 359.93 1349.39 359.93C1352.71 359.93 1355.4 362.627 1355.4 365.942C1355.4 369.257 1352.71 371.954 1349.39 371.954Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_334',
        data: 'M1449.86 306.128C1446.55 306.128 1443.85 303.431 1443.85 300.116C1443.85 296.8 1446.55 294.103 1449.86 294.103C1453.18 294.103 1455.88 296.8 1455.88 300.116C1455.88 303.431 1453.18 306.128 1449.86 306.128Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_336',
        data: 'M1345.93 690.694C1342.61 690.694 1339.91 687.997 1339.91 684.681C1339.91 681.366 1342.61 678.669 1345.93 678.669H1352.86C1356.17 678.669 1358.87 681.366 1358.87 684.681C1358.87 687.997 1356.17 690.694 1352.86 690.694H1345.93Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_338',
        data: 'M926.715 898.567C923.4 898.567 920.703 895.87 920.703 892.555V885.625C920.703 882.31 923.4 879.613 926.715 879.613C930.03 879.613 932.727 882.31 932.727 885.625V892.555C932.727 895.87 930.03 898.567 926.715 898.567Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_340',
        data: 'M1169.23 794.63C1165.92 794.63 1163.22 791.933 1163.22 788.618V781.688C1163.22 778.373 1165.92 775.676 1169.23 775.676C1172.55 775.676 1175.25 778.373 1175.25 781.688V788.618C1175.25 791.933 1172.55 794.63 1169.23 794.63Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_342',
        data: 'M1034.12 798.095C1030.8 798.095 1028.1 795.398 1028.1 792.083V785.153C1028.1 781.838 1030.8 779.141 1034.12 779.141C1037.43 779.141 1040.13 781.838 1040.13 785.153V792.083C1040.13 795.398 1037.43 798.095 1034.12 798.095Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_344',
        data: 'M379.314 482.82C375.999 482.82 373.302 480.123 373.302 476.808V469.879C373.302 466.563 375.999 463.866 379.314 463.866C382.629 463.866 385.326 466.563 385.326 469.879V476.808C385.326 480.123 382.629 482.82 379.314 482.82Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_346',
        data: 'M479.786 482.82C476.471 482.82 473.774 480.123 473.774 476.808V469.879C473.774 466.563 476.471 463.866 479.786 463.866C483.102 463.866 485.799 466.563 485.799 469.879V476.808C485.799 480.123 483.102 482.82 479.786 482.82Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_348',
        data: 'M930.18 798.095C926.865 798.095 924.168 795.398 924.168 792.083V785.153C924.168 781.838 926.865 779.141 930.18 779.141C933.495 779.141 936.192 781.838 936.192 785.153V792.083C936.192 795.398 933.495 798.095 930.18 798.095Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_350',
        data: 'M691.124 482.82C687.809 482.82 685.112 480.123 685.112 476.808V469.879C685.112 466.563 687.809 463.866 691.124 463.866C694.439 463.866 697.136 466.563 697.136 469.879V476.808C697.136 480.123 694.439 482.82 691.124 482.82Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_352',
        data: 'M704.983 638.725C701.668 638.725 698.971 636.028 698.971 632.713C698.971 629.397 701.668 626.7 704.983 626.7C708.298 626.7 710.995 629.397 710.995 632.713C710.995 636.028 708.298 638.725 704.983 638.725Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_354',
        data: 'M479.787 413.528C476.472 413.528 473.775 410.831 473.775 407.516C473.775 404.201 476.472 401.504 479.787 401.504C483.102 401.504 485.799 404.201 485.799 407.516C485.799 410.831 483.102 413.528 479.787 413.528Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_356',
        data: 'M479.787 344.237C476.472 344.237 473.775 341.54 473.775 338.225C473.775 334.909 476.472 332.213 479.787 332.213C483.102 332.213 485.799 334.909 485.799 338.225C485.799 341.54 483.102 344.237 479.787 344.237Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_358',
        data: 'M479.787 798.095C476.472 798.095 473.775 795.398 473.775 792.083V785.153C473.775 781.838 476.472 779.141 479.787 779.141C483.102 779.141 485.799 781.838 485.799 785.153V792.083C485.799 795.398 483.102 798.095 479.787 798.095Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_360',
        data: 'M583.723 798.095C580.408 798.095 577.711 795.398 577.711 792.083V785.153C577.711 781.838 580.408 779.141 583.723 779.141C587.038 779.141 589.735 781.838 589.735 785.153V792.083C589.735 795.398 587.038 798.095 583.723 798.095Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_362',
        data: 'M618.369 903.048C615.054 903.048 612.357 900.351 612.357 897.036V890.106C612.357 886.791 615.054 884.094 618.369 884.094C621.684 884.094 624.381 886.791 624.381 890.106V897.036C624.381 900.351 621.684 903.048 618.369 903.048Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_364',
        data: 'M382.779 798.095C379.464 798.095 376.767 795.398 376.767 792.083V785.153C376.767 781.838 379.464 779.141 382.779 779.141C386.094 779.141 388.791 781.838 388.791 785.153V792.083C388.791 795.398 386.094 798.095 382.779 798.095Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_366',
        data: 'M923.25 697.622C919.935 697.622 917.238 694.925 917.238 691.61V684.681C917.238 681.365 919.935 678.668 923.25 678.668C926.565 678.668 929.262 681.365 929.262 684.681V691.61C929.262 694.925 926.565 697.622 923.25 697.622Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_368',
        data: 'M826.243 798.095C822.928 798.095 820.231 795.398 820.231 792.083V785.153C820.231 781.838 822.928 779.141 826.243 779.141C829.558 779.141 832.255 781.838 832.255 785.153V792.083C832.255 795.398 829.558 798.095 826.243 798.095Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_370',
        data: 'M722.305 798.095C718.99 798.095 716.293 795.398 716.293 792.083V785.153C716.293 781.838 718.99 779.141 722.305 779.141C725.621 779.141 728.318 781.838 728.318 785.153V792.083C728.318 795.398 725.621 798.095 722.305 798.095Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_372',
        data: 'M1204.9 474.875C1203.29 474.875 1201.78 474.249 1200.64 473.115C1199.51 471.98 1198.88 470.47 1198.88 468.864C1198.88 467.257 1199.51 465.748 1200.64 464.612L1205.54 459.712C1206.68 458.578 1208.19 457.952 1209.8 457.952C1211.4 457.952 1212.91 458.578 1214.05 459.712C1216.39 462.056 1216.39 465.871 1214.05 468.215L1209.15 473.115C1208.01 474.25 1206.5 474.875 1204.9 474.875Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_374',
        data: 'M1304.35 579.827C1301.04 579.827 1298.34 577.13 1298.34 573.815C1298.34 570.499 1301.04 567.802 1304.35 567.802H1311.28C1314.6 567.802 1317.29 570.499 1317.29 573.815C1317.29 577.13 1314.6 579.827 1311.28 579.827H1304.35Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_376',
        data: 'M1169.23 586.757C1165.92 586.757 1163.22 584.06 1163.22 580.745V573.815C1163.22 570.5 1165.92 567.803 1169.23 567.803C1172.55 567.803 1175.25 570.5 1175.25 573.815V580.745C1175.25 584.06 1172.55 586.757 1169.23 586.757Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_378',
        data: 'M1034.12 588.19C1032.51 588.19 1031 587.565 1029.87 586.43L1024.97 581.53C1023.83 580.396 1023.21 578.885 1023.21 577.279C1023.21 575.672 1023.83 574.163 1024.97 573.027C1026.1 571.893 1027.61 571.267 1029.22 571.267C1030.82 571.267 1032.33 571.893 1033.47 573.027L1038.37 577.927C1039.51 579.062 1040.13 580.572 1040.13 582.179C1040.13 583.785 1039.5 585.295 1038.37 586.43C1037.23 587.565 1035.72 588.19 1034.12 588.19Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_380',
        data: 'M874.746 382.347C871.431 382.347 868.734 379.65 868.734 376.335V369.405C868.734 366.09 871.431 363.393 874.746 363.393C878.061 363.393 880.758 366.09 880.758 369.405V376.335C880.758 379.65 878.061 382.347 874.746 382.347Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_382',
        data: 'M964.825 382.347C961.51 382.347 958.813 379.65 958.813 376.335V369.405C958.813 366.09 961.51 363.393 964.825 363.393C968.14 363.393 970.837 366.09 970.837 369.405V376.335C970.837 379.65 968.14 382.347 964.825 382.347Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_384',
        data: 'M1103.41 378.883C1100.09 378.883 1097.4 376.186 1097.4 372.871V365.941C1097.4 362.626 1100.09 359.929 1103.41 359.929C1106.72 359.929 1109.42 362.626 1109.42 365.941V372.871C1109.42 376.186 1106.72 378.883 1103.41 378.883Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    },
    {
        role: 'Vector_386',
        data: 'M964.825 243.765C961.51 243.765 958.813 241.068 958.813 237.753C958.813 234.438 961.51 231.741 964.825 231.741C968.14 231.741 970.837 234.438 970.837 237.753C970.837 241.068 968.14 243.765 964.825 243.765Z',
        fill: '#fff',
        stroke: '#1A1A18',
        strokeWidth: 2
    }
]

/***/ }),

/***/ "./src/js/data-routes.js":
/*!*******************************!*\
  !*** ./src/js/data-routes.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "data": () => (/* binding */ data)
/* harmony export */ });
let data = [
    {
        role: 'green-dark',
        data: "M1172.7 130.351L1103.41 199.642V365.941H1352.86V466.414L1311.28 507.989V573.815H1169.23L1100.94 505.553L921.815 684.681H826.243L722.306 788.617H382.779L382.779 469.878H133.33",
        stroke: "#005D40",
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'red',
        data: 'M443.706 1062.32L613.469 892.555L723.5 782L1165.77 781.689V684.681H1034.12V580.745H874.746L770.81 476.807L306.559 476.806L167.976 615.389',
        stroke: '#D20328',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'yellow',
        data: 'M133.33 1065.78L237.268 961.845V786.587L306.559 717.296V615.389L375.85 546.098L375.85 469.878L1054.9 469.878L1097 511.5L1165.77 580.744H1172.7V788.618H727.206L618.368 897.455L687.66 966.745V1093.5',
        stroke: '#F39100',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'blue-light',
        data: 'M964.825 137.28V372.87H791.597L691.124 478.241L583.723 585.642V691.609H1034.12V795.547H930.18V961.846L1041.05 1072.71',
        stroke: '#00A7E7',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'grey',
        data: 'M327.346 909.877V844.051L486.716 684.68V580.743H578.823L687.66 471.906V130.352',
        stroke: '#8C9091',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'pink',
        data: 'M847.03 1093.5V1038.07L923.25 961.846L923.25 885.625H1075.69L1172.7 788.618H1276.64L1345.93 857.909H1415.22L1519.22 753.908H1588.45',
        stroke: '#E5007D',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'brown',
        data: 'M271.913 1100.43L479.787 892.554H623.269L690.11 959.396L756.951 892.554H1075.69L1131.12 947.987H1345.93M1346.14 947.987H1410.31L1463.72 1001.4V1093.5',
        stroke: '#954329',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'green-light',
        data: 'M479.786 275.863V781.689H583.723V684.681H653.014L756.952 580.744H874.747L874.747 365.94H1103.41L1172.7 296.65H1588.45',
        stroke: '#A2C613',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'green',
        data: 'M514.432 130.351L583.723 199.642V275.863L687.661 379.799L964.825 379.8L1047.97 462.949H1208.78L1253.83 508L1304.35 507.989V577L1345.93 618.5V996.49L1241.99 1100.43',
        stroke: '#1BA037',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'purple',
        data: 'M1588.45 442.162L1449.86 303.579H1345.93V466.413H1200.42L1106.87 372.871H1034.12L964.826 303.58H895.534L826.243 234.288V164.997',
        stroke: '#831D81',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'blue',
        data: 'M1581.52 164.997H1345.93L1276.64 234.289V296.65L1207.34 365.941V471.313L1352.86 615.389V795.547L1415.22 857.909V944L1469 997.5L1588.45 996.491',
        stroke: '#0063A3',
        strokeWidth: 5,
        strokeMiterlimit: 10
    },
    {
        role: 'green-normal',
        data: 'M1512.23 615.389H1422.15L1352.86 684.682H1276.64L1172.7 580.744H1035.5L923.968 692.328L822.5 795.547H382.5L304.5 710.5L233.5 781.689H133.33',
        stroke: '#6CBE98',
        strokeWidth: 5,
        strokeMiterlimit: 10
    }
];

/***/ }),

/***/ "./src/js/data-stations.js":
/*!*********************************!*\
  !*** ./src/js/data-stations.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "data": () => (/* binding */ data)
/* harmony export */ });
let data = [
    // end-purple
    {
        role: '',
        data: 'M1598.84 442.163C1598.84 447.903 1594.18 452.556 1588.44 452.556C1582.7 452.556 1578.05 447.903 1578.05 442.163C1578.05 436.422 1582.7 431.768 1588.44 431.768C1594.18 431.768 1598.84 436.422 1598.84 442.163Z',
        fill: '#831D81'
    },
    {
        role: '',
        data: 'M1588.25 436.988C1589.03 436.988 1589.66 436.356 1589.66 435.578C1589.66 434.799 1589.03 434.165 1588.25 434.165C1587.46 434.165 1586.83 434.799 1586.83 435.579C1586.83 436.356 1587.46 436.988 1588.25 436.988Z',
        fill: '#ffffff'
    },
    {
        role: '',
        data: 'M1587.85 437.5H1586.23L1583.87 442.846L1584.77 442.647L1586.39 439.777C1586.39 439.777 1586.62 439.777 1586.62 440.36L1586.93 449.246H1587.85V437.5Z',
        fill: '#ffffff'
    },
    {
        role: '',
        data: 'M1589.8 439.764L1591.84 442.73L1592.62 442.98L1589.81 437.499H1588.45V444.721L1589.03 444.62L1590.31 449.22H1590.99L1590.3 444.397L1591.7 444.152L1589.58 440.499C1589.58 439.927 1589.8 439.764 1589.8 439.764Z',
        fill: '#ffffff'
    },
    // end pink
    {
        role: '',
        data: 'M857.424 1100.43C857.424 1106.17 852.772 1110.82 847.033 1110.82C841.292 1110.82 836.636 1106.17 836.636 1100.43C836.636 1094.69 841.292 1090.04 847.033 1090.04C852.772 1090.04 857.424 1094.69 857.424 1100.43Z',
        fill: '#E5007D'
    },
    {
        role: '',
        data: 'M851.242 1098.66H850.363V1097.55H851.242V1098.66ZM851.242 1100.36H850.363V1099.25H851.242V1100.36ZM851.242 1102.07H850.363V1100.95H851.242V1102.07ZM851.242 1103.77H850.363V1102.66H851.242V1103.77ZM851.242 1105.47H850.363V1104.36H851.242V1105.47ZM848.962 1095.26H847.849V1094.14H848.962V1095.26ZM848.962 1096.96H847.849V1095.84H848.962V1096.96ZM848.962 1098.66H847.849V1097.55H848.962V1098.66ZM848.962 1100.36H847.849V1099.25H848.962V1100.36ZM848.962 1102.07H847.849V1100.95H848.962V1102.07ZM848.962 1103.77H847.849V1102.66H848.962V1103.77ZM848.962 1105.47H847.849V1104.36H848.962V1105.47ZM847.24 1095.26H846.124V1094.14H847.24V1095.26ZM847.24 1096.96H846.124V1095.84H847.24V1096.96ZM847.24 1098.66H846.124V1097.55H847.24V1098.66ZM847.24 1100.36H846.124V1099.25H847.24V1100.36ZM847.24 1102.07H846.124V1100.95H847.24V1102.07ZM847.24 1103.77H846.124V1102.66H847.24V1103.77ZM847.24 1105.47H846.124V1104.36H847.24V1105.47ZM849.88 1096.7V1093.19H845.335V1106.33H847.542H851.886V1096.7H849.88Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M842.571 1103.48H843.786V1104.76H842.571V1103.48ZM841.654 1103.5V1106.33H844.569V1099.13L840.282 1103.5H841.654Z',
        fill: '#fff'
    },
    // pink
    {
        role: '',
        data: 'M1598.84 753.97C1598.84 759.712 1594.19 764.365 1588.45 764.365C1582.71 764.365 1578.05 759.712 1578.05 753.97C1578.05 748.232 1582.71 743.579 1588.45 743.579C1594.19 743.579 1598.84 748.232 1598.84 753.97Z',
        fill: '#E5007D'
    },
    {
        role: '',
        data: 'M1592.66 752.207H1591.78V751.091H1592.66V752.207ZM1592.66 753.908H1591.78V752.792H1592.66V753.908ZM1592.66 755.611H1591.78V754.496H1592.66V755.611ZM1592.66 757.312H1591.78V756.2H1592.66V757.312ZM1592.66 759.016H1591.78V757.9H1592.66V759.016ZM1590.38 748.801H1589.26V747.686H1590.38V748.801ZM1590.38 750.503H1589.26V749.387H1590.38V750.503ZM1590.38 752.207H1589.26V751.091H1590.38V752.207ZM1590.38 753.908H1589.26V752.792H1590.38V753.908ZM1590.38 755.611H1589.26V754.496H1590.38V755.611ZM1590.38 757.312H1589.26V756.2H1590.38V757.312ZM1590.38 759.016H1589.26V757.9H1590.38V759.016ZM1588.66 748.801H1587.54V747.686H1588.66V748.801ZM1588.66 750.503H1587.54V749.387H1588.66V750.503ZM1588.66 752.207H1587.54V751.091H1588.66V752.207ZM1588.66 753.908H1587.54V752.792H1588.66V753.908ZM1588.66 755.611H1587.54V754.496H1588.66V755.611ZM1588.66 757.312H1587.54V756.2H1588.66V757.312ZM1588.66 759.016H1587.54V757.9H1588.66V759.016ZM1591.3 750.248V746.733H1586.75V759.878H1588.96H1593.3V750.248H1591.3Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1583.99 757.023H1585.2V758.309H1583.99V757.023ZM1583.07 757.048V759.878H1585.98V752.678L1581.7 757.048H1583.07Z',
        fill: '#fff'
    },
    // 
    {
        role: '',
        data: 'M836.636 164.998C836.636 170.738 831.981 175.391 826.241 175.391C820.501 175.391 815.848 170.738 815.848 164.998C815.848 159.257 820.501 154.603 826.241 154.603C831.981 154.603 836.636 159.257 836.636 164.998Z',
        fill: '#831D81'
    },
    {
        role: '',
        data: 'M826.042 159.823C826.822 159.823 827.455 159.191 827.455 158.412C827.455 157.634 826.822 157 826.042 157C825.261 157 824.63 157.634 824.63 158.414C824.63 159.191 825.261 159.823 826.042 159.823Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M825.649 160.335H824.028L821.669 165.681L822.562 165.483L824.181 162.612C824.181 162.612 824.412 162.612 824.412 163.195L824.726 172.081H825.649V160.335Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M827.599 162.599L829.636 165.565L830.416 165.815L827.604 160.334H826.242V167.556L826.829 167.455L828.103 172.055H828.783L828.094 167.232L829.495 166.987L827.373 163.333C827.373 162.762 827.599 162.599 827.599 162.599Z',
        fill: '#fff'
    },
    // red
    {
        role: '',
        data: 'M178.37 615.39C178.37 621.128 173.716 625.784 167.975 625.784C162.235 625.784 157.582 621.128 157.582 615.39C157.582 609.652 162.235 604.996 167.975 604.996C173.716 604.996 178.37 609.652 178.37 615.39Z',
        fill: '#D20328'
    },
    {
        role: '',
        data: 'M170.812 613.166C170.812 611.599 169.541 610.332 167.978 610.332C166.41 610.332 165.141 611.599 165.141 613.166C165.141 614.207 165.708 615.109 166.544 615.602L165.141 620.761H170.812L169.657 615.439C170.354 614.924 170.812 614.101 170.812 613.166Z',
        fill: '#fff'
    },
    // blue
    {
        role: '',
        data: 'M968.338 131.51H969.636V132.257H968.102L967.748 132.034L967.328 131.052L966.87 132.034L966.529 132.257H965.375L964.983 133.632L964.262 133.606L963.527 130.254L963.2 131.956L962.833 132.257H960.015V131.51H962.519L963.135 128.302L963.868 128.288L964.668 131.994L964.734 131.772L965.088 131.51H966.293L967.001 129.979L967.683 129.991L968.338 131.51Z',
        fill: '#00A7E7'
    },
    {
        role: '',
        data: 'M970.71 131.549C970.422 134.3 968.901 135.701 967.932 136.343C966.961 136.972 965.244 136.304 964.825 136.304C964.051 136.304 963.423 136.763 962.636 136.75C961.837 136.736 960.25 135.964 959.32 133.2C958.402 130.449 959.215 128.418 959.215 128.418C959.215 128.418 959.975 126.454 961.469 125.995C962.833 125.564 963.187 126.625 964.301 126.755C964.287 126.204 964.379 125.759 964.497 125.433C964.497 125.418 964.497 125.406 964.51 125.38C964.537 125.354 964.328 124.79 964.314 124.686C964.301 124.49 964.287 124.254 964.392 124.084C964.589 123.756 964.864 123.468 965.179 123.257C965.545 123.022 965.94 122.852 966.345 122.747C966.634 122.668 967.119 122.472 967.408 122.563C967.433 122.577 967.459 122.59 967.447 122.629C967.211 123.546 967.263 124.542 966.463 125.196C966.135 125.459 965.729 125.59 965.31 125.603C965.035 125.825 964.772 126.179 964.733 126.742C964.995 126.664 965.743 126.414 966.358 126.204C968.85 125.354 970.133 127.737 970.133 127.737C970.133 127.737 970.998 128.786 970.71 131.549ZM964.825 119.958C959.084 119.958 954.431 124.607 954.431 130.344C954.431 136.081 959.084 140.744 964.825 140.744C970.566 140.744 975.219 136.081 975.219 130.344C975.219 124.607 970.566 119.958 964.825 119.958Z',
        fill: '#00A7E7'
    },
    {
        role: '',
        data: 'M969.635 132.257H968.101L967.748 132.035L967.329 131.052L966.869 132.035L966.528 132.257H965.375L964.982 133.632L964.262 133.606L963.526 130.253L963.199 131.955L962.833 132.257H960.015V131.51H962.518L963.134 128.301L963.869 128.287L964.668 131.994L964.733 131.772L965.087 131.51H966.293L967.001 129.978L967.682 129.991L968.337 131.51H969.635V132.257ZM970.132 127.737C970.132 127.737 968.849 125.354 966.358 126.205C965.742 126.415 964.995 126.664 964.733 126.742C964.772 126.179 965.034 125.826 965.31 125.603C965.729 125.59 966.136 125.459 966.463 125.196C967.263 124.542 967.211 123.546 967.446 122.63C967.459 122.59 967.434 122.577 967.407 122.564C967.118 122.472 966.633 122.669 966.346 122.747C965.939 122.852 965.545 123.022 965.179 123.258C964.865 123.468 964.59 123.755 964.392 124.084C964.288 124.254 964.301 124.49 964.313 124.687C964.327 124.791 964.537 125.354 964.51 125.381C964.497 125.407 964.497 125.419 964.497 125.433C964.379 125.76 964.288 126.205 964.301 126.756C963.187 126.625 962.833 125.563 961.469 125.996C959.974 126.454 959.216 128.418 959.216 128.418C959.216 128.418 958.403 130.45 959.319 133.199C960.25 135.964 961.837 136.736 962.635 136.75C963.422 136.763 964.052 136.304 964.824 136.304C965.245 136.304 966.961 136.972 967.931 136.343C968.9 135.701 970.422 134.301 970.709 131.549C970.998 128.786 970.132 127.737 970.132 127.737Z',
        fill: '#fff'
    },
    // brown
    {
        role: '',
        data: 'M1474.12 1100.43C1474.12 1106.16 1469.46 1110.82 1463.72 1110.82C1457.98 1110.82 1453.33 1106.16 1453.33 1100.43C1453.33 1094.69 1457.98 1090.03 1463.72 1090.03C1469.46 1090.03 1474.12 1094.69 1474.12 1100.43Z',
        fill: '#954329'
    },
    {
        role: '',
        data: 'M1459.25 1102.84C1459.02 1102.84 1458.83 1102.65 1458.82 1102.42L1458.82 1102.4C1458.82 1102.16 1459.01 1101.96 1459.25 1101.96C1459.49 1101.96 1459.69 1102.16 1459.69 1102.4C1459.69 1102.43 1459.69 1102.45 1459.68 1102.47C1459.64 1102.68 1459.47 1102.84 1459.25 1102.84ZM1459.25 1101.21C1458.61 1101.21 1458.08 1101.72 1458.07 1102.36C1458.07 1102.37 1458.06 1102.39 1458.06 1102.4C1458.06 1103.05 1458.6 1103.58 1459.25 1103.58C1459.87 1103.58 1460.38 1103.11 1460.43 1102.51C1460.44 1102.47 1460.44 1102.44 1460.44 1102.4C1460.44 1101.74 1459.91 1101.21 1459.25 1101.21Z',
        fill: '#954329'
    },
    {
        role: '',
        data: 'M1459.25 1101.96C1459.01 1101.96 1458.82 1102.16 1458.82 1102.4L1458.82 1102.42C1458.83 1102.65 1459.02 1102.84 1459.25 1102.84C1459.47 1102.84 1459.64 1102.68 1459.68 1102.47C1459.69 1102.45 1459.69 1102.43 1459.69 1102.4C1459.69 1102.16 1459.49 1101.96 1459.25 1101.96Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1459.25 1103.58C1458.6 1103.58 1458.07 1103.05 1458.07 1102.4C1458.07 1102.39 1458.07 1102.37 1458.07 1102.36C1458.08 1101.72 1458.61 1101.21 1459.25 1101.21C1459.91 1101.21 1460.44 1101.74 1460.44 1102.4C1460.44 1102.44 1460.44 1102.47 1460.43 1102.51C1460.38 1103.11 1459.87 1103.58 1459.25 1103.58ZM1459.25 1100.59C1458.28 1100.59 1457.49 1101.35 1457.45 1102.31C1457.45 1102.34 1457.45 1102.37 1457.45 1102.4C1457.45 1103.4 1458.26 1104.21 1459.25 1104.21C1460.2 1104.21 1460.98 1103.46 1461.05 1102.53C1461.06 1102.49 1461.06 1102.44 1461.06 1102.4C1461.06 1101.4 1460.25 1100.59 1459.25 1100.59Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1463.76 1102.23L1463.85 1102.04V1102.04L1463.76 1102.23Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1467.91 1101.37C1467.91 1101.29 1467.92 1101.22 1467.96 1101.15C1468.04 1100.98 1468.21 1100.87 1468.41 1100.87C1468.47 1100.87 1468.52 1100.88 1468.58 1100.9C1468.67 1100.93 1468.75 1100.99 1468.81 1101.07C1468.87 1101.16 1468.91 1101.26 1468.91 1101.37C1468.91 1101.65 1468.69 1101.87 1468.41 1101.87C1468.13 1101.87 1467.91 1101.65 1467.91 1101.37ZM1468.41 1103.7C1467.12 1103.7 1466.08 1102.66 1466.08 1101.37C1466.08 1100.52 1466.54 1099.78 1467.23 1099.37L1467.72 1100.58C1467.5 1100.77 1467.36 1101.05 1467.36 1101.37C1467.36 1101.95 1467.83 1102.42 1468.41 1102.42C1468.99 1102.42 1469.46 1101.95 1469.46 1101.37C1469.46 1100.8 1469 1100.33 1468.44 1100.32C1468.43 1100.32 1468.42 1100.32 1468.41 1100.32C1468.39 1100.32 1468.36 1100.32 1468.34 1100.32L1467.84 1099.12C1468.02 1099.07 1468.21 1099.04 1468.41 1099.04C1469.7 1099.04 1470.74 1100.08 1470.74 1101.37C1470.74 1102.66 1469.7 1103.7 1468.41 1103.7ZM1463.47 1101.25V1096.85H1463.48H1465.55L1463.47 1101.25ZM1462.84 1099.36C1461.31 1099.36 1459.97 1099.35 1458.45 1099.35C1460.39 1097.41 1462.85 1096.91 1462.85 1096.91L1462.84 1099.36ZM1468.41 1098.31C1468.11 1098.31 1467.84 1098.36 1467.57 1098.44L1465.86 1094.29H1463.67L1463.19 1094.96H1465.41L1465.93 1096.23L1463.48 1096.23V1096.23L1463.48 1096.23H1463.46C1458.93 1097.24 1455.73 1100.37 1455.72 1100.4C1455.49 1101.6 1455.7 1102.26 1456.8 1102.25H1456.8C1456.88 1100.97 1457.94 1099.95 1459.24 1099.95C1460.53 1099.95 1461.59 1100.96 1461.68 1102.23H1463.75L1466.24 1096.99L1466.95 1098.7C1466 1099.22 1465.35 1100.21 1465.35 1101.37C1465.35 1103.06 1466.72 1104.43 1468.41 1104.43C1470.1 1104.43 1471.47 1103.06 1471.47 1101.37C1471.47 1099.68 1470.1 1098.31 1468.41 1098.31Z',
        fill: '#fff'
    },
    // 
    {
        role: '',
        data: 'M685.073 1101.01C685.073 1101.8 684.431 1102.44 683.645 1102.44C682.86 1102.44 682.218 1101.8 682.218 1101.01C682.218 1100.38 682.624 1099.86 683.187 1099.66C683.331 1099.61 683.474 1099.58 683.645 1099.58C683.698 1099.58 683.764 1099.6 683.815 1099.6C684.523 1099.69 685.073 1100.29 685.073 1101.01Z',
        fill: '#F39100'
    },
    {
        role: '',
        data: 'M692.775 1103.83C692.775 1104.95 691.858 1105.86 690.731 1105.86C689.658 1105.86 688.78 1105.02 688.715 1103.96C688.701 1103.91 688.701 1103.87 688.701 1103.83C688.701 1103.44 688.806 1103.08 689.003 1102.77C689.226 1102.4 689.54 1102.11 689.947 1101.94C690.181 1101.84 690.456 1101.78 690.731 1101.78H690.758C691.872 1101.8 692.775 1102.7 692.775 1103.83Z',
        fill: '#F39100'
    },
    {
        role: '',
        data: 'M689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04ZM689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04ZM689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04ZM686.829 1096.24C686.829 1096.2 686.829 1096.15 686.842 1096.11L684.498 1095.1C684.353 1095.27 684.157 1095.4 683.935 1095.44V1095.46L683.842 1098.73C684.249 1098.76 684.628 1098.9 684.955 1099.14L687.025 1097.07C686.895 1096.82 686.829 1096.54 686.829 1096.24ZM688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1ZM690.733 1107.09C688.937 1107.09 687.471 1105.62 687.471 1103.83C687.471 1103.76 687.484 1103.71 687.484 1103.66L684.799 1102.99C684.458 1103.2 684.066 1103.32 683.645 1103.32C682.375 1103.32 681.341 1102.28 681.341 1101.01C681.341 1099.88 682.139 1098.95 683.2 1098.75L683.305 1095.43C682.847 1095.3 682.519 1094.88 682.519 1094.37C682.519 1093.75 683.018 1093.26 683.645 1093.26C684.261 1093.26 684.773 1093.75 684.773 1094.37C684.773 1094.42 684.773 1094.47 684.759 1094.51L686.987 1095.48C687.275 1094.83 687.93 1094.37 688.689 1094.37C689.723 1094.37 690.549 1095.21 690.549 1096.24C690.549 1096.78 690.314 1097.28 689.947 1097.6V1097.62L690.523 1100.58C690.589 1100.57 690.667 1100.57 690.733 1100.57C692.54 1100.57 693.995 1102.02 693.995 1103.83C693.995 1105.62 692.54 1107.09 690.733 1107.09ZM687.667 1090.03C681.93 1090.03 677.268 1094.68 677.268 1100.42C677.268 1106.16 681.93 1110.82 687.667 1110.82C693.405 1110.82 698.054 1106.16 698.054 1100.42C698.054 1094.68 693.405 1090.03 687.667 1090.03ZM686.829 1096.24C686.829 1096.2 686.829 1096.15 686.842 1096.11L684.498 1095.1C684.353 1095.27 684.157 1095.4 683.935 1095.44V1095.46L683.842 1098.73C684.249 1098.76 684.628 1098.9 684.955 1099.14L687.025 1097.07C686.895 1096.82 686.829 1096.54 686.829 1096.24ZM689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04ZM689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04ZM686.829 1096.24C686.829 1096.2 686.829 1096.15 686.842 1096.11L684.498 1095.1C684.353 1095.27 684.157 1095.4 683.935 1095.44V1095.46L683.842 1098.73C684.249 1098.76 684.628 1098.9 684.955 1099.14L687.025 1097.07C686.895 1096.82 686.829 1096.54 686.829 1096.24ZM689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04ZM689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04ZM689.161 1098.04C689.003 1098.08 688.846 1098.1 688.689 1098.1C688.27 1098.1 687.878 1097.96 687.562 1097.71L685.546 1099.71C685.807 1100.08 685.951 1100.53 685.951 1101.01C685.951 1101.35 685.873 1101.68 685.729 1101.97L687.773 1102.46C688.153 1101.65 688.846 1101.02 689.698 1100.74L689.161 1098.04Z',
        fill: '#F39100'
    },
    {
        role: '',
        data: 'M690.732 1105.86C689.659 1105.86 688.78 1105.02 688.715 1103.96C688.702 1103.91 688.702 1103.87 688.702 1103.83C688.702 1103.44 688.807 1103.08 689.003 1102.77C689.226 1102.4 689.539 1102.11 689.946 1101.94C690.182 1101.84 690.457 1101.78 690.732 1101.78H690.758C691.872 1101.8 692.776 1102.7 692.776 1103.83C692.776 1104.95 691.859 1105.86 690.732 1105.86ZM687.772 1102.46L685.728 1101.97C685.872 1101.68 685.951 1101.35 685.951 1101.01C685.951 1100.53 685.808 1100.08 685.545 1099.71L687.563 1097.71C687.877 1097.96 688.269 1098.1 688.688 1098.1C688.846 1098.1 689.003 1098.08 689.16 1098.04L689.697 1100.74C688.846 1101.02 688.152 1101.65 687.772 1102.46ZM683.646 1102.44C682.86 1102.44 682.218 1101.8 682.218 1101.01C682.218 1100.38 682.624 1099.86 683.187 1099.66C683.331 1099.61 683.476 1099.58 683.646 1099.58C683.698 1099.58 683.764 1099.6 683.815 1099.6C684.523 1099.69 685.073 1100.29 685.073 1101.01C685.073 1101.8 684.431 1102.44 683.646 1102.44ZM683.934 1095.46V1095.44C684.156 1095.41 684.353 1095.27 684.497 1095.1L686.842 1096.11C686.828 1096.15 686.828 1096.2 686.828 1096.24C686.828 1096.54 686.894 1096.82 687.025 1097.07L684.955 1099.14C684.627 1098.9 684.248 1098.76 683.842 1098.73L683.934 1095.46ZM690.732 1100.57C690.667 1100.57 690.588 1100.57 690.522 1100.58L689.946 1097.62V1097.61C690.313 1097.28 690.549 1096.78 690.549 1096.24C690.549 1095.21 689.724 1094.37 688.688 1094.37C687.929 1094.37 687.274 1094.83 686.986 1095.48L684.759 1094.51C684.772 1094.47 684.772 1094.42 684.772 1094.37C684.772 1093.75 684.262 1093.26 683.646 1093.26C683.017 1093.26 682.519 1093.75 682.519 1094.37C682.519 1094.88 682.846 1095.3 683.305 1095.43L683.199 1098.75C682.139 1098.95 681.34 1099.88 681.34 1101.01C681.34 1102.28 682.376 1103.32 683.646 1103.32C684.065 1103.32 684.457 1103.2 684.799 1102.99L687.483 1103.66C687.483 1103.71 687.471 1103.76 687.471 1103.83C687.471 1105.62 688.938 1107.09 690.732 1107.09C692.54 1107.09 693.994 1105.62 693.994 1103.83C693.994 1102.02 692.54 1100.57 690.732 1100.57Z',
        fill: '#fff'
    },
    // blue
    {
        role: '',
        data: 'M1598.84 996.491C1598.84 1002.23 1594.19 1006.88 1588.45 1006.88C1582.71 1006.88 1578.05 1002.23 1578.05 996.491C1578.05 990.751 1582.71 986.097 1588.45 986.097C1594.19 986.097 1598.84 990.751 1598.84 996.491Z',
        fill: '#0063A3'
    },
    {
        role: '',
        data: 'M1588.86 1001.88C1587.14 1001.88 1585.52 1001.21 1584.31 999.993C1581.88 997.566 1581.81 993.672 1584.07 991.145L1584.62 991.692C1583.72 992.682 1583.18 993.988 1583.18 995.425C1583.18 998.516 1585.69 1001.03 1588.78 1001.03C1590.22 1001.03 1591.52 1000.48 1592.52 999.588L1593.16 1000.23C1591.98 1001.29 1590.46 1001.88 1588.86 1001.88ZM1585.39 991.591C1586.29 990.792 1587.48 990.298 1588.78 990.298C1591.61 990.298 1593.91 992.601 1593.91 995.425C1593.91 996.727 1593.42 997.915 1592.61 998.818C1592.48 998.972 1592.33 999.115 1592.18 999.252C1591.27 1000.06 1590.09 1000.55 1588.78 1000.55C1585.95 1000.55 1583.66 998.252 1583.66 995.425C1583.66 994.12 1584.15 992.932 1584.95 992.026C1585.09 991.872 1585.23 991.729 1585.39 991.591ZM1594.09 999.19C1593.94 999.401 1593.77 999.603 1593.59 999.796L1592.95 999.156C1593.84 998.163 1594.38 996.858 1594.38 995.425C1594.38 992.336 1591.87 989.824 1588.78 989.824C1587.35 989.824 1586.05 990.37 1585.05 991.256L1584.5 990.711C1584.7 990.532 1584.9 990.361 1585.11 990.21L1584.79 989.892C1584.57 990.054 1583.84 990.737 1583.84 990.737C1581.31 993.434 1581.36 997.671 1584 1000.3C1585.23 1001.54 1586.81 1002.2 1588.43 1002.3V1002.87C1586.96 1002.94 1585.74 1003.42 1585.27 1004.09H1592.25C1591.77 1003.42 1590.55 1002.94 1589.09 1002.87V1002.31C1590.7 1002.26 1592.3 1001.64 1593.57 1000.46C1593.57 1000.46 1594.18 999.871 1594.41 999.508L1594.09 999.19Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1586.79 996.612C1586.16 996.644 1585.63 996.16 1585.59 995.534C1585.56 994.908 1586.04 994.372 1586.67 994.336C1587.3 994.303 1587.83 994.787 1587.86 995.415C1587.9 996.041 1587.42 996.578 1586.79 996.612ZM1588.67 995.431C1588.67 995.412 1588.68 995.39 1588.67 995.371C1588.66 995.188 1588.63 995.015 1588.57 994.85L1588.9 994.534C1588.85 994.418 1588.79 994.309 1588.72 994.204L1588.28 994.295C1588.16 994.138 1588.02 994.001 1587.85 993.888L1587.93 993.442C1587.82 993.374 1587.71 993.323 1587.59 993.277L1587.29 993.611C1587.1 993.556 1586.91 993.53 1586.71 993.53L1586.51 993.125C1586.38 993.135 1586.26 993.156 1586.14 993.186L1586.09 993.64C1585.9 993.703 1585.72 993.8 1585.56 993.915L1585.17 993.703C1585.07 993.786 1584.99 993.878 1584.91 993.972L1585.13 994.366C1585.02 994.526 1584.93 994.707 1584.87 994.894L1584.42 994.961C1584.4 995.083 1584.38 995.205 1584.37 995.331L1584.78 995.518V995.578C1584.79 995.759 1584.83 995.932 1584.89 996.096L1584.56 996.414C1584.61 996.529 1584.67 996.64 1584.74 996.745L1585.18 996.652C1585.3 996.809 1585.44 996.947 1585.6 997.063L1585.53 997.509C1585.64 997.573 1585.75 997.626 1585.87 997.67L1586.17 997.337C1586.36 997.391 1586.55 997.42 1586.75 997.417L1586.95 997.823C1587.08 997.812 1587.2 997.794 1587.32 997.763L1587.37 997.311C1587.56 997.244 1587.74 997.151 1587.89 997.036L1588.29 997.244C1588.38 997.163 1588.47 997.07 1588.55 996.975L1588.33 996.581C1588.44 996.419 1588.53 996.242 1588.59 996.052L1589.03 995.986C1589.06 995.868 1589.08 995.745 1589.09 995.617L1588.67 995.431Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1590.72 997.717C1590.26 997.717 1589.88 997.341 1589.88 996.88C1589.88 996.415 1590.26 996.04 1590.72 996.04C1591.19 996.04 1591.57 996.415 1591.57 996.88C1591.57 997.341 1591.19 997.717 1590.72 997.717ZM1592.22 996.924C1592.22 996.91 1592.23 996.894 1592.23 996.88C1592.23 996.738 1592.2 996.602 1592.17 996.474L1592.43 996.243C1592.4 996.153 1592.36 996.066 1592.31 995.983L1591.97 996.034C1591.88 995.908 1591.77 995.797 1591.66 995.703L1591.73 995.361C1591.65 995.306 1591.57 995.262 1591.48 995.221L1591.23 995.467C1591.09 995.417 1590.94 995.386 1590.79 995.38L1590.65 995.059C1590.55 995.062 1590.46 995.073 1590.36 995.093L1590.3 995.438C1590.16 995.48 1590.02 995.544 1589.89 995.629L1589.59 995.451C1589.52 995.511 1589.45 995.577 1589.38 995.648L1589.54 995.958C1589.45 996.079 1589.37 996.211 1589.32 996.358L1588.97 996.39C1588.94 996.48 1588.93 996.573 1588.92 996.67L1589.22 996.833C1589.22 996.848 1589.22 996.861 1589.22 996.88C1589.22 997.018 1589.24 997.154 1589.28 997.282L1589.02 997.513C1589.05 997.603 1589.09 997.69 1589.14 997.774L1589.48 997.722C1589.57 997.848 1589.67 997.959 1589.79 998.053L1589.71 998.398C1589.8 998.45 1589.88 998.496 1589.97 998.537L1590.22 998.29C1590.36 998.342 1590.51 998.37 1590.66 998.377L1590.8 998.698C1590.9 998.692 1590.99 998.684 1591.09 998.664L1591.15 998.318C1591.29 998.278 1591.43 998.212 1591.56 998.131L1591.86 998.306C1591.93 998.246 1592 998.181 1592.07 998.111L1591.91 997.798C1592 997.677 1592.08 997.545 1592.13 997.402L1592.48 997.369C1592.5 997.278 1592.53 997.183 1592.54 997.084L1592.22 996.924Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1590.1 993.74C1589.76 993.74 1589.48 993.463 1589.48 993.115C1589.48 992.772 1589.76 992.492 1590.1 992.492C1590.44 992.492 1590.72 992.772 1590.72 993.115C1590.72 993.463 1590.44 993.74 1590.1 993.74ZM1591.47 993.158C1591.47 993.144 1591.48 993.13 1591.48 993.115C1591.48 992.988 1591.46 992.862 1591.42 992.745L1591.66 992.537C1591.63 992.452 1591.6 992.371 1591.55 992.297L1591.24 992.343C1591.16 992.228 1591.06 992.127 1590.95 992.04L1591.02 991.727C1590.95 991.678 1590.87 991.635 1590.79 991.601L1590.57 991.824C1590.44 991.78 1590.3 991.751 1590.16 991.748L1590.03 991.454C1589.95 991.456 1589.86 991.465 1589.77 991.483L1589.72 991.799C1589.58 991.838 1589.46 991.897 1589.34 991.974L1589.07 991.813C1589 991.865 1588.93 991.925 1588.88 991.99L1589.02 992.277C1588.93 992.385 1588.86 992.507 1588.81 992.639L1588.5 992.667C1588.48 992.751 1588.46 992.838 1588.45 992.927L1588.73 993.075C1588.73 993.086 1588.73 993.101 1588.73 993.115C1588.73 993.245 1588.75 993.368 1588.78 993.486L1588.54 993.696C1588.57 993.779 1588.61 993.86 1588.65 993.933L1588.96 993.888C1589.04 994.003 1589.14 994.105 1589.25 994.191L1589.18 994.504C1589.25 994.553 1589.33 994.594 1589.41 994.631L1589.64 994.406C1589.77 994.453 1589.9 994.479 1590.04 994.486L1590.17 994.779C1590.26 994.774 1590.35 994.765 1590.43 994.748L1590.49 994.433C1590.62 994.395 1590.75 994.336 1590.86 994.259L1591.14 994.423C1591.2 994.366 1591.27 994.306 1591.33 994.24L1591.19 993.956C1591.27 993.846 1591.34 993.723 1591.39 993.595L1591.7 993.563C1591.73 993.482 1591.75 993.395 1591.76 993.306L1591.47 993.158Z',
        fill: '#fff'
    },
    // blue
    {
        role: '',
        data: 'M1598.84 164.996C1598.84 170.737 1594.19 175.39 1588.45 175.39C1582.71 175.39 1578.05 170.737 1578.05 164.996C1578.05 159.256 1582.71 154.603 1588.45 154.603C1594.19 154.603 1598.84 159.256 1598.84 164.996Z',
        fill: '#0063A3'
    },
    {
        role: '',
        data: 'M1588.86 170.385C1587.14 170.385 1585.52 169.715 1584.31 168.499C1581.88 166.071 1581.81 162.177 1584.07 159.65L1584.62 160.197C1583.72 161.187 1583.18 162.494 1583.18 163.931C1583.18 167.021 1585.69 169.534 1588.78 169.534C1590.22 169.534 1591.52 168.984 1592.52 168.093L1593.16 168.733C1591.98 169.797 1590.46 170.385 1588.86 170.385ZM1585.39 160.098C1586.29 159.297 1587.48 158.803 1588.78 158.803C1591.61 158.803 1593.91 161.106 1593.91 163.931C1593.91 165.233 1593.42 166.421 1592.61 167.325C1592.48 167.477 1592.33 167.62 1592.18 167.759C1591.27 168.565 1590.09 169.058 1588.78 169.058C1585.95 169.058 1583.66 166.758 1583.66 163.931C1583.66 162.625 1584.15 161.437 1584.95 160.531C1585.09 160.379 1585.23 160.234 1585.39 160.098ZM1594.09 167.695C1593.94 167.906 1593.77 168.108 1593.59 168.301L1592.95 167.662C1593.84 166.67 1594.38 165.363 1594.38 163.931C1594.38 160.841 1591.87 158.329 1588.78 158.329C1587.35 158.329 1586.05 158.875 1585.05 159.762L1584.5 159.216C1584.7 159.037 1584.9 158.867 1585.11 158.715L1584.79 158.399C1584.57 158.56 1583.84 159.242 1583.84 159.242C1581.31 161.941 1581.36 166.176 1584 168.811C1585.23 170.044 1586.81 170.71 1588.43 170.812V171.377C1586.96 171.445 1585.74 171.929 1585.27 172.595H1592.25C1591.77 171.929 1590.55 171.445 1589.09 171.377V170.82C1590.7 170.768 1592.3 170.149 1593.57 168.962C1593.57 168.962 1594.18 168.377 1594.41 168.013L1594.09 167.695Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1586.79 165.118C1586.16 165.15 1585.63 164.666 1585.59 164.04C1585.56 163.414 1586.04 162.878 1586.67 162.842C1587.3 162.809 1587.83 163.292 1587.86 163.921C1587.9 164.547 1587.42 165.084 1586.79 165.118ZM1588.67 163.937C1588.67 163.917 1588.68 163.896 1588.67 163.877C1588.66 163.694 1588.63 163.521 1588.57 163.356L1588.9 163.04C1588.85 162.924 1588.79 162.815 1588.72 162.71L1588.28 162.801C1588.16 162.644 1588.02 162.507 1587.85 162.394L1587.93 161.946C1587.82 161.88 1587.71 161.829 1587.59 161.783L1587.29 162.117C1587.1 162.062 1586.91 162.035 1586.71 162.035L1586.51 161.631C1586.38 161.641 1586.26 161.662 1586.14 161.692L1586.09 162.144C1585.9 162.209 1585.72 162.304 1585.56 162.419L1585.17 162.209C1585.07 162.292 1584.99 162.383 1584.91 162.478L1585.13 162.872C1585.02 163.032 1584.93 163.211 1584.87 163.4L1584.42 163.467C1584.4 163.588 1584.38 163.711 1584.37 163.836L1584.78 164.024V164.084C1584.79 164.265 1584.83 164.438 1584.89 164.602L1584.56 164.92C1584.61 165.035 1584.67 165.146 1584.74 165.251L1585.18 165.157C1585.3 165.315 1585.44 165.453 1585.6 165.568L1585.53 166.014C1585.64 166.079 1585.75 166.132 1585.87 166.175L1586.17 165.843C1586.36 165.897 1586.55 165.925 1586.75 165.923L1586.95 166.329C1587.08 166.317 1587.2 166.3 1587.32 166.269L1587.37 165.816C1587.56 165.75 1587.74 165.656 1587.89 165.541L1588.29 165.75C1588.38 165.669 1588.47 165.576 1588.55 165.481L1588.33 165.087C1588.44 164.925 1588.53 164.746 1588.59 164.558L1589.03 164.492C1589.06 164.374 1589.08 164.251 1589.09 164.123L1588.67 163.937Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1590.72 166.222C1590.26 166.222 1589.88 165.846 1589.88 165.385C1589.88 164.92 1590.26 164.545 1590.72 164.545C1591.19 164.545 1591.57 164.92 1591.57 165.385C1591.57 165.846 1591.19 166.222 1590.72 166.222ZM1592.22 165.429C1592.22 165.414 1592.23 165.399 1592.23 165.385C1592.23 165.243 1592.2 165.107 1592.17 164.978L1592.43 164.748C1592.4 164.658 1592.36 164.571 1592.31 164.488L1591.97 164.539C1591.88 164.413 1591.77 164.302 1591.66 164.208L1591.73 163.866C1591.65 163.811 1591.57 163.765 1591.48 163.726L1591.23 163.972C1591.09 163.922 1590.94 163.891 1590.79 163.885L1590.65 163.564C1590.55 163.567 1590.46 163.577 1590.36 163.597L1590.3 163.943C1590.16 163.985 1590.02 164.049 1589.89 164.135L1589.59 163.956C1589.52 164.015 1589.45 164.082 1589.38 164.153L1589.54 164.463C1589.45 164.584 1589.37 164.716 1589.32 164.862L1588.97 164.895C1588.94 164.985 1588.93 165.078 1588.92 165.175L1589.22 165.338C1589.22 165.352 1589.22 165.367 1589.22 165.385C1589.22 165.522 1589.24 165.659 1589.28 165.787L1589.02 166.018C1589.05 166.108 1589.09 166.195 1589.14 166.28L1589.48 166.227C1589.57 166.352 1589.67 166.464 1589.79 166.558L1589.71 166.903C1589.8 166.955 1589.88 167.001 1589.97 167.042L1590.22 166.795C1590.36 166.847 1590.51 166.875 1590.66 166.882L1590.8 167.204C1590.9 167.197 1590.99 167.189 1591.09 167.169L1591.15 166.823C1591.29 166.783 1591.43 166.717 1591.56 166.636L1591.86 166.811C1591.93 166.751 1592 166.686 1592.07 166.616L1591.91 166.303C1592 166.18 1592.08 166.049 1592.13 165.906L1592.48 165.874C1592.5 165.783 1592.53 165.688 1592.54 165.589L1592.22 165.429Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1590.1 162.246C1589.76 162.246 1589.48 161.969 1589.48 161.621C1589.48 161.278 1589.76 160.998 1590.1 160.998C1590.44 160.998 1590.72 161.278 1590.72 161.621C1590.72 161.969 1590.44 162.246 1590.1 162.246ZM1591.47 161.664C1591.47 161.65 1591.48 161.636 1591.48 161.621C1591.48 161.494 1591.46 161.369 1591.42 161.251L1591.66 161.043C1591.63 160.958 1591.6 160.877 1591.55 160.803L1591.24 160.849C1591.16 160.734 1591.06 160.633 1590.95 160.546L1591.02 160.233C1590.95 160.184 1590.87 160.141 1590.79 160.107L1590.57 160.33C1590.44 160.286 1590.3 160.257 1590.16 160.254L1590.03 159.96C1589.95 159.962 1589.86 159.971 1589.77 159.989L1589.72 160.304C1589.58 160.344 1589.46 160.403 1589.34 160.48L1589.07 160.319C1589 160.371 1588.93 160.431 1588.88 160.496L1589.02 160.783C1588.93 160.891 1588.86 161.013 1588.81 161.145L1588.5 161.173C1588.48 161.257 1588.46 161.344 1588.45 161.433L1588.73 161.581C1588.73 161.592 1588.73 161.607 1588.73 161.621C1588.73 161.751 1588.75 161.873 1588.78 161.992L1588.54 162.202C1588.57 162.284 1588.61 162.365 1588.65 162.439L1588.96 162.393C1589.04 162.508 1589.14 162.611 1589.25 162.696L1589.18 163.01C1589.25 163.059 1589.33 163.1 1589.41 163.137L1589.64 162.912C1589.77 162.959 1589.9 162.986 1590.04 162.992L1590.17 163.285C1590.26 163.28 1590.35 163.272 1590.43 163.254L1590.49 162.939C1590.62 162.901 1590.75 162.842 1590.86 162.766L1591.14 162.929C1591.2 162.872 1591.27 162.811 1591.33 162.746L1591.19 162.462C1591.27 162.352 1591.34 162.229 1591.39 162.101L1591.7 162.069C1591.73 161.988 1591.75 161.9 1591.76 161.811L1591.47 161.664Z',
        fill: '#fff'
    },
    // green
    {
        role: '',
        data: 'M1183.09 130.352C1183.09 136.092 1178.44 140.745 1172.7 140.745C1166.96 140.745 1162.3 136.092 1162.3 130.352C1162.3 124.609 1166.96 119.957 1172.7 119.957C1178.44 119.957 1183.09 124.609 1183.09 130.352Z',
        fill: '#005D40'
    },
    {
        role: '',
        data: 'M1167.43 125.272H1178.06V131.384H1167.43V125.272ZM1178.55 125.026C1178.54 124.874 1178.42 124.756 1178.27 124.756H1167.22C1167.07 124.756 1166.94 124.874 1166.93 125.026L1166.93 132.173H1178.56L1178.55 125.026Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1170.92 133.572H1174.95L1175.89 134.28H1170.29L1170.92 133.572ZM1180.22 134.434L1180.22 134.427L1178.56 132.807H1166.93L1165.21 134.451C1165.21 134.456 1165.21 134.459 1165.21 134.459C1165.17 134.506 1165.14 134.567 1165.14 134.635C1165.14 134.775 1165.25 134.885 1165.39 134.885H1180.08C1180.22 134.885 1180.33 134.775 1180.33 134.635C1180.33 134.55 1180.28 134.479 1180.22 134.434Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1174.19 129.362C1174.19 129.362 1173.35 129.168 1172.98 128.497C1172.61 127.832 1172.68 127.376 1172.74 126.986L1174.42 126.181C1174.25 126.107 1174.06 126.055 1173.87 126.027C1172.64 125.833 1171.49 126.676 1171.29 127.911C1171.24 128.289 1171.29 128.657 1171.4 128.995L1169.04 130.511H1171.55L1172.22 130.086C1172.5 130.284 1172.82 130.43 1173.18 130.485C1174.41 130.675 1175.57 129.831 1175.75 128.599C1175.76 128.57 1175.77 128.539 1175.77 128.507L1174.19 129.362Z',
        fill: '#fff'
    },
    // grey
    {
        role: '',
        data: 'M686.029 125.839C686.029 125.167 686.567 124.629 687.239 124.629C687.911 124.629 688.461 125.167 688.461 125.839C688.461 126.511 687.911 127.061 687.239 127.061C686.567 127.061 686.029 126.511 686.029 125.839ZM692.128 132.712C691.883 134.117 691.198 137.566 691.198 137.566H690.233L690.697 131.966H690.6L687.532 137.566H686.567L689.207 131.268C689.207 131.268 689.525 130.645 688.913 129.973C688.816 129.85 688.693 129.715 688.571 129.594L685.259 131.99L684.77 132.026V137.566H684.27V132.1L683.866 132.136V131.549H684.782L687.569 128.48L687.557 128.468L689.525 126.316L688.706 124.385L686.286 122.892L686.09 121.878L689.573 123.54C689.573 123.54 690.307 124.776 690.88 126.157C691.564 127.832 692.164 129.715 692.273 130.07C692.47 130.694 692.359 131.256 692.128 132.712ZM687.667 119.958C681.924 119.958 677.267 124.605 677.267 130.351C677.267 136.098 681.924 140.745 687.667 140.745C693.398 140.745 698.054 136.098 698.054 130.351C698.054 124.605 693.398 119.958 687.667 119.958Z',
        fill: '#8C9091'
    },
    {
        role: '',
        data: 'M688.461 125.839C688.461 126.511 687.911 127.061 687.239 127.061C686.566 127.061 686.029 126.511 686.029 125.839C686.029 125.167 686.566 124.629 687.239 124.629C687.911 124.629 688.461 125.167 688.461 125.839Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M692.127 132.711C691.883 134.118 691.198 137.566 691.198 137.566H690.233L690.697 131.965H690.599L687.531 137.566H686.566L689.206 131.269C689.206 131.269 689.524 130.645 688.913 129.972C688.815 129.85 688.692 129.715 688.57 129.593L685.258 131.99L684.769 132.027V137.566H684.269V132.1L683.866 132.137V131.55H684.783L687.568 128.481L687.556 128.467L689.524 126.316L688.705 124.384L686.285 122.893L686.089 121.877L689.573 123.541C689.573 123.541 690.306 124.775 690.879 126.157C691.565 127.832 692.164 129.715 692.274 130.07C692.469 130.694 692.358 131.257 692.127 132.711Z',
        fill: '#fff'
    },
    // orange
    {
        role: '',
        data: 'M134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39ZM134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39ZM134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39ZM132.499 1061.6C132.499 1061.56 132.499 1061.51 132.512 1061.47L130.168 1060.46C130.023 1060.63 129.827 1060.76 129.605 1060.8V1060.81L129.513 1064.09C129.919 1064.11 130.299 1064.26 130.625 1064.49L132.696 1062.42C132.565 1062.17 132.499 1061.9 132.499 1061.6ZM134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46ZM136.403 1072.44C134.607 1072.44 133.142 1070.98 133.142 1069.18C133.142 1069.12 133.154 1069.06 133.154 1069.01L130.469 1068.34C130.128 1068.55 129.736 1068.67 129.316 1068.67C128.045 1068.67 127.011 1067.64 127.011 1066.37C127.011 1065.24 127.809 1064.31 128.871 1064.1L128.975 1060.79C128.517 1060.65 128.189 1060.24 128.189 1059.72C128.189 1059.11 128.688 1058.61 129.316 1058.61C129.932 1058.61 130.443 1059.11 130.443 1059.72C130.443 1059.78 130.443 1059.83 130.429 1059.87L132.657 1060.84C132.945 1060.18 133.6 1059.72 134.359 1059.72C135.393 1059.72 136.219 1060.56 136.219 1061.6C136.219 1062.13 135.984 1062.63 135.617 1062.96V1062.97L136.193 1065.93C136.259 1065.92 136.337 1065.92 136.403 1065.92C138.21 1065.92 139.665 1067.37 139.665 1069.18C139.665 1070.98 138.21 1072.44 136.403 1072.44ZM133.337 1055.39C127.6 1055.39 122.938 1060.04 122.938 1065.78C122.938 1071.51 127.6 1076.18 133.337 1076.18C139.075 1076.18 143.724 1071.51 143.724 1065.78C143.724 1060.04 139.075 1055.39 133.337 1055.39ZM132.499 1061.6C132.499 1061.56 132.499 1061.51 132.512 1061.47L130.168 1060.46C130.023 1060.63 129.827 1060.76 129.605 1060.8V1060.81L129.513 1064.09C129.919 1064.11 130.299 1064.26 130.625 1064.49L132.696 1062.42C132.565 1062.17 132.499 1061.9 132.499 1061.6ZM134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39ZM134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39ZM132.499 1061.6C132.499 1061.56 132.499 1061.51 132.512 1061.47L130.168 1060.46C130.023 1060.63 129.827 1060.76 129.605 1060.8V1060.81L129.513 1064.09C129.919 1064.11 130.299 1064.26 130.625 1064.49L132.696 1062.42C132.565 1062.17 132.499 1061.9 132.499 1061.6ZM134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39ZM134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39ZM134.831 1063.39C134.673 1063.43 134.517 1063.46 134.359 1063.46C133.94 1063.46 133.548 1063.31 133.232 1063.06L131.216 1065.07C131.477 1065.44 131.621 1065.88 131.621 1066.37C131.621 1066.71 131.543 1067.03 131.399 1067.32L133.443 1067.82C133.823 1067.01 134.517 1066.38 135.368 1066.09L134.831 1063.39Z',
        fill: '#F39100'
    },
    {
        role: '',
        data: 'M136.402 1071.21C135.329 1071.21 134.45 1070.37 134.385 1069.31C134.372 1069.26 134.372 1069.22 134.372 1069.18C134.372 1068.79 134.477 1068.43 134.673 1068.12C134.896 1067.75 135.21 1067.47 135.616 1067.29C135.852 1067.19 136.127 1067.14 136.402 1067.14H136.428C137.542 1067.15 138.446 1068.05 138.446 1069.18C138.446 1070.31 137.529 1071.21 136.402 1071.21ZM133.442 1067.82L131.398 1067.32C131.542 1067.03 131.621 1066.71 131.621 1066.37C131.621 1065.88 131.478 1065.44 131.215 1065.07L133.233 1063.06C133.547 1063.31 133.939 1063.46 134.358 1063.46C134.516 1063.46 134.673 1063.43 134.83 1063.39L135.367 1066.09C134.516 1066.38 133.822 1067.01 133.442 1067.82ZM129.316 1067.79C128.531 1067.79 127.888 1067.15 127.888 1066.37C127.888 1065.74 128.294 1065.21 128.857 1065.02C129.001 1064.96 129.146 1064.94 129.316 1064.94C129.368 1064.94 129.434 1064.95 129.487 1064.95C130.193 1065.04 130.744 1065.64 130.744 1066.37C130.744 1067.15 130.101 1067.79 129.316 1067.79ZM129.604 1060.81V1060.8C129.826 1060.76 130.023 1060.63 130.167 1060.46L132.512 1061.47C132.499 1061.51 132.499 1061.56 132.499 1061.6C132.499 1061.9 132.564 1062.17 132.695 1062.42L130.625 1064.49C130.298 1064.26 129.918 1064.11 129.512 1064.09L129.604 1060.81ZM136.402 1065.92C136.337 1065.92 136.258 1065.92 136.193 1065.93L135.616 1062.97V1062.96C135.983 1062.63 136.22 1062.13 136.22 1061.6C136.22 1060.56 135.394 1059.72 134.358 1059.72C133.599 1059.72 132.944 1060.18 132.656 1060.84L130.429 1059.87C130.442 1059.83 130.442 1059.78 130.442 1059.72C130.442 1059.11 129.932 1058.61 129.316 1058.61C128.687 1058.61 128.189 1059.11 128.189 1059.72C128.189 1060.23 128.516 1060.65 128.975 1060.78L128.871 1064.1C127.81 1064.31 127.01 1065.24 127.01 1066.37C127.01 1067.64 128.046 1068.67 129.316 1068.67C129.735 1068.67 130.128 1068.55 130.469 1068.34L133.153 1069.01C133.153 1069.06 133.141 1069.12 133.141 1069.18C133.141 1070.98 134.608 1072.44 136.402 1072.44C138.21 1072.44 139.664 1070.98 139.664 1069.18C139.664 1067.37 138.21 1065.92 136.402 1065.92Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M130.744 1066.37C130.744 1067.15 130.102 1067.79 129.316 1067.79C128.531 1067.79 127.889 1067.15 127.889 1066.37C127.889 1065.74 128.295 1065.21 128.858 1065.02C129.001 1064.96 129.145 1064.94 129.316 1064.94C129.368 1064.94 129.434 1064.95 129.486 1064.95C130.194 1065.04 130.744 1065.65 130.744 1066.37Z',
        fill: '#F39100'
    },
    {
        role: '',
        data: 'M138.445 1069.18C138.445 1070.31 137.528 1071.21 136.401 1071.21C135.328 1071.21 134.45 1070.37 134.385 1069.31C134.371 1069.26 134.371 1069.22 134.371 1069.18C134.371 1068.79 134.476 1068.43 134.673 1068.12C134.896 1067.75 135.21 1067.47 135.617 1067.3C135.851 1067.19 136.126 1067.14 136.401 1067.14H136.428C137.542 1067.15 138.445 1068.06 138.445 1069.18Z',
        fill: '#F39100'
    },
    // green
    {
        role: '',
        data: 'M490.18 268.932C490.18 263.191 485.527 258.539 479.786 258.539C474.045 258.539 469.392 263.191 469.392 268.932C469.392 273.198 471.963 276.858 475.637 278.462L490.148 269.618C490.16 269.39 490.18 269.166 490.18 268.932Z',
        fill: '#A2C613'
    },
    {
        role: '',
        data: 'M479.587 263.538C480.243 263.538 480.777 263.006 480.777 262.35C480.777 261.694 480.243 261.161 479.587 261.161C478.933 261.161 478.401 261.694 478.401 262.35C478.401 263.006 478.933 263.538 479.587 263.538Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M481.547 263.977L478.215 264.396L473.886 266.006L474.265 266.431L478.402 265.606C478.402 265.606 478.601 265.606 478.601 266.117L477.968 275.438H478.773L479.843 268.168L480.045 268.162L480.737 274.004H481.466L481.519 265.821C481.519 265.31 481.746 265.325 481.746 265.325L485.519 266.964L486.02 266.697L481.547 263.977Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M476.852 278.9C477.782 279.173 478.767 279.327 479.787 279.327C484.856 279.327 489.073 275.693 489.991 270.893L476.852 278.9Z',
        fill: '#A2C613'
    },
    {
        role: '',
        data: 'M490.149 269.618L475.638 278.462C476.031 278.632 476.436 278.78 476.852 278.901L489.991 270.894C490.07 270.476 490.12 270.051 490.149 269.618Z',
        fill: '#fff'
    },
    // green
    {
        role: '',
        data: 'M1598.84 296.649C1598.84 290.908 1594.19 286.256 1588.45 286.256C1582.7 286.256 1578.05 290.908 1578.05 296.649C1578.05 300.915 1580.62 304.575 1584.3 306.179L1598.81 297.335C1598.82 297.107 1598.84 296.882 1598.84 296.649Z',
        fill: '#A2C613'
    },
    {
        role: '',
        data: 'M1588.25 291.255C1588.9 291.255 1589.44 290.723 1589.44 290.067C1589.44 289.411 1588.9 288.878 1588.25 288.878C1587.59 288.878 1587.06 289.411 1587.06 290.067C1587.06 290.723 1587.59 291.255 1588.25 291.255Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1590.21 291.694L1586.87 292.113L1582.54 293.723L1582.92 294.148L1587.06 293.323C1587.06 293.323 1587.26 293.323 1587.26 293.834L1586.63 303.155H1587.43L1588.5 295.885L1588.7 295.879L1589.4 301.721H1590.13L1590.18 293.538C1590.18 293.027 1590.41 293.042 1590.41 293.042L1594.18 294.681L1594.68 294.413L1590.21 291.694Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1585.51 306.616C1586.44 306.889 1587.43 307.044 1588.45 307.044C1593.52 307.044 1597.73 303.41 1598.65 298.61L1585.51 306.616Z',
        fill: '#A2C613'
    },
    {
        role: '',
        data: 'M1598.81 297.334L1584.3 306.178C1584.69 306.348 1585.1 306.496 1585.51 306.616L1598.65 298.61C1598.73 298.192 1598.78 297.767 1598.81 297.334Z',
        fill: '#fff'
    },
    // green
    {
        role: '',
        data: 'M524.826 130.352C524.826 136.092 520.174 140.745 514.432 140.745C508.694 140.745 504.038 136.092 504.038 130.352C504.038 124.611 508.694 119.957 514.432 119.957C520.174 119.957 524.826 124.611 524.826 130.352Z',
        fill: '#1BA037'
    },
    {
        role: '',
        data: 'M515.084 130.443C514.914 130.823 514.47 130.995 514.089 130.827C513.708 130.661 513.537 130.216 513.703 129.834C513.872 129.453 514.315 129.282 514.698 129.448C515.078 129.617 515.249 130.062 515.084 130.443Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M520.741 134.277L516.216 132.468L515.985 130.757L517.744 130.61L520.741 134.277Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M514.6 131.996H514.134L513.928 137.377H514.859L514.6 131.996Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M508.815 131.502L512.605 130.056C511.379 129.116 509.732 128.728 508.398 130.488C508.066 130.928 507.317 131.624 506.87 131.975C506.422 132.323 506.016 132.418 506.016 132.418C506.069 132.419 506.219 132.411 506.219 132.411L512.099 132.129L512.944 130.809L508.815 131.502Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M515.994 125.965C516.185 125.417 516.245 125.003 516.27 124.728C516.27 124.728 516.247 125.827 516.187 126.372C516.029 127.702 515.855 128.169 515.256 128.901C517.777 128.605 518.193 126.684 517.539 124.403C517.358 123.769 516.832 122.764 516.911 122.01C516.621 123.046 515.553 123.836 514.901 124.255C512.979 125.485 513.408 127.251 514.357 128.522C514.65 128.242 515.264 127.591 515.687 126.707C515.816 126.437 515.915 126.19 515.994 125.965Z',
        fill: '#fff'
    },
    // brown 
    {
        role: '',
        data: 'M282.307 1100.43C282.307 1106.16 277.652 1110.82 271.912 1110.82C266.172 1110.82 261.519 1106.16 261.519 1100.43C261.519 1094.69 266.172 1090.03 271.912 1090.03C277.652 1090.03 282.307 1094.69 282.307 1100.43Z',
        fill: '#954329'
    },
    {
        role: '',
        data: 'M267.444 1102.84C267.209 1102.84 267.019 1102.65 267.01 1102.42L267.008 1102.4C267.008 1102.16 267.202 1101.96 267.444 1101.96C267.682 1101.96 267.878 1102.16 267.878 1102.4C267.878 1102.43 267.877 1102.45 267.869 1102.47C267.835 1102.68 267.659 1102.84 267.444 1102.84ZM267.444 1101.21C266.8 1101.21 266.274 1101.72 266.258 1102.36C266.257 1102.37 266.255 1102.39 266.255 1102.4C266.255 1103.05 266.789 1103.58 267.444 1103.58C268.061 1103.58 268.568 1103.11 268.625 1102.51C268.628 1102.47 268.63 1102.44 268.63 1102.4C268.63 1101.74 268.099 1101.21 267.444 1101.21Z',
        fill: '#954329'
    },
    {
        role: '',
        data: 'M267.445 1101.96C267.203 1101.96 267.009 1102.16 267.009 1102.4L267.011 1102.42C267.02 1102.65 267.21 1102.84 267.445 1102.84C267.66 1102.84 267.836 1102.68 267.87 1102.47C267.878 1102.45 267.879 1102.43 267.879 1102.4C267.879 1102.16 267.683 1101.96 267.445 1101.96Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M267.445 1103.58C266.79 1103.58 266.256 1103.05 266.256 1102.4C266.256 1102.39 266.258 1102.37 266.259 1102.36C266.275 1101.72 266.801 1101.21 267.445 1101.21C268.1 1101.21 268.631 1101.74 268.631 1102.4C268.631 1102.44 268.629 1102.47 268.626 1102.51C268.569 1103.11 268.062 1103.58 267.445 1103.58ZM267.445 1100.59C266.476 1100.59 265.686 1101.35 265.641 1102.31C265.64 1102.34 265.639 1102.37 265.639 1102.4C265.639 1103.4 266.448 1104.21 267.445 1104.21C268.393 1104.21 269.174 1103.46 269.243 1102.53C269.248 1102.49 269.25 1102.44 269.25 1102.4C269.25 1101.4 268.44 1100.59 267.445 1100.59Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M271.952 1102.23L272.039 1102.04V1102.04L271.952 1102.23Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M276.098 1101.37C276.098 1101.29 276.116 1101.22 276.148 1101.15C276.228 1100.98 276.4 1100.87 276.599 1100.87C276.66 1100.87 276.715 1100.88 276.768 1100.9C276.862 1100.94 276.946 1100.99 277.004 1101.07C277.065 1101.16 277.103 1101.26 277.103 1101.37C277.103 1101.65 276.877 1101.87 276.599 1101.87C276.323 1101.87 276.098 1101.65 276.098 1101.37ZM276.599 1103.7C275.312 1103.7 274.27 1102.66 274.27 1101.37C274.27 1100.52 274.733 1099.78 275.416 1099.37L275.913 1100.58C275.691 1100.78 275.549 1101.05 275.549 1101.37C275.549 1101.95 276.019 1102.42 276.599 1102.42C277.18 1102.42 277.651 1101.95 277.651 1101.37C277.651 1100.8 277.194 1100.33 276.626 1100.32C276.617 1100.32 276.609 1100.32 276.599 1100.32C276.577 1100.32 276.555 1100.32 276.531 1100.32L276.036 1099.12C276.215 1099.07 276.405 1099.04 276.599 1099.04C277.887 1099.04 278.93 1100.08 278.93 1101.37C278.93 1102.66 277.887 1103.7 276.599 1103.7ZM271.661 1101.25V1096.85H271.67H273.745L271.661 1101.25ZM271.031 1099.36C269.503 1099.36 268.163 1099.35 266.638 1099.35C268.581 1097.41 271.042 1096.91 271.042 1096.91L271.031 1099.36ZM276.599 1098.31C276.305 1098.31 276.026 1098.36 275.757 1098.44L274.05 1094.29H271.865L271.385 1094.96H273.602L274.124 1096.23L271.67 1096.23V1096.23L271.667 1096.23H271.655C267.122 1097.24 263.922 1100.37 263.911 1100.4C263.681 1101.6 263.895 1102.26 264.989 1102.25H264.994C265.07 1100.97 266.132 1099.95 267.432 1099.95C268.726 1099.95 269.783 1100.96 269.87 1102.23H271.941L274.435 1096.99L275.139 1098.7C274.189 1099.22 273.54 1100.21 273.54 1101.37C273.54 1103.06 274.909 1104.43 276.599 1104.43C278.289 1104.43 279.66 1103.06 279.66 1101.37C279.66 1099.68 278.289 1098.31 276.599 1098.31Z',
        fill: '#fff'
    },
    // green
    {
        role: '',
        data: 'M143.724 469.879C143.724 475.619 139.073 480.272 133.33 480.272C127.589 480.272 122.936 475.619 122.936 469.879C122.936 464.135 127.589 459.484 133.33 459.484C139.073 459.484 143.724 464.135 143.724 469.879Z',
        fill: '#005D40'
    },
    {
        role: '',
        data: 'M128.059 464.798H138.692V470.91H128.059V464.798ZM139.186 464.553C139.175 464.401 139.053 464.282 138.899 464.282H127.852C127.698 464.282 127.575 464.401 127.565 464.553L127.561 471.701H139.189L139.186 464.553Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M131.555 473.099H135.582L136.52 473.807H130.926L131.555 473.099ZM140.85 473.961L140.854 473.955L139.19 472.334H127.561L125.844 473.978C125.845 473.983 125.845 473.985 125.845 473.985C125.804 474.033 125.776 474.094 125.776 474.162C125.776 474.302 125.885 474.412 126.021 474.412H140.716C140.85 474.412 140.96 474.302 140.96 474.162C140.96 474.077 140.915 474.006 140.85 473.961Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M134.817 468.889C134.817 468.889 133.979 468.695 133.609 468.024C133.244 467.359 133.315 466.903 133.374 466.513L135.05 465.708C134.879 465.634 134.695 465.582 134.502 465.552C133.272 465.36 132.118 466.203 131.926 467.438C131.868 467.816 131.917 468.184 132.036 468.521L129.667 470.038H132.183L132.855 469.613C133.133 469.811 133.452 469.957 133.811 470.012C135.043 470.202 136.197 469.358 136.386 468.126C136.392 468.097 136.396 468.066 136.4 468.034L134.817 468.889Z',
        fill: '#fff'
    },
    // blue
    {
        role: '',
        data: 'M1037.63 1066.94H1038.93V1067.69H1037.39L1037.04 1067.47L1036.62 1066.48L1036.16 1067.47L1035.82 1067.69H1034.67L1034.27 1069.06L1033.55 1069.04L1032.82 1065.68L1032.49 1067.39L1032.12 1067.69H1029.31V1066.94H1031.81L1032.43 1063.73L1033.16 1063.72L1033.96 1067.43L1034.02 1067.2L1034.38 1066.94H1035.58L1036.29 1065.41L1036.97 1065.42L1037.63 1066.94Z',
        fill: '#00A7E7'
    },
    {
        role: '',
        data: 'M1040 1066.98C1039.71 1069.73 1038.19 1071.13 1037.22 1071.78C1036.25 1072.4 1034.54 1071.74 1034.12 1071.74C1033.34 1071.74 1032.71 1072.19 1031.93 1072.18C1031.13 1072.17 1029.54 1071.4 1028.61 1068.63C1027.69 1065.88 1028.51 1063.85 1028.51 1063.85C1028.51 1063.85 1029.27 1061.89 1030.76 1061.43C1032.12 1061 1032.48 1062.06 1033.59 1062.19C1033.58 1061.64 1033.67 1061.19 1033.79 1060.86C1033.79 1060.85 1033.79 1060.84 1033.8 1060.81C1033.83 1060.79 1033.62 1060.22 1033.6 1060.12C1033.59 1059.92 1033.58 1059.69 1033.68 1059.52C1033.88 1059.19 1034.16 1058.9 1034.47 1058.69C1034.84 1058.45 1035.23 1058.28 1035.64 1058.18C1035.92 1058.1 1036.41 1057.9 1036.7 1058C1036.72 1058.01 1036.75 1058.02 1036.74 1058.06C1036.5 1058.98 1036.55 1059.97 1035.75 1060.63C1035.43 1060.89 1035.02 1061.02 1034.6 1061.03C1034.33 1061.26 1034.06 1061.61 1034.02 1062.17C1034.29 1062.1 1035.03 1061.85 1035.65 1061.64C1038.14 1060.79 1039.42 1063.17 1039.42 1063.17C1039.42 1063.17 1040.29 1064.22 1040 1066.98ZM1034.12 1055.39C1028.38 1055.39 1023.72 1060.04 1023.72 1065.78C1023.72 1071.51 1028.38 1076.18 1034.12 1076.18C1039.86 1076.18 1044.51 1071.51 1044.51 1065.78C1044.51 1060.04 1039.86 1055.39 1034.12 1055.39Z',
        fill: '#00A7E7'
    },
    {
        role: '',
        data: 'M1038.93 1067.69H1037.39L1037.04 1067.47L1036.62 1066.48L1036.16 1067.47L1035.82 1067.69H1034.67L1034.27 1069.06L1033.55 1069.04L1032.82 1065.68L1032.49 1067.39L1032.12 1067.69H1029.31V1066.94H1031.81L1032.43 1063.73L1033.16 1063.72L1033.96 1067.43L1034.03 1067.2L1034.38 1066.94H1035.58L1036.29 1065.41L1036.97 1065.42L1037.63 1066.94H1038.93V1067.69ZM1039.42 1063.17C1039.42 1063.17 1038.14 1060.79 1035.65 1061.64C1035.03 1061.85 1034.29 1062.1 1034.03 1062.17C1034.06 1061.61 1034.33 1061.26 1034.6 1061.03C1035.02 1061.02 1035.43 1060.89 1035.75 1060.63C1036.55 1059.97 1036.5 1058.98 1036.74 1058.06C1036.75 1058.02 1036.73 1058.01 1036.7 1058C1036.41 1057.9 1035.92 1058.1 1035.64 1058.18C1035.23 1058.28 1034.84 1058.45 1034.47 1058.69C1034.16 1058.9 1033.88 1059.19 1033.68 1059.52C1033.58 1059.69 1033.59 1059.92 1033.6 1060.12C1033.62 1060.22 1033.83 1060.79 1033.8 1060.81C1033.79 1060.84 1033.79 1060.85 1033.79 1060.86C1033.67 1061.19 1033.58 1061.64 1033.59 1062.19C1032.48 1062.06 1032.12 1060.99 1030.76 1061.43C1029.27 1061.89 1028.51 1063.85 1028.51 1063.85C1028.51 1063.85 1027.69 1065.88 1028.61 1068.63C1029.54 1071.4 1031.13 1072.17 1031.93 1072.18C1032.71 1072.19 1033.34 1071.74 1034.12 1071.74C1034.54 1071.74 1036.25 1072.4 1037.22 1071.78C1038.19 1071.13 1039.71 1069.73 1040 1066.98C1040.29 1064.22 1039.42 1063.17 1039.42 1063.17Z',
        fill: '#fff'
    },
    // red
    {
        role: '',
        data: 'M450.788 1065.39C450.788 1071.13 446.134 1075.79 440.393 1075.79C434.653 1075.79 430 1071.13 430 1065.39C430 1059.66 434.653 1055 440.393 1055C446.134 1055 450.788 1059.66 450.788 1065.39Z',
        fill: '#D20328'
    },
    {
        role: '',
        data: 'M443.23 1063.17C443.23 1061.6 441.958 1060.34 440.394 1060.34C438.828 1060.34 437.559 1061.6 437.559 1063.17C437.559 1064.21 438.125 1065.11 438.962 1065.61L437.559 1070.77H443.23L442.075 1065.44C442.772 1064.93 443.23 1064.11 443.23 1063.17Z',
        fill: '#fff'
    },
    // green
    {
        role: '',
        data: 'M1529.55 615.392C1529.55 621.13 1524.9 625.783 1519.16 625.783C1513.42 625.783 1508.76 621.13 1508.76 615.392C1508.76 609.65 1513.42 604.996 1519.16 604.996C1524.9 604.996 1529.55 609.65 1529.55 615.392Z',
        fill: '#6CBE98'
    },
    {
        role: '',
        data: 'M1513.77 613.552C1515.28 613.565 1516.36 612.293 1517.89 612.541C1517.87 612.538 1517.91 612.129 1517.89 612.127C1516.36 611.881 1515.28 613.151 1513.77 613.14C1513.76 613.14 1513.76 613.552 1513.77 613.552Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1513.68 614.611C1515.22 614.623 1516.35 613.352 1517.89 613.6C1517.87 613.597 1517.91 613.19 1517.89 613.183C1516.35 612.938 1515.22 614.208 1513.68 614.197C1513.68 614.197 1513.68 614.611 1513.68 614.611Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1513.56 615.7C1514.36 615.709 1515.1 615.526 1515.8 615.141C1516.49 614.759 1517.09 614.561 1517.89 614.688C1517.87 614.684 1517.91 614.277 1517.89 614.276C1517.19 614.161 1516.65 614.291 1516.02 614.605C1515.21 615.019 1514.49 615.294 1513.56 615.288C1513.55 615.288 1513.55 615.7 1513.56 615.7Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1524.49 612.68H1520.53V612.291H1524.49V612.68Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1524.49 613.701H1520.53V613.314H1524.49V613.701Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1524.49 614.916H1520.53V614.529H1524.49V614.916Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1525.06 618.226H1519.89C1519.84 618.226 1519.8 618.181 1519.8 618.127L1519.79 610.876C1519.79 610.822 1519.83 610.78 1519.88 610.78L1525.05 610.774C1525.1 610.774 1525.14 610.822 1525.14 610.876L1525.15 618.127C1525.15 618.18 1525.11 618.226 1525.06 618.226ZM1522.65 619.596C1522.37 619.599 1522.15 619.371 1522.15 619.093C1522.15 618.815 1522.37 618.591 1522.65 618.591C1522.93 618.591 1523.15 618.815 1523.15 619.093C1523.15 619.371 1522.93 619.599 1522.65 619.596ZM1517.98 617.528C1517.27 617.4 1516.66 617.641 1516.03 617.95C1515.33 618.294 1514.62 618.697 1513.83 618.814C1513.45 618.87 1513.06 618.868 1512.67 618.843C1512.79 616.998 1512.9 615.172 1513.02 613.322C1513.05 612.838 1513.08 612.359 1513.12 611.877C1513.62 611.896 1514.12 611.828 1514.57 611.58C1514.98 611.352 1515.31 611.021 1515.7 610.774C1516.59 610.216 1518.06 610.146 1518.92 610.812V617.919C1518.65 617.714 1518.3 617.586 1517.98 617.528ZM1526.04 610.4C1526.04 610.125 1525.84 609.9 1525.58 609.9L1519.37 609.903C1519.18 609.903 1519.02 610.031 1518.95 610.212C1518.95 610.206 1518.93 610.195 1518.92 610.187C1518.75 610.044 1518.54 609.944 1518.33 609.872C1517.51 609.593 1516.48 609.694 1515.74 610.13C1515.43 610.313 1515.17 610.547 1514.88 610.753C1514.58 610.976 1514.25 611.137 1513.88 611.217C1513.56 611.28 1513.22 611.279 1512.9 611.251L1512.9 611.256C1512.77 611.248 1512.64 611.242 1512.64 611.251C1512.51 613.287 1512.37 615.323 1512.24 617.361C1512.2 618.054 1512.15 618.745 1512.11 619.435C1512.6 619.484 1513.35 619.495 1513.77 619.445C1514.55 619.352 1515.28 618.947 1515.97 618.602C1516.61 618.282 1517.2 618.045 1517.92 618.142C1518.26 618.187 1518.64 618.32 1518.92 618.536V619.028C1517.96 618.393 1516.93 618.574 1515.89 619.075C1514.59 619.71 1513.49 620.062 1512.02 619.931C1512.03 619.931 1512 620.342 1512.02 620.342C1513.48 620.477 1514.6 620.135 1515.89 619.489C1516.93 618.975 1517.97 618.808 1518.93 619.449C1518.96 619.69 1519.15 619.878 1519.38 619.878H1525.59C1525.84 619.878 1526.04 619.652 1526.04 619.379L1526.04 610.4Z',
        fill: '#fff'
    },
    // green
    {
        role: '',
        data: 'M1252.38 1100.43C1252.38 1106.17 1247.73 1110.82 1241.99 1110.82C1236.25 1110.82 1231.6 1106.17 1231.6 1100.43C1231.6 1094.69 1236.25 1090.03 1241.99 1090.03C1247.73 1090.03 1252.38 1094.69 1252.38 1100.43Z',
        fill: '#1BA037'
    },
    {
        role: '',
        data: 'M1242.64 1100.52C1242.47 1100.9 1242.03 1101.07 1241.65 1100.9C1241.27 1100.74 1241.09 1100.29 1241.26 1099.91C1241.43 1099.53 1241.87 1099.36 1242.26 1099.52C1242.64 1099.69 1242.81 1100.14 1242.64 1100.52Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1248.3 1104.35L1243.77 1102.55L1243.54 1100.83L1245.3 1100.69L1248.3 1104.35Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1242.16 1102.07H1241.69L1241.49 1107.45H1242.42L1242.16 1102.07Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1236.37 1101.58L1240.16 1100.13C1238.94 1099.19 1237.29 1098.81 1235.96 1100.57C1235.62 1101.01 1234.88 1101.7 1234.43 1102.05C1233.98 1102.4 1233.57 1102.49 1233.57 1102.49C1233.63 1102.5 1233.78 1102.49 1233.78 1102.49L1239.66 1102.21L1240.5 1100.89L1236.37 1101.58Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M1243.55 1096.04C1243.74 1095.49 1243.8 1095.08 1243.83 1094.8C1243.83 1094.8 1243.81 1095.9 1243.75 1096.45C1243.59 1097.78 1243.41 1098.25 1242.81 1098.98C1245.33 1098.68 1245.75 1096.76 1245.1 1094.48C1244.92 1093.85 1244.39 1092.84 1244.47 1092.09C1244.18 1093.12 1243.11 1093.91 1242.46 1094.33C1240.54 1095.56 1240.97 1097.33 1241.91 1098.6C1242.21 1098.32 1242.82 1097.67 1243.25 1096.78C1243.37 1096.51 1243.47 1096.27 1243.55 1096.04Z',
        fill: '#fff'
    },
    // grey
    {
        role: '',
        data: 'M325.714 905.365C325.714 904.693 326.252 904.155 326.924 904.155C327.596 904.155 328.146 904.693 328.146 905.365C328.146 906.037 327.596 906.587 326.924 906.587C326.252 906.587 325.714 906.037 325.714 905.365ZM331.813 912.238C331.568 913.643 330.884 917.092 330.884 917.092H329.918L330.383 911.491H330.285L327.217 917.092H326.252L328.892 910.794C328.892 910.794 329.21 910.171 328.598 909.497C328.501 909.376 328.378 909.241 328.256 909.12L324.945 911.515L324.455 911.552V917.092H323.955V911.626L323.551 911.662V911.075H324.467L327.254 908.006L327.242 907.994L329.21 905.842L328.391 903.911L325.971 902.418L325.775 901.404L329.258 903.066C329.258 903.066 329.992 904.3 330.566 905.683C331.249 907.358 331.85 909.241 331.958 909.595C332.155 910.22 332.044 910.782 331.813 912.238ZM327.352 899.484C321.609 899.484 316.952 904.131 316.952 909.877C316.952 915.624 321.609 920.271 327.352 920.271C333.083 920.271 337.739 915.624 337.739 909.877C337.739 904.131 333.083 899.484 327.352 899.484Z',
        fill: '#8C9091'
    },
    {
        role: '',
        data: 'M328.147 905.365C328.147 906.037 327.597 906.587 326.925 906.587C326.253 906.587 325.715 906.037 325.715 905.365C325.715 904.693 326.253 904.155 326.925 904.155C327.597 904.155 328.147 904.693 328.147 905.365Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M331.813 912.237C331.569 913.644 330.884 917.092 330.884 917.092H329.919L330.383 911.491H330.285L327.217 917.092H326.252L328.892 910.794C328.892 910.794 329.21 910.17 328.599 909.498C328.501 909.376 328.379 909.241 328.256 909.119L324.945 911.516L324.455 911.551V917.092H323.955V911.626L323.552 911.663V911.076H324.469L327.254 908.007L327.242 907.993L329.21 905.842L328.391 903.91L325.971 902.418L325.775 901.403L329.259 903.067C329.259 903.067 329.992 904.301 330.566 905.683C331.251 907.358 331.85 909.241 331.96 909.596C332.155 910.219 332.044 910.783 331.813 912.237Z',
        fill: '#fff'
    },
    // green
    {
        role: '',
        data: 'M143.724 781.691C143.724 787.429 139.072 792.082 133.331 792.082C127.592 792.082 122.936 787.429 122.936 781.691C122.936 775.949 127.592 771.295 133.331 771.295C139.072 771.295 143.724 775.949 143.724 781.691Z',
        fill: '#6CBE98'
    },
    {
        role: '',
        data: 'M127.944 779.851C129.457 779.864 130.536 778.592 132.062 778.84C132.042 778.837 132.086 778.428 132.062 778.426C130.536 778.18 129.457 779.45 127.944 779.439C127.94 779.439 127.938 779.851 127.944 779.851Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M127.859 780.91C129.399 780.922 130.525 779.651 132.061 779.899C132.041 779.896 132.085 779.489 132.061 779.482C130.525 779.237 129.399 780.507 127.859 780.496C127.857 780.496 127.854 780.91 127.859 780.91Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M127.734 781.999C128.538 782.008 129.275 781.825 129.979 781.44C130.67 781.058 131.269 780.86 132.062 780.987C132.042 780.983 132.086 780.576 132.062 780.575C131.363 780.46 130.823 780.59 130.2 780.904C129.389 781.318 128.662 781.593 127.734 781.587C127.73 781.587 127.73 781.999 127.734 781.999Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M138.668 778.979H134.707V778.59H138.668V778.979Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M138.668 780H134.707V779.613H138.668V780Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M138.668 781.215H134.707V780.828H138.668V781.215Z',
        fill: '#fff'
    },
    {
        role: '',
        data: 'M139.232 784.525H134.063C134.016 784.525 133.978 784.48 133.976 784.426L133.97 777.175C133.97 777.121 134.009 777.079 134.058 777.079L139.228 777.073C139.276 777.073 139.316 777.121 139.316 777.175L139.324 784.426C139.324 784.479 139.285 784.525 139.232 784.525ZM136.827 785.895C136.549 785.898 136.326 785.67 136.326 785.392C136.326 785.114 136.549 784.89 136.827 784.89C137.104 784.89 137.331 785.114 137.331 785.392C137.331 785.67 137.104 785.898 136.827 785.895ZM132.157 783.827C131.445 783.699 130.832 783.94 130.206 784.249C129.503 784.593 128.793 784.996 128.008 785.113C127.626 785.169 127.232 785.167 126.844 785.142C126.963 783.297 127.079 781.471 127.199 779.621C127.23 779.137 127.259 778.658 127.291 778.176C127.799 778.195 128.291 778.127 128.744 777.879C129.151 777.651 129.486 777.32 129.877 777.073C130.771 776.515 132.231 776.445 133.095 777.111V784.218C132.83 784.013 132.474 783.885 132.157 783.827ZM140.215 776.699C140.215 776.424 140.012 776.199 139.76 776.199L133.55 776.202C133.359 776.202 133.197 776.33 133.129 776.511C133.121 776.505 133.109 776.494 133.101 776.486C132.927 776.343 132.716 776.243 132.501 776.171C131.687 775.892 130.657 775.993 129.916 776.429C129.609 776.612 129.347 776.846 129.061 777.052C128.756 777.275 128.423 777.436 128.054 777.516C127.733 777.579 127.398 777.578 127.071 777.55L127.073 777.555C126.946 777.547 126.815 777.541 126.815 777.55C126.683 779.586 126.549 781.622 126.421 783.66C126.375 784.353 126.329 785.044 126.286 785.734C126.78 785.783 127.521 785.794 127.945 785.744C128.731 785.651 129.451 785.246 130.147 784.901C130.782 784.581 131.376 784.344 132.1 784.441C132.435 784.486 132.82 784.619 133.095 784.835V785.327C132.138 784.692 131.108 784.873 130.07 785.374C128.762 786.009 127.661 786.361 126.193 786.23C126.204 786.23 126.179 786.641 126.193 786.641C127.651 786.776 128.772 786.434 130.07 785.788C131.105 785.274 132.15 785.107 133.109 785.748C133.14 785.989 133.324 786.177 133.554 786.177H139.762C140.014 786.177 140.22 785.951 140.217 785.678L140.215 776.699Z',
        fill: '#fff'
    }
];

/***/ }),

/***/ "./node_modules/konva/lib/Animation.js":
/*!*********************************************!*\
  !*** ./node_modules/konva/lib/Animation.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Animation": () => (/* binding */ Animation)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");


var now = (function () {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.glob.performance && _Global_js__WEBPACK_IMPORTED_MODULE_0__.glob.performance.now) {
        return function () {
            return _Global_js__WEBPACK_IMPORTED_MODULE_0__.glob.performance.now();
        };
    }
    return function () {
        return new Date().getTime();
    };
})();
class Animation {
    constructor(func, layers) {
        this.id = Animation.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: now(),
            frameRate: 0,
        };
        this.func = func;
        this.setLayers(layers);
    }
    setLayers(layers) {
        var lays = [];
        if (!layers) {
            lays = [];
        }
        else if (layers.length > 0) {
            lays = layers;
        }
        else {
            lays = [layers];
        }
        this.layers = lays;
        return this;
    }
    getLayers() {
        return this.layers;
    }
    addLayer(layer) {
        var layers = this.layers, len = layers.length, n;
        for (n = 0; n < len; n++) {
            if (layers[n]._id === layer._id) {
                return false;
            }
        }
        this.layers.push(layer);
        return true;
    }
    isRunning() {
        var a = Animation, animations = a.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === this.id) {
                return true;
            }
        }
        return false;
    }
    start() {
        this.stop();
        this.frame.timeDiff = 0;
        this.frame.lastTime = now();
        Animation._addAnimation(this);
        return this;
    }
    stop() {
        Animation._removeAnimation(this);
        return this;
    }
    _updateFrameObject(time) {
        this.frame.timeDiff = time - this.frame.lastTime;
        this.frame.lastTime = time;
        this.frame.time += this.frame.timeDiff;
        this.frame.frameRate = 1000 / this.frame.timeDiff;
    }
    static _addAnimation(anim) {
        this.animations.push(anim);
        this._handleAnimation();
    }
    static _removeAnimation(anim) {
        var id = anim.id, animations = this.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    }
    static _runFrames() {
        var layerHash = {}, animations = this.animations, anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        for (n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;
            anim._updateFrameObject(now());
            layersLen = layers.length;
            if (func) {
                needRedraw = func.call(anim, anim.frame) !== false;
            }
            else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];
                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
        }
        for (key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].batchDraw();
        }
    }
    static _animationLoop() {
        var Anim = Animation;
        if (Anim.animations.length) {
            Anim._runFrames();
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.requestAnimFrame(Anim._animationLoop);
        }
        else {
            Anim.animRunning = false;
        }
    }
    static _handleAnimation() {
        if (!this.animRunning) {
            this.animRunning = true;
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.requestAnimFrame(this._animationLoop);
        }
    }
}
Animation.animations = [];
Animation.animIdCounter = 0;
Animation.animRunning = false;


/***/ }),

/***/ "./node_modules/konva/lib/Canvas.js":
/*!******************************************!*\
  !*** ./node_modules/konva/lib/Canvas.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Canvas": () => (/* binding */ Canvas),
/* harmony export */   "HitCanvas": () => (/* binding */ HitCanvas),
/* harmony export */   "SceneCanvas": () => (/* binding */ SceneCanvas)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Context.js */ "./node_modules/konva/lib/Context.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Validators.js */ "./node_modules/konva/lib/Validators.js");





var _pixelRatio;
function getDevicePixelRatio() {
    if (_pixelRatio) {
        return _pixelRatio;
    }
    var canvas = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createCanvasElement();
    var context = canvas.getContext('2d');
    _pixelRatio = (function () {
        var devicePixelRatio = _Global_js__WEBPACK_IMPORTED_MODULE_2__.Konva._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return devicePixelRatio / backingStoreRatio;
    })();
    return _pixelRatio;
}
class Canvas {
    constructor(config) {
        this.pixelRatio = 1;
        this.width = 0;
        this.height = 0;
        this.isCache = false;
        var conf = config || {};
        var pixelRatio = conf.pixelRatio || _Global_js__WEBPACK_IMPORTED_MODULE_2__.Konva.pixelRatio || getDevicePixelRatio();
        this.pixelRatio = pixelRatio;
        this._canvas = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createCanvasElement();
        this._canvas.style.padding = '0';
        this._canvas.style.margin = '0';
        this._canvas.style.border = '0';
        this._canvas.style.background = 'transparent';
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
    }
    getContext() {
        return this.context;
    }
    getPixelRatio() {
        return this.pixelRatio;
    }
    setPixelRatio(pixelRatio) {
        var previousRatio = this.pixelRatio;
        this.pixelRatio = pixelRatio;
        this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
    }
    setWidth(width) {
        this.width = this._canvas.width = width * this.pixelRatio;
        this._canvas.style.width = width + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    }
    setHeight(height) {
        this.height = this._canvas.height = height * this.pixelRatio;
        this._canvas.style.height = height + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setSize(width, height) {
        this.setWidth(width || 0);
        this.setHeight(height || 0);
    }
    toDataURL(mimeType, quality) {
        try {
            return this._canvas.toDataURL(mimeType, quality);
        }
        catch (e) {
            try {
                return this._canvas.toDataURL();
            }
            catch (err) {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Unable to get data URL. ' +
                    err.message +
                    ' For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                return '';
            }
        }
    }
}
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Canvas, 'pixelRatio', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
class SceneCanvas extends Canvas {
    constructor(config = { width: 0, height: 0 }) {
        super(config);
        this.context = new _Context_js__WEBPACK_IMPORTED_MODULE_1__.SceneContext(this);
        this.setSize(config.width, config.height);
    }
}
class HitCanvas extends Canvas {
    constructor(config = { width: 0, height: 0 }) {
        super(config);
        this.hitCanvas = true;
        this.context = new _Context_js__WEBPACK_IMPORTED_MODULE_1__.HitContext(this);
        this.setSize(config.width, config.height);
    }
}


/***/ }),

/***/ "./node_modules/konva/lib/Container.js":
/*!*********************************************!*\
  !*** ./node_modules/konva/lib/Container.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Container": () => (/* binding */ Container)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Validators.js */ "./node_modules/konva/lib/Validators.js");



class Container extends _Node_js__WEBPACK_IMPORTED_MODULE_1__.Node {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    getChildren(filterFunc) {
        if (!filterFunc) {
            return this.children || [];
        }
        const children = this.children || [];
        var results = [];
        children.forEach(function (child) {
            if (filterFunc(child)) {
                results.push(child);
            }
        });
        return results;
    }
    hasChildren() {
        return this.getChildren().length > 0;
    }
    removeChildren() {
        this.getChildren().forEach((child) => {
            child.parent = null;
            child.index = 0;
            child.remove();
        });
        this.children = [];
        this._requestDraw();
        return this;
    }
    destroyChildren() {
        this.getChildren().forEach((child) => {
            child.parent = null;
            child.index = 0;
            child.destroy();
        });
        this.children = [];
        this._requestDraw();
        return this;
    }
    add(...children) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        var child = children[0];
        if (child.getParent()) {
            child.moveTo(this);
            return this;
        }
        this._validateAdd(child);
        child.index = this.getChildren().length;
        child.parent = this;
        child._clearCaches();
        this.getChildren().push(child);
        this._fire('add', {
            child: child,
        });
        this._requestDraw();
        return this;
    }
    destroy() {
        if (this.hasChildren()) {
            this.destroyChildren();
        }
        super.destroy();
        return this;
    }
    find(selector) {
        return this._generalFind(selector, false);
    }
    findOne(selector) {
        var result = this._generalFind(selector, true);
        return result.length > 0 ? result[0] : undefined;
    }
    _generalFind(selector, findOne) {
        var retArr = [];
        this._descendants((node) => {
            const valid = node._isMatch(selector);
            if (valid) {
                retArr.push(node);
            }
            if (valid && findOne) {
                return true;
            }
            return false;
        });
        return retArr;
    }
    _descendants(fn) {
        let shouldStop = false;
        const children = this.getChildren();
        for (const child of children) {
            shouldStop = fn(child);
            if (shouldStop) {
                return true;
            }
            if (!child.hasChildren()) {
                continue;
            }
            shouldStop = child._descendants(fn);
            if (shouldStop) {
                return true;
            }
        }
        return false;
    }
    toObject() {
        var obj = _Node_js__WEBPACK_IMPORTED_MODULE_1__.Node.prototype.toObject.call(this);
        obj.children = [];
        this.getChildren().forEach((child) => {
            obj.children.push(child.toObject());
        });
        return obj;
    }
    isAncestorOf(node) {
        var parent = node.getParent();
        while (parent) {
            if (parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    }
    clone(obj) {
        var node = _Node_js__WEBPACK_IMPORTED_MODULE_1__.Node.prototype.clone.call(this, obj);
        this.getChildren().forEach(function (no) {
            node.add(no.clone());
        });
        return node;
    }
    getAllIntersections(pos) {
        var arr = [];
        this.find('Shape').forEach(function (shape) {
            if (shape.isVisible() && shape.intersects(pos)) {
                arr.push(shape);
            }
        });
        return arr;
    }
    _clearSelfAndDescendantCache(attr) {
        var _a;
        super._clearSelfAndDescendantCache(attr);
        if (this.isCached()) {
            return;
        }
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
            node._clearSelfAndDescendantCache(attr);
        });
    }
    _setChildrenIndices() {
        var _a;
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child, n) {
            child.index = n;
        });
        this._requestDraw();
    }
    drawScene(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas()), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
        var caching = canvas && canvas.isCache;
        if (!this.isVisible() && !caching) {
            return this;
        }
        if (cachedSceneCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedSceneCanvas(context);
            context.restore();
        }
        else {
            this._drawChildren('drawScene', canvas, top);
        }
        return this;
    }
    drawHit(can, top) {
        if (!this.shouldDrawHit(top)) {
            return this;
        }
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (cachedHitCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedHitCanvas(context);
            context.restore();
        }
        else {
            this._drawChildren('drawHit', canvas, top);
        }
        return this;
    }
    _drawChildren(drawMethod, canvas, top) {
        var _a;
        var context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = (clipWidth && clipHeight) || clipFunc;
        const selfCache = top === this;
        if (hasClip) {
            context.save();
            var transform = this.getAbsoluteTransform(top);
            var m = transform.getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            context.beginPath();
            if (clipFunc) {
                clipFunc.call(this, context, this);
            }
            else {
                var clipX = this.clipX();
                var clipY = this.clipY();
                context.rect(clipX, clipY, clipWidth, clipHeight);
            }
            context.clip();
            m = transform.copy().invert().getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        var hasComposition = !selfCache &&
            this.globalCompositeOperation() !== 'source-over' &&
            drawMethod === 'drawScene';
        if (hasComposition) {
            context.save();
            context._applyGlobalCompositeOperation(this);
        }
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            child[drawMethod](canvas, top);
        });
        if (hasComposition) {
            context.restore();
        }
        if (hasClip) {
            context.restore();
        }
    }
    getClientRect(config) {
        var _a;
        config = config || {};
        var skipTransform = config.skipTransform;
        var relativeTo = config.relativeTo;
        var minX, minY, maxX, maxY;
        var selfRect = {
            x: Infinity,
            y: Infinity,
            width: 0,
            height: 0,
        };
        var that = this;
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            if (!child.visible()) {
                return;
            }
            var rect = child.getClientRect({
                relativeTo: that,
                skipShadow: config.skipShadow,
                skipStroke: config.skipStroke,
            });
            if (rect.width === 0 && rect.height === 0) {
                return;
            }
            if (minX === undefined) {
                minX = rect.x;
                minY = rect.y;
                maxX = rect.x + rect.width;
                maxY = rect.y + rect.height;
            }
            else {
                minX = Math.min(minX, rect.x);
                minY = Math.min(minY, rect.y);
                maxX = Math.max(maxX, rect.x + rect.width);
                maxY = Math.max(maxY, rect.y + rect.height);
            }
        });
        var shapes = this.find('Shape');
        var hasVisible = false;
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape._isVisible(this)) {
                hasVisible = true;
                break;
            }
        }
        if (hasVisible && minX !== undefined) {
            selfRect = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
            };
        }
        else {
            selfRect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }
        if (!skipTransform) {
            return this._transformedRect(selfRect, relativeTo);
        }
        return selfRect;
    }
}
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addComponentsGetterSetter(Container, 'clip', [
    'x',
    'y',
    'width',
    'height',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipX', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipY', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipWidth', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipHeight', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Container, 'clipFunc');


/***/ }),

/***/ "./node_modules/konva/lib/Context.js":
/*!*******************************************!*\
  !*** ./node_modules/konva/lib/Context.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Context": () => (/* binding */ Context),
/* harmony export */   "HitContext": () => (/* binding */ HitContext),
/* harmony export */   "SceneContext": () => (/* binding */ SceneContext)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");


function simplifyArray(arr) {
    var retArr = [], len = arr.length, util = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util, n, val;
    for (n = 0; n < len; n++) {
        val = arr[n];
        if (util._isNumber(val)) {
            val = Math.round(val * 1000) / 1000;
        }
        else if (!util._isString(val)) {
            val = val + '';
        }
        retArr.push(val);
    }
    return retArr;
}
var COMMA = ',', OPEN_PAREN = '(', CLOSE_PAREN = ')', OPEN_PAREN_BRACKET = '([', CLOSE_BRACKET_PAREN = '])', SEMICOLON = ';', DOUBLE_PAREN = '()', EQUALS = '=', CONTEXT_METHODS = [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    'createLinearGradient',
    'createPattern',
    'createRadialGradient',
    'drawImage',
    'ellipse',
    'fill',
    'fillText',
    'getImageData',
    'createImageData',
    'lineTo',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeText',
    'transform',
    'translate',
];
var CONTEXT_PROPERTIES = [
    'fillStyle',
    'strokeStyle',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'font',
    'textAlign',
    'textBaseline',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled',
];
const traceArrMax = 100;
class Context {
    constructor(canvas) {
        this.canvas = canvas;
        this._context = canvas._canvas.getContext('2d');
        if (_Global_js__WEBPACK_IMPORTED_MODULE_1__.Konva.enableTrace) {
            this.traceArr = [];
            this._enableTrace();
        }
    }
    fillShape(shape) {
        if (shape.fillEnabled()) {
            this._fill(shape);
        }
    }
    _fill(shape) {
    }
    strokeShape(shape) {
        if (shape.hasStroke()) {
            this._stroke(shape);
        }
    }
    _stroke(shape) {
    }
    fillStrokeShape(shape) {
        if (shape.attrs.fillAfterStrokeEnabled) {
            this.strokeShape(shape);
            this.fillShape(shape);
        }
        else {
            this.fillShape(shape);
            this.strokeShape(shape);
        }
    }
    getTrace(relaxed, rounded) {
        var traceArr = this.traceArr, len = traceArr.length, str = '', n, trace, method, args;
        for (n = 0; n < len; n++) {
            trace = traceArr[n];
            method = trace.method;
            if (method) {
                args = trace.args;
                str += method;
                if (relaxed) {
                    str += DOUBLE_PAREN;
                }
                else {
                    if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(args[0])) {
                        str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                    }
                    else {
                        if (rounded) {
                            args = args.map((a) => typeof a === 'number' ? Math.floor(a) : a);
                        }
                        str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                    }
                }
            }
            else {
                str += trace.property;
                if (!relaxed) {
                    str += EQUALS + trace.val;
                }
            }
            str += SEMICOLON;
        }
        return str;
    }
    clearTrace() {
        this.traceArr = [];
    }
    _trace(str) {
        var traceArr = this.traceArr, len;
        traceArr.push(str);
        len = traceArr.length;
        if (len >= traceArrMax) {
            traceArr.shift();
        }
    }
    reset() {
        var pixelRatio = this.getCanvas().getPixelRatio();
        this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
    }
    getCanvas() {
        return this.canvas;
    }
    clear(bounds) {
        var canvas = this.getCanvas();
        if (bounds) {
            this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
        }
        else {
            this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
        }
    }
    _applyLineCap(shape) {
        var lineCap = shape.getLineCap();
        if (lineCap) {
            this.setAttr('lineCap', lineCap);
        }
    }
    _applyOpacity(shape) {
        var absOpacity = shape.getAbsoluteOpacity();
        if (absOpacity !== 1) {
            this.setAttr('globalAlpha', absOpacity);
        }
    }
    _applyLineJoin(shape) {
        var lineJoin = shape.attrs.lineJoin;
        if (lineJoin) {
            this.setAttr('lineJoin', lineJoin);
        }
    }
    setAttr(attr, val) {
        this._context[attr] = val;
    }
    arc(a0, a1, a2, a3, a4, a5) {
        this._context.arc(a0, a1, a2, a3, a4, a5);
    }
    arcTo(a0, a1, a2, a3, a4) {
        this._context.arcTo(a0, a1, a2, a3, a4);
    }
    beginPath() {
        this._context.beginPath();
    }
    bezierCurveTo(a0, a1, a2, a3, a4, a5) {
        this._context.bezierCurveTo(a0, a1, a2, a3, a4, a5);
    }
    clearRect(a0, a1, a2, a3) {
        this._context.clearRect(a0, a1, a2, a3);
    }
    clip() {
        this._context.clip();
    }
    closePath() {
        this._context.closePath();
    }
    createImageData(a0, a1) {
        var a = arguments;
        if (a.length === 2) {
            return this._context.createImageData(a0, a1);
        }
        else if (a.length === 1) {
            return this._context.createImageData(a0);
        }
    }
    createLinearGradient(a0, a1, a2, a3) {
        return this._context.createLinearGradient(a0, a1, a2, a3);
    }
    createPattern(a0, a1) {
        return this._context.createPattern(a0, a1);
    }
    createRadialGradient(a0, a1, a2, a3, a4, a5) {
        return this._context.createRadialGradient(a0, a1, a2, a3, a4, a5);
    }
    drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        var a = arguments, _context = this._context;
        if (a.length === 3) {
            _context.drawImage(a0, a1, a2);
        }
        else if (a.length === 5) {
            _context.drawImage(a0, a1, a2, a3, a4);
        }
        else if (a.length === 9) {
            _context.drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8);
        }
    }
    ellipse(a0, a1, a2, a3, a4, a5, a6, a7) {
        this._context.ellipse(a0, a1, a2, a3, a4, a5, a6, a7);
    }
    isPointInPath(x, y) {
        return this._context.isPointInPath(x, y);
    }
    fill(path2d) {
        if (path2d) {
            this._context.fill(path2d);
        }
        else {
            this._context.fill();
        }
    }
    fillRect(x, y, width, height) {
        this._context.fillRect(x, y, width, height);
    }
    strokeRect(x, y, width, height) {
        this._context.strokeRect(x, y, width, height);
    }
    fillText(text, x, y, maxWidth) {
        if (maxWidth) {
            this._context.fillText(text, x, y, maxWidth);
        }
        else {
            this._context.fillText(text, x, y);
        }
    }
    measureText(text) {
        return this._context.measureText(text);
    }
    getImageData(a0, a1, a2, a3) {
        return this._context.getImageData(a0, a1, a2, a3);
    }
    lineTo(a0, a1) {
        this._context.lineTo(a0, a1);
    }
    moveTo(a0, a1) {
        this._context.moveTo(a0, a1);
    }
    rect(a0, a1, a2, a3) {
        this._context.rect(a0, a1, a2, a3);
    }
    putImageData(a0, a1, a2) {
        this._context.putImageData(a0, a1, a2);
    }
    quadraticCurveTo(a0, a1, a2, a3) {
        this._context.quadraticCurveTo(a0, a1, a2, a3);
    }
    restore() {
        this._context.restore();
    }
    rotate(a0) {
        this._context.rotate(a0);
    }
    save() {
        this._context.save();
    }
    scale(a0, a1) {
        this._context.scale(a0, a1);
    }
    setLineDash(a0) {
        if (this._context.setLineDash) {
            this._context.setLineDash(a0);
        }
        else if ('mozDash' in this._context) {
            this._context['mozDash'] = a0;
        }
        else if ('webkitLineDash' in this._context) {
            this._context['webkitLineDash'] = a0;
        }
    }
    getLineDash() {
        return this._context.getLineDash();
    }
    setTransform(a0, a1, a2, a3, a4, a5) {
        this._context.setTransform(a0, a1, a2, a3, a4, a5);
    }
    stroke(path2d) {
        if (path2d) {
            this._context.stroke(path2d);
        }
        else {
            this._context.stroke();
        }
    }
    strokeText(a0, a1, a2, a3) {
        this._context.strokeText(a0, a1, a2, a3);
    }
    transform(a0, a1, a2, a3, a4, a5) {
        this._context.transform(a0, a1, a2, a3, a4, a5);
    }
    translate(a0, a1) {
        this._context.translate(a0, a1);
    }
    _enableTrace() {
        var that = this, len = CONTEXT_METHODS.length, origSetter = this.setAttr, n, args;
        var func = function (methodName) {
            var origMethod = that[methodName], ret;
            that[methodName] = function () {
                args = simplifyArray(Array.prototype.slice.call(arguments, 0));
                ret = origMethod.apply(that, arguments);
                that._trace({
                    method: methodName,
                    args: args,
                });
                return ret;
            };
        };
        for (n = 0; n < len; n++) {
            func(CONTEXT_METHODS[n]);
        }
        that.setAttr = function () {
            origSetter.apply(that, arguments);
            var prop = arguments[0];
            var val = arguments[1];
            if (prop === 'shadowOffsetX' ||
                prop === 'shadowOffsetY' ||
                prop === 'shadowBlur') {
                val = val / this.canvas.getPixelRatio();
            }
            that._trace({
                property: prop,
                val: val,
            });
        };
    }
    _applyGlobalCompositeOperation(node) {
        const op = node.attrs.globalCompositeOperation;
        var def = !op || op === 'source-over';
        if (!def) {
            this.setAttr('globalCompositeOperation', op);
        }
    }
}
CONTEXT_PROPERTIES.forEach(function (prop) {
    Object.defineProperty(Context.prototype, prop, {
        get() {
            return this._context[prop];
        },
        set(val) {
            this._context[prop] = val;
        },
    });
});
class SceneContext extends Context {
    _fillColor(shape) {
        var fill = shape.fill();
        this.setAttr('fillStyle', fill);
        shape._fillFunc(this);
    }
    _fillPattern(shape) {
        this.setAttr('fillStyle', shape._getFillPattern());
        shape._fillFunc(this);
    }
    _fillLinearGradient(shape) {
        var grd = shape._getLinearGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    }
    _fillRadialGradient(shape) {
        var grd = shape._getRadialGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    }
    _fill(shape) {
        var hasColor = shape.fill(), fillPriority = shape.getFillPriority();
        if (hasColor && fillPriority === 'color') {
            this._fillColor(shape);
            return;
        }
        var hasPattern = shape.getFillPatternImage();
        if (hasPattern && fillPriority === 'pattern') {
            this._fillPattern(shape);
            return;
        }
        var hasLinearGradient = shape.getFillLinearGradientColorStops();
        if (hasLinearGradient && fillPriority === 'linear-gradient') {
            this._fillLinearGradient(shape);
            return;
        }
        var hasRadialGradient = shape.getFillRadialGradientColorStops();
        if (hasRadialGradient && fillPriority === 'radial-gradient') {
            this._fillRadialGradient(shape);
            return;
        }
        if (hasColor) {
            this._fillColor(shape);
        }
        else if (hasPattern) {
            this._fillPattern(shape);
        }
        else if (hasLinearGradient) {
            this._fillLinearGradient(shape);
        }
        else if (hasRadialGradient) {
            this._fillRadialGradient(shape);
        }
    }
    _strokeLinearGradient(shape) {
        var start = shape.getStrokeLinearGradientStartPoint(), end = shape.getStrokeLinearGradientEndPoint(), colorStops = shape.getStrokeLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
        if (colorStops) {
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            this.setAttr('strokeStyle', grd);
        }
    }
    _stroke(shape) {
        var dash = shape.dash(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
        if (shape.hasStroke()) {
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            if (dash && shape.dashEnabled()) {
                this.setLineDash(dash);
                this.setAttr('lineDashOffset', shape.dashOffset());
            }
            this.setAttr('lineWidth', shape.strokeWidth());
            if (!shape.getShadowForStrokeEnabled()) {
                this.setAttr('shadowColor', 'rgba(0,0,0,0)');
            }
            var hasLinearGradient = shape.getStrokeLinearGradientColorStops();
            if (hasLinearGradient) {
                this._strokeLinearGradient(shape);
            }
            else {
                this.setAttr('strokeStyle', shape.stroke());
            }
            shape._strokeFunc(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    }
    _applyShadow(shape) {
        var _a, _b, _c;
        var color = (_a = shape.getShadowRGBA()) !== null && _a !== void 0 ? _a : 'black', blur = (_b = shape.getShadowBlur()) !== null && _b !== void 0 ? _b : 5, offset = (_c = shape.getShadowOffset()) !== null && _c !== void 0 ? _c : {
            x: 0,
            y: 0,
        }, scale = shape.getAbsoluteScale(), ratio = this.canvas.getPixelRatio(), scaleX = scale.x * ratio, scaleY = scale.y * ratio;
        this.setAttr('shadowColor', color);
        this.setAttr('shadowBlur', blur * Math.min(Math.abs(scaleX), Math.abs(scaleY)));
        this.setAttr('shadowOffsetX', offset.x * scaleX);
        this.setAttr('shadowOffsetY', offset.y * scaleY);
    }
}
class HitContext extends Context {
    _fill(shape) {
        this.save();
        this.setAttr('fillStyle', shape.colorKey);
        shape._fillFuncHit(this);
        this.restore();
    }
    strokeShape(shape) {
        if (shape.hasHitStroke()) {
            this._stroke(shape);
        }
    }
    _stroke(shape) {
        if (shape.hasHitStroke()) {
            var strokeScaleEnabled = shape.getStrokeScaleEnabled();
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            var hitStrokeWidth = shape.hitStrokeWidth();
            var strokeWidth = hitStrokeWidth === 'auto' ? shape.strokeWidth() : hitStrokeWidth;
            this.setAttr('lineWidth', strokeWidth);
            this.setAttr('strokeStyle', shape.colorKey);
            shape._strokeFuncHit(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    }
}


/***/ }),

/***/ "./node_modules/konva/lib/DragAndDrop.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/DragAndDrop.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DD": () => (/* binding */ DD)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");


const DD = {
    get isDragging() {
        var flag = false;
        DD._dragElements.forEach((elem) => {
            if (elem.dragStatus === 'dragging') {
                flag = true;
            }
        });
        return flag;
    },
    justDragged: false,
    get node() {
        var node;
        DD._dragElements.forEach((elem) => {
            node = elem.node;
        });
        return node;
    },
    _dragElements: new Map(),
    _drag(evt) {
        const nodesToFireEvents = [];
        DD._dragElements.forEach((elem, key) => {
            const { node } = elem;
            const stage = node.getStage();
            stage.setPointersPositions(evt);
            if (elem.pointerId === undefined) {
                elem.pointerId = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._getFirstPointerId(evt);
            }
            const pos = stage._changedPointerPositions.find((pos) => pos.id === elem.pointerId);
            if (!pos) {
                return;
            }
            if (elem.dragStatus !== 'dragging') {
                var dragDistance = node.dragDistance();
                var distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
                if (distance < dragDistance) {
                    return;
                }
                node.startDrag({ evt });
                if (!node.isDragging()) {
                    return;
                }
            }
            node._setDragPosition(evt, elem);
            nodesToFireEvents.push(node);
        });
        nodesToFireEvents.forEach((node) => {
            node.fire('dragmove', {
                type: 'dragmove',
                target: node,
                evt: evt,
            }, true);
        });
    },
    _endDragBefore(evt) {
        DD._dragElements.forEach((elem) => {
            const { node } = elem;
            const stage = node.getStage();
            if (evt) {
                stage.setPointersPositions(evt);
            }
            const pos = stage._changedPointerPositions.find((pos) => pos.id === elem.pointerId);
            if (!pos) {
                return;
            }
            if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
                DD.justDragged = true;
                _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._mouseListenClick = false;
                _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._touchListenClick = false;
                _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._pointerListenClick = false;
                elem.dragStatus = 'stopped';
            }
            const drawNode = elem.node.getLayer() ||
                (elem.node instanceof _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.Stage && elem.node);
            if (drawNode) {
                drawNode.batchDraw();
            }
        });
    },
    _endDragAfter(evt) {
        DD._dragElements.forEach((elem, key) => {
            if (elem.dragStatus === 'stopped') {
                elem.node.fire('dragend', {
                    type: 'dragend',
                    target: elem.node,
                    evt: evt,
                }, true);
            }
            if (elem.dragStatus !== 'dragging') {
                DD._dragElements.delete(key);
            }
        });
    },
};
if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isBrowser) {
    window.addEventListener('mouseup', DD._endDragBefore, true);
    window.addEventListener('touchend', DD._endDragBefore, true);
    window.addEventListener('mousemove', DD._drag);
    window.addEventListener('touchmove', DD._drag);
    window.addEventListener('mouseup', DD._endDragAfter, false);
    window.addEventListener('touchend', DD._endDragAfter, false);
}


/***/ }),

/***/ "./node_modules/konva/lib/Factory.js":
/*!*******************************************!*\
  !*** ./node_modules/konva/lib/Factory.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Factory": () => (/* binding */ Factory)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Validators.js */ "./node_modules/konva/lib/Validators.js");


var GET = 'get', SET = 'set';
const Factory = {
    addGetterSetter(constructor, attr, def, validator, after) {
        Factory.addGetter(constructor, attr, def);
        Factory.addSetter(constructor, attr, validator, after);
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addGetter(constructor, attr, def) {
        var method = GET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        constructor.prototype[method] =
            constructor.prototype[method] ||
                function () {
                    var val = this.attrs[attr];
                    return val === undefined ? def : val;
                };
    },
    addSetter(constructor, attr, validator, after) {
        var method = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        if (!constructor.prototype[method]) {
            Factory.overWriteSetter(constructor, attr, validator, after);
        }
    },
    overWriteSetter(constructor, attr, validator, after) {
        var method = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        constructor.prototype[method] = function (val) {
            if (validator && val !== undefined && val !== null) {
                val = validator.call(this, val, attr);
            }
            this._setAttr(attr, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
    },
    addComponentsGetterSetter(constructor, attr, components, validator, after) {
        var len = components.length, capitalize = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize, getter = GET + capitalize(attr), setter = SET + capitalize(attr), n, component;
        constructor.prototype[getter] = function () {
            var ret = {};
            for (n = 0; n < len; n++) {
                component = components[n];
                ret[component] = this.getAttr(attr + capitalize(component));
            }
            return ret;
        };
        var basicValidator = (0,_Validators_js__WEBPACK_IMPORTED_MODULE_1__.getComponentValidator)(components);
        constructor.prototype[setter] = function (val) {
            var oldVal = this.attrs[attr], key;
            if (validator) {
                val = validator.call(this, val);
            }
            if (basicValidator) {
                basicValidator.call(this, val, attr);
            }
            for (key in val) {
                if (!val.hasOwnProperty(key)) {
                    continue;
                }
                this._setAttr(attr + capitalize(key), val[key]);
            }
            this._fireChangeEvent(attr, oldVal, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addOverloadedGetterSetter(constructor, attr) {
        var capitalizedAttr = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr), setter = SET + capitalizedAttr, getter = GET + capitalizedAttr;
        constructor.prototype[attr] = function () {
            if (arguments.length) {
                this[setter](arguments[0]);
                return this;
            }
            return this[getter]();
        };
    },
    addDeprecatedGetterSetter(constructor, attr, def, validator) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Adding deprecated ' + attr);
        var method = GET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        var message = attr +
            ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
        constructor.prototype[method] = function () {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error(message);
            var val = this.attrs[attr];
            return val === undefined ? def : val;
        };
        Factory.addSetter(constructor, attr, validator, function () {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error(message);
        });
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    backCompat(constructor, methods) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.each(methods, function (oldMethodName, newMethodName) {
            var method = constructor.prototype[newMethodName];
            var oldGetter = GET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(oldMethodName);
            var oldSetter = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(oldMethodName);
            function deprecated() {
                method.apply(this, arguments);
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('"' +
                    oldMethodName +
                    '" method is deprecated and will be removed soon. Use ""' +
                    newMethodName +
                    '" instead.');
            }
            constructor.prototype[oldMethodName] = deprecated;
            constructor.prototype[oldGetter] = deprecated;
            constructor.prototype[oldSetter] = deprecated;
        });
    },
    afterSetFilter() {
        this._filterUpToDate = false;
    },
};


/***/ }),

/***/ "./node_modules/konva/lib/FastLayer.js":
/*!*********************************************!*\
  !*** ./node_modules/konva/lib/FastLayer.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FastLayer": () => (/* binding */ FastLayer)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Layer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Layer.js */ "./node_modules/konva/lib/Layer.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");



class FastLayer extends _Layer_js__WEBPACK_IMPORTED_MODULE_1__.Layer {
    constructor(attrs) {
        super(attrs);
        this.listening(false);
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
    }
}
FastLayer.prototype.nodeType = 'FastLayer';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(FastLayer);


/***/ }),

/***/ "./node_modules/konva/lib/Global.js":
/*!******************************************!*\
  !*** ./node_modules/konva/lib/Global.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Konva": () => (/* binding */ Konva),
/* harmony export */   "_registerNode": () => (/* binding */ _registerNode),
/* harmony export */   "glob": () => (/* binding */ glob)
/* harmony export */ });
var PI_OVER_180 = Math.PI / 180;
function detectBrowser() {
    return (typeof window !== 'undefined' &&
        ({}.toString.call(window) === '[object Window]' ||
            {}.toString.call(window) === '[object global]'));
}
const glob = typeof global !== 'undefined'
    ? global
    : typeof window !== 'undefined'
        ? window
        : typeof WorkerGlobalScope !== 'undefined'
            ? self
            : {};
const Konva = {
    _global: glob,
    version: '8.3.8',
    isBrowser: detectBrowser(),
    isUnminified: /param/.test(function (param) { }.toString()),
    dblClickWindow: 400,
    getAngle(angle) {
        return Konva.angleDeg ? angle * PI_OVER_180 : angle;
    },
    enableTrace: false,
    pointerEventsEnabled: true,
    autoDrawEnabled: true,
    hitOnDragEnabled: false,
    capturePointerEventsEnabled: false,
    _mouseListenClick: false,
    _touchListenClick: false,
    _pointerListenClick: false,
    _mouseInDblClickWindow: false,
    _touchInDblClickWindow: false,
    _pointerInDblClickWindow: false,
    _mouseDblClickPointerId: null,
    _touchDblClickPointerId: null,
    _pointerDblClickPointerId: null,
    pixelRatio: (typeof window !== 'undefined' && window.devicePixelRatio) || 1,
    dragDistance: 3,
    angleDeg: true,
    showWarnings: true,
    dragButtons: [0, 1],
    isDragging() {
        return Konva['DD'].isDragging;
    },
    isDragReady() {
        return !!Konva['DD'].node;
    },
    document: glob.document,
    _injectGlobal(Konva) {
        glob.Konva = Konva;
    },
};
const _registerNode = (NodeClass) => {
    Konva[NodeClass.prototype.getClassName()] = NodeClass;
};
Konva._injectGlobal(Konva);


/***/ }),

/***/ "./node_modules/konva/lib/Group.js":
/*!*****************************************!*\
  !*** ./node_modules/konva/lib/Group.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Group": () => (/* binding */ Group)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Container.js */ "./node_modules/konva/lib/Container.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");



class Group extends _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container {
    _validateAdd(child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util["throw"]('You may only add groups and shapes to groups.');
        }
    }
}
Group.prototype.nodeType = 'Group';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(Group);


/***/ }),

/***/ "./node_modules/konva/lib/Layer.js":
/*!*****************************************!*\
  !*** ./node_modules/konva/lib/Layer.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Layer": () => (/* binding */ Layer)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Container.js */ "./node_modules/konva/lib/Container.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Canvas.js */ "./node_modules/konva/lib/Canvas.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");








var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw', INTERSECTION_OFFSETS = [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
class Layer extends _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container {
    constructor(config) {
        super(config);
        this.canvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.SceneCanvas();
        this.hitCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.HitCanvas({
            pixelRatio: 1,
        });
        this._waitingForDraw = false;
        this.on('visibleChange.konva', this._checkVisibility);
        this._checkVisibility();
        this.on('imageSmoothingEnabledChange.konva', this._setSmoothEnabled);
        this._setSmoothEnabled();
    }
    createPNGStream() {
        const c = this.canvas._canvas;
        return c.createPNGStream();
    }
    getCanvas() {
        return this.canvas;
    }
    getNativeCanvasElement() {
        return this.canvas._canvas;
    }
    getHitCanvas() {
        return this.hitCanvas;
    }
    getContext() {
        return this.getCanvas().getContext();
    }
    clear(bounds) {
        this.getContext().clear(bounds);
        this.getHitCanvas().getContext().clear(bounds);
        return this;
    }
    setZIndex(index) {
        super.setZIndex(index);
        var stage = this.getStage();
        if (stage && stage.content) {
            stage.content.removeChild(this.getNativeCanvasElement());
            if (index < stage.children.length - 1) {
                stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[index + 1].getCanvas()._canvas);
            }
            else {
                stage.content.appendChild(this.getNativeCanvasElement());
            }
        }
        return this;
    }
    moveToTop() {
        _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveToTop.call(this);
        var stage = this.getStage();
        if (stage && stage.content) {
            stage.content.removeChild(this.getNativeCanvasElement());
            stage.content.appendChild(this.getNativeCanvasElement());
        }
        return true;
    }
    moveUp() {
        var moved = _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveUp.call(this);
        if (!moved) {
            return false;
        }
        var stage = this.getStage();
        if (!stage || !stage.content) {
            return false;
        }
        stage.content.removeChild(this.getNativeCanvasElement());
        if (this.index < stage.children.length - 1) {
            stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[this.index + 1].getCanvas()._canvas);
        }
        else {
            stage.content.appendChild(this.getNativeCanvasElement());
        }
        return true;
    }
    moveDown() {
        if (_Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveDown.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                if (stage.content) {
                    stage.content.removeChild(this.getNativeCanvasElement());
                    stage.content.insertBefore(this.getNativeCanvasElement(), children[this.index + 1].getCanvas()._canvas);
                }
            }
            return true;
        }
        return false;
    }
    moveToBottom() {
        if (_Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.moveToBottom.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                if (stage.content) {
                    stage.content.removeChild(this.getNativeCanvasElement());
                    stage.content.insertBefore(this.getNativeCanvasElement(), children[1].getCanvas()._canvas);
                }
            }
            return true;
        }
        return false;
    }
    getLayer() {
        return this;
    }
    remove() {
        var _canvas = this.getNativeCanvasElement();
        _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.remove.call(this);
        if (_canvas && _canvas.parentNode && _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isInDocument(_canvas)) {
            _canvas.parentNode.removeChild(_canvas);
        }
        return this;
    }
    getStage() {
        return this.parent;
    }
    setSize({ width, height }) {
        this.canvas.setSize(width, height);
        this.hitCanvas.setSize(width, height);
        this._setSmoothEnabled();
        return this;
    }
    _validateAdd(child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util["throw"]('You may only add groups and shapes to a layer.');
        }
    }
    _toKonvaCanvas(config) {
        config = config || {};
        config.width = config.width || this.getWidth();
        config.height = config.height || this.getHeight();
        config.x = config.x !== undefined ? config.x : this.x();
        config.y = config.y !== undefined ? config.y : this.y();
        return _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype._toKonvaCanvas.call(this, config);
    }
    _checkVisibility() {
        const visible = this.visible();
        if (visible) {
            this.canvas._canvas.style.display = 'block';
        }
        else {
            this.canvas._canvas.style.display = 'none';
        }
    }
    _setSmoothEnabled() {
        this.getContext()._context.imageSmoothingEnabled =
            this.imageSmoothingEnabled();
    }
    getWidth() {
        if (this.parent) {
            return this.parent.width();
        }
    }
    setWidth() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
    }
    getHeight() {
        if (this.parent) {
            return this.parent.height();
        }
    }
    setHeight() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
    }
    batchDraw() {
        if (!this._waitingForDraw) {
            this._waitingForDraw = true;
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.requestAnimFrame(() => {
                this.draw();
                this._waitingForDraw = false;
            });
        }
        return this;
    }
    getIntersection(pos) {
        if (!this.isListening() || !this.isVisible()) {
            return null;
        }
        var spiralSearchDistance = 1;
        var continueSearch = false;
        while (true) {
            for (let i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                const intersectionOffset = INTERSECTION_OFFSETS[i];
                const obj = this._getIntersection({
                    x: pos.x + intersectionOffset.x * spiralSearchDistance,
                    y: pos.y + intersectionOffset.y * spiralSearchDistance,
                });
                const shape = obj.shape;
                if (shape) {
                    return shape;
                }
                continueSearch = !!obj.antialiased;
                if (!obj.antialiased) {
                    break;
                }
            }
            if (continueSearch) {
                spiralSearchDistance += 1;
            }
            else {
                return null;
            }
        }
    }
    _getIntersection(pos) {
        const ratio = this.hitCanvas.pixelRatio;
        const p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data;
        const p3 = p[3];
        if (p3 === 255) {
            const colorKey = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._rgbToHex(p[0], p[1], p[2]);
            const shape = _Shape_js__WEBPACK_IMPORTED_MODULE_6__.shapes[HASH + colorKey];
            if (shape) {
                return {
                    shape: shape,
                };
            }
            return {
                antialiased: true,
            };
        }
        else if (p3 > 0) {
            return {
                antialiased: true,
            };
        }
        return {};
    }
    drawScene(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
        this._fire(BEFORE_DRAW, {
            node: this,
        });
        if (this.clearBeforeDraw()) {
            canvas.getContext().clear();
        }
        _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container.prototype.drawScene.call(this, canvas, top);
        this._fire(DRAW, {
            node: this,
        });
        return this;
    }
    drawHit(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas);
        if (layer && layer.clearBeforeDraw()) {
            layer.getHitCanvas().getContext().clear();
        }
        _Container_js__WEBPACK_IMPORTED_MODULE_1__.Container.prototype.drawHit.call(this, canvas, top);
        return this;
    }
    enableHitGraph() {
        this.hitGraphEnabled(true);
        return this;
    }
    disableHitGraph() {
        this.hitGraphEnabled(false);
        return this;
    }
    setHitGraphEnabled(val) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        this.listening(val);
    }
    getHitGraphEnabled(val) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        return this.listening();
    }
    toggleHitCanvas() {
        if (!this.parent || !this.parent['content']) {
            return;
        }
        var parent = this.parent;
        var added = !!this.hitCanvas._canvas.parentNode;
        if (added) {
            parent.content.removeChild(this.hitCanvas._canvas);
        }
        else {
            parent.content.appendChild(this.hitCanvas._canvas);
        }
    }
}
Layer.prototype.nodeType = 'Layer';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_7__._registerNode)(Layer);
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Layer, 'imageSmoothingEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Layer, 'clearBeforeDraw', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_3__.Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/Node.js":
/*!****************************************!*\
  !*** ./node_modules/konva/lib/Node.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Node": () => (/* binding */ Node)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Canvas.js */ "./node_modules/konva/lib/Canvas.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DragAndDrop.js */ "./node_modules/konva/lib/DragAndDrop.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Validators.js */ "./node_modules/konva/lib/Validators.js");






var ABSOLUTE_OPACITY = 'absoluteOpacity', ALL_LISTENERS = 'allEventListeners', ABSOLUTE_TRANSFORM = 'absoluteTransform', ABSOLUTE_SCALE = 'absoluteScale', CANVAS = 'canvas', CHANGE = 'Change', CHILDREN = 'children', KONVA = 'konva', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'stage', TRANSFORM = 'transform', UPPER_STAGE = 'Stage', VISIBLE = 'visible', TRANSFORM_CHANGE_STR = [
    'xChange.konva',
    'yChange.konva',
    'scaleXChange.konva',
    'scaleYChange.konva',
    'skewXChange.konva',
    'skewYChange.konva',
    'rotationChange.konva',
    'offsetXChange.konva',
    'offsetYChange.konva',
    'transformsEnabledChange.konva',
].join(SPACE);
let idCounter = 1;
class Node {
    constructor(config) {
        this._id = idCounter++;
        this.eventListeners = {};
        this.attrs = {};
        this.index = 0;
        this._allEventListeners = null;
        this.parent = null;
        this._cache = new Map();
        this._attachedDepsListeners = new Map();
        this._lastPos = null;
        this._batchingTransformChange = false;
        this._needClearTransformCache = false;
        this._filterUpToDate = false;
        this._isUnderCache = false;
        this._dragEventId = null;
        this._shouldFireChangeEvents = false;
        this.setAttrs(config);
        this._shouldFireChangeEvents = true;
    }
    hasChildren() {
        return false;
    }
    _clearCache(attr) {
        if ((attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM) &&
            this._cache.get(attr)) {
            this._cache.get(attr).dirty = true;
        }
        else if (attr) {
            this._cache.delete(attr);
        }
        else {
            this._cache.clear();
        }
    }
    _getCache(attr, privateGetter) {
        var cache = this._cache.get(attr);
        var isTransform = attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM;
        var invalid = cache === undefined || (isTransform && cache.dirty === true);
        if (invalid) {
            cache = privateGetter.call(this);
            this._cache.set(attr, cache);
        }
        return cache;
    }
    _calculate(name, deps, getter) {
        if (!this._attachedDepsListeners.get(name)) {
            const depsString = deps.map((dep) => dep + 'Change.konva').join(SPACE);
            this.on(depsString, () => {
                this._clearCache(name);
            });
            this._attachedDepsListeners.set(name, true);
        }
        return this._getCache(name, getter);
    }
    _getCanvasCache() {
        return this._cache.get(CANVAS);
    }
    _clearSelfAndDescendantCache(attr) {
        this._clearCache(attr);
        if (attr === ABSOLUTE_TRANSFORM) {
            this.fire('absoluteTransformChange');
        }
    }
    clearCache() {
        this._cache.delete(CANVAS);
        this._clearSelfAndDescendantCache();
        this._requestDraw();
        return this;
    }
    cache(config) {
        var conf = config || {};
        var rect = {};
        if (conf.x === undefined ||
            conf.y === undefined ||
            conf.width === undefined ||
            conf.height === undefined) {
            rect = this.getClientRect({
                skipTransform: true,
                relativeTo: this.getParent(),
            });
        }
        var width = Math.ceil(conf.width || rect.width), height = Math.ceil(conf.height || rect.height), pixelRatio = conf.pixelRatio, x = conf.x === undefined ? Math.floor(rect.x) : conf.x, y = conf.y === undefined ? Math.floor(rect.y) : conf.y, offset = conf.offset || 0, drawBorder = conf.drawBorder || false, hitCanvasPixelRatio = conf.hitCanvasPixelRatio || 1;
        if (!width || !height) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Can not cache the node. Width or height of the node equals 0. Caching is skipped.');
            return;
        }
        width += offset * 2 + 1;
        height += offset * 2 + 1;
        x -= offset;
        y -= offset;
        var cachedSceneCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.SceneCanvas({
            pixelRatio: pixelRatio,
            width: width,
            height: height,
        }), cachedFilterCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.SceneCanvas({
            pixelRatio: pixelRatio,
            width: 0,
            height: 0,
        }), cachedHitCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.HitCanvas({
            pixelRatio: hitCanvasPixelRatio,
            width: width,
            height: height,
        }), sceneContext = cachedSceneCanvas.getContext(), hitContext = cachedHitCanvas.getContext();
        cachedHitCanvas.isCache = true;
        cachedSceneCanvas.isCache = true;
        this._cache.delete(CANVAS);
        this._filterUpToDate = false;
        if (conf.imageSmoothingEnabled === false) {
            cachedSceneCanvas.getContext()._context.imageSmoothingEnabled = false;
            cachedFilterCanvas.getContext()._context.imageSmoothingEnabled = false;
        }
        sceneContext.save();
        hitContext.save();
        sceneContext.translate(-x, -y);
        hitContext.translate(-x, -y);
        this._isUnderCache = true;
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this.drawScene(cachedSceneCanvas, this);
        this.drawHit(cachedHitCanvas, this);
        this._isUnderCache = false;
        sceneContext.restore();
        hitContext.restore();
        if (drawBorder) {
            sceneContext.save();
            sceneContext.beginPath();
            sceneContext.rect(0, 0, width, height);
            sceneContext.closePath();
            sceneContext.setAttr('strokeStyle', 'red');
            sceneContext.setAttr('lineWidth', 5);
            sceneContext.stroke();
            sceneContext.restore();
        }
        this._cache.set(CANVAS, {
            scene: cachedSceneCanvas,
            filter: cachedFilterCanvas,
            hit: cachedHitCanvas,
            x: x,
            y: y,
        });
        this._requestDraw();
        return this;
    }
    isCached() {
        return this._cache.has(CANVAS);
    }
    getClientRect(config) {
        throw new Error('abstract "getClientRect" method call');
    }
    _transformedRect(rect, top) {
        var points = [
            { x: rect.x, y: rect.y },
            { x: rect.x + rect.width, y: rect.y },
            { x: rect.x + rect.width, y: rect.y + rect.height },
            { x: rect.x, y: rect.y + rect.height },
        ];
        var minX, minY, maxX, maxY;
        var trans = this.getAbsoluteTransform(top);
        points.forEach(function (point) {
            var transformed = trans.point(point);
            if (minX === undefined) {
                minX = maxX = transformed.x;
                minY = maxY = transformed.y;
            }
            minX = Math.min(minX, transformed.x);
            minY = Math.min(minY, transformed.y);
            maxX = Math.max(maxX, transformed.x);
            maxY = Math.max(maxY, transformed.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    _drawCachedSceneCanvas(context) {
        context.save();
        context._applyOpacity(this);
        context._applyGlobalCompositeOperation(this);
        const canvasCache = this._getCanvasCache();
        context.translate(canvasCache.x, canvasCache.y);
        var cacheCanvas = this._getCachedSceneCanvas();
        var ratio = cacheCanvas.pixelRatio;
        context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
        context.restore();
    }
    _drawCachedHitCanvas(context) {
        var canvasCache = this._getCanvasCache(), hitCanvas = canvasCache.hit;
        context.save();
        context.translate(canvasCache.x, canvasCache.y);
        context.drawImage(hitCanvas._canvas, 0, 0, hitCanvas.width / hitCanvas.pixelRatio, hitCanvas.height / hitCanvas.pixelRatio);
        context.restore();
    }
    _getCachedSceneCanvas() {
        var filters = this.filters(), cachedCanvas = this._getCanvasCache(), sceneCanvas = cachedCanvas.scene, filterCanvas = cachedCanvas.filter, filterContext = filterCanvas.getContext(), len, imageData, n, filter;
        if (filters) {
            if (!this._filterUpToDate) {
                var ratio = sceneCanvas.pixelRatio;
                filterCanvas.setSize(sceneCanvas.width / sceneCanvas.pixelRatio, sceneCanvas.height / sceneCanvas.pixelRatio);
                try {
                    len = filters.length;
                    filterContext.clear();
                    filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
                    imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                    for (n = 0; n < len; n++) {
                        filter = filters[n];
                        if (typeof filter !== 'function') {
                            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Filter should be type of function, but got ' +
                                typeof filter +
                                ' instead. Please check correct filters');
                            continue;
                        }
                        filter.call(this, imageData);
                        filterContext.putImageData(imageData, 0, 0);
                    }
                }
                catch (e) {
                    _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Unable to apply filter. ' +
                        e.message +
                        ' This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                }
                this._filterUpToDate = true;
            }
            return filterCanvas;
        }
        return sceneCanvas;
    }
    on(evtStr, handler) {
        this._cache && this._cache.delete(ALL_LISTENERS);
        if (arguments.length === 3) {
            return this._delegate.apply(this, arguments);
        }
        var events = evtStr.split(SPACE), len = events.length, n, event, parts, baseEvent, name;
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1] || '';
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler,
            });
        }
        return this;
    }
    off(evtStr, callback) {
        var events = (evtStr || '').split(SPACE), len = events.length, n, t, event, parts, baseEvent, name;
        this._cache && this._cache.delete(ALL_LISTENERS);
        if (!evtStr) {
            for (t in this.eventListeners) {
                this._off(t);
            }
        }
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1];
            if (baseEvent) {
                if (this.eventListeners[baseEvent]) {
                    this._off(baseEvent, name, callback);
                }
            }
            else {
                for (t in this.eventListeners) {
                    this._off(t, name, callback);
                }
            }
        }
        return this;
    }
    dispatchEvent(evt) {
        var e = {
            target: this,
            type: evt.type,
            evt: evt,
        };
        this.fire(evt.type, e);
        return this;
    }
    addEventListener(type, handler) {
        this.on(type, function (evt) {
            handler.call(this, evt.evt);
        });
        return this;
    }
    removeEventListener(type) {
        this.off(type);
        return this;
    }
    _delegate(event, selector, handler) {
        var stopNode = this;
        this.on(event, function (evt) {
            var targets = evt.target.findAncestors(selector, true, stopNode);
            for (var i = 0; i < targets.length; i++) {
                evt = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.cloneObject(evt);
                evt.currentTarget = targets[i];
                handler.call(targets[i], evt);
            }
        });
    }
    remove() {
        if (this.isDragging()) {
            this.stopDrag();
        }
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements["delete"](this._id);
        this._remove();
        return this;
    }
    _clearCaches() {
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this._clearSelfAndDescendantCache(STAGE);
        this._clearSelfAndDescendantCache(VISIBLE);
        this._clearSelfAndDescendantCache(LISTENING);
    }
    _remove() {
        this._clearCaches();
        var parent = this.getParent();
        if (parent && parent.children) {
            parent.children.splice(this.index, 1);
            parent._setChildrenIndices();
            this.parent = null;
        }
    }
    destroy() {
        this.remove();
        return this;
    }
    getAttr(attr) {
        var method = 'get' + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr);
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isFunction(this[method])) {
            return this[method]();
        }
        return this.attrs[attr];
    }
    getAncestors() {
        var parent = this.getParent(), ancestors = [];
        while (parent) {
            ancestors.push(parent);
            parent = parent.getParent();
        }
        return ancestors;
    }
    getAttrs() {
        return this.attrs || {};
    }
    setAttrs(config) {
        this._batchTransformChanges(() => {
            var key, method;
            if (!config) {
                return this;
            }
            for (key in config) {
                if (key === CHILDREN) {
                    continue;
                }
                method = SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(key);
                if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isFunction(this[method])) {
                    this[method](config[key]);
                }
                else {
                    this._setAttr(key, config[key]);
                }
            }
        });
        return this;
    }
    isListening() {
        return this._getCache(LISTENING, this._isListening);
    }
    _isListening(relativeTo) {
        const listening = this.listening();
        if (!listening) {
            return false;
        }
        const parent = this.getParent();
        if (parent && parent !== relativeTo && this !== relativeTo) {
            return parent._isListening(relativeTo);
        }
        else {
            return true;
        }
    }
    isVisible() {
        return this._getCache(VISIBLE, this._isVisible);
    }
    _isVisible(relativeTo) {
        const visible = this.visible();
        if (!visible) {
            return false;
        }
        const parent = this.getParent();
        if (parent && parent !== relativeTo && this !== relativeTo) {
            return parent._isVisible(relativeTo);
        }
        else {
            return true;
        }
    }
    shouldDrawHit(top, skipDragCheck = false) {
        if (top) {
            return this._isVisible(top) && this._isListening(top);
        }
        var layer = this.getLayer();
        var layerUnderDrag = false;
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.forEach((elem) => {
            if (elem.dragStatus !== 'dragging') {
                return;
            }
            else if (elem.node.nodeType === 'Stage') {
                layerUnderDrag = true;
            }
            else if (elem.node.getLayer() === layer) {
                layerUnderDrag = true;
            }
        });
        var dragSkip = !skipDragCheck && !_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.hitOnDragEnabled && layerUnderDrag;
        return this.isListening() && this.isVisible() && !dragSkip;
    }
    show() {
        this.visible(true);
        return this;
    }
    hide() {
        this.visible(false);
        return this;
    }
    getZIndex() {
        return this.index || 0;
    }
    getAbsoluteZIndex() {
        var depth = this.getDepth(), that = this, index = 0, nodes, len, n, child;
        function addChildren(children) {
            nodes = [];
            len = children.length;
            for (n = 0; n < len; n++) {
                child = children[n];
                index++;
                if (child.nodeType !== SHAPE) {
                    nodes = nodes.concat(child.getChildren().slice());
                }
                if (child._id === that._id) {
                    n = len;
                }
            }
            if (nodes.length > 0 && nodes[0].getDepth() <= depth) {
                addChildren(nodes);
            }
        }
        if (that.nodeType !== UPPER_STAGE) {
            addChildren(that.getStage().getChildren());
        }
        return index;
    }
    getDepth() {
        var depth = 0, parent = this.parent;
        while (parent) {
            depth++;
            parent = parent.parent;
        }
        return depth;
    }
    _batchTransformChanges(func) {
        this._batchingTransformChange = true;
        func();
        this._batchingTransformChange = false;
        if (this._needClearTransformCache) {
            this._clearCache(TRANSFORM);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        }
        this._needClearTransformCache = false;
    }
    setPosition(pos) {
        this._batchTransformChanges(() => {
            this.x(pos.x);
            this.y(pos.y);
        });
        return this;
    }
    getPosition() {
        return {
            x: this.x(),
            y: this.y(),
        };
    }
    getRelativePointerPosition() {
        if (!this.getStage()) {
            return null;
        }
        var pos = this.getStage().getPointerPosition();
        if (!pos) {
            return null;
        }
        var transform = this.getAbsoluteTransform().copy();
        transform.invert();
        return transform.point(pos);
    }
    getAbsolutePosition(top) {
        let haveCachedParent = false;
        let parent = this.parent;
        while (parent) {
            if (parent.isCached()) {
                haveCachedParent = true;
                break;
            }
            parent = parent.parent;
        }
        if (haveCachedParent && !top) {
            top = true;
        }
        var absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform(), offset = this.offset();
        absoluteTransform.m = absoluteMatrix.slice();
        absoluteTransform.translate(offset.x, offset.y);
        return absoluteTransform.getTranslation();
    }
    setAbsolutePosition(pos) {
        var origTrans = this._clearTransform();
        this.attrs.x = origTrans.x;
        this.attrs.y = origTrans.y;
        delete origTrans.x;
        delete origTrans.y;
        this._clearCache(TRANSFORM);
        var it = this._getAbsoluteTransform().copy();
        it.invert();
        it.translate(pos.x, pos.y);
        pos = {
            x: this.attrs.x + it.getTranslation().x,
            y: this.attrs.y + it.getTranslation().y,
        };
        this._setTransform(origTrans);
        this.setPosition({ x: pos.x, y: pos.y });
        this._clearCache(TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        return this;
    }
    _setTransform(trans) {
        var key;
        for (key in trans) {
            this.attrs[key] = trans[key];
        }
    }
    _clearTransform() {
        var trans = {
            x: this.x(),
            y: this.y(),
            rotation: this.rotation(),
            scaleX: this.scaleX(),
            scaleY: this.scaleY(),
            offsetX: this.offsetX(),
            offsetY: this.offsetY(),
            skewX: this.skewX(),
            skewY: this.skewY(),
        };
        this.attrs.x = 0;
        this.attrs.y = 0;
        this.attrs.rotation = 0;
        this.attrs.scaleX = 1;
        this.attrs.scaleY = 1;
        this.attrs.offsetX = 0;
        this.attrs.offsetY = 0;
        this.attrs.skewX = 0;
        this.attrs.skewY = 0;
        return trans;
    }
    move(change) {
        var changeX = change.x, changeY = change.y, x = this.x(), y = this.y();
        if (changeX !== undefined) {
            x += changeX;
        }
        if (changeY !== undefined) {
            y += changeY;
        }
        this.setPosition({ x: x, y: y });
        return this;
    }
    _eachAncestorReverse(func, top) {
        var family = [], parent = this.getParent(), len, n;
        if (top && top._id === this._id) {
            return;
        }
        family.unshift(this);
        while (parent && (!top || parent._id !== top._id)) {
            family.unshift(parent);
            parent = parent.parent;
        }
        len = family.length;
        for (n = 0; n < len; n++) {
            func(family[n]);
        }
    }
    rotate(theta) {
        this.rotation(this.rotation() + theta);
        return this;
    }
    moveToTop() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveToTop function is ignored.');
            return false;
        }
        var index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    moveUp() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveUp function is ignored.');
            return false;
        }
        var index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index + 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    moveDown() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveDown function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    moveToBottom() {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. moveToBottom function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.unshift(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    setZIndex(zIndex) {
        if (!this.parent) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Node has no parent. zIndex parameter is ignored.');
            return this;
        }
        if (zIndex < 0 || zIndex >= this.parent.children.length) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Unexpected value ' +
                zIndex +
                ' for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to ' +
                (this.parent.children.length - 1) +
                '.');
        }
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent._setChildrenIndices();
        return this;
    }
    getAbsoluteOpacity() {
        return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
    }
    _getAbsoluteOpacity() {
        var absOpacity = this.opacity();
        var parent = this.getParent();
        if (parent && !parent._isUnderCache) {
            absOpacity *= parent.getAbsoluteOpacity();
        }
        return absOpacity;
    }
    moveTo(newContainer) {
        if (this.getParent() !== newContainer) {
            this._remove();
            newContainer.add(this);
        }
        return this;
    }
    toObject() {
        var obj = {}, attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
        obj.attrs = {};
        for (key in attrs) {
            val = attrs[key];
            nonPlainObject =
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.isObject(val) && !_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isPlainObject(val) && !_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(val);
            if (nonPlainObject) {
                continue;
            }
            getter = typeof this[key] === 'function' && this[key];
            delete attrs[key];
            defaultValue = getter ? getter.call(this) : null;
            attrs[key] = val;
            if (defaultValue !== val) {
                obj.attrs[key] = val;
            }
        }
        obj.className = this.getClassName();
        return _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._prepareToStringify(obj);
    }
    toJSON() {
        return JSON.stringify(this.toObject());
    }
    getParent() {
        return this.parent;
    }
    findAncestors(selector, includeSelf, stopNode) {
        var res = [];
        if (includeSelf && this._isMatch(selector)) {
            res.push(this);
        }
        var ancestor = this.parent;
        while (ancestor) {
            if (ancestor === stopNode) {
                return res;
            }
            if (ancestor._isMatch(selector)) {
                res.push(ancestor);
            }
            ancestor = ancestor.parent;
        }
        return res;
    }
    isAncestorOf(node) {
        return false;
    }
    findAncestor(selector, includeSelf, stopNode) {
        return this.findAncestors(selector, includeSelf, stopNode)[0];
    }
    _isMatch(selector) {
        if (!selector) {
            return false;
        }
        if (typeof selector === 'function') {
            return selector(this);
        }
        var selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, sel;
        for (n = 0; n < len; n++) {
            sel = selectorArr[n];
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.isValidSelector(sel)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Selector "' +
                    sel +
                    '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Konva is awesome, right?');
            }
            if (sel.charAt(0) === '#') {
                if (this.id() === sel.slice(1)) {
                    return true;
                }
            }
            else if (sel.charAt(0) === '.') {
                if (this.hasName(sel.slice(1))) {
                    return true;
                }
            }
            else if (this.className === sel || this.nodeType === sel) {
                return true;
            }
        }
        return false;
    }
    getLayer() {
        var parent = this.getParent();
        return parent ? parent.getLayer() : null;
    }
    getStage() {
        return this._getCache(STAGE, this._getStage);
    }
    _getStage() {
        var parent = this.getParent();
        if (parent) {
            return parent.getStage();
        }
        else {
            return undefined;
        }
    }
    fire(eventType, evt = {}, bubble) {
        evt.target = evt.target || this;
        if (bubble) {
            this._fireAndBubble(eventType, evt);
        }
        else {
            this._fire(eventType, evt);
        }
        return this;
    }
    getAbsoluteTransform(top) {
        if (top) {
            return this._getAbsoluteTransform(top);
        }
        else {
            return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
        }
    }
    _getAbsoluteTransform(top) {
        var at;
        if (top) {
            at = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
            this._eachAncestorReverse(function (node) {
                var transformsEnabled = node.transformsEnabled();
                if (transformsEnabled === 'all') {
                    at.multiply(node.getTransform());
                }
                else if (transformsEnabled === 'position') {
                    at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
                }
            }, top);
            return at;
        }
        else {
            at = this._cache.get(ABSOLUTE_TRANSFORM) || new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
            if (this.parent) {
                this.parent.getAbsoluteTransform().copyInto(at);
            }
            else {
                at.reset();
            }
            var transformsEnabled = this.transformsEnabled();
            if (transformsEnabled === 'all') {
                at.multiply(this.getTransform());
            }
            else if (transformsEnabled === 'position') {
                const x = this.attrs.x || 0;
                const y = this.attrs.y || 0;
                const offsetX = this.attrs.offsetX || 0;
                const offsetY = this.attrs.offsetY || 0;
                at.translate(x - offsetX, y - offsetY);
            }
            at.dirty = false;
            return at;
        }
    }
    getAbsoluteScale(top) {
        var parent = this;
        while (parent) {
            if (parent._isUnderCache) {
                top = parent;
            }
            parent = parent.getParent();
        }
        const transform = this.getAbsoluteTransform(top);
        const attrs = transform.decompose();
        return {
            x: attrs.scaleX,
            y: attrs.scaleY,
        };
    }
    getAbsoluteRotation() {
        return this.getAbsoluteTransform().decompose().rotation;
    }
    getTransform() {
        return this._getCache(TRANSFORM, this._getTransform);
    }
    _getTransform() {
        var _a, _b;
        var m = this._cache.get(TRANSFORM) || new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
        m.reset();
        var x = this.x(), y = this.y(), rotation = _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.getAngle(this.rotation()), scaleX = (_a = this.attrs.scaleX) !== null && _a !== void 0 ? _a : 1, scaleY = (_b = this.attrs.scaleY) !== null && _b !== void 0 ? _b : 1, skewX = this.attrs.skewX || 0, skewY = this.attrs.skewY || 0, offsetX = this.attrs.offsetX || 0, offsetY = this.attrs.offsetY || 0;
        if (x !== 0 || y !== 0) {
            m.translate(x, y);
        }
        if (rotation !== 0) {
            m.rotate(rotation);
        }
        if (skewX !== 0 || skewY !== 0) {
            m.skew(skewX, skewY);
        }
        if (scaleX !== 1 || scaleY !== 1) {
            m.scale(scaleX, scaleY);
        }
        if (offsetX !== 0 || offsetY !== 0) {
            m.translate(-1 * offsetX, -1 * offsetY);
        }
        m.dirty = false;
        return m;
    }
    clone(obj) {
        var attrs = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
        for (key in obj) {
            attrs[key] = obj[key];
        }
        var node = new this.constructor(attrs);
        for (key in this.eventListeners) {
            allListeners = this.eventListeners[key];
            len = allListeners.length;
            for (n = 0; n < len; n++) {
                listener = allListeners[n];
                if (listener.name.indexOf(KONVA) < 0) {
                    if (!node.eventListeners[key]) {
                        node.eventListeners[key] = [];
                    }
                    node.eventListeners[key].push(listener);
                }
            }
        }
        return node;
    }
    _toKonvaCanvas(config) {
        config = config || {};
        var box = this.getClientRect();
        var stage = this.getStage(), x = config.x !== undefined ? config.x : Math.floor(box.x), y = config.y !== undefined ? config.y : Math.floor(box.y), pixelRatio = config.pixelRatio || 1, canvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_2__.SceneCanvas({
            width: config.width || Math.ceil(box.width) || (stage ? stage.width() : 0),
            height: config.height ||
                Math.ceil(box.height) ||
                (stage ? stage.height() : 0),
            pixelRatio: pixelRatio,
        }), context = canvas.getContext();
        if (config.imageSmoothingEnabled === false) {
            context._context.imageSmoothingEnabled = false;
        }
        context.save();
        if (x || y) {
            context.translate(-1 * x, -1 * y);
        }
        this.drawScene(canvas);
        context.restore();
        return canvas;
    }
    toCanvas(config) {
        return this._toKonvaCanvas(config)._canvas;
    }
    toDataURL(config) {
        config = config || {};
        var mimeType = config.mimeType || null, quality = config.quality || null;
        var url = this._toKonvaCanvas(config).toDataURL(mimeType, quality);
        if (config.callback) {
            config.callback(url);
        }
        return url;
    }
    toImage(config) {
        if (!config || !config.callback) {
            throw 'callback required for toImage method config argument';
        }
        var callback = config.callback;
        delete config.callback;
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._urlToImage(this.toDataURL(config), function (img) {
            callback(img);
        });
    }
    setSize(size) {
        this.width(size.width);
        this.height(size.height);
        return this;
    }
    getSize() {
        return {
            width: this.width(),
            height: this.height(),
        };
    }
    getClassName() {
        return this.className || this.nodeType;
    }
    getType() {
        return this.nodeType;
    }
    getDragDistance() {
        if (this.attrs.dragDistance !== undefined) {
            return this.attrs.dragDistance;
        }
        else if (this.parent) {
            return this.parent.getDragDistance();
        }
        else {
            return _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.dragDistance;
        }
    }
    _off(type, name, callback) {
        var evtListeners = this.eventListeners[type], i, evtName, handler;
        for (i = 0; i < evtListeners.length; i++) {
            evtName = evtListeners[i].name;
            handler = evtListeners[i].handler;
            if ((evtName !== 'konva' || name === 'konva') &&
                (!name || evtName === name) &&
                (!callback || callback === handler)) {
                evtListeners.splice(i, 1);
                if (evtListeners.length === 0) {
                    delete this.eventListeners[type];
                    break;
                }
                i--;
            }
        }
    }
    _fireChangeEvent(attr, oldVal, newVal) {
        this._fire(attr + CHANGE, {
            oldVal: oldVal,
            newVal: newVal,
        });
    }
    addName(name) {
        if (!this.hasName(name)) {
            var oldName = this.name();
            var newName = oldName ? oldName + ' ' + name : name;
            this.name(newName);
        }
        return this;
    }
    hasName(name) {
        if (!name) {
            return false;
        }
        const fullName = this.name();
        if (!fullName) {
            return false;
        }
        var names = (fullName || '').split(/\s/g);
        return names.indexOf(name) !== -1;
    }
    removeName(name) {
        var names = (this.name() || '').split(/\s/g);
        var index = names.indexOf(name);
        if (index !== -1) {
            names.splice(index, 1);
            this.name(names.join(' '));
        }
        return this;
    }
    setAttr(attr, val) {
        var func = this[SET + _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._capitalize(attr)];
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isFunction(func)) {
            func.call(this, val);
        }
        else {
            this._setAttr(attr, val);
        }
        return this;
    }
    _requestDraw() {
        if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.autoDrawEnabled) {
            const drawNode = this.getLayer() || this.getStage();
            drawNode === null || drawNode === void 0 ? void 0 : drawNode.batchDraw();
        }
    }
    _setAttr(key, val) {
        var oldVal = this.attrs[key];
        if (oldVal === val && !_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.isObject(val)) {
            return;
        }
        if (val === undefined || val === null) {
            delete this.attrs[key];
        }
        else {
            this.attrs[key] = val;
        }
        if (this._shouldFireChangeEvents) {
            this._fireChangeEvent(key, oldVal, val);
        }
        this._requestDraw();
    }
    _setComponentAttr(key, component, val) {
        var oldVal;
        if (val !== undefined) {
            oldVal = this.attrs[key];
            if (!oldVal) {
                this.attrs[key] = this.getAttr(key);
            }
            this.attrs[key][component] = val;
            this._fireChangeEvent(key, oldVal, val);
        }
    }
    _fireAndBubble(eventType, evt, compareShape) {
        if (evt && this.nodeType === SHAPE) {
            evt.target = this;
        }
        var shouldStop = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
            ((compareShape &&
                (this === compareShape ||
                    (this.isAncestorOf && this.isAncestorOf(compareShape)))) ||
                (this.nodeType === 'Stage' && !compareShape));
        if (!shouldStop) {
            this._fire(eventType, evt);
            var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
                compareShape &&
                compareShape.isAncestorOf &&
                compareShape.isAncestorOf(this) &&
                !compareShape.isAncestorOf(this.parent);
            if (((evt && !evt.cancelBubble) || !evt) &&
                this.parent &&
                this.parent.isListening() &&
                !stopBubble) {
                if (compareShape && compareShape.parent) {
                    this._fireAndBubble.call(this.parent, eventType, evt, compareShape);
                }
                else {
                    this._fireAndBubble.call(this.parent, eventType, evt);
                }
            }
        }
    }
    _getProtoListeners(eventType) {
        let listeners = this._cache.get(ALL_LISTENERS);
        if (!listeners) {
            listeners = {};
            let obj = Object.getPrototypeOf(this);
            while (obj) {
                if (!obj.eventListeners) {
                    obj = Object.getPrototypeOf(obj);
                    continue;
                }
                for (var event in obj.eventListeners) {
                    const newEvents = obj.eventListeners[event];
                    const oldEvents = listeners[event] || [];
                    listeners[event] = newEvents.concat(oldEvents);
                }
                obj = Object.getPrototypeOf(obj);
            }
            this._cache.set(ALL_LISTENERS, listeners);
        }
        return listeners[eventType];
    }
    _fire(eventType, evt) {
        evt = evt || {};
        evt.currentTarget = this;
        evt.type = eventType;
        const topListeners = this._getProtoListeners(eventType);
        if (topListeners) {
            for (var i = 0; i < topListeners.length; i++) {
                topListeners[i].handler.call(this, evt);
            }
        }
        const selfListeners = this.eventListeners[eventType];
        if (selfListeners) {
            for (var i = 0; i < selfListeners.length; i++) {
                selfListeners[i].handler.call(this, evt);
            }
        }
    }
    draw() {
        this.drawScene();
        this.drawHit();
        return this;
    }
    _createDragElement(evt) {
        var pointerId = evt ? evt.pointerId : undefined;
        var stage = this.getStage();
        var ap = this.getAbsolutePosition();
        var pos = stage._getPointerById(pointerId) ||
            stage._changedPointerPositions[0] ||
            ap;
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.set(this._id, {
            node: this,
            startPointerPos: pos,
            offset: {
                x: pos.x - ap.x,
                y: pos.y - ap.y,
            },
            dragStatus: 'ready',
            pointerId,
        });
    }
    startDrag(evt, bubbleEvent = true) {
        if (!_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.has(this._id)) {
            this._createDragElement(evt);
        }
        const elem = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
        elem.dragStatus = 'dragging';
        this.fire('dragstart', {
            type: 'dragstart',
            target: this,
            evt: evt && evt.evt,
        }, bubbleEvent);
    }
    _setDragPosition(evt, elem) {
        const pos = this.getStage()._getPointerById(elem.pointerId);
        if (!pos) {
            return;
        }
        var newNodePos = {
            x: pos.x - elem.offset.x,
            y: pos.y - elem.offset.y,
        };
        var dbf = this.dragBoundFunc();
        if (dbf !== undefined) {
            const bounded = dbf.call(this, newNodePos, evt);
            if (!bounded) {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.');
            }
            else {
                newNodePos = bounded;
            }
        }
        if (!this._lastPos ||
            this._lastPos.x !== newNodePos.x ||
            this._lastPos.y !== newNodePos.y) {
            this.setAbsolutePosition(newNodePos);
            this._requestDraw();
        }
        this._lastPos = newNodePos;
    }
    stopDrag(evt) {
        const elem = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
        if (elem) {
            elem.dragStatus = 'stopped';
        }
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._endDragBefore(evt);
        _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._endDragAfter(evt);
    }
    setDraggable(draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    }
    isDragging() {
        const elem = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
        return elem ? elem.dragStatus === 'dragging' : false;
    }
    _listenDrag() {
        this._dragCleanup();
        this.on('mousedown.konva touchstart.konva', function (evt) {
            var shouldCheckButton = evt.evt['button'] !== undefined;
            var canDrag = !shouldCheckButton || _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.dragButtons.indexOf(evt.evt['button']) >= 0;
            if (!canDrag) {
                return;
            }
            if (this.isDragging()) {
                return;
            }
            var hasDraggingChild = false;
            _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.forEach((elem) => {
                if (this.isAncestorOf(elem.node)) {
                    hasDraggingChild = true;
                }
            });
            if (!hasDraggingChild) {
                this._createDragElement(evt);
            }
        });
    }
    _dragChange() {
        if (this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            this._dragCleanup();
            var stage = this.getStage();
            if (!stage) {
                return;
            }
            const dragElement = _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements.get(this._id);
            const isDragging = dragElement && dragElement.dragStatus === 'dragging';
            const isReady = dragElement && dragElement.dragStatus === 'ready';
            if (isDragging) {
                this.stopDrag();
            }
            else if (isReady) {
                _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_4__.DD._dragElements["delete"](this._id);
            }
        }
    }
    _dragCleanup() {
        this.off('mousedown.konva');
        this.off('touchstart.konva');
    }
    isClientRectOnScreen(margin = { x: 0, y: 0 }) {
        const stage = this.getStage();
        if (!stage) {
            return false;
        }
        const screenRect = {
            x: -margin.x,
            y: -margin.y,
            width: stage.width() + 2 * margin.x,
            height: stage.height() + 2 * margin.y,
        };
        return _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.haveIntersection(screenRect, this.getClientRect());
    }
    static create(data, container) {
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isString(data)) {
            data = JSON.parse(data);
        }
        return this._createNode(data, container);
    }
    static _createNode(obj, container) {
        var className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
        if (container) {
            obj.attrs.container = container;
        }
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva[className]) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Can not find a node with class name "' +
                className +
                '". Fallback to "Shape".');
            className = 'Shape';
        }
        const Class = _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva[className];
        no = new Class(obj.attrs);
        if (children) {
            len = children.length;
            for (n = 0; n < len; n++) {
                no.add(Node._createNode(children[n]));
            }
        }
        return no;
    }
}
Node.prototype.nodeType = 'Node';
Node.prototype._attrsAffectingSize = [];
Node.prototype.eventListeners = {};
Node.prototype.on.call(Node.prototype, TRANSFORM_CHANGE_STR, function () {
    if (this._batchingTransformChange) {
        this._needClearTransformCache = true;
        return;
    }
    this._clearCache(TRANSFORM);
    this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
});
Node.prototype.on.call(Node.prototype, 'visibleChange.konva', function () {
    this._clearSelfAndDescendantCache(VISIBLE);
});
Node.prototype.on.call(Node.prototype, 'listeningChange.konva', function () {
    this._clearSelfAndDescendantCache(LISTENING);
});
Node.prototype.on.call(Node.prototype, 'opacityChange.konva', function () {
    this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
});
const addGetterSetter = _Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter;
addGetterSetter(Node, 'zIndex');
addGetterSetter(Node, 'absolutePosition');
addGetterSetter(Node, 'position');
addGetterSetter(Node, 'x', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'y', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'globalCompositeOperation', 'source-over', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'opacity', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'name', '', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'id', '', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'rotation', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Node, 'scale', ['x', 'y']);
addGetterSetter(Node, 'scaleX', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'scaleY', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Node, 'skew', ['x', 'y']);
addGetterSetter(Node, 'skewX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'skewY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Node, 'offset', ['x', 'y']);
addGetterSetter(Node, 'offsetX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'offsetY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'dragDistance', null, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'width', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'height', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
addGetterSetter(Node, 'listening', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
addGetterSetter(Node, 'preventDefault', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
addGetterSetter(Node, 'filters', null, function (val) {
    this._filterUpToDate = false;
    return val;
});
addGetterSetter(Node, 'visible', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
addGetterSetter(Node, 'transformsEnabled', 'all', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getStringValidator)());
addGetterSetter(Node, 'size');
addGetterSetter(Node, 'dragBoundFunc');
addGetterSetter(Node, 'draggable', false, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.backCompat(Node, {
    rotateDeg: 'rotate',
    setRotationDeg: 'setRotation',
    getRotationDeg: 'getRotation',
});


/***/ }),

/***/ "./node_modules/konva/lib/PointerEvents.js":
/*!*************************************************!*\
  !*** ./node_modules/konva/lib/PointerEvents.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createEvent": () => (/* binding */ createEvent),
/* harmony export */   "getCapturedShape": () => (/* binding */ getCapturedShape),
/* harmony export */   "hasPointerCapture": () => (/* binding */ hasPointerCapture),
/* harmony export */   "releaseCapture": () => (/* binding */ releaseCapture),
/* harmony export */   "setPointerCapture": () => (/* binding */ setPointerCapture)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");

const Captures = new Map();
const SUPPORT_POINTER_EVENTS = _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva._global.PointerEvent !== undefined;
function getCapturedShape(pointerId) {
    return Captures.get(pointerId);
}
function createEvent(evt) {
    return {
        evt,
        pointerId: evt.pointerId,
    };
}
function hasPointerCapture(pointerId, shape) {
    return Captures.get(pointerId) === shape;
}
function setPointerCapture(pointerId, shape) {
    releaseCapture(pointerId);
    const stage = shape.getStage();
    if (!stage)
        return;
    Captures.set(pointerId, shape);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
    }
}
function releaseCapture(pointerId, target) {
    const shape = Captures.get(pointerId);
    if (!shape)
        return;
    const stage = shape.getStage();
    if (stage && stage.content) {
    }
    Captures.delete(pointerId);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
    }
}


/***/ }),

/***/ "./node_modules/konva/lib/Shape.js":
/*!*****************************************!*\
  !*** ./node_modules/konva/lib/Shape.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Shape": () => (/* binding */ Shape),
/* harmony export */   "shapes": () => (/* binding */ shapes)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PointerEvents.js */ "./node_modules/konva/lib/PointerEvents.js");







var HAS_SHADOW = 'hasShadow';
var SHADOW_RGBA = 'shadowRGBA';
var patternImage = 'patternImage';
var linearGradient = 'linearGradient';
var radialGradient = 'radialGradient';
let dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.createCanvasElement().getContext('2d');
    return dummyContext;
}
const shapes = {};
function _fillFunc(context) {
    context.fill();
}
function _strokeFunc(context) {
    context.stroke();
}
function _fillFuncHit(context) {
    context.fill();
}
function _strokeFuncHit(context) {
    context.stroke();
}
function _clearHasShadowCache() {
    this._clearCache(HAS_SHADOW);
}
function _clearGetShadowRGBACache() {
    this._clearCache(SHADOW_RGBA);
}
function _clearFillPatternCache() {
    this._clearCache(patternImage);
}
function _clearLinearGradientCache() {
    this._clearCache(linearGradient);
}
function _clearRadialGradientCache() {
    this._clearCache(radialGradient);
}
class Shape extends _Node_js__WEBPACK_IMPORTED_MODULE_3__.Node {
    constructor(config) {
        super(config);
        let key;
        while (true) {
            key = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.getRandomColor();
            if (key && !(key in shapes)) {
                break;
            }
        }
        this.colorKey = key;
        shapes[key] = this;
    }
    getContext() {
        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('shape.getContext() method is deprecated. Please do not use it.');
        return this.getLayer().getContext();
    }
    getCanvas() {
        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('shape.getCanvas() method is deprecated. Please do not use it.');
        return this.getLayer().getCanvas();
    }
    getSceneFunc() {
        return this.attrs.sceneFunc || this['_sceneFunc'];
    }
    getHitFunc() {
        return this.attrs.hitFunc || this['_hitFunc'];
    }
    hasShadow() {
        return this._getCache(HAS_SHADOW, this._hasShadow);
    }
    _hasShadow() {
        return (this.shadowEnabled() &&
            this.shadowOpacity() !== 0 &&
            !!(this.shadowColor() ||
                this.shadowBlur() ||
                this.shadowOffsetX() ||
                this.shadowOffsetY()));
    }
    _getFillPattern() {
        return this._getCache(patternImage, this.__getFillPattern);
    }
    __getFillPattern() {
        if (this.fillPatternImage()) {
            var ctx = getDummyContext();
            const pattern = ctx.createPattern(this.fillPatternImage(), this.fillPatternRepeat() || 'repeat');
            if (pattern && pattern.setTransform) {
                const tr = new _Util_js__WEBPACK_IMPORTED_MODULE_1__.Transform();
                tr.translate(this.fillPatternX(), this.fillPatternY());
                tr.rotate(_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.getAngle(this.fillPatternRotation()));
                tr.scale(this.fillPatternScaleX(), this.fillPatternScaleY());
                tr.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
                const m = tr.getMatrix();
                const matrix = typeof DOMMatrix === 'undefined'
                    ? {
                        a: m[0],
                        b: m[1],
                        c: m[2],
                        d: m[3],
                        e: m[4],
                        f: m[5],
                    }
                    : new DOMMatrix(m);
                pattern.setTransform(matrix);
            }
            return pattern;
        }
    }
    _getLinearGradient() {
        return this._getCache(linearGradient, this.__getLinearGradient);
    }
    __getLinearGradient() {
        var colorStops = this.fillLinearGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillLinearGradientStartPoint();
            var end = this.fillLinearGradientEndPoint();
            var grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    }
    _getRadialGradient() {
        return this._getCache(radialGradient, this.__getRadialGradient);
    }
    __getRadialGradient() {
        var colorStops = this.fillRadialGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillRadialGradientStartPoint();
            var end = this.fillRadialGradientEndPoint();
            var grd = ctx.createRadialGradient(start.x, start.y, this.fillRadialGradientStartRadius(), end.x, end.y, this.fillRadialGradientEndRadius());
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    }
    getShadowRGBA() {
        return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
    }
    _getShadowRGBA() {
        if (this.hasShadow()) {
            var rgba = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.colorToRGBA(this.shadowColor());
            return ('rgba(' +
                rgba.r +
                ',' +
                rgba.g +
                ',' +
                rgba.b +
                ',' +
                rgba.a * (this.shadowOpacity() || 1) +
                ')');
        }
    }
    hasFill() {
        return this._calculate('hasFill', [
            'fillEnabled',
            'fill',
            'fillPatternImage',
            'fillLinearGradientColorStops',
            'fillRadialGradientColorStops',
        ], () => {
            return (this.fillEnabled() &&
                !!(this.fill() ||
                    this.fillPatternImage() ||
                    this.fillLinearGradientColorStops() ||
                    this.fillRadialGradientColorStops()));
        });
    }
    hasStroke() {
        return this._calculate('hasStroke', [
            'strokeEnabled',
            'strokeWidth',
            'stroke',
            'strokeLinearGradientColorStops',
        ], () => {
            return (this.strokeEnabled() &&
                this.strokeWidth() &&
                !!(this.stroke() || this.strokeLinearGradientColorStops()));
        });
    }
    hasHitStroke() {
        const width = this.hitStrokeWidth();
        if (width === 'auto') {
            return this.hasStroke();
        }
        return this.strokeEnabled() && !!width;
    }
    intersects(point) {
        var stage = this.getStage(), bufferHitCanvas = stage.bufferHitCanvas, p;
        bufferHitCanvas.getContext().clear();
        this.drawHit(bufferHitCanvas, null, true);
        p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
        return p[3] > 0;
    }
    destroy() {
        _Node_js__WEBPACK_IMPORTED_MODULE_3__.Node.prototype.destroy.call(this);
        delete shapes[this.colorKey];
        delete this.colorKey;
        return this;
    }
    _useBufferCanvas(forceFill) {
        var _a;
        if (!this.getStage()) {
            return false;
        }
        const perfectDrawEnabled = (_a = this.attrs.perfectDrawEnabled) !== null && _a !== void 0 ? _a : true;
        if (!perfectDrawEnabled) {
            return false;
        }
        const hasFill = forceFill || this.hasFill();
        const hasStroke = this.hasStroke();
        const isTransparent = this.getAbsoluteOpacity() !== 1;
        if (hasFill && hasStroke && isTransparent) {
            return true;
        }
        const hasShadow = this.hasShadow();
        const strokeForShadow = this.shadowForStrokeEnabled();
        if (hasFill && hasStroke && hasShadow && strokeForShadow) {
            return true;
        }
        return false;
    }
    setStrokeHitEnabled(val) {
        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead.');
        if (val) {
            this.hitStrokeWidth('auto');
        }
        else {
            this.hitStrokeWidth(0);
        }
    }
    getStrokeHitEnabled() {
        if (this.hitStrokeWidth() === 0) {
            return false;
        }
        else {
            return true;
        }
    }
    getSelfRect() {
        var size = this.size();
        return {
            x: this._centroid ? -size.width / 2 : 0,
            y: this._centroid ? -size.height / 2 : 0,
            width: size.width,
            height: size.height,
        };
    }
    getClientRect(config = {}) {
        const skipTransform = config.skipTransform;
        const relativeTo = config.relativeTo;
        const fillRect = this.getSelfRect();
        const applyStroke = !config.skipStroke && this.hasStroke();
        const strokeWidth = (applyStroke && this.strokeWidth()) || 0;
        const fillAndStrokeWidth = fillRect.width + strokeWidth;
        const fillAndStrokeHeight = fillRect.height + strokeWidth;
        const applyShadow = !config.skipShadow && this.hasShadow();
        const shadowOffsetX = applyShadow ? this.shadowOffsetX() : 0;
        const shadowOffsetY = applyShadow ? this.shadowOffsetY() : 0;
        const preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
        const preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
        const blurRadius = (applyShadow && this.shadowBlur()) || 0;
        const width = preWidth + blurRadius * 2;
        const height = preHeight + blurRadius * 2;
        const rect = {
            width: width,
            height: height,
            x: -(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetX, 0) +
                fillRect.x,
            y: -(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetY, 0) +
                fillRect.y,
        };
        if (!skipTransform) {
            return this._transformedRect(rect, relativeTo);
        }
        return rect;
    }
    drawScene(can, top) {
        var layer = this.getLayer(), canvas = can || layer.getCanvas(), context = canvas.getContext(), cachedCanvas = this._getCanvasCache(), drawFunc = this.getSceneFunc(), hasShadow = this.hasShadow(), stage, bufferCanvas, bufferContext;
        var skipBuffer = canvas.isCache;
        var cachingSelf = top === this;
        if (!this.isVisible() && !cachingSelf) {
            return this;
        }
        if (cachedCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedSceneCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        if (this._useBufferCanvas() && !skipBuffer) {
            stage = this.getStage();
            bufferCanvas = stage.bufferCanvas;
            bufferContext = bufferCanvas.getContext();
            bufferContext.clear();
            bufferContext.save();
            bufferContext._applyLineJoin(this);
            var o = this.getAbsoluteTransform(top).getMatrix();
            bufferContext.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
            drawFunc.call(this, bufferContext, this);
            bufferContext.restore();
            var ratio = bufferCanvas.pixelRatio;
            if (hasShadow) {
                context._applyShadow(this);
            }
            context._applyOpacity(this);
            context._applyGlobalCompositeOperation(this);
            context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
        }
        else {
            context._applyLineJoin(this);
            if (!cachingSelf) {
                var o = this.getAbsoluteTransform(top).getMatrix();
                context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                context._applyOpacity(this);
                context._applyGlobalCompositeOperation(this);
            }
            if (hasShadow) {
                context._applyShadow(this);
            }
            drawFunc.call(this, context, this);
        }
        context.restore();
        return this;
    }
    drawHit(can, top, skipDragCheck = false) {
        if (!this.shouldDrawHit(top, skipDragCheck)) {
            return this;
        }
        var layer = this.getLayer(), canvas = can || layer.hitCanvas, context = canvas && canvas.getContext(), drawFunc = this.hitFunc() || this.sceneFunc(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (!this.colorKey) {
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()');
        }
        if (cachedHitCanvas) {
            context.save();
            var m = this.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            this._drawCachedHitCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        context._applyLineJoin(this);
        const selfCache = this === top;
        if (!selfCache) {
            var o = this.getAbsoluteTransform(top).getMatrix();
            context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
        }
        drawFunc.call(this, context, this);
        context.restore();
        return this;
    }
    drawHitFromCache(alphaThreshold = 0) {
        var cachedCanvas = this._getCanvasCache(), sceneCanvas = this._getCachedSceneCanvas(), hitCanvas = cachedCanvas.hit, hitContext = hitCanvas.getContext(), hitWidth = hitCanvas.getWidth(), hitHeight = hitCanvas.getHeight(), hitImageData, hitData, len, rgbColorKey, i, alpha;
        hitContext.clear();
        hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);
        try {
            hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
            hitData = hitImageData.data;
            len = hitData.length;
            rgbColorKey = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._hexToRgb(this.colorKey);
            for (i = 0; i < len; i += 4) {
                alpha = hitData[i + 3];
                if (alpha > alphaThreshold) {
                    hitData[i] = rgbColorKey.r;
                    hitData[i + 1] = rgbColorKey.g;
                    hitData[i + 2] = rgbColorKey.b;
                    hitData[i + 3] = 255;
                }
                else {
                    hitData[i + 3] = 0;
                }
            }
            hitContext.putImageData(hitImageData, 0, 0);
        }
        catch (e) {
            _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.error('Unable to draw hit graph from cached scene canvas. ' + e.message);
        }
        return this;
    }
    hasPointerCapture(pointerId) {
        return _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__.hasPointerCapture(pointerId, this);
    }
    setPointerCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__.setPointerCapture(pointerId, this);
    }
    releaseCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_5__.releaseCapture(pointerId, this);
    }
}
Shape.prototype._fillFunc = _fillFunc;
Shape.prototype._strokeFunc = _strokeFunc;
Shape.prototype._fillFuncHit = _fillFuncHit;
Shape.prototype._strokeFuncHit = _strokeFuncHit;
Shape.prototype._centroid = false;
Shape.prototype.nodeType = 'Shape';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_0__._registerNode)(Shape);
Shape.prototype.eventListeners = {};
Shape.prototype.on.call(Shape.prototype, 'shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearHasShadowCache);
Shape.prototype.on.call(Shape.prototype, 'shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearGetShadowRGBACache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva', _clearFillPatternCache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva', _clearLinearGradientCache);
Shape.prototype.on.call(Shape.prototype, 'fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva', _clearRadialGradientCache);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'stroke', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getStringOrGradientValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeWidth', 2, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillAfterStrokeEnabled', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'hitStrokeWidth', 'auto', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberOrAutoValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeHitEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'perfectDrawEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowForStrokeEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'lineJoin');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'lineCap');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'sceneFunc');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'hitFunc');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'dash');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'dashOffset', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowColor', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getStringValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowBlur', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowOpacity', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'shadowOffset', ['x', 'y']);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowOffsetX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowOffsetY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternImage');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fill', undefined, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getStringOrGradientValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientColorStops');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientColorStops');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientStartRadius', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientEndRadius', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientColorStops');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternRepeat', 'repeat');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'shadowEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'dashEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeScaleEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPriority', 'color');
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillPatternOffset', ['x', 'y']);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternOffsetX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternOffsetY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillPatternScale', ['x', 'y']);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternScaleX', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternScaleY', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_4__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientStartPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientStartPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientEndPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientEndPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientStartPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientEndPoint', [
    'x',
    'y',
]);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointX', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointY', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.addGetterSetter(Shape, 'fillPatternRotation', 0);
_Factory_js__WEBPACK_IMPORTED_MODULE_2__.Factory.backCompat(Shape, {
    dashArray: 'dash',
    getDashArray: 'getDash',
    setDashArray: 'getDash',
    drawFunc: 'sceneFunc',
    getDrawFunc: 'getSceneFunc',
    setDrawFunc: 'setSceneFunc',
    drawHitFunc: 'hitFunc',
    getDrawHitFunc: 'getHitFunc',
    setDrawHitFunc: 'setHitFunc',
});


/***/ }),

/***/ "./node_modules/konva/lib/Stage.js":
/*!*****************************************!*\
  !*** ./node_modules/konva/lib/Stage.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Stage": () => (/* binding */ Stage),
/* harmony export */   "stages": () => (/* binding */ stages)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Container.js */ "./node_modules/konva/lib/Container.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Canvas.js */ "./node_modules/konva/lib/Canvas.js");
/* harmony import */ var _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DragAndDrop.js */ "./node_modules/konva/lib/DragAndDrop.js");
/* harmony import */ var _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PointerEvents.js */ "./node_modules/konva/lib/PointerEvents.js");








var STAGE = 'Stage', STRING = 'string', PX = 'px', MOUSEOUT = 'mouseout', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', POINTERMOVE = 'pointermove', POINTERDOWN = 'pointerdown', POINTERUP = 'pointerup', POINTERCANCEL = 'pointercancel', LOSTPOINTERCAPTURE = 'lostpointercapture', POINTEROUT = 'pointerout', POINTERLEAVE = 'pointerleave', POINTEROVER = 'pointerover', POINTERENTER = 'pointerenter', CONTEXTMENU = 'contextmenu', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TOUCHMOVE = 'touchmove', TOUCHCANCEL = 'touchcancel', WHEEL = 'wheel', MAX_LAYERS_NUMBER = 5, EVENTS = [
    [MOUSEENTER, '_pointerenter'],
    [MOUSEDOWN, '_pointerdown'],
    [MOUSEMOVE, '_pointermove'],
    [MOUSEUP, '_pointerup'],
    [MOUSELEAVE, '_pointerleave'],
    [TOUCHSTART, '_pointerdown'],
    [TOUCHMOVE, '_pointermove'],
    [TOUCHEND, '_pointerup'],
    [TOUCHCANCEL, '_pointercancel'],
    [MOUSEOVER, '_pointerover'],
    [WHEEL, '_wheel'],
    [CONTEXTMENU, '_contextmenu'],
    [POINTERDOWN, '_pointerdown'],
    [POINTERMOVE, '_pointermove'],
    [POINTERUP, '_pointerup'],
    [POINTERCANCEL, '_pointercancel'],
    [LOSTPOINTERCAPTURE, '_lostpointercapture'],
];
const EVENTS_MAP = {
    mouse: {
        [POINTEROUT]: MOUSEOUT,
        [POINTERLEAVE]: MOUSELEAVE,
        [POINTEROVER]: MOUSEOVER,
        [POINTERENTER]: MOUSEENTER,
        [POINTERMOVE]: MOUSEMOVE,
        [POINTERDOWN]: MOUSEDOWN,
        [POINTERUP]: MOUSEUP,
        [POINTERCANCEL]: 'mousecancel',
        pointerclick: 'click',
        pointerdblclick: 'dblclick',
    },
    touch: {
        [POINTEROUT]: 'touchout',
        [POINTERLEAVE]: 'touchleave',
        [POINTEROVER]: 'touchover',
        [POINTERENTER]: 'touchenter',
        [POINTERMOVE]: TOUCHMOVE,
        [POINTERDOWN]: TOUCHSTART,
        [POINTERUP]: TOUCHEND,
        [POINTERCANCEL]: TOUCHCANCEL,
        pointerclick: 'tap',
        pointerdblclick: 'dbltap',
    },
    pointer: {
        [POINTEROUT]: POINTEROUT,
        [POINTERLEAVE]: POINTERLEAVE,
        [POINTEROVER]: POINTEROVER,
        [POINTERENTER]: POINTERENTER,
        [POINTERMOVE]: POINTERMOVE,
        [POINTERDOWN]: POINTERDOWN,
        [POINTERUP]: POINTERUP,
        [POINTERCANCEL]: POINTERCANCEL,
        pointerclick: 'pointerclick',
        pointerdblclick: 'pointerdblclick',
    },
};
const getEventType = (type) => {
    if (type.indexOf('pointer') >= 0) {
        return 'pointer';
    }
    if (type.indexOf('touch') >= 0) {
        return 'touch';
    }
    return 'mouse';
};
const getEventsMap = (eventType) => {
    const type = getEventType(eventType);
    if (type === 'pointer') {
        return _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.pointerEventsEnabled && EVENTS_MAP.pointer;
    }
    if (type === 'touch') {
        return EVENTS_MAP.touch;
    }
    if (type === 'mouse') {
        return EVENTS_MAP.mouse;
    }
};
function checkNoClip(attrs = {}) {
    if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
    }
    return attrs;
}
const NO_POINTERS_MESSAGE = `Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);`;
const stages = [];
class Stage extends _Container_js__WEBPACK_IMPORTED_MODULE_2__.Container {
    constructor(config) {
        super(checkNoClip(config));
        this._pointerPositions = [];
        this._changedPointerPositions = [];
        this._buildDOM();
        this._bindContentEvents();
        stages.push(this);
        this.on('widthChange.konva heightChange.konva', this._resizeDOM);
        this.on('visibleChange.konva', this._checkVisibility);
        this.on('clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva', () => {
            checkNoClip(this.attrs);
        });
        this._checkVisibility();
    }
    _validateAdd(child) {
        const isLayer = child.getType() === 'Layer';
        const isFastLayer = child.getType() === 'FastLayer';
        const valid = isLayer || isFastLayer;
        if (!valid) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util["throw"]('You may only add layers to the stage.');
        }
    }
    _checkVisibility() {
        if (!this.content) {
            return;
        }
        const style = this.visible() ? '' : 'none';
        this.content.style.display = style;
    }
    setContainer(container) {
        if (typeof container === STRING) {
            if (container.charAt(0) === '.') {
                var className = container.slice(1);
                container = document.getElementsByClassName(className)[0];
            }
            else {
                var id;
                if (container.charAt(0) !== '#') {
                    id = container;
                }
                else {
                    id = container.slice(1);
                }
                container = document.getElementById(id);
            }
            if (!container) {
                throw 'Can not find container in document with id ' + id;
            }
        }
        this._setAttr('container', container);
        if (this.content) {
            if (this.content.parentElement) {
                this.content.parentElement.removeChild(this.content);
            }
            container.appendChild(this.content);
        }
        return this;
    }
    shouldDrawHit() {
        return true;
    }
    clear() {
        var layers = this.children, len = layers.length, n;
        for (n = 0; n < len; n++) {
            layers[n].clear();
        }
        return this;
    }
    clone(obj) {
        if (!obj) {
            obj = {};
        }
        obj.container =
            typeof document !== 'undefined' && document.createElement('div');
        return _Container_js__WEBPACK_IMPORTED_MODULE_2__.Container.prototype.clone.call(this, obj);
    }
    destroy() {
        super.destroy();
        var content = this.content;
        if (content && _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isInDocument(content)) {
            this.container().removeChild(content);
        }
        var index = stages.indexOf(this);
        if (index > -1) {
            stages.splice(index, 1);
        }
        return this;
    }
    getPointerPosition() {
        const pos = this._pointerPositions[0] || this._changedPointerPositions[0];
        if (!pos) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn(NO_POINTERS_MESSAGE);
            return null;
        }
        return {
            x: pos.x,
            y: pos.y,
        };
    }
    _getPointerById(id) {
        return this._pointerPositions.find((p) => p.id === id);
    }
    getPointersPositions() {
        return this._pointerPositions;
    }
    getStage() {
        return this;
    }
    getContent() {
        return this.content;
    }
    _toKonvaCanvas(config) {
        config = config || {};
        config.x = config.x || 0;
        config.y = config.y || 0;
        config.width = config.width || this.width();
        config.height = config.height || this.height();
        var canvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.SceneCanvas({
            width: config.width,
            height: config.height,
            pixelRatio: config.pixelRatio || 1,
        });
        var _context = canvas.getContext()._context;
        var layers = this.children;
        if (config.x || config.y) {
            _context.translate(-1 * config.x, -1 * config.y);
        }
        layers.forEach(function (layer) {
            if (!layer.isVisible()) {
                return;
            }
            var layerCanvas = layer._toKonvaCanvas(config);
            _context.drawImage(layerCanvas._canvas, config.x, config.y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
        });
        return canvas;
    }
    getIntersection(pos) {
        if (!pos) {
            return null;
        }
        var layers = this.children, len = layers.length, end = len - 1, n;
        for (n = end; n >= 0; n--) {
            const shape = layers[n].getIntersection(pos);
            if (shape) {
                return shape;
            }
        }
        return null;
    }
    _resizeDOM() {
        var width = this.width();
        var height = this.height();
        if (this.content) {
            this.content.style.width = width + PX;
            this.content.style.height = height + PX;
        }
        this.bufferCanvas.setSize(width, height);
        this.bufferHitCanvas.setSize(width, height);
        this.children.forEach((layer) => {
            layer.setSize({ width, height });
            layer.draw();
        });
    }
    add(layer, ...rest) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        super.add(layer);
        var length = this.children.length;
        if (length > MAX_LAYERS_NUMBER) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('The stage has ' +
                length +
                ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.');
        }
        layer.setSize({ width: this.width(), height: this.height() });
        layer.draw();
        if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.isBrowser) {
            this.content.appendChild(layer.canvas._canvas);
        }
        return this;
    }
    getParent() {
        return null;
    }
    getLayer() {
        return null;
    }
    hasPointerCapture(pointerId) {
        return _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.hasPointerCapture(pointerId, this);
    }
    setPointerCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.setPointerCapture(pointerId, this);
    }
    releaseCapture(pointerId) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.releaseCapture(pointerId, this);
    }
    getLayers() {
        return this.children;
    }
    _bindContentEvents() {
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.isBrowser) {
            return;
        }
        EVENTS.forEach(([event, methodName]) => {
            this.content.addEventListener(event, (evt) => {
                this[methodName](evt);
            });
        });
    }
    _pointerenter(evt) {
        this.setPointersPositions(evt);
        const events = getEventsMap(evt.type);
        this._fire(events.pointerenter, {
            evt: evt,
            target: this,
            currentTarget: this,
        });
    }
    _pointerover(evt) {
        this.setPointersPositions(evt);
        const events = getEventsMap(evt.type);
        this._fire(events.pointerover, {
            evt: evt,
            target: this,
            currentTarget: this,
        });
    }
    _getTargetShape(evenType) {
        let shape = this[evenType + 'targetShape'];
        if (shape && !shape.getStage()) {
            shape = null;
        }
        return shape;
    }
    _pointerleave(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        this.setPointersPositions(evt);
        var targetShape = this._getTargetShape(eventType);
        var eventsEnabled = !_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.isDragging || _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.hitOnDragEnabled;
        if (targetShape && eventsEnabled) {
            targetShape._fireAndBubble(events.pointerout, { evt: evt });
            targetShape._fireAndBubble(events.pointerleave, { evt: evt });
            this._fire(events.pointerleave, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
            this[eventType + 'targetShape'] = null;
        }
        else if (eventsEnabled) {
            this._fire(events.pointerleave, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
            this._fire(events.pointerout, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
        this.pointerPos = undefined;
        this._pointerPositions = [];
    }
    _pointerdown(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        this.setPointersPositions(evt);
        var triggeredOnShape = false;
        this._changedPointerPositions.forEach((pos) => {
            var shape = this.getIntersection(pos);
            _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.justDragged = false;
            _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick'] = true;
            const hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.capturePointerEventsEnabled) {
                shape.setPointerCapture(pos.id);
            }
            this[eventType + 'ClickStartShape'] = shape;
            shape._fireAndBubble(events.pointerdown, {
                evt: evt,
                pointerId: pos.id,
            });
            triggeredOnShape = true;
            const isTouch = evt.type.indexOf('touch') >= 0;
            if (shape.preventDefault() && evt.cancelable && isTouch) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(events.pointerdown, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._pointerPositions[0].id,
            });
        }
    }
    _pointermove(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        if (_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.isDragging && _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.node.preventDefault() && evt.cancelable) {
            evt.preventDefault();
        }
        this.setPointersPositions(evt);
        var eventsEnabled = !_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.isDragging || _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.hitOnDragEnabled;
        if (!eventsEnabled) {
            return;
        }
        var processedShapesIds = {};
        let triggeredOnShape = false;
        var targetShape = this._getTargetShape(eventType);
        this._changedPointerPositions.forEach((pos) => {
            const shape = (_PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.getCapturedShape(pos.id) ||
                this.getIntersection(pos));
            const pointerId = pos.id;
            const event = { evt: evt, pointerId };
            var differentTarget = targetShape !== shape;
            if (differentTarget && targetShape) {
                targetShape._fireAndBubble(events.pointerout, Object.assign({}, event), shape);
                targetShape._fireAndBubble(events.pointerleave, Object.assign({}, event), shape);
            }
            if (shape) {
                if (processedShapesIds[shape._id]) {
                    return;
                }
                processedShapesIds[shape._id] = true;
            }
            if (shape && shape.isListening()) {
                triggeredOnShape = true;
                if (differentTarget) {
                    shape._fireAndBubble(events.pointerover, Object.assign({}, event), targetShape);
                    shape._fireAndBubble(events.pointerenter, Object.assign({}, event), targetShape);
                    this[eventType + 'targetShape'] = shape;
                }
                shape._fireAndBubble(events.pointermove, Object.assign({}, event));
            }
            else {
                if (targetShape) {
                    this._fire(events.pointerover, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId,
                    });
                    this[eventType + 'targetShape'] = null;
                }
            }
        });
        if (!triggeredOnShape) {
            this._fire(events.pointermove, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
    }
    _pointerup(evt) {
        const events = getEventsMap(evt.type);
        const eventType = getEventType(evt.type);
        if (!events) {
            return;
        }
        this.setPointersPositions(evt);
        const clickStartShape = this[eventType + 'ClickStartShape'];
        const clickEndShape = this[eventType + 'ClickEndShape'];
        var processedShapesIds = {};
        let triggeredOnShape = false;
        this._changedPointerPositions.forEach((pos) => {
            const shape = (_PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.getCapturedShape(pos.id) ||
                this.getIntersection(pos));
            if (shape) {
                shape.releaseCapture(pos.id);
                if (processedShapesIds[shape._id]) {
                    return;
                }
                processedShapesIds[shape._id] = true;
            }
            const pointerId = pos.id;
            const event = { evt: evt, pointerId };
            let fireDblClick = false;
            if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'InDblClickWindow']) {
                fireDblClick = true;
                clearTimeout(this[eventType + 'DblTimeout']);
            }
            else if (!_DragAndDrop_js__WEBPACK_IMPORTED_MODULE_5__.DD.justDragged) {
                _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'InDblClickWindow'] = true;
                clearTimeout(this[eventType + 'DblTimeout']);
            }
            this[eventType + 'DblTimeout'] = setTimeout(function () {
                _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'InDblClickWindow'] = false;
            }, _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.dblClickWindow);
            if (shape && shape.isListening()) {
                triggeredOnShape = true;
                this[eventType + 'ClickEndShape'] = shape;
                shape._fireAndBubble(events.pointerup, Object.assign({}, event));
                if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick'] &&
                    clickStartShape &&
                    clickStartShape === shape) {
                    shape._fireAndBubble(events.pointerclick, Object.assign({}, event));
                    if (fireDblClick && clickEndShape && clickEndShape === shape) {
                        shape._fireAndBubble(events.pointerdblclick, Object.assign({}, event));
                    }
                }
            }
            else {
                this[eventType + 'ClickEndShape'] = null;
                if (_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick']) {
                    this._fire(events.pointerclick, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId,
                    });
                }
                if (fireDblClick) {
                    this._fire(events.pointerdblclick, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId,
                    });
                }
            }
        });
        if (!triggeredOnShape) {
            this._fire(events.pointerup, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id,
            });
        }
        _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva['_' + eventType + 'ListenClick'] = false;
        if (evt.cancelable) {
            evt.preventDefault();
        }
    }
    _contextmenu(evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(CONTEXTMENU, { evt: evt });
        }
        else {
            this._fire(CONTEXTMENU, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
    }
    _wheel(evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(WHEEL, { evt: evt });
        }
        else {
            this._fire(WHEEL, {
                evt: evt,
                target: this,
                currentTarget: this,
            });
        }
    }
    _pointercancel(evt) {
        this.setPointersPositions(evt);
        const shape = _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.createEvent(evt));
        }
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.releaseCapture(evt.pointerId);
    }
    _lostpointercapture(evt) {
        _PointerEvents_js__WEBPACK_IMPORTED_MODULE_6__.releaseCapture(evt.pointerId);
    }
    setPointersPositions(evt) {
        var contentPosition = this._getContentPosition(), x = null, y = null;
        evt = evt ? evt : window.event;
        if (evt.touches !== undefined) {
            this._pointerPositions = [];
            this._changedPointerPositions = [];
            Array.prototype.forEach.call(evt.touches, (touch) => {
                this._pointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
            Array.prototype.forEach.call(evt.changedTouches || evt.touches, (touch) => {
                this._changedPointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
        }
        else {
            x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
            y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
            this.pointerPos = {
                x: x,
                y: y,
            };
            this._pointerPositions = [{ x, y, id: _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._getFirstPointerId(evt) }];
            this._changedPointerPositions = [
                { x, y, id: _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._getFirstPointerId(evt) },
            ];
        }
    }
    _setPointerPosition(evt) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
        this.setPointersPositions(evt);
    }
    _getContentPosition() {
        if (!this.content || !this.content.getBoundingClientRect) {
            return {
                top: 0,
                left: 0,
                scaleX: 1,
                scaleY: 1,
            };
        }
        var rect = this.content.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            scaleX: rect.width / this.content.clientWidth || 1,
            scaleY: rect.height / this.content.clientHeight || 1,
        };
    }
    _buildDOM() {
        this.bufferCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.SceneCanvas({
            width: this.width(),
            height: this.height(),
        });
        this.bufferHitCanvas = new _Canvas_js__WEBPACK_IMPORTED_MODULE_4__.HitCanvas({
            pixelRatio: 1,
            width: this.width(),
            height: this.height(),
        });
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.isBrowser) {
            return;
        }
        var container = this.container();
        if (!container) {
            throw 'Stage has no container. A container is required.';
        }
        container.innerHTML = '';
        this.content = document.createElement('div');
        this.content.style.position = 'relative';
        this.content.style.userSelect = 'none';
        this.content.className = 'konvajs-content';
        this.content.setAttribute('role', 'presentation');
        container.appendChild(this.content);
        this._resizeDOM();
    }
    cache() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
        return this;
    }
    clearCache() {
        return this;
    }
    batchDraw() {
        this.getChildren().forEach(function (layer) {
            layer.batchDraw();
        });
        return this;
    }
}
Stage.prototype.nodeType = STAGE;
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Stage);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Stage, 'container');


/***/ }),

/***/ "./node_modules/konva/lib/Tween.js":
/*!*****************************************!*\
  !*** ./node_modules/konva/lib/Tween.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Easings": () => (/* binding */ Easings),
/* harmony export */   "Tween": () => (/* binding */ Tween)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Animation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Animation.js */ "./node_modules/konva/lib/Animation.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");




var blacklist = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1,
}, PAUSED = 1, PLAYING = 2, REVERSING = 3, idCounter = 0, colorAttrs = ['fill', 'stroke', 'shadowColor'];
class TweenEngine {
    constructor(prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    }
    fire(str) {
        var handler = this[str];
        if (handler) {
            handler();
        }
    }
    setTime(t) {
        if (t > this.duration) {
            if (this.yoyo) {
                this._time = this.duration;
                this.reverse();
            }
            else {
                this.finish();
            }
        }
        else if (t < 0) {
            if (this.yoyo) {
                this._time = 0;
                this.play();
            }
            else {
                this.reset();
            }
        }
        else {
            this._time = t;
            this.update();
        }
    }
    getTime() {
        return this._time;
    }
    setPosition(p) {
        this.prevPos = this._pos;
        this.propFunc(p);
        this._pos = p;
    }
    getPosition(t) {
        if (t === undefined) {
            t = this._time;
        }
        return this.func(t, this.begin, this._change, this.duration);
    }
    play() {
        this.state = PLAYING;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onPlay');
    }
    reverse() {
        this.state = REVERSING;
        this._time = this.duration - this._time;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onReverse');
    }
    seek(t) {
        this.pause();
        this._time = t;
        this.update();
        this.fire('onSeek');
    }
    reset() {
        this.pause();
        this._time = 0;
        this.update();
        this.fire('onReset');
    }
    finish() {
        this.pause();
        this._time = this.duration;
        this.update();
        this.fire('onFinish');
    }
    update() {
        this.setPosition(this.getPosition(this._time));
        this.fire('onUpdate');
    }
    onEnterFrame() {
        var t = this.getTimer() - this._startTime;
        if (this.state === PLAYING) {
            this.setTime(t);
        }
        else if (this.state === REVERSING) {
            this.setTime(this.duration - t);
        }
    }
    pause() {
        this.state = PAUSED;
        this.fire('onPause');
    }
    getTimer() {
        return new Date().getTime();
    }
}
class Tween {
    constructor(config) {
        var that = this, node = config.node, nodeId = node._id, duration, easing = config.easing || Easings.Linear, yoyo = !!config.yoyo, key;
        if (typeof config.duration === 'undefined') {
            duration = 0.3;
        }
        else if (config.duration === 0) {
            duration = 0.001;
        }
        else {
            duration = config.duration;
        }
        this.node = node;
        this._id = idCounter++;
        var layers = node.getLayer() ||
            (node instanceof _Global_js__WEBPACK_IMPORTED_MODULE_3__.Konva.Stage ? node.getLayers() : null);
        if (!layers) {
            _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Tween constructor have `node` that is not in a layer. Please add node into layer first.');
        }
        this.anim = new _Animation_js__WEBPACK_IMPORTED_MODULE_1__.Animation(function () {
            that.tween.onEnterFrame();
        }, layers);
        this.tween = new TweenEngine(key, function (i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);
        this._addListeners();
        if (!Tween.attrs[nodeId]) {
            Tween.attrs[nodeId] = {};
        }
        if (!Tween.attrs[nodeId][this._id]) {
            Tween.attrs[nodeId][this._id] = {};
        }
        if (!Tween.tweens[nodeId]) {
            Tween.tweens[nodeId] = {};
        }
        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }
        this.reset();
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
        this.onUpdate = config.onUpdate;
    }
    _addAttr(key, end) {
        var node = this.node, nodeId = node._id, start, diff, tweenId, n, len, trueEnd, trueStart, endRGBA;
        tweenId = Tween.tweens[nodeId][key];
        if (tweenId) {
            delete Tween.attrs[nodeId][tweenId][key];
        }
        start = node.getAttr(key);
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(end)) {
            diff = [];
            len = Math.max(end.length, start.length);
            if (key === 'points' && end.length !== start.length) {
                if (end.length > start.length) {
                    trueStart = start;
                    start = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._prepareArrayForTween(start, end, node.closed());
                }
                else {
                    trueEnd = end;
                    end = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._prepareArrayForTween(end, start, node.closed());
                }
            }
            if (key.indexOf('fill') === 0) {
                for (n = 0; n < len; n++) {
                    if (n % 2 === 0) {
                        diff.push(end[n] - start[n]);
                    }
                    else {
                        var startRGBA = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(start[n]);
                        endRGBA = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(end[n]);
                        start[n] = startRGBA;
                        diff.push({
                            r: endRGBA.r - startRGBA.r,
                            g: endRGBA.g - startRGBA.g,
                            b: endRGBA.b - startRGBA.b,
                            a: endRGBA.a - startRGBA.a,
                        });
                    }
                }
            }
            else {
                for (n = 0; n < len; n++) {
                    diff.push(end[n] - start[n]);
                }
            }
        }
        else if (colorAttrs.indexOf(key) !== -1) {
            start = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(start);
            endRGBA = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.colorToRGBA(end);
            diff = {
                r: endRGBA.r - start.r,
                g: endRGBA.g - start.g,
                b: endRGBA.b - start.b,
                a: endRGBA.a - start.a,
            };
        }
        else {
            diff = end - start;
        }
        Tween.attrs[nodeId][this._id][key] = {
            start: start,
            diff: diff,
            end: end,
            trueEnd: trueEnd,
            trueStart: trueStart,
        };
        Tween.tweens[nodeId][key] = this._id;
    }
    _tweenFunc(i) {
        var node = this.node, attrs = Tween.attrs[node._id][this._id], key, attr, start, diff, newVal, n, len, end;
        for (key in attrs) {
            attr = attrs[key];
            start = attr.start;
            diff = attr.diff;
            end = attr.end;
            if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isArray(start)) {
                newVal = [];
                len = Math.max(start.length, end.length);
                if (key.indexOf('fill') === 0) {
                    for (n = 0; n < len; n++) {
                        if (n % 2 === 0) {
                            newVal.push((start[n] || 0) + diff[n] * i);
                        }
                        else {
                            newVal.push('rgba(' +
                                Math.round(start[n].r + diff[n].r * i) +
                                ',' +
                                Math.round(start[n].g + diff[n].g * i) +
                                ',' +
                                Math.round(start[n].b + diff[n].b * i) +
                                ',' +
                                (start[n].a + diff[n].a * i) +
                                ')');
                        }
                    }
                }
                else {
                    for (n = 0; n < len; n++) {
                        newVal.push((start[n] || 0) + diff[n] * i);
                    }
                }
            }
            else if (colorAttrs.indexOf(key) !== -1) {
                newVal =
                    'rgba(' +
                        Math.round(start.r + diff.r * i) +
                        ',' +
                        Math.round(start.g + diff.g * i) +
                        ',' +
                        Math.round(start.b + diff.b * i) +
                        ',' +
                        (start.a + diff.a * i) +
                        ')';
            }
            else {
                newVal = start + diff * i;
            }
            node.setAttr(key, newVal);
        }
    }
    _addListeners() {
        this.tween.onPlay = () => {
            this.anim.start();
        };
        this.tween.onReverse = () => {
            this.anim.start();
        };
        this.tween.onPause = () => {
            this.anim.stop();
        };
        this.tween.onFinish = () => {
            var node = this.node;
            var attrs = Tween.attrs[node._id][this._id];
            if (attrs.points && attrs.points.trueEnd) {
                node.setAttr('points', attrs.points.trueEnd);
            }
            if (this.onFinish) {
                this.onFinish.call(this);
            }
        };
        this.tween.onReset = () => {
            var node = this.node;
            var attrs = Tween.attrs[node._id][this._id];
            if (attrs.points && attrs.points.trueStart) {
                node.points(attrs.points.trueStart);
            }
            if (this.onReset) {
                this.onReset();
            }
        };
        this.tween.onUpdate = () => {
            if (this.onUpdate) {
                this.onUpdate.call(this);
            }
        };
    }
    play() {
        this.tween.play();
        return this;
    }
    reverse() {
        this.tween.reverse();
        return this;
    }
    reset() {
        this.tween.reset();
        return this;
    }
    seek(t) {
        this.tween.seek(t * 1000);
        return this;
    }
    pause() {
        this.tween.pause();
        return this;
    }
    finish() {
        this.tween.finish();
        return this;
    }
    destroy() {
        var nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId], key;
        this.pause();
        for (key in attrs) {
            delete Tween.tweens[nodeId][key];
        }
        delete Tween.attrs[nodeId][thisId];
    }
}
Tween.attrs = {};
Tween.tweens = {};
_Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.to = function (params) {
    var onFinish = params.onFinish;
    params.node = this;
    params.onFinish = function () {
        this.destroy();
        if (onFinish) {
            onFinish();
        }
    };
    var tween = new Tween(params);
    tween.play();
};
const Easings = {
    BackEaseIn(t, b, c, d) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    BackEaseOut(t, b, c, d) {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    BackEaseInOut(t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    ElasticEaseIn(t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (-(a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
    },
    ElasticEaseOut(t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b);
    },
    ElasticEaseInOut(t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        if (t < 1) {
            return (-0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b);
        }
        return (a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
            0.5 +
            c +
            b);
    },
    BounceEaseOut(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    BounceEaseIn(t, b, c, d) {
        return c - Easings.BounceEaseOut(d - t, 0, c, d) + b;
    },
    BounceEaseInOut(t, b, c, d) {
        if (t < d / 2) {
            return Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        }
        else {
            return Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    EaseIn(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    EaseOut(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    EaseInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t + b;
        }
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    StrongEaseIn(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    StrongEaseOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    StrongEaseInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t * t * t + b;
        }
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    Linear(t, b, c, d) {
        return (c * t) / d + b;
    },
};


/***/ }),

/***/ "./node_modules/konva/lib/Util.js":
/*!****************************************!*\
  !*** ./node_modules/konva/lib/Util.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Transform": () => (/* binding */ Transform),
/* harmony export */   "Util": () => (/* binding */ Util)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");

class Transform {
    constructor(m = [1, 0, 0, 1, 0, 0]) {
        this.dirty = false;
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    reset() {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 1;
        this.m[4] = 0;
        this.m[5] = 0;
    }
    copy() {
        return new Transform(this.m);
    }
    copyInto(tr) {
        tr.m[0] = this.m[0];
        tr.m[1] = this.m[1];
        tr.m[2] = this.m[2];
        tr.m[3] = this.m[3];
        tr.m[4] = this.m[4];
        tr.m[5] = this.m[5];
    }
    point(point) {
        var m = this.m;
        return {
            x: m[0] * point.x + m[2] * point.y + m[4],
            y: m[1] * point.x + m[3] * point.y + m[5],
        };
    }
    translate(x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    }
    scale(sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    }
    rotate(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.m[0] * c + this.m[2] * s;
        var m12 = this.m[1] * c + this.m[3] * s;
        var m21 = this.m[0] * -s + this.m[2] * c;
        var m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    getTranslation() {
        return {
            x: this.m[4],
            y: this.m[5],
        };
    }
    skew(sx, sy) {
        var m11 = this.m[0] + this.m[2] * sy;
        var m12 = this.m[1] + this.m[3] * sy;
        var m21 = this.m[2] + this.m[0] * sx;
        var m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    multiply(matrix) {
        var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
        var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
        var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    }
    invert() {
        var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        var m0 = this.m[3] * d;
        var m1 = -this.m[1] * d;
        var m2 = -this.m[2] * d;
        var m3 = this.m[0] * d;
        var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    }
    getMatrix() {
        return this.m;
    }
    decompose() {
        var a = this.m[0];
        var b = this.m[1];
        var c = this.m[2];
        var d = this.m[3];
        var e = this.m[4];
        var f = this.m[5];
        var delta = a * d - b * c;
        let result = {
            x: e,
            y: f,
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
        };
        if (a != 0 || b != 0) {
            var r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = (a * c + b * d) / delta;
            result.skewY = 0;
        }
        else if (c != 0 || d != 0) {
            var s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s;
            result.scaleY = s;
            result.skewX = 0;
            result.skewY = (a * c + b * d) / delta;
        }
        else {
        }
        result.rotation = Util._getRotation(result.rotation);
        return result;
    }
}
var OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 132, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 255, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 203],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [119, 128, 144],
    slategrey: [119, 128, 144],
    snow: [255, 255, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    transparent: [255, 255, 255, 0],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 5],
}, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/, animQueue = [];
const req = (typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame) ||
    function (f) {
        setTimeout(f, 60);
    };
const Util = {
    _isElement(obj) {
        return !!(obj && obj.nodeType == 1);
    },
    _isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    _isPlainObject(obj) {
        return !!obj && obj.constructor === Object;
    },
    _isArray(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
    },
    _isNumber(obj) {
        return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
            !isNaN(obj) &&
            isFinite(obj));
    },
    _isString(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_STRING;
    },
    _isBoolean(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
    },
    isObject(val) {
        return val instanceof Object;
    },
    isValidSelector(selector) {
        if (typeof selector !== 'string') {
            return false;
        }
        var firstChar = selector[0];
        return (firstChar === '#' ||
            firstChar === '.' ||
            firstChar === firstChar.toUpperCase());
    },
    _sign(number) {
        if (number === 0) {
            return 1;
        }
        if (number > 0) {
            return 1;
        }
        else {
            return -1;
        }
    },
    requestAnimFrame(callback) {
        animQueue.push(callback);
        if (animQueue.length === 1) {
            req(function () {
                const queue = animQueue;
                animQueue = [];
                queue.forEach(function (cb) {
                    cb();
                });
            });
        }
    },
    createCanvasElement() {
        var canvas = document.createElement('canvas');
        try {
            canvas.style = canvas.style || {};
        }
        catch (e) { }
        return canvas;
    },
    createImageElement() {
        return document.createElement('img');
    },
    _isInDocument(el) {
        while ((el = el.parentNode)) {
            if (el == document) {
                return true;
            }
        }
        return false;
    },
    _urlToImage(url, callback) {
        var imageObj = Util.createImageElement();
        imageObj.onload = function () {
            callback(imageObj);
        };
        imageObj.src = url;
    },
    _rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(hex) {
        hex = hex.replace(HASH, EMPTY_STRING);
        var bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    },
    getRandomColor() {
        var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = ZERO + randColor;
        }
        return HASH + randColor;
    },
    getRGB(color) {
        var rgb;
        if (color in COLORS) {
            rgb = COLORS[color];
            return {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
            };
        }
        else if (color[0] === HASH) {
            return this._hexToRgb(color.substring(1));
        }
        else if (color.substr(0, 4) === RGB_PAREN) {
            rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
            return {
                r: parseInt(rgb[1], 10),
                g: parseInt(rgb[2], 10),
                b: parseInt(rgb[3], 10),
            };
        }
        else {
            return {
                r: 0,
                g: 0,
                b: 0,
            };
        }
    },
    colorToRGBA(str) {
        str = str || 'black';
        return (Util._namedColorToRBA(str) ||
            Util._hex3ColorToRGBA(str) ||
            Util._hex6ColorToRGBA(str) ||
            Util._rgbColorToRGBA(str) ||
            Util._rgbaColorToRGBA(str) ||
            Util._hslColorToRGBA(str));
    },
    _namedColorToRBA(str) {
        var c = COLORS[str.toLowerCase()];
        if (!c) {
            return null;
        }
        return {
            r: c[0],
            g: c[1],
            b: c[2],
            a: 1,
        };
    },
    _rgbColorToRGBA(str) {
        if (str.indexOf('rgb(') === 0) {
            str = str.match(/rgb\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: 1,
            };
        }
    },
    _rgbaColorToRGBA(str) {
        if (str.indexOf('rgba(') === 0) {
            str = str.match(/rgba\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map((n, index) => {
                if (n.slice(-1) === '%') {
                    return index === 3 ? parseInt(n) / 100 : (parseInt(n) / 100) * 255;
                }
                return Number(n);
            });
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: parts[3],
            };
        }
    },
    _hex6ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 7) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: 1,
            };
        }
    },
    _hex3ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 4) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: 1,
            };
        }
    },
    _hslColorToRGBA(str) {
        if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
            const [_, ...hsl] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str);
            const h = Number(hsl[0]) / 360;
            const s = Number(hsl[1]) / 100;
            const l = Number(hsl[2]) / 100;
            let t2;
            let t3;
            let val;
            if (s === 0) {
                val = l * 255;
                return {
                    r: Math.round(val),
                    g: Math.round(val),
                    b: Math.round(val),
                    a: 1,
                };
            }
            if (l < 0.5) {
                t2 = l * (1 + s);
            }
            else {
                t2 = l + s - l * s;
            }
            const t1 = 2 * l - t2;
            const rgb = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                t3 = h + (1 / 3) * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }
                if (t3 > 1) {
                    t3--;
                }
                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                }
                else if (2 * t3 < 1) {
                    val = t2;
                }
                else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                }
                else {
                    val = t1;
                }
                rgb[i] = val * 255;
            }
            return {
                r: Math.round(rgb[0]),
                g: Math.round(rgb[1]),
                b: Math.round(rgb[2]),
                a: 1,
            };
        }
    },
    haveIntersection(r1, r2) {
        return !(r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y);
    },
    cloneObject(obj) {
        var retObj = {};
        for (var key in obj) {
            if (this._isPlainObject(obj[key])) {
                retObj[key] = this.cloneObject(obj[key]);
            }
            else if (this._isArray(obj[key])) {
                retObj[key] = this.cloneArray(obj[key]);
            }
            else {
                retObj[key] = obj[key];
            }
        }
        return retObj;
    },
    cloneArray(arr) {
        return arr.slice(0);
    },
    degToRad(deg) {
        return deg * PI_OVER_DEG180;
    },
    radToDeg(rad) {
        return rad * DEG180_OVER_PI;
    },
    _degToRad(deg) {
        Util.warn('Util._degToRad is removed. Please use public Util.degToRad instead.');
        return Util.degToRad(deg);
    },
    _radToDeg(rad) {
        Util.warn('Util._radToDeg is removed. Please use public Util.radToDeg instead.');
        return Util.radToDeg(rad);
    },
    _getRotation(radians) {
        return _Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.angleDeg ? Util.radToDeg(radians) : radians;
    },
    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    throw(str) {
        throw new Error(KONVA_ERROR + str);
    },
    error(str) {
        console.error(KONVA_ERROR + str);
    },
    warn(str) {
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.showWarnings) {
            return;
        }
        console.warn(KONVA_WARNING + str);
    },
    each(obj, func) {
        for (var key in obj) {
            func(key, obj[key]);
        }
    },
    _inRange(val, left, right) {
        return left <= val && val < right;
    },
    _getProjectionToSegment(x1, y1, x2, y2, x3, y3) {
        var x, y, dist;
        var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (pd2 == 0) {
            x = x1;
            y = y1;
            dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
        }
        else {
            var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
            if (u < 0) {
                x = x1;
                y = y1;
                dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
            }
            else if (u > 1.0) {
                x = x2;
                y = y2;
                dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
            }
            else {
                x = x1 + u * (x2 - x1);
                y = y1 + u * (y2 - y1);
                dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
            }
        }
        return [x, y, dist];
    },
    _getProjectionToLine(pt, line, isClosed) {
        var pc = Util.cloneObject(pt);
        var dist = Number.MAX_VALUE;
        line.forEach(function (p1, i) {
            if (!isClosed && i === line.length - 1) {
                return;
            }
            var p2 = line[(i + 1) % line.length];
            var proj = Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
            var px = proj[0], py = proj[1], pdist = proj[2];
            if (pdist < dist) {
                pc.x = px;
                pc.y = py;
                dist = pdist;
            }
        });
        return pc;
    },
    _prepareArrayForTween(startArray, endArray, isClosed) {
        var n, start = [], end = [];
        if (startArray.length > endArray.length) {
            var temp = endArray;
            endArray = startArray;
            startArray = temp;
        }
        for (n = 0; n < startArray.length; n += 2) {
            start.push({
                x: startArray[n],
                y: startArray[n + 1],
            });
        }
        for (n = 0; n < endArray.length; n += 2) {
            end.push({
                x: endArray[n],
                y: endArray[n + 1],
            });
        }
        var newStart = [];
        end.forEach(function (point) {
            var pr = Util._getProjectionToLine(point, start, isClosed);
            newStart.push(pr.x);
            newStart.push(pr.y);
        });
        return newStart;
    },
    _prepareToStringify(obj) {
        var desc;
        obj.visitedByCircularReferenceRemoval = true;
        for (var key in obj) {
            if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                continue;
            }
            desc = Object.getOwnPropertyDescriptor(obj, key);
            if (obj[key].visitedByCircularReferenceRemoval ||
                Util._isElement(obj[key])) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
            else if (Util._prepareToStringify(obj[key]) === null) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
        }
        delete obj.visitedByCircularReferenceRemoval;
        return obj;
    },
    _assign(target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    },
    _getFirstPointerId(evt) {
        if (!evt.touches) {
            return evt.pointerId || 999;
        }
        else {
            return evt.changedTouches[0].identifier;
        }
    },
};


/***/ }),

/***/ "./node_modules/konva/lib/Validators.js":
/*!**********************************************!*\
  !*** ./node_modules/konva/lib/Validators.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RGBComponent": () => (/* binding */ RGBComponent),
/* harmony export */   "alphaComponent": () => (/* binding */ alphaComponent),
/* harmony export */   "getBooleanValidator": () => (/* binding */ getBooleanValidator),
/* harmony export */   "getComponentValidator": () => (/* binding */ getComponentValidator),
/* harmony export */   "getFunctionValidator": () => (/* binding */ getFunctionValidator),
/* harmony export */   "getNumberArrayValidator": () => (/* binding */ getNumberArrayValidator),
/* harmony export */   "getNumberOrArrayOfNumbersValidator": () => (/* binding */ getNumberOrArrayOfNumbersValidator),
/* harmony export */   "getNumberOrAutoValidator": () => (/* binding */ getNumberOrAutoValidator),
/* harmony export */   "getNumberValidator": () => (/* binding */ getNumberValidator),
/* harmony export */   "getStringOrGradientValidator": () => (/* binding */ getStringOrGradientValidator),
/* harmony export */   "getStringValidator": () => (/* binding */ getStringValidator)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");


function _formatValue(val) {
    if (_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isString(val)) {
        return '"' + val + '"';
    }
    if (Object.prototype.toString.call(val) === '[object Number]') {
        return val;
    }
    if (_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isBoolean(val)) {
        return val;
    }
    return Object.prototype.toString.call(val);
}
function RGBComponent(val) {
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    return Math.round(val);
}
function alphaComponent(val) {
    if (val > 1) {
        return 1;
    }
    else if (val < 0.0001) {
        return 0.0001;
    }
    return val;
}
function getNumberValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number.');
            }
            return val;
        };
    }
}
function getNumberOrArrayOfNumbersValidator(noOfElements) {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            let isNumber = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(val);
            let isValidArray = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isArray(val) && val.length == noOfElements;
            if (!isNumber && !isValidArray) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or Array<number>(' +
                    noOfElements +
                    ')');
            }
            return val;
        };
    }
}
function getNumberOrAutoValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            var isNumber = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(val);
            var isAuto = val === 'auto';
            if (!(isNumber || isAuto)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or "auto".');
            }
            return val;
        };
    }
}
function getStringValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isString(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string.');
            }
            return val;
        };
    }
}
function getStringOrGradientValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            const isString = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isString(val);
            const isGradient = Object.prototype.toString.call(val) === '[object CanvasGradient]' ||
                (val && val.addColorStop);
            if (!(isString || isGradient)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string or a native gradient.');
            }
            return val;
        };
    }
}
function getFunctionValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isFunction(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a function.');
            }
            return val;
        };
    }
}
function getNumberArrayValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isArray(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a array of numbers.');
            }
            else {
                val.forEach(function (item) {
                    if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._isNumber(item)) {
                        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn('"' +
                            attr +
                            '" attribute has non numeric element ' +
                            item +
                            '. Make sure that all elements are numbers.');
                    }
                });
            }
            return val;
        };
    }
}
function getBooleanValidator() {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            var isBool = val === true || val === false;
            if (!isBool) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a boolean.');
            }
            return val;
        };
    }
}
function getComponentValidator(components) {
    if (_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva.isUnminified) {
        return function (val, attr) {
            if (!_Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.isObject(val)) {
                _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be an object with properties ' +
                    components);
            }
            return val;
        };
    }
}


/***/ }),

/***/ "./node_modules/konva/lib/_CoreInternals.js":
/*!**************************************************!*\
  !*** ./node_modules/konva/lib/_CoreInternals.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Konva": () => (/* binding */ Konva),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Container_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Container.js */ "./node_modules/konva/lib/Container.js");
/* harmony import */ var _Stage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Stage.js */ "./node_modules/konva/lib/Stage.js");
/* harmony import */ var _Layer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Layer.js */ "./node_modules/konva/lib/Layer.js");
/* harmony import */ var _FastLayer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FastLayer.js */ "./node_modules/konva/lib/FastLayer.js");
/* harmony import */ var _Group_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Group.js */ "./node_modules/konva/lib/Group.js");
/* harmony import */ var _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DragAndDrop.js */ "./node_modules/konva/lib/DragAndDrop.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Animation_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Animation.js */ "./node_modules/konva/lib/Animation.js");
/* harmony import */ var _Tween_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Tween.js */ "./node_modules/konva/lib/Tween.js");
/* harmony import */ var _Context_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Context.js */ "./node_modules/konva/lib/Context.js");
/* harmony import */ var _Canvas_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Canvas.js */ "./node_modules/konva/lib/Canvas.js");














const Konva = _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util._assign(_Global_js__WEBPACK_IMPORTED_MODULE_0__.Konva, {
    Util: _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util,
    Transform: _Util_js__WEBPACK_IMPORTED_MODULE_1__.Transform,
    Node: _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node,
    Container: _Container_js__WEBPACK_IMPORTED_MODULE_3__.Container,
    Stage: _Stage_js__WEBPACK_IMPORTED_MODULE_4__.Stage,
    stages: _Stage_js__WEBPACK_IMPORTED_MODULE_4__.stages,
    Layer: _Layer_js__WEBPACK_IMPORTED_MODULE_5__.Layer,
    FastLayer: _FastLayer_js__WEBPACK_IMPORTED_MODULE_6__.FastLayer,
    Group: _Group_js__WEBPACK_IMPORTED_MODULE_7__.Group,
    DD: _DragAndDrop_js__WEBPACK_IMPORTED_MODULE_8__.DD,
    Shape: _Shape_js__WEBPACK_IMPORTED_MODULE_9__.Shape,
    shapes: _Shape_js__WEBPACK_IMPORTED_MODULE_9__.shapes,
    Animation: _Animation_js__WEBPACK_IMPORTED_MODULE_10__.Animation,
    Tween: _Tween_js__WEBPACK_IMPORTED_MODULE_11__.Tween,
    Easings: _Tween_js__WEBPACK_IMPORTED_MODULE_11__.Easings,
    Context: _Context_js__WEBPACK_IMPORTED_MODULE_12__.Context,
    Canvas: _Canvas_js__WEBPACK_IMPORTED_MODULE_13__.Canvas,
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Konva);


/***/ }),

/***/ "./node_modules/konva/lib/_FullInternals.js":
/*!**************************************************!*\
  !*** ./node_modules/konva/lib/_FullInternals.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Konva": () => (/* binding */ Konva)
/* harmony export */ });
/* harmony import */ var _CoreInternals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_CoreInternals.js */ "./node_modules/konva/lib/_CoreInternals.js");
/* harmony import */ var _shapes_Arc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shapes/Arc.js */ "./node_modules/konva/lib/shapes/Arc.js");
/* harmony import */ var _shapes_Arrow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shapes/Arrow.js */ "./node_modules/konva/lib/shapes/Arrow.js");
/* harmony import */ var _shapes_Circle_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shapes/Circle.js */ "./node_modules/konva/lib/shapes/Circle.js");
/* harmony import */ var _shapes_Ellipse_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shapes/Ellipse.js */ "./node_modules/konva/lib/shapes/Ellipse.js");
/* harmony import */ var _shapes_Image_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shapes/Image.js */ "./node_modules/konva/lib/shapes/Image.js");
/* harmony import */ var _shapes_Label_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shapes/Label.js */ "./node_modules/konva/lib/shapes/Label.js");
/* harmony import */ var _shapes_Line_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shapes/Line.js */ "./node_modules/konva/lib/shapes/Line.js");
/* harmony import */ var _shapes_Path_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shapes/Path.js */ "./node_modules/konva/lib/shapes/Path.js");
/* harmony import */ var _shapes_Rect_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./shapes/Rect.js */ "./node_modules/konva/lib/shapes/Rect.js");
/* harmony import */ var _shapes_RegularPolygon_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shapes/RegularPolygon.js */ "./node_modules/konva/lib/shapes/RegularPolygon.js");
/* harmony import */ var _shapes_Ring_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shapes/Ring.js */ "./node_modules/konva/lib/shapes/Ring.js");
/* harmony import */ var _shapes_Sprite_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./shapes/Sprite.js */ "./node_modules/konva/lib/shapes/Sprite.js");
/* harmony import */ var _shapes_Star_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shapes/Star.js */ "./node_modules/konva/lib/shapes/Star.js");
/* harmony import */ var _shapes_Text_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./shapes/Text.js */ "./node_modules/konva/lib/shapes/Text.js");
/* harmony import */ var _shapes_TextPath_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./shapes/TextPath.js */ "./node_modules/konva/lib/shapes/TextPath.js");
/* harmony import */ var _shapes_Transformer_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./shapes/Transformer.js */ "./node_modules/konva/lib/shapes/Transformer.js");
/* harmony import */ var _shapes_Wedge_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./shapes/Wedge.js */ "./node_modules/konva/lib/shapes/Wedge.js");
/* harmony import */ var _filters_Blur_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./filters/Blur.js */ "./node_modules/konva/lib/filters/Blur.js");
/* harmony import */ var _filters_Brighten_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./filters/Brighten.js */ "./node_modules/konva/lib/filters/Brighten.js");
/* harmony import */ var _filters_Contrast_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./filters/Contrast.js */ "./node_modules/konva/lib/filters/Contrast.js");
/* harmony import */ var _filters_Emboss_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./filters/Emboss.js */ "./node_modules/konva/lib/filters/Emboss.js");
/* harmony import */ var _filters_Enhance_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./filters/Enhance.js */ "./node_modules/konva/lib/filters/Enhance.js");
/* harmony import */ var _filters_Grayscale_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./filters/Grayscale.js */ "./node_modules/konva/lib/filters/Grayscale.js");
/* harmony import */ var _filters_HSL_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./filters/HSL.js */ "./node_modules/konva/lib/filters/HSL.js");
/* harmony import */ var _filters_HSV_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./filters/HSV.js */ "./node_modules/konva/lib/filters/HSV.js");
/* harmony import */ var _filters_Invert_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./filters/Invert.js */ "./node_modules/konva/lib/filters/Invert.js");
/* harmony import */ var _filters_Kaleidoscope_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./filters/Kaleidoscope.js */ "./node_modules/konva/lib/filters/Kaleidoscope.js");
/* harmony import */ var _filters_Mask_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./filters/Mask.js */ "./node_modules/konva/lib/filters/Mask.js");
/* harmony import */ var _filters_Noise_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./filters/Noise.js */ "./node_modules/konva/lib/filters/Noise.js");
/* harmony import */ var _filters_Pixelate_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./filters/Pixelate.js */ "./node_modules/konva/lib/filters/Pixelate.js");
/* harmony import */ var _filters_Posterize_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./filters/Posterize.js */ "./node_modules/konva/lib/filters/Posterize.js");
/* harmony import */ var _filters_RGB_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./filters/RGB.js */ "./node_modules/konva/lib/filters/RGB.js");
/* harmony import */ var _filters_RGBA_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./filters/RGBA.js */ "./node_modules/konva/lib/filters/RGBA.js");
/* harmony import */ var _filters_Sepia_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./filters/Sepia.js */ "./node_modules/konva/lib/filters/Sepia.js");
/* harmony import */ var _filters_Solarize_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./filters/Solarize.js */ "./node_modules/konva/lib/filters/Solarize.js");
/* harmony import */ var _filters_Threshold_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./filters/Threshold.js */ "./node_modules/konva/lib/filters/Threshold.js");





































const Konva = _CoreInternals_js__WEBPACK_IMPORTED_MODULE_0__.Konva.Util._assign(_CoreInternals_js__WEBPACK_IMPORTED_MODULE_0__.Konva, {
    Arc: _shapes_Arc_js__WEBPACK_IMPORTED_MODULE_1__.Arc,
    Arrow: _shapes_Arrow_js__WEBPACK_IMPORTED_MODULE_2__.Arrow,
    Circle: _shapes_Circle_js__WEBPACK_IMPORTED_MODULE_3__.Circle,
    Ellipse: _shapes_Ellipse_js__WEBPACK_IMPORTED_MODULE_4__.Ellipse,
    Image: _shapes_Image_js__WEBPACK_IMPORTED_MODULE_5__.Image,
    Label: _shapes_Label_js__WEBPACK_IMPORTED_MODULE_6__.Label,
    Tag: _shapes_Label_js__WEBPACK_IMPORTED_MODULE_6__.Tag,
    Line: _shapes_Line_js__WEBPACK_IMPORTED_MODULE_7__.Line,
    Path: _shapes_Path_js__WEBPACK_IMPORTED_MODULE_8__.Path,
    Rect: _shapes_Rect_js__WEBPACK_IMPORTED_MODULE_9__.Rect,
    RegularPolygon: _shapes_RegularPolygon_js__WEBPACK_IMPORTED_MODULE_10__.RegularPolygon,
    Ring: _shapes_Ring_js__WEBPACK_IMPORTED_MODULE_11__.Ring,
    Sprite: _shapes_Sprite_js__WEBPACK_IMPORTED_MODULE_12__.Sprite,
    Star: _shapes_Star_js__WEBPACK_IMPORTED_MODULE_13__.Star,
    Text: _shapes_Text_js__WEBPACK_IMPORTED_MODULE_14__.Text,
    TextPath: _shapes_TextPath_js__WEBPACK_IMPORTED_MODULE_15__.TextPath,
    Transformer: _shapes_Transformer_js__WEBPACK_IMPORTED_MODULE_16__.Transformer,
    Wedge: _shapes_Wedge_js__WEBPACK_IMPORTED_MODULE_17__.Wedge,
    Filters: {
        Blur: _filters_Blur_js__WEBPACK_IMPORTED_MODULE_18__.Blur,
        Brighten: _filters_Brighten_js__WEBPACK_IMPORTED_MODULE_19__.Brighten,
        Contrast: _filters_Contrast_js__WEBPACK_IMPORTED_MODULE_20__.Contrast,
        Emboss: _filters_Emboss_js__WEBPACK_IMPORTED_MODULE_21__.Emboss,
        Enhance: _filters_Enhance_js__WEBPACK_IMPORTED_MODULE_22__.Enhance,
        Grayscale: _filters_Grayscale_js__WEBPACK_IMPORTED_MODULE_23__.Grayscale,
        HSL: _filters_HSL_js__WEBPACK_IMPORTED_MODULE_24__.HSL,
        HSV: _filters_HSV_js__WEBPACK_IMPORTED_MODULE_25__.HSV,
        Invert: _filters_Invert_js__WEBPACK_IMPORTED_MODULE_26__.Invert,
        Kaleidoscope: _filters_Kaleidoscope_js__WEBPACK_IMPORTED_MODULE_27__.Kaleidoscope,
        Mask: _filters_Mask_js__WEBPACK_IMPORTED_MODULE_28__.Mask,
        Noise: _filters_Noise_js__WEBPACK_IMPORTED_MODULE_29__.Noise,
        Pixelate: _filters_Pixelate_js__WEBPACK_IMPORTED_MODULE_30__.Pixelate,
        Posterize: _filters_Posterize_js__WEBPACK_IMPORTED_MODULE_31__.Posterize,
        RGB: _filters_RGB_js__WEBPACK_IMPORTED_MODULE_32__.RGB,
        RGBA: _filters_RGBA_js__WEBPACK_IMPORTED_MODULE_33__.RGBA,
        Sepia: _filters_Sepia_js__WEBPACK_IMPORTED_MODULE_34__.Sepia,
        Solarize: _filters_Solarize_js__WEBPACK_IMPORTED_MODULE_35__.Solarize,
        Threshold: _filters_Threshold_js__WEBPACK_IMPORTED_MODULE_36__.Threshold,
    },
});


/***/ }),

/***/ "./node_modules/konva/lib/filters/Blur.js":
/*!************************************************!*\
  !*** ./node_modules/konva/lib/filters/Blur.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Blur": () => (/* binding */ Blur)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}
var mul_table = [
    512,
    512,
    456,
    512,
    328,
    456,
    335,
    512,
    405,
    328,
    271,
    456,
    388,
    335,
    292,
    512,
    454,
    405,
    364,
    328,
    298,
    271,
    496,
    456,
    420,
    388,
    360,
    335,
    312,
    292,
    273,
    512,
    482,
    454,
    428,
    405,
    383,
    364,
    345,
    328,
    312,
    298,
    284,
    271,
    259,
    496,
    475,
    456,
    437,
    420,
    404,
    388,
    374,
    360,
    347,
    335,
    323,
    312,
    302,
    292,
    282,
    273,
    265,
    512,
    497,
    482,
    468,
    454,
    441,
    428,
    417,
    405,
    394,
    383,
    373,
    364,
    354,
    345,
    337,
    328,
    320,
    312,
    305,
    298,
    291,
    284,
    278,
    271,
    265,
    259,
    507,
    496,
    485,
    475,
    465,
    456,
    446,
    437,
    428,
    420,
    412,
    404,
    396,
    388,
    381,
    374,
    367,
    360,
    354,
    347,
    341,
    335,
    329,
    323,
    318,
    312,
    307,
    302,
    297,
    292,
    287,
    282,
    278,
    273,
    269,
    265,
    261,
    512,
    505,
    497,
    489,
    482,
    475,
    468,
    461,
    454,
    447,
    441,
    435,
    428,
    422,
    417,
    411,
    405,
    399,
    394,
    389,
    383,
    378,
    373,
    368,
    364,
    359,
    354,
    350,
    345,
    341,
    337,
    332,
    328,
    324,
    320,
    316,
    312,
    309,
    305,
    301,
    298,
    294,
    291,
    287,
    284,
    281,
    278,
    274,
    271,
    268,
    265,
    262,
    259,
    257,
    507,
    501,
    496,
    491,
    485,
    480,
    475,
    470,
    465,
    460,
    456,
    451,
    446,
    442,
    437,
    433,
    428,
    424,
    420,
    416,
    412,
    408,
    404,
    400,
    396,
    392,
    388,
    385,
    381,
    377,
    374,
    370,
    367,
    363,
    360,
    357,
    354,
    350,
    347,
    344,
    341,
    338,
    335,
    332,
    329,
    326,
    323,
    320,
    318,
    315,
    312,
    310,
    307,
    304,
    302,
    299,
    297,
    294,
    292,
    289,
    287,
    285,
    282,
    280,
    278,
    275,
    273,
    271,
    269,
    267,
    265,
    263,
    261,
    259,
];
var shg_table = [
    9,
    11,
    12,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
];
function filterGaussBlurRGBA(imageData, radius) {
    var pixels = imageData.data, width = imageData.width, height = imageData.height;
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
    var div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2, stackStart = new BlurStack(), stackEnd = null, stack = stackStart, stackIn = null, stackOut = null, mul_sum = mul_table[radius], shg_sum = shg_table[radius];
    for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;
    yw = yi = 0;
    for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        for (i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
        }
        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
            pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa !== 0) {
                pa = 255 / pa;
                pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];
            a_in_sum += stackIn.a = pixels[p + 3];
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += 4;
        }
        yw += width;
    }
    for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        yp = width;
        for (i = 1; i <= radius; i++) {
            yi = (yp + x) << 2;
            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
            if (i < heightMinus1) {
                yp += width;
            }
        }
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa > 0) {
                pa = 255 / pa;
                pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p =
                (x +
                    ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) <<
                    2;
            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];
            a_sum += a_in_sum += stackIn.a = pixels[p + 3];
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += width;
        }
    }
}
const Blur = function Blur(imageData) {
    var radius = Math.round(this.blurRadius());
    if (radius > 0) {
        filterGaussBlurRGBA(imageData, radius);
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'blurRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Brighten.js":
/*!****************************************************!*\
  !*** ./node_modules/konva/lib/filters/Brighten.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Brighten": () => (/* binding */ Brighten)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const Brighten = function (imageData) {
    var brightness = this.brightness() * 255, data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 4) {
        data[i] += brightness;
        data[i + 1] += brightness;
        data[i + 2] += brightness;
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'brightness', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Contrast.js":
/*!****************************************************!*\
  !*** ./node_modules/konva/lib/filters/Contrast.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Contrast": () => (/* binding */ Contrast)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const Contrast = function (imageData) {
    var adjust = Math.pow((this.contrast() + 100) / 100, 2);
    var data = imageData.data, nPixels = data.length, red = 150, green = 150, blue = 150, i;
    for (i = 0; i < nPixels; i += 4) {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        red /= 255;
        red -= 0.5;
        red *= adjust;
        red += 0.5;
        red *= 255;
        green /= 255;
        green -= 0.5;
        green *= adjust;
        green += 0.5;
        green *= 255;
        blue /= 255;
        blue -= 0.5;
        blue *= adjust;
        blue += 0.5;
        blue *= 255;
        red = red < 0 ? 0 : red > 255 ? 255 : red;
        green = green < 0 ? 0 : green > 255 ? 255 : green;
        blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'contrast', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Emboss.js":
/*!**************************************************!*\
  !*** ./node_modules/konva/lib/filters/Emboss.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Emboss": () => (/* binding */ Emboss)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");




const Emboss = function (imageData) {
    var strength = this.embossStrength() * 10, greyLevel = this.embossWhiteLevel() * 255, direction = this.embossDirection(), blend = this.embossBlend(), dirY = 0, dirX = 0, data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
    switch (direction) {
        case 'top-left':
            dirY = -1;
            dirX = -1;
            break;
        case 'top':
            dirY = -1;
            dirX = 0;
            break;
        case 'top-right':
            dirY = -1;
            dirX = 1;
            break;
        case 'right':
            dirY = 0;
            dirX = 1;
            break;
        case 'bottom-right':
            dirY = 1;
            dirX = 1;
            break;
        case 'bottom':
            dirY = 1;
            dirX = 0;
            break;
        case 'bottom-left':
            dirY = 1;
            dirX = -1;
            break;
        case 'left':
            dirY = 0;
            dirX = -1;
            break;
        default:
            _Util_js__WEBPACK_IMPORTED_MODULE_2__.Util.error('Unknown emboss direction: ' + direction);
    }
    do {
        var offsetY = (y - 1) * w4;
        var otherY = dirY;
        if (y + otherY < 1) {
            otherY = 0;
        }
        if (y + otherY > h) {
            otherY = 0;
        }
        var offsetYOther = (y - 1 + otherY) * w * 4;
        var x = w;
        do {
            var offset = offsetY + (x - 1) * 4;
            var otherX = dirX;
            if (x + otherX < 1) {
                otherX = 0;
            }
            if (x + otherX > w) {
                otherX = 0;
            }
            var offsetOther = offsetYOther + (x - 1 + otherX) * 4;
            var dR = data[offset] - data[offsetOther];
            var dG = data[offset + 1] - data[offsetOther + 1];
            var dB = data[offset + 2] - data[offsetOther + 2];
            var dif = dR;
            var absDif = dif > 0 ? dif : -dif;
            var absG = dG > 0 ? dG : -dG;
            var absB = dB > 0 ? dB : -dB;
            if (absG > absDif) {
                dif = dG;
            }
            if (absB > absDif) {
                dif = dB;
            }
            dif *= strength;
            if (blend) {
                var r = data[offset] + dif;
                var g = data[offset + 1] + dif;
                var b = data[offset + 2] + dif;
                data[offset] = r > 255 ? 255 : r < 0 ? 0 : r;
                data[offset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
                data[offset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
            }
            else {
                var grey = greyLevel - dif;
                if (grey < 0) {
                    grey = 0;
                }
                else if (grey > 255) {
                    grey = 255;
                }
                data[offset] = data[offset + 1] = data[offset + 2] = grey;
            }
        } while (--x);
    } while (--y);
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'embossStrength', 0.5, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'embossWhiteLevel', 0.5, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'embossDirection', 'top-left', null, _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'embossBlend', false, null, _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Enhance.js":
/*!***************************************************!*\
  !*** ./node_modules/konva/lib/filters/Enhance.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Enhance": () => (/* binding */ Enhance)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



function remap(fromValue, fromMin, fromMax, toMin, toMax) {
    var fromRange = fromMax - fromMin, toRange = toMax - toMin, toValue;
    if (fromRange === 0) {
        return toMin + toRange / 2;
    }
    if (toRange === 0) {
        return toMin;
    }
    toValue = (fromValue - fromMin) / fromRange;
    toValue = toRange * toValue + toMin;
    return toValue;
}
const Enhance = function (imageData) {
    var data = imageData.data, nSubPixels = data.length, rMin = data[0], rMax = rMin, r, gMin = data[1], gMax = gMin, g, bMin = data[2], bMax = bMin, b, i;
    var enhanceAmount = this.enhance();
    if (enhanceAmount === 0) {
        return;
    }
    for (i = 0; i < nSubPixels; i += 4) {
        r = data[i + 0];
        if (r < rMin) {
            rMin = r;
        }
        else if (r > rMax) {
            rMax = r;
        }
        g = data[i + 1];
        if (g < gMin) {
            gMin = g;
        }
        else if (g > gMax) {
            gMax = g;
        }
        b = data[i + 2];
        if (b < bMin) {
            bMin = b;
        }
        else if (b > bMax) {
            bMax = b;
        }
    }
    if (rMax === rMin) {
        rMax = 255;
        rMin = 0;
    }
    if (gMax === gMin) {
        gMax = 255;
        gMin = 0;
    }
    if (bMax === bMin) {
        bMax = 255;
        bMin = 0;
    }
    var rMid, rGoalMax, rGoalMin, gMid, gGoalMax, gGoalMin, bMid, bGoalMax, bGoalMin;
    if (enhanceAmount > 0) {
        rGoalMax = rMax + enhanceAmount * (255 - rMax);
        rGoalMin = rMin - enhanceAmount * (rMin - 0);
        gGoalMax = gMax + enhanceAmount * (255 - gMax);
        gGoalMin = gMin - enhanceAmount * (gMin - 0);
        bGoalMax = bMax + enhanceAmount * (255 - bMax);
        bGoalMin = bMin - enhanceAmount * (bMin - 0);
    }
    else {
        rMid = (rMax + rMin) * 0.5;
        rGoalMax = rMax + enhanceAmount * (rMax - rMid);
        rGoalMin = rMin + enhanceAmount * (rMin - rMid);
        gMid = (gMax + gMin) * 0.5;
        gGoalMax = gMax + enhanceAmount * (gMax - gMid);
        gGoalMin = gMin + enhanceAmount * (gMin - gMid);
        bMid = (bMax + bMin) * 0.5;
        bGoalMax = bMax + enhanceAmount * (bMax - bMid);
        bGoalMin = bMin + enhanceAmount * (bMin - bMid);
    }
    for (i = 0; i < nSubPixels; i += 4) {
        data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
        data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
        data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'enhance', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Grayscale.js":
/*!*****************************************************!*\
  !*** ./node_modules/konva/lib/filters/Grayscale.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Grayscale": () => (/* binding */ Grayscale)
/* harmony export */ });
const Grayscale = function (imageData) {
    var data = imageData.data, len = data.length, i, brightness;
    for (i = 0; i < len; i += 4) {
        brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
    }
};


/***/ }),

/***/ "./node_modules/konva/lib/filters/HSL.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/filters/HSL.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HSL": () => (/* binding */ HSL)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'hue', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'saturation', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'luminance', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
const HSL = function (imageData) {
    var data = imageData.data, nPixels = data.length, v = 1, s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, l = this.luminance() * 127, i;
    var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    var r, g, b, a;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b + l;
        data[i + 1] = gr * r + gg * g + gb * b + l;
        data[i + 2] = br * r + bg * g + bb * b + l;
        data[i + 3] = a;
    }
};


/***/ }),

/***/ "./node_modules/konva/lib/filters/HSV.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/filters/HSV.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HSV": () => (/* binding */ HSV)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const HSV = function (imageData) {
    var data = imageData.data, nPixels = data.length, v = Math.pow(2, this.value()), s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, i;
    var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    var r, g, b, a;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b;
        data[i + 1] = gr * r + gg * g + gb * b;
        data[i + 2] = br * r + bg * g + bb * b;
        data[i + 3] = a;
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'hue', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'saturation', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'value', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Invert.js":
/*!**************************************************!*\
  !*** ./node_modules/konva/lib/filters/Invert.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Invert": () => (/* binding */ Invert)
/* harmony export */ });
const Invert = function (imageData) {
    var data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
};


/***/ }),

/***/ "./node_modules/konva/lib/filters/Kaleidoscope.js":
/*!********************************************************!*\
  !*** ./node_modules/konva/lib/filters/Kaleidoscope.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Kaleidoscope": () => (/* binding */ Kaleidoscope)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");




var ToPolar = function (src, dst, opt) {
    var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, r = 0, g = 0, b = 0, a = 0;
    var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
    x = xSize - xMid;
    y = ySize - yMid;
    rad = Math.sqrt(x * x + y * y);
    rMax = rad > rMax ? rad : rMax;
    var rSize = ySize, tSize = xSize, radius, theta;
    var conversion = ((360 / tSize) * Math.PI) / 180, sin, cos;
    for (theta = 0; theta < tSize; theta += 1) {
        sin = Math.sin(theta * conversion);
        cos = Math.cos(theta * conversion);
        for (radius = 0; radius < rSize; radius += 1) {
            x = Math.floor(xMid + ((rMax * radius) / rSize) * cos);
            y = Math.floor(yMid + ((rMax * radius) / rSize) * sin);
            i = (y * xSize + x) * 4;
            r = srcPixels[i + 0];
            g = srcPixels[i + 1];
            b = srcPixels[i + 2];
            a = srcPixels[i + 3];
            i = (theta + radius * xSize) * 4;
            dstPixels[i + 0] = r;
            dstPixels[i + 1] = g;
            dstPixels[i + 2] = b;
            dstPixels[i + 3] = a;
        }
    }
};
var FromPolar = function (src, dst, opt) {
    var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, dx, dy, r = 0, g = 0, b = 0, a = 0;
    var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
    x = xSize - xMid;
    y = ySize - yMid;
    rad = Math.sqrt(x * x + y * y);
    rMax = rad > rMax ? rad : rMax;
    var rSize = ySize, tSize = xSize, radius, theta, phaseShift = opt.polarRotation || 0;
    var x1, y1;
    for (x = 0; x < xSize; x += 1) {
        for (y = 0; y < ySize; y += 1) {
            dx = x - xMid;
            dy = y - yMid;
            radius = (Math.sqrt(dx * dx + dy * dy) * rSize) / rMax;
            theta = ((Math.atan2(dy, dx) * 180) / Math.PI + 360 + phaseShift) % 360;
            theta = (theta * tSize) / 360;
            x1 = Math.floor(theta);
            y1 = Math.floor(radius);
            i = (y1 * xSize + x1) * 4;
            r = srcPixels[i + 0];
            g = srcPixels[i + 1];
            b = srcPixels[i + 2];
            a = srcPixels[i + 3];
            i = (y * xSize + x) * 4;
            dstPixels[i + 0] = r;
            dstPixels[i + 1] = g;
            dstPixels[i + 2] = b;
            dstPixels[i + 3] = a;
        }
    }
};
const Kaleidoscope = function (imageData) {
    var xSize = imageData.width, ySize = imageData.height;
    var x, y, xoff, i, r, g, b, a, srcPos, dstPos;
    var power = Math.round(this.kaleidoscopePower());
    var angle = Math.round(this.kaleidoscopeAngle());
    var offset = Math.floor((xSize * (angle % 360)) / 360);
    if (power < 1) {
        return;
    }
    var tempCanvas = _Util_js__WEBPACK_IMPORTED_MODULE_2__.Util.createCanvasElement();
    tempCanvas.width = xSize;
    tempCanvas.height = ySize;
    var scratchData = tempCanvas
        .getContext('2d')
        .getImageData(0, 0, xSize, ySize);
    ToPolar(imageData, scratchData, {
        polarCenterX: xSize / 2,
        polarCenterY: ySize / 2,
    });
    var minSectionSize = xSize / Math.pow(2, power);
    while (minSectionSize <= 8) {
        minSectionSize = minSectionSize * 2;
        power -= 1;
    }
    minSectionSize = Math.ceil(minSectionSize);
    var sectionSize = minSectionSize;
    var xStart = 0, xEnd = sectionSize, xDelta = 1;
    if (offset + minSectionSize > xSize) {
        xStart = sectionSize;
        xEnd = 0;
        xDelta = -1;
    }
    for (y = 0; y < ySize; y += 1) {
        for (x = xStart; x !== xEnd; x += xDelta) {
            xoff = Math.round(x + offset) % xSize;
            srcPos = (xSize * y + xoff) * 4;
            r = scratchData.data[srcPos + 0];
            g = scratchData.data[srcPos + 1];
            b = scratchData.data[srcPos + 2];
            a = scratchData.data[srcPos + 3];
            dstPos = (xSize * y + x) * 4;
            scratchData.data[dstPos + 0] = r;
            scratchData.data[dstPos + 1] = g;
            scratchData.data[dstPos + 2] = b;
            scratchData.data[dstPos + 3] = a;
        }
    }
    for (y = 0; y < ySize; y += 1) {
        sectionSize = Math.floor(minSectionSize);
        for (i = 0; i < power; i += 1) {
            for (x = 0; x < sectionSize + 1; x += 1) {
                srcPos = (xSize * y + x) * 4;
                r = scratchData.data[srcPos + 0];
                g = scratchData.data[srcPos + 1];
                b = scratchData.data[srcPos + 2];
                a = scratchData.data[srcPos + 3];
                dstPos = (xSize * y + sectionSize * 2 - x - 1) * 4;
                scratchData.data[dstPos + 0] = r;
                scratchData.data[dstPos + 1] = g;
                scratchData.data[dstPos + 2] = b;
                scratchData.data[dstPos + 3] = a;
            }
            sectionSize *= 2;
        }
    }
    FromPolar(scratchData, imageData, { polarRotation: 0 });
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'kaleidoscopePower', 2, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'kaleidoscopeAngle', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Mask.js":
/*!************************************************!*\
  !*** ./node_modules/konva/lib/filters/Mask.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mask": () => (/* binding */ Mask)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



function pixelAt(idata, x, y) {
    var idx = (y * idata.width + x) * 4;
    var d = [];
    d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
    return d;
}
function rgbDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2));
}
function rgbMean(pTab) {
    var m = [0, 0, 0];
    for (var i = 0; i < pTab.length; i++) {
        m[0] += pTab[i][0];
        m[1] += pTab[i][1];
        m[2] += pTab[i][2];
    }
    m[0] /= pTab.length;
    m[1] /= pTab.length;
    m[2] /= pTab.length;
    return m;
}
function backgroundMask(idata, threshold) {
    var rgbv_no = pixelAt(idata, 0, 0);
    var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
    var rgbv_so = pixelAt(idata, 0, idata.height - 1);
    var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
    var thres = threshold || 10;
    if (rgbDistance(rgbv_no, rgbv_ne) < thres &&
        rgbDistance(rgbv_ne, rgbv_se) < thres &&
        rgbDistance(rgbv_se, rgbv_so) < thres &&
        rgbDistance(rgbv_so, rgbv_no) < thres) {
        var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
        var mask = [];
        for (var i = 0; i < idata.width * idata.height; i++) {
            var d = rgbDistance(mean, [
                idata.data[i * 4],
                idata.data[i * 4 + 1],
                idata.data[i * 4 + 2],
            ]);
            mask[i] = d < thres ? 0 : 255;
        }
        return mask;
    }
}
function applyMask(idata, mask) {
    for (var i = 0; i < idata.width * idata.height; i++) {
        idata.data[4 * i + 3] = mask[i];
    }
}
function erodeMask(mask, sw, sh) {
    var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a === 255 * 8 ? 255 : 0;
        }
    }
    return maskResult;
}
function dilateMask(mask, sw, sh) {
    var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a >= 255 * 4 ? 255 : 0;
        }
    }
    return maskResult;
}
function smoothEdgeMask(mask, sw, sh) {
    var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a;
        }
    }
    return maskResult;
}
const Mask = function (imageData) {
    var threshold = this.threshold(), mask = backgroundMask(imageData, threshold);
    if (mask) {
        mask = erodeMask(mask, imageData.width, imageData.height);
        mask = dilateMask(mask, imageData.width, imageData.height);
        mask = smoothEdgeMask(mask, imageData.width, imageData.height);
        applyMask(imageData, mask);
    }
    return imageData;
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'threshold', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Noise.js":
/*!*************************************************!*\
  !*** ./node_modules/konva/lib/filters/Noise.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Noise": () => (/* binding */ Noise)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const Noise = function (imageData) {
    var amount = this.noise() * 255, data = imageData.data, nPixels = data.length, half = amount / 2, i;
    for (i = 0; i < nPixels; i += 4) {
        data[i + 0] += half - 2 * half * Math.random();
        data[i + 1] += half - 2 * half * Math.random();
        data[i + 2] += half - 2 * half * Math.random();
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'noise', 0.2, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Pixelate.js":
/*!****************************************************!*\
  !*** ./node_modules/konva/lib/filters/Pixelate.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Pixelate": () => (/* binding */ Pixelate)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");




const Pixelate = function (imageData) {
    var pixelSize = Math.ceil(this.pixelSize()), width = imageData.width, height = imageData.height, x, y, i, red, green, blue, alpha, nBinsX = Math.ceil(width / pixelSize), nBinsY = Math.ceil(height / pixelSize), xBinStart, xBinEnd, yBinStart, yBinEnd, xBin, yBin, pixelsInBin, data = imageData.data;
    if (pixelSize <= 0) {
        _Util_js__WEBPACK_IMPORTED_MODULE_1__.Util.error('pixelSize value can not be <= 0');
        return;
    }
    for (xBin = 0; xBin < nBinsX; xBin += 1) {
        for (yBin = 0; yBin < nBinsY; yBin += 1) {
            red = 0;
            green = 0;
            blue = 0;
            alpha = 0;
            xBinStart = xBin * pixelSize;
            xBinEnd = xBinStart + pixelSize;
            yBinStart = yBin * pixelSize;
            yBinEnd = yBinStart + pixelSize;
            pixelsInBin = 0;
            for (x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    i = (width * y + x) * 4;
                    red += data[i + 0];
                    green += data[i + 1];
                    blue += data[i + 2];
                    alpha += data[i + 3];
                    pixelsInBin += 1;
                }
            }
            red = red / pixelsInBin;
            green = green / pixelsInBin;
            blue = blue / pixelsInBin;
            alpha = alpha / pixelsInBin;
            for (x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    i = (width * y + x) * 4;
                    data[i + 0] = red;
                    data[i + 1] = green;
                    data[i + 2] = blue;
                    data[i + 3] = alpha;
                }
            }
        }
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_2__.Node, 'pixelSize', 8, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/Posterize.js":
/*!*****************************************************!*\
  !*** ./node_modules/konva/lib/filters/Posterize.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Posterize": () => (/* binding */ Posterize)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const Posterize = function (imageData) {
    var levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels, i;
    for (i = 0; i < len; i += 1) {
        data[i] = Math.floor(data[i] / scale) * scale;
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'levels', 0.5, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/RGB.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/filters/RGB.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RGB": () => (/* binding */ RGB)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const RGB = function (imageData) {
    var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), i, brightness;
    for (i = 0; i < nPixels; i += 4) {
        brightness =
            (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
        data[i] = brightness * red;
        data[i + 1] = brightness * green;
        data[i + 2] = brightness * blue;
        data[i + 3] = data[i + 3];
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'blue', 0, _Validators_js__WEBPACK_IMPORTED_MODULE_2__.RGBComponent, _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/filters/RGBA.js":
/*!************************************************!*\
  !*** ./node_modules/konva/lib/filters/RGBA.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RGBA": () => (/* binding */ RGBA)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const RGBA = function (imageData) {
    var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha(), i, ia;
    for (i = 0; i < nPixels; i += 4) {
        ia = 1 - alpha;
        data[i] = red * alpha + data[i] * ia;
        data[i + 1] = green * alpha + data[i + 1] * ia;
        data[i + 2] = blue * alpha + data[i + 2] * ia;
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'blue', 0, _Validators_js__WEBPACK_IMPORTED_MODULE_2__.RGBComponent, _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'alpha', 1, function (val) {
    this._filterUpToDate = false;
    if (val > 1) {
        return 1;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return val;
    }
});


/***/ }),

/***/ "./node_modules/konva/lib/filters/Sepia.js":
/*!*************************************************!*\
  !*** ./node_modules/konva/lib/filters/Sepia.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sepia": () => (/* binding */ Sepia)
/* harmony export */ });
const Sepia = function (imageData) {
    var data = imageData.data, nPixels = data.length, i, r, g, b;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        data[i + 0] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
};


/***/ }),

/***/ "./node_modules/konva/lib/filters/Solarize.js":
/*!****************************************************!*\
  !*** ./node_modules/konva/lib/filters/Solarize.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Solarize": () => (/* binding */ Solarize)
/* harmony export */ });
const Solarize = function (imageData) {
    var data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
    do {
        var offsetY = (y - 1) * w4;
        var x = w;
        do {
            var offset = offsetY + (x - 1) * 4;
            var r = data[offset];
            var g = data[offset + 1];
            var b = data[offset + 2];
            if (r > 127) {
                r = 255 - r;
            }
            if (g > 127) {
                g = 255 - g;
            }
            if (b > 127) {
                b = 255 - b;
            }
            data[offset] = r;
            data[offset + 1] = g;
            data[offset + 2] = b;
        } while (--x);
    } while (--y);
};


/***/ }),

/***/ "./node_modules/konva/lib/filters/Threshold.js":
/*!*****************************************************!*\
  !*** ./node_modules/konva/lib/filters/Threshold.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Threshold": () => (/* binding */ Threshold)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");



const Threshold = function (imageData) {
    var level = this.threshold() * 255, data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 1) {
        data[i] = data[i] < level ? 0 : 255;
    }
};
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(_Node_js__WEBPACK_IMPORTED_MODULE_1__.Node, 'threshold', 0.5, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)(), _Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.afterSetFilter);


/***/ }),

/***/ "./node_modules/konva/lib/index.js":
/*!*****************************************!*\
  !*** ./node_modules/konva/lib/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FullInternals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_FullInternals.js */ "./node_modules/konva/lib/_FullInternals.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_FullInternals_js__WEBPACK_IMPORTED_MODULE_0__.Konva);


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Arc.js":
/*!**********************************************!*\
  !*** ./node_modules/konva/lib/shapes/Arc.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Arc": () => (/* binding */ Arc)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");





class Arc extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        var angle = _Global_js__WEBPACK_IMPORTED_MODULE_2__.Konva.getAngle(this.angle()), clockwise = this.clockwise();
        context.beginPath();
        context.arc(0, 0, this.outerRadius(), 0, angle, clockwise);
        context.arc(0, 0, this.innerRadius(), angle, 0, !clockwise);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        return this.outerRadius() * 2;
    }
    getHeight() {
        return this.outerRadius() * 2;
    }
    setWidth(width) {
        this.outerRadius(width / 2);
    }
    setHeight(height) {
        this.outerRadius(height / 2);
    }
    getSelfRect() {
        const innerRadius = this.innerRadius();
        const outerRadius = this.outerRadius();
        const clockwise = this.clockwise();
        const angle = _Global_js__WEBPACK_IMPORTED_MODULE_2__.Konva.getAngle(clockwise ? 360 - this.angle() : this.angle());
        const boundLeftRatio = Math.cos(Math.min(angle, Math.PI));
        const boundRightRatio = 1;
        const boundTopRatio = Math.sin(Math.min(Math.max(Math.PI, angle), (3 * Math.PI) / 2));
        const boundBottomRatio = Math.sin(Math.min(angle, Math.PI / 2));
        const boundLeft = boundLeftRatio * (boundLeftRatio > 0 ? innerRadius : outerRadius);
        const boundRight = boundRightRatio * (boundRightRatio > 0 ? outerRadius : innerRadius);
        const boundTop = boundTopRatio * (boundTopRatio > 0 ? innerRadius : outerRadius);
        const boundBottom = boundBottomRatio * (boundBottomRatio > 0 ? outerRadius : innerRadius);
        return {
            x: boundLeft,
            y: clockwise ? -1 * boundBottom : boundTop,
            width: boundRight - boundLeft,
            height: boundBottom - boundTop,
        };
    }
}
Arc.prototype._centroid = true;
Arc.prototype.className = 'Arc';
Arc.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(Arc);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arc, 'innerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arc, 'outerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arc, 'angle', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arc, 'clockwise', false, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getBooleanValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Arrow.js":
/*!************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Arrow.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Arrow": () => (/* binding */ Arrow)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Line_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Line.js */ "./node_modules/konva/lib/shapes/Line.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Path_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Path.js */ "./node_modules/konva/lib/shapes/Path.js");





class Arrow extends _Line_js__WEBPACK_IMPORTED_MODULE_1__.Line {
    _sceneFunc(ctx) {
        super._sceneFunc(ctx);
        var PI2 = Math.PI * 2;
        var points = this.points();
        var tp = points;
        var fromTension = this.tension() !== 0 && points.length > 4;
        if (fromTension) {
            tp = this.getTensionPoints();
        }
        var length = this.pointerLength();
        var n = points.length;
        var dx, dy;
        if (fromTension) {
            const lp = [
                tp[tp.length - 4],
                tp[tp.length - 3],
                tp[tp.length - 2],
                tp[tp.length - 1],
                points[n - 2],
                points[n - 1],
            ];
            const lastLength = _Path_js__WEBPACK_IMPORTED_MODULE_4__.Path.calcLength(tp[tp.length - 4], tp[tp.length - 3], 'C', lp);
            const previous = _Path_js__WEBPACK_IMPORTED_MODULE_4__.Path.getPointOnQuadraticBezier(Math.min(1, 1 - length / lastLength), lp[0], lp[1], lp[2], lp[3], lp[4], lp[5]);
            dx = points[n - 2] - previous.x;
            dy = points[n - 1] - previous.y;
        }
        else {
            dx = points[n - 2] - points[n - 4];
            dy = points[n - 1] - points[n - 3];
        }
        var radians = (Math.atan2(dy, dx) + PI2) % PI2;
        var width = this.pointerWidth();
        if (this.pointerAtEnding()) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(points[n - 2], points[n - 1]);
            ctx.rotate(radians);
            ctx.moveTo(0, 0);
            ctx.lineTo(-length, width / 2);
            ctx.lineTo(-length, -width / 2);
            ctx.closePath();
            ctx.restore();
            this.__fillStroke(ctx);
        }
        if (this.pointerAtBeginning()) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(points[0], points[1]);
            if (fromTension) {
                dx = (tp[0] + tp[2]) / 2 - points[0];
                dy = (tp[1] + tp[3]) / 2 - points[1];
            }
            else {
                dx = points[2] - points[0];
                dy = points[3] - points[1];
            }
            ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
            ctx.moveTo(0, 0);
            ctx.lineTo(-length, width / 2);
            ctx.lineTo(-length, -width / 2);
            ctx.closePath();
            ctx.restore();
            this.__fillStroke(ctx);
        }
    }
    __fillStroke(ctx) {
        var isDashEnabled = this.dashEnabled();
        if (isDashEnabled) {
            this.attrs.dashEnabled = false;
            ctx.setLineDash([]);
        }
        ctx.fillStrokeShape(this);
        if (isDashEnabled) {
            this.attrs.dashEnabled = true;
        }
    }
    getSelfRect() {
        const lineRect = super.getSelfRect();
        const offset = this.pointerWidth() / 2;
        return {
            x: lineRect.x - offset,
            y: lineRect.y - offset,
            width: lineRect.width + offset * 2,
            height: lineRect.height + offset * 2,
        };
    }
}
Arrow.prototype.className = 'Arrow';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Arrow);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arrow, 'pointerLength', 10, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arrow, 'pointerWidth', 10, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arrow, 'pointerAtBeginning', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Arrow, 'pointerAtEnding', true);


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Circle.js":
/*!*************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Circle.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Circle": () => (/* binding */ Circle)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");




class Circle extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        context.beginPath();
        context.arc(0, 0, this.attrs.radius || 0, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        return this.radius() * 2;
    }
    getHeight() {
        return this.radius() * 2;
    }
    setWidth(width) {
        if (this.radius() !== width / 2) {
            this.radius(width / 2);
        }
    }
    setHeight(height) {
        if (this.radius() !== height / 2) {
            this.radius(height / 2);
        }
    }
}
Circle.prototype._centroid = true;
Circle.prototype.className = 'Circle';
Circle.prototype._attrsAffectingSize = ['radius'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Circle);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Circle, 'radius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Ellipse.js":
/*!**************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Ellipse.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ellipse": () => (/* binding */ Ellipse)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");




class Ellipse extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        var rx = this.radiusX(), ry = this.radiusY();
        context.beginPath();
        context.save();
        if (rx !== ry) {
            context.scale(1, ry / rx);
        }
        context.arc(0, 0, rx, 0, Math.PI * 2, false);
        context.restore();
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        return this.radiusX() * 2;
    }
    getHeight() {
        return this.radiusY() * 2;
    }
    setWidth(width) {
        this.radiusX(width / 2);
    }
    setHeight(height) {
        this.radiusY(height / 2);
    }
}
Ellipse.prototype.className = 'Ellipse';
Ellipse.prototype._centroid = true;
Ellipse.prototype._attrsAffectingSize = ['radiusX', 'radiusY'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Ellipse);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addComponentsGetterSetter(Ellipse, 'radius', ['x', 'y']);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Ellipse, 'radiusX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Ellipse, 'radiusY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Image.js":
/*!************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Image.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Image": () => (/* binding */ Image)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");





class Image extends _Shape_js__WEBPACK_IMPORTED_MODULE_2__.Shape {
    constructor(attrs) {
        super(attrs);
        this.on('imageChange.konva', () => {
            this._setImageLoad();
        });
        this._setImageLoad();
    }
    _setImageLoad() {
        const image = this.image();
        if (image && image.complete) {
            return;
        }
        if (image && image.readyState === 4) {
            return;
        }
        if (image && image['addEventListener']) {
            image['addEventListener']('load', () => {
                this._requestDraw();
            });
        }
    }
    _useBufferCanvas() {
        return super._useBufferCanvas(true);
    }
    _sceneFunc(context) {
        const width = this.getWidth();
        const height = this.getHeight();
        const image = this.attrs.image;
        let params;
        if (image) {
            const cropWidth = this.attrs.cropWidth;
            const cropHeight = this.attrs.cropHeight;
            if (cropWidth && cropHeight) {
                params = [
                    image,
                    this.cropX(),
                    this.cropY(),
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    width,
                    height,
                ];
            }
            else {
                params = [image, 0, 0, width, height];
            }
        }
        if (this.hasFill() || this.hasStroke()) {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        if (image) {
            context.drawImage.apply(context, params);
        }
    }
    _hitFunc(context) {
        var width = this.width(), height = this.height();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        var _a, _b;
        return (_a = this.attrs.width) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.width;
    }
    getHeight() {
        var _a, _b;
        return (_a = this.attrs.height) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.height;
    }
    static fromURL(url, callback, onError = null) {
        var img = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createImageElement();
        img.onload = function () {
            var image = new Image({
                image: img,
            });
            callback(image);
        };
        img.onerror = onError;
        img.crossOrigin = 'Anonymous';
        img.src = url;
    }
}
Image.prototype.className = 'Image';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_4__._registerNode)(Image);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'image');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropX', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropY', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropWidth', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Image, 'cropHeight', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Label.js":
/*!************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Label.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Label": () => (/* binding */ Label),
/* harmony export */   "Tag": () => (/* binding */ Tag)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Group_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Group.js */ "./node_modules/konva/lib/Group.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");





var ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'padding',
    'lineHeight',
    'text',
    'width',
    'height',
], CHANGE_KONVA = 'Change.konva', NONE = 'none', UP = 'up', RIGHT = 'right', DOWN = 'down', LEFT = 'left', attrChangeListLen = ATTR_CHANGE_LIST.length;
class Label extends _Group_js__WEBPACK_IMPORTED_MODULE_2__.Group {
    constructor(config) {
        super(config);
        this.on('add.konva', function (evt) {
            this._addListeners(evt.child);
            this._sync();
        });
    }
    getText() {
        return this.find('Text')[0];
    }
    getTag() {
        return this.find('Tag')[0];
    }
    _addListeners(text) {
        var that = this, n;
        var func = function () {
            that._sync();
        };
        for (n = 0; n < attrChangeListLen; n++) {
            text.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, func);
        }
    }
    getWidth() {
        return this.getText().width();
    }
    getHeight() {
        return this.getText().height();
    }
    _sync() {
        var text = this.getText(), tag = this.getTag(), width, height, pointerDirection, pointerWidth, x, y, pointerHeight;
        if (text && tag) {
            width = text.width();
            height = text.height();
            pointerDirection = tag.pointerDirection();
            pointerWidth = tag.pointerWidth();
            pointerHeight = tag.pointerHeight();
            x = 0;
            y = 0;
            switch (pointerDirection) {
                case UP:
                    x = width / 2;
                    y = -1 * pointerHeight;
                    break;
                case RIGHT:
                    x = width + pointerWidth;
                    y = height / 2;
                    break;
                case DOWN:
                    x = width / 2;
                    y = height + pointerHeight;
                    break;
                case LEFT:
                    x = -1 * pointerWidth;
                    y = height / 2;
                    break;
            }
            tag.setAttrs({
                x: -1 * x,
                y: -1 * y,
                width: width,
                height: height,
            });
            text.setAttrs({
                x: -1 * x,
                y: -1 * y,
            });
        }
    }
}
Label.prototype.className = 'Label';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_4__._registerNode)(Label);
class Tag extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        var width = this.width(), height = this.height(), pointerDirection = this.pointerDirection(), pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), cornerRadius = this.cornerRadius();
        let topLeft = 0;
        let topRight = 0;
        let bottomLeft = 0;
        let bottomRight = 0;
        if (typeof cornerRadius === 'number') {
            topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
        }
        else {
            topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
            topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
            bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
            bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
        }
        context.beginPath();
        context.moveTo(topLeft, 0);
        if (pointerDirection === UP) {
            context.lineTo((width - pointerWidth) / 2, 0);
            context.lineTo(width / 2, -1 * pointerHeight);
            context.lineTo((width + pointerWidth) / 2, 0);
        }
        context.lineTo(width - topRight, 0);
        context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
        if (pointerDirection === RIGHT) {
            context.lineTo(width, (height - pointerHeight) / 2);
            context.lineTo(width + pointerWidth, height / 2);
            context.lineTo(width, (height + pointerHeight) / 2);
        }
        context.lineTo(width, height - bottomRight);
        context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
        if (pointerDirection === DOWN) {
            context.lineTo((width + pointerWidth) / 2, height);
            context.lineTo(width / 2, height + pointerHeight);
            context.lineTo((width - pointerWidth) / 2, height);
        }
        context.lineTo(bottomLeft, height);
        context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
        if (pointerDirection === LEFT) {
            context.lineTo(0, (height + pointerHeight) / 2);
            context.lineTo(-1 * pointerWidth, height / 2);
            context.lineTo(0, (height - pointerHeight) / 2);
        }
        context.lineTo(0, topLeft);
        context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getSelfRect() {
        var x = 0, y = 0, pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), direction = this.pointerDirection(), width = this.width(), height = this.height();
        if (direction === UP) {
            y -= pointerHeight;
            height += pointerHeight;
        }
        else if (direction === DOWN) {
            height += pointerHeight;
        }
        else if (direction === LEFT) {
            x -= pointerWidth * 1.5;
            width += pointerWidth;
        }
        else if (direction === RIGHT) {
            width += pointerWidth * 1.5;
        }
        return {
            x: x,
            y: y,
            width: width,
            height: height,
        };
    }
}
Tag.prototype.className = 'Tag';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_4__._registerNode)(Tag);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Tag, 'pointerDirection', NONE);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Tag, 'pointerWidth', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Tag, 'pointerHeight', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Tag, 'cornerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberOrArrayOfNumbersValidator)(4));


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Line.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/shapes/Line.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Line": () => (/* binding */ Line)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");




function getControlPoints(x0, y0, x1, y1, x2, y2, t) {
    var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = (t * d01) / (d01 + d12), fb = (t * d12) / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
    return [p1x, p1y, p2x, p2y];
}
function expandPoints(p, tension) {
    var len = p.length, allPoints = [], n, cp;
    for (n = 2; n < len - 2; n += 2) {
        cp = getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
        if (isNaN(cp[0])) {
            continue;
        }
        allPoints.push(cp[0]);
        allPoints.push(cp[1]);
        allPoints.push(p[n]);
        allPoints.push(p[n + 1]);
        allPoints.push(cp[2]);
        allPoints.push(cp[3]);
    }
    return allPoints;
}
class Line extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    constructor(config) {
        super(config);
        this.on('pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva', function () {
            this._clearCache('tensionPoints');
        });
    }
    _sceneFunc(context) {
        var points = this.points(), length = points.length, tension = this.tension(), closed = this.closed(), bezier = this.bezier(), tp, len, n;
        if (!length) {
            return;
        }
        context.beginPath();
        context.moveTo(points[0], points[1]);
        if (tension !== 0 && length > 4) {
            tp = this.getTensionPoints();
            len = tp.length;
            n = closed ? 0 : 4;
            if (!closed) {
                context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
            }
            while (n < len - 2) {
                context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
            }
            if (!closed) {
                context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
            }
        }
        else if (bezier) {
            n = 2;
            while (n < length) {
                context.bezierCurveTo(points[n++], points[n++], points[n++], points[n++], points[n++], points[n++]);
            }
        }
        else {
            for (n = 2; n < length; n += 2) {
                context.lineTo(points[n], points[n + 1]);
            }
        }
        if (closed) {
            context.closePath();
            context.fillStrokeShape(this);
        }
        else {
            context.strokeShape(this);
        }
    }
    getTensionPoints() {
        return this._getCache('tensionPoints', this._getTensionPoints);
    }
    _getTensionPoints() {
        if (this.closed()) {
            return this._getTensionPointsClosed();
        }
        else {
            return expandPoints(this.points(), this.tension());
        }
    }
    _getTensionPointsClosed() {
        var p = this.points(), len = p.length, tension = this.tension(), firstControlPoints = getControlPoints(p[len - 2], p[len - 1], p[0], p[1], p[2], p[3], tension), lastControlPoints = getControlPoints(p[len - 4], p[len - 3], p[len - 2], p[len - 1], p[0], p[1], tension), middle = expandPoints(p, tension), tp = [firstControlPoints[2], firstControlPoints[3]]
            .concat(middle)
            .concat([
            lastControlPoints[0],
            lastControlPoints[1],
            p[len - 2],
            p[len - 1],
            lastControlPoints[2],
            lastControlPoints[3],
            firstControlPoints[0],
            firstControlPoints[1],
            p[0],
            p[1],
        ]);
        return tp;
    }
    getWidth() {
        return this.getSelfRect().width;
    }
    getHeight() {
        return this.getSelfRect().height;
    }
    getSelfRect() {
        var points = this.points();
        if (points.length < 4) {
            return {
                x: points[0] || 0,
                y: points[1] || 0,
                width: 0,
                height: 0,
            };
        }
        if (this.tension() !== 0) {
            points = [
                points[0],
                points[1],
                ...this._getTensionPoints(),
                points[points.length - 2],
                points[points.length - 1],
            ];
        }
        else {
            points = this.points();
        }
        var minX = points[0];
        var maxX = points[0];
        var minY = points[1];
        var maxY = points[1];
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
}
Line.prototype.className = 'Line';
Line.prototype._attrsAffectingSize = ['points', 'bezier', 'tension'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Line);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Line, 'closed', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Line, 'bezier', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Line, 'tension', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Line, 'points', [], (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberArrayValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Path.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/shapes/Path.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Path": () => (/* binding */ Path)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");



class Path extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    constructor(config) {
        super(config);
        this.dataArray = [];
        this.pathLength = 0;
        this.dataArray = Path.parsePathData(this.data());
        this.pathLength = 0;
        for (var i = 0; i < this.dataArray.length; ++i) {
            this.pathLength += this.dataArray[i].pathLength;
        }
        this.on('dataChange.konva', function () {
            this.dataArray = Path.parsePathData(this.data());
            this.pathLength = 0;
            for (var i = 0; i < this.dataArray.length; ++i) {
                this.pathLength += this.dataArray[i].pathLength;
            }
        });
    }
    _sceneFunc(context) {
        var ca = this.dataArray;
        context.beginPath();
        var isClosed = false;
        for (var n = 0; n < ca.length; n++) {
            var c = ca[n].command;
            var p = ca[n].points;
            switch (c) {
                case 'L':
                    context.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    context.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
                    var r = rx > ry ? rx : ry;
                    var scaleX = rx > ry ? 1 : rx / ry;
                    var scaleY = rx > ry ? ry / rx : 1;
                    context.translate(cx, cy);
                    context.rotate(psi);
                    context.scale(scaleX, scaleY);
                    context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                    context.scale(1 / scaleX, 1 / scaleY);
                    context.rotate(-psi);
                    context.translate(-cx, -cy);
                    break;
                case 'z':
                    isClosed = true;
                    context.closePath();
                    break;
            }
        }
        if (!isClosed && !this.hasFill()) {
            context.strokeShape(this);
        }
        else {
            context.fillStrokeShape(this);
        }
    }
    getSelfRect() {
        var points = [];
        this.dataArray.forEach(function (data) {
            if (data.command === 'A') {
                var start = data.points[4];
                var dTheta = data.points[5];
                var end = data.points[4] + dTheta;
                var inc = Math.PI / 180.0;
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                if (dTheta < 0) {
                    for (let t = start - inc; t > end; t -= inc) {
                        const point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
                else {
                    for (let t = start + inc; t < end; t += inc) {
                        const point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
            }
            else if (data.command === 'C') {
                for (let t = 0.0; t <= 1; t += 0.01) {
                    const point = Path.getPointOnCubicBezier(t, data.start.x, data.start.y, data.points[0], data.points[1], data.points[2], data.points[3], data.points[4], data.points[5]);
                    points.push(point.x, point.y);
                }
            }
            else {
                points = points.concat(data.points);
            }
        });
        var minX = points[0];
        var maxX = points[0];
        var minY = points[1];
        var maxY = points[1];
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            if (!isNaN(x)) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
            if (!isNaN(y)) {
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    getLength() {
        return this.pathLength;
    }
    getPointAtLength(length) {
        var point, i = 0, ii = this.dataArray.length;
        if (!ii) {
            return null;
        }
        while (i < ii && length > this.dataArray[i].pathLength) {
            length -= this.dataArray[i].pathLength;
            ++i;
        }
        if (i === ii) {
            point = this.dataArray[i - 1].points.slice(-2);
            return {
                x: point[0],
                y: point[1],
            };
        }
        if (length < 0.01) {
            point = this.dataArray[i].points.slice(0, 2);
            return {
                x: point[0],
                y: point[1],
            };
        }
        var cp = this.dataArray[i];
        var p = cp.points;
        switch (cp.command) {
            case 'L':
                return Path.getPointOnLine(length, cp.start.x, cp.start.y, p[0], p[1]);
            case 'C':
                return Path.getPointOnCubicBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3], p[4], p[5]);
            case 'Q':
                return Path.getPointOnQuadraticBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3]);
            case 'A':
                var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6];
                theta += (dTheta * length) / cp.pathLength;
                return Path.getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi);
        }
        return null;
    }
    static getLineLength(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    static getPointOnLine(dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        if (fromX === undefined) {
            fromX = P1x;
        }
        if (fromY === undefined) {
            fromY = P1y;
        }
        var m = (P2y - P1y) / (P2x - P1x + 0.00000001);
        var run = Math.sqrt((dist * dist) / (1 + m * m));
        if (P2x < P1x) {
            run *= -1;
        }
        var rise = m * run;
        var pt;
        if (P2x === P1x) {
            pt = {
                x: fromX,
                y: fromY + rise,
            };
        }
        else if ((fromY - P1y) / (fromX - P1x + 0.00000001) === m) {
            pt = {
                x: fromX + run,
                y: fromY + rise,
            };
        }
        else {
            var ix, iy;
            var len = this.getLineLength(P1x, P1y, P2x, P2y);
            var u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
            u = u / (len * len);
            ix = P1x + u * (P2x - P1x);
            iy = P1y + u * (P2y - P1y);
            var pRise = this.getLineLength(fromX, fromY, ix, iy);
            var pRun = Math.sqrt(dist * dist - pRise * pRise);
            run = Math.sqrt((pRun * pRun) / (1 + m * m));
            if (P2x < P1x) {
                run *= -1;
            }
            rise = m * run;
            pt = {
                x: ix + run,
                y: iy + rise,
            };
        }
        return pt;
    }
    static getPointOnCubicBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
        return {
            x: x,
            y: y,
        };
    }
    static getPointOnQuadraticBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
        return {
            x: x,
            y: y,
        };
    }
    static getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi) {
        var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        var pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta),
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi),
        };
    }
    static parsePathData(data) {
        if (!data) {
            return [];
        }
        var cs = data;
        var cc = [
            'm',
            'M',
            'l',
            'L',
            'v',
            'V',
            'h',
            'H',
            'z',
            'Z',
            'c',
            'C',
            'q',
            'Q',
            't',
            'T',
            's',
            'S',
            'a',
            'A',
        ];
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        for (var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        var arr = cs.split('|');
        var ca = [];
        var coords = [];
        var cpx = 0;
        var cpy = 0;
        var re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
        var match;
        for (n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            coords.length = 0;
            while ((match = re.exec(str))) {
                coords.push(match[0]);
            }
            var p = [];
            for (var j = 0, jlen = coords.length; j < jlen; j++) {
                if (coords[j] === '00') {
                    p.push(0, 0);
                    continue;
                }
                var parsed = parseFloat(coords[j]);
                if (!isNaN(parsed)) {
                    p.push(parsed);
                }
                else {
                    p.push(0);
                }
            }
            while (p.length > 0) {
                if (isNaN(p[0])) {
                    break;
                }
                var cmd = null;
                var points = [];
                var startX = cpx, startY = cpy;
                var prevCmd, ctlPtx, ctlPty;
                var rx, ry, psi, fa, fs, x1, y1;
                switch (c) {
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'm':
                        var dx = p.shift();
                        var dy = p.shift();
                        cpx += dx;
                        cpy += dy;
                        cmd = 'M';
                        if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
                            for (var idx = ca.length - 2; idx >= 0; idx--) {
                                if (ca[idx].command === 'M') {
                                    cpx = ca[idx].points[0] + dx;
                                    cpy = ca[idx].points[1] + dy;
                                    break;
                                }
                            }
                        }
                        points.push(cpx, cpy);
                        c = 'l';
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        break;
                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }
                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY,
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points),
                });
            }
            if (c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0,
                });
            }
        }
        return ca;
    }
    static calcLength(x, y, cmd, points) {
        var len, p1, p2, t;
        var path = Path;
        switch (cmd) {
            case 'L':
                return path.getLineLength(x, y, points[0], points[1]);
            case 'C':
                len = 0.0;
                p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'Q':
                len = 0.0;
                p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'A':
                len = 0.0;
                var start = points[4];
                var dTheta = points[5];
                var end = points[4] + dTheta;
                var inc = Math.PI / 180.0;
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if (dTheta < 0) {
                    for (t = start - inc; t > end; t -= inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                else {
                    for (t = start + inc; t < end; t += inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                return len;
        }
        return 0;
    }
    static convertEndpointToCenterParameterization(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        var psi = psiDeg * (Math.PI / 180.0);
        var xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
        var yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 +
            (Math.cos(psi) * (y1 - y2)) / 2.0;
        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }
        var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
            (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
        if (fa === fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }
        var cxp = (f * rx * yp) / ry;
        var cyp = (f * -ry * xp) / rx;
        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
        var vMag = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function (u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);
        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    }
}
Path.prototype.className = 'Path';
Path.prototype._attrsAffectingSize = ['data'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(Path);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Path, 'data');


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Rect.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/shapes/Rect.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rect": () => (/* binding */ Rect)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");




class Rect extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        var cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
        context.beginPath();
        if (!cornerRadius) {
            context.rect(0, 0, width, height);
        }
        else {
            let topLeft = 0;
            let topRight = 0;
            let bottomLeft = 0;
            let bottomRight = 0;
            if (typeof cornerRadius === 'number') {
                topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
            }
            else {
                topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
                topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
                bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
                bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
            }
            context.moveTo(topLeft, 0);
            context.lineTo(width - topRight, 0);
            context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
            context.lineTo(width, height - bottomRight);
            context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
            context.lineTo(bottomLeft, height);
            context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
            context.lineTo(0, topLeft);
            context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
        }
        context.closePath();
        context.fillStrokeShape(this);
    }
}
Rect.prototype.className = 'Rect';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(Rect);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Rect, 'cornerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberOrArrayOfNumbersValidator)(4));


/***/ }),

/***/ "./node_modules/konva/lib/shapes/RegularPolygon.js":
/*!*********************************************************!*\
  !*** ./node_modules/konva/lib/shapes/RegularPolygon.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegularPolygon": () => (/* binding */ RegularPolygon)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");




class RegularPolygon extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        const points = this._getPoints();
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (var n = 1; n < points.length; n++) {
            context.lineTo(points[n].x, points[n].y);
        }
        context.closePath();
        context.fillStrokeShape(this);
    }
    _getPoints() {
        const sides = this.attrs.sides;
        const radius = this.attrs.radius || 0;
        const points = [];
        for (var n = 0; n < sides; n++) {
            points.push({
                x: radius * Math.sin((n * 2 * Math.PI) / sides),
                y: -1 * radius * Math.cos((n * 2 * Math.PI) / sides),
            });
        }
        return points;
    }
    getSelfRect() {
        const points = this._getPoints();
        var minX = points[0].x;
        var maxX = points[0].y;
        var minY = points[0].x;
        var maxY = points[0].y;
        points.forEach((point) => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    getWidth() {
        return this.radius() * 2;
    }
    getHeight() {
        return this.radius() * 2;
    }
    setWidth(width) {
        this.radius(width / 2);
    }
    setHeight(height) {
        this.radius(height / 2);
    }
}
RegularPolygon.prototype.className = 'RegularPolygon';
RegularPolygon.prototype._centroid = true;
RegularPolygon.prototype._attrsAffectingSize = ['radius'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(RegularPolygon);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(RegularPolygon, 'radius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(RegularPolygon, 'sides', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Ring.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/shapes/Ring.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ring": () => (/* binding */ Ring)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");




var PIx2 = Math.PI * 2;
class Ring extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        context.beginPath();
        context.arc(0, 0, this.innerRadius(), 0, PIx2, false);
        context.moveTo(this.outerRadius(), 0);
        context.arc(0, 0, this.outerRadius(), PIx2, 0, true);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        return this.outerRadius() * 2;
    }
    getHeight() {
        return this.outerRadius() * 2;
    }
    setWidth(width) {
        this.outerRadius(width / 2);
    }
    setHeight(height) {
        this.outerRadius(height / 2);
    }
}
Ring.prototype.className = 'Ring';
Ring.prototype._centroid = true;
Ring.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Ring);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Ring, 'innerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Ring, 'outerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Sprite.js":
/*!*************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Sprite.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sprite": () => (/* binding */ Sprite)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Animation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Animation.js */ "./node_modules/konva/lib/Animation.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");





class Sprite extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    constructor(config) {
        super(config);
        this._updated = true;
        this.anim = new _Animation_js__WEBPACK_IMPORTED_MODULE_2__.Animation(() => {
            var updated = this._updated;
            this._updated = false;
            return updated;
        });
        this.on('animationChange.konva', function () {
            this.frameIndex(0);
        });
        this.on('frameIndexChange.konva', function () {
            this._updated = true;
        });
        this.on('frameRateChange.konva', function () {
            if (!this.anim.isRunning()) {
                return;
            }
            clearInterval(this.interval);
            this._setInterval();
        });
    }
    _sceneFunc(context) {
        var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), x = set[ix4 + 0], y = set[ix4 + 1], width = set[ix4 + 2], height = set[ix4 + 3], image = this.image();
        if (this.hasFill() || this.hasStroke()) {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        if (image) {
            if (offsets) {
                var offset = offsets[anim], ix2 = index * 2;
                context.drawImage(image, x, y, width, height, offset[ix2 + 0], offset[ix2 + 1], width, height);
            }
            else {
                context.drawImage(image, x, y, width, height, 0, 0, width, height);
            }
        }
    }
    _hitFunc(context) {
        var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), width = set[ix4 + 2], height = set[ix4 + 3];
        context.beginPath();
        if (offsets) {
            var offset = offsets[anim];
            var ix2 = index * 2;
            context.rect(offset[ix2 + 0], offset[ix2 + 1], width, height);
        }
        else {
            context.rect(0, 0, width, height);
        }
        context.closePath();
        context.fillShape(this);
    }
    _useBufferCanvas() {
        return super._useBufferCanvas(true);
    }
    _setInterval() {
        var that = this;
        this.interval = setInterval(function () {
            that._updateIndex();
        }, 1000 / this.frameRate());
    }
    start() {
        if (this.isRunning()) {
            return;
        }
        var layer = this.getLayer();
        this.anim.setLayers(layer);
        this._setInterval();
        this.anim.start();
    }
    stop() {
        this.anim.stop();
        clearInterval(this.interval);
    }
    isRunning() {
        return this.anim.isRunning();
    }
    _updateIndex() {
        var index = this.frameIndex(), animation = this.animation(), animations = this.animations(), anim = animations[animation], len = anim.length / 4;
        if (index < len - 1) {
            this.frameIndex(index + 1);
        }
        else {
            this.frameIndex(0);
        }
    }
}
Sprite.prototype.className = 'Sprite';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_4__._registerNode)(Sprite);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Sprite, 'animation');
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Sprite, 'animations');
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Sprite, 'frameOffsets');
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Sprite, 'image');
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Sprite, 'frameIndex', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Sprite, 'frameRate', 17, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.backCompat(Sprite, {
    index: 'frameIndex',
    getIndex: 'getFrameIndex',
    setIndex: 'setFrameIndex',
});


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Star.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/shapes/Star.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Star": () => (/* binding */ Star)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");




class Star extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        var innerRadius = this.innerRadius(), outerRadius = this.outerRadius(), numPoints = this.numPoints();
        context.beginPath();
        context.moveTo(0, 0 - outerRadius);
        for (var n = 1; n < numPoints * 2; n++) {
            var radius = n % 2 === 0 ? outerRadius : innerRadius;
            var x = radius * Math.sin((n * Math.PI) / numPoints);
            var y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
            context.lineTo(x, y);
        }
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        return this.outerRadius() * 2;
    }
    getHeight() {
        return this.outerRadius() * 2;
    }
    setWidth(width) {
        this.outerRadius(width / 2);
    }
    setHeight(height) {
        this.outerRadius(height / 2);
    }
}
Star.prototype.className = 'Star';
Star.prototype._centroid = true;
Star.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_3__._registerNode)(Star);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Star, 'numPoints', 5, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Star, 'innerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Star, 'outerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_2__.getNumberValidator)());


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Text.js":
/*!***********************************************!*\
  !*** ./node_modules/konva/lib/shapes/Text.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Text": () => (/* binding */ Text),
/* harmony export */   "stringToArray": () => (/* binding */ stringToArray)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");





function stringToArray(string) {
    return Array.from(string);
}
var AUTO = 'auto', CENTER = 'center', JUSTIFY = 'justify', CHANGE_KONVA = 'Change.konva', CONTEXT_2D = '2d', DASH = '-', LEFT = 'left', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', BOTTOM = 'bottom', MIDDLE = 'middle', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', RIGHT = 'right', WORD = 'word', CHAR = 'char', NONE = 'none', ELLIPSIS = '…', ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontVariant',
    'padding',
    'align',
    'verticalAlign',
    'lineHeight',
    'text',
    'width',
    'height',
    'wrap',
    'ellipsis',
    'letterSpacing',
], attrChangeListLen = ATTR_CHANGE_LIST.length;
function normalizeFontFamily(fontFamily) {
    return fontFamily
        .split(',')
        .map((family) => {
        family = family.trim();
        const hasSpace = family.indexOf(' ') >= 0;
        const hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
        if (hasSpace && !hasQuotes) {
            family = `"${family}"`;
        }
        return family;
    })
        .join(', ');
}
var dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createCanvasElement().getContext(CONTEXT_2D);
    return dummyContext;
}
function _fillFunc(context) {
    context.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function _strokeFunc(context) {
    context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function checkDefaultFill(config) {
    config = config || {};
    if (!config.fillLinearGradientColorStops &&
        !config.fillRadialGradientColorStops &&
        !config.fillPatternImage) {
        config.fill = config.fill || 'black';
    }
    return config;
}
class Text extends _Shape_js__WEBPACK_IMPORTED_MODULE_2__.Shape {
    constructor(config) {
        super(checkDefaultFill(config));
        this._partialTextX = 0;
        this._partialTextY = 0;
        for (var n = 0; n < attrChangeListLen; n++) {
            this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, this._setTextData);
        }
        this._setTextData();
    }
    _sceneFunc(context) {
        var textArr = this.textArr, textArrLen = textArr.length;
        if (!this.text()) {
            return;
        }
        var padding = this.padding(), fontSize = this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, verticalAlign = this.verticalAlign(), alignY = 0, align = this.align(), totalWidth = this.getWidth(), letterSpacing = this.letterSpacing(), fill = this.fill(), textDecoration = this.textDecoration(), shouldUnderline = textDecoration.indexOf('underline') !== -1, shouldLineThrough = textDecoration.indexOf('line-through') !== -1, n;
        var translateY = 0;
        var translateY = lineHeightPx / 2;
        var lineTranslateX = 0;
        var lineTranslateY = 0;
        context.setAttr('font', this._getContextFont());
        context.setAttr('textBaseline', MIDDLE);
        context.setAttr('textAlign', LEFT);
        if (verticalAlign === MIDDLE) {
            alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
        }
        else if (verticalAlign === BOTTOM) {
            alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
        }
        context.translate(padding, alignY + padding);
        for (n = 0; n < textArrLen; n++) {
            var lineTranslateX = 0;
            var lineTranslateY = 0;
            var obj = textArr[n], text = obj.text, width = obj.width, lastLine = obj.lastInParagraph, spacesNumber, oneWord, lineWidth;
            context.save();
            if (align === RIGHT) {
                lineTranslateX += totalWidth - width - padding * 2;
            }
            else if (align === CENTER) {
                lineTranslateX += (totalWidth - width - padding * 2) / 2;
            }
            if (shouldUnderline) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY + Math.round(fontSize / 2));
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY + Math.round(fontSize / 2));
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (shouldLineThrough) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY);
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY);
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (letterSpacing !== 0 || align === JUSTIFY) {
                spacesNumber = text.split(' ').length - 1;
                var array = stringToArray(text);
                for (var li = 0; li < array.length; li++) {
                    var letter = array[li];
                    if (letter === ' ' && !lastLine && align === JUSTIFY) {
                        lineTranslateX += (totalWidth - padding * 2 - width) / spacesNumber;
                    }
                    this._partialTextX = lineTranslateX;
                    this._partialTextY = translateY + lineTranslateY;
                    this._partialText = letter;
                    context.fillStrokeShape(this);
                    lineTranslateX += this.measureSize(letter).width + letterSpacing;
                }
            }
            else {
                this._partialTextX = lineTranslateX;
                this._partialTextY = translateY + lineTranslateY;
                this._partialText = text;
                context.fillStrokeShape(this);
            }
            context.restore();
            if (textArrLen > 1) {
                translateY += lineHeightPx;
            }
        }
    }
    _hitFunc(context) {
        var width = this.getWidth(), height = this.getHeight();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    }
    setText(text) {
        var str = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._isString(text)
            ? text
            : text === null || text === undefined
                ? ''
                : text + '';
        this._setAttr(TEXT, str);
        return this;
    }
    getWidth() {
        var isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
        return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
    }
    getHeight() {
        var isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
        return isAuto
            ? this.fontSize() * this.textArr.length * this.lineHeight() +
                this.padding() * 2
            : this.attrs.height;
    }
    getTextWidth() {
        return this.textWidth;
    }
    getTextHeight() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    }
    measureSize(text) {
        var _context = getDummyContext(), fontSize = this.fontSize(), metrics;
        _context.save();
        _context.font = this._getContextFont();
        metrics = _context.measureText(text);
        _context.restore();
        return {
            width: metrics.width,
            height: fontSize,
        };
    }
    _getContextFont() {
        return (this.fontStyle() +
            SPACE +
            this.fontVariant() +
            SPACE +
            (this.fontSize() + PX_SPACE) +
            normalizeFontFamily(this.fontFamily()));
    }
    _addTextLine(line) {
        if (this.align() === JUSTIFY) {
            line = line.trim();
        }
        var width = this._getTextWidth(line);
        return this.textArr.push({
            text: line,
            width: width,
            lastInParagraph: false,
        });
    }
    _getTextWidth(text) {
        var letterSpacing = this.letterSpacing();
        var length = text.length;
        return (getDummyContext().measureText(text).width +
            (length ? letterSpacing * (length - 1) : 0));
    }
    _setTextData() {
        var lines = this.text().split('\n'), fontSize = +this.fontSize(), textWidth = 0, lineHeightPx = this.lineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO && width !== undefined, fixedHeight = height !== AUTO && height !== undefined, padding = this.padding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.wrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap, shouldAddEllipsis = this.ellipsis();
        this.textArr = [];
        getDummyContext().font = this._getContextFont();
        var additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
        for (var i = 0, max = lines.length; i < max; ++i) {
            var line = lines[i];
            var lineWidth = this._getTextWidth(line);
            if (fixedWidth && lineWidth > maxWidth) {
                while (line.length > 0) {
                    var low = 0, high = line.length, match = '', matchWidth = 0;
                    while (low < high) {
                        var mid = (low + high) >>> 1, substr = line.slice(0, mid + 1), substrWidth = this._getTextWidth(substr) + additionalWidth;
                        if (substrWidth <= maxWidth) {
                            low = mid + 1;
                            match = substr;
                            matchWidth = substrWidth;
                        }
                        else {
                            high = mid;
                        }
                    }
                    if (match) {
                        if (wrapAtWord) {
                            var wrapIndex;
                            var nextChar = line[match.length];
                            var nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
                            if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                                wrapIndex = match.length;
                            }
                            else {
                                wrapIndex =
                                    Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) +
                                        1;
                            }
                            if (wrapIndex > 0) {
                                low = wrapIndex;
                                match = match.slice(0, low);
                                matchWidth = this._getTextWidth(match);
                            }
                        }
                        match = match.trimRight();
                        this._addTextLine(match);
                        textWidth = Math.max(textWidth, matchWidth);
                        currentHeightPx += lineHeightPx;
                        if (!shouldWrap ||
                            (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                            var lastLine = this.textArr[this.textArr.length - 1];
                            if (lastLine) {
                                if (shouldAddEllipsis) {
                                    var haveSpace = this._getTextWidth(lastLine.text + ELLIPSIS) < maxWidth;
                                    if (!haveSpace) {
                                        lastLine.text = lastLine.text.slice(0, lastLine.text.length - 3);
                                    }
                                    this.textArr.splice(this.textArr.length - 1, 1);
                                    this._addTextLine(lastLine.text + ELLIPSIS);
                                }
                            }
                            break;
                        }
                        line = line.slice(low);
                        line = line.trimLeft();
                        if (line.length > 0) {
                            lineWidth = this._getTextWidth(line);
                            if (lineWidth <= maxWidth) {
                                this._addTextLine(line);
                                currentHeightPx += lineHeightPx;
                                textWidth = Math.max(textWidth, lineWidth);
                                break;
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                this._addTextLine(line);
                currentHeightPx += lineHeightPx;
                textWidth = Math.max(textWidth, lineWidth);
            }
            if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                break;
            }
            if (this.textArr[this.textArr.length - 1]) {
                this.textArr[this.textArr.length - 1].lastInParagraph = true;
            }
        }
        this.textHeight = fontSize;
        this.textWidth = textWidth;
    }
    getStrokeScaleEnabled() {
        return true;
    }
}
Text.prototype._fillFunc = _fillFunc;
Text.prototype._strokeFunc = _strokeFunc;
Text.prototype.className = TEXT_UPPER;
Text.prototype._attrsAffectingSize = [
    'text',
    'fontSize',
    'padding',
    'wrap',
    'lineHeight',
    'letterSpacing',
];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_4__._registerNode)(Text);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.overWriteSetter(Text, 'width', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberOrAutoValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.overWriteSetter(Text, 'height', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberOrAutoValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontFamily', 'Arial');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontSize', 12, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontStyle', NORMAL);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'fontVariant', NORMAL);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'padding', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'align', LEFT);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'verticalAlign', TOP);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'lineHeight', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'wrap', WORD);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'ellipsis', false, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'letterSpacing', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'text', '', (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getStringValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Text, 'textDecoration', '');


/***/ }),

/***/ "./node_modules/konva/lib/shapes/TextPath.js":
/*!***************************************************!*\
  !*** ./node_modules/konva/lib/shapes/TextPath.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextPath": () => (/* binding */ TextPath)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Path_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Path.js */ "./node_modules/konva/lib/shapes/Path.js");
/* harmony import */ var _Text_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Text.js */ "./node_modules/konva/lib/shapes/Text.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");







var EMPTY_STRING = '', NORMAL = 'normal';
function _fillFunc(context) {
    context.fillText(this.partialText, 0, 0);
}
function _strokeFunc(context) {
    context.strokeText(this.partialText, 0, 0);
}
class TextPath extends _Shape_js__WEBPACK_IMPORTED_MODULE_2__.Shape {
    constructor(config) {
        super(config);
        this.dummyCanvas = _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.createCanvasElement();
        this.dataArray = [];
        this.dataArray = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.parsePathData(this.attrs.data);
        this.on('dataChange.konva', function () {
            this.dataArray = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.parsePathData(this.attrs.data);
            this._setTextData();
        });
        this.on('textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva fontSizeChange.konva fontFamilyChange.konva', this._setTextData);
        this._setTextData();
    }
    _sceneFunc(context) {
        context.setAttr('font', this._getContextFont());
        context.setAttr('textBaseline', this.textBaseline());
        context.setAttr('textAlign', 'left');
        context.save();
        var textDecoration = this.textDecoration();
        var fill = this.fill();
        var fontSize = this.fontSize();
        var glyphInfo = this.glyphInfo;
        if (textDecoration === 'underline') {
            context.beginPath();
        }
        for (var i = 0; i < glyphInfo.length; i++) {
            context.save();
            var p0 = glyphInfo[i].p0;
            context.translate(p0.x, p0.y);
            context.rotate(glyphInfo[i].rotation);
            this.partialText = glyphInfo[i].text;
            context.fillStrokeShape(this);
            if (textDecoration === 'underline') {
                if (i === 0) {
                    context.moveTo(0, fontSize / 2 + 1);
                }
                context.lineTo(fontSize, fontSize / 2 + 1);
            }
            context.restore();
        }
        if (textDecoration === 'underline') {
            context.strokeStyle = fill;
            context.lineWidth = fontSize / 20;
            context.stroke();
        }
        context.restore();
    }
    _hitFunc(context) {
        context.beginPath();
        var glyphInfo = this.glyphInfo;
        if (glyphInfo.length >= 1) {
            var p0 = glyphInfo[0].p0;
            context.moveTo(p0.x, p0.y);
        }
        for (var i = 0; i < glyphInfo.length; i++) {
            var p1 = glyphInfo[i].p1;
            context.lineTo(p1.x, p1.y);
        }
        context.setAttr('lineWidth', this.fontSize());
        context.setAttr('strokeStyle', this.colorKey);
        context.stroke();
    }
    getTextWidth() {
        return this.textWidth;
    }
    getTextHeight() {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    }
    setText(text) {
        return _Text_js__WEBPACK_IMPORTED_MODULE_4__.Text.prototype.setText.call(this, text);
    }
    _getContextFont() {
        return _Text_js__WEBPACK_IMPORTED_MODULE_4__.Text.prototype._getContextFont.call(this);
    }
    _getTextSize(text) {
        var dummyCanvas = this.dummyCanvas;
        var _context = dummyCanvas.getContext('2d');
        _context.save();
        _context.font = this._getContextFont();
        var metrics = _context.measureText(text);
        _context.restore();
        return {
            width: metrics.width,
            height: parseInt(this.attrs.fontSize, 10),
        };
    }
    _setTextData() {
        var that = this;
        var size = this._getTextSize(this.attrs.text);
        var letterSpacing = this.letterSpacing();
        var align = this.align();
        var kerningFunc = this.kerningFunc();
        this.textWidth = size.width;
        this.textHeight = size.height;
        var textFullWidth = Math.max(this.textWidth + ((this.attrs.text || '').length - 1) * letterSpacing, 0);
        this.glyphInfo = [];
        var fullPathWidth = 0;
        for (var l = 0; l < that.dataArray.length; l++) {
            if (that.dataArray[l].pathLength > 0) {
                fullPathWidth += that.dataArray[l].pathLength;
            }
        }
        var offset = 0;
        if (align === 'center') {
            offset = Math.max(0, fullPathWidth / 2 - textFullWidth / 2);
        }
        if (align === 'right') {
            offset = Math.max(0, fullPathWidth - textFullWidth);
        }
        var charArr = (0,_Text_js__WEBPACK_IMPORTED_MODULE_4__.stringToArray)(this.text());
        var spacesNumber = this.text().split(' ').length - 1;
        var p0, p1, pathCmd;
        var pIndex = -1;
        var currentT = 0;
        var getNextPathSegment = function () {
            currentT = 0;
            var pathData = that.dataArray;
            for (var j = pIndex + 1; j < pathData.length; j++) {
                if (pathData[j].pathLength > 0) {
                    pIndex = j;
                    return pathData[j];
                }
                else if (pathData[j].command === 'M') {
                    p0 = {
                        x: pathData[j].points[0],
                        y: pathData[j].points[1],
                    };
                }
            }
            return {};
        };
        var findSegmentToFitCharacter = function (c) {
            var glyphWidth = that._getTextSize(c).width + letterSpacing;
            if (c === ' ' && align === 'justify') {
                glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
            }
            var currLen = 0;
            var attempts = 0;
            p1 = undefined;
            while (Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 &&
                attempts < 20) {
                attempts++;
                var cumulativePathLength = currLen;
                while (pathCmd === undefined) {
                    pathCmd = getNextPathSegment();
                    if (pathCmd &&
                        cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                        cumulativePathLength += pathCmd.pathLength;
                        pathCmd = undefined;
                    }
                }
                if (pathCmd === {} || p0 === undefined) {
                    return undefined;
                }
                var needNewSegment = false;
                switch (pathCmd.command) {
                    case 'L':
                        if (_Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                            p1 = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                        }
                        else {
                            pathCmd = undefined;
                        }
                        break;
                    case 'A':
                        var start = pathCmd.points[4];
                        var dTheta = pathCmd.points[5];
                        var end = pathCmd.points[4] + dTheta;
                        if (currentT === 0) {
                            currentT = start + 0.00000001;
                        }
                        else if (glyphWidth > currLen) {
                            currentT += ((Math.PI / 180.0) * dTheta) / Math.abs(dTheta);
                        }
                        else {
                            currentT -= ((Math.PI / 360.0) * dTheta) / Math.abs(dTheta);
                        }
                        if ((dTheta < 0 && currentT < end) ||
                            (dTheta >= 0 && currentT > end)) {
                            currentT = end;
                            needNewSegment = true;
                        }
                        p1 = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                        break;
                    case 'C':
                        if (currentT === 0) {
                            if (glyphWidth > pathCmd.pathLength) {
                                currentT = 0.00000001;
                            }
                            else {
                                currentT = glyphWidth / pathCmd.pathLength;
                            }
                        }
                        else if (glyphWidth > currLen) {
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength / 2;
                        }
                        else {
                            currentT = Math.max(currentT - (currLen - glyphWidth) / pathCmd.pathLength / 2, 0);
                        }
                        if (currentT > 1.0) {
                            currentT = 1.0;
                            needNewSegment = true;
                        }
                        p1 = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                        break;
                    case 'Q':
                        if (currentT === 0) {
                            currentT = glyphWidth / pathCmd.pathLength;
                        }
                        else if (glyphWidth > currLen) {
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                        }
                        else {
                            currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                        }
                        if (currentT > 1.0) {
                            currentT = 1.0;
                            needNewSegment = true;
                        }
                        p1 = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                        break;
                }
                if (p1 !== undefined) {
                    currLen = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                }
                if (needNewSegment) {
                    needNewSegment = false;
                    pathCmd = undefined;
                }
            }
        };
        var testChar = 'C';
        var glyphWidth = that._getTextSize(testChar).width + letterSpacing;
        var lettersInOffset = offset / glyphWidth - 1;
        for (var k = 0; k < lettersInOffset; k++) {
            findSegmentToFitCharacter(testChar);
            if (p0 === undefined || p1 === undefined) {
                break;
            }
            p0 = p1;
        }
        for (var i = 0; i < charArr.length; i++) {
            findSegmentToFitCharacter(charArr[i]);
            if (p0 === undefined || p1 === undefined) {
                break;
            }
            var width = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
            var kern = 0;
            if (kerningFunc) {
                try {
                    kern = kerningFunc(charArr[i - 1], charArr[i]) * this.fontSize();
                }
                catch (e) {
                    kern = 0;
                }
            }
            p0.x += kern;
            p1.x += kern;
            this.textWidth += kern;
            var midpoint = _Path_js__WEBPACK_IMPORTED_MODULE_3__.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);
            var rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            this.glyphInfo.push({
                transposeX: midpoint.x,
                transposeY: midpoint.y,
                text: charArr[i],
                rotation: rotation,
                p0: p0,
                p1: p1,
            });
            p0 = p1;
        }
    }
    getSelfRect() {
        if (!this.glyphInfo.length) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }
        var points = [];
        this.glyphInfo.forEach(function (info) {
            points.push(info.p0.x);
            points.push(info.p0.y);
            points.push(info.p1.x);
            points.push(info.p1.y);
        });
        var minX = points[0] || 0;
        var maxX = points[0] || 0;
        var minY = points[1] || 0;
        var maxY = points[1] || 0;
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        var fontSize = this.fontSize();
        return {
            x: minX - fontSize / 2,
            y: minY - fontSize / 2,
            width: maxX - minX + fontSize,
            height: maxY - minY + fontSize,
        };
    }
}
TextPath.prototype._fillFunc = _fillFunc;
TextPath.prototype._strokeFunc = _strokeFunc;
TextPath.prototype._fillFuncHit = _fillFunc;
TextPath.prototype._strokeFuncHit = _strokeFunc;
TextPath.prototype.className = 'TextPath';
TextPath.prototype._attrsAffectingSize = ['text', 'fontSize', 'data'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_6__._registerNode)(TextPath);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'data');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'fontFamily', 'Arial');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'fontSize', 12, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'fontStyle', NORMAL);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'align', 'left');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'letterSpacing', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_5__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'textBaseline', 'middle');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'fontVariant', NORMAL);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'text', EMPTY_STRING);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'textDecoration', null);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(TextPath, 'kerningFunc', null);


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Transformer.js":
/*!******************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Transformer.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Transformer": () => (/* binding */ Transformer)
/* harmony export */ });
/* harmony import */ var _Util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Util.js */ "./node_modules/konva/lib/Util.js");
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Node.js */ "./node_modules/konva/lib/Node.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Rect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Rect.js */ "./node_modules/konva/lib/shapes/Rect.js");
/* harmony import */ var _Group_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Group.js */ "./node_modules/konva/lib/Group.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");









var EVENTS_NAME = 'tr-konva';
var ATTR_CHANGE_LIST = [
    'resizeEnabledChange',
    'rotateAnchorOffsetChange',
    'rotateEnabledChange',
    'enabledAnchorsChange',
    'anchorSizeChange',
    'borderEnabledChange',
    'borderStrokeChange',
    'borderStrokeWidthChange',
    'borderDashChange',
    'anchorStrokeChange',
    'anchorStrokeWidthChange',
    'anchorFillChange',
    'anchorCornerRadiusChange',
    'ignoreStrokeChange',
]
    .map((e) => e + `.${EVENTS_NAME}`)
    .join(' ');
var NODES_RECT = 'nodesRect';
var TRANSFORM_CHANGE_STR = [
    'widthChange',
    'heightChange',
    'scaleXChange',
    'scaleYChange',
    'skewXChange',
    'skewYChange',
    'rotationChange',
    'offsetXChange',
    'offsetYChange',
    'transformsEnabledChange',
    'strokeWidthChange',
];
var ANGLES = {
    'top-left': -45,
    'top-center': 0,
    'top-right': 45,
    'middle-right': -90,
    'middle-left': 90,
    'bottom-left': -135,
    'bottom-center': 180,
    'bottom-right': 135,
};
const TOUCH_DEVICE = "ontouchstart" in _Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva._global;
function getCursor(anchorName, rad) {
    if (anchorName === 'rotater') {
        return 'crosshair';
    }
    rad += _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.degToRad(ANGLES[anchorName] || 0);
    var angle = ((_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.radToDeg(rad) % 360) + 360) % 360;
    if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 315 + 22.5, 360) || _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 0, 22.5)) {
        return 'ns-resize';
    }
    else if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
        return 'nesw-resize';
    }
    else if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
        return 'ew-resize';
    }
    else if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
        return 'nwse-resize';
    }
    else if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
        return 'ns-resize';
    }
    else if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
        return 'nesw-resize';
    }
    else if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
        return 'ew-resize';
    }
    else if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
        return 'nwse-resize';
    }
    else {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.error('Transformer has unknown angle for cursor detection: ' + angle);
        return 'pointer';
    }
}
var ANCHORS_NAMES = [
    'top-left',
    'top-center',
    'top-right',
    'middle-right',
    'middle-left',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];
var MAX_SAFE_INTEGER = 100000000;
function getCenter(shape) {
    return {
        x: shape.x +
            (shape.width / 2) * Math.cos(shape.rotation) +
            (shape.height / 2) * Math.sin(-shape.rotation),
        y: shape.y +
            (shape.height / 2) * Math.cos(shape.rotation) +
            (shape.width / 2) * Math.sin(shape.rotation),
    };
}
function rotateAroundPoint(shape, angleRad, point) {
    const x = point.x +
        (shape.x - point.x) * Math.cos(angleRad) -
        (shape.y - point.y) * Math.sin(angleRad);
    const y = point.y +
        (shape.x - point.x) * Math.sin(angleRad) +
        (shape.y - point.y) * Math.cos(angleRad);
    return Object.assign(Object.assign({}, shape), { rotation: shape.rotation + angleRad, x,
        y });
}
function rotateAroundCenter(shape, deltaRad) {
    const center = getCenter(shape);
    return rotateAroundPoint(shape, deltaRad, center);
}
function getSnap(snaps, newRotationRad, tol) {
    let snapped = newRotationRad;
    for (let i = 0; i < snaps.length; i++) {
        const angle = _Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(snaps[i]);
        const absDiff = Math.abs(angle - newRotationRad) % (Math.PI * 2);
        const dif = Math.min(absDiff, Math.PI * 2 - absDiff);
        if (dif < tol) {
            snapped = angle;
        }
    }
    return snapped;
}
class Transformer extends _Group_js__WEBPACK_IMPORTED_MODULE_5__.Group {
    constructor(config) {
        super(config);
        this._transforming = false;
        this._createElements();
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleMouseUp = this._handleMouseUp.bind(this);
        this.update = this.update.bind(this);
        this.on(ATTR_CHANGE_LIST, this.update);
        if (this.getNode()) {
            this.update();
        }
    }
    attachTo(node) {
        this.setNode(node);
        return this;
    }
    setNode(node) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead.');
        return this.setNodes([node]);
    }
    getNode() {
        return this._nodes && this._nodes[0];
    }
    _getEventNamespace() {
        return EVENTS_NAME + this._id;
    }
    setNodes(nodes = []) {
        if (this._nodes && this._nodes.length) {
            this.detach();
        }
        this._nodes = nodes;
        if (nodes.length === 1 && this.useSingleNodeRotation()) {
            this.rotation(nodes[0].getAbsoluteRotation());
        }
        else {
            this.rotation(0);
        }
        this._nodes.forEach((node) => {
            const onChange = () => {
                if (this.nodes().length === 1 && this.useSingleNodeRotation()) {
                    this.rotation(this.nodes()[0].getAbsoluteRotation());
                }
                this._resetTransformCache();
                if (!this._transforming && !this.isDragging()) {
                    this.update();
                }
            };
            const additionalEvents = node._attrsAffectingSize
                .map((prop) => prop + 'Change.' + this._getEventNamespace())
                .join(' ');
            node.on(additionalEvents, onChange);
            node.on(TRANSFORM_CHANGE_STR.map((e) => e + `.${this._getEventNamespace()}`).join(' '), onChange);
            node.on(`absoluteTransformChange.${this._getEventNamespace()}`, onChange);
            this._proxyDrag(node);
        });
        this._resetTransformCache();
        var elementsCreated = !!this.findOne('.top-left');
        if (elementsCreated) {
            this.update();
        }
        return this;
    }
    _proxyDrag(node) {
        let lastPos;
        node.on(`dragstart.${this._getEventNamespace()}`, (e) => {
            lastPos = node.getAbsolutePosition();
            if (!this.isDragging() && node !== this.findOne('.back')) {
                this.startDrag(e, false);
            }
        });
        node.on(`dragmove.${this._getEventNamespace()}`, (e) => {
            if (!lastPos) {
                return;
            }
            const abs = node.getAbsolutePosition();
            const dx = abs.x - lastPos.x;
            const dy = abs.y - lastPos.y;
            this.nodes().forEach((otherNode) => {
                if (otherNode === node) {
                    return;
                }
                if (otherNode.isDragging()) {
                    return;
                }
                const otherAbs = otherNode.getAbsolutePosition();
                otherNode.setAbsolutePosition({
                    x: otherAbs.x + dx,
                    y: otherAbs.y + dy,
                });
                otherNode.startDrag(e);
            });
            lastPos = null;
        });
    }
    getNodes() {
        return this._nodes || [];
    }
    getActiveAnchor() {
        return this._movingAnchorName;
    }
    detach() {
        if (this._nodes) {
            this._nodes.forEach((node) => {
                node.off('.' + this._getEventNamespace());
            });
        }
        this._nodes = [];
        this._resetTransformCache();
    }
    _resetTransformCache() {
        this._clearCache(NODES_RECT);
        this._clearCache('transform');
        this._clearSelfAndDescendantCache('absoluteTransform');
    }
    _getNodeRect() {
        return this._getCache(NODES_RECT, this.__getNodeRect);
    }
    __getNodeShape(node, rot = this.rotation(), relative) {
        var rect = node.getClientRect({
            skipTransform: true,
            skipShadow: true,
            skipStroke: this.ignoreStroke(),
        });
        var absScale = node.getAbsoluteScale(relative);
        var absPos = node.getAbsolutePosition(relative);
        var dx = rect.x * absScale.x - node.offsetX() * absScale.x;
        var dy = rect.y * absScale.y - node.offsetY() * absScale.y;
        const rotation = (_Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(node.getAbsoluteRotation()) + Math.PI * 2) %
            (Math.PI * 2);
        const box = {
            x: absPos.x + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
            y: absPos.y + dy * Math.cos(rotation) + dx * Math.sin(rotation),
            width: rect.width * absScale.x,
            height: rect.height * absScale.y,
            rotation: rotation,
        };
        return rotateAroundPoint(box, -_Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(rot), {
            x: 0,
            y: 0,
        });
    }
    __getNodeRect() {
        var node = this.getNode();
        if (!node) {
            return {
                x: -MAX_SAFE_INTEGER,
                y: -MAX_SAFE_INTEGER,
                width: 0,
                height: 0,
                rotation: 0,
            };
        }
        const totalPoints = [];
        this.nodes().map((node) => {
            const box = node.getClientRect({
                skipTransform: true,
                skipShadow: true,
                skipStroke: this.ignoreStroke(),
            });
            var points = [
                { x: box.x, y: box.y },
                { x: box.x + box.width, y: box.y },
                { x: box.x + box.width, y: box.y + box.height },
                { x: box.x, y: box.y + box.height },
            ];
            var trans = node.getAbsoluteTransform();
            points.forEach(function (point) {
                var transformed = trans.point(point);
                totalPoints.push(transformed);
            });
        });
        const tr = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
        tr.rotate(-_Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(this.rotation()));
        var minX, minY, maxX, maxY;
        totalPoints.forEach(function (point) {
            var transformed = tr.point(point);
            if (minX === undefined) {
                minX = maxX = transformed.x;
                minY = maxY = transformed.y;
            }
            minX = Math.min(minX, transformed.x);
            minY = Math.min(minY, transformed.y);
            maxX = Math.max(maxX, transformed.x);
            maxY = Math.max(maxY, transformed.y);
        });
        tr.invert();
        const p = tr.point({ x: minX, y: minY });
        return {
            x: p.x,
            y: p.y,
            width: maxX - minX,
            height: maxY - minY,
            rotation: _Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(this.rotation()),
        };
    }
    getX() {
        return this._getNodeRect().x;
    }
    getY() {
        return this._getNodeRect().y;
    }
    getWidth() {
        return this._getNodeRect().width;
    }
    getHeight() {
        return this._getNodeRect().height;
    }
    _createElements() {
        this._createBack();
        ANCHORS_NAMES.forEach(function (name) {
            this._createAnchor(name);
        }.bind(this));
        this._createAnchor('rotater');
    }
    _createAnchor(name) {
        var anchor = new _Rect_js__WEBPACK_IMPORTED_MODULE_4__.Rect({
            stroke: 'rgb(0, 161, 255)',
            fill: 'white',
            strokeWidth: 1,
            name: name + ' _anchor',
            dragDistance: 0,
            draggable: true,
            hitStrokeWidth: TOUCH_DEVICE ? 10 : 'auto',
        });
        var self = this;
        anchor.on('mousedown touchstart', function (e) {
            self._handleMouseDown(e);
        });
        anchor.on('dragstart', (e) => {
            anchor.stopDrag();
            e.cancelBubble = true;
        });
        anchor.on('dragend', (e) => {
            e.cancelBubble = true;
        });
        anchor.on('mouseenter', () => {
            var rad = _Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(this.rotation());
            var cursor = getCursor(name, rad);
            anchor.getStage().content &&
                (anchor.getStage().content.style.cursor = cursor);
            this._cursorChange = true;
        });
        anchor.on('mouseout', () => {
            anchor.getStage().content &&
                (anchor.getStage().content.style.cursor = '');
            this._cursorChange = false;
        });
        this.add(anchor);
    }
    _createBack() {
        var back = new _Shape_js__WEBPACK_IMPORTED_MODULE_3__.Shape({
            name: 'back',
            width: 0,
            height: 0,
            draggable: true,
            sceneFunc(ctx) {
                var tr = this.getParent();
                var padding = tr.padding();
                ctx.beginPath();
                ctx.rect(-padding, -padding, this.width() + padding * 2, this.height() + padding * 2);
                ctx.moveTo(this.width() / 2, -padding);
                if (tr.rotateEnabled()) {
                    ctx.lineTo(this.width() / 2, -tr.rotateAnchorOffset() * _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._sign(this.height()) - padding);
                }
                ctx.fillStrokeShape(this);
            },
            hitFunc: (ctx, shape) => {
                if (!this.shouldOverdrawWholeArea()) {
                    return;
                }
                var padding = this.padding();
                ctx.beginPath();
                ctx.rect(-padding, -padding, shape.width() + padding * 2, shape.height() + padding * 2);
                ctx.fillStrokeShape(shape);
            },
        });
        this.add(back);
        this._proxyDrag(back);
        back.on('dragstart', (e) => {
            e.cancelBubble = true;
        });
        back.on('dragmove', (e) => {
            e.cancelBubble = true;
        });
        back.on('dragend', (e) => {
            e.cancelBubble = true;
        });
        this.on('dragmove', (e) => {
            this.update();
        });
    }
    _handleMouseDown(e) {
        this._movingAnchorName = e.target.name().split(' ')[0];
        var attrs = this._getNodeRect();
        var width = attrs.width;
        var height = attrs.height;
        var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.sin = Math.abs(height / hypotenuse);
        this.cos = Math.abs(width / hypotenuse);
        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', this._handleMouseMove);
            window.addEventListener('touchmove', this._handleMouseMove);
            window.addEventListener('mouseup', this._handleMouseUp, true);
            window.addEventListener('touchend', this._handleMouseUp, true);
        }
        this._transforming = true;
        var ap = e.target.getAbsolutePosition();
        var pos = e.target.getStage().getPointerPosition();
        this._anchorDragOffset = {
            x: pos.x - ap.x,
            y: pos.y - ap.y,
        };
        this._fire('transformstart', { evt: e.evt, target: this.getNode() });
        this._nodes.forEach((target) => {
            target._fire('transformstart', { evt: e.evt, target });
        });
    }
    _handleMouseMove(e) {
        var x, y, newHypotenuse;
        var anchorNode = this.findOne('.' + this._movingAnchorName);
        var stage = anchorNode.getStage();
        stage.setPointersPositions(e);
        const pp = stage.getPointerPosition();
        let newNodePos = {
            x: pp.x - this._anchorDragOffset.x,
            y: pp.y - this._anchorDragOffset.y,
        };
        const oldAbs = anchorNode.getAbsolutePosition();
        if (this.anchorDragBoundFunc()) {
            newNodePos = this.anchorDragBoundFunc()(oldAbs, newNodePos, e);
        }
        anchorNode.setAbsolutePosition(newNodePos);
        const newAbs = anchorNode.getAbsolutePosition();
        if (oldAbs.x === newAbs.x && oldAbs.y === newAbs.y) {
            return;
        }
        if (this._movingAnchorName === 'rotater') {
            var attrs = this._getNodeRect();
            x = anchorNode.x() - attrs.width / 2;
            y = -anchorNode.y() + attrs.height / 2;
            let delta = Math.atan2(-y, x) + Math.PI / 2;
            if (attrs.height < 0) {
                delta -= Math.PI;
            }
            var oldRotation = _Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(this.rotation());
            const newRotation = oldRotation + delta;
            const tol = _Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(this.rotationSnapTolerance());
            const snappedRot = getSnap(this.rotationSnaps(), newRotation, tol);
            const diff = snappedRot - attrs.rotation;
            const shape = rotateAroundCenter(attrs, diff);
            this._fitNodesInto(shape, e);
            return;
        }
        var keepProportion = this.keepRatio() || e.shiftKey;
        var centeredScaling = this.centeredScaling() || e.altKey;
        if (this._movingAnchorName === 'top-left') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.bottom-right').x(),
                        y: this.findOne('.bottom-right').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                    Math.pow(comparePoint.y - anchorNode.y(), 2));
                var reverseX = this.findOne('.top-left').x() > comparePoint.x ? -1 : 1;
                var reverseY = this.findOne('.top-left').y() > comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.top-left').x(comparePoint.x - x);
                this.findOne('.top-left').y(comparePoint.y - y);
            }
        }
        else if (this._movingAnchorName === 'top-center') {
            this.findOne('.top-left').y(anchorNode.y());
        }
        else if (this._movingAnchorName === 'top-right') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.bottom-left').x(),
                        y: this.findOne('.bottom-left').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                    Math.pow(comparePoint.y - anchorNode.y(), 2));
                var reverseX = this.findOne('.top-right').x() < comparePoint.x ? -1 : 1;
                var reverseY = this.findOne('.top-right').y() > comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.top-right').x(comparePoint.x + x);
                this.findOne('.top-right').y(comparePoint.y - y);
            }
            var pos = anchorNode.position();
            this.findOne('.top-left').y(pos.y);
            this.findOne('.bottom-right').x(pos.x);
        }
        else if (this._movingAnchorName === 'middle-left') {
            this.findOne('.top-left').x(anchorNode.x());
        }
        else if (this._movingAnchorName === 'middle-right') {
            this.findOne('.bottom-right').x(anchorNode.x());
        }
        else if (this._movingAnchorName === 'bottom-left') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.top-right').x(),
                        y: this.findOne('.top-right').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                    Math.pow(anchorNode.y() - comparePoint.y, 2));
                var reverseX = comparePoint.x < anchorNode.x() ? -1 : 1;
                var reverseY = anchorNode.y() < comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                anchorNode.x(comparePoint.x - x);
                anchorNode.y(comparePoint.y + y);
            }
            pos = anchorNode.position();
            this.findOne('.top-left').x(pos.x);
            this.findOne('.bottom-right').y(pos.y);
        }
        else if (this._movingAnchorName === 'bottom-center') {
            this.findOne('.bottom-right').y(anchorNode.y());
        }
        else if (this._movingAnchorName === 'bottom-right') {
            if (keepProportion) {
                var comparePoint = centeredScaling
                    ? {
                        x: this.width() / 2,
                        y: this.height() / 2,
                    }
                    : {
                        x: this.findOne('.top-left').x(),
                        y: this.findOne('.top-left').y(),
                    };
                newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                    Math.pow(anchorNode.y() - comparePoint.y, 2));
                var reverseX = this.findOne('.bottom-right').x() < comparePoint.x ? -1 : 1;
                var reverseY = this.findOne('.bottom-right').y() < comparePoint.y ? -1 : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.bottom-right').x(comparePoint.x + x);
                this.findOne('.bottom-right').y(comparePoint.y + y);
            }
        }
        else {
            console.error(new Error('Wrong position argument of selection resizer: ' +
                this._movingAnchorName));
        }
        var centeredScaling = this.centeredScaling() || e.altKey;
        if (centeredScaling) {
            var topLeft = this.findOne('.top-left');
            var bottomRight = this.findOne('.bottom-right');
            var topOffsetX = topLeft.x();
            var topOffsetY = topLeft.y();
            var bottomOffsetX = this.getWidth() - bottomRight.x();
            var bottomOffsetY = this.getHeight() - bottomRight.y();
            bottomRight.move({
                x: -topOffsetX,
                y: -topOffsetY,
            });
            topLeft.move({
                x: bottomOffsetX,
                y: bottomOffsetY,
            });
        }
        var absPos = this.findOne('.top-left').getAbsolutePosition();
        x = absPos.x;
        y = absPos.y;
        var width = this.findOne('.bottom-right').x() - this.findOne('.top-left').x();
        var height = this.findOne('.bottom-right').y() - this.findOne('.top-left').y();
        this._fitNodesInto({
            x: x,
            y: y,
            width: width,
            height: height,
            rotation: _Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(this.rotation()),
        }, e);
    }
    _handleMouseUp(e) {
        this._removeEvents(e);
    }
    getAbsoluteTransform() {
        return this.getTransform();
    }
    _removeEvents(e) {
        if (this._transforming) {
            this._transforming = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('mousemove', this._handleMouseMove);
                window.removeEventListener('touchmove', this._handleMouseMove);
                window.removeEventListener('mouseup', this._handleMouseUp, true);
                window.removeEventListener('touchend', this._handleMouseUp, true);
            }
            var node = this.getNode();
            this._fire('transformend', { evt: e, target: node });
            if (node) {
                this._nodes.forEach((target) => {
                    target._fire('transformend', { evt: e, target });
                });
            }
            this._movingAnchorName = null;
        }
    }
    _fitNodesInto(newAttrs, evt) {
        var oldAttrs = this._getNodeRect();
        const minSize = 1;
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(newAttrs.width, -this.padding() * 2 - minSize, minSize)) {
            this.update();
            return;
        }
        if (_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._inRange(newAttrs.height, -this.padding() * 2 - minSize, minSize)) {
            this.update();
            return;
        }
        const allowNegativeScale = this.flipEnabled();
        var t = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
        t.rotate(_Global_js__WEBPACK_IMPORTED_MODULE_6__.Konva.getAngle(this.rotation()));
        if (this._movingAnchorName &&
            newAttrs.width < 0 &&
            this._movingAnchorName.indexOf('left') >= 0) {
            const offset = t.point({
                x: -this.padding() * 2,
                y: 0,
            });
            newAttrs.x += offset.x;
            newAttrs.y += offset.y;
            newAttrs.width += this.padding() * 2;
            this._movingAnchorName = this._movingAnchorName.replace('left', 'right');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        else if (this._movingAnchorName &&
            newAttrs.width < 0 &&
            this._movingAnchorName.indexOf('right') >= 0) {
            const offset = t.point({
                x: this.padding() * 2,
                y: 0,
            });
            this._movingAnchorName = this._movingAnchorName.replace('right', 'left');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            newAttrs.width += this.padding() * 2;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        if (this._movingAnchorName &&
            newAttrs.height < 0 &&
            this._movingAnchorName.indexOf('top') >= 0) {
            const offset = t.point({
                x: 0,
                y: -this.padding() * 2,
            });
            newAttrs.x += offset.x;
            newAttrs.y += offset.y;
            this._movingAnchorName = this._movingAnchorName.replace('top', 'bottom');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            newAttrs.height += this.padding() * 2;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        else if (this._movingAnchorName &&
            newAttrs.height < 0 &&
            this._movingAnchorName.indexOf('bottom') >= 0) {
            const offset = t.point({
                x: 0,
                y: this.padding() * 2,
            });
            this._movingAnchorName = this._movingAnchorName.replace('bottom', 'top');
            this._anchorDragOffset.x -= offset.x;
            this._anchorDragOffset.y -= offset.y;
            newAttrs.height += this.padding() * 2;
            if (!allowNegativeScale) {
                this.update();
                return;
            }
        }
        if (this.boundBoxFunc()) {
            const bounded = this.boundBoxFunc()(oldAttrs, newAttrs);
            if (bounded) {
                newAttrs = bounded;
            }
            else {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('boundBoxFunc returned falsy. You should return new bound rect from it!');
            }
        }
        const baseSize = 10000000;
        const oldTr = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
        oldTr.translate(oldAttrs.x, oldAttrs.y);
        oldTr.rotate(oldAttrs.rotation);
        oldTr.scale(oldAttrs.width / baseSize, oldAttrs.height / baseSize);
        const newTr = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
        newTr.translate(newAttrs.x, newAttrs.y);
        newTr.rotate(newAttrs.rotation);
        newTr.scale(newAttrs.width / baseSize, newAttrs.height / baseSize);
        const delta = newTr.multiply(oldTr.invert());
        this._nodes.forEach((node) => {
            var _a;
            const parentTransform = node.getParent().getAbsoluteTransform();
            const localTransform = node.getTransform().copy();
            localTransform.translate(node.offsetX(), node.offsetY());
            const newLocalTransform = new _Util_js__WEBPACK_IMPORTED_MODULE_0__.Transform();
            newLocalTransform
                .multiply(parentTransform.copy().invert())
                .multiply(delta)
                .multiply(parentTransform)
                .multiply(localTransform);
            const attrs = newLocalTransform.decompose();
            node.setAttrs(attrs);
            this._fire('transform', { evt: evt, target: node });
            node._fire('transform', { evt: evt, target: node });
            (_a = node.getLayer()) === null || _a === void 0 ? void 0 : _a.batchDraw();
        });
        this.rotation(_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._getRotation(newAttrs.rotation));
        this._resetTransformCache();
        this.update();
        this.getLayer().batchDraw();
    }
    forceUpdate() {
        this._resetTransformCache();
        this.update();
    }
    _batchChangeChild(selector, attrs) {
        const anchor = this.findOne(selector);
        anchor.setAttrs(attrs);
    }
    update() {
        var _a;
        var attrs = this._getNodeRect();
        this.rotation(_Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._getRotation(attrs.rotation));
        var width = attrs.width;
        var height = attrs.height;
        var enabledAnchors = this.enabledAnchors();
        var resizeEnabled = this.resizeEnabled();
        var padding = this.padding();
        var anchorSize = this.anchorSize();
        this.find('._anchor').forEach((node) => {
            node.setAttrs({
                width: anchorSize,
                height: anchorSize,
                offsetX: anchorSize / 2,
                offsetY: anchorSize / 2,
                stroke: this.anchorStroke(),
                strokeWidth: this.anchorStrokeWidth(),
                fill: this.anchorFill(),
                cornerRadius: this.anchorCornerRadius(),
            });
        });
        this._batchChangeChild('.top-left', {
            x: 0,
            y: 0,
            offsetX: anchorSize / 2 + padding,
            offsetY: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('top-left') >= 0,
        });
        this._batchChangeChild('.top-center', {
            x: width / 2,
            y: 0,
            offsetY: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('top-center') >= 0,
        });
        this._batchChangeChild('.top-right', {
            x: width,
            y: 0,
            offsetX: anchorSize / 2 - padding,
            offsetY: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('top-right') >= 0,
        });
        this._batchChangeChild('.middle-left', {
            x: 0,
            y: height / 2,
            offsetX: anchorSize / 2 + padding,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-left') >= 0,
        });
        this._batchChangeChild('.middle-right', {
            x: width,
            y: height / 2,
            offsetX: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-right') >= 0,
        });
        this._batchChangeChild('.bottom-left', {
            x: 0,
            y: height,
            offsetX: anchorSize / 2 + padding,
            offsetY: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-left') >= 0,
        });
        this._batchChangeChild('.bottom-center', {
            x: width / 2,
            y: height,
            offsetY: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-center') >= 0,
        });
        this._batchChangeChild('.bottom-right', {
            x: width,
            y: height,
            offsetX: anchorSize / 2 - padding,
            offsetY: anchorSize / 2 - padding,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-right') >= 0,
        });
        this._batchChangeChild('.rotater', {
            x: width / 2,
            y: -this.rotateAnchorOffset() * _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util._sign(height) - padding,
            visible: this.rotateEnabled(),
        });
        this._batchChangeChild('.back', {
            width: width,
            height: height,
            visible: this.borderEnabled(),
            stroke: this.borderStroke(),
            strokeWidth: this.borderStrokeWidth(),
            dash: this.borderDash(),
            x: 0,
            y: 0,
        });
        (_a = this.getLayer()) === null || _a === void 0 ? void 0 : _a.batchDraw();
    }
    isTransforming() {
        return this._transforming;
    }
    stopTransform() {
        if (this._transforming) {
            this._removeEvents();
            var anchorNode = this.findOne('.' + this._movingAnchorName);
            if (anchorNode) {
                anchorNode.stopDrag();
            }
        }
    }
    destroy() {
        if (this.getStage() && this._cursorChange) {
            this.getStage().content && (this.getStage().content.style.cursor = '');
        }
        _Group_js__WEBPACK_IMPORTED_MODULE_5__.Group.prototype.destroy.call(this);
        this.detach();
        this._removeEvents();
        return this;
    }
    toObject() {
        return _Node_js__WEBPACK_IMPORTED_MODULE_2__.Node.prototype.toObject.call(this);
    }
}
function validateAnchors(val) {
    if (!(val instanceof Array)) {
        _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('enabledAnchors value should be an array');
    }
    if (val instanceof Array) {
        val.forEach(function (name) {
            if (ANCHORS_NAMES.indexOf(name) === -1) {
                _Util_js__WEBPACK_IMPORTED_MODULE_0__.Util.warn('Unknown anchor name: ' +
                    name +
                    '. Available names are: ' +
                    ANCHORS_NAMES.join(', '));
            }
        });
    }
    return val || [];
}
Transformer.prototype.className = 'Transformer';
(0,_Global_js__WEBPACK_IMPORTED_MODULE_6__._registerNode)(Transformer);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'enabledAnchors', ANCHORS_NAMES, validateAnchors);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'flipEnabled', true, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getBooleanValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'resizeEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'anchorSize', 10, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'rotateEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'rotationSnaps', []);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'rotateAnchorOffset', 50, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'rotationSnapTolerance', 5, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'borderEnabled', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'anchorStroke', 'rgb(0, 161, 255)');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'anchorStrokeWidth', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'anchorFill', 'white');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'anchorCornerRadius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'borderStroke', 'rgb(0, 161, 255)');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'borderStrokeWidth', 1, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'borderDash');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'keepRatio', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'centeredScaling', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'ignoreStroke', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'padding', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_7__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'node');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'nodes');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'boundBoxFunc');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'anchorDragBoundFunc');
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'shouldOverdrawWholeArea', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.addGetterSetter(Transformer, 'useSingleNodeRotation', true);
_Factory_js__WEBPACK_IMPORTED_MODULE_1__.Factory.backCompat(Transformer, {
    lineEnabled: 'borderEnabled',
    rotateHandlerOffset: 'rotateAnchorOffset',
    enabledHandlers: 'enabledAnchors',
});


/***/ }),

/***/ "./node_modules/konva/lib/shapes/Wedge.js":
/*!************************************************!*\
  !*** ./node_modules/konva/lib/shapes/Wedge.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Wedge": () => (/* binding */ Wedge)
/* harmony export */ });
/* harmony import */ var _Factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Factory.js */ "./node_modules/konva/lib/Factory.js");
/* harmony import */ var _Shape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shape.js */ "./node_modules/konva/lib/Shape.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "./node_modules/konva/lib/Global.js");
/* harmony import */ var _Validators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Validators.js */ "./node_modules/konva/lib/Validators.js");





class Wedge extends _Shape_js__WEBPACK_IMPORTED_MODULE_1__.Shape {
    _sceneFunc(context) {
        context.beginPath();
        context.arc(0, 0, this.radius(), 0, _Global_js__WEBPACK_IMPORTED_MODULE_2__.Konva.getAngle(this.angle()), this.clockwise());
        context.lineTo(0, 0);
        context.closePath();
        context.fillStrokeShape(this);
    }
    getWidth() {
        return this.radius() * 2;
    }
    getHeight() {
        return this.radius() * 2;
    }
    setWidth(width) {
        this.radius(width / 2);
    }
    setHeight(height) {
        this.radius(height / 2);
    }
}
Wedge.prototype.className = 'Wedge';
Wedge.prototype._centroid = true;
Wedge.prototype._attrsAffectingSize = ['radius'];
(0,_Global_js__WEBPACK_IMPORTED_MODULE_2__._registerNode)(Wedge);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Wedge, 'radius', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Wedge, 'angle', 0, (0,_Validators_js__WEBPACK_IMPORTED_MODULE_3__.getNumberValidator)());
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.addGetterSetter(Wedge, 'clockwise', false);
_Factory_js__WEBPACK_IMPORTED_MODULE_0__.Factory.backCompat(Wedge, {
    angleDeg: 'angle',
    getAngleDeg: 'getAngle',
    setAngleDeg: 'setAngle',
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var normalize_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! normalize.css */ "./node_modules/normalize.css/normalize.css");
/* harmony import */ var _css_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/main.scss */ "./src/css/main.scss");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var konva__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! konva */ "./node_modules/konva/lib/index.js");
/* harmony import */ var _data_routes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data-routes.js */ "./src/js/data-routes.js");
/* harmony import */ var _data_markers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./data-markers.js */ "./src/js/data-markers.js");
/* harmony import */ var _data_stations_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./data-stations.js */ "./src/js/data-stations.js");









document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('[data-canvas]');
    if (el) new Map(el);
});

class Map {
    constructor(el) {
        this.el = el;

        this.field = this.el.querySelector('.canvas__field');

        this.width = this.field.clientWidth;
        this.height = this.field.clientHeight;

        this.loading = false;;

        this.layerSize = {
            width: 1734,
            height: 1191
        }

        this.stage = new konva__WEBPACK_IMPORTED_MODULE_3__["default"].Stage({
            container: this.field,
            width: this.width,
            height: this.height,
            draggable: true,
        });

        this.layerPlan = new konva__WEBPACK_IMPORTED_MODULE_3__["default"].Layer({
            x: this.stage.width() / 2,
            y: this.stage.height() / 2,
            offsetX: this.layerSize.width / 2,
            offsetY: this.layerSize.height / 2,
        });

        this.originalAttrs = {
            draggable: true,
            rotation: 0,
        };

        this.oldRotation = 0;
        this.startScale = 0;

        this.setListeners();
    }

    setListeners() {

        konva__WEBPACK_IMPORTED_MODULE_3__["default"].hitOnDragEnabled = true;
        konva__WEBPACK_IMPORTED_MODULE_3__["default"].captureTouchEventsEnabled = true;

        let hammertime = new (hammerjs__WEBPACK_IMPORTED_MODULE_2___default())(this.layerPlan, { domEvents: true });

        hammertime.get('pinch').set({ enable: true });

        this.setLines(_data_routes_js__WEBPACK_IMPORTED_MODULE_4__.data);
        this.setMarkers(_data_markers_js__WEBPACK_IMPORTED_MODULE_5__.data);
        this.setStations(_data_stations_js__WEBPACK_IMPORTED_MODULE_6__.data);

        this.initResizeScroll();
        // this.initResizeButtons();

        // this.layerPlan.on('swipe', (e) => {
        //     e.preventDefault();
        // });

        // this.layerPlan.on('dragend', () => {
        //     this.layerPlan.to(Object.assign({}, this.originalAttrs));
        // });

        // this.layerPlan.on('pinchstart', function (ev) {
        //     this.stopDrag();
        //     console.log('Начало расперды');
        // });

        // this.layerPlan.on('click', (ev) => {
        //     console.log('click');
        //     this.setActiveItem(ev);
        // });

        // this.layerPlan.on('press', (ev) => {
        //     console.log('press');
        //     this.setActiveItem(ev);
        // });

        // this.layerPlan.on('tap', (ev) => {
        //     console.log('tap');
        //     this.setActiveItem(ev);
        // });

        // this.layerPlan.on('pinchend pinchcancel', function (ev) {
        //     // Возвращаем как было
        //     // this.to(Object.assign({}, this.originalAttrs));
        //     scale = scale * ev.evt.gesture.scale;
        //     this.draggable(true);
        //     console.log('Конец расперды');
        // });

    }

    setLines = (data, params) => {

        for (let i in data) {
            let path = new konva__WEBPACK_IMPORTED_MODULE_3__["default"].Path(data[i]);
            this.layerPlan.add(path);
        }

        this.stage.add(this.layerPlan);

        this.centered();
    }

    setMarkers = (data, params) => {

        for (let i in data) {
            let path = new konva__WEBPACK_IMPORTED_MODULE_3__["default"].Path(data[i]);
            this.layerPlan.add(path);
        }

        this.stage.add(this.layerPlan);
    }

    setStations = (data, params) => {

        for (let i in data) {
            let path = new konva__WEBPACK_IMPORTED_MODULE_3__["default"].Path(data[i]);
            this.layerPlan.add(path);
        }

        this.stage.add(this.layerPlan);
    }

    initResizeScroll = () => {
        let scaleBy = 1.01;

        this.el.addEventListener('wheel', (e) => {
            e.preventDefault();

            let oldScale = this.stage.scaleX();
            let pointer = this.stage.getPointerPosition();

            let mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };

            let direction = e.deltaY > 0 ? 1 : -1;

            let newScale = direction > 0 ? oldScale - 0.1 : oldScale + 0.1;

            if (newScale < 0.5) {
                newScale = 0.5;
            }

            this.stage.scale({ x: newScale, y: newScale });

            let newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            this.stage.position(newPos);
        });
    }

    centered = () => {
        let scaleWidth = this.width / this.layerSize.width;
        let scaleHeight = this.height / this.layerSize.height;
        let scale = (scaleWidth < scaleHeight) ? scaleWidth : scaleHeight;

        this.stage.scale({ x: scale, y: scale });
        this.layerPlan.x(this.stage.width() / 2 / scale);
        this.layerPlan.y(this.stage.height() / 2 / scale);
    }
}
})();

/******/ })()
;