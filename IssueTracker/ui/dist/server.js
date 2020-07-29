/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "c74f6d3b71f0e82a57bb";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "server";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
  var unacceptedModules = updatedModules.filter(function (moduleId) {
    return renewedModules && renewedModules.indexOf(moduleId) < 0;
  });

  var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

  if (unacceptedModules.length > 0) {
    log("warning", "[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
    unacceptedModules.forEach(function (moduleId) {
      log("warning", "[HMR]  - " + moduleId);
    });
  }

  if (!renewedModules || renewedModules.length === 0) {
    log("info", "[HMR] Nothing hot updated.");
  } else {
    log("info", "[HMR] Updated modules:");
    renewedModules.forEach(function (moduleId) {
      if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
        var parts = moduleId.split("!");
        log.groupCollapsed("info", "[HMR]  - " + parts.pop());
        log("info", "[HMR]  - " + moduleId);
        log.groupEnd("info");
      } else {
        log("info", "[HMR]  - " + moduleId);
      }
    });
    var numberIds = renewedModules.every(function (moduleId) {
      return typeof moduleId === "number";
    });
    if (numberIds) log("info", "[HMR] Consider using the NamedModulesPlugin for module names.");
  }
};

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
  var shouldLog = logLevel === "info" && level === "info" || ["info", "warning"].indexOf(logLevel) >= 0 && level === "warning" || ["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error";
  return shouldLog;
}

function logGroup(logFn) {
  return function (level, msg) {
    if (shouldLog(level)) {
      logFn(msg);
    }
  };
}

module.exports = function (level, msg) {
  if (shouldLog(level)) {
    if (level === "info") {
      console.log(msg);
    } else if (level === "warning") {
      console.warn(msg);
    } else if (level === "error") {
      console.error(msg);
    }
  }
};
/* eslint-disable node/no-unsupported-features/node-builtins */


var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);
module.exports.groupCollapsed = logGroup(groupCollapsed);
module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
  logLevel = level;
};

module.exports.formatError = function (err) {
  var message = err.message;
  var stack = err.stack;

  if (!stack) {
    return message;
  } else if (stack.indexOf(message) < 0) {
    return message + "\n" + stack;
  } else {
    return stack;
  }
};

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/*globals __resourceQuery */
if (true) {
  var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;

  var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

  var checkForUpdate = function checkForUpdate(fromUpdate) {
    if (module.hot.status() === "idle") {
      module.hot.check(true).then(function (updatedModules) {
        if (!updatedModules) {
          if (fromUpdate) log("info", "[HMR] Update applied.");
          return;
        }

        __webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);

        checkForUpdate(true);
      }).catch(function (err) {
        var status = module.hot.status();

        if (["abort", "fail"].indexOf(status) >= 0) {
          log("warning", "[HMR] Cannot apply update.");
          log("warning", "[HMR] " + log.formatError(err));
          log("warning", "[HMR] You need to restart the application!");
        } else {
          log("warning", "[HMR] Update failed: " + log.formatError(err));
        }
      });
    }
  };

  setInterval(checkForUpdate, hotPollInterval);
} else {}
/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./server/render.jsx":
/*!***************************!*\
  !*** ./server/render.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_About_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/About.jsx */ "./src/About.jsx");
/* harmony import */ var _src_store_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/store.js */ "./src/store.js");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./template.js */ "./server/template.js");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-dom/server */ "react-dom/server");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _src_Page_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/Page.jsx */ "./src/Page.jsx");
/* harmony import */ var _src_routes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/routes.js */ "./src/routes.js");









async function render(req, res) {
  const activeRoute = _src_routes_js__WEBPACK_IMPORTED_MODULE_7__["default"].find(route => Object(react_router_dom__WEBPACK_IMPORTED_MODULE_5__["matchPath"])(req.path, route));
  let intialData;

  if (activeRoute && activeRoute.component.fetchData) {
    const match = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_5__["matchPath"])(req.path, activeRoute);
    const index = req.url.indexOf('?');
    const search = index != -1 ? req.url.substr(index) : null;
    intialData = await activeRoute.component.fetchData(match, search, req.headers.cookie);
  }

  const userData = await _src_Page_jsx__WEBPACK_IMPORTED_MODULE_6__["default"].fetchData(req.headers.cookie);
  _src_store_js__WEBPACK_IMPORTED_MODULE_2__["default"].intialData = intialData;
  _src_store_js__WEBPACK_IMPORTED_MODULE_2__["default"].userData = userData;
  const context = {};
  const element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_5__["StaticRouter"], {
    location: req.url,
    context: context
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_Page_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], null));
  const body = react_dom_server__WEBPACK_IMPORTED_MODULE_4___default.a.renderToString(element);

  if (context.url) {
    res.redirect(301, context.url);
  } else {
    res.send(Object(_template_js__WEBPACK_IMPORTED_MODULE_3__["default"])(body, intialData, userData));
  }
}

/* harmony default export */ __webpack_exports__["default"] = (render);

/***/ }),

/***/ "./server/template.js":
/*!****************************!*\
  !*** ./server/template.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return template; });
/* harmony import */ var serialize_javascript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serialize-javascript */ "serialize-javascript");
/* harmony import */ var serialize_javascript__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(serialize_javascript__WEBPACK_IMPORTED_MODULE_0__);

function template(body, intialData, userData) {
  return `<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://apis.google.com/js/api:client.js"></script>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" />        
        <style>
            .test{
                color:blue;
            }
             .active {background-color: #D8D8F5;} 
             input.invalid {border-color: red;}
             div.error {color: red;}
            #nav-dropdown:after {
                 display: none;
            }
            nav {
                margin-bottom: 20px;
            }
            .card-header{
                cursor: pointer;
            }
            table.table-hover tr {cursor: pointer;}
        </style>
    </head>
    <body>
        <div id="content">${body}</div>
        <script>window.__INITIAL_DATA__=${serialize_javascript__WEBPACK_IMPORTED_MODULE_0___default()(intialData)}
                window.__USER_DATA__=${serialize_javascript__WEBPACK_IMPORTED_MODULE_0___default()(userData)}
        </script> 
    </body>
    <script src="/env.js"></script>
    <script src="/vendor.bundle.js"></script>
    <script src="/app.bundle.js"></script>
</html>`;
}

/***/ }),

/***/ "./server/uiserver.js":
/*!****************************!*\
  !*** ./server/uiserver.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var http_proxy_middleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");
/* harmony import */ var http_proxy_middleware__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(http_proxy_middleware__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _render_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./render.jsx */ "./server/render.jsx");
/* harmony import */ var source_map_support__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! source-map-support */ "source-map-support");
/* harmony import */ var source_map_support__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(source_map_support__WEBPACK_IMPORTED_MODULE_5__);






