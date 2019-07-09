// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../node_modules/rrweb/es/rrweb.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.record = record;
exports.ReplayerEvents = exports.MouseInteractions = exports.IncrementalSource = exports.EventType = exports.mirror = exports.Replayer = void 0;

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
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var NodeType;

(function (NodeType) {
  NodeType[NodeType["Document"] = 0] = "Document";
  NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
  NodeType[NodeType["Element"] = 2] = "Element";
  NodeType[NodeType["Text"] = 3] = "Text";
  NodeType[NodeType["CDATA"] = 4] = "CDATA";
  NodeType[NodeType["Comment"] = 5] = "Comment";
})(NodeType || (NodeType = {}));

var _id = 1;

function genId() {
  return _id++;
}

function getCssRulesString(s) {
  try {
    var rules = s.rules || s.cssRules;
    return rules ? Array.from(rules).reduce(function (prev, cur) {
      return prev + getCssRuleString(cur);
    }, '') : null;
  } catch (error) {
    return null;
  }
}

function getCssRuleString(rule) {
  return isCSSImportRule(rule) ? getCssRulesString(rule.styleSheet) || '' : rule.cssText;
}

function isCSSImportRule(rule) {
  return 'styleSheet' in rule;
}

function extractOrigin(url) {
  var origin;

  if (url.indexOf('//') > -1) {
    origin = url.split('/').slice(0, 3).join('/');
  } else {
    origin = url.split('/')[0];
  }

  origin = origin.split('?')[0];
  return origin;
}

var URL_IN_CSS_REF = /url\((?:'([^']*)'|"([^"]*)"|([^)]*))\)/gm;
var RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/;
var DATA_URI = /^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi;

function absoluteToStylesheet(cssText, href) {
  return cssText.replace(URL_IN_CSS_REF, function (origin, path1, path2, path3) {
    var filePath = path1 || path2 || path3;

    if (!filePath) {
      return origin;
    }

    if (!RELATIVE_PATH.test(filePath)) {
      return "url('" + filePath + "')";
    }

    if (DATA_URI.test(filePath)) {
      return "url(" + filePath + ")";
    }

    if (filePath[0] === '/') {
      return "url('" + (extractOrigin(href) + filePath) + "')";
    }

    var stack = href.split('/');
    var parts = filePath.split('/');
    stack.pop();

    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];

      if (part === '.') {
        continue;
      } else if (part === '..') {
        stack.pop();
      } else {
        stack.push(part);
      }
    }

    return "url('" + stack.join('/') + "')";
  });
}

function absoluteToDoc(doc, attributeValue) {
  var a = doc.createElement('a');
  a.href = attributeValue;
  return a.href;
}

function isSVGElement(el) {
  return el.tagName === 'svg' || el instanceof SVGElement;
}

function serializeNode(n, doc, blockClass, inlineStylesheet, maskAllInputs) {
  switch (n.nodeType) {
    case n.DOCUMENT_NODE:
      return {
        type: NodeType.Document,
        childNodes: []
      };

    case n.DOCUMENT_TYPE_NODE:
      return {
        type: NodeType.DocumentType,
        name: n.name,
        publicId: n.publicId,
        systemId: n.systemId
      };

    case n.ELEMENT_NODE:
      var needBlock_1 = false;

      if (typeof blockClass === 'string') {
        needBlock_1 = n.classList.contains(blockClass);
      } else {
        n.classList.forEach(function (className) {
          if (blockClass.test(className)) {
            needBlock_1 = true;
          }
        });
      }

      var tagName = n.tagName.toLowerCase();
      var attributes_1 = {};

      for (var _i = 0, _a = Array.from(n.attributes); _i < _a.length; _i++) {
        var _b = _a[_i],
            name = _b.name,
            value = _b.value;

        if (name === 'src' || name === 'href') {
          attributes_1[name] = absoluteToDoc(doc, value);
        } else if (name === 'style') {
          attributes_1[name] = absoluteToStylesheet(value, location.href);
        } else {
          attributes_1[name] = value;
        }
      }

      if (tagName === 'link' && inlineStylesheet) {
        var stylesheet = Array.from(doc.styleSheets).find(function (s) {
          return s.href === n.href;
        });
        var cssText = getCssRulesString(stylesheet);

        if (cssText) {
          delete attributes_1.rel;
          delete attributes_1.href;
          attributes_1._cssText = absoluteToStylesheet(cssText, stylesheet.href);
        }
      }

      if (tagName === 'style' && n.sheet && !n.innerText.trim().length) {
        var cssText = getCssRulesString(n.sheet);

        if (cssText) {
          attributes_1._cssText = absoluteToStylesheet(cssText, location.href);
        }
      }

      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        var value = n.value;

        if (attributes_1.type !== 'radio' && attributes_1.type !== 'checkbox' && value) {
          attributes_1.value = maskAllInputs ? '*'.repeat(value.length) : value;
        } else if (n.checked) {
          attributes_1.checked = n.checked;
        }
      }

      if (tagName === 'option') {
        var selectValue = n.parentElement;

        if (attributes_1.value === selectValue.value) {
          attributes_1.selected = n.selected;
        }
      }

      if (needBlock_1) {
        var _c = n.getBoundingClientRect(),
            width = _c.width,
            height = _c.height;

        attributes_1.rr_width = width + "px";
        attributes_1.rr_height = height + "px";
      }

      return {
        type: NodeType.Element,
        tagName: tagName,
        attributes: attributes_1,
        childNodes: [],
        isSVG: isSVGElement(n) || undefined,
        needBlock: needBlock_1
      };

    case n.TEXT_NODE:
      var parentTagName = n.parentNode && n.parentNode.tagName;
      var textContent = n.textContent;
      var isStyle = parentTagName === 'STYLE' ? true : undefined;

      if (isStyle && textContent) {
        textContent = absoluteToStylesheet(textContent, location.href);
      }

      if (parentTagName === 'SCRIPT') {
        textContent = 'SCRIPT_PLACEHOLDER';
      }

      return {
        type: NodeType.Text,
        textContent: textContent || '',
        isStyle: isStyle
      };

    case n.CDATA_SECTION_NODE:
      return {
        type: NodeType.CDATA,
        textContent: ''
      };

    case n.COMMENT_NODE:
      return {
        type: NodeType.Comment,
        textContent: n.textContent || ''
      };

    default:
      return false;
  }
}

function serializeNodeWithId(n, doc, map, blockClass, skipChild, inlineStylesheet, maskAllInputs) {
  if (skipChild === void 0) {
    skipChild = false;
  }

  if (inlineStylesheet === void 0) {
    inlineStylesheet = true;
  }

  if (maskAllInputs === void 0) {
    maskAllInputs = false;
  }

  var _serializedNode = serializeNode(n, doc, blockClass, inlineStylesheet, maskAllInputs);

  if (!_serializedNode) {
    console.warn(n, 'not serialized');
    return null;
  }

  var id;

  if ('__sn' in n) {
    id = n.__sn.id;
  } else {
    id = genId();
  }

  var serializedNode = Object.assign(_serializedNode, {
    id: id
  });
  n.__sn = serializedNode;
  map[id] = n;
  var recordChild = !skipChild;

  if (serializedNode.type === NodeType.Element) {
    recordChild = recordChild && !serializedNode.needBlock;
    delete serializedNode.needBlock;
  }

  if ((serializedNode.type === NodeType.Document || serializedNode.type === NodeType.Element) && recordChild) {
    for (var _i = 0, _a = Array.from(n.childNodes); _i < _a.length; _i++) {
      var childN = _a[_i];
      var serializedChildNode = serializeNodeWithId(childN, doc, map, blockClass, skipChild, inlineStylesheet);

      if (serializedChildNode) {
        serializedNode.childNodes.push(serializedChildNode);
      }
    }
  }

  return serializedNode;
}

function snapshot(n, blockClass, inlineStylesheet, maskAllInputs) {
  if (blockClass === void 0) {
    blockClass = 'rr-block';
  }

  if (inlineStylesheet === void 0) {
    inlineStylesheet = true;
  }

  if (maskAllInputs === void 0) {
    maskAllInputs = false;
  }

  var idNodeMap = {};
  return [serializeNodeWithId(n, n, idNodeMap, blockClass, false, inlineStylesheet, maskAllInputs), idNodeMap];
}

var tagMap = {
  script: 'noscript',
  altglyph: 'altGlyph',
  altglyphdef: 'altGlyphDef',
  altglyphitem: 'altGlyphItem',
  animatecolor: 'animateColor',
  animatemotion: 'animateMotion',
  animatetransform: 'animateTransform',
  clippath: 'clipPath',
  feblend: 'feBlend',
  fecolormatrix: 'feColorMatrix',
  fecomponenttransfer: 'feComponentTransfer',
  fecomposite: 'feComposite',
  feconvolvematrix: 'feConvolveMatrix',
  fediffuselighting: 'feDiffuseLighting',
  fedisplacementmap: 'feDisplacementMap',
  fedistantlight: 'feDistantLight',
  fedropshadow: 'feDropShadow',
  feflood: 'feFlood',
  fefunca: 'feFuncA',
  fefuncb: 'feFuncB',
  fefuncg: 'feFuncG',
  fefuncr: 'feFuncR',
  fegaussianblur: 'feGaussianBlur',
  feimage: 'feImage',
  femerge: 'feMerge',
  femergenode: 'feMergeNode',
  femorphology: 'feMorphology',
  feoffset: 'feOffset',
  fepointlight: 'fePointLight',
  fespecularlighting: 'feSpecularLighting',
  fespotlight: 'feSpotLight',
  fetile: 'feTile',
  feturbulence: 'feTurbulence',
  foreignobject: 'foreignObject',
  glyphref: 'glyphRef',
  lineargradient: 'linearGradient',
  radialgradient: 'radialGradient'
};

function getTagName(n) {
  var tagName = tagMap[n.tagName] ? tagMap[n.tagName] : n.tagName;

  if (tagName === 'link' && n.attributes._cssText) {
    tagName = 'style';
  }

  return tagName;
}

var CSS_SELECTOR = /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g;
var HOVER_SELECTOR = /([^\\]):hover/g;

function addHoverClass(cssText) {
  return cssText.replace(CSS_SELECTOR, function (match, p1, p2) {
    if (HOVER_SELECTOR.test(p1)) {
      var newSelector = p1.replace(HOVER_SELECTOR, '$1.\\:hover');
      return p1.replace(/\s*$/, '') + ", " + newSelector.replace(/^\s*/, '') + p2;
    } else {
      return match;
    }
  });
}

function buildNode(n, doc) {
  switch (n.type) {
    case NodeType.Document:
      return doc.implementation.createDocument(null, '', null);

    case NodeType.DocumentType:
      return doc.implementation.createDocumentType(n.name, n.publicId, n.systemId);

    case NodeType.Element:
      var tagName = getTagName(n);
      var node = void 0;

      if (n.isSVG) {
        node = doc.createElementNS('http://www.w3.org/2000/svg', tagName);
      } else {
        node = doc.createElement(tagName);
      }

      for (var name in n.attributes) {
        if (n.attributes.hasOwnProperty(name) && !name.startsWith('rr_')) {
          var value = n.attributes[name];
          value = typeof value === 'boolean' ? '' : value;
          var isTextarea = tagName === 'textarea' && name === 'value';
          var isRemoteOrDynamicCss = tagName === 'style' && name === '_cssText';

          if (isRemoteOrDynamicCss) {
            value = addHoverClass(value);
          }

          if (isTextarea || isRemoteOrDynamicCss) {
            var child = doc.createTextNode(value);
            node.appendChild(child);
            continue;
          }

          if (tagName === 'iframe' && name === 'src') {
            continue;
          }

          try {
            if (n.isSVG && name === 'xlink:href') {
              node.setAttributeNS('http://www.w3.org/1999/xlink', name, value);
            } else {
              node.setAttribute(name, value);
            }
          } catch (error) {}
        } else {
          if (n.attributes.rr_width) {
            node.style.width = n.attributes.rr_width;
          }

          if (n.attributes.rr_height) {
            node.style.height = n.attributes.rr_height;
          }
        }
      }

      return node;

    case NodeType.Text:
      return doc.createTextNode(n.isStyle ? addHoverClass(n.textContent) : n.textContent);

    case NodeType.CDATA:
      return doc.createCDATASection(n.textContent);

    case NodeType.Comment:
      return doc.createComment(n.textContent);

    default:
      return null;
  }
}

function buildNodeWithSN(n, doc, map, skipChild) {
  if (skipChild === void 0) {
    skipChild = false;
  }

  var node = buildNode(n, doc);

  if (!node) {
    return null;
  }

  if (n.type === NodeType.Document) {
    doc.close();
    doc.open();
    node = doc;
  }

  node.__sn = n;
  map[n.id] = node;

  if ((n.type === NodeType.Document || n.type === NodeType.Element) && !skipChild) {
    for (var _i = 0, _a = n.childNodes; _i < _a.length; _i++) {
      var childN = _a[_i];
      var childNode = buildNodeWithSN(childN, doc, map);

      if (!childNode) {
        console.warn('Failed to rebuild', childN);
      } else {
        node.appendChild(childNode);
      }
    }
  }

  return node;
}

function rebuild(n, doc) {
  var idNodeMap = {};
  return [buildNodeWithSN(n, doc, idNodeMap), idNodeMap];
}

function on(type, fn, target) {
  if (target === void 0) {
    target = document;
  }

  var options = {
    capture: true,
    passive: true
  };
  target.addEventListener(type, fn, options);
  return function () {
    return target.removeEventListener(type, fn, options);
  };
}

var mirror = {
  map: {},
  getId: function (n) {
    if (!n.__sn) {
      return -1;
    }

    return n.__sn.id;
  },
  getNode: function (id) {
    return mirror.map[id] || null;
  },
  removeNodeFromMap: function (n) {
    var id = n.__sn && n.__sn.id;
    delete mirror.map[id];

    if (n.childNodes) {
      n.childNodes.forEach(function (child) {
        return mirror.removeNodeFromMap(child);
      });
    }
  },
  has: function (id) {
    return mirror.map.hasOwnProperty(id);
  }
};
exports.mirror = mirror;

