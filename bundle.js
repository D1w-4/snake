/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(11);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/* harmony export (immutable) */ __webpack_exports__["__exportStar"] = __exportStar;
/* harmony export (immutable) */ __webpack_exports__["__values"] = __values;
/* harmony export (immutable) */ __webpack_exports__["__read"] = __read;
/* harmony export (immutable) */ __webpack_exports__["__spread"] = __spread;
/* harmony export (immutable) */ __webpack_exports__["__await"] = __await;
/* harmony export (immutable) */ __webpack_exports__["__asyncGenerator"] = __asyncGenerator;
/* harmony export (immutable) */ __webpack_exports__["__asyncDelegator"] = __asyncDelegator;
/* harmony export (immutable) */ __webpack_exports__["__asyncValues"] = __asyncValues;
/* harmony export (immutable) */ __webpack_exports__["__makeTemplateObject"] = __makeTemplateObject;
/* harmony export (immutable) */ __webpack_exports__["__importStar"] = __importStar;
/* harmony export (immutable) */ __webpack_exports__["__importDefault"] = __importDefault;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(2);
var SnakeComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SnakeComponent, _super);
    function SnakeComponent() {
        var _this = _super.call(this) || this;
        _this.$SnakeScope = SnakeComponent.findScope(_this.parentElement);
        return _this;
    }
    SnakeComponent.findScope = function (el) {
        if (!el)
            return null;
        if (el instanceof SnakeComponent) {
            return el;
        }
        return SnakeComponent.findScope(el.parentElement);
    };
    SnakeComponent.registryComponents = function (component, _a) {
        var selector = _a.selector;
        var registeredComponentList = SnakeComponent.registeredComponentList;
        if (selector in registeredComponentList) {
            console.error("\u041A\u043E\u043C\u043E\u043F\u043E\u043D\u0435\u0442 " + selector + " \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D", component);
            return;
        }
        registeredComponentList[selector] = [component, { selector: selector }];
    };
    SnakeComponent.registeredComponentList = {};
    return SnakeComponent;
}(HTMLElement));
exports.SnakeComponent = SnakeComponent;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_component_decorator_1 = __webpack_require__(18);
exports.SnakeRegistryComponent = snake_component_decorator_1.SnakeRegistryComponent;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_matrix_service_1 = __webpack_require__(19);
exports.SnakeMatrixService = snake_matrix_service_1.SnakeMatrixService;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_cell_component_1 = __webpack_require__(20);
exports.SnakeCellComponent = snake_cell_component_1.SnakeCellComponent;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(8);
module.exports = __webpack_require__(12);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(9);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/stylus-loader/index.js?paths=src/!./app.styl", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/stylus-loader/index.js?paths=src/!./app.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports
exports.i(__webpack_require__(10), "");

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(13);
__webpack_require__(14);
var components_1 = __webpack_require__(15);
exports.SnakeAppComponent = components_1.SnakeAppComponent;
exports.SnakeBtnComponent = components_1.SnakeBtnComponent;
exports.SnakeCellComponent = components_1.SnakeCellComponent;
exports.SnakeHistoryComponent = components_1.SnakeHistoryComponent;
exports.SnakeInputComponent = components_1.SnakeInputComponent;
exports.SnakeMatrixComponent = components_1.SnakeMatrixComponent;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