const result = dotenv__WEBPACK_IMPORTED_MODULE_1___default.a.config({
  path: path__WEBPACK_IMPORTED_MODULE_3___default.a.resolve(process.cwd(), 'sample.env')
});

if (result.error) {
  console.log(result.error);
}

const app = express__WEBPACK_IMPORTED_MODULE_0___default()();
source_map_support__WEBPACK_IMPORTED_MODULE_5___default.a.install();
const apiProxyTarget = process.env.API_PROXY_TARGET;

if (apiProxyTarget) {
  app.use('/graphql', Object(http_proxy_middleware__WEBPACK_IMPORTED_MODULE_2__["createProxyMiddleware"])({
    target: apiProxyTarget
  }));
  app.use('/auth', Object(http_proxy_middleware__WEBPACK_IMPORTED_MODULE_2__["createProxyMiddleware"])({
    target: apiProxyTarget
  }));
}

if (!process.env.UI_AUTH_ENDPOINT) {
  process.env.UI_AUTH_ENDPOINT = 'http://localhost:3000/auth';
}

if (!process.env.UI_API_ENDPOINT) {
  process.env.UI_API_ENDPOINT = 'http://localhost:3000/graphql';
}

if (!process.env.UI_SERVER_API_ENDPOINT) {
  process.env.UI_SERVER_API_ENDPOINT = process.env.UI_API_ENDPOINT;
}

app.get('/env.js', (req, res) => {
  const env = {
    UI_API_ENDPOINT: process.env.UI_API_ENDPOINT,
    UI_AUTH_ENDPOINT: process.env.UI_AUTH_ENDPOINT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
  };
  res.send(`window.ENV=${JSON.stringify(env)}`);
});
const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';

if (enableHMR && "development" !== 'production') {
  console.log('Adding dev middleware, enabling HMR');
  /* eslint "global-require": "off" */

  /* eslint "import/no-extraneous-dependencies": "off" */

  const webpack = __webpack_require__(/*! webpack */ "webpack");

  const devMiddleware = __webpack_require__(/*! webpack-dev-middleware */ "webpack-dev-middleware");

  const hotMiddleware = __webpack_require__(/*! webpack-hot-middleware */ "webpack-hot-middleware");

  const config = __webpack_require__(/*! ../webpack.config.js */ "./webpack.config.js")[0];

  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

app.use(express__WEBPACK_IMPORTED_MODULE_0___default.a.static('public'));
app.get('*', (req, res, next) => {
  Object(_render_jsx__WEBPACK_IMPORTED_MODULE_4__["default"])(req, res, next);
});
const port = process.env.UI_SERVER_PORT || 8000;
app.listen(port, () => {
  console.log('UI server listening on port', port);
});

if (true) {
  module.hot.accept(/*! ./render.jsx */ "./server/render.jsx", function() { /* harmony import */ _render_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./render.jsx */ "./server/render.jsx");
 });
}

/***/ }),

/***/ "./src/About.jsx":
/*!***********************!*\
  !*** ./src/About.jsx ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return About; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store.js */ "./src/store.js");
/* harmony import */ var _graphQL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./graphQL.js */ "./src/graphQL.js");



class About extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    const apiAbout = _store_js__WEBPACK_IMPORTED_MODULE_1__["default"].intialData ? _store_js__WEBPACK_IMPORTED_MODULE_1__["default"].intialData.about : null;
    delete _store_js__WEBPACK_IMPORTED_MODULE_1__["default"].intialData;
    this.state = {
      apiAbout
    };
  }

  static async fetchData() {
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_2__["default"])('query {about} ');
    return data;
  }

  async componentDidMount() {
    const {
      apiAbout
    } = this.state;

    if (apiAbout == null) {
      const data = await About.fetchData();
      this.setState({
        apiAbout: data.about
      });
    }
  }

  render() {
    const {
      apiAbout
    } = this.state;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Issue Tracker Version 0.9"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, apiAbout));
  }

}

/***/ }),

/***/ "./src/Contents.jsx":
/*!**************************!*\
  !*** ./src/Contents.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Contents; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _routes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routes.js */ "./src/routes.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



 // Router

function Contents() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Switch"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
    exact: true,
    from: "/",
    to: "/issues"
  }), _routes_js__WEBPACK_IMPORTED_MODULE_2__["default"].map(attrs => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], _extends({}, attrs, {
    key: attrs.path
  }))));
}

/***/ }),

/***/ "./src/DateInput.jsx":
/*!***************************!*\
  !*** ./src/DateInput.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DateInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



function displayFormat(date) {
  if (date) {
    return new Date(date).toDateString();
  }

  return '';
}

function editFormat(date) {
  if (date) {
    return new Date(date).toISOString().substr(0, 10);
  }

  return '';
}

function unformat(str) {
  const val = new Date(str);
  return Number.isNaN(val.getTime()) ? null : val;
}

class DateInput extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: editFormat(props.value),
      focused: false,
      valid: true
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFocus() {
    this.setState({
      focused: true
    });
  }

  onBlur(e) {
    const {
      value,
      valid: oldvalid
    } = this.state;
    const {
      onValidityChange,
      onChange
    } = this.props;
    const dateValue = unformat(value);
    const valid = value === '' || dateValue != null;

    if (valid !== oldvalid && onValidityChange) {
      onValidityChange(e, valid);
    }

    this.setState({
      focused: false,
      valid
    });

    if (valid) {
      onChange(e, dateValue);
    }
  }

  onChange(e) {
    if (e.target.value.match(/^[\d-]*$/)) {
      this.setState({
        value: e.target.value
      });
    }
  }

  render() {
    const {
      valid,
      focused,
      value
    } = this.state;
    const {
      value: origValue,
      onValidityChange,
      ...props
    } = this.props;
    const displayValue = focused || !valid ? value : displayFormat(origValue);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", _extends({}, props, {
      value: displayValue,
      placeholder: focused ? 'yyyy-mm-dd' : null,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange
    }));
  }

}

/***/ }),

/***/ "./src/IssueAdd.jsx":
/*!**************************!*\
  !*** ./src/IssueAdd.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IssueAdd; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);


class IssueAdd extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
    };
    const {
      createIssue
    } = this.props;
    createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      inline: true,
      name: "issueAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormGroup"], {
      className: "mr-2"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormLabel"], {
      className: "mr-2"
    }, "Owner:"), ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormControl"], {
      type: "text",
      name: "owner"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormGroup"], null, ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormLabel"], {
      className: "mr-2"
    }, "Title:"), ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormControl"], {
      type: "text",
      name: "title",
      className: "mr-2"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      variant: "primary",
      type: "submit"
    }, "Add"));
  }

}

/***/ }),