function throttle(func, wait, options) {
  if (options === void 0) {
    options = {};
  }

  var timeout = null;
  var previous = 0;
  return function () {
    var now = Date.now();

    if (!previous && options.leading === false) {
      previous = now;
    }

    var remaining = wait - (now - previous);
    var context = this;
    var args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = window.setTimeout(function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

function hookSetter(target, key, d) {
  var original = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, {
    set: function (value) {
      var _this = this;

      setTimeout(function () {
        d.set.call(_this, value);
      }, 0);

      if (original && original.set) {
        original.set.call(this, value);
      }
    }
  });
  return function () {
    return hookSetter(target, key, original || {});
  };
}

function getWindowHeight() {
  return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
}

function getWindowWidth() {
  return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
}

function isBlocked(node, blockClass) {
  if (!node) {
    return false;
  }

  if (node.nodeType === node.ELEMENT_NODE) {
    var needBlock_1 = false;

    if (typeof blockClass === 'string') {
      needBlock_1 = node.classList.contains(blockClass);
    } else {
      node.classList.forEach(function (className) {
        if (blockClass.test(className)) {
          needBlock_1 = true;
        }
      });
    }

    return needBlock_1 || isBlocked(node.parentNode, blockClass);
  }

  return isBlocked(node.parentNode, blockClass);
}

function isAncestorRemoved(target) {
  var id = mirror.getId(target);

  if (!mirror.has(id)) {
    return true;
  }

  if (target.parentNode && target.parentNode.nodeType === target.DOCUMENT_NODE) {
    return false;
  }

  if (!target.parentNode) {
    return true;
  }

  return isAncestorRemoved(target.parentNode);
}

function isTouchEvent(event) {
  return Boolean(event.changedTouches);
}

var EventType;
exports.EventType = EventType;

(function (EventType) {
  EventType[EventType["DomContentLoaded"] = 0] = "DomContentLoaded";
  EventType[EventType["Load"] = 1] = "Load";
  EventType[EventType["FullSnapshot"] = 2] = "FullSnapshot";
  EventType[EventType["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
  EventType[EventType["Meta"] = 4] = "Meta";
})(EventType || (exports.EventType = EventType = {}));

var IncrementalSource;
exports.IncrementalSource = IncrementalSource;

(function (IncrementalSource) {
  IncrementalSource[IncrementalSource["Mutation"] = 0] = "Mutation";
  IncrementalSource[IncrementalSource["MouseMove"] = 1] = "MouseMove";
  IncrementalSource[IncrementalSource["MouseInteraction"] = 2] = "MouseInteraction";
  IncrementalSource[IncrementalSource["Scroll"] = 3] = "Scroll";
  IncrementalSource[IncrementalSource["ViewportResize"] = 4] = "ViewportResize";
  IncrementalSource[IncrementalSource["Input"] = 5] = "Input";
})(IncrementalSource || (exports.IncrementalSource = IncrementalSource = {}));

var MouseInteractions;
exports.MouseInteractions = MouseInteractions;

(function (MouseInteractions) {
  MouseInteractions[MouseInteractions["MouseUp"] = 0] = "MouseUp";
  MouseInteractions[MouseInteractions["MouseDown"] = 1] = "MouseDown";
  MouseInteractions[MouseInteractions["Click"] = 2] = "Click";
  MouseInteractions[MouseInteractions["ContextMenu"] = 3] = "ContextMenu";
  MouseInteractions[MouseInteractions["DblClick"] = 4] = "DblClick";
  MouseInteractions[MouseInteractions["Focus"] = 5] = "Focus";
  MouseInteractions[MouseInteractions["Blur"] = 6] = "Blur";
  MouseInteractions[MouseInteractions["TouchStart"] = 7] = "TouchStart";
  MouseInteractions[MouseInteractions["TouchMove_Departed"] = 8] = "TouchMove_Departed";
  MouseInteractions[MouseInteractions["TouchEnd"] = 9] = "TouchEnd";
})(MouseInteractions || (exports.MouseInteractions = MouseInteractions = {}));

var ReplayerEvents;
exports.ReplayerEvents = ReplayerEvents;

(function (ReplayerEvents) {
  ReplayerEvents["Start"] = "start";
  ReplayerEvents["Pause"] = "pause";
  ReplayerEvents["Resume"] = "resume";
  ReplayerEvents["Resize"] = "resize";
  ReplayerEvents["Finish"] = "finish";
  ReplayerEvents["FullsnapshotRebuilded"] = "fullsnapshot-rebuilded";
  ReplayerEvents["LoadStylesheetStart"] = "load-stylesheet-start";
  ReplayerEvents["LoadStylesheetEnd"] = "load-stylesheet-end";
  ReplayerEvents["SkipStart"] = "skip-start";
  ReplayerEvents["SkipEnd"] = "skip-end";
  ReplayerEvents["MouseInteraction"] = "mouse-interaction";
})(ReplayerEvents || (exports.ReplayerEvents = ReplayerEvents = {}));

function deepDelete(addsSet, n) {
  addsSet["delete"](n);
  n.childNodes.forEach(function (childN) {
    return deepDelete(addsSet, childN);
  });
}

function isParentRemoved(removes, n) {
  var parentNode = n.parentNode;

  if (!parentNode) {
    return false;
  }

  var parentId = mirror.getId(parentNode);

  if (removes.some(function (r) {
    return r.id === parentId;
  })) {
    return true;
  }

  return isParentRemoved(removes, parentNode);
}

function isAncestorInSet(set, n) {
  var parentNode = n.parentNode;

  if (!parentNode) {
    return false;
  }

  if (set.has(parentNode)) {
    return true;
  }

  return isAncestorInSet(set, parentNode);
}

var moveKey = function (id, parentId) {
  return id + "@" + parentId;
};

function isINode(n) {
  return '__sn' in n;
}

function initMutationObserver(cb, blockClass, inlineStylesheet, maskAllInputs) {
  var observer = new MutationObserver(function (mutations) {
    var texts = [];
    var attributes = [];
    var removes = [];
    var adds = [];
    var addedSet = new Set();
    var movedSet = new Set();
    var droppedSet = new Set();
    var movedMap = {};

    var genAdds = function (n, target) {
      if (isBlocked(n, blockClass)) {
        return;
      }

      if (isINode(n)) {
        movedSet.add(n);
        var targetId = null;

        if (target && isINode(target)) {
          targetId = target.__sn.id;
        }

        if (targetId) {
          movedMap[moveKey(n.__sn.id, targetId)] = true;
        }
      } else {
        addedSet.add(n);
        droppedSet["delete"](n);
      }

      n.childNodes.forEach(function (childN) {
        return genAdds(childN);
      });
    };

    mutations.forEach(function (mutation) {
      var type = mutation.type,
          target = mutation.target,
          oldValue = mutation.oldValue,
          addedNodes = mutation.addedNodes,
          removedNodes = mutation.removedNodes,
          attributeName = mutation.attributeName;

      switch (type) {
        case 'characterData':
          {
            var value = target.textContent;

            if (!isBlocked(target, blockClass) && value !== oldValue) {
              texts.push({
                value: value,
                node: target
              });
            }

            break;
          }

        case 'attributes':
          {
            var value = target.getAttribute(attributeName);

            if (isBlocked(target, blockClass) || value === oldValue) {
              return;
            }

            var item = attributes.find(function (a) {
              return a.node === target;
            });

            if (!item) {
              item = {
                node: target,
                attributes: {}
              };
              attributes.push(item);
            }

            item.attributes[attributeName] = value;
            break;
          }

        case 'childList':
          {
            addedNodes.forEach(function (n) {
              return genAdds(n, target);
            });
            removedNodes.forEach(function (n) {
              var nodeId = mirror.getId(n);
              var parentId = mirror.getId(target);

              if (isBlocked(n, blockClass)) {
                return;
              }

              if (addedSet.has(n)) {
                deepDelete(addedSet, n);
                droppedSet.add(n);
              } else if (addedSet.has(target) && nodeId === -1) ;else if (isAncestorRemoved(target)) ;else if (movedSet.has(n) && movedMap[moveKey(nodeId, parentId)]) {
                deepDelete(movedSet, n);
              } else {
                removes.push({
                  parentId: parentId,
                  id: nodeId
                });
              }

              mirror.removeNodeFromMap(n);
            });
            break;
          }

        default:
          break;
      }
    });
    var addQueue = [];

    var pushAdd = function (n) {
      var parentId = mirror.getId(n.parentNode);

      if (parentId === -1) {
        return addQueue.push(n);
      }

      adds.push({
        parentId: parentId,
        previousId: !n.previousSibling ? n.previousSibling : mirror.getId(n.previousSibling),
        nextId: !n.nextSibling ? n.nextSibling : mirror.getId(n.nextSibling),
        node: serializeNodeWithId(n, document, mirror.map, blockClass, true, inlineStylesheet, maskAllInputs)
      });
    };

    Array.from(movedSet).forEach(pushAdd);
    Array.from(addedSet).forEach(function (n) {
      if (!isAncestorInSet(droppedSet, n) && !isParentRemoved(removes, n)) {
        pushAdd(n);
      } else if (isAncestorInSet(movedSet, n)) {
        pushAdd(n);
      } else {
        droppedSet.add(n);
      }
    });

    while (addQueue.length) {
      if (addQueue.every(function (n) {
        return mirror.getId(n.parentNode) === -1;
      })) {
        break;
      }

      pushAdd(addQueue.shift());
    }

    var payload = {
      texts: texts.map(function (text) {
        return {
          id: mirror.getId(text.node),
          value: text.value
        };
      }).filter(function (text) {
        return mirror.has(text.id);
      }),
      attributes: attributes.map(function (attribute) {
        return {
          id: mirror.getId(attribute.node),
          attributes: attribute.attributes
        };
      }).filter(function (attribute) {
        return mirror.has(attribute.id);
      }),
      removes: removes,
      adds: adds
    };

    if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
      return;
    }

    cb(payload);
  });
  observer.observe(document, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  });
  return observer;
}

function initMoveObserver(cb) {
  var positions = [];
  var timeBaseline;
  var wrappedCb = throttle(function () {
    var totalOffset = Date.now() - timeBaseline;
    cb(positions.map(function (p) {
      p.timeOffset -= totalOffset;
      return p;
    }));
    positions = [];
    timeBaseline = null;
  }, 500);
  var updatePosition = throttle(function (evt) {
    var target = evt.target;

    var _a = isTouchEvent(evt) ? evt.changedTouches[0] : evt,
        clientX = _a.clientX,
        clientY = _a.clientY;

    if (!timeBaseline) {
      timeBaseline = Date.now();
    }

    positions.push({
      x: clientX,
      y: clientY,
      id: mirror.getId(target),
      timeOffset: Date.now() - timeBaseline
    });
    wrappedCb();
  }, 50, {
    trailing: false
  });
  var handlers = [on('mousemove', updatePosition), on('touchmove', updatePosition)];
  return function () {
    handlers.forEach(function (h) {
      return h();
    });
  };
}

function initMouseInteractionObserver(cb, blockClass) {
  var handlers = [];

  var getHandler = function (eventKey) {
    return function (event) {
      if (isBlocked(event.target, blockClass)) {
        return;
      }

      var id = mirror.getId(event.target);

      var _a = isTouchEvent(event) ? event.changedTouches[0] : event,
          clientX = _a.clientX,
          clientY = _a.clientY;

      cb({
        type: MouseInteractions[eventKey],
        id: id,
        x: clientX,
        y: clientY
      });
    };
  };

  Object.keys(MouseInteractions).filter(function (key) {
    return Number.isNaN(Number(key)) && !key.endsWith('_Departed');
  }).forEach(function (eventKey) {
    var eventName = eventKey.toLowerCase();
    var handler = getHandler(eventKey);
    handlers.push(on(eventName, handler));
  });
  return function () {
    handlers.forEach(function (h) {
      return h();
    });
  };
}

function initScrollObserver(cb, blockClass) {
  var updatePosition = throttle(function (evt) {
    if (!evt.target || isBlocked(evt.target, blockClass)) {
      return;
    }

    var id = mirror.getId(evt.target);

    if (evt.target === document) {
      var scrollEl = document.scrollingElement || document.documentElement;
      cb({
        id: id,
        x: scrollEl.scrollLeft,
        y: scrollEl.scrollTop
      });
    } else {
      cb({
        id: id,
        x: evt.target.scrollLeft,
        y: evt.target.scrollTop
      });
    }
  }, 100);
  return on('scroll', updatePosition);
}

function initViewportResizeObserver(cb) {
  var updateDimension = throttle(function () {
    var height = getWindowHeight();
    var width = getWindowWidth();
    cb({
      width: Number(width),
      height: Number(height)
    });
  }, 200);
  return on('resize', updateDimension, window);
}

var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];
var MASK_TYPES = ['color', 'date', 'datetime-local', 'email', 'month', 'number', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'];
var lastInputValueMap = new WeakMap();

function initInputObserver(cb, blockClass, ignoreClass, maskAllInputs) {
  function eventHandler(event) {
    var target = event.target;

    if (!target || !target.tagName || INPUT_TAGS.indexOf(target.tagName) < 0 || isBlocked(target, blockClass)) {
      return;
    }

    var type = target.type;

    if (type === 'password' || target.classList.contains(ignoreClass)) {
      return;
    }

    var text = target.value;
    var isChecked = false;
    var hasTextInput = MASK_TYPES.includes(type) || target.tagName === 'TEXTAREA';

    if (type === 'radio' || type === 'checkbox') {
      isChecked = target.checked;
    } else if (hasTextInput && maskAllInputs) {
      text = '*'.repeat(text.length);
    }

    cbWithDedup(target, {
      text: text,
      isChecked: isChecked
    });
    var name = target.name;

    if (type === 'radio' && name && isChecked) {
      document.querySelectorAll("input[type=\"radio\"][name=\"" + name + "\"]").forEach(function (el) {
        if (el !== target) {
          cbWithDedup(el, {
            text: el.value,
            isChecked: !isChecked
          });
        }
      });
    }
  }

  function cbWithDedup(target, v) {
    var lastInputValue = lastInputValueMap.get(target);

    if (!lastInputValue || lastInputValue.text !== v.text || lastInputValue.isChecked !== v.isChecked) {
      lastInputValueMap.set(target, v);
      var id = mirror.getId(target);
      cb(__assign({}, v, {
        id: id
      }));
    }
  }

  var handlers = ['input', 'change'].map(function (eventName) {
    return on(eventName, eventHandler);
  });
  var propertyDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  var hookProperties = [[HTMLInputElement.prototype, 'value'], [HTMLInputElement.prototype, 'checked'], [HTMLSelectElement.prototype, 'value'], [HTMLTextAreaElement.prototype, 'value']];

  if (propertyDescriptor && propertyDescriptor.set) {
    handlers.push.apply(handlers, hookProperties.map(function (p) {
      return hookSetter(p[0], p[1], {
        set: function () {
          eventHandler({
            target: this
          });
        }
      });
    }));
  }

  return function () {
    handlers.forEach(function (h) {
      return h();
    });
  };
}

function initObservers(o) {
  var mutationObserver = initMutationObserver(o.mutationCb, o.blockClass, o.inlineStylesheet, o.maskAllInputs);
  var mousemoveHandler = initMoveObserver(o.mousemoveCb);
  var mouseInteractionHandler = initMouseInteractionObserver(o.mouseInteractionCb, o.blockClass);
  var scrollHandler = initScrollObserver(o.scrollCb, o.blockClass);
  var viewportResizeHandler = initViewportResizeObserver(o.viewportResizeCb);
  var inputHandler = initInputObserver(o.inputCb, o.blockClass, o.ignoreClass, o.maskAllInputs);
  return function () {
    mutationObserver.disconnect();
    mousemoveHandler();
    mouseInteractionHandler();
    scrollHandler();
    viewportResizeHandler();
    inputHandler();
  };
}

function wrapEvent(e) {
  return __assign({}, e, {
    timestamp: Date.now()
  });
}

function record(options) {
  if (options === void 0) {
    options = {};
  }

  var emit = options.emit,
      checkoutEveryNms = options.checkoutEveryNms,
      checkoutEveryNth = options.checkoutEveryNth,
      _a = options.blockClass,
      blockClass = _a === void 0 ? 'rr-block' : _a,
      _b = options.ignoreClass,
      ignoreClass = _b === void 0 ? 'rr-ignore' : _b,
      _c = options.inlineStylesheet,
      inlineStylesheet = _c === void 0 ? true : _c,
      _d = options.maskAllInputs,
      maskAllInputs = _d === void 0 ? false : _d;

  if (!emit) {
    throw new Error('emit function is required');
  }

  var lastFullSnapshotEvent;
  var incrementalSnapshotCount = 0;

  var wrappedEmit = function (e, isCheckout) {
    emit(e, isCheckout);

    if (e.type === EventType.FullSnapshot) {
      lastFullSnapshotEvent = e;
      incrementalSnapshotCount = 0;
    } else if (e.type === EventType.IncrementalSnapshot) {
      incrementalSnapshotCount++;
      var exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
      var exceedTime = checkoutEveryNms && e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;

      if (exceedCount || exceedTime) {
        takeFullSnapshot(true);
      }
    }
  };

  function takeFullSnapshot(isCheckout) {
    if (isCheckout === void 0) {
      isCheckout = false;
    }

    wrappedEmit(wrapEvent({
      type: EventType.Meta,
      data: {
        href: window.location.href,
        width: getWindowWidth(),
        height: getWindowHeight()
      }
    }), isCheckout);

    var _a = snapshot(document, blockClass, inlineStylesheet, maskAllInputs),
        node = _a[0],
        idNodeMap = _a[1];

    if (!node) {
      return console.warn('Failed to snapshot the document');
    }

    mirror.map = idNodeMap;
    wrappedEmit(wrapEvent({
      type: EventType.FullSnapshot,
      data: {
        node: node,
        initialOffset: {
          left: document.documentElement.scrollLeft,
          top: document.documentElement.scrollTop
        }
      }
    }));
  }

  try {
    var handlers_1 = [];
    handlers_1.push(on('DOMContentLoaded', function () {
      wrappedEmit(wrapEvent({
        type: EventType.DomContentLoaded,
        data: {}
      }));
    }));

    var init_1 = function () {
      takeFullSnapshot();
      handlers_1.push(initObservers({
        mutationCb: function (m) {
          return wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: __assign({
              source: IncrementalSource.Mutation
            }, m)
          }));
        },
        mousemoveCb: function (positions) {
          return wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.MouseMove,
              positions: positions
            }
          }));
        },
        mouseInteractionCb: function (d) {
          return wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: __assign({
              source: IncrementalSource.MouseInteraction
            }, d)
          }));
        },
        scrollCb: function (p) {
          return wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: __assign({
              source: IncrementalSource.Scroll
            }, p)
          }));
        },
        viewportResizeCb: function (d) {
          return wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: __assign({
              source: IncrementalSource.ViewportResize
            }, d)
          }));
        },
        inputCb: function (v) {
          return wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: __assign({
              source: IncrementalSource.Input
            }, v)
          }));
        },
        blockClass: blockClass,
        ignoreClass: ignoreClass,
        maskAllInputs: maskAllInputs,
        inlineStylesheet: inlineStylesheet
      }));
    };

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      init_1();
    } else {
      handlers_1.push(on('load', function () {
        wrappedEmit(wrapEvent({
          type: EventType.Load,
          data: {}
        }));
        init_1();
      }, window));
    }

    return function () {
      handlers_1.forEach(function (h) {
        return h();
      });
    };
  } catch (error) {
    console.warn(error);
  }
} //      
// An event handler can take an optional event argument
// and should not return a value
// An array of all currently registered event handlers for a type
// A map of event types and their corresponding event handlers.

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */


function mitt(all) {
  all = all || Object.create(null);
  return {
    /**
     * Register an event handler for the given type.
     *
     * @param  {String} type	Type of event to listen for, or `"*"` for all events
     * @param  {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on: function on(type, handler) {
      (all[type] || (all[type] = [])).push(handler);
    },

    /**
     * Remove an event handler for the given type.
     *
     * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
     * @param  {Function} handler Handler function to remove
     * @memberOf mitt
     */
    off: function off(type, handler) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * @param {String} type  The event type to invoke
     * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
     * @memberOf mitt
     */
    emit: function emit(type, evt) {
      (all[type] || []).slice().map(function (handler) {
        handler(evt);
      });
      (all['*'] || []).slice().map(function (handler) {
        handler(type, evt);
      });
    }
  };
}

var mittProxy =
/*#__PURE__*/
Object.freeze({
  default: mitt
});

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var smoothscroll = createCommonjsModule(function (module, exports) {
  /* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
  (function () {
    // polyfill
    function polyfill() {
      // aliases
      var w = window;
      var d = document; // return if scroll behavior is supported and polyfill is not forced

      if ('scrollBehavior' in d.documentElement.style && w.__forceSmoothScrollPolyfill__ !== true) {
        return;
      } // globals


      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468; // object gathering original scroll methods

      var original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView
      }; // define timing method

      var now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;
      /**
       * indicates if a the current browser is made by Microsoft
       * @method isMicrosoftBrowser
       * @param {String} userAgent
       * @returns {Boolean}
       */

      function isMicrosoftBrowser(userAgent) {
        var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];
        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
      }
      /*
       * IE has rounding bug rounding down clientHeight and clientWidth and
       * rounding up scrollHeight and scrollWidth causing false positives
       * on hasScrollableSpace
       */


      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
      /**
       * changes scroll position inside an element
       * @method scrollElement
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */

      function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
      }
      /**
       * returns result of applying ease math function to a number
       * @method ease
       * @param {Number} k
       * @returns {Number}
       */


      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }
      /**
       * indicates if a smooth behavior should be applied
       * @method shouldBailOut
       * @param {Number|Object} firstArg
       * @returns {Boolean}
       */


      function shouldBailOut(firstArg) {
        if (firstArg === null || typeof firstArg !== 'object' || firstArg.behavior === undefined || firstArg.behavior === 'auto' || firstArg.behavior === 'instant') {
          // first argument is not an object/null
          // or behavior is auto, instant or undefined
          return true;
        }

        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
          // first argument is an object and behavior is smooth
          return false;
        } // throw error when behavior is not supported


        throw new TypeError('behavior member of ScrollOptions ' + firstArg.behavior + ' is not a valid value for enumeration ScrollBehavior.');
      }
      /**
       * indicates if an element has scrollable space in the provided axis
       * @method hasScrollableSpace
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */


      function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
          return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }

        if (axis === 'X') {
          return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
      }
      /**
       * indicates if an element has a scrollable overflow property in the axis
       * @method canOverflow
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */


      function canOverflow(el, axis) {
        var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
        return overflowValue === 'auto' || overflowValue === 'scroll';
      }
      /**
       * indicates if an element can be scrolled in either axis
       * @method isScrollable
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */


      function isScrollable(el) {
        var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
        return isScrollableY || isScrollableX;
      }
      /**
       * finds scrollable parent of an element
       * @method findScrollableParent
       * @param {Node} el
       * @returns {Node} el
       */


      function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
          el = el.parentNode || el.host;
        }

        return el;
      }
      /**
       * self invoked function that, given a context, steps through scrolling
       * @method step
       * @param {Object} context
       * @returns {undefined}
       */


      function step(context) {
        var time = now();
        var value;
        var currentX;
        var currentY;
        var elapsed = (time - context.startTime) / SCROLL_TIME; // avoid elapsed times higher than one

        elapsed = elapsed > 1 ? 1 : elapsed; // apply easing to elapsed time

        value = ease(elapsed);
        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;
        context.method.call(context.scrollable, currentX, currentY); // scroll more if we have not reached our destination

        if (currentX !== context.x || currentY !== context.y) {
          w.requestAnimationFrame(step.bind(w, context));
        }
      }
      /**
       * scrolls window or element with a smooth behavior
       * @method smoothScroll
       * @param {Object|Node} el
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */


      function smoothScroll(el, x, y) {
        var scrollable;
        var startX;
        var startY;
        var method;
        var startTime = now(); // define scroll context

        if (el === d.body) {
          scrollable = w;
          startX = w.scrollX || w.pageXOffset;
          startY = w.scrollY || w.pageYOffset;
          method = original.scroll;
        } else {
          scrollable = el;
          startX = el.scrollLeft;
          startY = el.scrollTop;
          method = scrollElement;
        } // scroll looping over a frame


        step({
          scrollable: scrollable,
          method: method,
          startTime: startTime,
          startX: startX,
          startY: startY,
          x: x,
          y: y
        });
      } // ORIGINAL METHODS OVERRIDES
      // w.scroll and w.scrollTo


      w.scroll = w.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0]) === true) {
          original.scroll.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : w.scrollX || w.pageXOffset, // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : w.scrollY || w.pageYOffset);
          return;
        } // LET THE SMOOTHNESS BEGIN!


        smoothScroll.call(w, d.body, arguments[0].left !== undefined ? ~~arguments[0].left : w.scrollX || w.pageXOffset, arguments[0].top !== undefined ? ~~arguments[0].top : w.scrollY || w.pageYOffset);
      }; // w.scrollBy


      w.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0])) {
          original.scrollBy.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : 0, arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : 0);
          return;
        } // LET THE SMOOTHNESS BEGIN!


        smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
      }; // Element.prototype.scroll and Element.prototype.scrollTo


      Element.prototype.scroll = Element.prototype.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0]) === true) {
          // if one number is passed, throw error to match Firefox implementation
          if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
            throw new SyntaxError('Value could not be converted');
          }

          original.elementScroll.call(this, // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined ? ~~arguments[0].left : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft, // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined ? ~~arguments[0].top : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop);
          return;
        }

        var left = arguments[0].left;
        var top = arguments[0].top; // LET THE SMOOTHNESS BEGIN!

        smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
      }; // Element.prototype.scrollBy


      Element.prototype.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        } // avoid smooth behavior if not required


        if (shouldBailOut(arguments[0]) === true) {
          original.elementScroll.call(this, arguments[0].left !== undefined ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);
          return;
        }

        this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        });
      }; // Element.prototype.scrollIntoView


      Element.prototype.scrollIntoView = function () {
        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);
          return;
        } // LET THE SMOOTHNESS BEGIN!


        var scrollableParent = findScrollableParent(this);
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientRects = this.getBoundingClientRect();

        if (scrollableParent !== d.body) {
          // reveal element inside parent
          smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top); // reveal parent in viewport unless is fixed

          if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
            w.scrollBy({
              left: parentRects.left,
              top: parentRects.top,
              behavior: 'smooth'
            });
          }
        } else {
          // reveal element in viewport
          w.scrollBy({
            left: clientRects.left,
            top: clientRects.top,
            behavior: 'smooth'
          });
        }
      };
    }

    {
      // commonjs
      module.exports = {
        polyfill: polyfill
      };
    }
  })();
});
var smoothscroll_1 = smoothscroll.polyfill;

var Timer = function () {
  function Timer(config, actions) {
    if (actions === void 0) {
      actions = [];
    }

    this.timeOffset = 0;
    this.actions = actions;
    this.config = config;
  }

  Timer.prototype.addAction = function (action) {
    var index = this.findActionIndex(action);
    this.actions.splice(index, 0, action);
  };

  Timer.prototype.addActions = function (actions) {
    var _a;

    (_a = this.actions).push.apply(_a, actions);
  };

  Timer.prototype.start = function () {
    this.actions.sort(function (a1, a2) {
      return a1.delay - a2.delay;
    });
    this.timeOffset = 0;
    var lastTimestamp = performance.now();

    var _a = this,
        actions = _a.actions,
        config = _a.config;

    var self = this;

    function check(time) {
      self.timeOffset += (time - lastTimestamp) * config.speed;
      lastTimestamp = time;

      while (actions.length) {
        var action = actions[0];

        if (self.timeOffset >= action.delay) {
          actions.shift();
          action.doAction();
        } else {
          break;
        }
      }

      if (actions.length > 0 || self.config.liveMode) {
        self.raf = requestAnimationFrame(check);
      }
    }

    this.raf = requestAnimationFrame(check);
  };

  Timer.prototype.clear = function () {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }

    this.actions.length = 0;
  };

  Timer.prototype.findActionIndex = function (action) {
    var start = 0;
    var end = this.actions.length - 1;

    while (start <= end) {
      var mid = Math.floor((start + end) / 2);

      if (this.actions[mid].delay < action.delay) {
        start = mid + 1;
      } else if (this.actions[mid].delay > action.delay) {
        end = mid - 1;
      } else {
        return mid;
      }
    }

    return start;
  };

  return Timer;
}();

var rules = function (blockClass) {
  return ["iframe, ." + blockClass + " { background: #ccc }", 'noscript { display: none !important; }'];
};

var SKIP_TIME_THRESHOLD = 10 * 1000;
var SKIP_TIME_INTERVAL = 5 * 1000;
var mitt$1 = mitt || mittProxy;
var REPLAY_CONSOLE_PREFIX = '[replayer]';