(function(){
'use strict';var h=new function(){};var aa=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function m(b){var a=aa.has(b);b=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(b);return!a&&b}function n(b){var a=b.isConnected;if(void 0!==a)return a;for(;b&&!(b.__CE_isImportDocument||b instanceof Document);)b=b.parentNode||(window.ShadowRoot&&b instanceof ShadowRoot?b.host:void 0);return!(!b||!(b.__CE_isImportDocument||b instanceof Document))}
function p(b,a){for(;a&&a!==b&&!a.nextSibling;)a=a.parentNode;return a&&a!==b?a.nextSibling:null}
function t(b,a,c){c=c?c:new Set;for(var d=b;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;a(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)t(d,a,c);d=p(b,e);continue}else if("template"===f){d=p(b,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)t(e,a,c)}d=d.firstChild?d.firstChild:p(b,d)}}function u(b,a,c){b[a]=c};function v(){this.a=new Map;this.s=new Map;this.f=[];this.b=!1}function ba(b,a,c){b.a.set(a,c);b.s.set(c.constructor,c)}function w(b,a){b.b=!0;b.f.push(a)}function x(b,a){b.b&&t(a,function(a){return y(b,a)})}function y(b,a){if(b.b&&!a.__CE_patched){a.__CE_patched=!0;for(var c=0;c<b.f.length;c++)b.f[c](a)}}function z(b,a){var c=[];t(a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state?b.connectedCallback(d):A(b,d)}}
function B(b,a){var c=[];t(a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state&&b.disconnectedCallback(d)}}
function C(b,a,c){c=c?c:{};var d=c.w||new Set,e=c.i||function(a){return A(b,a)},f=[];t(a,function(a){if("link"===a.localName&&"import"===a.getAttribute("rel")){var c=a.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_hasRegistry=!0);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:a.addEventListener("load",function(){var c=a.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);C(b,c,{w:f,i:e})}})}else f.push(a)},d);if(b.b)for(a=0;a<
f.length;a++)y(b,f[a]);for(a=0;a<f.length;a++)e(f[a])}
function A(b,a){if(void 0===a.__CE_state){var c=a.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=b.a.get(a.localName)){c.constructionStack.push(a);var d=c.constructor;try{try{if(new d!==a)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{c.constructionStack.pop()}}catch(r){throw a.__CE_state=2,r;}a.__CE_state=1;a.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes,d=0;d<c.length;d++){var e=c[d],
f=a.getAttribute(e);null!==f&&b.attributeChangedCallback(a,e,null,f,null)}n(a)&&b.connectedCallback(a)}}}v.prototype.connectedCallback=function(b){var a=b.__CE_definition;a.connectedCallback&&a.connectedCallback.call(b)};v.prototype.disconnectedCallback=function(b){var a=b.__CE_definition;a.disconnectedCallback&&a.disconnectedCallback.call(b)};
v.prototype.attributeChangedCallback=function(b,a,c,d,e){var f=b.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(a)&&f.attributeChangedCallback.call(b,a,c,d,e)};function D(b,a){this.c=b;this.a=a;this.b=void 0;C(this.c,this.a);"loading"===this.a.readyState&&(this.b=new MutationObserver(this.f.bind(this)),this.b.observe(this.a,{childList:!0,subtree:!0}))}function E(b){b.b&&b.b.disconnect()}D.prototype.f=function(b){var a=this.a.readyState;"interactive"!==a&&"complete"!==a||E(this);for(a=0;a<b.length;a++)for(var c=b[a].addedNodes,d=0;d<c.length;d++)C(this.c,c[d])};function ca(){var b=this;this.b=this.a=void 0;this.f=new Promise(function(a){b.b=a;b.a&&a(b.a)})}function F(b){if(b.a)throw Error("Already resolved.");b.a=void 0;b.b&&b.b(void 0)};function G(b){this.j=!1;this.c=b;this.o=new Map;this.l=function(b){return b()};this.g=!1;this.m=[];this.u=new D(b,document)}
G.prototype.define=function(b,a){var c=this;if(!(a instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!m(b))throw new SyntaxError("The element name '"+b+"' is not valid.");if(this.c.a.get(b))throw Error("A custom element with name '"+b+"' has already been defined.");if(this.j)throw Error("A custom element is already being defined.");this.j=!0;var d,e,f,r,k;try{var g=function(b){var a=l[b];if(void 0!==a&&!(a instanceof Function))throw Error("The '"+b+"' callback must be a function.");
return a},l=a.prototype;if(!(l instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");d=g("connectedCallback");e=g("disconnectedCallback");f=g("adoptedCallback");r=g("attributeChangedCallback");k=a.observedAttributes||[]}catch(q){return}finally{this.j=!1}a={localName:b,constructor:a,connectedCallback:d,disconnectedCallback:e,adoptedCallback:f,attributeChangedCallback:r,observedAttributes:k,constructionStack:[]};ba(this.c,b,a);this.m.push(a);this.g||
(this.g=!0,this.l(function(){return da(c)}))};G.prototype.i=function(b){C(this.c,b)};function da(b){if(!1!==b.g){b.g=!1;for(var a=b.m,c=[],d=new Map,e=0;e<a.length;e++)d.set(a[e].localName,[]);C(b.c,document,{i:function(a){if(void 0===a.__CE_state){var e=a.localName,f=d.get(e);f?f.push(a):b.c.a.get(e)&&c.push(a)}}});for(e=0;e<c.length;e++)A(b.c,c[e]);for(;0<a.length;){for(var f=a.shift(),e=f.localName,f=d.get(f.localName),r=0;r<f.length;r++)A(b.c,f[r]);(e=b.o.get(e))&&F(e)}}}
G.prototype.get=function(b){if(b=this.c.a.get(b))return b.constructor};G.prototype.whenDefined=function(b){if(!m(b))return Promise.reject(new SyntaxError("'"+b+"' is not a valid custom element name."));var a=this.o.get(b);if(a)return a.f;a=new ca;this.o.set(b,a);this.c.a.get(b)&&!this.m.some(function(a){return a.localName===b})&&F(a);return a.f};G.prototype.v=function(b){E(this.u);var a=this.l;this.l=function(c){return b(function(){return a(c)})}};window.CustomElementRegistry=G;
G.prototype.define=G.prototype.define;G.prototype.upgrade=G.prototype.i;G.prototype.get=G.prototype.get;G.prototype.whenDefined=G.prototype.whenDefined;G.prototype.polyfillWrapFlushCallback=G.prototype.v;var H=window.Document.prototype.createElement,ea=window.Document.prototype.createElementNS,fa=window.Document.prototype.importNode,ga=window.Document.prototype.prepend,ha=window.Document.prototype.append,ia=window.DocumentFragment.prototype.prepend,ja=window.DocumentFragment.prototype.append,I=window.Node.prototype.cloneNode,J=window.Node.prototype.appendChild,K=window.Node.prototype.insertBefore,L=window.Node.prototype.removeChild,M=window.Node.prototype.replaceChild,N=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),O=window.Element.prototype.attachShadow,P=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),Q=window.Element.prototype.getAttribute,R=window.Element.prototype.setAttribute,S=window.Element.prototype.removeAttribute,T=window.Element.prototype.getAttributeNS,U=window.Element.prototype.setAttributeNS,ka=window.Element.prototype.removeAttributeNS,la=window.Element.prototype.insertAdjacentElement,ma=window.Element.prototype.insertAdjacentHTML,na=window.Element.prototype.prepend,
oa=window.Element.prototype.append,V=window.Element.prototype.before,pa=window.Element.prototype.after,qa=window.Element.prototype.replaceWith,ra=window.Element.prototype.remove,sa=window.HTMLElement,W=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),ta=window.HTMLElement.prototype.insertAdjacentElement,ua=window.HTMLElement.prototype.insertAdjacentHTML;function va(){var b=X;window.HTMLElement=function(){function a(){var a=this.constructor,d=b.s.get(a);if(!d)throw Error("The custom element being constructed was not registered with `customElements`.");var e=d.constructionStack;if(!e.length)return e=H.call(document,d.localName),Object.setPrototypeOf(e,a.prototype),e.__CE_state=1,e.__CE_definition=d,y(b,e),e;var d=e.length-1,f=e[d];if(f===h)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
e[d]=h;Object.setPrototypeOf(f,a.prototype);y(b,f);return f}a.prototype=sa.prototype;return a}()};function Y(b,a,c){function d(a){return function(c){for(var e=[],d=0;d<arguments.length;++d)e[d-0]=arguments[d];for(var d=[],f=[],l=0;l<e.length;l++){var q=e[l];q instanceof Element&&n(q)&&f.push(q);if(q instanceof DocumentFragment)for(q=q.firstChild;q;q=q.nextSibling)d.push(q);else d.push(q)}a.apply(this,e);for(e=0;e<f.length;e++)B(b,f[e]);if(n(this))for(e=0;e<d.length;e++)f=d[e],f instanceof Element&&z(b,f)}}c.h&&(a.prepend=d(c.h));c.append&&(a.append=d(c.append))};function wa(){var b=X;u(Document.prototype,"createElement",function(a){if(this.__CE_hasRegistry){var c=b.a.get(a);if(c)return new c.constructor}a=H.call(this,a);y(b,a);return a});u(Document.prototype,"importNode",function(a,c){a=fa.call(this,a,c);this.__CE_hasRegistry?C(b,a):x(b,a);return a});u(Document.prototype,"createElementNS",function(a,c){if(this.__CE_hasRegistry&&(null===a||"http://www.w3.org/1999/xhtml"===a)){var d=b.a.get(c);if(d)return new d.constructor}a=ea.call(this,a,c);y(b,a);return a});
Y(b,Document.prototype,{h:ga,append:ha})};function xa(){var b=X;function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var e=void 0;if(this.firstChild){var c=this.childNodes,k=c.length;if(0<k&&n(this))for(var e=Array(k),g=0;g<k;g++)e[g]=c[g]}d.set.call(this,a);if(e)for(a=0;a<e.length;a++)B(b,e[a])}}})}u(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var e=Array.prototype.slice.apply(a.childNodes);
a=K.call(this,a,d);if(n(this))for(d=0;d<e.length;d++)z(b,e[d]);return a}e=n(a);d=K.call(this,a,d);e&&B(b,a);n(this)&&z(b,a);return d});u(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=J.call(this,a);if(n(this))for(var e=0;e<c.length;e++)z(b,c[e]);return a}c=n(a);e=J.call(this,a);c&&B(b,a);n(this)&&z(b,a);return e});u(Node.prototype,"cloneNode",function(a){a=I.call(this,a);this.ownerDocument.__CE_hasRegistry?C(b,a):x(b,a);
return a});u(Node.prototype,"removeChild",function(a){var c=n(a),e=L.call(this,a);c&&B(b,a);return e});u(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var e=Array.prototype.slice.apply(a.childNodes);a=M.call(this,a,d);if(n(this))for(B(b,d),d=0;d<e.length;d++)z(b,e[d]);return a}var e=n(a),f=M.call(this,a,d),c=n(this);c&&B(b,d);e&&B(b,a);c&&z(b,a);return f});N&&N.get?a(Node.prototype,N):w(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=[],b=
0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join("")},set:function(a){for(;this.firstChild;)L.call(this,this.firstChild);J.call(this,document.createTextNode(a))}})})};function ya(b){var a=Element.prototype;function c(a){return function(e){for(var c=[],d=0;d<arguments.length;++d)c[d-0]=arguments[d];for(var d=[],k=[],g=0;g<c.length;g++){var l=c[g];l instanceof Element&&n(l)&&k.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)d.push(l);else d.push(l)}a.apply(this,c);for(c=0;c<k.length;c++)B(b,k[c]);if(n(this))for(c=0;c<d.length;c++)k=d[c],k instanceof Element&&z(b,k)}}V&&(a.before=c(V));V&&(a.after=c(pa));qa&&u(a,"replaceWith",function(a){for(var e=
[],c=0;c<arguments.length;++c)e[c-0]=arguments[c];for(var c=[],d=[],k=0;k<e.length;k++){var g=e[k];g instanceof Element&&n(g)&&d.push(g);if(g instanceof DocumentFragment)for(g=g.firstChild;g;g=g.nextSibling)c.push(g);else c.push(g)}k=n(this);qa.apply(this,e);for(e=0;e<d.length;e++)B(b,d[e]);if(k)for(B(b,this),e=0;e<c.length;e++)d=c[e],d instanceof Element&&z(b,d)});ra&&u(a,"remove",function(){var a=n(this);ra.call(this);a&&B(b,this)})};function za(){var b=X;function a(a,c){Object.defineProperty(a,"innerHTML",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(a){var e=this,d=void 0;n(this)&&(d=[],t(this,function(a){a!==e&&d.push(a)}));c.set.call(this,a);if(d)for(var f=0;f<d.length;f++){var r=d[f];1===r.__CE_state&&b.disconnectedCallback(r)}this.ownerDocument.__CE_hasRegistry?C(b,this):x(b,this);return a}})}function c(a,c){u(a,"insertAdjacentElement",function(a,e){var d=n(e);a=c.call(this,a,e);d&&B(b,e);n(a)&&z(b,e);
return a})}function d(a,c){function e(a,e){for(var c=[];a!==e;a=a.nextSibling)c.push(a);for(e=0;e<c.length;e++)C(b,c[e])}u(a,"insertAdjacentHTML",function(a,b){a=a.toLowerCase();if("beforebegin"===a){var d=this.previousSibling;c.call(this,a,b);e(d||this.parentNode.firstChild,this)}else if("afterbegin"===a)d=this.firstChild,c.call(this,a,b),e(this.firstChild,d);else if("beforeend"===a)d=this.lastChild,c.call(this,a,b),e(d||this.firstChild,null);else if("afterend"===a)d=this.nextSibling,c.call(this,
a,b),e(this.nextSibling,d);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");})}O&&u(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=O.call(this,a)});P&&P.get?a(Element.prototype,P):W&&W.get?a(HTMLElement.prototype,W):w(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return I.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName,e=b?this.content:this,
c=H.call(document,this.localName);for(c.innerHTML=a;0<e.childNodes.length;)L.call(e,e.childNodes[0]);for(a=b?c.content:c;0<a.childNodes.length;)J.call(e,a.childNodes[0])}})});u(Element.prototype,"setAttribute",function(a,c){if(1!==this.__CE_state)return R.call(this,a,c);var e=Q.call(this,a);R.call(this,a,c);c=Q.call(this,a);b.attributeChangedCallback(this,a,e,c,null)});u(Element.prototype,"setAttributeNS",function(a,c,d){if(1!==this.__CE_state)return U.call(this,a,c,d);var e=T.call(this,a,c);U.call(this,
a,c,d);d=T.call(this,a,c);b.attributeChangedCallback(this,c,e,d,a)});u(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return S.call(this,a);var c=Q.call(this,a);S.call(this,a);null!==c&&b.attributeChangedCallback(this,a,c,null,null)});u(Element.prototype,"removeAttributeNS",function(a,c){if(1!==this.__CE_state)return ka.call(this,a,c);var d=T.call(this,a,c);ka.call(this,a,c);var e=T.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});ta?c(HTMLElement.prototype,
ta):la?c(Element.prototype,la):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");ua?d(HTMLElement.prototype,ua):ma?d(Element.prototype,ma):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");Y(b,Element.prototype,{h:na,append:oa});ya(b)};/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var Z=window.customElements;if(!Z||Z.forcePolyfill||"function"!=typeof Z.define||"function"!=typeof Z.get){var X=new v;va();wa();Y(X,DocumentFragment.prototype,{h:ia,append:ja});xa();za();document.__CE_hasRegistry=!0;var customElements=new G(X);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements})};
}).call(self);