/***/ "./src/IssueAddNav.jsx":
/*!*****************************!*\
  !*** ./src/IssueAddNav.jsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap-icons */ "react-bootstrap-icons");
/* harmony import */ var react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _graphQL_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graphQL.js */ "./src/graphQL.js");






class IssueAddNav extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      owner: '',
      title: ''
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeOwner = this.onChangeOwner.bind(this);
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeOwner(e) {
    this.setState({
      owner: e.target.value
    });
  }

  showModal() {
    this.setState({
      showing: true
    });
  }

  hideModal() {
    this.setState({
      showing: false
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const {
      owner,
      title
    } = this.state;
    const issue = {
      owner,
      title,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
    };
    const query = `mutation issueAdd($issue:IssueInputs!){
            issueAdd(issue:$issue){
                id
            }
        }`;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      issue
    }, this.showError);

    if (data) {
      this.hideModal();
      console.log('success');
      const {
        history
      } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
    }
  }

  render() {
    const {
      showing
    } = this.state;
    const {
      user: {
        signedIn
      }
    } = this.props;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"].Link, {
      disabled: !signedIn,
      onClick: this.showModal
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["OverlayTrigger"], {
      placement: "left",
      delayShow: 1000,
      overlay: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Tooltip"], null, "CreateIssue")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_2__["Plus"], null))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"], {
      keyboard: true,
      show: showing,
      onHide: this.hideModal
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Header, {
      closeButton: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Title, null, " Create Issue ")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Body, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      name: "issueAdd"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormLabel"], null, "Owner:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Form"].Control, {
      name: "owner",
      onChange: this.onChangeOwner
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormLabel"], null, "Title:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["FormControl"], {
      name: "title",
      onChange: this.onChangeTitle
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["ButtonToolbar"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["ButtonGroup"], {
      className: "mr-2"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      variant: "primary",
      type: "button",
      onClick: this.handleSubmit
    }, "Submit")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      variant: "link",
      type: "button",
      onClick: this.hideModal
    }, "Cancel"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["ButtonGroup"], null)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Footer, null)));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_3__["withRouter"])(IssueAddNav));

/***/ }),

/***/ "./src/IssueDescription.jsx":
/*!**********************************!*\
  !*** ./src/IssueDescription.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IssueDescription; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _graphQL_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./graphQL.js */ "./src/graphQL.js");


{
  /*class IssueDescription extends React.Component {
   constructor() {
     super();
     this.state = { issue: {} };
   }
    componentDidMount() {
     this.loadData();
   }
    componentDidUpdate(prevProps) {
     const { match: { params: { id: prevId } } } = prevProps;
     const { match: { params: { id } } } = this.props;
     if (prevId !== id) {
       this.loadData();
     }
   }
    async loadData() {
     let { match: { params: { id } } } = this.props;
     const query = `query issue($id:Int!){
             issue(id: $id){
                 id description
             }
         }`;
     id = parseInt(id, 10);
     const data = await graphQLFetch(query, { id });
     if (data) {
       this.setState({ issue: data.issue });
     } else {
       this.setState({ issue: {} });
     }
   }
    render() {
     const { issue: { description } } = this.state;
     return (
       
     );
   }
  }*/
}
function IssueDescription({
  issue
}) {
  if (issue) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Description"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pre", null, issue.description));
  }

  return null;
}

/***/ }),

/***/ "./src/IssueEdit.jsx":
/*!***************************!*\
  !*** ./src/IssueEdit.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _graphQL_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graphQL.js */ "./src/graphQL.js");
/* harmony import */ var _NumInput_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NumInput.jsx */ "./src/NumInput.jsx");
/* harmony import */ var _DateInput_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DateInput.jsx */ "./src/DateInput.jsx");
/* harmony import */ var _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TextInput.jsx */ "./src/TextInput.jsx");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./store */ "./src/store.js");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var _UserContext_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./UserContext.jsx */ "./src/UserContext.jsx");