var Replayer = function () {
  function Replayer(events, config) {
    this.events = [];
    this.emitter = mitt$1();
    this.baselineTime = 0;
    this.noramlSpeed = -1;
    this.missingNodeRetryMap = {};

    if (events.length < 2) {
      throw new Error('Replayer need at least 2 events.');
    }

    this.events = events;
    this.handleResize = this.handleResize.bind(this);
    var defaultConfig = {
      speed: 1,
      root: document.body,
      loadTimeout: 0,
      skipInactive: false,
      showWarning: true,
      showDebug: false,
      blockClass: 'rr-block',
      liveMode: false
    };
    this.config = Object.assign({}, defaultConfig, config);
    this.timer = new Timer(this.config);
    smoothscroll_1();
    this.setupDom();
    this.emitter.on('resize', this.handleResize);
  }

  Replayer.prototype.on = function (event, handler) {
    this.emitter.on(event, handler);
  };

  Replayer.prototype.setConfig = function (config) {
    var _this = this;

    Object.keys(config).forEach(function (key) {
      _this.config[key] = config[key];
    });

    if (!this.config.skipInactive) {
      this.noramlSpeed = -1;
    }
  };

  Replayer.prototype.getMetaData = function () {
    var firstEvent = this.events[0];
    var lastEvent = this.events[this.events.length - 1];
    return {
      totalTime: lastEvent.timestamp - firstEvent.timestamp
    };
  };

  Replayer.prototype.getTimeOffset = function () {
    return this.baselineTime - this.events[0].timestamp;
  };

  Replayer.prototype.play = function (timeOffset) {
    if (timeOffset === void 0) {
      timeOffset = 0;
    }

    this.timer.clear();
    this.baselineTime = this.events[0].timestamp + timeOffset;
    var actions = new Array();

    for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
      var event = _a[_i];
      var isSync = event.timestamp < this.baselineTime;
      var castFn = this.getCastFn(event, isSync);

      if (isSync) {
        castFn();
      } else {
        actions.push({
          doAction: castFn,
          delay: this.getDelay(event)
        });
      }
    }

    this.timer.addActions(actions);
    this.timer.start();
    this.emitter.emit(ReplayerEvents.Start);
  };

  Replayer.prototype.pause = function () {
    this.timer.clear();
    this.emitter.emit(ReplayerEvents.Pause);
  };

  Replayer.prototype.resume = function (timeOffset) {
    if (timeOffset === void 0) {
      timeOffset = 0;
    }

    this.timer.clear();
    this.baselineTime = this.events[0].timestamp + timeOffset;
    var actions = new Array();

    for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
      var event = _a[_i];

      if (event.timestamp <= this.lastPlayedEvent.timestamp || event === this.lastPlayedEvent) {
        continue;
      }

      var castFn = this.getCastFn(event);
      actions.push({
        doAction: castFn,
        delay: this.getDelay(event)
      });
    }

    this.timer.addActions(actions);
    this.timer.start();
    this.emitter.emit(ReplayerEvents.Resume);
  };

  Replayer.prototype.addEvent = function (event) {
    var castFn = this.getCastFn(event, true);
    castFn();
  };

  Replayer.prototype.setupDom = function () {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('replayer-wrapper');
    this.config.root.appendChild(this.wrapper);
    this.mouse = document.createElement('div');
    this.mouse.classList.add('replayer-mouse');
    this.wrapper.appendChild(this.mouse);
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('sandbox', 'allow-same-origin');
    this.iframe.setAttribute('scrolling', 'no');
    this.wrapper.appendChild(this.iframe);
  };

  Replayer.prototype.handleResize = function (dimension) {
    this.iframe.width = dimension.width + "px";
    this.iframe.height = dimension.height + "px";
  };

  Replayer.prototype.getDelay = function (event) {
    if (event.type === EventType.IncrementalSnapshot && event.data.source === IncrementalSource.MouseMove) {
      var firstOffset = event.data.positions[0].timeOffset;
      var firstTimestamp = event.timestamp + firstOffset;
      event.delay = firstTimestamp - this.baselineTime;
      return firstTimestamp - this.baselineTime;
    }

    event.delay = event.timestamp - this.baselineTime;
    return event.timestamp - this.baselineTime;
  };

  Replayer.prototype.getCastFn = function (event, isSync) {
    var _this = this;

    if (isSync === void 0) {
      isSync = false;
    }

    var castFn;

    switch (event.type) {
      case EventType.DomContentLoaded:
      case EventType.Load:
        break;

      case EventType.Meta:
        castFn = function () {
          return _this.emitter.emit(ReplayerEvents.Resize, {
            width: event.data.width,
            height: event.data.height
          });
        };

        break;

      case EventType.FullSnapshot:
        castFn = function () {
          _this.rebuildFullSnapshot(event);

          _this.iframe.contentWindow.scrollTo(event.data.initialOffset);
        };

        break;

      case EventType.IncrementalSnapshot:
        castFn = function () {
          _this.applyIncremental(event, isSync);

          if (event === _this.nextUserInteractionEvent) {
            _this.nextUserInteractionEvent = null;

            _this.restoreSpeed();
          }

          if (_this.config.skipInactive && !_this.nextUserInteractionEvent) {
            for (var _i = 0, _a = _this.events; _i < _a.length; _i++) {
              var _event = _a[_i];

              if (_event.timestamp <= event.timestamp) {
                continue;
              }

              if (_this.isUserInteraction(_event)) {
                if (_event.delay - event.delay > SKIP_TIME_THRESHOLD * _this.config.speed) {
                  _this.nextUserInteractionEvent = _event;
                }

                break;
              }
            }

            if (_this.nextUserInteractionEvent) {
              _this.noramlSpeed = _this.config.speed;
              var skipTime = _this.nextUserInteractionEvent.delay - event.delay;
              var payload = {
                speed: Math.min(Math.round(skipTime / SKIP_TIME_INTERVAL), 360)
              };

              _this.setConfig(payload);

              _this.emitter.emit(ReplayerEvents.SkipStart, payload);
            }
          }
        };

        break;

      default:
    }

    var wrappedCastFn = function () {
      if (castFn) {
        castFn();
      }

      _this.lastPlayedEvent = event;

      if (event === _this.events[_this.events.length - 1]) {
        _this.restoreSpeed();

        _this.emitter.emit(ReplayerEvents.Finish);
      }
    };

    return wrappedCastFn;
  };

  Replayer.prototype.rebuildFullSnapshot = function (event) {
    if (Object.keys(this.missingNodeRetryMap).length) {
      console.warn('Found unresolved missing node map', this.missingNodeRetryMap);
    }

    this.missingNodeRetryMap = {};
    mirror.map = rebuild(event.data.node, this.iframe.contentDocument)[1];
    var styleEl = document.createElement('style');
    var _a = this.iframe.contentDocument,
        documentElement = _a.documentElement,
        head = _a.head;
    documentElement.insertBefore(styleEl, head);
    var injectStyleRules = rules(this.config.blockClass);

    for (var idx = 0; idx < injectStyleRules.length; idx++) {
      styleEl.sheet.insertRule(injectStyleRules[idx], idx);
    }

    this.emitter.emit(ReplayerEvents.FullsnapshotRebuilded);
    this.waitForStylesheetLoad();
  };

  Replayer.prototype.waitForStylesheetLoad = function () {
    var _this = this;

    var head = this.iframe.contentDocument.head;

    if (head) {
      var unloadSheets_1 = new Set();
      var timer_1;
      head.querySelectorAll('link[rel="stylesheet"]').forEach(function (css) {
        if (!css.sheet) {
          if (unloadSheets_1.size === 0) {
            _this.pause();

            _this.emitter.emit(ReplayerEvents.LoadStylesheetStart);

            timer_1 = window.setTimeout(function () {
              _this.resume(_this.timer.timeOffset);

              timer_1 = -1;
            }, _this.config.loadTimeout);
          }

          unloadSheets_1.add(css);
          css.addEventListener('load', function () {
            unloadSheets_1["delete"](css);

            if (unloadSheets_1.size === 0 && timer_1 !== -1) {
              _this.resume(_this.timer.timeOffset);

              _this.emitter.emit(ReplayerEvents.LoadStylesheetEnd);

              if (timer_1) {
                window.clearTimeout(timer_1);
              }
            }
          });
        }
      });
    }
  };

  Replayer.prototype.applyIncremental = function (e, isSync) {
    var _this = this;

    var d = e.data;

    switch (d.source) {
      case IncrementalSource.Mutation:
        {
          d.removes.forEach(function (mutation) {
            var target = mirror.getNode(mutation.id);

            if (!target) {
              return _this.warnNodeNotFound(d, mutation.id);
            }

            var parent = mirror.getNode(mutation.parentId);

            if (!parent) {
              return _this.warnNodeNotFound(d, mutation.parentId);
            }

            mirror.removeNodeFromMap(target);

            if (parent) {
              parent.removeChild(target);
            }
          });

          var missingNodeMap_1 = __assign({}, this.missingNodeRetryMap);

          var queue_1 = [];

          var appendNode_1 = function (mutation) {
            var parent = mirror.getNode(mutation.parentId);

            if (!parent) {
              return queue_1.push(mutation);
            }

            var target = buildNodeWithSN(mutation.node, _this.iframe.contentDocument, mirror.map, true);
            var previous = null;
            var next = null;

            if (mutation.previousId) {
              previous = mirror.getNode(mutation.previousId);
            }

            if (mutation.nextId) {
              next = mirror.getNode(mutation.nextId);
            }

            if (mutation.previousId === -1 || mutation.nextId === -1) {
              missingNodeMap_1[mutation.node.id] = {
                node: target,
                mutation: mutation
              };
              return;
            }

            if (previous && previous.nextSibling && previous.nextSibling.parentNode) {
              parent.insertBefore(target, previous.nextSibling);
            } else if (next && next.parentNode) {
              parent.insertBefore(target, next);
            } else {
              parent.appendChild(target);
            }

            if (mutation.previousId || mutation.nextId) {
              _this.resolveMissingNode(missingNodeMap_1, parent, target, mutation);
            }
          };

          d.adds.forEach(function (mutation) {
            appendNode_1(mutation);
          });

          while (queue_1.length) {
            if (queue_1.every(function (m) {
              return !Boolean(mirror.getNode(m.parentId));
            })) {
              return queue_1.forEach(function (m) {
                return _this.warnNodeNotFound(d, m.node.id);
              });
            }

            var mutation = queue_1.shift();
            appendNode_1(mutation);
          }

          if (Object.keys(missingNodeMap_1).length) {
            Object.assign(this.missingNodeRetryMap, missingNodeMap_1);
          }

          d.texts.forEach(function (mutation) {
            var target = mirror.getNode(mutation.id);

            if (!target) {
              return _this.warnNodeNotFound(d, mutation.id);
            }

            target.textContent = mutation.value;
          });
          d.attributes.forEach(function (mutation) {
            var target = mirror.getNode(mutation.id);

            if (!target) {
              return _this.warnNodeNotFound(d, mutation.id);
            }

            for (var attributeName in mutation.attributes) {
              if (typeof attributeName === 'string') {
                var value = mutation.attributes[attributeName];

                if (value !== null) {
                  target.setAttribute(attributeName, value);
                } else {
                  target.removeAttribute(attributeName);
                }
              }
            }
          });
          break;
        }

      case IncrementalSource.MouseMove:
        if (isSync) {
          var lastPosition = d.positions[d.positions.length - 1];
          this.moveAndHover(d, lastPosition.x, lastPosition.y, lastPosition.id);
        } else {
          d.positions.forEach(function (p) {
            var action = {
              doAction: function () {
                _this.moveAndHover(d, p.x, p.y, p.id);
              },
              delay: p.timeOffset + e.timestamp - _this.baselineTime
            };

            _this.timer.addAction(action);
          });
        }

        break;

      case IncrementalSource.MouseInteraction:
        {
          if (d.id === -1) {
            break;
          }

          var event = new Event(MouseInteractions[d.type].toLowerCase());
          var target = mirror.getNode(d.id);

          if (!target) {
            return this.debugNodeNotFound(d, d.id);
          }

          this.emitter.emit(ReplayerEvents.MouseInteraction, {
            type: d.type,
            target: target
          });

          switch (d.type) {
            case MouseInteractions.Blur:
              if (target.blur) {
                target.blur();
              }

              break;

            case MouseInteractions.Focus:
              if (target.focus) {
                target.focus({
                  preventScroll: true
                });
              }

              break;

            case MouseInteractions.Click:
            case MouseInteractions.TouchStart:
            case MouseInteractions.TouchEnd:
              if (!isSync) {
                this.moveAndHover(d, d.x, d.y, d.id);
                this.mouse.classList.remove('active');
                void this.mouse.offsetWidth;
                this.mouse.classList.add('active');
              }

              break;

            default:
              target.dispatchEvent(event);
          }

          break;
        }

      case IncrementalSource.Scroll:
        {
          if (d.id === -1) {
            break;
          }

          var target = mirror.getNode(d.id);

          if (!target) {
            return this.debugNodeNotFound(d, d.id);
          }

          if (target === this.iframe.contentDocument) {
            this.iframe.contentWindow.scrollTo({
              top: d.y,
              left: d.x,
              behavior: isSync ? 'auto' : 'smooth'
            });
          } else {
            try {
              target.scrollTop = d.y;
              target.scrollLeft = d.x;
            } catch (error) {}
          }

          break;
        }

      case IncrementalSource.ViewportResize:
        this.emitter.emit(ReplayerEvents.Resize, {
          width: d.width,
          height: d.height
        });
        break;

      case IncrementalSource.Input:
        {
          if (d.id === -1) {
            break;
          }

          var target = mirror.getNode(d.id);

          if (!target) {
            return this.debugNodeNotFound(d, d.id);
          }

          try {
            target.checked = d.isChecked;
            target.value = d.text;
          } catch (error) {}

          break;
        }

      default:
    }
  };

  Replayer.prototype.resolveMissingNode = function (map, parent, target, targetMutation) {
    var previousId = targetMutation.previousId,
        nextId = targetMutation.nextId;
    var previousInMap = previousId && map[previousId];
    var nextInMap = nextId && map[nextId];

    if (previousInMap) {
      var _a = previousInMap,
          node = _a.node,
          mutation = _a.mutation;
      parent.insertBefore(node, target);
      delete map[mutation.node.id];
      delete this.missingNodeRetryMap[mutation.node.id];

      if (mutation.previousId || mutation.nextId) {
        this.resolveMissingNode(map, parent, node, mutation);
      }
    }

    if (nextInMap) {
      var _b = nextInMap,
          node = _b.node,
          mutation = _b.mutation;
      parent.insertBefore(node, target.nextSibling);
      delete map[mutation.node.id];
      delete this.missingNodeRetryMap[mutation.node.id];

      if (mutation.previousId || mutation.nextId) {
        this.resolveMissingNode(map, parent, node, mutation);
      }
    }
  };

  Replayer.prototype.moveAndHover = function (d, x, y, id) {
    this.mouse.style.left = x + "px";
    this.mouse.style.top = y + "px";
    var target = mirror.getNode(id);

    if (!target) {
      return this.debugNodeNotFound(d, id);
    }

    this.hoverElements(target);
  };

  Replayer.prototype.hoverElements = function (el) {
    this.iframe.contentDocument.querySelectorAll('.\\:hover').forEach(function (hoveredEl) {
      hoveredEl.classList.remove(':hover');
    });
    var currentEl = el;

    while (currentEl) {
      currentEl.classList.add(':hover');
      currentEl = currentEl.parentElement;
    }
  };

  Replayer.prototype.isUserInteraction = function (event) {
    if (event.type !== EventType.IncrementalSnapshot) {
      return false;
    }

    return event.data.source > IncrementalSource.Mutation && event.data.source <= IncrementalSource.Input;
  };

  Replayer.prototype.restoreSpeed = function () {
    if (this.noramlSpeed === -1) {
      return;
    }

    var payload = {
      speed: this.noramlSpeed
    };
    this.setConfig(payload);
    this.emitter.emit(ReplayerEvents.SkipEnd, payload);
    this.noramlSpeed = -1;
  };

  Replayer.prototype.warnNodeNotFound = function (d, id) {
    if (!this.config.showWarning) {
      return;
    }

    console.warn(REPLAY_CONSOLE_PREFIX, "Node with id '" + id + "' not found in", d);
  };

  Replayer.prototype.debugNodeNotFound = function (d, id) {
    if (!this.config.showDebug) {
      return;
    }

    console.log(REPLAY_CONSOLE_PREFIX, "Node with id '" + id + "' not found in", d);
  };

  return Replayer;
}();

