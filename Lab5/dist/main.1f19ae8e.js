// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next mehtod, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"Lab5Mock.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomUserMock = exports.favoriteTeachers = exports.additionalUsers = void 0;
var _ref;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var randomUserMock = [{
  "gender": "male",
  "title": "Mr",
  "full_name": "Norbert Weishaupt",
  "city": "Rhön-Grabfeld",
  "state": "Mecklenburg-Vorpommern",
  "country": "Germany",
  "postcode": 52640,
  "coordinates": {
    "latitude": "-42.1817",
    "longitude": "-152.1685"
  },
  "timezone": {
    "offset": "+9:30",
    "description": "Adelaide, Darwin"
  },
  "email": "norbert.weishaupt@example.com",
  "b_date": "1956-12-23T19:09:19.602Z",
  "age": 65,
  "phone": "0079-8291509",
  "picture_large": "https://randomuser.me/api/portraits/men/28.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/28.jpg",
  "id": "FVS1379329T",
  "favorite": "Robert Schuman",
  "course": "English",
  "bg_color": "#83AB42",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Claude Payne",
  "city": "Skerries",
  "state": "Longford",
  "country": "Ireland",
  "postcode": 64451,
  "coordinates": {
    "latitude": "-81.9272",
    "longitude": "179.5544"
  },
  "timezone": {
    "offset": "-12:00",
    "description": "Eniwetok, Kwajalein"
  },
  "email": "claude.payne@example.com",
  "b_date": "1966-07-31T21:57:32.876Z",
  "age": 55,
  "phone": "071-558-2972",
  "picture_large": "https://randomuser.me/api/portraits/men/40.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/40.jpg",
  "id": "PPS2340626T",
  "favorite": "Cghtgs Fgdvgd",
  "course": "Chemistry",
  "bg_color": "#6D7E52",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Darren Wood",
  "city": "Surrey",
  "state": "Alabama",
  "country": "United States",
  "postcode": 52941,
  "coordinates": {
    "latitude": "79.5827",
    "longitude": "164.6189"
  },
  "timezone": {
    "offset": "-9:00",
    "description": "Alaska"
  },
  "email": "darren.wood@example.com",
  "b_date": "1974-11-15T10:40:20.306Z",
  "age": 47,
  "phone": "(720)-981-1014",
  "picture_large": "https://randomuser.me/api/portraits/men/68.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/68.jpg",
  "id": "SSN769-88-9330",
  "favorite": "Tfgdgdb Tfcvad",
  "course": "Chemistry",
  "bg_color": "#86CF1D",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Elias Tikkanen",
  "city": "Nousiainen",
  "state": "Ostrobothnia",
  "country": "Finland",
  "postcode": 67794,
  "coordinates": {
    "latitude": "1.4218",
    "longitude": "-169.0904"
  },
  "timezone": {
    "offset": "+5:30",
    "description": "Bombay, Calcutta, Madras, New Delhi"
  },
  "email": "elias.tikkanen@example.com",
  "b_date": "1985-09-28T12:59:41.244Z",
  "age": 36,
  "phone": "04-531-159",
  "picture_large": "https://randomuser.me/api/portraits/men/34.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/34.jpg",
  "id": "HETUNaNNA013undefined",
  "favorite": "Gggtrerhg Cdfwqq",
  "course": "Dancing",
  "bg_color": "#951CAD",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Ms",
  "full_name": "Tessa Möllmann",
  "city": "Hohenstein-Ernstthal",
  "state": "Bayern",
  "country": "Germany",
  "postcode": 87827,
  "coordinates": {
    "latitude": "61.8456",
    "longitude": "67.6500"
  },
  "timezone": {
    "offset": "+4:30",
    "description": "Kabul"
  },
  "email": "tessa.mollmann@example.com",
  "b_date": "1986-05-08T09:19:12.021Z",
  "age": 35,
  "phone": "0358-7950096",
  "picture_large": "https://randomuser.me/api/portraits/women/8.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/8.jpg",
  "id": "HETUNaNfrhbfgdcvzxned",
  "favorite": "Bgtrhrtrht Gryhr",
  "course": "Chess",
  "bg_color": "#0D020F",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "Maxine James",
  "city": "Brisbane",
  "state": "Northern Territory",
  "country": "Australia",
  "postcode": 797,
  "coordinates": {
    "latitude": "-41.1464",
    "longitude": "142.0238"
  },
  "timezone": {
    "offset": "+5:00",
    "description": "Ekaterinburg, Islamabad, Karachi, Tashkent"
  },
  "email": "maxine.james@example.com",
  "b_date": "1974-08-10T01:12:04.592Z",
  "age": 47,
  "phone": "02-7976-3904",
  "picture_large": "https://randomuser.me/api/portraits/women/94.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/94.jpg",
  "id": "TFN386597027",
  "favorite": "Bththt Kgdgdgd",
  "course": "Biology",
  "bg_color": "#0D025F",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "Mestan Pektemek",
  "city": "İstanbul",
  "state": "Karaman",
  "country": "Turkey",
  "postcode": 81972,
  "coordinates": {
    "latitude": "16.6664",
    "longitude": "-0.4745"
  },
  "timezone": {
    "offset": "+8:00",
    "description": "Beijing, Perth, Singapore, Hong Kong"
  },
  "email": "mestan.pektemek@example.com",
  "b_date": "1975-08-20T23:05:13.239Z",
  "age": 46,
  "phone": "(038)-418-1407",
  "picture_large": "https://randomuser.me/api/portraits/women/71.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/71.jpg",
  "id": "TFN3864437027",
  "favorite": "Gtrtbhrfb Bvzxcsf",
  "course": "Dance",
  "bg_color": "#C949E0",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Monsieur",
  "full_name": "Viktor Legrand",
  "city": "Gy",
  "state": "Solothurn",
  "country": "Switzerland",
  "postcode": 4919,
  "coordinates": {
    "latitude": "-73.3324",
    "longitude": "-63.8552"
  },
  "timezone": {
    "offset": "+7:00",
    "description": "Bangkok, Hanoi, Jakarta"
  },
  "email": "viktor.legrand@example.com",
  "b_date": "1994-07-04T12:08:05.427Z",
  "age": 27,
  "phone": "077 863 38 70",
  "picture_large": "https://randomuser.me/api/portraits/men/51.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/51.jpg",
  "id": "AVS756.2023.5649.57",
  "favorite": "Vgegr Eqeda",
  "course": "Dance",
  "bg_color": "#BBE12D",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Deniz Yıldırım",
  "city": "Bolu",
  "state": "Ardahan",
  "country": "Turkey",
  "postcode": 12234,
  "coordinates": {
    "latitude": "-42.0389",
    "longitude": "-86.4817"
  },
  "timezone": {
    "offset": "+6:00",
    "description": "Almaty, Dhaka, Colombo"
  },
  "email": "deniz.yildirim@example.com",
  "b_date": "1981-12-12T17:49:30.416Z",
  "age": 40,
  "phone": "(602)-541-0650",
  "picture_large": "https://randomuser.me/api/portraits/men/99.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/99.jpg",
  "id": "GHT56474747643",
  "favorite": "Bfsvss Dqwdweff",
  "course": "Physics",
  "bg_color": "#20CD96",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Ms",
  "full_name": "Matilda Aalto",
  "city": "Tornio",
  "state": "Central Ostrobothnia",
  "country": "Finland",
  "postcode": 88244,
  "coordinates": {
    "latitude": "79.9136",
    "longitude": "83.6836"
  },
  "timezone": {
    "offset": "+6:00",
    "description": "Almaty, Dhaka, Colombo"
  },
  "email": "matilda.aalto@example.com",
  "b_date": "1995-09-12T20:08:25.350Z",
  "age": 26,
  "phone": "06-843-874",
  "picture_large": "https://randomuser.me/api/portraits/women/80.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/80.jpg",
  "id": "HETUNaNNA760undefined",
  "favorite": "Tfsdgdg Kfsvvs",
  "course": "Law",
  "bg_color": "#DB771E",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "Lucy Walke",
  "city": "Nelson",
  "state": "Southland",
  "country": "New Zealand",
  "postcode": 82655,
  "coordinates": {
    "latitude": "-27.4724",
    "longitude": "132.5136"
  },
  "timezone": {
    "offset": "+4:30",
    "description": "Kabul"
  },
  "email": "lucy.walker@example.com",
  "b_date": "1967-07-08T22:51:02.434Z",
  "age": 54,
  "phone": "(018)-588-0617",
  "picture_large": "https://randomuser.me/api/portraits/women/6.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/6.jpg",
  "id": "HETUNaNNAffhhffdhme760undefined",
  "favorite": "Ggtrghr Vvcsvssd",
  "course": "Biology",
  "bg_color": "#EE4A74",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Antonio Gil",
  "city": "Cuenca",
  "state": "Castilla la Mancha",
  "country": "Spain",
  "postcode": 91659,
  "coordinates": {
    "latitude": "-71.7038",
    "longitude": "-10.4243"
  },
  "timezone": {
    "offset": "+2:00",
    "description": "Kaliningrad, South Africa"
  },
  "email": "antonio.gil@example.com",
  "b_date": "1974-05-10T02:24:28.197Z",
  "age": 47,
  "phone": "921-757-670",
  "picture_large": "https://randomuser.me/api/portraits/men/14.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/14.jpg",
  "id": "DNI63719733-L",
  "favorite": "Hgdddfgd Trsfafa",
  "course": "Art",
  "bg_color": "#9AA931",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "August Bertheussen",
  "city": "Arendal",
  "state": "Nord-Trøndelag",
  "country": "Norway",
  "postcode": "8518",
  "coordinates": {
    "latitude": "25.1087",
    "longitude": "-0.6986"
  },
  "timezone": {
    "offset": "+11:00",
    "description": "Magadan, Solomon Islands, New Caledonia"
  },
  "email": "august.bertheussen@example.com",
  "b_date": "1956-04-28T08:50:01.255Z",
  "age": 65,
  "phone": "36513745",
  "picture_large": "https://randomuser.me/api/portraits/men/87.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/87.jpg",
  "id": "FN28045612378",
  "favorite": "Gfsvddg Trwrwwr",
  "course": "Biology",
  "bg_color": "#D8A73C",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "Lana Ottesen",
  "city": "Sand",
  "state": "Description",
  "country": "Norway",
  "postcode": "0576",
  "coordinates": {
    "latitude": "4.9713",
    "longitude": "-14.3459"
  },
  "timezone": {
    "offset": "-10:00",
    "description": "Hawaii"
  },
  "email": "lana.ottesen@example.com",
  "b_date": "1952-03-09T08:28:33.451Z",
  "age": 69,
  "phone": "76565355",
  "picture_large": "https://randomuser.me/api/portraits/women/87.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/87.jpg",
  "id": "FN09035238279",
  "favorite": "Hgdgd Kgdgdg",
  "course": "Art",
  "bg_color": "#E8B954",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "Adeline Weigand",
  "city": "Fürth",
  "state": "Mecklenburg-Vorpommern",
  "country": "Germany",
  "postcode": 80819,
  "coordinates": {
    "latitude": "-41.5020",
    "longitude": "-36.1579"
  },
  "timezone": {
    "offset": "+1:00",
    "description": "Brussels, Copenhagen, Madrid, Paris"
  },
  "email": "adeline.weigand@example.com",
  "b_date": "1971-06-08T09:57:13.975Z",
  "age": 50,
  "phone": "0596-1926541",
  "picture_large": "https://randomuser.me/api/portraits/women/43.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/43.jpg",
  "id": "FN090352389776279",
  "favorite": "Fgdgdg Hfsvxvxv",
  "course": "Physics",
  "bg_color": "#825F13",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "Oona Kokko",
  "city": "Iisalmi",
  "state": "Central Ostrobothnia",
  "country": "Finland",
  "postcode": 71206,
  "coordinates": {
    "latitude": "28.3369",
    "longitude": "-173.9575"
  },
  "timezone": {
    "offset": "+1:00",
    "description": "Brussels, Copenhagen, Madrid, Paris"
  },
  "email": "oona.kokko@example.com",
  "b_date": "1959-03-24T21:00:30.775Z",
  "age": 62,
  "phone": "07-130-008",
  "picture_large": "https://randomuser.me/api/portraits/women/93.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/93.jpg",
  "id": "HETUNaNNA402undefined",
  "favorite": "Ghyhrh Nvddvdvd",
  "course": "Biology",
  "bg_color": "#D2CDC2",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "city": "Kongsvinger",
  "state": "Sjælland",
  "country": "Denmark",
  "postcode": 65053,
  "coordinates": {
    "latitude": "60.3062",
    "longitude": "138.5907"
  },
  "timezone": {
    "offset": "-3:00",
    "description": "Brazil, Buenos Aires, Georgetown"
  },
  "email": "emil.madsen@example.com",
  "b_date": "1993-12-30T02:54:32.845Z",
  "age": 28,
  "phone": "33373580",
  "picture_large": "https://randomuser.me/api/portraits/men/40.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/40.jpg",
  "id": "CPR301293-2636",
  "favorite": "Klggdb Rqeczc",
  "course": "Math",
  "bg_color": "#9AD21A",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Mario Saez",
  "city": "Gandía",
  "state": "Cataluña",
  "country": "Spain",
  "postcode": 49123,
  "coordinates": {
    "latitude": "-46.9749",
    "longitude": "-126.6882"
  },
  "timezone": {
    "offset": "-4:00",
    "description": "Atlantic Time (Canada), Caracas, La Paz"
  },
  "email": "mario.saez@example.com",
  "b_date": "1985-11-01T17:08:44.642Z",
  "age": 36,
  "phone": "907-066-616",
  "picture_large": "https://randomuser.me/api/portraits/men/53.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/53.jpg",
  "id": "DNI04671126-X",
  "favorite": "Tghfhbf Vvcsfs",
  "course": "Computer Science",
  "bg_color": "#34C107",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "آدرینا صدر",
  "city": "ارومیه",
  "state": "کرمان",
  "country": "Iran",
  "postcode": 48391,
  "coordinates": {
    "latitude": "-5.2616",
    "longitude": "-95.9339"
  },
  "timezone": {
    "offset": "-7:00",
    "description": "Mountain Time (US & Canada)"
  },
  "email": "adryn.sdr@example.com",
  "b_date": "1977-01-03T08:07:23.555Z",
  "age": 44,
  "phone": "008-22619690",
  "picture_large": "https://randomuser.me/api/portraits/women/49.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/49.jpg",
  "id": "DNI04534646536-X",
  "favorite": "Ffeggege Ccsvvv",
  "course": "Computer Science",
  "bg_color": "#C2C724",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Joe Mitchell",
  "city": "Norwalk",
  "state": "New Jersey",
  "country": "United States",
  "postcode": 83924,
  "coordinates": {
    "latitude": "45.4790",
    "longitude": "143.8132"
  },
  "timezone": {
    "offset": "+10:00",
    "description": "Eastern Australia, Guam, Vladivostok"
  },
  "email": "joe.mitchell@example.com",
  "b_date": "1948-07-07T06:09:20.491Z",
  "age": 73,
  "phone": "(210)-514-4881",
  "picture_large": "https://randomuser.me/api/portraits/men/78.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/78.jpg",
  "id": "SSN273-52-2514",
  "favorite": "Jkkde Opvsxv",
  "course": "Statistics",
  "bg_color": "#E8E9BA",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "Maeva Walker",
  "city": "Cumberland",
  "state": "Saskatchewan",
  "country": "Canada",
  "postcode": "Z6T 3E6",
  "coordinates": {
    "latitude": "-31.2136",
    "longitude": "16.8355"
  },
  "timezone": {
    "offset": "+4:00",
    "description": "Abu Dhabi, Muscat, Baku, Tbilisi"
  },
  "email": "maeva.walker@example.com",
  "b_date": "1963-04-17T16:40:45.773Z",
  "age": 58,
  "phone": "636-857-3801",
  "picture_large": "https://randomuser.me/api/portraits/women/61.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/61.jpg",
  "id": "SSN26546414",
  "favorite": "Podddg Vvssfsf",
  "course": "Law",
  "bg_color": "#3F400F",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Tim Roy",
  "city": "Créteil",
  "state": "Haut-Rhin",
  "country": "France",
  "postcode": 65772,
  "coordinates": {
    "latitude": "-63.5272",
    "longitude": "115.8694"
  },
  "timezone": {
    "offset": "+5:00",
    "description": "Ekaterinburg, Islamabad, Karachi, Tashkent"
  },
  "email": "tim.roy@example.com",
  "b_date": "1983-09-20T17:50:52.872Z",
  "age": 38,
  "phone": "05-70-80-69-86",
  "picture_large": "https://randomuser.me/api/portraits/men/20.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/20.jpg",
  "id": "INSEE1NNaN94113447 74",
  "favorite": "Klgddgg Bvxaqdqw",
  "course": "Computer Science",
  "bg_color": "#12B03D",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Tristan Petersen",
  "city": "Stenderup",
  "state": "Syddanmark",
  "country": "Denmark",
  "postcode": 88496,
  "coordinates": {
    "latitude": "-77.4835",
    "longitude": "64.8261"
  },
  "timezone": {
    "offset": "-5:00",
    "description": "Eastern Time (US & Canada), Bogota, Lima"
  },
  "email": "tristan.petersen@example.com",
  "b_date": "1950-11-26T15:19:28.764Z",
  "age": 71,
  "phone": "61523239",
  "picture_large": "https://randomuser.me/api/portraits/men/97.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/97.jpg",
  "id": "CPR261150-5443",
  "favorite": "Rvxxvvx Mggerge",
  "course": "Law",
  "bg_color": "#16A8C5",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "Kristina Skjold",
  "city": "Kolnes",
  "state": "Vest-Agder",
  "country": "Norway",
  "postcode": "4085",
  "coordinates": {
    "latitude": "-76.9661",
    "longitude": "-95.2957"
  },
  "timezone": {
    "offset": "-2:00",
    "description": "Mid-Atlantic"
  },
  "email": "kristina.skjold@example.com",
  "b_date": "1972-11-21T18:04:12.259Z",
  "age": 49,
  "phone": "71350190",
  "picture_large": "https://randomuser.me/api/portraits/women/92.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/92.jpg",
  "id": "FN21117225647",
  "favorite": "Reqvvxbg Thynbvf",
  "course": "Art",
  "bg_color": "#64BACB",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "آراد زارعی",
  "city": "اردبیل",
  "state": "کرمان",
  "country": "Iran",
  "postcode": 84902,
  "coordinates": {
    "latitude": "57.8145",
    "longitude": "-146.6983"
  },
  "timezone": {
    "offset": "+5:45",
    "description": "Kathmandu"
  },
  "email": "ard.zraay@example.com",
  "b_date": "1989-02-12T18:41:45.531Z",
  "age": 32,
  "phone": "029-39614780",
  "picture_large": "https://randomuser.me/api/portraits/men/48.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/48.jpg",
  "id": "FN21674265",
  "favorite": "Bgggh Klvxv",
  "course": "English",
  "bg_color": "#126575",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "آوینا نجاتی",
  "city": "قائم‌شهر",
  "state": "مرکزی",
  "country": "Iran",
  "postcode": 21415,
  "coordinates": {
    "latitude": "-51.3076",
    "longitude": "-146.1861"
  },
  "timezone": {
    "offset": "+11:00",
    "description": "Magadan, Solomon Islands, New Caledonia"
  },
  "email": "awyn.njty@example.com",
  "b_date": "1968-11-13T05:41:01.302Z",
  "age": 53,
  "phone": "049-44129055",
  "picture_large": "https://randomuser.me/api/portraits/women/19.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/19.jpg",
  "id": "FN2647585754",
  "favorite": "Tbxbv Kgfere",
  "course": "Medicine",
  "bg_color": "#68D5EA",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Ms",
  "full_name": "Ronja Marttila",
  "city": "Kotka",
  "state": "Ostrobothnia",
  "country": "Finland",
  "postcode": 52545,
  "coordinates": {
    "latitude": "-88.5101",
    "longitude": "-32.2106"
  },
  "timezone": {
    "offset": "+11:00",
    "description": "Magadan, Solomon Islands, New Caledonia"
  },
  "email": "ronja.marttila@example.com",
  "b_date": "1946-02-27T02:50:54.842Z",
  "age": 75,
  "phone": "04-421-028",
  "picture_large": "https://randomuser.me/api/portraits/women/5.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/5.jpg",
  "id": "HETUNaNNA728undefined",
  "favorite": "Gvxggr Tfgsvvs",
  "course": "Law",
  "bg_color": "#A7DA1F",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "Elcke Graumans",
  "city": "Eemshaven",
  "state": "Groningen",
  "country": "Netherlands",
  "postcode": 79822,
  "coordinates": {
    "latitude": "-73.7593",
    "longitude": "-162.6167"
  },
  "timezone": {
    "offset": "-2:00",
    "description": "Mid-Atlantic"
  },
  "email": "elcke.graumans@example.com",
  "b_date": "1987-12-26T20:55:07.940Z",
  "age": 34,
  "phone": "(938)-352-7475",
  "picture_large": "https://randomuser.me/api/portraits/women/58.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/58.jpg",
  "id": "BSN26586375",
  "favorite": "Idgdgg Bczsae",
  "course": "Math",
  "bg_color": "#E0EAC4",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "Sigrid Sviggum",
  "city": "Ramsøy",
  "state": "Hordaland",
  "country": "Norway",
  "postcode": "5904",
  "coordinates": {
    "latitude": "62.3170",
    "longitude": "102.2678"
  },
  "timezone": {
    "offset": "-5:00",
    "description": "Eastern Time (US & Canada), Bogota, Lima"
  },
  "email": "sigrid.sviggum@example.com",
  "b_date": "1993-10-03T01:40:10.720Z",
  "age": 28,
  "phone": "32189027",
  "picture_large": "https://randomuser.me/api/portraits/women/3.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/3.jpg",
  "id": "FN03109315264",
  "favorite": "Rgtdbv Cdfwsq",
  "course": "Statistics",
  "bg_color": "#C3E16F",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Emil Møller",
  "city": "Ansager",
  "state": "Danmark",
  "country": "Denmark",
  "postcode": 49442,
  "coordinates": {
    "latitude": "44.9585",
    "longitude": "152.8104"
  },
  "timezone": {
    "offset": "-3:30",
    "description": "Newfoundland"
  },
  "email": "emil.moller@example.com",
  "b_date": "1954-07-15T07:55:58.285Z",
  "age": 67,
  "phone": "17760878",
  "picture_large": "https://randomuser.me/api/portraits/men/20.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/20.jpg",
  "id": "CPR150754-2317",
  "favorite": "Opgtg Gcscs",
  "course": "Art",
  "bg_color": "#11B82D",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Darrell Dunne",
  "city": "Tullow",
  "state": "Wexford",
  "country": "Ireland",
  "postcode": 39242,
  "coordinates": {
    "latitude": "-68.2633",
    "longitude": "-70.6858"
  },
  "timezone": {
    "offset": "-7:00",
    "description": "Mountain Time (US & Canada)"
  },
  "email": "darrell.dunne@example.com",
  "b_date": "1997-11-21T06:35:55.528Z",
  "age": 24,
  "phone": "071-488-9968",
  "picture_large": "https://randomuser.me/api/portraits/men/36.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/36.jpg",
  "id": "PPS7847438T",
  "favorite": "Tfsfg Vsfbvc",
  "course": "Medicine",
  "bg_color": "#D4DC2D",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Jordan Vidal",
  "city": "Aubervilliers",
  "state": "Hauts-de-Seine",
  "country": "France",
  "postcode": 19716,
  "coordinates": {
    "latitude": "-74.1635",
    "longitude": "-67.0556"
  },
  "timezone": {
    "offset": "+4:00",
    "description": "Abu Dhabi, Muscat, Baku, Tbilisi"
  },
  "email": "jordan.vidal@example.com",
  "b_date": "1977-03-05T13:35:14.295Z",
  "age": 44,
  "phone": "04-31-67-71-51",
  "picture_large": "https://randomuser.me/api/portraits/men/94.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/94.jpg",
  "id": "INSEE1NNaN34394721 96",
  "favorite": "Qrwevb Bdzcz",
  "course": "Physics",
  "bg_color": "#0AB4A9",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "عرشيا كامياران",
  "city": "اهواز",
  "state": "گلستان",
  "country": "Iran",
  "postcode": 71779,
  "coordinates": {
    "latitude": "41.1604",
    "longitude": "82.3069"
  },
  "timezone": {
    "offset": "+5:00",
    "description": "Ekaterinburg, Islamabad, Karachi, Tashkent"
  },
  "email": "aarshy.kmyrn@example.com",
  "b_date": "1965-12-08T22:45:18.878Z",
  "age": 56,
  "phone": "083-31098334",
  "picture_large": "https://randomuser.me/api/portraits/men/32.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/32.jpg",
  "id": "INSDCV2NaN35643752196",
  "favorite": "Frvgd Qcvxzvd",
  "course": "Physics",
  "bg_color": "#5DD32E",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Esat Köylüoğlu",
  "city": "Giresun",
  "state": "Konya",
  "country": "Turkey",
  "postcode": 50870,
  "coordinates": {
    "latitude": "-44.0832",
    "longitude": "-64.5925"
  },
  "timezone": {
    "offset": "+5:45",
    "description": "Kathmandu"
  },
  "email": "esat.koyluoglu@example.com",
  "b_date": "1956-01-28T20:25:36.209Z",
  "age": 65,
  "phone": "(472)-638-0730",
  "picture_large": "https://randomuser.me/api/portraits/men/57.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/57.jpg",
  "id": "gfsd4532525",
  "favorite": "Qczfg Gthcb ",
  "course": "Law",
  "bg_color": "#B00E3C",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Madame",
  "full_name": "Anouk Simon",
  "city": "Dompierre (Vd)",
  "state": "Aargau",
  "country": "Switzerland",
  "postcode": 7118,
  "coordinates": {
    "latitude": "-9.6384",
    "longitude": "31.7436"
  },
  "timezone": {
    "offset": "-5:00",
    "description": "Eastern Time (US & Canada), Bogota, Lima"
  },
  "email": "anouk.simon@example.com",
  "b_date": "1982-04-05T14:22:44.269Z",
  "age": 39,
  "phone": "078 059 73 14",
  "picture_large": "https://randomuser.me/api/portraits/women/53.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/53.jpg",
  "id": "AVS756.6671.9396.83",
  "favorite": "Eqcz Hrgvv",
  "course": "Statistics",
  "bg_color": "#EE537F",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Ms",
  "full_name": "Sara Velasco",
  "city": "Madrid",
  "state": "Islas Baleares",
  "country": "Spain",
  "postcode": 68699,
  "coordinates": {
    "latitude": "-78.4139",
    "longitude": "115.4609"
  },
  "timezone": {
    "offset": "0:00",
    "description": "Western Europe Time, London, Lisbon, Casablanca"
  },
  "email": "sara.velasco@example.com",
  "b_date": "1980-04-17T20:07:31.899Z",
  "age": 41,
  "phone": "987-689-092",
  "picture_large": "https://randomuser.me/api/portraits/women/45.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/45.jpg",
  "id": "DNI23347090-X",
  "favorite": "Opsfd Cedfv",
  "course": "Law",
  "bg_color": "#1DC61A",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "Leah Diaz",
  "city": "Vallejo",
  "state": "Wyoming",
  "country": "United States",
  "postcode": 38797,
  "coordinates": {
    "latitude": "85.7862",
    "longitude": "-0.6726"
  },
  "timezone": {
    "offset": "+5:00",
    "description": "Ekaterinburg, Islamabad, Karachi, Tashkent"
  },
  "email": "leah.diaz@example.com",
  "b_date": "1992-12-20T09:32:27.922Z",
  "age": 29,
  "phone": "(173)-797-7689",
  "picture_large": "https://randomuser.me/api/portraits/women/6.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/6.jpg",
  "id": "SSN807-33-0374",
  "favorite": "Eqcxgf Igvdgdg",
  "course": "English",
  "bg_color": "#BFE125",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Quido Van der Zalm",
  "city": "Noordeinde Gld",
  "state": "Drenthe",
  "country": "Netherlands",
  "postcode": 34404,
  "coordinates": {
    "latitude": "-11.1926",
    "longitude": "-140.8227"
  },
  "timezone": {
    "offset": "-3:30",
    "description": "Newfoundland"
  },
  "email": "quido.vanderzalm@example.com",
  "b_date": "1961-12-02T13:05:04.807Z",
  "age": 60,
  "phone": "(144)-684-1967",
  "picture_large": "https://randomuser.me/api/portraits/men/68.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/68.jpg",
  "id": "BSN59554936",
  "favorite": "Bfere Czqaedq",
  "course": "Statistics",
  "bg_color": "#BCD83C",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "Vanessa Morgan",
  "city": "Houston",
  "state": "Florida",
  "country": "United States",
  "postcode": 69723,
  "coordinates": {
    "latitude": "-8.8001",
    "longitude": "-168.5588"
  },
  "timezone": {
    "offset": "+9:30",
    "description": "Adelaide, Darwin"
  },
  "email": "vanessa.morgan@example.com",
  "b_date": "1955-11-22T15:47:38.848Z",
  "age": 66,
  "phone": "(835)-586-6028",
  "picture_large": "https://randomuser.me/api/portraits/women/69.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/69.jpg",
  "id": "SSN375-57-5719",
  "favorite": "Fvsdf Qcad",
  "course": "Dancing",
  "bg_color": "#D6EC72",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Ms",
  "full_name": "سلطانی نژاد",
  "city": "نیشابور",
  "state": "همدان",
  "country": "Iran",
  "postcode": 66423,
  "coordinates": {
    "latitude": "7.6396",
    "longitude": "-26.9170"
  },
  "timezone": {
    "offset": "-8:00",
    "description": "Pacific Time (US & Canada)"
  },
  "email": "awyn.sltnynjd@example.com",
  "b_date": "1994-08-26T17:01:22.484Z",
  "age": 27,
  "phone": "006-79317326",
  "picture_large": "https://randomuser.me/api/portraits/women/81.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/81.jpg",
  "id": "SSN357-57-3219",
  "favorite": "Iofds Mrfwr",
  "course": "Chess",
  "bg_color": "#1BCA65",
  "note": "hello"
}, (_ref = {
  "gender": "male",
  "title": "Mr",
  "full_name": "Oscar Dupont",
  "city": "Grenoble",
  "state": "Aveyron",
  "country": "France",
  "postcode": 27916,
  "coordinates": {
    "latitude": "32.9637",
    "longitude": "-78.6173"
  },
  "timezone": {
    "offset": "-11:00",
    "description": "Midway Island, Samoa"
  },
  "email": "oscar.dupont@example.com",
  "b_date": "1951-01-16T07:15:43.883Z",
  "age": 70,
  "phone": "03-39-75-54-47"
}, _defineProperty(_ref, "phone", "006-79317326"), _defineProperty(_ref, "picture_large", "https://randomuser.me/api/portraits/men/42.jpg"), _defineProperty(_ref, "picture_thumbnail", "https://randomuser.me/api/portraits/thumb/men/42.jpg"), _defineProperty(_ref, "id", "INSEE1NNaN65034787 26"), _defineProperty(_ref, "favorite", "Idgbb Lwsrs"), _defineProperty(_ref, "course", "Physics"), _defineProperty(_ref, "bg_color", "#098AB4"), _defineProperty(_ref, "note", "hello"), _ref), {
  "gender": "woman",
  "title": "Ms",
  "full_name": "مهدیسمرادی",
  "city": "ارومیه",
  "state": "فارس",
  "country": "Iran",
  "postcode": 84580,
  "coordinates": {
    "latitude": "45.7509",
    "longitude": "75.8284"
  },
  "timezone": {
    "offset": "+9:00",
    "description": "Tokyo, Seoul, Osaka, Sapporo, Yakutsk"
  },
  "email": "mhdys.mrdy@example.com",
  "b_date": "1952-10-04T09:02:09.900Z",
  "age": 69,
  "phone": "015-09271245",
  "picture_large": "https://randomuser.me/api/portraits/women/24.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/24.jpg",
  "id": "INSENDWN65574357 26",
  "favorite": "Idgbb Lwsrs",
  "course": "Physics",
  "bg_color": "#69BEDA",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Monsieur",
  "full_name": "Noa Bertrand",
  "city": "Reiden",
  "state": "Schwyz",
  "country": "Switzerland",
  "postcode": 9703,
  "coordinates": {
    "latitude": "-74.4969",
    "longitude": "-152.0049"
  },
  "timezone": {
    "offset": "-3:00",
    "description": "Brazil, Buenos Aires, Georgetown"
  },
  "email": "noa.bertrand@example.com",
  "b_date": "1955-10-20T18:03:04.151Z",
  "age": 66,
  "phone": "078 301 62 63",
  "picture_large": "https://randomuser.me/api/portraits/men/4.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/4.jpg",
  "id": "AVS756.7424.4611.08",
  "favorite": "Tfsfg Vsfbvc",
  "course": "Medicine",
  "bg_color": "#AF7A1D",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Jerrold Kliphuis",
  "city": "Rheezerveen",
  "state": "Noord-Holland",
  "country": "Netherlands",
  "postcode": 76283,
  "coordinates": {
    "latitude": "48.2285",
    "longitude": "-79.7590"
  },
  "timezone": {
    "offset": "+4:30",
    "description": "Kabul"
  },
  "email": "jerrold.kliphuis@example.com",
  "b_date": "1968-03-24T06:29:47.075Z",
  "age": 53,
  "phone": "(018)-382-5902",
  "picture_large": "https://randomuser.me/api/portraits/men/74.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/74.jpg",
  "id": "BSN84507586",
  "favorite": "Ffeggege Ccsvvv",
  "course": "Computer Science",
  "bg_color": "#99C54D",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Miss",
  "full_name": "Beatrice Bergeron",
  "city": "Sutton",
  "state": "Alberta",
  "country": "Canada",
  "postcode": "G1J 5T2",
  "coordinates": {
    "latitude": "68.0346",
    "longitude": "165.2673"
  },
  "timezone": {
    "offset": "-4:00",
    "description": "Atlantic Time (Canada), Caracas, La Paz"
  },
  "email": "beatrice.bergeron@example.com",
  "b_date": "1957-01-28T03:46:41.370Z",
  "age": 64,
  "phone": "338-732-2677",
  "picture_large": "https://randomuser.me/api/portraits/women/3.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/3.jpg",
  "id": "ERQ84556326",
  "favorite": "Ggtrghr Vvcsvssd",
  "course": "Biology",
  "bg_color": "#EE4A74",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Lucas Kristensen",
  "city": "Allinge",
  "state": "Sjælland",
  "country": "Denmark",
  "postcode": 94452,
  "coordinates": {
    "latitude": "-74.1864",
    "longitude": "23.5624"
  },
  "timezone": {
    "offset": "+9:30",
    "description": "Adelae, Darwin"
  },
  "email": "lucas.kristensen@example.com",
  "b_date": "1983-03-31T14:04:35.291Z",
  "age": 38,
  "phone": "67399596",
  "picture_large": "https://randomuser.me/api/portraits/men/3.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/3.jpg",
  "id": "CPR310383-9581",
  "favorite": "Gtrtbhrfb Bvzxcsf",
  "course": "Dance",
  "bg_color": "#16B298",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Eugene Kuhn",
  "city": "St. Petersburg",
  "state": "Florida",
  "country": "United States",
  "postcode": 11620,
  "coordinates": {
    "latitude": "41.6479",
    "longitude": "-79.9292"
  },
  "timezone": {
    "offset": "+4:00",
    "description": "Abu Dhabi, Muscat, Baku, Tbilisi"
  },
  "email": "eugene.kuhn@example.com",
  "b_date": "1957-12-04T07:34:06.971Z",
  "age": 64,
  "phone": "(903)-380-2376",
  "picture_large": "https://randomuser.me/api/portraits/men/48.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/48.jpg",
  "id": "SSN891-26-1846",
  "favorite": "Opgtg Gcscs",
  "course": "Art",
  "bg_color": "#7386DC",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Frederikke Sørensen",
  "city": "Sønder Stenderup",
  "state": "Sjælland",
  "country": "Denmark",
  "postcode": 18668,
  "coordinates": {
    "latitude": "-69.4969",
    "longitude": "-146.2993"
  },
  "timezone": {
    "offset": "+5:45",
    "description": "Kathmandu"
  },
  "email": "frederikke.sorensen@example.com",
  "b_date": "1964-03-23T21:11:35.935Z",
  "age": 57,
  "phone": "07190090",
  "picture_large": "https://randomuser.me/api/portraits/men/28.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/28.jpg",
  "id": "CPR230364-8018",
  "favorite": "Tfgdgdb Tfcvad",
  "course": "Chemistry",
  "bg_color": "#4027B2",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Matteo Lecomte",
  "city": "Courbevoie",
  "state": "Charente",
  "country": "France",
  "postcode": 89507,
  "coordinates": {
    "latitude": "89.1833",
    "longitude": "-4.8202"
  },
  "timezone": {
    "offset": "+9:30",
    "description": "Adelaide, Darwin"
  },
  "email": "matteo.lecomte@example.com",
  "b_date": "1948-05-30T04:28:42.593Z",
  "age": 73,
  "phone": "02-33-67-58-40",
  "picture_large": "https://randomuser.me/api/portraits/men/57.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/57.jpg",
  "id": "INSEE1NNaN8470722961",
  "favorite": "Idgdgg Bczsae",
  "course": "Math",
  "bg_color": "#9518A1",
  "note": "hello"
}, {
  "gender": "male",
  "title": "Mr",
  "full_name": "Aaron Enoksen",
  "city": "Bruflat",
  "state": "Rogaland",
  "country": "Norway",
  "postcode": "6913",
  "coordinates": {
    "latitude": "51.4281",
    "longitude": "-160.4653"
  },
  "timezone": {
    "offset": "+3:30",
    "description": "Tehran"
  },
  "email": "aaron.enoksen@example.com",
  "b_date": "1948-05-30T04:28:42.593Z",
  "age": 43,
  "phone": "02-33-67-58-40",
  "picture_large": "https://randomuser.me/api/portraits/men/148.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/148.jpg",
  "id": "FN19075962342566",
  "favorite": "Bfsvss Dqwdweff",
  "course": "Physics",
  "bg_color": "#20CD96",
  "note": "hello"
}, {
  "gender": "woman",
  "title": "Mrs",
  "full_name": "Olivia Storm",
  "city": "Kragerø",
  "country": "Norway",
  "postcode": "3127",
  "coordinates": {
    "latitude": "57.2663",
    "longitude": "141.0994"
  },
  "timezone": {
    "offset": "+1:00",
    "description": "Brussels, Copenhagen, Madrid, Paris"
  },
  "b_day": "1963-06-02T09:26:02.733Z",
  "age": 56,
  "id": "FN02064618043",
  "picture_large": "https://randomuser.me/api/portraits/women/67.jpg",
  "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/women/67.jpg",
  "favorite": "Tfgdgdb Tfcvad",
  "course": "Chemistry",
  "bg_color": "#86CF1D",
  "note": "old lady with a cats"
}];
exports.randomUserMock = randomUserMock;
var additionalUsers = [];
exports.additionalUsers = additionalUsers;
var favoriteTeachers = [{
  "picture_large": "",
  "id": "",
  "name": ""
}];
exports.favoriteTeachers = favoriteTeachers;
},{}],"node_modules/axios/lib/helpers/bind.js":[function(require,module,exports) {
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],"node_modules/axios/lib/utils.js":[function(require,module,exports) {
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":"node_modules/axios/lib/helpers/bind.js"}],"node_modules/axios/lib/helpers/buildURL.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":"node_modules/axios/lib/utils.js"}],"node_modules/axios/lib/core/InterceptorManager.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":"node_modules/axios/lib/utils.js"}],"node_modules/axios/lib/helpers/normalizeHeaderName.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":"node_modules/axios/lib/utils.js"}],"node_modules/axios/lib/core/enhanceError.js":[function(require,module,exports) {
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],"node_modules/axios/lib/core/createError.js":[function(require,module,exports) {
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":"node_modules/axios/lib/core/enhanceError.js"}],"node_modules/axios/lib/core/settle.js":[function(require,module,exports) {
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":"node_modules/axios/lib/core/createError.js"}],"node_modules/axios/lib/helpers/cookies.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":"node_modules/axios/lib/utils.js"}],"node_modules/axios/lib/helpers/isAbsoluteURL.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],"node_modules/axios/lib/helpers/combineURLs.js":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],"node_modules/axios/lib/core/buildFullPath.js":[function(require,module,exports) {
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/isAbsoluteURL":"node_modules/axios/lib/helpers/isAbsoluteURL.js","../helpers/combineURLs":"node_modules/axios/lib/helpers/combineURLs.js"}],"node_modules/axios/lib/helpers/parseHeaders.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":"node_modules/axios/lib/utils.js"}],"node_modules/axios/lib/helpers/isURLSameOrigin.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":"node_modules/axios/lib/utils.js"}],"node_modules/axios/lib/adapters/xhr.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"./../utils":"node_modules/axios/lib/utils.js","./../core/settle":"node_modules/axios/lib/core/settle.js","./../helpers/cookies":"node_modules/axios/lib/helpers/cookies.js","./../helpers/buildURL":"node_modules/axios/lib/helpers/buildURL.js","../core/buildFullPath":"node_modules/axios/lib/core/buildFullPath.js","./../helpers/parseHeaders":"node_modules/axios/lib/helpers/parseHeaders.js","./../helpers/isURLSameOrigin":"node_modules/axios/lib/helpers/isURLSameOrigin.js","../core/createError":"node_modules/axios/lib/core/createError.js"}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};
},{}],"node_modules/axios/lib/defaults.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

},{"./utils":"node_modules/axios/lib/utils.js","./helpers/normalizeHeaderName":"node_modules/axios/lib/helpers/normalizeHeaderName.js","./core/enhanceError":"node_modules/axios/lib/core/enhanceError.js","./adapters/xhr":"node_modules/axios/lib/adapters/xhr.js","./adapters/http":"node_modules/axios/lib/adapters/xhr.js","process":"node_modules/process/browser.js"}],"node_modules/axios/lib/core/transformData.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../utils":"node_modules/axios/lib/utils.js","./../defaults":"node_modules/axios/lib/defaults.js"}],"node_modules/axios/lib/cancel/isCancel.js":[function(require,module,exports) {
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],"node_modules/axios/lib/core/dispatchRequest.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"./../utils":"node_modules/axios/lib/utils.js","./transformData":"node_modules/axios/lib/core/transformData.js","../cancel/isCancel":"node_modules/axios/lib/cancel/isCancel.js","../defaults":"node_modules/axios/lib/defaults.js"}],"node_modules/axios/lib/core/mergeConfig.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":"node_modules/axios/lib/utils.js"}],"node_modules/axios/package.json":[function(require,module,exports) {
module.exports = {
  "name": "axios",
  "version": "0.21.4",
  "description": "Promise based HTTP client for the browser and node.js",
  "main": "index.js",
  "scripts": {
    "test": "grunt test",
    "start": "node ./sandbox/server.js",
    "build": "NODE_ENV=production grunt build",
    "preversion": "npm test",
    "version": "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
    "postversion": "git push && git push --tags",
    "examples": "node ./examples/server.js",
    "coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    "fix": "eslint --fix lib/**/*.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/axios/axios.git"
  },
  "keywords": [
    "xhr",
    "http",
    "ajax",
    "promise",
    "node"
  ],
  "author": "Matt Zabriskie",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/axios/axios/issues"
  },
  "homepage": "https://axios-http.com",
  "devDependencies": {
    "coveralls": "^3.0.0",
    "es6-promise": "^4.2.4",
    "grunt": "^1.3.0",
    "grunt-banner": "^0.6.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-clean": "^1.1.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-eslint": "^23.0.0",
    "grunt-karma": "^4.0.0",
    "grunt-mocha-test": "^0.13.3",
    "grunt-ts": "^6.0.0-beta.19",
    "grunt-webpack": "^4.0.2",
    "istanbul-instrumenter-loader": "^1.0.0",
    "jasmine-core": "^2.4.1",
    "karma": "^6.3.2",
    "karma-chrome-launcher": "^3.1.0",
    "karma-firefox-launcher": "^2.1.0",
    "karma-jasmine": "^1.1.1",
    "karma-jasmine-ajax": "^0.1.13",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^4.3.6",
    "karma-sinon": "^1.0.5",
    "karma-sourcemap-loader": "^0.3.8",
    "karma-webpack": "^4.0.2",
    "load-grunt-tasks": "^3.5.2",
    "minimist": "^1.2.0",
    "mocha": "^8.2.1",
    "sinon": "^4.5.0",
    "terser-webpack-plugin": "^4.2.3",
    "typescript": "^4.0.5",
    "url-search-params": "^0.10.0",
    "webpack": "^4.44.2",
    "webpack-dev-server": "^3.11.0"
  },
  "browser": {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  },
  "jsdelivr": "dist/axios.min.js",
  "unpkg": "dist/axios.min.js",
  "typings": "./index.d.ts",
  "dependencies": {
    "follow-redirects": "^1.14.0"
  },
  "bundlesize": [
    {
      "path": "./dist/axios.min.js",
      "threshold": "5kB"
    }
  ]
}
;
},{}],"node_modules/axios/lib/helpers/validator.js":[function(require,module,exports) {
'use strict';

var pkg = require('./../../package.json');

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};

},{"./../../package.json":"node_modules/axios/package.json"}],"node_modules/axios/lib/core/Axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../utils":"node_modules/axios/lib/utils.js","../helpers/buildURL":"node_modules/axios/lib/helpers/buildURL.js","./InterceptorManager":"node_modules/axios/lib/core/InterceptorManager.js","./dispatchRequest":"node_modules/axios/lib/core/dispatchRequest.js","./mergeConfig":"node_modules/axios/lib/core/mergeConfig.js","../helpers/validator":"node_modules/axios/lib/helpers/validator.js"}],"node_modules/axios/lib/cancel/Cancel.js":[function(require,module,exports) {
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],"node_modules/axios/lib/cancel/CancelToken.js":[function(require,module,exports) {
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":"node_modules/axios/lib/cancel/Cancel.js"}],"node_modules/axios/lib/helpers/spread.js":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],"node_modules/axios/lib/helpers/isAxiosError.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],"node_modules/axios/lib/axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./utils":"node_modules/axios/lib/utils.js","./helpers/bind":"node_modules/axios/lib/helpers/bind.js","./core/Axios":"node_modules/axios/lib/core/Axios.js","./core/mergeConfig":"node_modules/axios/lib/core/mergeConfig.js","./defaults":"node_modules/axios/lib/defaults.js","./cancel/Cancel":"node_modules/axios/lib/cancel/Cancel.js","./cancel/CancelToken":"node_modules/axios/lib/cancel/CancelToken.js","./cancel/isCancel":"node_modules/axios/lib/cancel/isCancel.js","./helpers/spread":"node_modules/axios/lib/helpers/spread.js","./helpers/isAxiosError":"node_modules/axios/lib/helpers/isAxiosError.js"}],"node_modules/axios/index.js":[function(require,module,exports) {
module.exports = require('./lib/axios');
},{"./lib/axios":"node_modules/axios/lib/axios.js"}],"main.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNewTeacher = addNewTeacher;
exports.addToFavorites = addToFavorites;
exports.closeForm = closeForm;
exports.closeMoreForm = closeMoreForm;
exports.nextFavorites = nextFavorites;
exports.nextTeachers = nextTeachers;
exports.onFilterChange = onFilterChange;
exports.openForm = openForm;
exports.openMoreForm = openMoreForm;
exports.previousFavorites = previousFavorites;
exports.searchOnChange = searchOnChange;
exports.sortByAge = sortByAge;
exports.sortByGender = sortByGender;
exports.sortByName = sortByName;
exports.sortByNationality = sortByNationality;
exports.sortBySpecialty = sortBySpecialty;
exports.statisticsButton = statisticsButton;
require("regenerator-runtime/runtime");
var _Lab5Mock = require("./Lab5Mock.js");
var _axios2 = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
'';
var randomUserIndex = 0;
var currentMoreTeacherElement = null;
var currentMoreTeacherElementID = "";
var statisticsCurrentElementID = undefined;
var currentFavoritesFirstElement = 1;
var currentFavoritesLastElement = 6;
var currentStatisticsPage = 1;
var totalCount = 0;
var finalStatisticsArray = [];
var finalSearchArray = [];
var finalFilterArray = [];
var randomUserApiMock = [];
var statisticsFinalArrayToSort = [];
var sortName = false;
var sortSpecialty = false;
var sortAge = false;
var sortGender = false;
var sortNationality = false;
var isSearching = false;
var isFiltering = false;
window.onload = setGridStatisticsItems();
var currentDisplayedTeachersIndex = 0;
function openForm(elemID) {
  document.getElementById("myForm").style.display = "block";
  document.getElementById("darken").style.display = "block";
  document.getElementById("add-teacher-form").reset();
}
function closeForm(elemID) {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("darken").style.display = "none";
}
function openMoreForm(elemID) {
  //Find element in array
  var element = document.getElementById(elemID);
  currentMoreTeacherElement = document.getElementById(elemID);
  currentMoreTeacherElementID = elemID;
  for (var i = 0; i < randomUserApiMock.length; i++) {
    if (element.id == randomUserApiMock[i].id) {
      var nameElement = document.getElementById("more-name");
      nameElement.innerHTML = randomUserApiMock[i].full_name;
      var imgElement = document.getElementById("more-img");
      imgElement.src = randomUserApiMock[i].picture_large;
      var courseElement = document.getElementById("more-course");
      courseElement.innerHTML = randomUserApiMock[i].course;
      var cityCountryElement = document.getElementById("more-city-country");
      cityCountryElement.innerHTML = randomUserApiMock[i].city + ", " + randomUserApiMock[i].country;
      var ageSexElement = document.getElementById("more-age-sex");
      ageSexElement.innerHTML = randomUserApiMock[i].age + ", " + randomUserApiMock[i].gender;
      var emailElement = document.getElementById("more-email");
      emailElement.innerHTML = randomUserApiMock[i].email;
      var phoneElement = document.getElementById("more-phone");
      phoneElement.innerHTML = randomUserApiMock[i].phone;
      var starImg = document.getElementById("img-more-star");
      for (var g = 0; g < _Lab5Mock.favoriteTeachers.length; g++) {
        if (_Lab5Mock.favoriteTeachers[g].id == randomUserApiMock[i].id) {
          starImg.src = "star.png";
          break;
        } else starImg.src = "emptystar.png";
      }
    }
  }
  document.getElementById("more").style.display = "block";
  document.getElementById("darken").style.display = "block";
}
function closeMoreForm(elemID) {
  document.getElementById("more").style.display = "none";
  document.getElementById("darken").style.display = "none";
}
function returnrandomUserApiMock() {
  return randomUserApiMock;
}
function filterObject(country, age, gender, favorite) {
  var newMock = [];
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      var CanPush = true;
      if (randomUserApiMock[i].country != country) CanPush = false;
      if (randomUserApiMock[i].age != age) CanPush = false;
      if (randomUserApiMock[i].gender != gender) CanPush = false;
      if (randomUserApiMock[i].favorite != favorite) CanPush = false;
      if (CanPush) newMock.push(randomUserApiMock[i]);
    }
    return newMock;
  }
}
function old_sortByCountry(country, type) {
  var MockCountry = [];
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      var CanPush = false;
      if (randomUserApiMock[i].country === country) {
        CanPush = true;
        break;
      }
      if (CanPush) MockCountry.push(randomUserApiMock[i].country);
      if (type === 'descending') {
        MockCountry.sort();
        MockCountry.reverse();
      } else if (type === 'ascending') MockCountry.sort();
      var finalArray = [];
      for (var j = 0; i < MockCountry.length; i++) {
        var object = {
          country: MockCountry[j].country,
          age: randomUserApiMock[i].age,
          gender: randomUserApiMock[i].gender,
          favorite: randomUserApiMock[i].favorite
        };
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}
function old_sortByAge(age, type) {
  var MockAge = [];
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      var CanPush = false;
      if (randomUserApiMock[i].age === age) {
        CanPush = true;
        break;
      }
      if (CanPush) MockAge.push(randomUserApiMock[i].age);
      if (type === 'descending') MockAge.sort(function (a, b) {
        return b - a;
      });else if (type === 'ascending') MockAge.sort(function (a, b) {
        return a - b;
      });
      var finalArray = [];
      for (var j = 0; i < MockAge.length; i++) {
        var object = {
          country: randomUserApiMock[i].country,
          age: MockAge.age,
          gender: randomUserApiMock[i].gender,
          favorite: randomUserApiMock[i].favorite
        };
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}
function old_sortByGender(gender, type) {
  var MockGender = [];
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      var CanPush = false;
      if (randomUserApiMock[i].gender === gender) {
        CanPush = true;
        break;
      }
      if (CanPush) MockGender.push(randomUserApiMock[i].gender);
      if (type === 'descending') {
        MockGender.sort();
        MockGender.reverse();
      } else if (type === 'ascending') MockGender.sort();
      var finalArray = [];
      for (var j = 0; i < MockGender.length; i++) {
        var object = {
          country: randomUserApiMock[i].country,
          age: randomUserApiMock[i].age,
          gender: MockGender.gender,
          favorite: randomUserApiMock[i].favorite
        };
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}
function old_sortByFavorite(favorite, type) {
  var MockFavorite = [];
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      var CanPush = false;
      if (randomUserApiMock[i].favorite === favorite) {
        CanPush = true;
        break;
      }
      if (CanPush) MockFavorite.push(randomUserApiMock[i].favorite);
      if (type === 'descending') {
        MockFavorite.sort();
        MockFavorite.reverse();
      } else if (type === 'ascending') MockFavorite.sort();
      var finalArray = [];
      for (var j = 0; i < MockFavorite.length; i++) {
        var object = {
          country: randomUserApiMock[i].country,
          age: randomUserApiMock[i].age,
          gender: randomUserApiMock[i].gender,
          favorite: MockFavorite.favorite
        };
        finalArray.push(object);
      }
      return finalArray;
    }
  }
}
function findObjectName(name) {
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      if (randomUserApiMock[i].name === name) return randomUserApiMock[i];
    }
  }
}
function findObjectNote(note) {
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      if (randomUserApiMock[i].note === note) return randomUserApiMock[i];
    }
  }
}
function findObjectAge(age) {
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      if (randomUserApiMock[i].age === age) return randomUserApiMock[i];
    }
  }
}
function findObjectNamePercentage(name) {
  var numberOfObjects = 0;
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      if (randomUserApiMock[i].name === name) numberOfObjects++;
    }
    return numberOfObjects / randomUserApiMock.length;
  }
}
function findObjectNotePercentage(note) {
  var numberOfObjects = 0;
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      if (randomUserApiMock[i].note === note) numberOfObjects++;
    }
    return numberOfObjects / randomUserApiMock.length;
  }
}
function findObjectAgePercentage(age) {
  var numberOfObjects = 0;
  if (validateObjects()) {
    for (var i = 0; i < randomUserApiMock.length; i++) {
      if (randomUserApiMock[i].age === age) numberOfObjects++;
    }
    return numberOfObjects / randomUserApiMock.length;
  }
}
function setGridStatisticsItems() {
  return _setGridStatisticsItems.apply(this, arguments);
}
function _setGridStatisticsItems() {
  _setGridStatisticsItems = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var currentIndex, arrayimg, arrayh1, arraydiv, arraypfirst, arraypsecond, arrayName, arraySpecialty, arrayAge, arrayGender, arrayNationality, i, _i33, _i34;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          window.openForm = openForm;
          window.openMoreForm = openMoreForm;
          window.closeForm = closeForm;
          window.closeMoreForm = closeMoreForm;
          window.addToFavorites = addToFavorites;
          window.onFilterChange = onFilterChange;
          window.sortByName = sortByName;
          window.sortBySpecialty = sortBySpecialty;
          window.sortByAge = sortByAge;
          window.sortByGender = sortByGender;
          window.sortByNationality = sortByNationality;
          window.nextFavorites = nextFavorites;
          window.previousFavorites = previousFavorites;
          window.statisticsButton = statisticsButton;
          window.searchOnChange = searchOnChange;
          window.addNewTeacher = addNewTeacher;
          window.nextTeachers = nextTeachers;
          _context.next = 19;
          return getUsers();
        case 19:
          randomUserApiMock = _context.sent;
          currentIndex = randomUserIndex;
          arrayimg = Array.from(document.getElementsByClassName('img-teachers-orange'));
          arrayimg.forEach(function (el) {
            el.src = randomUserApiMock[currentIndex].picture_large;
            currentIndex++;
            if (currentIndex >= randomUserApiMock.length) currentIndex = 0;
          });
          currentIndex = randomUserIndex;
          arrayh1 = Array.from(document.getElementsByClassName('teachers-h1'));
          arrayh1.forEach(function (el) {
            var firstName = "";
            var lastName = "";
            var i = 0;
            for (; i < randomUserApiMock[currentIndex].full_name.length; i++) {
              if (randomUserApiMock[currentIndex].full_name[i] == " ") {
                i++;
                break;
              }
              firstName += randomUserApiMock[currentIndex].full_name[i];
            }
            for (; i < randomUserApiMock[currentIndex].full_name.length; i++) {
              lastName += randomUserApiMock[currentIndex].full_name[i];
            }
            el.innerHTML = firstName + "<br>" + lastName;
            currentIndex++;
            if (currentIndex >= randomUserApiMock.length) currentIndex = 0;
          });
          currentIndex = randomUserIndex;
          arraydiv = Array.from(document.getElementsByClassName('teachers-grid-item'));
          arraydiv.forEach(function (el) {
            el.id = randomUserApiMock[currentIndex].id;
            currentIndex++;
            if (currentIndex >= randomUserApiMock.length) currentIndex = 0;
          });
          currentIndex = randomUserIndex;
          arraypfirst = Array.from(document.getElementsByClassName('teachers-p-first'));
          arraypfirst.forEach(function (el) {
            el.innerHTML = randomUserApiMock[currentIndex].course;
            currentIndex++;
            if (currentIndex >= randomUserApiMock.length) currentIndex = 0;
          });
          currentIndex = randomUserIndex;
          arraypsecond = Array.from(document.getElementsByClassName('teachers-p-second'));
          arraypsecond.forEach(function (el) {
            el.innerHTML = randomUserApiMock[currentIndex].country;
            currentIndex++;
            if (currentIndex >= randomUserApiMock.length) currentIndex = 0;
          });
          randomUserIndex = currentIndex;
          arrayName = Array.from(document.getElementsByName('td-name'));
          arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
          arrayAge = Array.from(document.getElementsByName('td-age'));
          arrayGender = Array.from(document.getElementsByName('td-gender'));
          arrayNationality = Array.from(document.getElementsByName('td-nationality'));
          for (i = 0; i < randomUserApiMock.length; i++) {
            finalStatisticsArray.push({
              "name": randomUserApiMock[i].full_name,
              "specialty": randomUserApiMock[i].course,
              "age": randomUserApiMock[i].age,
              "gender": randomUserApiMock[i].gender,
              "nationality": randomUserApiMock[i].country
            });
            statisticsFinalArrayToSort.push({
              "name": _Lab5Mock.randomUserMock[i].full_name,
              "specialty": _Lab5Mock.randomUserMock[i].course,
              "age": _Lab5Mock.randomUserMock[i].age,
              "gender": _Lab5Mock.randomUserMock[i].gender,
              "nationality": _Lab5Mock.randomUserMock[i].country
            });
          }
          for (_i33 = 0; _i33 < randomUserApiMock.length; _i33++) finalSearchArray.push(randomUserApiMock[_i33]);
          for (_i34 = 0; _i34 < 10; _i34++) {
            arrayName[_i34].innerHTML = finalStatisticsArray[_i34].name;
            arraySpecialty[_i34].innerHTML = finalStatisticsArray[_i34].specialty;
            arrayAge[_i34].innerHTML = finalStatisticsArray[_i34].age;
            arrayGender[_i34].innerHTML = finalStatisticsArray[_i34].gender;
            arrayNationality[_i34].innerHTML = finalStatisticsArray[_i34].nationality;
          }
          totalCount = Math.ceil(randomUserApiMock.length / 10);
          finalFilterArray = randomUserApiMock;
        case 46:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _setGridStatisticsItems.apply(this, arguments);
}
function setNextTeachers(_x) {
  return _setNextTeachers.apply(this, arguments);
}
function _setNextTeachers() {
  _setNextTeachers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(arrayWithData) {
    var currentIndex, arrayimg, arrayh1, arraydiv, arraypfirst, arraypsecond, arrayStar, lastIndex, i, firstName, lastName, c, isFavorite, g;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (currentDisplayedTeachersIndex * 10 >= arrayWithData.length) currentDisplayedTeachersIndex = 0;
          currentIndex = currentDisplayedTeachersIndex * 10;
          arrayimg = Array.from(document.getElementsByClassName('img-teachers-orange'));
          arrayh1 = Array.from(document.getElementsByClassName('teachers-h1'));
          arraydiv = Array.from(document.getElementsByClassName('teachers-grid-item'));
          arraypfirst = Array.from(document.getElementsByClassName('teachers-p-first'));
          arraypsecond = Array.from(document.getElementsByClassName('teachers-p-second'));
          arrayStar = Array.from(document.getElementsByClassName('teachers-div-relative'));
          lastIndex = 0;
          i = 0;
        case 10:
          if (!(i < 10 && currentIndex < arrayWithData.length)) {
            _context2.next = 44;
            break;
          }
          arrayimg[i].src = arrayWithData[currentIndex].picture_large;
          firstName = "";
          lastName = "";
          c = 0;
        case 15:
          if (!(c < arrayWithData[currentIndex].full_name.length)) {
            _context2.next = 23;
            break;
          }
          if (!(arrayWithData[currentIndex].full_name[c] == " ")) {
            _context2.next = 19;
            break;
          }
          c++;
          return _context2.abrupt("break", 23);
        case 19:
          firstName += arrayWithData[currentIndex].full_name[c];
        case 20:
          c++;
          _context2.next = 15;
          break;
        case 23:
          for (; c < arrayWithData[currentIndex].full_name.length; c++) lastName += arrayWithData[currentIndex].full_name[c];
          arrayh1[i].innerHTML = firstName + "<br>" + lastName;
          arraydiv[i].id = arrayWithData[currentIndex].id;
          arraydiv[i].style.visibility = "visible";
          arraypfirst[i].innerHTML = arrayWithData[currentIndex].course;
          arraypsecond[i].innerHTML = arrayWithData[currentIndex].country;
          isFavorite = false;
          g = 0;
        case 31:
          if (!(g < _Lab5Mock.favoriteTeachers.length)) {
            _context2.next = 39;
            break;
          }
          if (!(arrayWithData[currentIndex].id == _Lab5Mock.favoriteTeachers[g].id)) {
            _context2.next = 36;
            break;
          }
          arrayStar[i].style.visibility = "visible";
          isFavorite = true;
          return _context2.abrupt("break", 39);
        case 36:
          g++;
          _context2.next = 31;
          break;
        case 39:
          if (!isFavorite) arrayStar[i].style.visibility = "hidden";
          lastIndex = i;
        case 41:
          i++, currentIndex++;
          _context2.next = 10;
          break;
        case 44:
          lastIndex++;
          for (; lastIndex < 10; lastIndex++) {
            arraydiv[lastIndex].id = "";
            arraydiv[lastIndex].style.visibility = "hidden";
            arrayStar[lastIndex].style.visibility = "hidden";
          }
        case 46:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _setNextTeachers.apply(this, arguments);
}
function nextTeachers() {
  currentDisplayedTeachersIndex++;
  if (isFiltering && isSearching) {
    var finalArray = [];
    for (var i = 0; i < finalFilterArray.length; i++) for (var c = 0; c < finalSearchArray.length; c++) if (finalFilterArray[i].id == finalSearchArray[c].id) {
      finalArray.push(finalFilterArray[i]);
      break;
    }
    setNextTeachers(finalArray);
  } else if (isFiltering) {
    setNextTeachers(finalFilterArray);
  } else if (isSearching) {
    setNextTeachers(finalSearchArray);
  } else {
    setNextTeachers(randomUserApiMock);
  }
}
function addToFavorites() {
  for (var i = 0; i < randomUserApiMock.length; i++) {
    if (currentMoreTeacherElement.id == randomUserApiMock[i].id) {
      var isFavorite = false;
      var b = 0;
      for (; b < _Lab5Mock.favoriteTeachers.length; b++) if (_Lab5Mock.favoriteTeachers[b].id == randomUserApiMock[i].id) {
        isFavorite = true;
        break;
      }
      if (!isFavorite) {
        var arrayimg = Array.from(document.getElementsByClassName('img-favorites-orange'));
        var arrayh1 = Array.from(document.getElementsByClassName('favorites-h1'));
        var arraypfirst = Array.from(document.getElementsByClassName('favorites-p-first'));
        var arraypsecond = Array.from(document.getElementsByClassName('favorites-p-second'));
        var arraydiv = Array.from(document.getElementsByName('favorites-div'));
        for (var c = 0; c < arraydiv.length; c++) if (arraydiv[c].id == "") {
          arrayimg[c].src = randomUserApiMock[i].picture_large;
          var firstName = "";
          var lastName = "";
          var g = 0;
          for (; g < randomUserApiMock[i].full_name.length; g++) {
            if (randomUserApiMock[i].full_name[g] == " ") {
              g++;
              break;
            }
            firstName += randomUserApiMock[i].full_name[g];
          }
          for (; g < randomUserApiMock[i].full_name.length; g++) {
            lastName += randomUserApiMock[i].full_name[g];
          }
          arrayh1[c].innerHTML = firstName + "<br>" + lastName;
          arraypfirst[c].innerHTML = randomUserApiMock[i].course;
          arraypsecond[c].innerHTML = randomUserApiMock[i].country;
          arraydiv[c].style.visibility = "visible";
          arraydiv[c].id = randomUserApiMock[i].id;
          break;
        }
        _Lab5Mock.favoriteTeachers.push({
          "picture_large": randomUserApiMock[i].picture_large,
          "id": randomUserApiMock[i].id,
          "name": randomUserApiMock[i].full_name
        });
        var starImg = document.getElementById("img-more-star");
        var indexForTeachers = 0;
        var arrayRelativeStars = Array.from(document.getElementsByClassName('teachers-div-relative'));
        var arrayTeachers = Array.from(document.getElementsByClassName('teachers-grid-item'));
        for (var _c = 0; _c < arrayTeachers.length; _c++) if (arrayTeachers[_c].id == currentMoreTeacherElement.id) indexForTeachers = _c;
        if (starImg.src === "file:///D:/Unik/Web/Lab5/emptystar.png") {
          starImg.src = "star.png";
          arrayRelativeStars[indexForTeachers].style.visibility = "visible";
        } else {
          starImg.src = "emptystar.png";
          arrayRelativeStars[indexForTeachers].style.visibility = "hidden";
        }
      } else if (isFavorite) {
        var _starImg = document.getElementById("img-more-star");
        var _indexForTeachers = 0;
        var _arrayRelativeStars = Array.from(document.getElementsByClassName('teachers-div-relative'));
        var _arrayTeachers = Array.from(document.getElementsByClassName('teachers-grid-item'));
        var arrayFavorites = Array.from(document.getElementsByName('favorites-div'));
        for (var _c2 = 0; _c2 < _arrayTeachers.length; _c2++) if (_arrayTeachers[_c2].id == currentMoreTeacherElement.id) _indexForTeachers = _c2;
        _starImg.src = "emptystar.png";
        _arrayRelativeStars[_indexForTeachers].style.visibility = "hidden";
        var indexForFavorites = 0;
        var indexForFavoriteTeachers = 0;
        for (var _c3 = 0; _c3 < arrayFavorites.length; _c3++) if (arrayFavorites[_c3].id == currentMoreTeacherElement.id) indexForFavorites = _c3;
        for (var _c4 = currentFavoritesFirstElement; _c4 < _Lab5Mock.favoriteTeachers.length; _c4++) if (_Lab5Mock.favoriteTeachers[_c4].id == currentMoreTeacherElement.id) {
          if (_c4 + 1 < _Lab5Mock.favoriteTeachers.length) indexForFavoriteTeachers = _c4 + 1;else indexForFavoriteTeachers = _c4;
          break;
        }
        var indexForRandomMock = 0;
        for (var _b = indexForFavorites; _b < 5; _b++) {
          for (var _c5 = 0; _c5 < randomUserApiMock.length; _c5++) if (randomUserApiMock[_c5].id == _Lab5Mock.favoriteTeachers[indexForFavoriteTeachers].id) {
            indexForRandomMock = _c5;
            break;
          }
          var _arrayimg = Array.from(document.getElementsByClassName('img-favorites-orange'));
          _arrayimg[_b].src = randomUserApiMock[indexForRandomMock].picture_large;
          var _arrayh = Array.from(document.getElementsByClassName('favorites-h1'));
          var _firstName = "";
          var _lastName = "";
          var _g = 0;
          for (; _g < randomUserApiMock[indexForRandomMock].full_name.length; _g++) {
            if (randomUserApiMock[indexForRandomMock].full_name[_g] == " ") {
              _g++;
              break;
            }
            _firstName += randomUserApiMock[indexForRandomMock].full_name[_g];
          }
          for (; _g < randomUserApiMock[indexForRandomMock].full_name.length; _g++) {
            _lastName += randomUserApiMock[indexForRandomMock].full_name[_g];
          }
          _arrayh[_b].innerHTML = _firstName + "<br>" + _lastName;
          var _arraypfirst = Array.from(document.getElementsByClassName('favorites-p-first'));
          _arraypfirst[_b].innerHTML = randomUserApiMock[indexForRandomMock].course;
          var _arraypsecond = Array.from(document.getElementsByClassName('favorites-p-second'));
          _arraypsecond[_b].innerHTML = randomUserApiMock[indexForRandomMock].country;
          var _arraydiv = Array.from(document.getElementsByName('favorites-div'));
          _arraydiv[_b].id = randomUserApiMock[indexForRandomMock].id;
          if (indexForFavoriteTeachers + 1 < _Lab5Mock.favoriteTeachers.length) indexForFavoriteTeachers = indexForFavoriteTeachers + 1;
        }
        //Clear favorites cells
        for (var _c6 = 0; _c6 < _Lab5Mock.favoriteTeachers.length; _c6++) if (_Lab5Mock.favoriteTeachers[_c6].id == currentMoreTeacherElementID) {
          _Lab5Mock.favoriteTeachers.splice(_c6, 1);
          break;
        }
        var _arraydiv2 = Array.from(document.getElementsByName('favorites-div'));
        for (var _g2 = currentFavoritesLastElement - 1; _g2 >= currentFavoritesFirstElement - 1; _g2--) if (_g2 > _Lab5Mock.favoriteTeachers.length - 1) {
          var _arrayimg2 = Array.from(document.getElementsByClassName('img-favorites-orange'));
          _arrayimg2[_g2 - currentFavoritesFirstElement].src = "A.png";
          var _arrayh2 = Array.from(document.getElementsByClassName('favorites-h1'));
          _arrayh2[_g2 - currentFavoritesFirstElement].innerHTML = "";
          var _arraypfirst2 = Array.from(document.getElementsByClassName('favorites-p-first'));
          _arraypfirst2[_g2 - currentFavoritesFirstElement].innerHTML = "";
          var _arraypsecond2 = Array.from(document.getElementsByClassName('favorites-p-second'));
          _arraypsecond2[_g2 - currentFavoritesFirstElement].innerHTML = "";
          _arraydiv2[_g2 - currentFavoritesFirstElement].id = "";
          arrayFavorites[_g2 - currentFavoritesFirstElement].style.visibility = "hidden";
        }
      }
      break;
    }
  }
  var favoritesValue = document.getElementById("only-favorites").checked;
  if (favoritesValue) {
    var favoritesCheckBox = document.getElementById("only-favorites");
    favoritesCheckBox.checked = true;
    onFilterChange();
  }
}
function previousFavorites() {
  if (currentFavoritesFirstElement >= 6) {
    var arraydiv = Array.from(document.getElementsByName('favorites-div'));
    currentFavoritesFirstElement -= 5;
    currentFavoritesLastElement -= 5;
    var arrayimg = Array.from(document.getElementsByClassName('img-favorites-orange'));
    var arrayh1 = Array.from(document.getElementsByClassName('favorites-h1'));
    var arraypfirst = Array.from(document.getElementsByClassName('favorites-p-first'));
    var arraypsecond = Array.from(document.getElementsByClassName('favorites-p-second'));
    for (var c = 0; c < arraydiv.length; c++) {
      var _arrayimg3 = Array.from(document.getElementsByClassName('img-favorites-orange'));
      _arrayimg3[c].src = "A.png";
      var _arrayh3 = Array.from(document.getElementsByClassName('favorites-h1'));
      _arrayh3[c].innerHTML = "";
      var _arraypfirst3 = Array.from(document.getElementsByClassName('favorites-p-first'));
      _arraypfirst3[c].innerHTML = "";
      var _arraypsecond3 = Array.from(document.getElementsByClassName('favorites-p-second'));
      _arraypsecond3[c].innerHTML = "";
      var _arraydiv3 = Array.from(document.getElementsByName('favorites-div'));
      _arraydiv3[c].id = "";
      _arraydiv3[c].style.visibility = "hidden";
    }
    var g = currentFavoritesFirstElement;
    for (; g < _Lab5Mock.favoriteTeachers.length; g++) for (var i = 0; i < randomUserApiMock.length; i++) if (randomUserApiMock[i].id == _Lab5Mock.favoriteTeachers[g].id) {
      for (var _c7 = 0; _c7 < arraydiv.length; _c7++) if (arraydiv[_c7].id == "") {
        var firstName = "";
        var lastName = "";
        var _g3 = 0;
        for (; _g3 < randomUserApiMock[i].full_name.length; _g3++) {
          if (randomUserApiMock[i].full_name[_g3] == " ") {
            _g3++;
            break;
          }
          firstName += randomUserApiMock[i].full_name[_g3];
        }
        for (; _g3 < randomUserApiMock[i].full_name.length; _g3++) {
          lastName += randomUserApiMock[i].full_name[_g3];
        }
        arrayh1[_c7].innerHTML = firstName + "<br>" + lastName;
        arraypfirst[_c7].innerHTML = randomUserApiMock[i].course;
        arraypsecond[_c7].innerHTML = randomUserApiMock[i].country;
        arrayimg[_c7].src = randomUserApiMock[i].picture_large;
        arraydiv[_c7].style.visibility = "visible";
        arraydiv[_c7].id = randomUserApiMock[i].id;
        break;
      }
    }
    for (; g < currentFavoritesLastElement; g++) {
      var _arrayimg4 = Array.from(document.getElementsByClassName('img-favorites-orange'));
      _arrayimg4[g - currentFavoritesFirstElement].src = "A.png";
      var _arrayh4 = Array.from(document.getElementsByClassName('favorites-h1'));
      _arrayh4[g - currentFavoritesFirstElement].innerHTML = "";
      var _arraypfirst4 = Array.from(document.getElementsByClassName('favorites-p-first'));
      _arraypfirst4[g - currentFavoritesFirstElement].innerHTML = "";
      var _arraypsecond4 = Array.from(document.getElementsByClassName('favorites-p-second'));
      _arraypsecond4[g - currentFavoritesFirstElement].innerHTML = "";
      var _arraydiv4 = Array.from(document.getElementsByName('favorites-div'));
      _arraydiv4[g - currentFavoritesFirstElement].id = "";
      _arraydiv4[g - currentFavoritesFirstElement].style.visibility = "hidden";
    }
  }
}
function nextFavorites() {
  if (_Lab5Mock.favoriteTeachers.length > 6) {
    var arraydiv = Array.from(document.getElementsByName('favorites-div'));
    currentFavoritesFirstElement += 5;
    currentFavoritesLastElement += 5;
    var arrayimg = Array.from(document.getElementsByClassName('img-favorites-orange'));
    var arrayh1 = Array.from(document.getElementsByClassName('favorites-h1'));
    var arraypfirst = Array.from(document.getElementsByClassName('favorites-p-first'));
    var arraypsecond = Array.from(document.getElementsByClassName('favorites-p-second'));
    for (var c = 0; c < arraydiv.length; c++) {
      var _arrayimg5 = Array.from(document.getElementsByClassName('img-favorites-orange'));
      _arrayimg5[c].src = "A.png";
      var _arrayh5 = Array.from(document.getElementsByClassName('favorites-h1'));
      _arrayh5[c].innerHTML = "";
      var _arraypfirst5 = Array.from(document.getElementsByClassName('favorites-p-first'));
      _arraypfirst5[c].innerHTML = "";
      var _arraypsecond5 = Array.from(document.getElementsByClassName('favorites-p-second'));
      _arraypsecond5[c].innerHTML = "";
      var _arraydiv5 = Array.from(document.getElementsByName('favorites-div'));
      _arraydiv5[c].id = "";
      _arraydiv5[c].style.visibility = "hidden";
    }
    var g = currentFavoritesFirstElement;
    for (; g < _Lab5Mock.favoriteTeachers.length; g++) for (var i = 0; i < randomUserApiMock.length; i++) if (randomUserApiMock[i].id == _Lab5Mock.favoriteTeachers[g].id) {
      for (var _c8 = 0; _c8 < arraydiv.length; _c8++) if (arraydiv[_c8].id == "") {
        var firstName = "";
        var lastName = "";
        var _g4 = 0;
        for (; _g4 < randomUserApiMock[i].full_name.length; _g4++) {
          if (randomUserApiMock[i].full_name[_g4] == " ") {
            _g4++;
            break;
          }
          firstName += randomUserApiMock[i].full_name[_g4];
        }
        for (; _g4 < randomUserApiMock[i].full_name.length; _g4++) {
          lastName += randomUserApiMock[i].full_name[_g4];
        }
        arrayh1[_c8].innerHTML = firstName + "<br>" + lastName;
        arraypfirst[_c8].innerHTML = randomUserApiMock[i].course;
        arraypsecond[_c8].innerHTML = randomUserApiMock[i].country;
        arrayimg[_c8].src = randomUserApiMock[i].picture_large;
        arraydiv[_c8].style.visibility = "visible";
        arraydiv[_c8].id = randomUserApiMock[i].id;
        break;
      }
    }
    for (; g < currentFavoritesLastElement; g++) {
      var _arrayimg6 = Array.from(document.getElementsByClassName('img-favorites-orange'));
      _arrayimg6[g - currentFavoritesFirstElement].src = "A.png";
      var _arrayh6 = Array.from(document.getElementsByClassName('favorites-h1'));
      _arrayh6[g - currentFavoritesFirstElement].innerHTML = "";
      var _arraypfirst6 = Array.from(document.getElementsByClassName('favorites-p-first'));
      _arraypfirst6[g - currentFavoritesFirstElement].innerHTML = "";
      var _arraypsecond6 = Array.from(document.getElementsByClassName('favorites-p-second'));
      _arraypsecond6[g - currentFavoritesFirstElement].innerHTML = "";
      var _arraydiv6 = Array.from(document.getElementsByName('favorites-div'));
      _arraydiv6[g - currentFavoritesFirstElement].id = "";
      _arraydiv6[g - currentFavoritesFirstElement].style.visibility = "hidden";
    }
  }
}
function onFilterChange() {
  var ageValue = document.getElementById("age-select").value;
  var regionValue = document.getElementById("region-select").value;
  var sexValue = document.getElementById("sex-select").value;
  var favoritesValue = document.getElementById("only-favorites").checked;
  var correctArray = [];
  var currentIndex = 0;
  var ageUpperLimit = 0;
  var ageLowerLimit = 0;
  var regionForIf = "";
  var sexForIf = "";
  var withFavorites = false;
  if (ageValue == "1831") {
    ageUpperLimit = 31;
    ageLowerLimit = 18;
  } else if (ageValue == "3299") {
    ageUpperLimit = 99;
    ageLowerLimit = 32;
  } else if (ageValue == "all") {
    ageUpperLimit = 200;
    ageLowerLimit = 0;
  }
  if (sexValue == "All") sexForIf = "";else if (sexValue == "Male") sexForIf = "male";else if (sexValue == "Female") sexForIf = "female";else if (sexValue == "Other") sexForIf = "other";
  if (regionValue == "All") regionForIf = "";else if (regionValue == "Germany") regionForIf = "Germany";else if (regionValue == "United States") regionForIf = "United States";
  if (favoritesValue) withFavorites = true;else withFavorites = false;
  for (var i = 0; i < finalSearchArray.length; i++) {
    if (finalSearchArray[i].age >= ageLowerLimit && finalSearchArray[i].age <= ageUpperLimit || finalSearchArray[i].age == undefined) if (finalSearchArray[i].country.includes(regionForIf) || finalSearchArray[i].country == undefined) if (finalSearchArray[i].gender.includes(sexForIf) || finalSearchArray[i].gender == undefined) correctArray.push(finalSearchArray[i]);
  }
  if (ageLowerLimit != 0 || ageUpperLimit != 200 || regionForIf != "" || sexForIf != "" || withFavorites) isFiltering = true;else isFiltering = false;
  var finalArray = [];
  if (withFavorites) {
    for (var _i = 0; _i < correctArray.length; _i++) for (var u = 0; u < _Lab5Mock.favoriteTeachers.length; u++) if (correctArray[_i].id == _Lab5Mock.favoriteTeachers[u].id) {
      finalArray.push(correctArray[_i]);
      break;
    }
  } else finalArray = correctArray;
  finalFilterArray = finalArray;
  var arrayStar = Array.from(document.getElementsByClassName('teachers-div-relative'));
  for (var _i2 = 0; _i2 < arrayStar.length; _i2++) arrayStar[_i2].style.visibility = "hidden";
  for (var _i3 = 0; _i3 < finalFilterArray.length && _i3 < 10; _i3++, currentIndex++) {
    var arrayimg = Array.from(document.getElementsByClassName('img-teachers-orange'));
    var arrayh1 = Array.from(document.getElementsByClassName('teachers-h1'));
    var arraydiv = Array.from(document.getElementsByClassName('teachers-grid-item'));
    var arraypfirst = Array.from(document.getElementsByClassName('teachers-p-first'));
    var arraypsecond = Array.from(document.getElementsByClassName('teachers-p-second'));
    arrayimg[_i3].src = finalFilterArray[_i3].picture_large;
    var firstName = "";
    var lastName = "";
    var c = 0;
    for (; c < finalFilterArray[_i3].full_name.length; c++) {
      if (finalFilterArray[_i3].full_name[c] == " ") {
        c++;
        break;
      }
      firstName += finalFilterArray[_i3].full_name[c];
    }
    for (; c < finalFilterArray[_i3].full_name.length; c++) lastName += finalFilterArray[_i3].full_name[c];
    arrayh1[_i3].innerHTML = firstName + "<br>" + lastName;
    arraydiv[_i3].id = finalFilterArray[_i3].id;
    arraydiv[_i3].style.visibility = "visible";
    arraypfirst[_i3].innerHTML = finalFilterArray[_i3].course;
    arraypsecond[_i3].innerHTML = finalFilterArray[_i3].country;
    if (withFavorites) arrayStar[_i3].style.visibility = "visible";
    if (!withFavorites) for (var g = 0; g < _Lab5Mock.favoriteTeachers.length; g++) if (finalFilterArray[_i3].id == _Lab5Mock.favoriteTeachers[g].id) {
      arrayStar[_i3].style.visibility = "visible";
      break;
    }
  }
  for (; currentIndex < 10; currentIndex++) {
    var _arraydiv7 = Array.from(document.getElementsByClassName('teachers-grid-item'));
    _arraydiv7[currentIndex].id = "";
    _arraydiv7[currentIndex].style.visibility = "hidden";
  }
  finalStatisticsArray = [];
  statisticsFinalArrayToSort = [];
  finalFilterArray.forEach(function (el) {
    finalStatisticsArray.push({
      "name": el.full_name,
      "specialty": el.course,
      "age": el.age,
      "gender": el.gender,
      "nationality": el.country
    });
    statisticsFinalArrayToSort.push({
      "name": el.full_name,
      "specialty": el.course,
      "age": el.age,
      "gender": el.gender,
      "nationality": el.country
    });
  });
  if (finalStatisticsArray.length != 0) {
    totalCount = Math.ceil(finalStatisticsArray.length / 10);
    while (currentStatisticsPage > totalCount) currentStatisticsPage--;
  } else {
    currentStatisticsPage = 1;
    totalCount = 1;
  }
  if (sortName) sortByName(true);
  if (sortSpecialty) sortBySpecialty(true);
  if (sortAge) sortByAge(true);
  if (sortGender) sortByGender(true);
  if (sortNationality) sortByNationality(true);
  setStatisticsData();
  currentDisplayedTeachersIndex = 0;
}
function sortByName(addObject) {
  sortSpecialty = false;
  sortAge = false;
  sortGender = false;
  sortNationality = false;
  var thFirst = document.getElementById("th-first");
  if (statisticsCurrentElementID != undefined && statisticsCurrentElementID != thFirst.id) {
    var currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    var images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for (var i = 0; i < finalStatisticsArray.length; i++) statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thFirst.id;
  thFirst.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  var arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  var arrayName = Array.from(document.getElementsByName('td-name'));
  var arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  var arrayAge = Array.from(document.getElementsByName('td-age'));
  var arrayGender = Array.from(document.getElementsByName('td-gender'));
  var arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if (arrayimg[0].style.visibility == "visible") {
    if (arrayimg[0].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png") {
      if (!addObject) {
        arrayimg[0].src = "arrowup.png";
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.name != undefined && b.name != undefined) {
            var fa = a.name.toLowerCase(),
              _fb = b.name.toLowerCase();
            if (fa < _fb) {
              return 1;
            }
            if (fa > _fb) {
              return -1;
            }
            return 0;
          }
        });
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.name != undefined && b.name != undefined) {
            var fa = a.name.toLowerCase(),
              _fb2 = b.name.toLowerCase();
            if (fa < _fb2) {
              return -1;
            }
            if (fa > _fb2) {
              return 1;
            }
            return 0;
          }
        });
      }
      for (var _i4 = 0; _i4 < 10; _i4++) {
        if (statisticsFinalArrayToSort[_i4 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i4].innerHTML = statisticsFinalArrayToSort[_i4 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i4].innerHTML = statisticsFinalArrayToSort[_i4 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i4].innerHTML = statisticsFinalArrayToSort[_i4 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i4].innerHTML = statisticsFinalArrayToSort[_i4 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i4].innerHTML = statisticsFinalArrayToSort[_i4 + (currentStatisticsPage - 1) * 10].nationality;
          sortName = true;
        }
      }
    } else {
      if (!addObject) {
        arrayimg[0].style.visibility = "hidden";
        thFirst.style = "border-bottom: solid 0px  #000; background-color: white;";
        arrayimg[0].src = "arrowdown.png";
        for (var _i5 = 0; _i5 < 10; _i5++) {
          if (finalStatisticsArray[_i5 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i5].innerHTML = finalStatisticsArray[_i5 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i5].innerHTML = finalStatisticsArray[_i5 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i5].innerHTML = finalStatisticsArray[_i5 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i5].innerHTML = finalStatisticsArray[_i5 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i5].innerHTML = finalStatisticsArray[_i5 + (currentStatisticsPage - 1) * 10].nationality;
            sortName = false;
          }
        }
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.name != undefined && b.name != undefined) {
            var fa = a.name.toLowerCase(),
              _fb3 = b.name.toLowerCase();
            if (fa < _fb3) {
              return 1;
            }
            if (fa > _fb3) {
              return -1;
            }
            return 0;
          }
        });
        for (var _i6 = 0; _i6 < 10; _i6++) {
          if (statisticsFinalArrayToSort[_i6 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i6].innerHTML = statisticsFinalArrayToSort[_i6 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i6].innerHTML = statisticsFinalArrayToSort[_i6 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i6].innerHTML = statisticsFinalArrayToSort[_i6 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i6].innerHTML = statisticsFinalArrayToSort[_i6 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i6].innerHTML = statisticsFinalArrayToSort[_i6 + (currentStatisticsPage - 1) * 10].nationality;
            sortName = true;
          }
        }
      }
    }
  } else {
    if (!addObject) {
      statisticsFinalArrayToSort.sort(function (a, b) {
        arrayimg[0].style.visibility = "visible";
        if (a.name != undefined && b.name != undefined) {
          var fa = a.name.toLowerCase(),
            _fb4 = b.name.toLowerCase();
          if (fa < _fb4) {
            return -1;
          }
          if (fa > _fb4) {
            return 1;
          }
          return 0;
        }
      });
      for (var _i7 = 0; _i7 < 10; _i7++) {
        if (statisticsFinalArrayToSort[_i7 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i7].innerHTML = statisticsFinalArrayToSort[_i7 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i7].innerHTML = statisticsFinalArrayToSort[_i7 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i7].innerHTML = statisticsFinalArrayToSort[_i7 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i7].innerHTML = statisticsFinalArrayToSort[_i7 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i7].innerHTML = statisticsFinalArrayToSort[_i7 + (currentStatisticsPage - 1) * 10].nationality;
          sortName = true;
        }
      }
    } else {
      for (var _i8 = 0; _i8 < 10; _i8++) {
        if (finalStatisticsArray[_i8 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i8].innerHTML = finalStatisticsArray[_i8 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i8].innerHTML = finalStatisticsArray[_i8 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i8].innerHTML = finalStatisticsArray[_i8 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i8].innerHTML = finalStatisticsArray[_i8 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i8].innerHTML = finalStatisticsArray[_i8 + (currentStatisticsPage - 1) * 10].nationality;
          sortName = false;
        }
      }
    }
  }
}
function sortBySpecialty(addObject) {
  sortName = false;
  sortAge = false;
  sortGender = false;
  sortNationality = false;
  var thSecond = document.getElementById("th-second");
  if (statisticsCurrentElementID != undefined && statisticsCurrentElementID != thSecond.id) {
    var currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    var images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for (var i = 0; i < finalStatisticsArray.length; i++) statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thSecond.id;
  thSecond.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  var arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  var arrayName = Array.from(document.getElementsByName('td-name'));
  var arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  var arrayAge = Array.from(document.getElementsByName('td-age'));
  var arrayGender = Array.from(document.getElementsByName('td-gender'));
  var arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if (arrayimg[1].style.visibility == "visible") {
    if (arrayimg[1].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png") {
      if (!addObject) {
        arrayimg[1].src = "arrowup.png";
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.specialty != undefined && b.specialty != undefined) {
            var fa = a.specialty.toLowerCase(),
              _fb5 = b.specialty.toLowerCase();
            if (fa < _fb5) {
              return 1;
            }
            if (fa > _fb5) {
              return -1;
            }
            return 0;
          }
        });
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.specialty != undefined && b.specialty != undefined) {
            var fa = a.specialty.toLowerCase(),
              _fb6 = b.specialty.toLowerCase();
            if (fa < _fb6) {
              return -1;
            }
            if (fa > _fb6) {
              return 1;
            }
            return 0;
          }
        });
      }
      for (var _i9 = 0; _i9 < 10; _i9++) {
        if (statisticsFinalArrayToSort[_i9 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i9].innerHTML = statisticsFinalArrayToSort[_i9 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i9].innerHTML = statisticsFinalArrayToSort[_i9 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i9].innerHTML = statisticsFinalArrayToSort[_i9 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i9].innerHTML = statisticsFinalArrayToSort[_i9 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i9].innerHTML = statisticsFinalArrayToSort[_i9 + (currentStatisticsPage - 1) * 10].nationality;
          sortSpecialty = true;
        }
      }
    } else {
      if (!addObject) {
        arrayimg[1].style.visibility = "hidden";
        thSecond.style = "border-bottom: solid 0px  #000; background-color: white;";
        arrayimg[1].src = "arrowdown.png";
        for (var _i10 = 0; _i10 < 10; _i10++) {
          if (finalStatisticsArray[_i10 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i10].innerHTML = finalStatisticsArray[_i10 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i10].innerHTML = finalStatisticsArray[_i10 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i10].innerHTML = finalStatisticsArray[_i10 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i10].innerHTML = finalStatisticsArray[_i10 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i10].innerHTML = finalStatisticsArray[_i10 + (currentStatisticsPage - 1) * 10].nationality;
            sortSpecialty = false;
          }
        }
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.specialty != undefined && b.specialty != undefined) {
            var fa = a.specialty.toLowerCase();
            fb = b.specialty.toLowerCase();
            if (fa < fb) {
              return 1;
            }
            if (fa > fb) {
              return -1;
            }
            return 0;
          }
        });
        for (var _i11 = 0; _i11 < 10; _i11++) {
          if (statisticsFinalArrayToSort[_i11 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i11].innerHTML = statisticsFinalArrayToSort[_i11 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i11].innerHTML = statisticsFinalArrayToSort[_i11 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i11].innerHTML = statisticsFinalArrayToSort[_i11 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i11].innerHTML = statisticsFinalArrayToSort[_i11 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i11].innerHTML = statisticsFinalArrayToSort[_i11 + (currentStatisticsPage - 1) * 10].nationality;
            sortSpecialty = true;
          }
        }
      }
    }
  } else {
    if (!addObject) {
      arrayimg[1].style.visibility = "visible";
      statisticsFinalArrayToSort.sort(function (a, b) {
        if (a.specialty != undefined && b.specialty != undefined) {
          var fa = a.specialty.toLowerCase(),
            _fb7 = b.specialty.toLowerCase();
          if (fa < _fb7) {
            return -1;
          }
          if (fa > _fb7) {
            return 1;
          }
          return 0;
        }
      });
      for (var _i12 = 0; _i12 < 10; _i12++) {
        if (statisticsFinalArrayToSort[_i12 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i12].innerHTML = statisticsFinalArrayToSort[_i12 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i12].innerHTML = statisticsFinalArrayToSort[_i12 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i12].innerHTML = statisticsFinalArrayToSort[_i12 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i12].innerHTML = statisticsFinalArrayToSort[_i12 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i12].innerHTML = statisticsFinalArrayToSort[_i12 + (currentStatisticsPage - 1) * 10].nationality;
          sortSpecialty = true;
        }
      }
    } else {
      for (var _i13 = 0; _i13 < 10; _i13++) {
        if (finalStatisticsArray[_i13 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i13].innerHTML = finalStatisticsArray[_i13 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i13].innerHTML = finalStatisticsArray[_i13 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i13].innerHTML = finalStatisticsArray[_i13 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i13].innerHTML = finalStatisticsArray[_i13 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i13].innerHTML = finalStatisticsArray[_i13 + (currentStatisticsPage - 1) * 10].nationality;
          sortSpecialty = false;
        }
      }
    }
  }
}
function sortByAge(addObject) {
  sortSpecialty = false;
  sortName = false;
  sortGender = false;
  sortNationality = false;
  var thThird = document.getElementById("th-third");
  if (statisticsCurrentElementID != undefined && statisticsCurrentElementID != thThird.id) {
    var currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    var images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for (var i = 0; i < finalStatisticsArray.length; i++) statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thThird.id;
  thThird.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  var arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  var arrayName = Array.from(document.getElementsByName('td-name'));
  var arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  var arrayAge = Array.from(document.getElementsByName('td-age'));
  var arrayGender = Array.from(document.getElementsByName('td-gender'));
  var arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if (arrayimg[2].style.visibility == "visible") {
    if (arrayimg[2].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png") {
      if (!addObject) {
        arrayimg[2].src = "arrowup.png";
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.age != undefined && b.age != undefined) return b.age - a.age;
        });
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.age != undefined && b.age != undefined) return a.age - b.age;
        });
      }
      for (var _i14 = 0; _i14 < 10; _i14++) {
        if (statisticsFinalArrayToSort[_i14 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i14].innerHTML = statisticsFinalArrayToSort[_i14 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i14].innerHTML = statisticsFinalArrayToSort[_i14 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i14].innerHTML = statisticsFinalArrayToSort[_i14 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i14].innerHTML = statisticsFinalArrayToSort[_i14 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i14].innerHTML = statisticsFinalArrayToSort[_i14 + (currentStatisticsPage - 1) * 10].nationality;
          sortAge = true;
        }
      }
    } else {
      if (!addObject) {
        arrayimg[2].style.visibility = "hidden";
        thThird.style = "border-bottom: solid 0px  #000; background-color: white;";
        arrayimg[2].src = "arrowdown.png";
        for (var _i15 = 0; _i15 < 10; _i15++) {
          if (finalStatisticsArray[_i15 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i15].innerHTML = finalStatisticsArray[_i15 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i15].innerHTML = finalStatisticsArray[_i15 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i15].innerHTML = finalStatisticsArray[_i15 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i15].innerHTML = finalStatisticsArray[_i15 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i15].innerHTML = finalStatisticsArray[_i15 + (currentStatisticsPage - 1) * 10].nationality;
            sortAge = false;
          }
        }
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.age != undefined && b.age != undefined) return b.age - a.age;
        });
        for (var _i16 = 0; _i16 < 10; _i16++) {
          if (statisticsFinalArrayToSort[_i16 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i16].innerHTML = statisticsFinalArrayToSort[_i16 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i16].innerHTML = statisticsFinalArrayToSort[_i16 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i16].innerHTML = statisticsFinalArrayToSort[_i16 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i16].innerHTML = statisticsFinalArrayToSort[_i16 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i16].innerHTML = statisticsFinalArrayToSort[_i16 + (currentStatisticsPage - 1) * 10].nationality;
            sortAge = true;
          }
        }
      }
    }
  } else {
    if (!addObject) {
      statisticsFinalArrayToSort.sort(function (a, b) {
        if (a.age != undefined && b.age != undefined) return a.age - b.age;
      });
      for (var _i17 = 0; _i17 < 10; _i17++) {
        if (statisticsFinalArrayToSort[_i17 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i17].innerHTML = statisticsFinalArrayToSort[_i17 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i17].innerHTML = statisticsFinalArrayToSort[_i17 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i17].innerHTML = statisticsFinalArrayToSort[_i17 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i17].innerHTML = statisticsFinalArrayToSort[_i17 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i17].innerHTML = statisticsFinalArrayToSort[_i17 + (currentStatisticsPage - 1) * 10].nationality;
          sortAge = true;
        }
      }
      arrayimg[2].style.visibility = "visible";
    } else {
      for (var _i18 = 0; _i18 < 10; _i18++) {
        if (finalStatisticsArray[_i18 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i18].innerHTML = finalStatisticsArray[_i18 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i18].innerHTML = finalStatisticsArray[_i18 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i18].innerHTML = finalStatisticsArray[_i18 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i18].innerHTML = finalStatisticsArray[_i18 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i18].innerHTML = finalStatisticsArray[_i18 + (currentStatisticsPage - 1) * 10].nationality;
          sortAge = false;
        }
      }
    }
  }
}
function sortByGender(addObject) {
  sortSpecialty = false;
  sortAge = false;
  sortName = false;
  sortNationality = false;
  var thFourth = document.getElementById("th-fourth");
  if (statisticsCurrentElementID != undefined && statisticsCurrentElementID != thFourth.id) {
    var currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    var images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for (var i = 0; i < finalStatisticsArray.length; i++) statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thFourth.id;
  thFourth.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  var arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  var arrayName = Array.from(document.getElementsByName('td-name'));
  var arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  var arrayAge = Array.from(document.getElementsByName('td-age'));
  var arrayGender = Array.from(document.getElementsByName('td-gender'));
  var arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if (arrayimg[3].style.visibility == "visible") {
    if (arrayimg[3].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png") {
      if (!addObject) {
        arrayimg[3].src = "arrowup.png";
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.gender != undefined && b.gender != undefined) {
            var fa = a.gender.toLowerCase(),
              _fb8 = b.gender.toLowerCase();
            if (fa < _fb8) {
              return 1;
            }
            if (fa > _fb8) {
              return -1;
            }
            return 0;
          }
        });
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.gender != undefined && b.gender != undefined) {
            var fa = a.gender.toLowerCase(),
              _fb9 = b.gender.toLowerCase();
            if (fa < _fb9) {
              return -1;
            }
            if (fa > _fb9) {
              return 1;
            }
            return 0;
          }
        });
      }
      for (var _i19 = 0; _i19 < 10; _i19++) {
        if (statisticsFinalArrayToSort[_i19 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i19].innerHTML = statisticsFinalArrayToSort[_i19 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i19].innerHTML = statisticsFinalArrayToSort[_i19 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i19].innerHTML = statisticsFinalArrayToSort[_i19 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i19].innerHTML = statisticsFinalArrayToSort[_i19 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i19].innerHTML = statisticsFinalArrayToSort[_i19 + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
        }
      }
    } else {
      if (!addObject) {
        arrayimg[3].style.visibility = "hidden";
        thFourth.style = "border-bottom: solid 0px  #000; background-color: white;";
        arrayimg[3].src = "arrowdown.png";
        for (var _i20 = 0; _i20 < 10; _i20++) {
          if (finalStatisticsArray[_i20 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i20].innerHTML = finalStatisticsArray[_i20 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i20].innerHTML = finalStatisticsArray[_i20 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i20].innerHTML = finalStatisticsArray[_i20 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i20].innerHTML = finalStatisticsArray[_i20 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i20].innerHTML = finalStatisticsArray[_i20 + (currentStatisticsPage - 1) * 10].nationality;
            sortGender = false;
          }
        }
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.gender != undefined && b.gender != undefined) {
            var fa = a.gender.toLowerCase(),
              _fb10 = b.gender.toLowerCase();
            if (fa < _fb10) {
              return 1;
            }
            if (fa > _fb10) {
              return -1;
            }
            return 0;
          }
        });
        for (var _i21 = 0; _i21 < 10; _i21++) {
          if (statisticsFinalArrayToSort[_i21 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i21].innerHTML = statisticsFinalArrayToSort[_i21 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i21].innerHTML = statisticsFinalArrayToSort[_i21 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i21].innerHTML = statisticsFinalArrayToSort[_i21 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i21].innerHTML = statisticsFinalArrayToSort[_i21 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i21].innerHTML = statisticsFinalArrayToSort[_i21 + (currentStatisticsPage - 1) * 10].nationality;
            sortGender = true;
          }
        }
      }
    }
  } else {
    if (!addObject) {
      statisticsFinalArrayToSort.sort(function (a, b) {
        if (a.gender != undefined && b.gender != undefined) {
          var fa = a.gender.toLowerCase(),
            _fb11 = b.gender.toLowerCase();
          if (fa < _fb11) {
            return -1;
          }
          if (fa > _fb11) {
            return 1;
          }
          return 0;
        }
      });
      for (var _i22 = 0; _i22 < 10; _i22++) {
        if (statisticsFinalArrayToSort[_i22 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i22].innerHTML = statisticsFinalArrayToSort[_i22 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i22].innerHTML = statisticsFinalArrayToSort[_i22 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i22].innerHTML = statisticsFinalArrayToSort[_i22 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i22].innerHTML = statisticsFinalArrayToSort[_i22 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i22].innerHTML = statisticsFinalArrayToSort[_i22 + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
        }
      }
      arrayimg[3].style.visibility = "visible";
    } else {
      for (var _i23 = 0; _i23 < 10; _i23++) {
        if (finalStatisticsArray[_i23 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i23].innerHTML = finalStatisticsArray[_i23 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i23].innerHTML = finalStatisticsArray[_i23 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i23].innerHTML = finalStatisticsArray[_i23 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i23].innerHTML = finalStatisticsArray[_i23 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i23].innerHTML = finalStatisticsArray[_i23 + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = false;
        }
      }
    }
  }
}
function sortByNationality(addObject) {
  sortSpecialty = false;
  sortAge = false;
  sortGender = false;
  sortName = false;
  var thFifth = document.getElementById("th-fifth");
  if (statisticsCurrentElementID != undefined && statisticsCurrentElementID != thFifth.id) {
    var currentStatisticsElement = document.getElementById(statisticsCurrentElementID);
    currentStatisticsElement.style = "border-bottom: solid 0px  #000; background-color: white;";
    var images = currentStatisticsElement.getElementsByTagName('img');
    images[0].style.visibility = "hidden";
    images[0].src = "arrowdown.png";
  }
  statisticsFinalArrayToSort = [];
  for (var i = 0; i < finalStatisticsArray.length; i++) statisticsFinalArrayToSort.push(finalStatisticsArray[i]);
  statisticsCurrentElementID = thFifth.id;
  thFifth.style = "border-bottom: solid 3px  #000; background-color: lightgrey;";
  var arrayimg = Array.from(document.getElementsByClassName('statistics-arrow'));
  var arrayName = Array.from(document.getElementsByName('td-name'));
  var arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  var arrayAge = Array.from(document.getElementsByName('td-age'));
  var arrayGender = Array.from(document.getElementsByName('td-gender'));
  var arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if (arrayimg[4].style.visibility == "visible") {
    if (arrayimg[4].src == "file:///D:/Unik/%D0%92%D0%B5%D0%B1-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%20%D1%96%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%D0%B2/Lab5/arrowdown.png") {
      if (!addObject) {
        arrayimg[4].src = "arrowup.png";
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.nationality != undefined && b.nationality != undefined) {
            var fa = a.nationality.toLowerCase(),
              _fb12 = b.nationality.toLowerCase();
            if (fa < _fb12) {
              return 1;
            }
            if (fa > _fb12) {
              return -1;
            }
            return 0;
          }
        });
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.nationality != undefined && b.nationality != undefined) {
            var fa = a.nationality.toLowerCase(),
              _fb13 = b.nationality.toLowerCase();
            if (fa < _fb13) {
              return -1;
            }
            if (fa > _fb13) {
              return 1;
            }
            return 0;
          }
        });
      }
      for (var _i24 = 0; _i24 < 10; _i24++) {
        if (statisticsFinalArrayToSort[_i24 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i24].innerHTML = statisticsFinalArrayToSort[_i24 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i24].innerHTML = statisticsFinalArrayToSort[_i24 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i24].innerHTML = statisticsFinalArrayToSort[_i24 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i24].innerHTML = statisticsFinalArrayToSort[_i24 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i24].innerHTML = statisticsFinalArrayToSort[_i24 + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
        }
      }
    } else {
      if (!addObject) {
        arrayimg[4].style.visibility = "hidden";
        thFifth.style = "border-bottom: solid 0px  #000; background-color: white;";
        arrayimg[4].src = "arrowdown.png";
        for (var _i25 = 0; _i25 < 10; _i25++) {
          if (finalStatisticsArray[_i25 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i25].innerHTML = finalStatisticsArray[_i25 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i25].innerHTML = finalStatisticsArray[_i25 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i25].innerHTML = finalStatisticsArray[_i25 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i25].innerHTML = finalStatisticsArray[_i25 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i25].innerHTML = finalStatisticsArray[_i25 + (currentStatisticsPage - 1) * 10].nationality;
            sortGender = false;
          }
        }
      } else {
        statisticsFinalArrayToSort.sort(function (a, b) {
          if (a.nationality != undefined && b.nationality != undefined) {
            var fa = a.nationality.toLowerCase(),
              _fb14 = b.nationality.toLowerCase();
            if (fa < _fb14) {
              return 1;
            }
            if (fa > _fb14) {
              return -1;
            }
            return 0;
          }
        });
        for (var _i26 = 0; _i26 < 10; _i26++) {
          if (statisticsFinalArrayToSort[_i26 + (currentStatisticsPage - 1) * 10] != undefined) {
            arrayName[_i26].innerHTML = statisticsFinalArrayToSort[_i26 + (currentStatisticsPage - 1) * 10].name;
            arraySpecialty[_i26].innerHTML = statisticsFinalArrayToSort[_i26 + (currentStatisticsPage - 1) * 10].specialty;
            arrayAge[_i26].innerHTML = statisticsFinalArrayToSort[_i26 + (currentStatisticsPage - 1) * 10].age;
            arrayGender[_i26].innerHTML = statisticsFinalArrayToSort[_i26 + (currentStatisticsPage - 1) * 10].gender;
            arrayNationality[_i26].innerHTML = statisticsFinalArrayToSort[_i26 + (currentStatisticsPage - 1) * 10].nationality;
            sortGender = true;
          }
        }
      }
    }
  } else {
    if (!addObject) {
      statisticsFinalArrayToSort.sort(function (a, b) {
        if (a.nationality != undefined && b.nationality != undefined) {
          var fa = a.nationality.toLowerCase(),
            _fb15 = b.nationality.toLowerCase();
          if (fa < _fb15) {
            return -1;
          }
          if (fa > _fb15) {
            return 1;
          }
          return 0;
        }
      });
      for (var _i27 = 0; _i27 < 10; _i27++) {
        if (statisticsFinalArrayToSort[_i27 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i27].innerHTML = statisticsFinalArrayToSort[_i27 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i27].innerHTML = statisticsFinalArrayToSort[_i27 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i27].innerHTML = statisticsFinalArrayToSort[_i27 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i27].innerHTML = statisticsFinalArrayToSort[_i27 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i27].innerHTML = statisticsFinalArrayToSort[_i27 + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = true;
        }
      }
      arrayimg[4].style.visibility = "visible";
    } else {
      for (var _i28 = 0; _i28 < 10; _i28++) {
        if (finalStatisticsArray[_i28 + (currentStatisticsPage - 1) * 10] != undefined) {
          arrayName[_i28].innerHTML = finalStatisticsArray[_i28 + (currentStatisticsPage - 1) * 10].name;
          arraySpecialty[_i28].innerHTML = finalStatisticsArray[_i28 + (currentStatisticsPage - 1) * 10].specialty;
          arrayAge[_i28].innerHTML = finalStatisticsArray[_i28 + (currentStatisticsPage - 1) * 10].age;
          arrayGender[_i28].innerHTML = finalStatisticsArray[_i28 + (currentStatisticsPage - 1) * 10].gender;
          arrayNationality[_i28].innerHTML = finalStatisticsArray[_i28 + (currentStatisticsPage - 1) * 10].nationality;
          sortGender = false;
        }
      }
    }
  }
}
function statisticsButton(elemID) {
  var firstButton = document.getElementById("statistics-first-button");
  var secondButton = document.getElementById("statistics-second-button");
  var thirdButton = document.getElementById("statistics-third-button");
  var fourthButton = document.getElementById("statistics-fourth-button");
  var lastButton = document.getElementById("statistics-last-button");
  var pointsButton = document.getElementById("statistics-points");
  if (elemID == "statistics-first-button") {
    currentStatisticsPage = 1;
    secondButton.innerHTML = (currentStatisticsPage + 1).toString();
    thirdButton.innerHTML = (currentStatisticsPage + 2).toString();
    fourthButton.innerHTML = (currentStatisticsPage + 3).toString();
    lastButton.innerHTML = "Last";
    pointsButton.innerHTML = "...";
    pointsButton.style = "  color: black; background-color: white;";
    setStatisticsData();
  } else if (elemID == "statistics-second-button") {
    currentStatisticsPage = parseFloat(secondButton.innerHTML);
    if (currentStatisticsPage != 2 && currentStatisticsPage != 3) secondButton.innerHTML = (currentStatisticsPage + -1).toString();else secondButton.innerHTML = 2 .toString();
    if (currentStatisticsPage != 2 && currentStatisticsPage != 3) thirdButton.innerHTML = currentStatisticsPage.toString();else thirdButton.innerHTML = 3 .toString();
    if (currentStatisticsPage != 2 && currentStatisticsPage != 3) fourthButton.innerHTML = (currentStatisticsPage + 1).toString();else fourthButton.innerHTML = 4 .toString();
    lastButton.innerHTML = "Last";
    pointsButton.innerHTML = "...";
    pointsButton.style = "  color: black; background-color: white;";
    setStatisticsData();
  } else if (elemID == "statistics-third-button") {
    currentStatisticsPage = parseFloat(thirdButton.innerHTML);
    if (currentStatisticsPage != 2 && currentStatisticsPage != 3) secondButton.innerHTML = (currentStatisticsPage + -1).toString();else secondButton.innerHTML = 2 .toString();
    if (currentStatisticsPage != 2 && currentStatisticsPage != 3) thirdButton.innerHTML = currentStatisticsPage.toString();else thirdButton.innerHTML = 3 .toString();
    if (currentStatisticsPage != 2 && currentStatisticsPage != 3) fourthButton.innerHTML = (currentStatisticsPage + 1).toString();
    setStatisticsData();
  } else if (elemID == "statistics-fourth-button") {
    currentStatisticsPage = parseFloat(fourthButton.innerHTML);
    if (totalCount > 5) {
      if (currentStatisticsPage <= totalCount - 2) {
        if (currentStatisticsPage != 2 && currentStatisticsPage != 3) {
          secondButton.innerHTML = (currentStatisticsPage - 1).toString();
          thirdButton.innerHTML = currentStatisticsPage.toString();
          fourthButton.innerHTML = (currentStatisticsPage + 1).toString();
        } else secondButton.innerHTML = 2 .toString();
        if (currentStatisticsPage >= totalCount - 2) {
          pointsButton.innerHTML = totalCount.toString();
          lastButton.innerHTML = "";
          pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
        }
        setStatisticsData();
      } else if (currentStatisticsPage < totalCount - 1) {
        secondButton.innerHTML = (currentStatisticsPage - 1).toString();
        thirdButton.innerHTML = currentStatisticsPage.toString();
        fourthButton.innerHTML = (currentStatisticsPage + 1).toString();
        pointsButton.innerHTML = totalCount.toString();
        lastButton.innerHTML = "";
        pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
        setStatisticsData();
      }
    } else {
      secondButton.innerHTML = (currentStatisticsPage - 2).toString();
      thirdButton.innerHTML = (currentStatisticsPage - 1).toString();
      fourthButton.innerHTML = currentStatisticsPage.toString();
      pointsButton.innerHTML = (currentStatisticsPage + 1).toString();
      lastButton.innerHTML = "";
      pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
      setStatisticsData();
    }
  } else if (elemID == "statistics-last-button" || elemID == "statistics-points") {
    currentStatisticsPage = totalCount;
    pointsButton.innerHTML = totalCount.toString();
    fourthButton.innerHTML = (totalCount - 1).toString();
    thirdButton.innerHTML = (totalCount - 2).toString();
    secondButton.innerHTML = (totalCount - 3).toString();
    lastButton.innerHTML = "";
    pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
    setStatisticsData();
  }
}
function checkStatisticsButton() {
  var firstButton = document.getElementById("statistics-first-button");
  var secondButton = document.getElementById("statistics-second-button");
  var thirdButton = document.getElementById("statistics-third-button");
  var fourthButton = document.getElementById("statistics-fourth-button");
  var lastButton = document.getElementById("statistics-last-button");
  var pointsButton = document.getElementById("statistics-points");
  if (totalCount == 1) {
    secondButton.innerHTML = "";
    thirdButton.innerHTML = "";
    fourthButton.innerHTML = "";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  } else if (totalCount == 2) {
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "";
    fourthButton.innerHTML = "";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  } else if (totalCount == 3) {
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "3";
    fourthButton.innerHTML = "";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  } else if (totalCount == 4) {
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "3";
    fourthButton.innerHTML = "4";
    lastButton.innerHTML = "";
    pointsButton.innerHTML = "";
  } else if (totalCount == 5) {
    secondButton.innerHTML = "2";
    thirdButton.innerHTML = "3";
    fourthButton.innerHTML = "4";
    pointsButton.innerHTML = "5";
    lastButton.innerHTML = "";
    pointsButton.style = "  color: #0096FF; background-color: white; cursor: pointer;";
  } else if (totalCount > 5 && currentStatisticsPage == totalCount - 1) {
    secondButton.innerHTML = (totalCount - 3).toString();
    thirdButton.innerHTML = (totalCount - 2).toString();
    fourthButton.innerHTML = (totalCount - 1).toString();
    pointsButton.innerHTML = totalCount.toString();
    lastButton.innerHTML = "";
  }
}
function setStatisticsData() {
  var lastIndex = -1;
  var arrayName = Array.from(document.getElementsByName('td-name'));
  var arraySpecialty = Array.from(document.getElementsByName('td-specialty'));
  var arrayAge = Array.from(document.getElementsByName('td-age'));
  var arrayGender = Array.from(document.getElementsByName('td-gender'));
  var arrayNationality = Array.from(document.getElementsByName('td-nationality'));
  if (statisticsFinalArrayToSort.length == 0) lastIndex = 0;
  for (var i = (currentStatisticsPage - 1) * 10; i < statisticsFinalArrayToSort.length && i < currentStatisticsPage * 10; i++) {
    if (i == statisticsFinalArrayToSort.length - 1) lastIndex = i - (currentStatisticsPage - 1) * 10 + 1;
    arrayName[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].name;
    arraySpecialty[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].specialty;
    arrayAge[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].age;
    arrayGender[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].gender;
    arrayNationality[i - (currentStatisticsPage - 1) * 10].innerHTML = statisticsFinalArrayToSort[i].nationality;
  }
  if (lastIndex != -1) {
    for (var _i29 = lastIndex; _i29 < arrayName.length; _i29++) {
      arrayName[_i29].innerHTML = "";
      arraySpecialty[_i29].innerHTML = "";
      arrayAge[_i29].innerHTML = "";
      arrayGender[_i29].innerHTML = "";
      arrayNationality[_i29].innerHTML = "";
    }
  }
  checkStatisticsButton();
}
function searchOnChange() {
  finalSearchArray = [];
  var teacherSearch = document.getElementById("teacher-search");
  if (teacherSearch.value) {
    isSearching = true;
    var i = 0;
    var firstWord = "";
    var secondWord = "";
    var thirdWord = "";
    for (; i < teacherSearch.value.length; i++) {
      if (teacherSearch.value[i] != ',' && teacherSearch.value[i] != '.' && teacherSearch.value[i] != ' ') firstWord += teacherSearch.value[i];else {
        i++;
        while (teacherSearch.value[i] == ',' || teacherSearch.value[i] == '.' || teacherSearch.value[i] == ' ') i++;
        break;
      }
    }
    for (; i < teacherSearch.value.length; i++) {
      if (teacherSearch.value[i] != ',' && teacherSearch.value[i] != '.' && teacherSearch.value[i] != ' ') secondWord += teacherSearch.value[i];else {
        i++;
        while (teacherSearch.value[i] == ',' || teacherSearch.value[i] == '.' || teacherSearch.value[i] == ' ') i++;
        break;
      }
    }
    for (; i < teacherSearch.value.length; i++) {
      if (teacherSearch.value[i] != ',' && teacherSearch.value[i] != '.' && teacherSearch.value[i] != ' ') thirdWord += teacherSearch.value[i];else {
        i++;
        while (teacherSearch.value[i] == ',' || teacherSearch.value[i] == '.' || teacherSearch.value[i] == ' ') i++;
        break;
      }
    }
    var ageValue = 0;
    if (isNumeric(firstWord)) {
      ageValue = parseInt(firstWord);
      searchOnChangeFilterWithAge(ageValue, secondWord, thirdWord);
    } else if (isNumeric(secondWord)) {
      ageValue = parseInt(secondWord);
      searchOnChangeFilterWithAge(ageValue, firstWord, thirdWord);
    } else if (isNumeric(thirdWord)) {
      ageValue = parseInt(thirdWord);
      searchOnChangeFilterWithAge(ageValue, firstWord, secondWord);
    } else {
      for (var _i30 = 0; _i30 < randomUserApiMock.length; _i30++) {
        if (randomUserApiMock[_i30].full_name != undefined && randomUserApiMock[_i30].note != undefined) {
          var firstWordIsOk = false;
          var secondWordIsOk = false;
          var thirdWordIsOk = false;
          if (firstWord != "") if (randomUserApiMock[_i30].full_name.toLowerCase().includes(firstWord.toLowerCase()) || randomUserApiMock[_i30].note.toLowerCase().includes(firstWord.toLowerCase()) || randomUserApiMock[_i30].full_name.includes(firstWord) || randomUserApiMock[_i30].note.includes(firstWord)) firstWordIsOk = true;
          if (secondWord != "") if (randomUserApiMock[_i30].full_name.toLowerCase().includes(secondWord.toLowerCase()) || randomUserApiMock[_i30].note.toLowerCase().includes(secondWord.toLowerCase()) || randomUserApiMock[_i30].full_name.includes(secondWord) || randomUserApiMock[_i30].note.includes(secondWord)) secondWordIsOk = true;
          if (thirdWord != "") if (randomUserApiMock[_i30].full_name.toLowerCase().includes(thirdWord.toLowerCase()) || randomUserApiMock[_i30].note.toLowerCase().includes(thirdWord.toLowerCase()) || randomUserApiMock[_i30].full_name.includes(thirdWord) || randomUserApiMock[_i30].note.includes(thirdWord)) thirdWordIsOk = true;
          if (firstWordIsOk || secondWordIsOk || thirdWordIsOk) finalSearchArray.push(randomUserApiMock[_i30]);
        }
        for (var _i31 = 0; _i31 < finalSearchArray.length; _i31++) if (finalSearchArray[_i31].full_name == undefined) finalSearchArray.splice(_i31, 1);
      }
    }
  } else {
    isSearching = false;
    for (var c = 0; c < randomUserApiMock.length; c++) finalSearchArray.push(randomUserApiMock[c]);
    onFilterChange();
  }
  finalStatisticsArray = [];
  statisticsFinalArrayToSort = [];
  finalSearchArray.forEach(function (el) {
    finalStatisticsArray.push({
      "name": el.full_name,
      "specialty": el.course,
      "age": el.age,
      "gender": el.gender,
      "nationality": el.country
    });
    statisticsFinalArrayToSort.push({
      "name": el.full_name,
      "specialty": el.course,
      "age": el.age,
      "gender": el.gender,
      "nationality": el.country
    });
  });
  if (finalStatisticsArray.length != 0) {
    totalCount = Math.ceil(finalStatisticsArray.length / 10);
    while (currentStatisticsPage > totalCount) currentStatisticsPage--;
  } else {
    currentStatisticsPage = 1;
    totalCount = 1;
  }
  if (sortName) sortByName(true);
  if (sortSpecialty) sortBySpecialty(true);
  if (sortAge) sortByAge(true);
  if (sortGender) sortByGender(true);
  if (sortNationality) sortByNationality(true);
  setStatisticsData();
  onFilterChange();
}
function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!  
  return !isNaN(str) &&
  // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
  !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