class IssueEdit extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor() {
    const issue = _store__WEBPACK_IMPORTED_MODULE_8__["default"].intialData ? _store__WEBPACK_IMPORTED_MODULE_8__["default"].intialData.issue : null;
    delete _store__WEBPACK_IMPORTED_MODULE_8__["default"].intialData;
    super();
    this.state = {
      issue,
      invalidFields: {},
      showingValidation: false
    };
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
  }

  static async fetchData(match, search, showError) {
    const query = ` query issue($id: Int!) {
        issue(id: $id) {
          id title status owner effort created
          due description
        }
      }`;
    let {
      params: {
        id
      }
    } = match;
    id = parseInt(id, 10);
    const result = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      id
    }, showError);
    return result;
  }

  componentDidMount() {
    const {
      issue
    } = this.state;

    if (issue == null) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {
          id: prevID
        }
      }
    } = prevProps;
    const {
      match: {
        params: {
          id
        }
      }
    } = this.props;

    if (prevID !== id) {
      this.loadData();
    }
  }

  onChange(e, naturalValue) {
    const {
      name,
      value: textValue
    } = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      issue: { ...prevState.issue,
        [name]: value
      }
    }));
  }

  onValidityChange(e, valid) {
    const {
      name
    } = e.target;
    this.setState(prevState => {
      const invalidFields = { ...prevState.invalidFields,
        [name]: !valid
      };

      if (valid) {
        delete invalidFields[name];
      }

      return {
        invalidFields
      };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const {
      showError
    } = this.props;
    const {
      issue,
      invalidFields,
      showingValidation
    } = this.state;
    console.log(showingValidation);

    if (Object.keys(invalidFields).length !== 0) {
      return;
    }

    const query = `mutation issueUpdate(
      $id: Int!
      $changes: issueUpdateInputs!
    ){
      issueUpdate(
        id: $id
        changes: $changes
      ){
        id title status owner created effort
        due description
      }
    }`;
    const {
      id,
      created,
      ...changes
    } = issue;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      changes,
      id
    }, showError);

    if (data) {
      this.setState({
        issue: data.issueUpdate
      });
      console.log('After query ');
      showError('Updated issue successfully');
    }
  }

  dismissValidation() {
    this.setState({
      showingValidation: false
    });
  }

  showValidation() {
    this.setState({
      showingValidation: true
    });
  }

  async loadData() {
    const {
      match
    } = this.props;
    const {
      showError
    } = this.props;
    const data = await IssueEdit.fetchData(match, null, showError);
    this.setState({
      issue: data ? data.issue : {},
      invalidFields: {}
    });
  }

  render() {
    const {
      issue
    } = this.state;
    if (issue == null) return null;
    const {
      issue: {
        id
      }
    } = this.state;
    console.log(id);
    const {
      match: {
        params: {
          id: propsId
        }
      }
    } = this.props;

    if (id == null) {
      if (propsId != null) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, `Issue with ID ${propsId} not found`);
      }

      return null;
    }

    const {
      issue: {
        title,
        status
      }
    } = this.state;
    const {
      issue: {
        owner,
        effort,
        description
      }
    } = this.state;
    const {
      issue: {
        created,
        due
      }
    } = this.state;
    const {
      invalidFields,
      showingValidation
    } = this.state;
    let validationMessage;

    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Alert"], {
        dismissible: true,
        variant: "danger",
        onClose: this.dismissValidation
      }, "Please correct invalid fields before submitting");
    }

    const user = this.context;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Accordion"], {
      defaultActiveKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Card"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Accordion"].Toggle, {
      as: react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Card"].Header,
      eventKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Card"].Title, null, `Editing issue ${id}`)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Accordion"].Collapse, {
      eventKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Card"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Card"].Body, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Form"], {
      noValidate: true,
      horizontal: true,
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }, "Created:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 9
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Form"].Control, {
      plaintext: true,
      readOnly: true,
      defaultValue: created.toDateString()
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }, "Status:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 9
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      as: "select",
      value: status,
      onChange: this.onChange,
      name: "status"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "New"
    }, "New"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Assigned"
    }, "Assigned"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Fixed"
    }, "Fixed"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Closed"
    }, "Closed"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }, "Owner:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 9
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      as: _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__["default"],
      value: owner,
      onChange: this.onChange,
      key: id,
      name: "owner"
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }, "Effort:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 9
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      as: _NumInput_jsx__WEBPACK_IMPORTED_MODULE_5__["default"],
      value: effort,
      onChange: this.onChange,
      key: id,
      name: "effort"
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }, "Due:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 9
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      as: _DateInput_jsx__WEBPACK_IMPORTED_MODULE_6__["default"],
      value: due,
      pattern: "[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])",
      onChange: this.onChange,
      onValidityChange: this.onValidityChange,
      name: "due",
      key: id
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Form"].Control.Feedback, {
      type: "invalid"
    }, "Looks good!")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormLabel"], null, "Title:")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 9
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      as: _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__["default"],
      value: title,
      onChange: this.onChange,
      name: "title",
      key: id
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }, "Description:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 9
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      as: _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__["default"],
      tag: "textarea",
      value: description,
      onChange: this.onChange,
      key: id,
      name: "description"
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 3
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Col"], {
      sm: 6
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["ButtonToolbar"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["ButtonGroup"], {
      className: "mr-2"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      disabled: !user.signedIn,
      variant: "primary",
      type: "submit"
    }, "Submit")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["ButtonGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__["LinkContainer"], {
      to: "/issues"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      variant: "link"
    }, "Back")))))))), validationMessage), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Card"].Footer, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: `/edit/${id - 1}`
    }, "Prev"), ' | ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: `/edit/${id + 1}`
    }, "Next"))))));
  }

}

IssueEdit.contextType = _UserContext_jsx__WEBPACK_IMPORTED_MODULE_10__["default"];
const IssueEditWithToast = Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_9__["default"])(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;
/* harmony default export */ __webpack_exports__["default"] = (IssueEditWithToast);

/***/ }),

/***/ "./src/IssueFilter.jsx":
/*!*****************************!*\
  !*** ./src/IssueFilter.jsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ungap/url-search-params */ "@ungap/url-search-params");
/* harmony import */ var _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ungap_url_search_params__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__);
/* eslint "react/prefer-stateless-function": "off" */





class IssueFilter extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor({
    location: {
      search
    }
  }) {
    super();
    const params = new _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_2___default.a(search);
    this.state = {
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || ''
    };
    this.applyFilter = this.applyFilter.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: prevSearch
      }
    } = prevProps;
    const {
      location: {
        search
      }
    } = this.props;

    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeEffortMax(e) {
    const effortString = e.target.value;

    if (effortString.match(/^\d*$/)) {
      this.setState({
        effortMax: e.target.value,
        changed: true
      });
    }
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
      changed: true
    });
  }

  onChangeEffortMin(e) {
    const effortString = e.target.value;

    if (effortString.match(/^\d*$/)) {
      this.setState({
        effortMin: e.target.value,
        changed: true
      });
    }
  }

  showOriginalFilter() {
    const {
      location: {
        search
      }
    } = this.props;
    const params = new _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_2___default.a(search);
    this.setState({
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
      changed: false
    });
  }

  applyFilter() {
    const {
      status,
      effortMin,
      effortMax
    } = this.state;
    const {
      history,
      urlBase
    } = this.props;
    const params = new _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_2___default.a();

    if (status) {
      params.set('status', status);
    }

    if (effortMin) {
      params.set('effortMin', effortMin);
    }

    if (effortMax) {
      params.set('effortMax', effortMax);
    }

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({
      pathname: urlBase,
      search
    });
  }

  render() {
    const {
      location: {
        search
      }
    } = this.props;
    const params = new _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_2___default.a(search);
    const {
      status,
      changed,
      effortMin,
      effortMax
    } = this.state;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Row"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      xs: 6,
      sm: 4,
      md: 3,
      lg: 2
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormLabel"], null, "Status \xA0"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      as: "select",
      value: status,
      onChange: this.onChangeStatus
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: ""
    }, "(ALL)"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "New"
    }, "New"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Assigned"
    }, "Assigned"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Fixed"
    }, "Fixed")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      xs: 6,
      sm: 4,
      md: 3,
      lg: 2
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormLabel"], null, "Effort Between:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["InputGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      value: effortMin,
      onChange: this.onChangeEffortMin
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["InputGroup"].Prepend, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["InputGroup"].Text, {
      id: "basic-addon3"
    }, "-")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      value: effortMax,
      onChange: this.onChangeEffortMax
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      xs: 6,
      sm: 4,
      md: 3,
      lg: 2
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormLabel"], null, "\xA0"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ButtonToolbar"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ButtonGroup"], {
      className: "mr-2"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      variant: "primary",
      onClick: this.applyFilter
    }, "Apply")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ButtonGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      variant: "primary",
      onClick: this.showOriginalFilter,
      disabled: !changed
    }, "Reset"))))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(IssueFilter));

/***/ }),

/***/ "./src/IssueList.jsx":
/*!***************************!*\
  !*** ./src/IssueList.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ungap/url-search-params */ "@ungap/url-search-params");