//# sourceMappingURL=custom-elements.min.js.map


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements.
 *
 * ES5-style classes don't work with native Custom Elements because the
 * HTMLElement constructor uses the value of `new.target` to look up the custom
 * element definition for the currently called constructor. `new.target` is only
 * set when `new` is called and is only propagated via super() calls. super()
 * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works
 * when extending other ES5-style classes, and does not propagate `new.target`.
 *
 * This shim allows the native HTMLElement constructor to work by generating and
 * registering a stand-in class instead of the users custom element class. This
 * stand-in class's constructor has an actual call to super().
 * `customElements.define()` and `customElements.get()` are both overridden to
 * hide this stand-in class from users.
 *
 * In order to create instance of the user-defined class, rather than the stand
 * in, the stand-in's constructor swizzles its instances prototype and invokes
 * the user-defined constructor. When the user-defined constructor is called
 * directly it creates an instance of the stand-in class to get a real extension
 * of HTMLElement and returns that.
 *
 * There are two important constructors: A patched HTMLElement constructor, and
 * the StandInElement constructor. They both will be called to create an element
 * but which is called first depends on whether the browser creates the element
 * or the user-defined constructor is called directly. The variables
 * `browserConstruction` and `userConstruction` control the flow between the
 * two constructors.
 *
 * This shim should be better than forcing the polyfill because:
 *   1. It's smaller
 *   2. All reaction timings are the same as native (mostly synchronous)
 *   3. All reaction triggering DOM operations are automatically supported
 *
 * There are some restrictions and requirements on ES5 constructors:
 *   1. All constructors in a inheritance hierarchy must be ES5-style, so that
 *      they can be called with Function.call(). This effectively means that the
 *      whole application must be compiled to ES5.
 *   2. Constructors must return the value of the emulated super() call. Like
 *      `return SuperClass.call(this)`
 *   3. The `this` reference should not be used before the emulated super() call
 *      just like `this` is illegal to use before super() in ES6.
 *   4. Constructors should not create other custom elements before the emulated
 *      super() call. This is the same restriction as with native custom
 *      elements.
 *
 *  Compiling valid class-based custom elements to ES5 will satisfy these
 *  requirements with the latest version of popular transpilers.
 */