function searchOnChangeFilterWithAge(ageWord, firstWord, secondWord) {
  for (var i = 0; i < randomUserApiMock.length; i++) {
    var firstWordIsOk = false;
    var secondWordIsOk = false;
    if (randomUserApiMock[i].age == ageWord) {
      if (firstWord != "") if (randomUserApiMock[i].full_name.toLowerCase().includes(firstWord.toLowerCase()) || randomUserApiMock[i].note.toLowerCase().includes(firstWord) || randomUserApiMock[i].full_name.includes(firstWord) || randomUserApiMock[i].note.includes(firstWord)) firstWordIsOk = true;
      if (secondWord != "") if (randomUserApiMock[i].full_name.toLowerCase().includes(secondWord.toLowerCase()) || randomUserApiMock[i].note.toLowerCase().includes(secondWord) || randomUserApiMock[i].full_name.includes(secondWord) || randomUserApiMock[i].note.includes(secondWord)) secondWordIsOk = true;
      if (firstWordIsOk || secondWordIsOk || randomUserApiMock[i].age == ageWord) finalSearchArray.push(randomUserApiMock[i]);
    }
  }
  for (var _i32 = 0; _i32 < finalSearchArray.length; _i32++) if (finalSearchArray[_i32].full_name == undefined) finalSearchArray.splice(_i32, 1);
  onFilterChange();
}
function addNewTeacher() {
  var addTeacherName = document.getElementById("add-teacher-name");
  var addTeacherSpecialty = document.getElementById("add-teacher-specialty");
  var addTeacherCountry = document.getElementById("add-teacher-country");
  var addTeacherCity = document.getElementById("add-teacher-city");
  var addTeacherEmail = document.getElementById("add-teacher-email");
  var addTeacherPhone = document.getElementById("add-teacher-phone");
  var addTeacherDate = document.getElementById("add-teacher-birthday");
  var addTeacherSex = Array.from(document.getElementsByName("add-teacher-sex"));
  var addTeacherColor = document.getElementById("add-teacher-color");
  var addTeacherNotes = document.getElementById("add-teacher-notes");
  var numberValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  var emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var Validated = true;
  var sexValue;
  for (var i = 0; i < addTeacherSex.length; i++) if (addTeacherSex[i].checked) {
    sexValue = addTeacherSex[i].value;
    break;
  }
  var newObject = [{
    "full_name": addTeacherName.value,
    "course": addTeacherSpecialty.value,
    "country": addTeacherCountry.value,
    "city": addTeacherCity.value,
    "email": addTeacherEmail.value,
    "phone": addTeacherPhone.value,
    "b_date": addTeacherDate.value,
    "gender": sexValue,
    "bg_color": addTeacherColor.value,
    "note": addTeacherNotes.value
  }];
  if (newObject[0].full_name != "") Validated = newObject.every(function (obj) {
    return typeof obj.full_name === 'string' && obj.full_name[0] === obj.full_name[0].toUpperCase();
  });else Validated = false;
  if (newObject[0].city != "") Validated = newObject.every(function (obj) {
    return typeof obj.city === 'string' && obj.city[0] === obj.city[0].toUpperCase();
  });else Validated = false;
  Validated = newObject.every(function (obj) {
    return numberValidation.test(obj.phone);
  });
  Validated = newObject.every(function (obj) {
    return emailValidation.test(obj.email);
  });
  if (newObject[0].gender == "" || newObject[0].gender == undefined) Validated = false;
  if (newObject[0].b_date == "") Validated = false;
  var randomPicture = "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random()) * 200 + ".jpg";
  if (getAge(addTeacherDate.value) < 4) Validated = false;
  var finalObject = {
    "gender": sexValue,
    "title": "",
    "full_name": newObject[0].full_name,
    "city": newObject[0].city,
    "country": newObject[0].country,
    "postcode": "",
    "coordinates": {
      "latitude": "",
      "longitude": ""
    },
    "timezone": {
      "offset": "",
      "description": ""
    },
    "b_day": newObject[0].b_date,
    "age": getAge(addTeacherDate.value),
    "id": makeid(10),
    "picture_large": randomPicture,
    "favorite": "",
    "course": newObject[0].course,
    "bg_color": newObject[0].bg_color,
    "note": newObject[0].note
  };
  if (Validated) {
    randomUserApiMock.push(finalObject);
    if (sortName) sortByName(true);
    if (sortSpecialty) sortBySpecialty(true);
    if (sortAge) sortByAge(true);
    if (sortGender) sortByGender(true);
    if (sortNationality) sortByNationality(true);
    searchOnChange();
    onFilterChange();
    var _axios = require('axios');
    _axios.post('http://localhost:3000/users', {
      "gender": sexValue,
      "title": "",
      "full_name": newObject[0].full_name,
      "city": newObject[0].city,
      "country": newObject[0].country,
      "postcode": "",
      "coordinates": {
        "latitude": "",
        "longitude": ""
      },
      "timezone": {
        "offset": "",
        "description": ""
      },
      "b_day": newObject[0].b_date,
      "age": getAge(addTeacherDate.value),
      "id": makeid(10),
      "picture_large": randomPicture,
      "favorite": "",
      "course": newObject[0].course,
      "bg_color": newObject[0].bg_color,
      "note": newObject[0].note
    }).then(function (resp) {
      console.log(resp.data);
    }).catch(function (error) {
      console.log(error);
    });
  } else alert("Incorrect info!");
}
function validateObjects() {
  var Validated = true;
  var numberValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  var emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  Validated = randomUserApiMock.every(function (obj) {
    return typeof obj.full_name === 'string' && obj.full_name[0] === obj.full_name[0].toUpperCase();
  });
  Validated = randomUserApiMock.every(function (obj) {
    return typeof obj.gender === 'string' && obj.gender[0] === obj.gender[0].toUpperCase();
  });
  Validated = randomUserApiMock.every(function (obj) {
    return typeof obj.note === 'string' && obj.note[0] === obj.note[0].toUpperCase();
  });
  Validated = randomUserApiMock.every(function (obj) {
    return typeof obj.state === 'string' && obj.state[0] === obj.state[0].toUpperCase();
  });
  Validated = randomUserApiMock.every(function (obj) {
    return typeof obj.city === 'string' && obj.city[0] === obj.city[0].toUpperCase();
  });
  Validated = randomUserApiMock.every(function (obj) {
    return typeof obj.country === 'string' && obj.country[0] === obj.country[0].toUpperCase();
  });
  Validated = randomUserApiMock.every(function (obj) {
    return typeof obj.age === 'number';
  });
  Validated = randomUserApiMock.every(function (obj) {
    return numberValidation.test(obj.phone);
  });
  Validated = randomUserApiMock.every(function (obj) {
    return emailValidation.test(obj.email);
  });
  return Validated;
}
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  var counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
function makeCourse() {
  var randomNumber = Math.random() * 3;
  if (randomNumber >= 0 && randomNumber < 1) return "Math";else if (randomNumber >= 1 && randomNumber < 2) return "Chemistry";else if (randomNumber >= 2 && randomNumber < 3) return "Art";else if (randomNumber == 3) return "English";
}
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
    age--;
  }
  return age;
}
function getUsers() {
  return _getUsers.apply(this, arguments);
}
function _getUsers() {
  _getUsers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var returnArray;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          returnArray = [];
          _context3.next = 3;
          return fetch("https://randomuser.me/api/?results=50").then(function (results) {
            return results.json();
          }).then(function (data) {
            for (var i = 0; i < data.results.length; i++) {
              var newObject = {
                "gender": "",
                "title": "",
                "full_name": "",
                "city": "",
                "state": "",
                "country": "",
                "postcode": 1,
                "coordinates": {
                  "latitude": "",
                  "longitude": ""
                },
                "timezone": {
                  "offset": "",
                  "description": ""
                },
                "email": "",
                "b_date": "",
                "age": 46,
                "phone": "",
                "picture_large": "",
                "picture_thumbnail": "",
                "id": "",
                "favorite": "",
                "course": "",
                "bg_color": "",
                "note": ""
              };
              newObject.gender = data.results[i].gender;
              newObject.title = data.results[i].name.title;
              newObject.full_name = data.results[i].name.first + " " + data.results[i].name.last;
              newObject.city = data.results[i].location.city;
              newObject.state = data.results[i].location.state;
              newObject.country = data.results[i].location.country;
              newObject.postcode = data.results[i].location.postcode;
              newObject.coordinates = data.results[i].location.coordinates;
              newObject.timezone = data.results[i].location.timezone;
              newObject.email = data.results[i].email;
              newObject.b_date = data.results[i].dob.date;
              newObject.age = data.results[i].dob.age;
              newObject.phone = data.results[i].phone;
              newObject.picture_large = data.results[i].picture.large;
              newObject.picture_thumbnail = data.results[i].picture.thumbnail;
              newObject.id = data.results[i].id.name + data.results[i].id.value + makeid(10);
              newObject.favorite = makeid(10);
              newObject.course = makeCourse().toString();
              newObject.bg_color = Math.floor(Math.random() * 16777215).toString(16);
              newObject.note = "hello";
              returnArray.push(newObject);
            }
          });
        case 3:
          return _context3.abrupt("return", returnArray);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _getUsers.apply(this, arguments);
}
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","./Lab5Mock.js":"Lab5Mock.js","axios":"node_modules/axios/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61408" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map