/* harmony import */ var _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ungap_url_search_params__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _graphQL_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graphQL.js */ "./src/graphQL.js");
/* harmony import */ var _IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./IssueFilter.jsx */ "./src/IssueFilter.jsx");
/* harmony import */ var _IssueTable_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./IssueTable.jsx */ "./src/IssueTable.jsx");
/* harmony import */ var _IssueAdd_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./IssueAdd.jsx */ "./src/IssueAdd.jsx");
/* harmony import */ var _IssueDescription_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./IssueDescription.jsx */ "./src/IssueDescription.jsx");
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./store.js */ "./src/store.js");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_11__);












const SECTION_SIZE = 5;

function PageLink({
  params,
  page,
  activePage,
  children
}) {
  params.set('page', page);
  if (page == 0) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(children, {
    disabled: true
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_11__["LinkContainer"], {
    isActive: () => page == activePage,
    to: {
      search: `?${params.toString()}`
    }
  }, children);
}

class IssueList extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor() {
    super();
    const issues = _store_js__WEBPACK_IMPORTED_MODULE_9__["default"].intialData ? _store_js__WEBPACK_IMPORTED_MODULE_9__["default"].intialData.issues : null;
    const selectedIssue = _store_js__WEBPACK_IMPORTED_MODULE_9__["default"].intialData ? _store_js__WEBPACK_IMPORTED_MODULE_9__["default"].intialData.issue : null;
    const pages = _store_js__WEBPACK_IMPORTED_MODULE_9__["default"].intialData ? _store_js__WEBPACK_IMPORTED_MODULE_9__["default"].intialData.pages : null;
    delete _store_js__WEBPACK_IMPORTED_MODULE_9__["default"].intialData;
    this.state = {
      issues,
      selectedIssue,
      pages
    };
    this.createIssue = this.createIssue.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
  }

  static async fetchData(match, search, showError) {
    const param = new _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_1___default.a(search);
    let page = parseInt(param.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const vars = {
      hasSelection: false,
      selectedId: 0
    };
    vars.page = page;
    const {
      params: {
        id
      }
    } = match;
    const idInt = parseInt(id, 10);

    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    if (param.get('status')) {
      vars.status = param.get('status');
    }

    const effortMin = parseInt(param.get('effortMin'), 10);

    if (!Number.isNaN(effortMin)) {
      vars.effortMin = effortMin;
    }

    const effortMax = parseInt(param.get('effortMax'), 10);

    if (!Number.isNaN(effortMax)) {
      vars.effortMax = effortMax;
    }

    const query = `
          query issueList(
            $hasSelection:Boolean!
            $selectedId: Int!
            $status:StatusType
            $effortMin: Int
            $effortMax: Int
            $page: Int
            ){
              issueList(
                status:$status
                effortMin: $effortMin
                effortMax: $effortMax
                page: $page
                ){
                  issues {
                    id
                    status
                    owner
                    title
                    effort
                    created
                    due
                   }
                  pages
              }
              issue(id: $selectedId) @include (if: $hasSelection) {
                id description
              }
          }`;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, vars, showError);
    return data;
  }

  async componentDidMount() {
    const {
      issues
    } = this.state;

    if (issues == null) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: prevSearch
      },
      match: {
        params: {
          id: prevId
        }
      }
    } = prevProps;
    const {
      location: {
        search
      },
      match: {
        params: {
          id
        }
      }
    } = this.props;

    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const {
      location: {
        search
      },
      match,
      showError
    } = this.props;
    const data = await IssueList.fetchData(match, search, showError);

    if (data) {
      this.setState({
        issues: data.issueList.issues,
        selectedIssue: data.issue,
        pages: data.issueList.pages
      });
    }
  }

  async closeIssue(index) {
    const query = `mutation issueClose($id: Int!){
      issueUpdate(id: $id, changes: {status: Closed}) {
        id title status owner 
        effort created due description
      }
    }`;
    const {
      issues
    } = this.state;
    const {
      showError,
      showSucess
    } = this.props;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      id: issues[index].id
    }, showError);

    if (data) {
      this.setState(prevState => {
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return {
          issues: newList
        };
      });
      showSucess('Issue closed');
    } else {
      this.loadData();
    }
  }

  async deleteIssue(index) {
    const query = `mutation issueDelete($id: Int!){
      issueDelete(id: $id)
    }`;
    const {
      issues
    } = this.state;
    const {
      location: {
        pathname,
        search
      },
      history,
      showError,
      showSucess
    } = this.props;
    const {
      id
    } = issues[index];
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      id
    }, showError);

    if (data && data.issueDelete) {
      this.setState(prevState => {
        const newList = [...prevState.issues];

        if (pathname === `/issues/${id}`) {
          history.push({
            pathname: '/issues',
            search
          });
        }

        newList.splice(index, 1);
        return {
          issues: newList
        };
      });
      const undo_msg = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, `Deleted issue ${id} sucessfully.`, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Button"], {
        variant: "link",
        onClick: () => this.restoreIssue(id)
      }, " UNDO "));
      showSucess(undo_msg);
    } else {
      this.loadData();
    }
  }

  async restoreIssue(id) {
    const query = `mutation issueRestore($id: Int!){
      issueRestore(id: $id)
    }`;
    const {
      showSucess,
      showError
    } = this.props;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      id
    }, showError);

    if (data) {
      showSucess(`Issue ${id} restored successfully.`);
      this.loadData();
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue:IssueInputs!){
                  issueAdd(issue:$issue){
                      id
                  }
              }`;
    const {
      showError,
      showSucess
    } = this.props;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      issue
    }, this.showError);

    if (data) {
      this.loadData();
      showSucess('Issue Added sucessfully');
    }
  }

  render() {
    const {
      issues
    } = this.state;
    const {
      selectedIssue,
      pages
    } = this.state;
    const {
      location: {
        search
      }
    } = this.props;
    const params = new _ungap_url_search_params__WEBPACK_IMPORTED_MODULE_1___default.a(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;
    const items = [];

    for (let i = startPage; i <= Math.min(endPage, pages); i++) {
      params.set('page', i);
      items.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PageLink, {
        key: i,
        params: params,
        activePage: page,
        page: i
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Pagination"].Item, null, i)));
    }

    if (issues == null) return null;
    const {
      match
    } = this.props;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Accordion"], {
      defaultActiveKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Card"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Accordion"].Toggle, {
      as: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Card"].Header,
      eventKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Card"].Title, null, "Filter")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Accordion"].Collapse, {
      eventKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Card"].Body, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      urlBase: "/issues"
    }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueTable_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      issues: issues,
      closeIssue: this.closeIssue,
      deleteIssue: this.deleteIssue
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueAdd_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
      createIssue: this.createIssue
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueDescription_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
      issue: selectedIssue
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Pagination"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PageLink, {
      params: params,
      page: prevSection
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Pagination"].Item, null, '<')), items, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PageLink, {
      params: params,
      page: nextSection
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Pagination"].Item, null, '>'))));
  }

}

const IssueListWithToast = Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_10__["default"])(IssueList);
IssueListWithToast.fetchData = IssueList.fetchData;
/* harmony default export */ __webpack_exports__["default"] = (IssueListWithToast);

/***/ }),

/***/ "./src/IssueReport.jsx":
/*!*****************************!*\
  !*** ./src/IssueReport.jsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _graphQL__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./graphQL */ "./src/graphQL.js");
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store.js */ "./src/store.js");
/* harmony import */ var _IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IssueFilter.jsx */ "./src/IssueFilter.jsx");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__);







class IssueReport extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    const stats = _store_js__WEBPACK_IMPORTED_MODULE_2__["default"].intialData ? _store_js__WEBPACK_IMPORTED_MODULE_2__["default"].intialData.IssueCounts : null;
    delete _store_js__WEBPACK_IMPORTED_MODULE_2__["default"].intialData;
    this.state = {
      stats
    };
  }

  componentDidMount() {
    const {
      stats
    } = this.state;
    if (stats == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: prevSearch
      }
    } = prevProps;
    const {
      location: {
        search
      }
    } = this.props;

    if (prevSearch != search) {
      this.loadData();
    }
  }

  async loadData() {
    const {
      location: {
        search
      },
      match,
      showError
    } = this.props;
    const data = await this.fetchdata(match, search, showError);

    if (data) {
      this.setState({
        stats: data.IssueCounts
      });
    }
  }

  async fetchdata(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMin = effortMax;
    const query = `query issueList(
      $status : StatusType
      $effortMin : Int
      $effortMax : Int
    ){
      IssueCounts(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
      ){
        owner New Assigned Fixed Closed
      }
    }`;
    const data = await Object(_graphQL__WEBPACK_IMPORTED_MODULE_1__["default"])(query, vars, showError);
    return data;
  }

  render() {
    const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];
    const headerColumns = statuses.map(status => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
      key: status
    }, status));
    const {
      stats
    } = this.state;
    if (stats == null) return null;
    const statRows = stats.map(counts => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      key: counts.owner
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, counts.owner), statuses.map(status => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      key: status
    }, counts[status]))));
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Accordion"], {
      defaultActiveKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Card"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Accordion"].Toggle, {
      as: react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Card"].Header,
      eventKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Card"].Title, null, "Filter")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Accordion"].Collapse, {
      eventKey: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Card"].Body, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      urlBase: "/report"
    }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["Table"], {
      bordered: true,
      condensed: true,
      hover: true,
      responsive: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null), headerColumns)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, statRows)));
  }

}

const IssueReportWithToast = Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_4__["default"])(IssueReport);
IssueReportWithToast.fetchdata = IssueReport.fetchdata;
/* harmony default export */ __webpack_exports__["default"] = (IssueReportWithToast);

/***/ }),

/***/ "./src/IssueTable.jsx":
/*!****************************!*\
  !*** ./src/IssueTable.jsx ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IssueTable; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-icons */ "react-bootstrap-icons");
/* harmony import */ var react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _UserContext_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./UserContext.jsx */ "./src/UserContext.jsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }








class IssueRowPlain extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  render() {
    const {
      issue,
      location: {
        search
      },
      closeIssue,
      deleteIssue,
      index
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;
    const selectLocation = {
      pathname: `/issues/${issue.id}`,
      search
    };
    const closeToolTip = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Tooltip"], {
      id: "close-ToolTip",
      placement: "bottom"
    }, "Close Issue");

    function deleteToolTip(props) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Tooltip"], _extends({
        id: "delete-tooltip"
      }, props), "Delete Issue");
    }

    function editToolTip(props) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Tooltip"], _extends({
        id: "edit-tooltip"
      }, props), "Edit Issue");
    }

    function onDelete(e) {
      e.preventDefault();
      deleteIssue(index);
    }

    function onClose(e) {
      e.preventDefault();
      closeIssue(index);
    }

    const tableRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.id), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.status), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.owner), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.created.toDateString()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.effort), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.due ? issue.due.toDateString() : ''), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["OverlayTrigger"], {
      placement: "bottom",
      delayShow: 1000,
      overlay: editToolTip
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_4__["LinkContainer"], {
      to: `/edit/${issue.id}`
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      size: "sm",
      disabled: disabled
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_3__["PencilSquare"], null)))), '   ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["OverlayTrigger"], {
      delayShow: 1000,
      overlay: closeToolTip,
      placement: "bottom"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      size: "sm",
      onClick: onClose,
      disabled: disabled
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_3__["X"], null))), '   ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["OverlayTrigger"], {
      placement: "bottom",
      delayShow: 1000,
      overlay: deleteToolTip
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      size: "sm",
      onClick: onDelete,
      disabled: disabled
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_3__["Trash"], null)))));
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_4__["LinkContainer"], {
      to: selectLocation
    }, tableRow);
  }

}

IssueRowPlain.contextType = _UserContext_jsx__WEBPACK_IMPORTED_MODULE_5__["default"];
const IssueRow = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(IssueRowPlain);
delete IssueRow.contextType;
function IssueTable({
  issues,
  closeIssue,
  deleteIssue
}) {
  const issueRows = issues.map((issue, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IssueRow, {
    key: issue.id,
    issue: issue,
    closeIssue: closeIssue,
    index: index,
    deleteIssue: deleteIssue
  }));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Table"], {
    bordered: true,
    hover: true,
    responsive: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "ID"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Status"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Owner"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Created"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Effort"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Due Date"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Title"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Action"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, issueRows));
}

/***/ }),

/***/ "./src/NotFound.jsx":
/*!**************************!*\
  !*** ./src/NotFound.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


function NotFound() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Page Not Found");
}

/* harmony default export */ __webpack_exports__["default"] = (NotFound);

/***/ }),

/***/ "./src/NumInput.jsx":
/*!**************************!*\
  !*** ./src/NumInput.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NumInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



function format(num) {
  return num != null ? num.toString() : '';
}

function unformat(str) {
  const val = parseInt(str, 10);
  return Number.isNaN(val) ? null : val;
}

class NumInput extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: format(props.value)
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({
        value: e.target.value
      });
    }
  }

  onBlur(e) {
    const {
      onChange
    } = this.props;
    const {
      value
    } = this.state;
    onChange(e, unformat(value));
  }

  render() {
    const {
      value
    } = this.state;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", _extends({
      type: "text"
    }, this.props, {
      value: value,
      onBlur: this.onBlur,
      onChange: this.onChange
    }));
  }

}

/***/ }),

/***/ "./src/Page.jsx":
/*!**********************!*\
  !*** ./src/Page.jsx ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Page; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Search_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Search.jsx */ "./src/Search.jsx");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-icons */ "react-bootstrap-icons");
/* harmony import */ var react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Contents_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Contents.jsx */ "./src/Contents.jsx");
/* harmony import */ var _IssueAddNav_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./IssueAddNav.jsx */ "./src/IssueAddNav.jsx");
/* harmony import */ var _SignInNavItem_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SignInNavItem.jsx */ "./src/SignInNavItem.jsx");
/* harmony import */ var _UserContext_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./UserContext.jsx */ "./src/UserContext.jsx");
/* harmony import */ var _graphQL_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./graphQL.js */ "./src/graphQL.js");
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./store.js */ "./src/store.js");











class Page extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    const user = _store_js__WEBPACK_IMPORTED_MODULE_10__["default"].userData ? _store_js__WEBPACK_IMPORTED_MODULE_10__["default"].userData.user : null;
    delete _store_js__WEBPACK_IMPORTED_MODULE_10__["default"].userData;
    this.state = {
      user
    };
    this.onUserChange = this.onUserChange.bind(this);
  }

  static async fetchData(cookie) {
    const query = `query{
      user { signedIn givenName}
    }`;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_9__["default"])(query, null, null, cookie);
    return data;
  }

  async componentDidMount() {
    const {
      user
    } = this.state;

    if (user == null) {
      const data = await Page.fetchData();
      this.setState({
        user: data.user
      });
    }
  }

  onUserChange(user) {
    this.setState({
      user
    });
  }

  render() {
    const {
      user
    } = this.state;
    if (user == null) return null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NavBar, {
      user: user,
      onUserChange: this.onUserChange
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Container"], {
      fluid: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_UserContext_jsx__WEBPACK_IMPORTED_MODULE_8__["default"].Provider, {
      value: user
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Contents_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], null))));
  }

}

function NavBar({
  user,
  onUserChange
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"], {
    bg: "light"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"].Brand, null, " Issue Tracker"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__["LinkContainer"], {
    exact: true,
    to: "/"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"].Link, null, "Home")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__["LinkContainer"], {
    to: "/issues"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"].Link, null, "IssueList")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__["LinkContainer"], {
    to: "/report"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"].Link, null, "Report")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Col"], {
    sm: 12
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Search_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], null))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"], {
    className: "ml-auto"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueAddNav_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
    user: user
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SignInNavItem_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
    user: user,
    onUserChange: onUserChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavDropdown"], {
    title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_icons__WEBPACK_IMPORTED_MODULE_4__["ThreeDotsVertical"], null),
    id: "nav-dropdown"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__["LinkContainer"], {
    to: "/about"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"].Link, null, "About")))));
}

/***/ }),

/***/ "./src/Search.jsx":
/*!************************!*\
  !*** ./src/Search.jsx ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select_async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select/async */ "react-select/async");
/* harmony import */ var react_select_async__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_select_async__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _graphQL_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./graphQL.js */ "./src/graphQL.js");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");






class Search extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({
    value
  }) {
    const {
      history
    } = this.props;
    history.push(`/edit/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query issueList($search: String){
            issueList(search:$search){
                issues {id title}
            }
        }`;
    const {
      showError
    } = this.props;
    const data = await Object(_graphQL_js__WEBPACK_IMPORTED_MODULE_3__["default"])(query, {
      search: term
    }, showError);
    return data.issueList.issues.map(issue => ({
      label: `#${issue.id}: ${issue.title}`,
      value: issue.id
    }));
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select_async__WEBPACK_IMPORTED_MODULE_1___default.a, {
      instanceId: "search-select",
      value: "",
      loadOptions: this.loadOptions,
      filter: () => true,
      onChange: this.onChangeSelection,
      components: {
        DropdownIndicator: null
      }
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["withRouter"])(Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_4__["default"])(Search)));