(() => {
  'use strict';

  // Do nothing if `customElements` does not exist.
  if (!window.customElements) return;

  const NativeHTMLElement = window.HTMLElement;
  const nativeDefine = window.customElements.define;
  const nativeGet = window.customElements.get;

  /**
   * Map of user-provided constructors to tag names.
   *
   * @type {Map<Function, string>}
   */
  const tagnameByConstructor = new Map();

  /**
   * Map of tag names to user-provided constructors.
   *
   * @type {Map<string, Function>}
   */
  const constructorByTagname = new Map();


  /**
   * Whether the constructors are being called by a browser process, ie parsing
   * or createElement.
   */
  let browserConstruction = false;

  /**
   * Whether the constructors are being called by a user-space process, ie
   * calling an element constructor.
   */
  let userConstruction = false;

  window.HTMLElement = function() {
    if (!browserConstruction) {
      const tagname = tagnameByConstructor.get(this.constructor);
      const fakeClass = nativeGet.call(window.customElements, tagname);

      // Make sure that the fake constructor doesn't call back to this constructor
      userConstruction = true;
      const instance = new (fakeClass)();
      return instance;
    }
    // Else do nothing. This will be reached by ES5-style classes doing
    // HTMLElement.call() during initialization
    browserConstruction = false;
  };
  // By setting the patched HTMLElement's prototype property to the native
  // HTMLElement's prototype we make sure that:
  //     document.createElement('a') instanceof HTMLElement
  // works because instanceof uses HTMLElement.prototype, which is on the
  // ptototype chain of built-in elements.
  window.HTMLElement.prototype = NativeHTMLElement.prototype;

  const define = (tagname, elementClass) => {
    const elementProto = elementClass.prototype;
    const StandInElement = class extends NativeHTMLElement {
      constructor() {
        // Call the native HTMLElement constructor, this gives us the
        // under-construction instance as `this`:
        super();

        // The prototype will be wrong up because the browser used our fake
        // class, so fix it:
        Object.setPrototypeOf(this, elementProto);

        if (!userConstruction) {
          // Make sure that user-defined constructor bottom's out to a do-nothing
          // HTMLElement() call
          browserConstruction = true;
          // Call the user-defined constructor on our instance:
          elementClass.call(this);
        }
        userConstruction = false;
      }
    };
    const standInProto = StandInElement.prototype;
    StandInElement.observedAttributes = elementClass.observedAttributes;
    standInProto.connectedCallback = elementProto.connectedCallback;
    standInProto.disconnectedCallback = elementProto.disconnectedCallback;
    standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;
    standInProto.adoptedCallback = elementProto.adoptedCallback;

    tagnameByConstructor.set(elementClass, tagname);
    constructorByTagname.set(tagname, elementClass);
    nativeDefine.call(window.customElements, tagname, StandInElement);
  };

  const get = (tagname) => constructorByTagname.get(tagname);

  // Workaround for Safari bug where patching customElements can be lost, likely
  // due to native wrapper garbage collection issue
  Object.defineProperty(window, 'customElements',
    {value: window.customElements, configurable: true, writable: true});
  Object.defineProperty(window.customElements, 'define',
    {value: define, configurable: true, writable: true});
  Object.defineProperty(window.customElements, 'get',
    {value: get, configurable: true, writable: true});

})();


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_app_1 = __webpack_require__(16);
exports.SnakeAppComponent = snake_app_1.SnakeAppComponent;
var snake_input_1 = __webpack_require__(27);
exports.SnakeInputComponent = snake_input_1.SnakeInputComponent;
var snake_btn_1 = __webpack_require__(32);
exports.SnakeBtnComponent = snake_btn_1.SnakeBtnComponent;
var snake_cell_1 = __webpack_require__(6);
exports.SnakeCellComponent = snake_cell_1.SnakeCellComponent;
var snake_matrix_1 = __webpack_require__(37);
exports.SnakeMatrixComponent = snake_matrix_1.SnakeMatrixComponent;
var snake_history_1 = __webpack_require__(41);
exports.SnakeHistoryComponent = snake_history_1.SnakeHistoryComponent;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_app_component_1 = __webpack_require__(17);
exports.SnakeAppComponent = snake_app_component_1.SnakeAppComponent;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(2);
var decorators_1 = __webpack_require__(4);
var services_1 = __webpack_require__(5);
var snake_component_1 = __webpack_require__(3);
var snake_app_component_html_1 = tslib_1.__importDefault(__webpack_require__(24));
var snake_app_component_styl_1 = tslib_1.__importDefault(__webpack_require__(25));
var SnakeAppComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SnakeAppComponent, _super);
    function SnakeAppComponent() {
        var _this = _super.call(this) || this;
        _this.className = 'snake-app';
        _this.countCol = 5;
        _this.countRow = 5;
        _this.innerHTML = snake_app_component_html_1.default;
        _this.refreshBtn = document.getElementById('snake-refresh');
        _this.randBtn = document.getElementById('snake-rand-calc');
        _this.matrix = document.getElementById('snake-matrix');
        _this.chanceFild = document.getElementById('snake-app-rand-chance');
        _this.historyTable = document.getElementById('snake-history');
        _this.countDomainBlock = document.getElementById('snake-app-count-domain');
        _this.matrixService = new services_1.SnakeMatrixService();
        return _this;
    }
    SnakeAppComponent.prototype.randCalcMatrix = function () {
        this.matrixService.generateMatrix(this.countRow, this.countCol, +this.chanceFild.value);
        this.matrix.renderMatrix(this.matrixService.matrix);
        this.updateCountDomain();
        this.historyTable.renderHistory();
    };
    SnakeAppComponent.prototype.refreshMatrix = function () {
        this.matrixService.generateMatrix(this.countRow, this.countCol);
        this.matrix.renderMatrix(this.matrixService.matrix);
        this.countDomainBlock.innerText = '0';
    };
    SnakeAppComponent.prototype.updateCountDomain = function () {
        this.matrixService.calcDomain();
        this.countDomainBlock.innerText = this.matrixService.allDomainCounter + '';
    };
    SnakeAppComponent.prototype.setCountCol = function (value) {
        this.countCol = +value;
    };
    SnakeAppComponent.prototype.setCountRow = function (value) {
        this.countRow = +value;
    };
    SnakeAppComponent = tslib_1.__decorate([
        decorators_1.SnakeRegistryComponent({
            selector: 'snake-app',
            styles: snake_app_component_styl_1.default
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], SnakeAppComponent);
    return SnakeAppComponent;
}(snake_component_1.SnakeComponent));
exports.SnakeAppComponent = SnakeAppComponent;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_component_1 = __webpack_require__(3);
function SnakeRegistryComponent(data) {
    return function (target) {
        window.customElements.define(data.selector, target);
        snake_component_1.SnakeComponent.registryComponents(target, data);
    };
}
exports.SnakeRegistryComponent = SnakeRegistryComponent;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_cell_1 = __webpack_require__(6);
var SnakeMatrixService = /** @class */ (function () {
    function SnakeMatrixService() {
        this.allDomainCounter = 0;
        this.matrix = [];
        this.matrixHistory = [];
        SnakeMatrixService.instance = SnakeMatrixService.instance || this;
        return SnakeMatrixService.instance;
    }
    SnakeMatrixService.prototype.calcDomain = function () {
        this.allDomainCounter = 0;
        this.matrix.forEach(function (row) {
            return row.forEach(function (cell) { return cell.domainCount = 0; });
        });
        for (var row = 0; row < this.matrix.length; row++) {
            for (var col = 0; col < this.matrix[row].length; col++) {
                var _a = this.matrix[row][col], checked = _a.checked, domainCount = _a.domainCount;
                if (checked && !domainCount) {
                    this.allDomainCounter++;
                    this.recursiveChair(row, col);
                }
            }
        }
    };
    SnakeMatrixService.prototype.generateMatrix = function (rowLength, colLength, chance) {
        chance = chance / 100;
        this.matrix.length = rowLength;
        this.matrix = this.matrix.fill(null, 0, rowLength).map(function () {
            return new Array(colLength).fill(null).map(function () {
                var cell = new snake_cell_1.SnakeCellComponent();
                var r = Math.random();
                chance && (cell.checked = r <= chance);
                return cell;
            });
        });
        this.calcDomain();
        chance && this.pushMatrixHistory(chance, rowLength, colLength);
    };
    SnakeMatrixService.prototype.pushMatrixHistory = function (chance, row, col) {
        var maxHistoryLength = SnakeMatrixService.maxHistoryLength;
        this.matrixHistory.push({
            chance: chance,
            countCell: row * col,
            countDomain: this.allDomainCounter
        });
        var len = this.matrixHistory.length - maxHistoryLength;
        len > 0 && this.matrixHistory.splice(0, len);
    };
    SnakeMatrixService.prototype.recursiveChair = function (row, col) {
        var cell = this.matrix[row][col];
        if (cell.domainCount || !cell.checked) {
            return;
        }
        cell.domainCount = this.allDomainCounter;
        var rowLen = this.matrix.length - 1;
        var colLen = this.matrix[0].length - 1;
        if (row > 0) {
            this.recursiveChair(row - 1, col);
        }
        if (row < rowLen) {
            this.recursiveChair(row + 1, col);
        }
        if (col > 0) {
            this.recursiveChair(row, col - 1);
        }
        if (col < colLen) {
            this.recursiveChair(row, col + 1);
        }
    };
    SnakeMatrixService.maxHistoryLength = 10;
    return SnakeMatrixService;
}());
exports.SnakeMatrixService = SnakeMatrixService;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(2);
var decorators_1 = __webpack_require__(4);
var services_1 = __webpack_require__(5);
var snake_component_1 = __webpack_require__(3);
var snake_cell_component_html_1 = tslib_1.__importDefault(__webpack_require__(21));
var snake_cell_component_styl_1 = tslib_1.__importDefault(__webpack_require__(22));
var SnakeCellComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SnakeCellComponent, _super);
    function SnakeCellComponent() {
        var _this = _super.call(this) || this;
        _this.className = 'snake-cell';
        _this.innerHTML = snake_cell_component_html_1.default;
        _this._checked = false;
        _this._domainCount = 0;
        _this.matrixService = new services_1.SnakeMatrixService();
        _this.addEventListener('click', function () {
            _this.checked = !_this.checked;
        });
        return _this;
    }
    SnakeCellComponent_1 = SnakeCellComponent;
    Object.defineProperty(SnakeCellComponent.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (value) {
            this._checked = value;
            this.toggleChecked();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SnakeCellComponent.prototype, "domainCount", {
        get: function () {
            return this._domainCount;
        },
        set: function (value) {
            this._domainCount = value;
            this.setColor(value);
        },
        enumerable: true,
        configurable: true
    });
    SnakeCellComponent.inverseColor = function (color) {
        var inverseColor = Object.create(color);
        Object.keys(color).forEach(function (key) { return inverseColor[key] = 255 - color[key]; });
        return inverseColor;
    };
    SnakeCellComponent.makeColor = function () {
        var makeChanel = function () { return Math.random() * 100 * 2.55; };
        var color = {
            r: makeChanel(),
            g: makeChanel(),
            b: makeChanel(),
            a: Math.random()
        };
        SnakeCellComponent_1.rgbColorList.push(color);
        return color;
    };
    SnakeCellComponent.colorToStr = function (_a) {
        var r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    };
    SnakeCellComponent.prototype.setColor = function (colorIndex) {
        var colorToStr = SnakeCellComponent_1.colorToStr, inverseColor = SnakeCellComponent_1.inverseColor, makeColor = SnakeCellComponent_1.makeColor, rgbColorList = SnakeCellComponent_1.rgbColorList;
        var color = rgbColorList[colorIndex] || makeColor();
        this.style.background = colorToStr(color);
        this.style.color = colorToStr(inverseColor(rgbColorList[colorIndex]));
    };
    SnakeCellComponent.prototype.toggleChecked = function () {
        this.classList.toggle('snake-cell--checked', this.checked);
        this.domainCount = 0;
    };
    SnakeCellComponent.rgbColorList = [];
    SnakeCellComponent = SnakeCellComponent_1 = tslib_1.__decorate([
        decorators_1.SnakeRegistryComponent({
            selector: 'snake-cell',
            styles: snake_cell_component_styl_1.default
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], SnakeCellComponent);
    return SnakeCellComponent;
    var SnakeCellComponent_1;
}(snake_component_1.SnakeComponent));
exports.SnakeCellComponent = SnakeCellComponent;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<div class=\"snake-cell__value\">0</div>\n<div class=\"snake-cell__value snake-cell__value--checked\">1</div>\n"

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(23);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-cell.component.styl", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-cell.component.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".snake-cell {\n  position: relative;\n  display: block;\n  max-width: 50px;\n  width: 50px;\n  height: 50px;\n  font-size: larger;\n  text-align: center;\n  cursor: pointer;\n  user-select: none;\n  transition: background 0.3s;\n  flex-shrink: 1;\n  flex-grow: 1;\n}\n.snake-cell:not(:last-child) {\n  border-right: 1px solid rgba(0,0,0,0.1);\n}\n.snake-cell__value {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 50%;\n  margin-top: -0.5em;\n}\n.snake-cell__value--checked {\n  display: none;\n}\n.snake-cell--checked {\n  background-color: #ccc;\n}\n.snake-cell--checked .snake-cell__value {\n  animation: 0.3s rotate;\n  display: none;\n}\n.snake-cell--checked .snake-cell__value--checked {\n  display: block;\n  animation: 0.3s rotate reverse;\n}\n@-moz-keyframes rotate {\n  0% {\n    transform: rotateY(0deg);\n    display: block;\n  }\n  100% {\n    transform: rotateY(90deg);\n    display: none;\n  }\n}\n@-webkit-keyframes rotate {\n  0% {\n    transform: rotateY(0deg);\n    display: block;\n  }\n  100% {\n    transform: rotateY(90deg);\n    display: none;\n  }\n}\n@-o-keyframes rotate {\n  0% {\n    transform: rotateY(0deg);\n    display: block;\n  }\n  100% {\n    transform: rotateY(90deg);\n    display: none;\n  }\n}\n@keyframes rotate {\n  0% {\n    transform: rotateY(0deg);\n    display: block;\n  }\n  100% {\n    transform: rotateY(90deg);\n    display: none;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<div class=\"snake-app__controll\">\n    <snake-input onchange=\"this.$SnakeScope.setCountRow(this.value)\"\n                 max=\"40\"\n                 min=\"1\"\n                 class=\"snake-app__fild\"\n                 label=\"Строка\"\n                 value=\"5\"\n    ></snake-input>\n\n    <snake-input onchange=\"this.$SnakeScope.setCountCol(this.value)\"\n                 max=\"40\"\n                 min=\"1\"\n                 class=\"snake-app__fild\"\n                 label=\"Столбец\"\n                 value=\"5\"\n    ></snake-input>\n\n    <snake-btn class=\"snake-app__btn\"\n               id=\"snake-refresh\"\n               onclick=\"this.$SnakeScope.refreshMatrix()\"\n    >Обновить\n    </snake-btn>\n\n    <div class=\"snake-app__count-domains\">\n        <snake-btn class=\"snake-app__btn\"\n                   onclick=\"this.$SnakeScope.updateCountDomain()\"\n        >\n            Посчитать домены\n        </snake-btn>\n        Количество доменов: <span id=\"snake-app-count-domain\">0</span>\n    </div>\n    <snake-input id=\"snake-app-rand-chance\"\n                 class=\"snake-app__fild\"\n                 max=\"99\"\n                 min=\"1\"\n                 value=\"50\"\n                 label=\"Вероятность\"></snake-input>\n\n    <snake-btn onclick=\"this.$SnakeScope.randCalcMatrix()\" id=\"snake-rand-calc\">\n        Авто\n    </snake-btn>\n</div>\n<div class=\"snake-app__result\">\n    <snake-matrix id=\"snake-matrix\" class=\"snake-app__matrix\"></snake-matrix>\n    <snake-history id=\"snake-history\" class=\"snake-app__history\"></snake-history>\n</div>\n"

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(26);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-app.component.styl", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-app.component.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".snake-app {\n  font-family: 'Arial';\n}\n.snake-app__controll {\n  display: flex;\n  background: #ccc;\n  padding: 32px 30%;\n  margin-bottom: 60px;\n}\n.snake-app__fild,\n.snake-app__btn,\n.snake-app__count-domains {\n  margin-right: 30px;\n  color: #989898;\n}\n.snake-app__fild {\n  width: 140px;\n  display: inline-block;\n}\n.snake-app__result {\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.snake-app__history,\n.snake-app__matrix {\n  display: inline-block;\n  max-width: 100%;\n}\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_input_component_1 = __webpack_require__(28);
exports.SnakeInputComponent = snake_input_component_1.SnakeInputComponent;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(2);
var decorators_1 = __webpack_require__(4);
var snake_component_1 = __webpack_require__(3);
var snake_input_component_html_1 = tslib_1.__importDefault(__webpack_require__(29));
var snake_input_component_styl_1 = tslib_1.__importDefault(__webpack_require__(30));
var Attr;
(function (Attr) {
    Attr["LABEL"] = "label";
    Attr["MAX"] = "max";
    Attr["MIN"] = "min";
    Attr["VALUE"] = "value";
})(Attr || (Attr = {}));
var SnakeInputComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SnakeInputComponent, _super);
    function SnakeInputComponent() {
        var _this = _super.call(this) || this;
        _this.innerHTML = snake_input_component_html_1.default;
        _this.input = _this.querySelector('input');
        _this.input.addEventListener('change', function () {
            var value = +_this.input.value;
            value = Math.min(value, _this.max);
            value = Math.max(value, _this.min);
            _this.input.value = value + '';
            _this.dispatchEvent(new Event('change'));
        });
        return _this;
    }
    Object.defineProperty(SnakeInputComponent, "observedAttributes", {
        get: function () {
            return Object.values(Attr);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SnakeInputComponent.prototype, "value", {
        get: function () {
            return this.input.value;
        },
        set: function (value) {
            this.input.value = value;
        },
        enumerable: true,
        configurable: true
    });
    SnakeInputComponent.prototype.attributeChangedCallback = function (name, oldValue, value) {
        switch (name) {
            case Attr.LABEL:
                this.querySelector('label').innerText = value;
                break;
            case Attr.VALUE:
                this.input.value = value;
                break;
            case Attr.MAX:
            case Attr.MIN:
                this.input.setAttribute(name, value);
                this[name] = +value;
        }
    };
    SnakeInputComponent = tslib_1.__decorate([
        decorators_1.SnakeRegistryComponent({
            selector: 'snake-input',
            styles: snake_input_component_styl_1.default
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], SnakeInputComponent);
    return SnakeInputComponent;
}(snake_component_1.SnakeComponent));
exports.SnakeInputComponent = SnakeInputComponent;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<div class=\"snake-input\">\n    <label class=\"snake-input__label\"></label>\n    <input class=\"snake-input__fild\" type=\"number\" min=\"0\" max=\"40\">\n</div>\n"

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(31);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-input.component.styl", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-input.component.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".snake-input__label {\n  display: block;\n  color: #848484;\n  margin-bottom: 4px;\n}\n.snake-input__fild {\n  width: 100%;\n  border: none;\n  border-bottom: 1px solid #000;\n  font-size: 16px;\n  appearance: none;\n  outline: none;\n  transition: border-bottom-width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n  background: transparent;\n}\n.snake-input__fild:focus {\n  border-bottom-width: 2px;\n}\n.snake-input__fild::-webkit-input-placeholder {\n  font-size: 16px;\n  color: #000;\n}\n", ""]);

// exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_btn_component_1 = __webpack_require__(33);
exports.SnakeBtnComponent = snake_btn_component_1.SnakeBtnComponent;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(2);
var decorators_1 = __webpack_require__(4);
var snake_component_1 = __webpack_require__(3);
var snake_btn_component_html_1 = tslib_1.__importDefault(__webpack_require__(34));
var snake_btn_component_styl_1 = tslib_1.__importDefault(__webpack_require__(35));
var Attr;
(function (Attr) {
    Attr["DISABLED"] = "disabled";
})(Attr = exports.Attr || (exports.Attr = {}));
var SnakeBtnComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SnakeBtnComponent, _super);
    function SnakeBtnComponent() {
        var _this = _super.call(this) || this;
        var transcludeHtml = _this.innerHTML;
        _this.innerHTML = snake_btn_component_html_1.default;
        _this.btn = _this.querySelector('button');
        _this.btn.innerHTML = transcludeHtml;
        return _this;
    }
    Object.defineProperty(SnakeBtnComponent, "observedAttributes", {
        get: function () {
            return Object.values(Attr);
        },
        enumerable: true,
        configurable: true
    });
    SnakeBtnComponent.prototype.attributeChangedCallback = function (name, oldValue, value) {
        value ? this.btn.setAttribute(name, value) : this.btn.removeAttribute(name);
    };
    SnakeBtnComponent = tslib_1.__decorate([
        decorators_1.SnakeRegistryComponent({
            selector: 'snake-btn',
            styles: snake_btn_component_styl_1.default
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], SnakeBtnComponent);
    return SnakeBtnComponent;
}(snake_component_1.SnakeComponent));
exports.SnakeBtnComponent = SnakeBtnComponent;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<button class=\"snake-btn\">идф</button>\n"

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(36);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-btn.component.styl", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-btn.component.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".snake-btn {\n  background-color: #4caf50;\n  border: none;\n  color: #fff;\n  padding: 15px 32px;\n  text-align: center;\n  text-decoration: none;\n  display: inline-block;\n  outline: none;\n  cursor: pointer;\n  transition: background 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  font-size: 16px;\n  white-space: nowrap;\n}\n.snake-btn:active {\n  background-color: #3e8241;\n}\n.snake-btn[disabled] {\n  background: #989898;\n}\n", ""]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_matrix_component_1 = __webpack_require__(38);
exports.SnakeMatrixComponent = snake_matrix_component_1.SnakeMatrixComponent;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(2);
var decorators_1 = __webpack_require__(4);
var snake_component_1 = __webpack_require__(3);
var snake_matrix_component_styl_1 = tslib_1.__importDefault(__webpack_require__(39));
var SnakeMatrixComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SnakeMatrixComponent, _super);
    function SnakeMatrixComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SnakeMatrixComponent_1 = SnakeMatrixComponent;
    SnakeMatrixComponent.makeRow = function () {
        var row = document.createElement('div');
        row.className = 'snake-matrix__row';
        return row;
    };
    SnakeMatrixComponent.prototype.renderMatrix = function (matrix) {
        var makeRow = SnakeMatrixComponent_1.makeRow;
        var fragment = document.createDocumentFragment();
        matrix.forEach(function (row) {
            var rowEl = makeRow();
            row.forEach(function (cell) {
                rowEl.appendChild(cell);
            });
            fragment.appendChild(rowEl);
        });
        this.innerHTML = '';
        this.appendChild(fragment);
    };
    SnakeMatrixComponent = SnakeMatrixComponent_1 = tslib_1.__decorate([
        decorators_1.SnakeRegistryComponent({
            selector: 'snake-matrix',
            styles: snake_matrix_component_styl_1.default
        })
    ], SnakeMatrixComponent);
    return SnakeMatrixComponent;
    var SnakeMatrixComponent_1;
}(snake_component_1.SnakeComponent));
exports.SnakeMatrixComponent = SnakeMatrixComponent;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(40);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-matrix.component.styl", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-matrix.component.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".snake-matrix__row {\n  display: flex;\n}\n.snake-matrix__row:not(:last-child) {\n  border-bottom: 1px solid rgba(0,0,0,0.1);\n}\n", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snake_history_component_1 = __webpack_require__(42);
exports.SnakeHistoryComponent = snake_history_component_1.SnakeHistoryComponent;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(2);
var decorators_1 = __webpack_require__(4);
var services_1 = __webpack_require__(5);
var snake_component_1 = __webpack_require__(3);
var snake_history_component_html_1 = tslib_1.__importDefault(__webpack_require__(43));
var snake_history_component_styl_1 = tslib_1.__importDefault(__webpack_require__(44));
var SnakeHistoryComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SnakeHistoryComponent, _super);
    function SnakeHistoryComponent() {
        var _this = _super.call(this) || this;
        _this.hidden = true;
        _this.innerHTML = snake_history_component_html_1.default;
        _this.matrixService = new services_1.SnakeMatrixService();
        return _this;
    }
    SnakeHistoryComponent_1 = SnakeHistoryComponent;
    SnakeHistoryComponent.makeCell = function (text) {
        var cell = document.createElement('td');
        cell.innerText = text;
        return cell;
    };
    SnakeHistoryComponent.makeRow = function () {
        return document.createElement('tr');
    };
    SnakeHistoryComponent.prototype.renderHistory = function () {
        var makeRow = SnakeHistoryComponent_1.makeRow, makeCell = SnakeHistoryComponent_1.makeCell;
        var tbody = this.querySelector('tbody');
        tbody.innerHTML = '';
        this.matrixService.matrixHistory
            .forEach(function (_a) {
            var chance = _a.chance, countCell = _a.countCell, countDomain = _a.countDomain;
            var row = makeRow();
            [chance, countDomain, countCell]
                .forEach(function (v) {
                row.appendChild(makeCell(v + ''));
            });
            tbody.appendChild(row);
        });
        this.hidden = !this.matrixService.matrixHistory.length;
    };
    SnakeHistoryComponent = SnakeHistoryComponent_1 = tslib_1.__decorate([
        decorators_1.SnakeRegistryComponent({
            selector: 'snake-history',
            styles: snake_history_component_styl_1.default
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], SnakeHistoryComponent);
    return SnakeHistoryComponent;
    var SnakeHistoryComponent_1;
}(snake_component_1.SnakeComponent));
exports.SnakeHistoryComponent = SnakeHistoryComponent;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<table class=\"snake-history\">\n    <thead>\n    <tr>\n        <th>Вероятность</th>\n        <th>Количество доменов в матриц</th>\n        <th>Количество ячеек в матрице </th>\n    </tr>\n    </thead>\n    <tbody></tbody>\n</table>\n"

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(45);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-history.component.styl", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js?paths=src/!./snake-history.component.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".snake-history {\n  padding: 0;\n  border-collapse: collapse;\n}\n.snake-history td,\n.snake-history th {\n  border-top: 1px solid #ccc;\n  padding: 0 32px;\n  height: 50px;\n  text-align: left;\n}\n", ""]);

// exports


/***/ })
/******/ ]);