exports.Replayer = Replayer;
},{}],"../../node_modules/rrweb-player/dist/index.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function noop() {}

function assign(e, t) {
  for (var n in t) e[n] = t[n];

  return e;
}

function assignTrue(e, t) {
  for (var n in t) e[n] = 1;

  return e;
}

function run(e) {
  e();
}

function append(e, t) {
  e.appendChild(t);
}

function insert(e, t, n) {
  e.insertBefore(t, n);
}

function detachNode(e) {
  e.parentNode.removeChild(e);
}

function destroyEach(e, t) {
  for (var n = 0; n < e.length; n += 1) e[n] && e[n].d(t);
}

function createElement(e) {
  return document.createElement(e);
}

function createSvgElement(e) {
  return document.createElementNS("http://www.w3.org/2000/svg", e);
}

function createText(e) {
  return document.createTextNode(e);
}

function createComment() {
  return document.createComment("");
}

function addListener(e, t, n, r) {
  e.addEventListener(t, n, r);
}

function removeListener(e, t, n, r) {
  e.removeEventListener(t, n, r);
}

function setAttribute(e, t, n) {
  null == n ? e.removeAttribute(t) : e.setAttribute(t, n);
}

function setData(e, t) {
  e.data = "" + t;
}

function setStyle(e, t, n) {
  e.style.setProperty(t, n);
}

function toggleClass(e, t, n) {
  e.classList[n ? "add" : "remove"](t);
}

function blankObject() {
  return Object.create(null);
}

function destroy(e) {
  this.destroy = noop, this.fire("destroy"), this.set = noop, this._fragment.d(!1 !== e), this._fragment = null, this._state = {};
}

function _differs(e, t) {
  return e != e ? t == t : e !== t || e && "object" == typeof e || "function" == typeof e;
}

function fire(e, t) {
  var n = e in this._handlers && this._handlers[e].slice();

  if (n) for (var r = 0; r < n.length; r += 1) {
    var i = n[r];
    if (!i.__calling) try {
      i.__calling = !0, i.call(this, t);
    } finally {
      i.__calling = !1;
    }
  }
}

function flush(e) {
  e._lock = !0, callAll(e._beforecreate), callAll(e._oncreate), callAll(e._aftercreate), e._lock = !1;
}

function get() {
  return this._state;
}

function init(e, t) {
  e._handlers = blankObject(), e._slots = blankObject(), e._bind = t._bind, e._staged = {}, e.options = t, e.root = t.root || e, e.store = t.store || e.root.store, t.root || (e._beforecreate = [], e._oncreate = [], e._aftercreate = []);
}

function on(e, t) {
  var n = this._handlers[e] || (this._handlers[e] = []);
  return n.push(t), {
    cancel: function () {
      var e = n.indexOf(t);
      ~e && n.splice(e, 1);
    }
  };
}

function set(e) {
  this._set(assign({}, e)), this.root._lock || flush(this.root);
}

function _set(e) {
  var t = this._state,
      n = {},
      r = !1;

  for (var i in e = assign(this._staged, e), this._staged = {}, e) this._differs(e[i], t[i]) && (n[i] = r = !0);

  r && (this._state = assign(assign({}, t), e), this._recompute(n, this._state), this._bind && this._bind(n, this._state), this._fragment && (this.fire("state", {
    changed: n,
    current: this._state,
    previous: t
  }), this._fragment.p(n, this._state), this.fire("update", {
    changed: n,
    current: this._state,
    previous: t
  })));
}

function _stage(e) {
  assign(this._staged, e);
}

function callAll(e) {
  for (; e && e.length;) e.shift()();
}

function _mount(e, t) {
  this._fragment[this._fragment.i ? "i" : "m"](e, t || null);
}

var NodeType,
    proto = {
  destroy: destroy,
  get: get,
  fire: fire,
  on: on,
  set: set,
  _recompute: noop,
  _set: _set,
  _stage: _stage,
  _mount: _mount,
  _differs: _differs
},
    __assign = function () {
  return (__assign = Object.assign || function (e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);

    return e;
  }).apply(this, arguments);
};

!function (e) {
  e[e.Document = 0] = "Document", e[e.DocumentType = 1] = "DocumentType", e[e.Element = 2] = "Element", e[e.Text = 3] = "Text", e[e.CDATA = 4] = "CDATA", e[e.Comment = 5] = "Comment";
}(NodeType || (NodeType = {}));
var tagMap = {
  script: "noscript",
  altglyph: "altGlyph",
  altglyphdef: "altGlyphDef",
  altglyphitem: "altGlyphItem",
  animatecolor: "animateColor",
  animatemotion: "animateMotion",
  animatetransform: "animateTransform",
  clippath: "clipPath",
  feblend: "feBlend",
  fecolormatrix: "feColorMatrix",
  fecomponenttransfer: "feComponentTransfer",
  fecomposite: "feComposite",
  feconvolvematrix: "feConvolveMatrix",
  fediffuselighting: "feDiffuseLighting",
  fedisplacementmap: "feDisplacementMap",
  fedistantlight: "feDistantLight",
  fedropshadow: "feDropShadow",
  feflood: "feFlood",
  fefunca: "feFuncA",
  fefuncb: "feFuncB",
  fefuncg: "feFuncG",
  fefuncr: "feFuncR",
  fegaussianblur: "feGaussianBlur",
  feimage: "feImage",
  femerge: "feMerge",
  femergenode: "feMergeNode",
  femorphology: "feMorphology",
  feoffset: "feOffset",
  fepointlight: "fePointLight",
  fespecularlighting: "feSpecularLighting",
  fespotlight: "feSpotLight",
  fetile: "feTile",
  feturbulence: "feTurbulence",
  foreignobject: "foreignObject",
  glyphref: "glyphRef",
  lineargradient: "linearGradient",
  radialgradient: "radialGradient"
};

function getTagName(e) {
  var t = tagMap[e.tagName] ? tagMap[e.tagName] : e.tagName;
  return "link" === t && e.attributes._cssText && (t = "style"), t;
}

var CSS_SELECTOR = /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
    HOVER_SELECTOR = /([^\\]):hover/g;

function addHoverClass(e) {
  return e.replace(CSS_SELECTOR, function (e, t, n) {
    if (HOVER_SELECTOR.test(t)) {
      var r = t.replace(HOVER_SELECTOR, "$1.\\:hover");
      return t.replace(/\s*$/, "") + ", " + r.replace(/^\s*/, "") + n;
    }

    return e;
  });
}

function buildNode(e, t) {
  switch (e.type) {
    case NodeType.Document:
      return t.implementation.createDocument(null, "", null);

    case NodeType.DocumentType:
      return t.implementation.createDocumentType(e.name, e.publicId, e.systemId);

    case NodeType.Element:
      var n = getTagName(e),
          r = void 0;

      for (var i in r = e.isSVG ? t.createElementNS("http://www.w3.org/2000/svg", n) : t.createElement(n), e.attributes) if (e.attributes.hasOwnProperty(i) && !i.startsWith("rr_")) {
        var o = e.attributes[i];
        o = "boolean" == typeof o ? "" : o;
        var s = "textarea" === n && "value" === i,
            a = "style" === n && "_cssText" === i;

        if (a && (o = addHoverClass(o)), s || a) {
          var l = t.createTextNode(o);
          r.appendChild(l);
          continue;
        }

        if ("iframe" === n && "src" === i) continue;

        try {
          e.isSVG && "xlink:href" === i ? r.setAttributeNS("http://www.w3.org/1999/xlink", i, o) : r.setAttribute(i, o);
        } catch (e) {}
      } else e.attributes.rr_width && (r.style.width = e.attributes.rr_width), e.attributes.rr_height && (r.style.height = e.attributes.rr_height);

      return r;

    case NodeType.Text:
      return t.createTextNode(e.isStyle ? addHoverClass(e.textContent) : e.textContent);

    case NodeType.CDATA:
      return t.createCDATASection(e.textContent);

    case NodeType.Comment:
      return t.createComment(e.textContent);

    default:
      return null;
  }
}

function buildNodeWithSN(e, t, n, r) {
  void 0 === r && (r = !1);
  var i = buildNode(e, t);
  if (!i) return null;
  if (e.type === NodeType.Document && (t.close(), t.open(), i = t), i.__sn = e, n[e.id] = i, (e.type === NodeType.Document || e.type === NodeType.Element) && !r) for (var o = 0, s = e.childNodes; o < s.length; o++) {
    var a = s[o],
        l = buildNodeWithSN(a, t, n);
    l ? i.appendChild(l) : console.warn("Failed to rebuild", a);
  }
  return i;
}

function rebuild(e, t) {
  var n = {};
  return [buildNodeWithSN(e, t, n), n];
}

var EventType,
    IncrementalSource,
    MouseInteractions,
    ReplayerEvents,
    mirror = {
  map: {},
  getId: function (e) {
    return e.__sn ? e.__sn.id : -1;
  },
  getNode: function (e) {
    return mirror.map[e] || null;
  },
  removeNodeFromMap: function (e) {
    var t = e.__sn && e.__sn.id;
    delete mirror.map[t], e.childNodes && e.childNodes.forEach(function (e) {
      return mirror.removeNodeFromMap(e);
    });
  },
  has: function (e) {
    return mirror.map.hasOwnProperty(e);
  }
};

function mitt(e) {
  return e = e || Object.create(null), {
    on: function (t, n) {
      (e[t] || (e[t] = [])).push(n);
    },
    off: function (t, n) {
      e[t] && e[t].splice(e[t].indexOf(n) >>> 0, 1);
    },
    emit: function (t, n) {
      (e[t] || []).slice().map(function (e) {
        e(n);
      }), (e["*"] || []).slice().map(function (e) {
        e(t, n);
      });
    }
  };
}

!function (e) {
  e[e.DomContentLoaded = 0] = "DomContentLoaded", e[e.Load = 1] = "Load", e[e.FullSnapshot = 2] = "FullSnapshot", e[e.IncrementalSnapshot = 3] = "IncrementalSnapshot", e[e.Meta = 4] = "Meta";
}(EventType || (EventType = {})), function (e) {
  e[e.Mutation = 0] = "Mutation", e[e.MouseMove = 1] = "MouseMove", e[e.MouseInteraction = 2] = "MouseInteraction", e[e.Scroll = 3] = "Scroll", e[e.ViewportResize = 4] = "ViewportResize", e[e.Input = 5] = "Input";
}(IncrementalSource || (IncrementalSource = {})), function (e) {
  e[e.MouseUp = 0] = "MouseUp", e[e.MouseDown = 1] = "MouseDown", e[e.Click = 2] = "Click", e[e.ContextMenu = 3] = "ContextMenu", e[e.DblClick = 4] = "DblClick", e[e.Focus = 5] = "Focus", e[e.Blur = 6] = "Blur", e[e.TouchStart = 7] = "TouchStart", e[e.TouchMove_Departed = 8] = "TouchMove_Departed", e[e.TouchEnd = 9] = "TouchEnd";
}(MouseInteractions || (MouseInteractions = {})), function (e) {
  e.Start = "start", e.Pause = "pause", e.Resume = "resume", e.Resize = "resize", e.Finish = "finish", e.FullsnapshotRebuilded = "fullsnapshot-rebuilded", e.LoadStylesheetStart = "load-stylesheet-start", e.LoadStylesheetEnd = "load-stylesheet-end", e.SkipStart = "skip-start", e.SkipEnd = "skip-end", e.MouseInteraction = "mouse-interaction";
}(ReplayerEvents || (ReplayerEvents = {}));
var mittProxy = Object.freeze({
  default: mitt
});

function createCommonjsModule(e, t) {
  return e(t = {
    exports: {}
  }, t.exports), t.exports;
}

