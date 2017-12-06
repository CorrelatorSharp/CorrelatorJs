(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (globals) {

    var crypto = globals.crypto || globals.msCrypto;

    /* Regex for checking is string is UUID or empty GUID
    /*****************************************************/

    var UUID_REGEX = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}|[0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{12}/;

    globals.isUuid = function isUuid(suspectString) {
        return suspectString.match(UUID_REGEX);
    };

    /* Generate a new uuid string using browser crypto or time.
    /*****************************************************/

    function rngCrypto() {
        return crypto.getRandomValues(new Uint32Array(1))[0];
    }

    function rngTime(i) {
        return Math.random() * 0x100000000 >>> ((i || new Date().getTicks() & 0x03) << 3) & 0xff;
    }

    var rng = crypto && crypto.getRandomValues && Uint8Array ? rngCrypto : rngTime;

    globals.randomNumberGenerator = rng;

    function randomNumberGeneratorInRange(min, max) {
        // should be number between 0 and 4,294,967,295...
        var number = rng();

        // make a percentage.
        var asPercent = 100 / 0xFFFFFFFF * number / 100;

        // redistribute the number across the new boundry
        return Math.floor(asPercent * (max - min + 1)) + min;
    }

    globals.randomNumberGeneratorInRange = randomNumberGeneratorInRange;

    function randomNumberGeneratorInSequence(last, minJump, maxJump) {
        return randomNumberGeneratorInRange(last + minJump, last + maxJump);
    }

    globals.randomNumberGeneratorInSequence = randomNumberGeneratorInSequence;

    /* Uuid object wrapper for validation and 'security'.
    /*****************************************************/

    function generateNewId() {
        var i = 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = rng(i++) % 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }

    var Uuid = (function () {
        _createClass(Uuid, null, [{
            key: 'EMPTY',
            get: function get() {
                return new Uuid('00000000-0000-0000-0000-000000000000');
            }
        }]);

        function Uuid(seed) {
            _classCallCheck(this, Uuid);

            if (seed && !isUuid(seed.toString())) {
                throw new Error('seed value for uuid must be valid uuid.');
            }

            this.innervalue = (seed || generateNewId()).toString();
            this.innertime = new Date();
        }

        _createClass(Uuid, [{
            key: 'toString',
            value: function toString() {
                return this.value;
            }
        }, {
            key: 'value',
            get: function get() {
                return this.innervalue;
            }
        }, {
            key: 'time',
            get: function get() {
                return this.innertime;
            }
        }]);

        return Uuid;
    })();

    globals.Uuid = Uuid;

    globals.UuidCrypto = (globals.module || {}).exports = { Uuid: Uuid, randomNumberGenerator: rng, isUuid: isUuid };
})(window || global);
var window, global;

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (globals) {

    var uuid = globals.UuidCrypto.Uuid;
    var CorrelatorJs = CorrelatorJs || {};

    /* Static module memebers.
    /*********************************************************/

    var statics = {
        CORRELATION_ID_HEADER: 'X-Correlation-Id',
        CORRELATION_ID_STARTED_HEADER: 'X-Correlation-Started',
        CORRELATION_ID_NAME_HEADER: 'X-Correlation-Name',
        CORRELATION_ID_PARENT_HEADER: 'X-Correlation-Parent'
    };

    CorrelatorJs.Statics = statics;

    /* ActivityScope - Core of the library.
    /*********************************************************/

    // let activityScopeSingleton = null;

    function peek(stack) {
        if (stack.length < 1) {
            return null;
        }

        return stack[stack.length - 1];
    }

    var ActivityTracker = (function () {
        function ActivityTracker() {
            _classCallCheck(this, ActivityTracker);

            this.activityStack = [];
        }

        _createClass(ActivityTracker, [{
            key: 'start',
            value: function start(newActivityScope) {
                if (newActivityScope === null) {
                    return;
                }
                this.activityStack.push(newActivityScope);
            }
        }, {
            key: 'end',
            value: function end(oldActivityScope) {
                while (this.activityStack.pop() != oldActivityScope) {}
            }
        }, {
            key: 'find',
            value: function find(id) {
                return this.activityStack.filter(function (e) {
                    return e.id === id;
                }).pop();
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.activityStack = [];
            }
        }, {
            key: 'current',
            get: function get() {
                return peek(this.activityStack);
            }
        }]);

        return ActivityTracker;
    })();

    var activityTracker = new ActivityTracker();

    function activityScopeFactory(name, seed) {
        return new ActivityScope(name, activityTracker.current, new uuid(seed));
    }

    var ActivityScope = (function () {

        /* Instance class memebers.
        /*********************************************************/

        function ActivityScope(name, parent, seed) {
            _classCallCheck(this, ActivityScope);

            if (parent && !(parent instanceof ActivityScope)) {
                throw new Error('parent must be an activity scope.');
            }

            if (seed && !(seed instanceof uuid)) {
                throw new Error('seed must be a valid UUID.');
            }

            this.innerid = seed || new uuid();
            this.innername = name;
            this.innerparent = parent || null;

            activityTracker.start(this);
        }

        _createClass(ActivityScope, [{
            key: 'id',
            get: function get() {
                return this.innerid;
            }
        }, {
            key: 'parent',
            get: function get() {
                return this.innerparent;
            }
        }, {
            key: 'name',
            get: function get() {
                return this.innername;
            }

            /* Static class memebers.
            /*********************************************************/

            // Access memebers

        }], [{
            key: 'create',

            // Creation members.

            value: function create(name, seed) {
                activityTracker.clear();
                return activityScopeFactory(name, seed);
            }
        }, {
            key: 'child',
            value: function child(name, seed) {
                return activityScopeFactory(name, seed);
            }
        }, {
            key: 'new',
            value: function _new(name, seed) {
                activityTracker.end(this.current);
                return activityScopeFactory(name, seed);
            }
        }, {
            key: 'clear',
            value: function clear() {
                activityTracker.clear();
            }
        }, {
            key: 'current',
            get: function get() {
                return activityTracker.current;
            },
            set: function set(value) {
                if (value && !(value instanceof ActivityScope)) throw new Error("Can't set value of activity scope to be anything but activity scope type.");

                activityTracker.start(value);
            }
        }]);

        return ActivityScope;
    })();

    CorrelatorJs.ActivityScope = ActivityScope;

    /* Global module.
    /*********************************************************/

    globals.CorrelatorJs = (globals.module || {}).exports = CorrelatorJs;
})(window || global);
var window, global;

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