/***/ }),

/***/ "./src/SignInNavItem.jsx":
/*!*******************************!*\
  !*** ./src/SignInNavItem.jsx ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var react_bootstrap_DropdownItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap/DropdownItem */ "react-bootstrap/DropdownItem");
/* harmony import */ var react_bootstrap_DropdownItem__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_DropdownItem__WEBPACK_IMPORTED_MODULE_3__);





class SignInNavItem extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) return;
    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({
          client_id: clientId
        }).then(() => {
          this.setState({
            disabled: false
          });
        });
      }
    });
  }

  showModal() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    const {
      showError
    } = this.props;

    if (!clientId) {
      showError('Missing environment variable');
    }

    this.setState({
      showing: true
    });
  }

  hideModal() {
    this.setState({
      showing: false
    });
  }

  async signIn() {
    const {
      showError
    } = this.props;
    this.hideModal();
    let googleToken;

    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (error) {
      showError('error');
      console.log('Auth Error');
    }

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          google_token: googleToken
        })
      });
      const body = await response.text();
      const result = JSON.parse(body);
      const {
        signedIn,
        givenName
      } = result;
      const {
        onUserChange
      } = this.props;
      onUserChange({
        signedIn,
        givenName
      });
    } catch (error) {
      showError('Error');
    }
  }

  async signOut() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const {
      showError
    } = this.props;

    try {
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
        credentials: 'include'
      });
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();
      const {
        onUserChange
      } = this.props;
      onUserChange({
        signedIn: false,
        givenName: ''
      });
    } catch (error) {
      showError('Error signing out');
    }
  }

  render() {
    const {
      user
    } = this.props;

    if (user.signedIn) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavDropdown"], {
        title: user.givenName,
        id: "user"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_DropdownItem__WEBPACK_IMPORTED_MODULE_3___default.a, {
        onClick: this.signOut
      }, "Sign Out"));
    }

    const {
      showing,
      disabled
    } = this.state;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavItem"], {
      onClick: this.showModal
    }, "Sign In"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"], {
      keyboard: true,
      show: showing,
      onHide: this.hideModal,
      bsSize: "sm"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Header, null, "Sign In"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Body, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      block: true,
      bsStyle: "primary",
      onClick: this.signIn,
      disabled: disabled
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: "https://goo.gl/4yjp6B",
      alt: "Sign-In"
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Footer, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      bsStyle: "link",
      onClick: this.hideModal
    }, "Cancel"))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_2__["default"])(SignInNavItem));