var smoothscroll = createCommonjsModule(function (e, t) {
  !function () {
    e.exports = {
      polyfill: function () {
        var e = window,
            t = document;

        if (!("scrollBehavior" in t.documentElement.style && !0 !== e.__forceSmoothScrollPolyfill__)) {
          var n,
              r = e.HTMLElement || e.Element,
              i = 468,
              o = {
            scroll: e.scroll || e.scrollTo,
            scrollBy: e.scrollBy,
            elementScroll: r.prototype.scroll || l,
            scrollIntoView: r.prototype.scrollIntoView
          },
              s = e.performance && e.performance.now ? e.performance.now.bind(e.performance) : Date.now,
              a = (n = e.navigator.userAgent, new RegExp(["MSIE ", "Trident/", "Edge/"].join("|")).test(n) ? 1 : 0);
          e.scroll = e.scrollTo = function () {
            void 0 !== arguments[0] && (!0 !== c(arguments[0]) ? f.call(e, t.body, void 0 !== arguments[0].left ? ~~arguments[0].left : e.scrollX || e.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : e.scrollY || e.pageYOffset) : o.scroll.call(e, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : e.scrollX || e.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : e.scrollY || e.pageYOffset));
          }, e.scrollBy = function () {
            void 0 !== arguments[0] && (c(arguments[0]) ? o.scrollBy.call(e, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : f.call(e, t.body, ~~arguments[0].left + (e.scrollX || e.pageXOffset), ~~arguments[0].top + (e.scrollY || e.pageYOffset)));
          }, r.prototype.scroll = r.prototype.scrollTo = function () {
            if (void 0 !== arguments[0]) if (!0 !== c(arguments[0])) {
              var e = arguments[0].left,
                  t = arguments[0].top;
              f.call(this, this, void 0 === e ? this.scrollLeft : ~~e, void 0 === t ? this.scrollTop : ~~t);
            } else {
              if ("number" == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError("Value could not be converted");
              o.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : "object" != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop);
            }
          }, r.prototype.scrollBy = function () {
            void 0 !== arguments[0] && (!0 !== c(arguments[0]) ? this.scroll({
              left: ~~arguments[0].left + this.scrollLeft,
              top: ~~arguments[0].top + this.scrollTop,
              behavior: arguments[0].behavior
            }) : o.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop));
          }, r.prototype.scrollIntoView = function () {
            if (!0 !== c(arguments[0])) {
              var n = function (e) {
                for (; e !== t.body && !1 === p(e);) e = e.parentNode || e.host;

                return e;
              }(this),
                  r = n.getBoundingClientRect(),
                  i = this.getBoundingClientRect();

              n !== t.body ? (f.call(this, n, n.scrollLeft + i.left - r.left, n.scrollTop + i.top - r.top), "fixed" !== e.getComputedStyle(n).position && e.scrollBy({
                left: r.left,
                top: r.top,
                behavior: "smooth"
              })) : e.scrollBy({
                left: i.left,
                top: i.top,
                behavior: "smooth"
              });
            } else o.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
          };
        }

        function l(e, t) {
          this.scrollLeft = e, this.scrollTop = t;
        }

        function c(e) {
          if (null === e || "object" != typeof e || void 0 === e.behavior || "auto" === e.behavior || "instant" === e.behavior) return !0;
          if ("object" == typeof e && "smooth" === e.behavior) return !1;
          throw new TypeError("behavior member of ScrollOptions " + e.behavior + " is not a valid value for enumeration ScrollBehavior.");
        }

        function d(e, t) {
          return "Y" === t ? e.clientHeight + a < e.scrollHeight : "X" === t ? e.clientWidth + a < e.scrollWidth : void 0;
        }

        function u(t, n) {
          var r = e.getComputedStyle(t, null)["overflow" + n];
          return "auto" === r || "scroll" === r;
        }

        function p(e) {
          var t = d(e, "Y") && u(e, "Y"),
              n = d(e, "X") && u(e, "X");
          return t || n;
        }

        function h(t) {
          var n,
              r,
              o,
              a,
              l = (s() - t.startTime) / i;
          a = l = l > 1 ? 1 : l, n = .5 * (1 - Math.cos(Math.PI * a)), r = t.startX + (t.x - t.startX) * n, o = t.startY + (t.y - t.startY) * n, t.method.call(t.scrollable, r, o), r === t.x && o === t.y || e.requestAnimationFrame(h.bind(e, t));
        }

        function f(n, r, i) {
          var a,
              c,
              d,
              u,
              p = s();
          n === t.body ? (a = e, c = e.scrollX || e.pageXOffset, d = e.scrollY || e.pageYOffset, u = o.scroll) : (a = n, c = n.scrollLeft, d = n.scrollTop, u = l), h({
            scrollable: a,
            method: u,
            startTime: p,
            startX: c,
            startY: d,
            x: r,
            y: i
          });
        }
      }
    };
  }();
}),
    smoothscroll_1 = smoothscroll.polyfill,
    Timer = function () {
  function e(e, t) {
    void 0 === t && (t = []), this.timeOffset = 0, this.actions = t, this.config = e;
  }

  return e.prototype.addAction = function (e) {
    var t = this.findActionIndex(e);
    this.actions.splice(t, 0, e);
  }, e.prototype.addActions = function (e) {
    var t;
    (t = this.actions).push.apply(t, e);
  }, e.prototype.start = function () {
    this.actions.sort(function (e, t) {
      return e.delay - t.delay;
    }), this.timeOffset = 0;
    var e = performance.now(),
        t = this.actions,
        n = this.config,
        r = this;
    this.raf = requestAnimationFrame(function i(o) {
      for (r.timeOffset += (o - e) * n.speed, e = o; t.length;) {
        var s = t[0];
        if (!(r.timeOffset >= s.delay)) break;
        t.shift(), s.doAction();
      }

      (t.length > 0 || r.config.liveMode) && (r.raf = requestAnimationFrame(i));
    });
  }, e.prototype.clear = function () {
    this.raf && cancelAnimationFrame(this.raf), this.actions.length = 0;
  }, e.prototype.findActionIndex = function (e) {
    for (var t = 0, n = this.actions.length - 1; t <= n;) {
      var r = Math.floor((t + n) / 2);
      if (this.actions[r].delay < e.delay) t = r + 1;else {
        if (!(this.actions[r].delay > e.delay)) return r;
        n = r - 1;
      }
    }

    return t;
  }, e;
}(),
    rules = function (e) {
  return ["iframe, ." + e + " { background: #ccc }", "noscript { display: none !important; }"];
},
    SKIP_TIME_THRESHOLD = 1e4,
    SKIP_TIME_INTERVAL = 5e3,
    mitt$1 = mitt || mittProxy,
    REPLAY_CONSOLE_PREFIX = "[replayer]",
    Replayer = function () {
  function e(e, t) {
    if (this.events = [], this.emitter = mitt$1(), this.baselineTime = 0, this.noramlSpeed = -1, this.missingNodeRetryMap = {}, e.length < 2) throw new Error("Replayer need at least 2 events.");
    this.events = e, this.handleResize = this.handleResize.bind(this);
    var n = {
      speed: 1,
      root: document.body,
      loadTimeout: 0,
      skipInactive: !1,
      showWarning: !0,
      showDebug: !1,
      blockClass: "rr-block",
      liveMode: !1
    };
    this.config = Object.assign({}, n, t), this.timer = new Timer(this.config), smoothscroll_1(), this.setupDom(), this.emitter.on("resize", this.handleResize);
  }

  return e.prototype.on = function (e, t) {
    this.emitter.on(e, t);
  }, e.prototype.setConfig = function (e) {
    var t = this;
    Object.keys(e).forEach(function (n) {
      t.config[n] = e[n];
    }), this.config.skipInactive || (this.noramlSpeed = -1);
  }, e.prototype.getMetaData = function () {
    var e = this.events[0];
    return {
      totalTime: this.events[this.events.length - 1].timestamp - e.timestamp
    };
  }, e.prototype.getTimeOffset = function () {
    return this.baselineTime - this.events[0].timestamp;
  }, e.prototype.play = function (e) {
    void 0 === e && (e = 0), this.timer.clear(), this.baselineTime = this.events[0].timestamp + e;

    for (var t = new Array(), n = 0, r = this.events; n < r.length; n++) {
      var i = r[n],
          o = i.timestamp < this.baselineTime,
          s = this.getCastFn(i, o);
      o ? s() : t.push({
        doAction: s,
        delay: this.getDelay(i)
      });
    }

    this.timer.addActions(t), this.timer.start(), this.emitter.emit(ReplayerEvents.Start);
  }, e.prototype.pause = function () {
    this.timer.clear(), this.emitter.emit(ReplayerEvents.Pause);
  }, e.prototype.resume = function (e) {
    void 0 === e && (e = 0), this.timer.clear(), this.baselineTime = this.events[0].timestamp + e;

    for (var t = new Array(), n = 0, r = this.events; n < r.length; n++) {
      var i = r[n];

      if (!(i.timestamp <= this.lastPlayedEvent.timestamp || i === this.lastPlayedEvent)) {
        var o = this.getCastFn(i);
        t.push({
          doAction: o,
          delay: this.getDelay(i)
        });
      }
    }

    this.timer.addActions(t), this.timer.start(), this.emitter.emit(ReplayerEvents.Resume);
  }, e.prototype.addEvent = function (e) {
    this.getCastFn(e, !0)();
  }, e.prototype.setupDom = function () {
    this.wrapper = document.createElement("div"), this.wrapper.classList.add("replayer-wrapper"), this.config.root.appendChild(this.wrapper), this.mouse = document.createElement("div"), this.mouse.classList.add("replayer-mouse"), this.wrapper.appendChild(this.mouse), this.iframe = document.createElement("iframe"), this.iframe.setAttribute("sandbox", "allow-same-origin"), this.iframe.setAttribute("scrolling", "no"), this.wrapper.appendChild(this.iframe);
  }, e.prototype.handleResize = function (e) {
    this.iframe.width = e.width + "px", this.iframe.height = e.height + "px";
  }, e.prototype.getDelay = function (e) {
    if (e.type === EventType.IncrementalSnapshot && e.data.source === IncrementalSource.MouseMove) {
      var t = e.data.positions[0].timeOffset,
          n = e.timestamp + t;
      return e.delay = n - this.baselineTime, n - this.baselineTime;
    }

    return e.delay = e.timestamp - this.baselineTime, e.timestamp - this.baselineTime;
  }, e.prototype.getCastFn = function (e, t) {
    var n,
        r = this;

    switch (void 0 === t && (t = !1), e.type) {
      case EventType.DomContentLoaded:
      case EventType.Load:
        break;

      case EventType.Meta:
        n = function () {
          return r.emitter.emit(ReplayerEvents.Resize, {
            width: e.data.width,
            height: e.data.height
          });
        };

        break;

      case EventType.FullSnapshot:
        n = function () {
          r.rebuildFullSnapshot(e), r.iframe.contentWindow.scrollTo(e.data.initialOffset);
        };

        break;

      case EventType.IncrementalSnapshot:
        n = function () {
          if (r.applyIncremental(e, t), e === r.nextUserInteractionEvent && (r.nextUserInteractionEvent = null, r.restoreSpeed()), r.config.skipInactive && !r.nextUserInteractionEvent) {
            for (var n = 0, i = r.events; n < i.length; n++) {
              var o = i[n];

              if (!(o.timestamp <= e.timestamp) && r.isUserInteraction(o)) {
                o.delay - e.delay > SKIP_TIME_THRESHOLD * r.config.speed && (r.nextUserInteractionEvent = o);
                break;
              }
            }

            if (r.nextUserInteractionEvent) {
              r.noramlSpeed = r.config.speed;
              var s = r.nextUserInteractionEvent.delay - e.delay,
                  a = {
                speed: Math.min(Math.round(s / SKIP_TIME_INTERVAL), 360)
              };
              r.setConfig(a), r.emitter.emit(ReplayerEvents.SkipStart, a);
            }
          }
        };

    }

    return function () {
      n && n(), r.lastPlayedEvent = e, e === r.events[r.events.length - 1] && (r.restoreSpeed(), r.emitter.emit(ReplayerEvents.Finish));
    };
  }, e.prototype.rebuildFullSnapshot = function (e) {
    Object.keys(this.missingNodeRetryMap).length && console.warn("Found unresolved missing node map", this.missingNodeRetryMap), this.missingNodeRetryMap = {}, mirror.map = rebuild(e.data.node, this.iframe.contentDocument)[1];
    var t = document.createElement("style"),
        n = this.iframe.contentDocument,
        r = n.documentElement,
        i = n.head;
    r.insertBefore(t, i);

    for (var o = rules(this.config.blockClass), s = 0; s < o.length; s++) t.sheet.insertRule(o[s], s);

    this.emitter.emit(ReplayerEvents.FullsnapshotRebuilded), this.waitForStylesheetLoad();
  }, e.prototype.waitForStylesheetLoad = function () {
    var e = this,
        t = this.iframe.contentDocument.head;

    if (t) {
      var n,
          r = new Set();
      t.querySelectorAll('link[rel="stylesheet"]').forEach(function (t) {
        t.sheet || (0 === r.size && (e.pause(), e.emitter.emit(ReplayerEvents.LoadStylesheetStart), n = window.setTimeout(function () {
          e.resume(e.timer.timeOffset), n = -1;
        }, e.config.loadTimeout)), r.add(t), t.addEventListener("load", function () {
          r.delete(t), 0 === r.size && -1 !== n && (e.resume(e.timer.timeOffset), e.emitter.emit(ReplayerEvents.LoadStylesheetEnd), n && window.clearTimeout(n));
        }));
      });
    }
  }, e.prototype.applyIncremental = function (e, t) {
    var n = this,
        r = e.data;

    switch (r.source) {
      case IncrementalSource.Mutation:
        r.removes.forEach(function (e) {
          var t = mirror.getNode(e.id);
          if (!t) return n.warnNodeNotFound(r, e.id);
          var i = mirror.getNode(e.parentId);
          if (!i) return n.warnNodeNotFound(r, e.parentId);
          mirror.removeNodeFromMap(t), i && i.removeChild(t);
        });

        var i = __assign({}, this.missingNodeRetryMap),
            o = [],
            s = function (e) {
          var t = mirror.getNode(e.parentId);
          if (!t) return o.push(e);
          var r = buildNodeWithSN(e.node, n.iframe.contentDocument, mirror.map, !0),
              s = null,
              a = null;
          e.previousId && (s = mirror.getNode(e.previousId)), e.nextId && (a = mirror.getNode(e.nextId)), -1 !== e.previousId && -1 !== e.nextId ? (s && s.nextSibling && s.nextSibling.parentNode ? t.insertBefore(r, s.nextSibling) : a && a.parentNode ? t.insertBefore(r, a) : t.appendChild(r), (e.previousId || e.nextId) && n.resolveMissingNode(i, t, r, e)) : i[e.node.id] = {
            node: r,
            mutation: e
          };
        };

        for (r.adds.forEach(function (e) {
          s(e);
        }); o.length;) {
          if (o.every(function (e) {
            return !Boolean(mirror.getNode(e.parentId));
          })) return o.forEach(function (e) {
            return n.warnNodeNotFound(r, e.node.id);
          });
          var a = o.shift();
          s(a);
        }

        Object.keys(i).length && Object.assign(this.missingNodeRetryMap, i), r.texts.forEach(function (e) {
          var t = mirror.getNode(e.id);
          if (!t) return n.warnNodeNotFound(r, e.id);
          t.textContent = e.value;
        }), r.attributes.forEach(function (e) {
          var t = mirror.getNode(e.id);
          if (!t) return n.warnNodeNotFound(r, e.id);

          for (var i in e.attributes) if ("string" == typeof i) {
            var o = e.attributes[i];
            null !== o ? t.setAttribute(i, o) : t.removeAttribute(i);
          }
        });
        break;

      case IncrementalSource.MouseMove:
        if (t) {
          var l = r.positions[r.positions.length - 1];
          this.moveAndHover(r, l.x, l.y, l.id);
        } else r.positions.forEach(function (t) {
          var i = {
            doAction: function () {
              n.moveAndHover(r, t.x, t.y, t.id);
            },
            delay: t.timeOffset + e.timestamp - n.baselineTime
          };
          n.timer.addAction(i);
        });

        break;

      case IncrementalSource.MouseInteraction:
        if (-1 === r.id) break;
        var c = new Event(MouseInteractions[r.type].toLowerCase());
        if (!(d = mirror.getNode(r.id))) return this.debugNodeNotFound(r, r.id);

        switch (this.emitter.emit(ReplayerEvents.MouseInteraction, {
          type: r.type,
          target: d
        }), r.type) {
          case MouseInteractions.Blur:
            d.blur && d.blur();
            break;

          case MouseInteractions.Focus:
            d.focus && d.focus({
              preventScroll: !0
            });
            break;

          case MouseInteractions.Click:
          case MouseInteractions.TouchStart:
          case MouseInteractions.TouchEnd:
            t || (this.moveAndHover(r, r.x, r.y, r.id), this.mouse.classList.remove("active"), this.mouse.offsetWidth, this.mouse.classList.add("active"));
            break;

          default:
            d.dispatchEvent(c);
        }

        break;

      case IncrementalSource.Scroll:
        if (-1 === r.id) break;
        if (!(d = mirror.getNode(r.id))) return this.debugNodeNotFound(r, r.id);
        if (d === this.iframe.contentDocument) this.iframe.contentWindow.scrollTo({
          top: r.y,
          left: r.x,
          behavior: t ? "auto" : "smooth"
        });else try {
          d.scrollTop = r.y, d.scrollLeft = r.x;
        } catch (e) {}
        break;

      case IncrementalSource.ViewportResize:
        this.emitter.emit(ReplayerEvents.Resize, {
          width: r.width,
          height: r.height
        });
        break;

      case IncrementalSource.Input:
        if (-1 === r.id) break;
        var d;
        if (!(d = mirror.getNode(r.id))) return this.debugNodeNotFound(r, r.id);

        try {
          d.checked = r.isChecked, d.value = r.text;
        } catch (e) {}

    }
  }, e.prototype.resolveMissingNode = function (e, t, n, r) {
    var i = r.previousId,
        o = r.nextId,
        s = i && e[i],
        a = o && e[o];

    if (s) {
      var l = s,
          c = l.node,
          d = l.mutation;
      t.insertBefore(c, n), delete e[d.node.id], delete this.missingNodeRetryMap[d.node.id], (d.previousId || d.nextId) && this.resolveMissingNode(e, t, c, d);
    }

    if (a) {
      var u = a;
      c = u.node, d = u.mutation;
      t.insertBefore(c, n.nextSibling), delete e[d.node.id], delete this.missingNodeRetryMap[d.node.id], (d.previousId || d.nextId) && this.resolveMissingNode(e, t, c, d);
    }
  }, e.prototype.moveAndHover = function (e, t, n, r) {
    this.mouse.style.left = t + "px", this.mouse.style.top = n + "px";
    var i = mirror.getNode(r);
    if (!i) return this.debugNodeNotFound(e, r);
    this.hoverElements(i);
  }, e.prototype.hoverElements = function (e) {
    this.iframe.contentDocument.querySelectorAll(".\\:hover").forEach(function (e) {
      e.classList.remove(":hover");
    });

    for (var t = e; t;) t.classList.add(":hover"), t = t.parentElement;
  }, e.prototype.isUserInteraction = function (e) {
    return e.type === EventType.IncrementalSnapshot && e.data.source > IncrementalSource.Mutation && e.data.source <= IncrementalSource.Input;
  }, e.prototype.restoreSpeed = function () {
    if (-1 !== this.noramlSpeed) {
      var e = {
        speed: this.noramlSpeed
      };
      this.setConfig(e), this.emitter.emit(ReplayerEvents.SkipEnd, e), this.noramlSpeed = -1;
    }
  }, e.prototype.warnNodeNotFound = function (e, t) {
    this.config.showWarning && console.warn(REPLAY_CONSOLE_PREFIX, "Node with id '" + t + "' not found in", e);
  }, e.prototype.debugNodeNotFound = function (e, t) {
    this.config.showDebug && console.log(REPLAY_CONSOLE_PREFIX, "Node with id '" + t + "' not found in", e);
  }, e;
}();