/***/ }),

/***/ "./src/TextInput.jsx":
/*!***************************!*\
  !*** ./src/TextInput.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TextInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


function format(text) {
  return text != null ? text : '';
}

function unformat(text) {
  return text.trim().length === 0 ? null : text;
}

class TextInput extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: format(props.value)
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  onBlur(e) {
    const {
      onChange
    } = this.props;
    const {
      value
    } = this.state;
    onChange(e, unformat(value));
  }

  render() {
    const {
      value
    } = this.state;
    const {
      tag = 'input',
      ...props
    } = this.props;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(tag, { ...props,
      value,
      onBlur: this.onBlur,
      onChange: this.onChange
    });
  }

}

/***/ }),

/***/ "./src/UserContext.jsx":
/*!*****************************!*\
  !*** ./src/UserContext.jsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const UserContext = react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext({
  signedIn: false
});
/* harmony default export */ __webpack_exports__["default"] = (UserContext);

/***/ }),

/***/ "./src/graphQL.js":
/*!************************!*\
  !*** ./src/graphQL.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return graphQLFetch; });
/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! isomorphic-fetch */ "isomorphic-fetch");
/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__);

const dateregex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateregex.test(value)) {
    return new Date(value);
  }

  return value;
}

async function graphQLFetch(query, variables = {}, showError = null, cookie = null) {
  const apiEndpoint =  false ? undefined : process.env.UI_SERVER_API_ENDPOINT;
  console.log(process.env.UI_SERVER_API_ENDPOINT);

  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (cookie) headers.Cookie = cookie;
    const response = await isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default()(apiEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');

        if (showError) {
          showError(`${error.message}:\n${details}`);
        } else {
          alert(`${error.message}:\n${details}`);
        }
      } else if (showError) {
        showError(`${error.extensions.code}: ${error.message}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    if (showError) {
      showError(`Error in sending data to server: ${e.message}`);
    }

    return e;
  }
}

/***/ }),

/***/ "./src/routes.js":
/*!***********************!*\
  !*** ./src/routes.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IssueList_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IssueList.jsx */ "./src/IssueList.jsx");
/* harmony import */ var _IssueReport_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IssueReport.jsx */ "./src/IssueReport.jsx");
/* harmony import */ var _IssueEdit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IssueEdit.jsx */ "./src/IssueEdit.jsx");
/* harmony import */ var _About_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./About.jsx */ "./src/About.jsx");
/* harmony import */ var _NotFound_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NotFound.jsx */ "./src/NotFound.jsx");





const routes = [{
  path: '/issues/:id?',
  component: _IssueList_jsx__WEBPACK_IMPORTED_MODULE_0__["default"]
}, {
  path: '/edit/:id',
  component: _IssueEdit_jsx__WEBPACK_IMPORTED_MODULE_2__["default"]
}, {
  path: '/report',
  component: _IssueReport_jsx__WEBPACK_IMPORTED_MODULE_1__["default"]
}, {
  path: '/about',
  component: _About_jsx__WEBPACK_IMPORTED_MODULE_3__["default"]
}, {
  path: '*',
  component: _NotFound_jsx__WEBPACK_IMPORTED_MODULE_4__["default"]
}];
/* harmony default export */ __webpack_exports__["default"] = (routes);

/***/ }),

/***/ "./src/store.js":
/*!**********************!*\
  !*** ./src/store.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const store = {};
/* harmony default export */ __webpack_exports__["default"] = (store);

/***/ }),

/***/ "./src/withToast.jsx":
/*!***************************!*\
  !*** ./src/withToast.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return withToast; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



function withToast(OriginalComponent) {
  return class ToastWrapper extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
    constructor(props) {
      super(props);
      this.state = {
        toastMessage: '',
        toastShow: false
      };
      this.showError = this.showError.bind(this);
      this.showSucess = this.showSucess.bind(this);
    }

    showError(message) {
      this.setState({
        toastShow: true,
        toastMessage: message
      });
    }

    showSucess(message) {
      this.setState({
        toastShow: true,
        toastMessage: message
      });
    }

    render() {
      const {
        toastMessage,
        toastShow
      } = this.state;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OriginalComponent, _extends({
        showError: this.showError,
        showSucess: this.showSucess
      }, this.props)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Toast"], {
        show: toastShow,
        delay: 3000,
        onClose: () => this.setState({
          toastShow: false
        }),
        autohide: true
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Toast"].Body, null, ' ', toastMessage)));
    }

  };
}

/***/ }),

/***/ "./webpack.config.js":
/*!***************************!*\
  !*** ./webpack.config.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const path = __webpack_require__(/*! path */ "path");

const nodeExternals = __webpack_require__(/*! webpack-node-externals */ "webpack-node-externals");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const browserConfig = {
  mode: 'development',
  entry: {
    app: ['./browser/App.jsx']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [new webpack.DefinePlugin({
    __isBrowser__: 'true'
  })],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            targets: {
              ie: '11',
              edge: '15',
              safari: '10',
              firefox: '50',
              chrome: '49'
            }
          }], '@babel/preset-react']
        }
      }
    }]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  },
  devtool: 'source-map'
};
const serverConfig = {
  mode: 'development',
  entry: {
    server: ['./server/uiserver.js']
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [new webpack.DefinePlugin({
    __isBrowser__: 'false'
  })],
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            targets: {
              node: '10'
            }
          }], '@babel/preset-react']
        }
      }
    }]
  },
  devtool: 'source-map'
};
module.exports = [browserConfig, serverConfig];
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ 0:
/*!***********************************************************************!*\
  !*** multi ./server/uiserver.js ./node_modules/webpack/hot/poll?1000 ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./server/uiserver.js */"./server/uiserver.js");
module.exports = __webpack_require__(/*! ./node_modules/webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");


/***/ }),

/***/ "@ungap/url-search-params":
/*!*******************************************!*\
  !*** external "@ungap/url-search-params" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@ungap/url-search-params");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http-proxy-middleware":
/*!****************************************!*\
  !*** external "http-proxy-middleware" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http-proxy-middleware");

/***/ }),

/***/ "isomorphic-fetch":
/*!***********************************!*\
  !*** external "isomorphic-fetch" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-bootstrap":
/*!**********************************!*\
  !*** external "react-bootstrap" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-bootstrap");

/***/ }),

/***/ "react-bootstrap-icons":
/*!****************************************!*\
  !*** external "react-bootstrap-icons" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-bootstrap-icons");

/***/ }),

/***/ "react-bootstrap/DropdownItem":
/*!***********************************************!*\
  !*** external "react-bootstrap/DropdownItem" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-bootstrap/DropdownItem");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-router-bootstrap":
/*!*****************************************!*\
  !*** external "react-router-bootstrap" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-bootstrap");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "react-select/async":
/*!*************************************!*\
  !*** external "react-select/async" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-select/async");

/***/ }),

/***/ "serialize-javascript":
/*!***************************************!*\
  !*** external "serialize-javascript" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),

/***/ "source-map-support":
/*!*************************************!*\
  !*** external "source-map-support" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-hot-middleware");

/***/ }),

/***/ "webpack-node-externals":
/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map