function styleInject(e, t) {
  void 0 === t && (t = {});
  var n = t.insertAt;

  if (e && "undefined" != typeof document) {
    var r = document.head || document.getElementsByTagName("head")[0],
        i = document.createElement("style");
    i.type = "text/css", "top" === n && r.firstChild ? r.insertBefore(i, r.firstChild) : r.appendChild(i), i.styleSheet ? i.styleSheet.cssText = e : i.appendChild(document.createTextNode(e));
  }
}

var css = 'body{margin:0}.replayer-wrapper{position:relative}.replayer-mouse{position:absolute;width:20px;height:20px;transition:.05s linear;background-size:contain;background-position:50%;background-repeat:no-repeat;background-image:url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iTGF5ZXIgMSIgdmlld0JveD0iMCAwIDUwIDUwIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPkRlc2lnbl90bnA8L3RpdGxlPjxwYXRoIGQ9Ik00OC43MSw0Mi45MUwzNC4wOCwyOC4yOSw0NC4zMywxOEExLDEsMCwwLDAsNDQsMTYuMzlMMi4zNSwxLjA2QTEsMSwwLDAsMCwxLjA2LDIuMzVMMTYuMzksNDRhMSwxLDAsMCwwLDEuNjUuMzZMMjguMjksMzQuMDgsNDIuOTEsNDguNzFhMSwxLDAsMCwwLDEuNDEsMGw0LjM4LTQuMzhBMSwxLDAsMCwwLDQ4LjcxLDQyLjkxWm0tNS4wOSwzLjY3TDI5LDMyYTEsMSwwLDAsMC0xLjQxLDBsLTkuODUsOS44NUwzLjY5LDMuNjlsMzguMTIsMTRMMzIsMjcuNThBMSwxLDAsMCwwLDMyLDI5TDQ2LjU5LDQzLjYyWiI+PC9wYXRoPjwvc3ZnPg==")}.replayer-mouse:after{content:"";display:inline-block;width:20px;height:20px;border-radius:10px;background:#4950f6;transform:translate(-10px,-10px);opacity:.3}.replayer-mouse.active:after{animation:a .2s ease-in-out 1}@keyframes a{0%{opacity:.3;width:20px;height:20px;border-radius:10px;transform:translate(-10px,-10px)}50%{opacity:.5;width:10px;height:10px;border-radius:5px;transform:translate(-5px,-5px)}}';

function inlineCss(e) {
  let t = "";
  return Object.keys(e).forEach(n => {
    t += `${n}: ${e[n]};`;
  }), t;
}

function padZero(e, t = 2) {
  const n = Math.pow(10, t - 1);
  if (e < n) for (e = String(e); String(n).length > e.length;) e = "0" + e;
  return e;
}

styleInject(css);
const SECOND = 1e3,
      MINUTE = 60 * SECOND,
      HOUR = 60 * MINUTE;

function formatTime(e) {
  if (e <= 0) return "00:00";
  const t = Math.floor(e / HOUR);
  e %= HOUR;
  const n = Math.floor(e / MINUTE);
  e %= MINUTE;
  const r = Math.floor(e / SECOND);
  return t ? `${padZero(t)}:${padZero(n)}:${padZero(r)}` : `${padZero(n)}:${padZero(r)}`;
}

function openFullscreen(e) {
  return e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : void 0;
}

function exitFullscreen() {
  return document.exitFullscreen ? document.exitFullscreen() : document.mozExitFullscreen ? document.mozExitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : void 0;
}

function isFullscreen() {
  return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement;
}

function onFullscreenChange(e) {
  return document.addEventListener("fullscreenchange", e), document.addEventListener("webkitfullscreenchange", e), document.addEventListener("mozfullscreenchange", e), document.addEventListener("MSFullscreenChange", e), () => {
    document.removeEventListener("fullscreenchange", e), document.removeEventListener("webkitfullscreenchange", e), document.removeEventListener("mozfullscreenchange", e), document.removeEventListener("MSFullscreenChange", e);
  };
}

function create_main_fragment(e, t) {
  var n, r, i, o, s, a, l, c;

  function d() {
    e.set({
      checked: r.checked
    });
  }

  return {
    c() {
      n = createElement("div"), r = createElement("input"), i = createText("\n  "), o = createElement("label"), s = createText(" "), a = createElement("span"), l = createText(t.label), addListener(r, "change", d), setAttribute(r, "type", "checkbox"), r.id = t.id, r.disabled = t.disabled, r.className = "svelte-a6h7w7", o.htmlFor = t.id, o.className = "svelte-a6h7w7", a.className = "label svelte-a6h7w7", n.className = "switch svelte-a6h7w7", toggleClass(n, "disabled", t.disabled);
    },

    m(e, d) {
      insert(e, n, d), append(n, r), r.checked = t.checked, append(n, i), append(n, o), append(n, s), append(n, a), append(a, l), c = !0;
    },

    p(e, t) {
      e.checked && (r.checked = t.checked), e.id && (r.id = t.id), e.disabled && (r.disabled = t.disabled), e.id && (o.htmlFor = t.id), e.label && setData(l, t.label), e.disabled && toggleClass(n, "disabled", t.disabled);
    },

    i(e, t) {
      c || this.m(e, t);
    },

    o: run,

    d(e) {
      e && detachNode(n), removeListener(r, "change", d);
    }

  };
}

function Switch(e) {
  init(this, e), this._state = assign({}, e.data), this._intro = !!e.intro, this._fragment = create_main_fragment(this, this._state), e.target && (this._fragment.c(), this._mount(e.target, e.anchor)), this._intro = !0;
}

function meta({
  replayer: e
}) {
  return e.getMetaData();
}

function percentage({
  currentTime: e,
  meta: t
}) {
  return `${100 * Math.min(1, e / t.totalTime)}%`;
}

function data() {
  return {
    currentTime: 0,
    isPlaying: !1,
    isSkipping: !1,
    skipInactive: !0,
    speed: 1
  };
}

assign(Switch.prototype, proto);
var methods = {
  loopTimer() {
    const e = this;
    this.timer = requestAnimationFrame(function t() {
      const {
        meta: n,
        isPlaying: r,
        replayer: i
      } = e.get();
      if (!r) return void (e.timer = null);
      const o = i.timer.timeOffset + i.getTimeOffset();
      e.set({
        currentTime: o
      }), o < n.totalTime && requestAnimationFrame(t);
    });
  },

  play() {
    const {
      replayer: e,
      currentTime: t
    } = this.get();
    t > 0 ? e.resume(t) : (this.set({
      isPlaying: !0
    }), e.play(t));
  },

  pause() {
    const {
      replayer: e
    } = this.get();
    e.pause();
  },

  toggle() {
    const {
      isPlaying: e
    } = this.get();
    e ? this.pause() : this.play();
  },

  setSpeed(e) {
    const {
      replayer: t,
      currentTime: n,
      isPlaying: r
    } = this.get();
    t.pause(), t.setConfig({
      speed: e
    }), this.set({
      speed: e
    }), r && t.resume(n);
  },

  handleProgressClick(e) {
    const {
      meta: t,
      replayer: n,
      isPlaying: r,
      isSkipping: i
    } = this.get();
    if (i) return;
    const o = this.refs.progress.getBoundingClientRect();
    let s = (e.clientX - o.left) / o.width;
    s < 0 ? s = 0 : s > 1 && (s = 1);
    const a = t.totalTime * s;
    this.set({
      currentTime: a
    }), n.play(a), r || n.pause();
  }

};

function ondestroy() {
  const {
    isPlaying: e
  } = this.get();
  e && this.pause();
}

function onupdate({
  changed: e,
  current: t,
  previous: n
}) {
  if (t.replayer && !n) {
    if (window.replayer = t.replayer, setTimeout(() => {
      this.set({
        isPlaying: !0
      });
    }, 0), t.replayer.play(0), !t.autoPlay) {
      let e = !1;
      t.replayer.on("fullsnapshot-rebuilded", () => {
        e || (e = !0, t.replayer.pause());
      });
    }

    t.replayer.on("pause", () => {
      this.set({
        isPlaying: !1
      });
    }), t.replayer.on("resume", () => {
      this.set({
        isPlaying: !0
      });
    }), t.replayer.on("finish", () => {
      this.timer = null, this.set({
        isPlaying: !1,
        currentTime: 0
      });
    }), t.replayer.on("skip-start", e => {
      e.isSkipping = !0, this.set(e);
    }), t.replayer.on("skip-end", e => {
      e.isSkipping = !1, this.set(e);
    });
  }

  e.isPlaying && t.isPlaying && !this.timer && this.loopTimer(), e.skipInactive && t.replayer.setConfig({
    skipInactive: t.skipInactive
  });
}

function click_handler(e) {
  const {
    component: t,
    ctx: n
  } = this._svelte;
  t.setSpeed(n.s);
}

function get_each_context(e, t, n) {
  const r = Object.create(e);
  return r.s = t[n], r;
}

function create_main_fragment$1(e, t) {
  var n,
      r,
      i = t.showController && create_if_block(e, t);
  return {
    c() {
      i && i.c(), n = createComment();
    },

    m(e, t) {
      i && i.m(e, t), insert(e, n, t), r = !0;
    },

    p(t, r) {
      r.showController ? (i ? i.p(t, r) : (i = create_if_block(e, r)) && i.c(), i.i(n.parentNode, n)) : i && i.o(function () {
        i.d(1), i = null;
      });
    },

    i(e, t) {
      r || this.m(e, t);
    },

    o(e) {
      r && (i ? i.o(e) : e(), r = !1);
    },

    d(e) {
      i && i.d(e), e && detachNode(n);
    }

  };
}

function create_if_block(e, t) {
  var n,
      r,
      i,
      o,
      s,
      a,
      l,
      c,
      d,
      u,
      p,
      h,
      f,
      m,
      g,
      y,
      v,
      b,
      _,
      w,
      S = formatTime(t.currentTime),
      E = formatTime(t.meta.totalTime),
      T = {};

  function x(t) {
    e.handleProgressClick(t);
  }

  function M(e) {
    return e.isPlaying ? create_if_block_1 : create_else_block;
  }

  var k = M(t),
      N = k(e, t);

  function I(t) {
    e.toggle();
  }

  for (var C = [1, 2, 4, 8], L = [], D = 0; D < C.length; D += 1) L[D] = create_each_block(e, get_each_context(t, C, D));

  var A = {
    id: "skip",
    disabled: t.isSkipping,
    label: "skip inactive"
  };
  void 0 !== t.skipInactive && (A.checked = t.skipInactive, T.checked = !0);
  var R = new Switch({
    root: e.root,
    store: e.store,
    data: A,

    _bind(t, n) {
      var r = {};
      !T.checked && t.checked && (r.skipInactive = n.checked), e._set(r), T = {};
    }

  });

  function F(t) {
    e.fire("fullscreen");
  }

  return e.root._beforecreate.push(() => {
    R._bind({
      checked: 1
    }, R.get());
  }), {
    c() {
      n = createElement("div"), r = createElement("div"), i = createElement("span"), o = createText(S), s = createText("\n    "), a = createElement("div"), l = createElement("div"), c = createText("\n      "), d = createElement("div"), u = createText("\n    "), p = createElement("span"), h = createText(E), f = createText("\n  "), m = createElement("div"), g = createElement("button"), N.c(), y = createText("\n    ");

      for (var e = 0; e < L.length; e += 1) L[e].c();

      v = createText("\n    "), R._fragment.c(), b = createText("\n    "), (_ = createElement("button")).innerHTML = '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M916 380c-26.4 0-48-21.6-48-48L868 223.2 613.6 477.6c-18.4 18.4-48.8 18.4-68 0-18.4-18.4-18.4-48.8 0-68L800 156 692 156c-26.4 0-48-21.6-48-48 0-26.4 21.6-48 48-48l224 0c26.4 0 48 21.6 48 48l0 224C964 358.4 942.4 380 916 380zM231.2 860l108.8 0c26.4 0 48 21.6 48 48s-21.6 48-48 48l-224 0c-26.4 0-48-21.6-48-48l0-224c0-26.4 21.6-48 48-48 26.4 0 48 21.6 48 48L164 792l253.6-253.6c18.4-18.4 48.8-18.4 68 0 18.4 18.4 18.4 48.8 0 68L231.2 860z" p-id="1286"></path></svg>', i.className = "rr-timeline__time svelte-1cgfpn0", l.className = "rr-progress__step svelte-1cgfpn0", setStyle(l, "width", t.percentage), d.className = "rr-progress__handler svelte-1cgfpn0", setStyle(d, "left", t.percentage), addListener(a, "click", x), a.className = "rr-progress svelte-1cgfpn0", toggleClass(a, "disabled", t.isSkipping), p.className = "rr-timeline__time svelte-1cgfpn0", r.className = "rr-timeline svelte-1cgfpn0", addListener(g, "click", I), g.className = "svelte-1cgfpn0", addListener(_, "click", F), _.className = "svelte-1cgfpn0", m.className = "rr-controller__btns svelte-1cgfpn0", n.className = "rr-controller svelte-1cgfpn0";
    },

    m(t, S) {
      insert(t, n, S), append(n, r), append(r, i), append(i, o), append(r, s), append(r, a), append(a, l), e.refs.step = l, append(a, c), append(a, d), e.refs.handler = d, e.refs.progress = a, append(r, u), append(r, p), append(p, h), append(n, f), append(n, m), append(m, g), N.m(g, null), append(m, y);

      for (var E = 0; E < L.length; E += 1) L[E].m(m, null);

      append(m, v), R._mount(m, null), append(m, b), append(m, _), w = !0;
    },

    p(n, r) {
      if (t = r, w && !n.currentTime || S === (S = formatTime(t.currentTime)) || setData(o, S), w && !n.percentage || (setStyle(l, "width", t.percentage), setStyle(d, "left", t.percentage)), n.isSkipping && toggleClass(a, "disabled", t.isSkipping), w && !n.meta || E === (E = formatTime(t.meta.totalTime)) || setData(h, E), k !== (k = M(t)) && (N.d(1), (N = k(e, t)).c(), N.m(g, null)), n.isSkipping || n.speed) {
        C = [1, 2, 4, 8];

        for (var i = 0; i < C.length; i += 1) {
          const r = get_each_context(t, C, i);
          L[i] ? L[i].p(n, r) : (L[i] = create_each_block(e, r), L[i].c(), L[i].m(m, v));
        }

        for (; i < L.length; i += 1) L[i].d(1);

        L.length = C.length;
      }

      var s = {};
      n.isSkipping && (s.disabled = t.isSkipping), !T.checked && n.skipInactive && (s.checked = t.skipInactive, T.checked = void 0 !== t.skipInactive), R._set(s), T = {};
    },

    i(e, t) {
      w || this.m(e, t);
    },

    o(e) {
      w && (R && R._fragment.o(e), w = !1);
    },

    d(t) {
      t && detachNode(n), e.refs.step === l && (e.refs.step = null), e.refs.handler === d && (e.refs.handler = null), removeListener(a, "click", x), e.refs.progress === a && (e.refs.progress = null), N.d(), removeListener(g, "click", I), destroyEach(L, t), R.destroy(), removeListener(_, "click", F);
    }

  };
}

function create_else_block(e, t) {
  var n, r;
  return {
    c() {
      n = createSvgElement("svg"), setAttribute(r = createSvgElement("path"), "d", "M170.65984 896l0-768 640 384zM644.66944 512l-388.66944-233.32864 0 466.65728z"), setAttribute(n, "class", "icon"), setAttribute(n, "viewBox", "0 0 1024 1024"), setAttribute(n, "version", "1.1"), setAttribute(n, "xmlns", "http://www.w3.org/2000/svg"), setAttribute(n, "xmlns:xlink", "http://www.w3.org/1999/xlink"), setAttribute(n, "width", "16"), setAttribute(n, "height", "16");
    },

    m(e, t) {
      insert(e, n, t), append(n, r);
    },

    d(e) {
      e && detachNode(n);
    }

  };
}

function create_if_block_1(e, t) {
  var n, r;
  return {
    c() {
      n = createSvgElement("svg"), setAttribute(r = createSvgElement("path"), "d", "M682.65984 128q53.00224 0 90.50112 37.49888t37.49888 90.50112l0 512q0 53.00224-37.49888 90.50112t-90.50112 37.49888-90.50112-37.49888-37.49888-90.50112l0-512q0-53.00224 37.49888-90.50112t90.50112-37.49888zM341.34016 128q53.00224 0 90.50112 37.49888t37.49888 90.50112l0 512q0 53.00224-37.49888 90.50112t-90.50112 37.49888-90.50112-37.49888-37.49888-90.50112l0-512q0-53.00224 37.49888-90.50112t90.50112-37.49888zM341.34016 213.34016q-17.67424 0-30.16704 12.4928t-12.4928 30.16704l0 512q0 17.67424 12.4928 30.16704t30.16704 12.4928 30.16704-12.4928 12.4928-30.16704l0-512q0-17.67424-12.4928-30.16704t-30.16704-12.4928zM682.65984 213.34016q-17.67424 0-30.16704 12.4928t-12.4928 30.16704l0 512q0 17.67424 12.4928 30.16704t30.16704 12.4928 30.16704-12.4928 12.4928-30.16704l0-512q0-17.67424-12.4928-30.16704t-30.16704-12.4928z"), setAttribute(n, "class", "icon"), setAttribute(n, "viewBox", "0 0 1024 1024"), setAttribute(n, "version", "1.1"), setAttribute(n, "xmlns", "http://www.w3.org/2000/svg"), setAttribute(n, "xmlns:xlink", "http://www.w3.org/1999/xlink"), setAttribute(n, "width", "16"), setAttribute(n, "height", "16");
    },

    m(e, t) {
      insert(e, n, t), append(n, r);
    },

    d(e) {
      e && detachNode(n);
    }

  };
}

function create_each_block(e, t) {
  var n, r, i;
  return {
    c() {
      n = createElement("button"), r = createText(t.s), i = createText("x"), n._svelte = {
        component: e,
        ctx: t
      }, addListener(n, "click", click_handler), n.disabled = t.isSkipping, n.className = "svelte-1cgfpn0", toggleClass(n, "active", t.s === t.speed && !t.isSkipping);
    },

    m(e, t) {
      insert(e, n, t), append(n, r), append(n, i);
    },

    p(e, r) {
      t = r, n._svelte.ctx = t, e.isSkipping && (n.disabled = t.isSkipping), (e.speed || e.isSkipping) && toggleClass(n, "active", t.s === t.speed && !t.isSkipping);
    },

    d(e) {
      e && detachNode(n), removeListener(n, "click", click_handler);
    }

  };
}

function Controller(e) {
  init(this, e), this.refs = {}, this._state = assign(data(), e.data), this._recompute({
    replayer: 1,
    currentTime: 1,
    meta: 1
  }, this._state), this._intro = !!e.intro, this._handlers.update = [onupdate], this._handlers.destroy = [ondestroy], this._fragment = create_main_fragment$1(this, this._state), this.root._oncreate.push(() => {
    this.fire("update", {
      changed: assignTrue({}, this._state),
      current: this._state
    });
  }), e.target && (this._fragment.c(), this._mount(e.target, e.anchor), flush(this)), this._intro = !0;
}

assign(Controller.prototype, proto), assign(Controller.prototype, methods), Controller.prototype._recompute = function (e, t) {
  e.replayer && this._differs(t.meta, t.meta = meta(t)) && (e.meta = !0), (e.currentTime || e.meta) && this._differs(t.percentage, t.percentage = percentage(t)) && (e.percentage = !0);
};
const controllerHeight = 80;

function style({
  width: e,
  height: t
}) {
  return inlineCss({
    width: `${e}px`,
    height: `${t}px`
  });
}

function playerStyle({
  width: e,
  height: t
}) {
  return inlineCss({
    width: `${e}px`,
    height: `${t + controllerHeight}px`
  });
}

function data$1() {
  return {
    showController: !0,
    width: 1024,
    height: 576,
    events: [],
    autoPlay: !0,
    replayer: null
  };
}

var methods$1 = {
  updateScale(e, t) {
    const {
      width: n,
      height: r
    } = this.get(),
          i = n / t.width,
          o = r / t.height;
    e.style.transform = `scale(${Math.min(i, o, 1)})` + "translate(-50%, -50%)";
  },

  fullscreen() {
    this.refs.player && (isFullscreen() ? exitFullscreen() : openFullscreen(this.refs.player));
  },

  addEventListener(e, t) {
    const {
      replayer: n
    } = this.get();
    n.on(e, t);
  },

  addEvent(e) {
    replayer.addEvent(e);
  }

};

function oncreate() {
  const {
    events: e
  } = this.get(),
        t = new Replayer(e, {
    speed: 1,
    root: this.refs.frame,
    skipInactive: !0,
    showWarning: !0
  });
  t.on("resize", e => this.updateScale(t.wrapper, e)), this.set({
    replayer: t
  }), this.fullscreenListener = onFullscreenChange(() => {
    isFullscreen() ? setTimeout(() => {
      const {
        width: e,
        height: n
      } = this.get();
      this._width = e, this._height = n;
      const r = {
        width: document.body.offsetWidth,
        height: document.body.offsetHeight - controllerHeight
      };
      this.set(r), this.updateScale(t.wrapper, {
        width: t.iframe.offsetWidth,
        height: t.iframe.offsetHeight
      });
    }, 0) : (this.set({
      width: this._width,
      height: this._height
    }), this.updateScale(t.wrapper, {
      width: t.iframe.offsetWidth,
      height: t.iframe.offsetHeight
    }));
  });
}

function ondestroy$1() {
  this.fullscreenListener && this.fullscreenListener();
}

function create_main_fragment$2(e, t) {
  var n,
      r,
      i,
      o,
      s = t.replayer && create_if_block$1(e, t);
  return {
    c() {
      n = createElement("div"), r = createElement("div"), i = createText("\n  "), s && s.c(), r.className = "rr-player__frame svelte-1wetjm2", r.style.cssText = t.style, n.className = "rr-player svelte-1wetjm2", n.style.cssText = t.playerStyle;
    },

    m(t, a) {
      insert(t, n, a), append(n, r), e.refs.frame = r, append(n, i), s && s.m(n, null), e.refs.player = n, o = !0;
    },

    p(t, i) {
      o && !t.style || (r.style.cssText = i.style), i.replayer ? (s ? s.p(t, i) : (s = create_if_block$1(e, i)) && s.c(), s.i(n, null)) : s && s.o(function () {
        s.d(1), s = null;
      }), o && !t.playerStyle || (n.style.cssText = i.playerStyle);
    },

    i(e, t) {
      o || this.m(e, t);
    },

    o(e) {
      o && (s ? s.o(e) : e(), o = !1);
    },

    d(t) {
      t && detachNode(n), e.refs.frame === r && (e.refs.frame = null), s && s.d(), e.refs.player === n && (e.refs.player = null);
    }

  };
}

function create_if_block$1(e, t) {
  var n,
      r = {
    replayer: t.replayer,
    showController: t.showController,
    autoPlay: t.autoPlay
  },
      i = new Controller({
    root: e.root,
    store: e.store,
    data: r
  });
  return i.on("fullscreen", function (t) {
    e.fullscreen();
  }), {
    c() {
      i._fragment.c();
    },

    m(e, t) {
      i._mount(e, t), n = !0;
    },

    p(e, t) {
      var n = {};
      e.replayer && (n.replayer = t.replayer), e.showController && (n.showController = t.showController), e.autoPlay && (n.autoPlay = t.autoPlay), i._set(n);
    },

    i(e, t) {
      n || this.m(e, t);
    },

    o(e) {
      n && (i && i._fragment.o(e), n = !1);
    },

    d(e) {
      i.destroy(e);
    }

  };
}

function Player(e) {
  init(this, e), this.refs = {}, this._state = assign(data$1(), e.data), this._recompute({
    width: 1,
    height: 1
  }, this._state), this._intro = !!e.intro, this._handlers.destroy = [ondestroy$1], this._fragment = create_main_fragment$2(this, this._state), this.root._oncreate.push(() => {
    oncreate.call(this), this.fire("update", {
      changed: assignTrue({}, this._state),
      current: this._state
    });
  }), e.target && (this._fragment.c(), this._mount(e.target, e.anchor), flush(this)), this._intro = !0;
}

assign(Player.prototype, proto), assign(Player.prototype, methods$1), Player.prototype._recompute = function (e, t) {
  (e.width || e.height) && (this._differs(t.style, t.style = style(t)) && (e.style = !0), this._differs(t.playerStyle, t.playerStyle = playerStyle(t)) && (e.playerStyle = !0));
};
var _default = Player;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var rrweb = _interopRequireWildcard(require("rrweb"));

var _rrwebPlayer = _interopRequireDefault(require("rrweb-player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var obj = new Proxy({}, {
  get: function get(target, key, receiver) {
    console.log("getting ".concat(key, "!"));
    return Reflect.get(target, key, receiver);
  },
  set: function set(target, key, value, receiver) {
    console.log("setting ".concat(key, "!"));
    return Reflect.set(target, key, value, receiver);
  }
});
window.obj = obj;
var events = [];
rrweb.record({
  emit: function emit(event) {
    // 将 event 存入 events 数组中
    events.push(event);
  }
});
document.querySelector("#replay").addEventListener("click", function () {
  console.log(events);
  new _rrwebPlayer.default({
    target: document.querySelector("#app"),
    data: {
      events: events,
      width: 800,
      height: 500
    }
  });
});
},{"rrweb":"../../node_modules/rrweb/es/rrweb.js","rrweb-player":"../../node_modules/rrweb-player/dist/index.mjs"}],"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51989" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/proxy.e31bb0bc.map