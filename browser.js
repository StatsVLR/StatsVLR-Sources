(() => {
	var e = {
			990: () => {
				! function(e, t) {
					"use strict";
					var n = function(e, t) {
						this.settings = n.util.merge(e, n.defaults), this.editor = t, this.filenameTag = "{filename}", this.lastValue = null
					};
					n.editors = {}, n.util = {
						merge: function() {
							for (var e = {}, t = arguments.length - 1; t >= 0; t--) {
								var n = arguments[t];
								for (var i in n) n.hasOwnProperty(i) && (e[i] = n[i])
							}
							return e
						},
						appendInItsOwnLine: function(e, t) {
							return (e + "\n\n[[D]]" + t).replace(/(\n{2,})\[\[D\]\]/, "\n\n").replace(/^(\n*)/, "")
						},
						insertTextAtCursor: function(t, n) {
							var i, o = t.scrollTop,
								r = 0,
								d = !1;
							t.selectionStart || "0" === t.selectionStart ? d = "ff" : e.selection && (d = "ie"), "ie" === d ? (t.focus(), (i = e.selection.createRange()).moveStart("character", -t.value.length), r = i.text.length) : "ff" === d && (r = t.selectionStart);
							var s = t.value.substring(0, r),
								a = t.value.substring(r, t.value.length);
							t.value = s + n + a, r += n.length, "ie" === d ? (t.focus(), (i = e.selection.createRange()).moveStart("character", -t.value.length), i.moveStart("character", r), i.moveEnd("character", 0), i.select()) : "ff" === d && (t.selectionStart = r, t.selectionEnd = r, t.focus()), t.scrollTop = o
						}
					}, n.defaults = {
						uploadUrl: "upload_attachment.php",
						uploadMethod: "POST",
						uploadFieldName: "file",
						defaultExtension: "png",
						jsonFieldName: "filename",
						allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
						progressText: "![Uploading file...]()",
						urlText: "![file]({filename})",
						errorText: "Error uploading file",
						extraParams: {},
						extraHeaders: {},
						beforeFileUpload: function() {
							return !0
						},
						onFileReceived: function() {},
						onFileUploadResponse: function() {
							return !0
						},
						onFileUploadError: function() {
							return !0
						},
						onFileUploaded: function() {}
					}, n.prototype.uploadFile = function(e) {
						var t = this,
							n = new FormData,
							i = new XMLHttpRequest,
							o = this.settings,
							r = o.defaultExtension || o.defualtExtension;
						if ("function" == typeof o.setupFormData && o.setupFormData(n, e), e.name) {
							var d = e.name.match(/\.(.+)$/);
							d && (r = d[1])
						}
						var s = "image-" + Date.now() + "." + r;
						if ("function" == typeof o.remoteFilename && (s = o.remoteFilename(e)), n.append(o.uploadFieldName, e, s), "object" == typeof o.extraParams)
							for (var a in o.extraParams) o.extraParams.hasOwnProperty(a) && n.append(a, o.extraParams[a]);
						if (i.open("POST", o.uploadUrl), "object" == typeof o.extraHeaders)
							for (var u in o.extraHeaders) o.extraHeaders.hasOwnProperty(u) && i.setRequestHeader(u, o.extraHeaders[u]);
						return i.onload = function() {
							200 === i.status || 201 === i.status ? t.onFileUploadResponse(i) : t.onFileUploadError(i)
						}, !1 !== o.beforeFileUpload(i) && i.send(n), i
					}, n.prototype.isFileAllowed = function(e) {
						return "string" !== e.kind && (0 === this.settings.allowedTypes.indexOf("*") || this.settings.allowedTypes.indexOf(e.type) >= 0)
					}, n.prototype.onFileUploadResponse = function(e) {
						if (!1 !== this.settings.onFileUploadResponse.call(this, e)) {
							var t = JSON.parse(e.responseText),
								n = t[this.settings.jsonFieldName];
							if (t && n) {
								var i;
								i = "function" == typeof this.settings.urlText ? this.settings.urlText.call(this, n, t) : this.settings.urlText.replace(this.filenameTag, n);
								var o = this.editor.getValue().replace(this.lastValue, i);
								this.editor.setValue(o), this.settings.onFileUploaded.call(this, n)
							}
						}
					}, n.prototype.onFileUploadError = function(e) {
						if (!1 !== this.settings.onFileUploadError.call(this, e)) {
							var t = this.editor.getValue().replace(this.lastValue, "");
							this.editor.setValue(t)
						}
					}, n.prototype.onFileInserted = function(e) {
						!1 !== this.settings.onFileReceived.call(this, e) && (this.lastValue = this.settings.progressText, this.editor.insertValue(this.lastValue))
					}, n.prototype.onPaste = function(e) {
						var t, n = !1,
							i = e.clipboardData;
						if ("object" == typeof i) {
							t = i.items || i.files || [];
							for (var o = 0; o < t.length; o++) {
								var r = t[o];
								this.isFileAllowed(r) && (n = !0, this.onFileInserted(r.getAsFile()), this.uploadFile(r.getAsFile()))
							}
						}
						return n && e.preventDefault(), n
					}, n.prototype.onDrop = function(e) {
						for (var t = !1, n = 0; n < e.dataTransfer.files.length; n++) {
							var i = e.dataTransfer.files[n];
							this.isFileAllowed(i) && (t = !0, this.onFileInserted(i), this.uploadFile(i))
						}
						return t
					}, t.inlineAttachment = n
				}(document, window)
			},
			83: () => {
				! function(e, t, n) {
					"use strict";
					inlineAttachment.editors.jquery = {};
					var i = function(e) {
						var t = n(e);
						return {
							getValue: function() {
								return t.val()
							},
							insertValue: function(e) {
								inlineAttachment.util.insertTextAtCursor(t[0], e)
							},
							setValue: function(e) {
								t.val(e)
							}
						}
					};
					n.fn.inlineattachment = function(e) {
						return n(this).each((function() {
							var t = n(this),
								o = new i(t),
								r = new inlineAttachment(e, o);
							t.bind({
								paste: function(e) {
									r.onPaste(e.originalEvent)
								},
								drop: function(e) {
									e.stopPropagation(), e.preventDefault(), r.onDrop(e.originalEvent)
								},
								"dragenter dragover": function(e) {
									e.stopPropagation(), e.preventDefault()
								}
							})
						})), this
					}, inlineAttachment.editors.jquery.Editor = i
				}(document, window, jQuery)
			},
			729: () => {
				var e, t, n, i, o, r, d = "Close",
					s = "BeforeClose",
					a = "MarkupParse",
					u = "Open",
					c = "Change",
					l = "mfp",
					f = "." + l,
					p = "mfp-ready",
					h = "mfp-removing",
					m = "mfp-prevent-close",
					g = function() {},
					v = !!window.jQuery,
					b = $(window),
					y = function(t, n) {
						e.ev.on(l + t + f, n)
					},
					w = function(e, t, n, i) {
						var o = document.createElement("div");
						return o.className = "mfp-" + e, n && (o.innerHTML = n), i ? t && t.appendChild(o) : (o = $(o), t && o.appendTo(t)), o
					},
					_ = function(t, n) {
						e.ev.triggerHandler(l + t, n), e.st.callbacks && (t = t.charAt(0).toLowerCase() + t.slice(1), e.st.callbacks[t] && e.st.callbacks[t].apply(e, $.isArray(n) ? n : [n]))
					},
					x = function(t) {
						return t === r && e.currTemplate.closeBtn || (e.currTemplate.closeBtn = $(e.st.closeMarkup.replace("%title%", e.st.tClose)), r = t), e.currTemplate.closeBtn
					},
					k = function() {
						$.magnificPopup.instance || ((e = new g).init(), $.magnificPopup.instance = e)
					};
				g.prototype = {
					constructor: g,
					init: function() {
						var t = navigator.appVersion;
						e.isLowIE = e.isIE8 = document.all && !document.addEventListener, e.isAndroid = /android/gi.test(t), e.isIOS = /iphone|ipad|ipod/gi.test(t), e.supportsTransition = function() {
							var e = document.createElement("p").style,
								t = ["ms", "O", "Moz", "Webkit"];
							if (void 0 !== e.transition) return !0;
							for (; t.length;)
								if (t.pop() + "Transition" in e) return !0;
							return !1
						}(), e.probablyMobile = e.isAndroid || e.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), n = $(document), e.popupsCache = {}
					},
					open: function(t) {
						var i;
						if (!1 === t.isObj) {
							e.items = t.items.toArray(), e.index = 0;
							var r, d = t.items;
							for (i = 0; i < d.length; i++)
								if ((r = d[i]).parsed && (r = r.el[0]), r === t.el[0]) {
									e.index = i;
									break
								}
						} else e.items = $.isArray(t.items) ? t.items : [t.items], e.index = t.index || 0;
						if (!e.isOpen) {
							e.types = [], o = "", t.mainEl && t.mainEl.length ? e.ev = t.mainEl.eq(0) : e.ev = n, t.key ? (e.popupsCache[t.key] || (e.popupsCache[t.key] = {}), e.currTemplate = e.popupsCache[t.key]) : e.currTemplate = {}, e.st = $.extend(!0, {}, $.magnificPopup.defaults, t), e.fixedContentPos = "auto" === e.st.fixedContentPos ? !e.probablyMobile : e.st.fixedContentPos, e.st.modal && (e.st.closeOnContentClick = !1, e.st.closeOnBgClick = !1, e.st.showCloseBtn = !1, e.st.enableEscapeKey = !1), e.bgOverlay || (e.bgOverlay = w("bg").on("click" + f, (function() {
								e.close()
							})), e.wrap = w("wrap").attr("tabindex", -1).on("click" + f, (function(t) {
								e._checkIfClose(t.target) && e.close()
							})), e.container = w("container", e.wrap)), e.contentContainer = w("content"), e.st.preloader && (e.preloader = w("preloader", e.container, e.st.tLoading));
							var s = $.magnificPopup.modules;
							for (i = 0; i < s.length; i++) {
								var c = s[i];
								c = c.charAt(0).toUpperCase() + c.slice(1), e["init" + c].call(e)
							}
							_("BeforeOpen"), e.st.showCloseBtn && (e.st.closeBtnInside ? (y(a, (function(e, t, n, i) {
								n.close_replaceWith = x(i.type)
							})), o += " mfp-close-btn-in") : e.wrap.append(x())), e.st.alignTop && (o += " mfp-align-top"), e.fixedContentPos ? e.wrap.css({
								overflow: e.st.overflowY,
								overflowX: "hidden",
								overflowY: e.st.overflowY
							}) : e.wrap.css({
								top: b.scrollTop(),
								position: "absolute"
							}), (!1 === e.st.fixedBgPos || "auto" === e.st.fixedBgPos && !e.fixedContentPos) && e.bgOverlay.css({
								height: n.height(),
								position: "absolute"
							}), e.st.enableEscapeKey && n.on("keyup" + f, (function(t) {
								27 === t.keyCode && e.close()
							})), b.on("resize" + f, (function() {
								e.updateSize()
							})), e.st.closeOnContentClick || (o += " mfp-auto-cursor"), o && e.wrap.addClass(o);
							var l = e.wH = b.height(),
								h = {};
							if (e.fixedContentPos && e._hasScrollBar(l)) {
								var m = e._getScrollbarSize();
								m && (h.marginRight = m)
							}
							e.fixedContentPos && (e.isIE7 ? $("body, html").css("overflow", "hidden") : h.overflow = "hidden");
							var g = e.st.mainClass;
							return e.isIE7 && (g += " mfp-ie7"), g && e._addClassToMFP(g), e.updateItemHTML(), _("BuildControls"), $("html").css(h), e.bgOverlay.add(e.wrap).prependTo(e.st.prependTo || $(document.body)), e._lastFocusedEl = document.activeElement, setTimeout((function() {
								e.content ? (e._addClassToMFP(p), e._setFocus()) : e.bgOverlay.addClass(p), n.on("focusin" + f, e._onFocusIn)
							}), 16), e.isOpen = !0, e.updateSize(l), _(u), t
						}
						e.updateItemHTML()
					},
					close: function() {
						e.isOpen && (_(s), e.isOpen = !1, e.st.removalDelay && !e.isLowIE && e.supportsTransition ? (e._addClassToMFP(h), setTimeout((function() {
							e._close()
						}), e.st.removalDelay)) : e._close())
					},
					_close: function() {
						_(d);
						var t = h + " " + p + " ";
						if (e.bgOverlay.detach(), e.wrap.detach(), e.container.empty(), e.st.mainClass && (t += e.st.mainClass + " "), e._removeClassFromMFP(t), e.fixedContentPos) {
							var i = {
								marginRight: ""
							};
							e.isIE7 ? $("body, html").css("overflow", "") : i.overflow = "", $("html").css(i)
						}
						n.off("keyup.mfp focusin" + f), e.ev.off(f), e.wrap.attr("class", "mfp-wrap").removeAttr("style"), e.bgOverlay.attr("class", "mfp-bg"), e.container.attr("class", "mfp-container"), !e.st.showCloseBtn || e.st.closeBtnInside && !0 !== e.currTemplate[e.currItem.type] || e.currTemplate.closeBtn && e.currTemplate.closeBtn.detach(), e.st.autoFocusLast && e._lastFocusedEl && $(e._lastFocusedEl).focus(), e.currItem = null, e.content = null, e.currTemplate = null, e.prevHeight = 0, _("AfterClose")
					},
					updateSize: function(t) {
						if (e.isIOS) {
							var n = document.documentElement.clientWidth / window.innerWidth,
								i = window.innerHeight * n;
							e.wrap.css("height", i), e.wH = i
						} else e.wH = t || b.height();
						e.fixedContentPos || e.wrap.css("height", e.wH), _("Resize")
					},
					updateItemHTML: function() {
						var t = e.items[e.index];
						e.contentContainer.detach(), e.content && e.content.detach(), t.parsed || (t = e.parseEl(e.index));
						var n = t.type;
						if (_("BeforeChange", [e.currItem ? e.currItem.type : "", n]), e.currItem = t, !e.currTemplate[n]) {
							var o = !!e.st[n] && e.st[n].markup;
							_("FirstMarkupParse", o), e.currTemplate[n] = !o || $(o)
						}
						i && i !== t.type && e.container.removeClass("mfp-" + i + "-holder");
						var r = e["get" + n.charAt(0).toUpperCase() + n.slice(1)](t, e.currTemplate[n]);
						e.appendContent(r, n), t.preloaded = !0, _(c, t), i = t.type, e.container.prepend(e.contentContainer), _("AfterChange")
					},
					appendContent: function(t, n) {
						e.content = t, t ? e.st.showCloseBtn && e.st.closeBtnInside && !0 === e.currTemplate[n] ? e.content.find(".mfp-close").length || e.content.append(x()) : e.content = t : e.content = "", _("BeforeAppend"), e.container.addClass("mfp-" + n + "-holder"), e.contentContainer.append(e.content)
					},
					parseEl: function(t) {
						var n, i = e.items[t];
						if (i.tagName ? i = {
								el: $(i)
							} : (n = i.type, i = {
								data: i,
								src: i.src
							}), i.el) {
							for (var o = e.types, r = 0; r < o.length; r++)
								if (i.el.hasClass("mfp-" + o[r])) {
									n = o[r];
									break
								} i.src = i.el.attr("data-mfp-src"), i.src || (i.src = i.el.attr("href"))
						}
						return i.type = n || e.st.type || "inline", i.index = t, i.parsed = !0, e.items[t] = i, _("ElementParse", i), e.items[t]
					},
					addGroup: function(t, n) {
						var i = function(i) {
							i.mfpEl = this, e._openClick(i, t, n)
						};
						n || (n = {});
						var o = "click.magnificPopup";
						n.mainEl = t, n.items ? (n.isObj = !0, t.off(o).on(o, i)) : (n.isObj = !1, n.delegate ? t.off(o).on(o, n.delegate, i) : (n.items = t, t.off(o).on(o, i)))
					},
					_openClick: function(t, n, i) {
						if ((void 0 !== i.midClick ? i.midClick : $.magnificPopup.defaults.midClick) || !(2 === t.which || t.ctrlKey || t.metaKey || t.altKey || t.shiftKey)) {
							var o = void 0 !== i.disableOn ? i.disableOn : $.magnificPopup.defaults.disableOn;
							if (o)
								if ($.isFunction(o)) {
									if (!o.call(e)) return !0
								} else if (b.width() < o) return !0;
							t.type && (t.preventDefault(), e.isOpen && t.stopPropagation()), i.el = $(t.mfpEl), i.delegate && (i.items = n.find(i.delegate)), e.open(i)
						}
					},
					updateStatus: function(n, i) {
						if (e.preloader) {
							t !== n && e.container.removeClass("mfp-s-" + t), i || "loading" !== n || (i = e.st.tLoading);
							var o = {
								status: n,
								text: i
							};
							_("UpdateStatus", o), n = o.status, i = o.text, e.preloader.html(i), e.preloader.find("a").on("click", (function(e) {
								e.stopImmediatePropagation()
							})), e.container.addClass("mfp-s-" + n), t = n
						}
					},
					_checkIfClose: function(t) {
						if (!$(t).hasClass(m)) {
							var n = e.st.closeOnContentClick,
								i = e.st.closeOnBgClick;
							if (n && i) return !0;
							if (!e.content || $(t).hasClass("mfp-close") || e.preloader && t === e.preloader[0]) return !0;
							if (t === e.content[0] || $.contains(e.content[0], t)) {
								if (n) return !0
							} else if (i && $.contains(document, t)) return !0;
							return !1
						}
					},
					_addClassToMFP: function(t) {
						e.bgOverlay.addClass(t), e.wrap.addClass(t)
					},
					_removeClassFromMFP: function(t) {
						this.bgOverlay.removeClass(t), e.wrap.removeClass(t)
					},
					_hasScrollBar: function(t) {
						return (e.isIE7 ? n.height() : document.body.scrollHeight) > (t || b.height())
					},
					_setFocus: function() {
						(e.st.focus ? e.content.find(e.st.focus).eq(0) : e.wrap).focus()
					},
					_onFocusIn: function(t) {
						if (t.target !== e.wrap[0] && !$.contains(e.wrap[0], t.target)) return e._setFocus(), !1
					},
					_parseMarkup: function(e, t, n) {
						var i;
						n.data && (t = $.extend(n.data, t)), _(a, [e, t, n]), $.each(t, (function(t, n) {
							if (void 0 === n || !1 === n) return !0;
							if ((i = t.split("_")).length > 1) {
								var o = e.find(f + "-" + i[0]);
								if (o.length > 0) {
									var r = i[1];
									"replaceWith" === r ? o[0] !== n[0] && o.replaceWith(n) : "img" === r ? o.is("img") ? o.attr("src", n) : o.replaceWith($("<img>").attr("src", n).attr("class", o.attr("class"))) : o.attr(i[1], n)
								}
							} else e.find(f + "-" + t).html(n)
						}))
					},
					_getScrollbarSize: function() {
						if (void 0 === e.scrollbarSize) {
							var t = document.createElement("div");
							t.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(t), e.scrollbarSize = t.offsetWidth - t.clientWidth, document.body.removeChild(t)
						}
						return e.scrollbarSize
					}
				}, $.magnificPopup = {
					instance: null,
					proto: g.prototype,
					modules: [],
					open: function(e, t) {
						return k(), (e = e ? $.extend(!0, {}, e) : {}).isObj = !0, e.index = t || 0, this.instance.open(e)
					},
					close: function() {
						return $.magnificPopup.instance && $.magnificPopup.instance.close()
					},
					registerModule: function(e, t) {
						t.options && ($.magnificPopup.defaults[e] = t.options), $.extend(this.proto, t.proto), this.modules.push(e)
					},
					defaults: {
						disableOn: 0,
						key: null,
						midClick: !1,
						mainClass: "",
						preloader: !0,
						focus: "",
						closeOnContentClick: !1,
						closeOnBgClick: !0,
						closeBtnInside: !0,
						showCloseBtn: !0,
						enableEscapeKey: !0,
						modal: !1,
						alignTop: !1,
						removalDelay: 0,
						prependTo: null,
						fixedContentPos: "auto",
						fixedBgPos: "auto",
						overflowY: "auto",
						closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
						tClose: "Close (Esc)",
						tLoading: "Loading...",
						autoFocusLast: !0
					}
				}, $.fn.magnificPopup = function(t) {
					k();
					var n = $(this);
					if ("string" == typeof t)
						if ("open" === t) {
							var i, o = v ? n.data("magnificPopup") : n[0].magnificPopup,
								r = parseInt(arguments[1], 10) || 0;
							o.items ? i = o.items[r] : (i = n, o.delegate && (i = i.find(o.delegate)), i = i.eq(r)), e._openClick({
								mfpEl: i
							}, n, o)
						} else e.isOpen && e[t].apply(e, Array.prototype.slice.call(arguments, 1));
					else t = $.extend(!0, {}, t), v ? n.data("magnificPopup", t) : n[0].magnificPopup = t, e.addGroup(n, t);
					return n
				};
				var C, S, j, E = "inline",
					O = function() {
						j && (S.after(j.addClass(C)).detach(), j = null)
					};
				$.magnificPopup.registerModule(E, {
					options: {
						hiddenClass: "hide",
						markup: "",
						tNotFound: "Content not found"
					},
					proto: {
						initInline: function() {
							e.types.push(E), y(d + "." + E, (function() {
								O()
							}))
						},
						getInline: function(t, n) {
							if (O(), t.src) {
								var i = e.st.inline,
									o = $(t.src);
								if (o.length) {
									var r = o[0].parentNode;
									r && r.tagName && (S || (C = i.hiddenClass, S = w(C), C = "mfp-" + C), j = o.after(S).detach().removeClass(C)), e.updateStatus("ready")
								} else e.updateStatus("error", i.tNotFound), o = $("<div>");
								return t.inlineElement = o, o
							}
							return e.updateStatus("ready"), e._parseMarkup(n, {}, t), n
						}
					}
				});
				var T, M = "ajax",
					P = function() {
						T && $(document.body).removeClass(T)
					},
					I = function() {
						P(), e.req && e.req.abort()
					};
				$.magnificPopup.registerModule(M, {
					options: {
						settings: null,
						cursor: "mfp-ajax-cur",
						tError: '<a href="%url%">The content</a> could not be loaded.'
					},
					proto: {
						initAjax: function() {
							e.types.push(M), T = e.st.ajax.cursor, y(d + "." + M, I), y("BeforeChange." + M, I)
						},
						getAjax: function(t) {
							T && $(document.body).addClass(T), e.updateStatus("loading");
							var n = $.extend({
								url: t.src,
								success: function(n, i, o) {
									var r = {
										data: n,
										xhr: o
									};
									_("ParseAjax", r), e.appendContent($(r.data), M), t.finished = !0, P(), e._setFocus(), setTimeout((function() {
										e.wrap.addClass(p)
									}), 16), e.updateStatus("ready"), _("AjaxContentAdded")
								},
								error: function() {
									P(), t.finished = t.loadError = !0, e.updateStatus("error", e.st.ajax.tError.replace("%url%", t.src))
								}
							}, e.st.ajax.settings);
							return e.req = $.ajax(n), ""
						}
					}
				});
				var L, z, A = function(t) {
					if (t.data && void 0 !== t.data.title) return t.data.title;
					var n = e.st.image.titleSrc;
					if (n) {
						if ($.isFunction(n)) return n.call(e, t);
						if (t.el) return t.el.attr(n) || ""
					}
					return ""
				};
				$.magnificPopup.registerModule("image", {
					options: {
						markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
						cursor: "mfp-zoom-out-cur",
						titleSrc: "title",
						verticalFit: !0,
						tError: '<a href="%url%">The image</a> could not be loaded.'
					},
					proto: {
						initImage: function() {
							var t = e.st.image,
								n = ".image";
							e.types.push("image"), y(u + n, (function() {
								"image" === e.currItem.type && t.cursor && $(document.body).addClass(t.cursor)
							})), y(d + n, (function() {
								t.cursor && $(document.body).removeClass(t.cursor), b.off("resize" + f)
							})), y("Resize" + n, e.resizeImage), e.isLowIE && y("AfterChange", e.resizeImage)
						},
						resizeImage: function() {
							var t = e.currItem;
							if (t && t.img && e.st.image.verticalFit) {
								var n = 0;
								e.isLowIE && (n = parseInt(t.img.css("padding-top"), 10) + parseInt(t.img.css("padding-bottom"), 10)), t.img.css("max-height", e.wH - n)
							}
						},
						_onImageHasSize: function(t) {
							t.img && (t.hasSize = !0, L && clearInterval(L), t.isCheckingImgSize = !1, _("ImageHasSize", t), t.imgHidden && (e.content && e.content.removeClass("mfp-loading"), t.imgHidden = !1))
						},
						findImageSize: function(t) {
							var n = 0,
								i = t.img[0],
								o = function(r) {
									L && clearInterval(L), L = setInterval((function() {
										i.naturalWidth > 0 ? e._onImageHasSize(t) : (n > 200 && clearInterval(L), 3 == ++n ? o(10) : 40 === n ? o(50) : 100 === n && o(500))
									}), r)
								};
							o(1)
						},
						getImage: function(t, n) {
							var i = 0,
								o = function() {
									t && (t.img[0].complete ? (t.img.off(".mfploader"), t === e.currItem && (e._onImageHasSize(t), e.updateStatus("ready")), t.hasSize = !0, t.loaded = !0, _("ImageLoadComplete")) : ++i < 200 ? setTimeout(o, 100) : r())
								},
								r = function() {
									t && (t.img.off(".mfploader"), t === e.currItem && (e._onImageHasSize(t), e.updateStatus("error", d.tError.replace("%url%", t.src))), t.hasSize = !0, t.loaded = !0, t.loadError = !0)
								},
								d = e.st.image,
								s = n.find(".mfp-img");
							if (s.length) {
								var a = document.createElement("img");
								a.className = "mfp-img", t.el && t.el.find("img").length && (a.alt = t.el.find("img").attr("alt")), t.img = $(a).on("load.mfploader", o).on("error.mfploader", r), a.src = t.src, s.is("img") && (t.img = t.img.clone()), (a = t.img[0]).naturalWidth > 0 ? t.hasSize = !0 : a.width || (t.hasSize = !1)
							}
							return e._parseMarkup(n, {
								title: A(t),
								img_replaceWith: t.img
							}, t), e.resizeImage(), t.hasSize ? (L && clearInterval(L), t.loadError ? (n.addClass("mfp-loading"), e.updateStatus("error", d.tError.replace("%url%", t.src))) : (n.removeClass("mfp-loading"), e.updateStatus("ready")), n) : (e.updateStatus("loading"), t.loading = !0, t.hasSize || (t.imgHidden = !0, n.addClass("mfp-loading"), e.findImageSize(t)), n)
						}
					}
				}), $.magnificPopup.registerModule("zoom", {
					options: {
						enabled: !1,
						easing: "ease-in-out",
						duration: 300,
						opener: function(e) {
							return e.is("img") ? e : e.find("img")
						}
					},
					proto: {
						initZoom: function() {
							var t, n = e.st.zoom,
								i = ".zoom";
							if (n.enabled && e.supportsTransition) {
								var o, r, a = n.duration,
									u = function(e) {
										var t = e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
											i = "all " + n.duration / 1e3 + "s " + n.easing,
											o = {
												position: "fixed",
												zIndex: 9999,
												left: 0,
												top: 0,
												"-webkit-backface-visibility": "hidden"
											},
											r = "transition";
										return o["-webkit-" + r] = o["-moz-" + r] = o["-o-" + r] = o[r] = i, t.css(o), t
									},
									c = function() {
										e.content.css("visibility", "visible")
									};
								y("BuildControls" + i, (function() {
									if (e._allowZoom()) {
										if (clearTimeout(o), e.content.css("visibility", "hidden"), !(t = e._getItemToZoom())) return void c();
										(r = u(t)).css(e._getOffset()), e.wrap.append(r), o = setTimeout((function() {
											r.css(e._getOffset(!0)), o = setTimeout((function() {
												c(), setTimeout((function() {
													r.remove(), t = r = null, _("ZoomAnimationEnded")
												}), 16)
											}), a)
										}), 16)
									}
								})), y(s + i, (function() {
									if (e._allowZoom()) {
										if (clearTimeout(o), e.st.removalDelay = a, !t) {
											if (!(t = e._getItemToZoom())) return;
											r = u(t)
										}
										r.css(e._getOffset(!0)), e.wrap.append(r), e.content.css("visibility", "hidden"), setTimeout((function() {
											r.css(e._getOffset())
										}), 16)
									}
								})), y(d + i, (function() {
									e._allowZoom() && (c(), r && r.remove(), t = null)
								}))
							}
						},
						_allowZoom: function() {
							return "image" === e.currItem.type
						},
						_getItemToZoom: function() {
							return !!e.currItem.hasSize && e.currItem.img
						},
						_getOffset: function(t) {
							var n, i = (n = t ? e.currItem.img : e.st.zoom.opener(e.currItem.el || e.currItem)).offset(),
								o = parseInt(n.css("padding-top"), 10),
								r = parseInt(n.css("padding-bottom"), 10);
							i.top -= $(window).scrollTop() - o;
							var d = {
								width: n.width(),
								height: (v ? n.innerHeight() : n[0].offsetHeight) - r - o
							};
							return void 0 === z && (z = void 0 !== document.createElement("p").style.MozTransform), z ? d["-moz-transform"] = d.transform = "translate(" + i.left + "px," + i.top + "px)" : (d.left = i.left, d.top = i.top), d
						}
					}
				});
				var B = "iframe",
					R = function(t) {
						if (e.currTemplate[B]) {
							var n = e.currTemplate[B].find("iframe");
							n.length && (t || (n[0].src = "//about:blank"), e.isIE8 && n.css("display", t ? "block" : "none"))
						}
					};
				$.magnificPopup.registerModule(B, {
					options: {
						markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
						srcAction: "iframe_src",
						patterns: {
							youtube: {
								index: "youtube.com",
								id: "v=",
								src: "//www.youtube.com/embed/%id%?autoplay=1"
							},
							vimeo: {
								index: "vimeo.com/",
								id: "/",
								src: "//player.vimeo.com/video/%id%?autoplay=1"
							},
							gmaps: {
								index: "//maps.google.",
								src: "%id%&output=embed"
							}
						}
					},
					proto: {
						initIframe: function() {
							e.types.push(B), y("BeforeChange", (function(e, t, n) {
								t !== n && (t === B ? R() : n === B && R(!0))
							})), y(d + "." + B, (function() {
								R()
							}))
						},
						getIframe: function(t, n) {
							var i = t.src,
								o = e.st.iframe;
							$.each(o.patterns, (function() {
								if (i.indexOf(this.index) > -1) return this.id && (i = "string" == typeof this.id ? i.substr(i.lastIndexOf(this.id) + this.id.length, i.length) : this.id.call(this, i)), i = this.src.replace("%id%", i), !1
							}));
							var r = {};
							return o.srcAction && (r[o.srcAction] = i), e._parseMarkup(n, r, t), e.updateStatus("ready"), n
						}
					}
				});
				var H = function(t) {
						var n = e.items.length;
						return t > n - 1 ? t - n : t < 0 ? n + t : t
					},
					D = function(e, t, n) {
						return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n)
					};
				$.magnificPopup.registerModule("gallery", {
					options: {
						enabled: !1,
						arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
						preload: [0, 2],
						navigateByImgClick: !0,
						arrows: !0,
						tPrev: "Previous (Left arrow key)",
						tNext: "Next (Right arrow key)",
						tCounter: "%curr% of %total%"
					},
					proto: {
						initGallery: function() {
							var t = e.st.gallery,
								i = ".mfp-gallery";
							if (e.direction = !0, !t || !t.enabled) return !1;
							o += " mfp-gallery", y(u + i, (function() {
								t.navigateByImgClick && e.wrap.on("click" + i, ".mfp-img", (function() {
									if (e.items.length > 1) return e.next(), !1
								})), n.on("keydown" + i, (function(t) {
									37 === t.keyCode ? e.prev() : 39 === t.keyCode && e.next()
								}))
							})), y("UpdateStatus" + i, (function(t, n) {
								n.text && (n.text = D(n.text, e.currItem.index, e.items.length))
							})), y(a + i, (function(n, i, o, r) {
								var d = e.items.length;
								o.counter = d > 1 ? D(t.tCounter, r.index, d) : ""
							})), y("BuildControls" + i, (function() {
								if (e.items.length > 1 && t.arrows && !e.arrowLeft) {
									var n = t.arrowMarkup,
										i = e.arrowLeft = $(n.replace(/%title%/gi, t.tPrev).replace(/%dir%/gi, "left")).addClass(m),
										o = e.arrowRight = $(n.replace(/%title%/gi, t.tNext).replace(/%dir%/gi, "right")).addClass(m);
									i.click((function() {
										e.prev()
									})), o.click((function() {
										e.next()
									})), e.container.append(i.add(o))
								}
							})), y(c + i, (function() {
								e._preloadTimeout && clearTimeout(e._preloadTimeout), e._preloadTimeout = setTimeout((function() {
									e.preloadNearbyImages(), e._preloadTimeout = null
								}), 16)
							})), y(d + i, (function() {
								n.off(i), e.wrap.off("click" + i), e.arrowRight = e.arrowLeft = null
							}))
						},
						next: function() {
							e.direction = !0, e.index = H(e.index + 1), e.updateItemHTML()
						},
						prev: function() {
							e.direction = !1, e.index = H(e.index - 1), e.updateItemHTML()
						},
						goTo: function(t) {
							e.direction = t >= e.index, e.index = t, e.updateItemHTML()
						},
						preloadNearbyImages: function() {
							var t, n = e.st.gallery.preload,
								i = Math.min(n[0], e.items.length),
								o = Math.min(n[1], e.items.length);
							for (t = 1; t <= (e.direction ? o : i); t++) e._preloadItem(e.index + t);
							for (t = 1; t <= (e.direction ? i : o); t++) e._preloadItem(e.index - t)
						},
						_preloadItem: function(t) {
							if (t = H(t), !e.items[t].preloaded) {
								var n = e.items[t];
								n.parsed || (n = e.parseEl(t)), _("LazyLoad", n), "image" === n.type && (n.img = $('<img class="mfp-img" />').on("load.mfploader", (function() {
									n.hasSize = !0
								})).on("error.mfploader", (function() {
									n.hasSize = !0, n.loadError = !0, _("LazyLoadError", n)
								})).attr("src", n.src)), n.preloaded = !0
							}
						}
					}
				});
				var V = "retina";
				$.magnificPopup.registerModule(V, {
					options: {
						replaceSrc: function(e) {
							return e.src.replace(/\.\w+$/, (function(e) {
								return "@2x" + e
							}))
						},
						ratio: 1
					},
					proto: {
						initRetina: function() {
							if (window.devicePixelRatio > 1) {
								var t = e.st.retina,
									n = t.ratio;
								(n = isNaN(n) ? n() : n) > 1 && (y("ImageHasSize." + V, (function(e, t) {
									t.img.css({
										"max-width": t.img[0].naturalWidth / n,
										width: "100%"
									})
								})), y("ElementParse." + V, (function(e, i) {
									i.src = t.replaceSrc(i, n)
								})))
							}
						}
					}
				})
			},
			246: () => {
				const e = 'a[href$=".jpg"], a[href*=".jpg?"], a[href$=".jpeg"], a[href*=".jpeg?"], a[href$=".png"], a[href*=".png?"], a[href$=".gif"], a[href*=".gif?"]';
				$(document).ready((function() {
					$(".post-body").find(e).each((function() {
						const e = $(this).attr("href");
						$(this).parent().append(`<img src="${e}" href="${e}" onerror="$(this).hide();">`)
					}))
				})), $(".article-body > p > img").each((function() {
					const e = $(this).attr("src");
					$(this).attr("href", e)
				})), $(".article-body > p > img").magnificPopup({
					type: "image",
					showCloseBtn: !1,
					gallery: {
						enabled: !0,
						navigateByImgClick: !1
					}
				}).css("cursor", "pointer"), setTimeout((() => {
					$(".post-body").each((function() {
						$(this).find("img:not(.emoji):not(.custom-emoji)").magnificPopup({
							type: "image",
							showCloseBtn: !1,
							gallery: {
								enabled: !0,
								navigateByImgClick: !1
							}
						})
					}))
				}), 500), $('.post-body a[href*="twitter.com"]').each((function() {
					const e = $(this);
					let t = e.attr("href");
					t = t.split("/photo")[0], t = t.replace(/\/$/, ""), $.ajax({
						url: `https://publish.twitter.com/oembed?url=${t}`,
						dataType: "jsonp",
						success: function(t) {
							const n = $(t.html).attr({
								"data-theme": "dark",
								"data-width": "500",
								"data-tweet-limit": "1"
							});
							e.parent().append(n)
						}
					})
				})), $('.post-body a[href*="imgur.com"]').not(e).each((function() {
					const e = $(this),
						t = e.attr("href");
					$.ajax({
						url: `https://api.imgur.com/oembed?url=${t}`,
						data_type: "json",
						success: function(t) {
							const n = $(t.html);
							e.parent().append(n)
						}
					})
				})), $('.post-body a[href*="twitch.tv"]').each((function() {
					const e = $(this),
						t = e.attr("href");
					let n = t.match(/clip\/([^/?]+)/) || t.match(/clips\.twitch\.tv\/([^/?]+)/);
					if (null !== n) {
						n = n[1];
						const t = $(`<iframe src="https://clips.twitch.tv/embed?clip=${n}&parent=www.vlr.gg" allowfullscreen scrolling="no"</iframe>`);
						t.css({
							width: "100%",
							height: "100%",
							"max-width": "700px",
							"aspect-ratio": "16/9",
							"margin-top": "5px"
						}), e.parent().append(t)
					}
				})), $('.post-body a[href*="youtube.com"], .post-body a[href*="youtu.be"]').each((function() {
					const e = $(this),
						t = e.attr("href");
					$.ajax({
						url: `https://youtube.com/oembed?url=${t}`,
						data_type: "json",
						success: function(t) {
							const n = $(t.html);
							n.css({
								width: "100%",
								height: "100%",
								"max-width": "700px",
								"aspect-ratio": "16/9",
								"margin-top": "5px"
							}), e.parent().append(n)
						}
					})
				}))
			},
			704: () => {
				$(document).ready((function() {
					$(".match-header").length && ($("head").prepend('<link rel="stylesheet" type="text/css" href="https://www.vlr.gg/css/base/pages/team_stats_vlr.css">'), $('<div class="wf-label" style="margin: 22px 0 0 0;" id="maps_winrate">Map winrate percentage</div>\n        <div style="display: flex;" id="maps_winrate_table">\n        <div class="wf-card mod-dark mod-first match-histories" id="maps_winrate_table1"></div>\n        <div class="wf-card mod-dark match-histories" id="maps_winrate_table2"></div>\n        </div>').insertAfter(".wf-label:contains(Past Matches) + div"), [$("a.match-header-link.wf-link-hover.mod-1").attr("href"), $("a.match-header-link.wf-link-hover.mod-2").attr("href")].forEach((function(e, t) {
						e ? $.get("https://www.vlr.gg/team/stats/" + e.substring(6)).done((function(e) {
							const n = $(e).find(".wf-table").parent(".mod-table");
							for (n.find(".mod-def").remove(), n.find(".mod-atk").remove(), n.find(".mod-mini").remove(), n.find(".mod-center").remove(), n.find(".map-games-toggle").parent(".mod-supercell").remove(); n.find("tr").find("td.mod-supercell:nth-child(3)").length;) n.find("tr").find("td.mod-supercell:nth-child(3)").remove();
							n.find(".mod-toggle").remove(), n.find("tr").each((function(e, t) {
								$(t).addClass("maps_perc_row"), $(t).attr("row_index", e)
							})), n.find("img").each((function() {
								const e = $(this).attr("src");
								e.startsWith("http://") && $(this).attr("src", e.replace("http://", "https://"))
							})), $("#maps_winrate_table" + (t + 1)).prepend(n.html())
						})).fail((function() {
							console.log(`BetterVLR: Team ${t+1} is TBD`)
						})) : console.log(`statsVLR: Team ${t+1} is TBD`)
					}))), $(document).ajaxStop((function() {
						$(".maps_perc_row").find(".mod-supercell").next().each((function() {
							const e = $(this).text().trim(),
								t = parseFloat(e.replace("%", ""));
							isNaN(t) || (t <= 45 ? $(this).css("color", "#f66f7a") : t >= 55 && $(this).css("color", "#60c377"))
						}))
					}))
				}))
			},
			428: () => {
				$(".wf-label.mod-large:contains(Current\tRoster)").addClass("active").after('<h2 class="wf-label mod-large">Past Players</h2>'), $(".wf-label.mod-large:contains(Current\tRoster)").next().addBack().wrapAll('<div class="rosters">');
				var e = $(".rosters").next().html();
				$("body").on("click", ".rosters > h2", (function() {
					if ($(".rosters > h2").removeClass("active"), $(this).addClass("active"), "Past Players" === $(this).text()) {
						$(this).parent().next().html(`<div id="past-players">${e}</div>`);
						var t = window.location.href,
							n = `https://www.vlr.gg/team/transactions/${t.match(/team\/(\d+)\//)[1]}/${t.match(/team\/\d+\/([^/]+)/)[1]}`;
						$.ajax({
							url: n,
							method: "GET",
							success: function(e) {
								var t = '\n        <div class="wf-module-label" style="margin-bottom: 12px;">players</div>\n        <div style="display: flex; flex-wrap: wrap;">',
									n = '\n        <div class="wf-module-label" style="margin-bottom: 12px;">staff</div>\n        <div style="display: flex; flex-wrap: wrap;">';
								$(e).find(".txn-item").each((function() {
									var e = $(this).find("td:nth-child(5)").text().trim();
									if ("Player" !== e && "Stand-in" !== e || !$(this).children(".txn-item-action").hasClass("mod-leave")) $(this).children(".txn-item-action").hasClass("mod-leave") && (i = $(this).find("td:nth-child(4) > div > a").attr("href"), o = $(this).find("td:nth-child(4) > div > a").text().trim(), r = $(this).find("td:nth-child(4) > div > .ge-text-light").text().trim(), d = $(this).find("td:nth-child(3) > .flag").attr("class"), n += `\n            <div class="team-roster-item">\n              <a href="${i}" style="display: flex;">\n                <div class="team-roster-item-img">\n                  <img src="https://www.vlr.gg/img/base/ph/sil.png">\n                </div>\n                <div class="team-roster-item-name">\n                  <div class="team-roster-item-name-alias">\n                    <i class="${d}" style="vertical-align: -4px;"></i>${o} </div>\n                  <div class="team-roster-item-name-real">${r}</div>\n                  <div class="wf-tag mod-light team-roster-item-name-role">${e}</div>\n                </div>\n              </a>\n            </div>`);
									else {
										var i = $(this).find("td:nth-child(4) > div > a").attr("href"),
											o = $(this).find("td:nth-child(4) > div > a").text().trim(),
											r = $(this).find("td:nth-child(4) > div > .ge-text-light").text().trim(),
											d = $(this).find("td:nth-child(3) > .flag").attr("class");
										t += `\n            <div class="team-roster-item">\n              <a href="${i}" style="display: flex;">\n                <div class="team-roster-item-img">\n                  <img src="https://www.vlr.gg/img/base/ph/sil.png">\n                </div>\n                <div class="team-roster-item-name">\n                  <div class="team-roster-item-name-alias">\n                    <i class="${d}" style="vertical-align: -4px;"></i>${o} </div>\n                  <div class="team-roster-item-name-real">${r}</div>\n                  <div class="wf-tag mod-light team-roster-item-name-role">${e}</div>\n                </div>\n              </a>\n            </div>`
									}
								}));
								var i = (t += "</div>") + (n += "</div>");
								$("#past-players").html(i)
							},
							error: function(e) {
								console.log("Error:", e)
							}
						})
					} else $(this).parent().next().html(e)
				}))
			},
			568: () => {
				$(".post-editor-header-action[title=Spoiler]").after('<li class="post-editor-header-action polls-button" title="Polls"><i class="fa fa-pie-chart"></i></li>'), $(document).on("click", ".polls-button", (function() {
					$.magnificPopup.open({
						items: {
							src: '\n            <div class="polls-popup wf-card">\n                <form id="polls">\n                    <div>\n                        <label>Title</label>\n                        <input id="poll-title" placeholder="Type your question here" type="text" required />\n                    </div>\n                    <div class="answer-options">\n                        <label>Answer Options</label>\n                        <input placeholder="Option 1" type="text" required />\n                        <input placeholder="Option 2" type="text" required />\n                        <button type="button" id="add-option" class="btn">Add Option</button>\n                    </div>\n                    <button class="btn mod-action">Create</button>\n                </form>\n            </div>',
							type: "inline"
						}
					})
				})), $(document).on("click", "#add-option", (function() {
					var e = $(".answer-options"),
						t = e.children("input:last"),
						n = e.children("input").length + 1;
					$('<input type="text">').attr("placeholder", "Option " + n).insertAfter(t)
				})), $(document).on("submit", "#polls", (function(e) {
					e.preventDefault();
					var t = $("#poll-title").val(),
						n = [];
					$(".answer-options input").each((function() {
						var e = $(this).val();
						"" !== e.trim() && n.push({
							type: "text",
							value: e
						})
					})), $.ajax({
						url: "https://api.strawpoll.com/v3/polls",
						type: "POST",
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify({
							title: t,
							poll_options: n,
							poll_config: {
								allow_comments: !1
							}
						}),
						success: function(e) {
							var t = $("textarea:focus")[0];
							inlineAttachment.util.insertTextAtCursor(t, e.url + " ")
						},
						error: function(e) {
							var t = $("textarea:focus")[0];
							inlineAttachment.util.insertTextAtCursor(t, "[ERROR CREATING POLL] "), console.error("Error creating poll:", e)
						}
					}), $.magnificPopup.close()
				})), $('.post-body a[href*="strawpoll.com"]').each((function() {
					var e = $(this).attr("href").match(/strawpoll\.com\/([a-zA-Z0-9]+)/);
					if (null !== e) {
						e = e[1];
						const t = $(`\n        <div class="strawpoll-embed" id="strawpoll_${e}">\n            <iframe title="StrawPoll Embed" id="strawpoll_iframe_${e}" src="https://strawpoll.com/embed/${e}"></iframe>\n            <script async src="https://cdn.strawpoll.com/dist/widgets.js" charset="utf-8"><\/script>\n        </div>`);
						t.css({
							height: "480px",
							"max-width": "640px",
							width: "100%",
							display: "flex",
							"flex-direction": "column"
						}), t.children().css({
							display: "block",
							"flex-grow": "1"
						}), t.children().attr({
							frameborder: "0",
							scrolling: "no",
							allowfullscreen: "",
							allowtransparency: ""
						}), $(this).parent().append(t)
					}
				}))
			},
			165: () => {
				window.location.href.startsWith("https://www.vlr.gg/user/") && $(".post-body").each((function() {
					var e = $(this).parent().find("a:first").attr("href"),
						t = $(this).text().trim(),
						n = encodeURIComponent(t);
					$(this).find(".emoji").each((function() {
						var e = $(this).attr("alt");
						n += e
					}));
					var i = $("#profile-header").text().trim(),
						o = e + "?author=" + encodeURIComponent(i) + "&text=" + n;
					$(this).after('<a style="font-size: 12px; font-weight: 500; position: absolute; right: 20px;">GO TO COMMENT</a>'), $(this).next().attr("href", o), console.log(n)
				})), $(document).ready((function() {
					const e = window.location.search,
						t = new URLSearchParams(e),
						n = decodeURIComponent(t.get("author")),
						i = decodeURIComponent(t.get("text")),
						o = $(".post-body").filter((function() {
							return $(this).text().trim() === i && $(this).parent().find(".post-header-author").text().trim() === n
						}));
					if (o.length > 0) {
						const t = o.parent().find(".post-anchor").attr("id"),
							n = window.location.href.replace(e, "");
						window.location.href = n + "#" + t
					}
				}))
			},
			840: () => {
				$(".wf-card:contains(No matches were found for)").after('\n<div style="color: #666; text-transform: uppercase; font-size: 11px; padding-left: 21px;">\n    <span id="possible-results-number"><i class="fa fa-spinner fa-spin"></i></span> possible results \n</div>\n<div class="wf-card" style="margin-top: 15px;">\n    <div id="possible-results"></div>\n</div>'), $(document).ajaxStop((function() {
					$(".wf-module-item").first().addClass("mod-first")
				}));
				var e = $(".wf-card:contains(No matches were found for) > div > span").text();
				e = e.replace(/ /g, "+").replace(".", ""), $.get("https://www.vlr.gg/search/threads/", {
					q: e
				}, (function(e) {
					var t = $(e).find(".thread:contains(Matches)").map((function() {
						var e, t, n = $(this).find(".thread-item-header-title").attr("href"),
							i = $(this).find(".thread-item-header-title").text(),
							o = $(this).find(".date-eta").text(),
							r = $(this).find(".date-full").text().trim(),
							d = i.split("–")[0].split("vs."),
							s = d[0].trim(),
							a = d[1].trim();
						return $.ajax({
							url: "https://www.vlr.gg/search/",
							data: {
								q: s,
								type: "teams"
							},
							async: !1,
							success: function(t) {
								e = $(t).find(".wf-module-item.search-item img").attr("src")
							},
							error: function() {
								console.log("Error retrieving team logo image.")
							}
						}), $.ajax({
							url: "https://www.vlr.gg/search/",
							data: {
								q: a,
								type: "teams"
							},
							async: !1,
							success: function(e) {
								t = $(e).find(".wf-module-item.search-item img").attr("src")
							},
							error: function() {
								console.log("Error retrieving team logo image.")
							}
						}), `\n            <a href="${n}" class="wf-module-item search-item" style="padding: 20px; font-size: 12px;">\n                <div style="display: flex; align-items: center; font-size: large; gap: 5px; font-family: auto;">\n                    <img src="${e}" style="width: 30px;">\n                    <span>VS</span>\n                    <img src="${t}" style="width: 30px;">\n                </div>\n                <div style="margin-left: 20px;">\n                    <div class="search-item-title">${i}</div>\n                    <div class="search-item-desc">\n                        <span style="font-style: italic;">${o} (${r})</span>\n                    </div>\n                </div>\n            </a>`
					})).get().join("");
					$("#possible-results").html(t);
					var n = $(e).find(".thread:contains(Matches)").length;
					$("#possible-results-number").text(n)
				}))
			},
			104: () => {
				function e() {
					var e = JSON.parse(localStorage.getItem("settings")) || {},
						t = e.hide_flags,
						n = e.hide_stars,
						i = e.esports_mode,
						o = e.sticky_header,
						r = e.match_comments,
						d = e.live_streams,
						s = e.stickied_threads,
						a = e.recent_discussions,
						u = e.imgur_proxy;
					t && ($(".post-header-flag").hide(), $(".post-header-num").css("margin-right", "6px")), n && $(".post-header-stars").hide(), i && ($(".js-home-stickied").replaceWith($(".js-home-matches-completed")), $(".js-home-threads").hide(), $(".js-home-events").find("h1:contains(completed)").next().addBack().insertAfter(".js-home-matches-upcoming")), o && $(".header").css({
						position: "sticky",
						top: "0"
					}), r && $(".match-header").length && $(".post-container, form:has(.post-editor)").prev().addBack().hide(), d && $(".js-home-streams .mod-sidebar:not(:has(.mod-color))").not("h1").hide(), s && $(".js-home-stickied").hide(), a && $(".js-home-threads").hide(), u && setTimeout((function() {
						$("img").each((function() {
							var e = $(this).attr("src");
							if (e.includes("imgur.com")) {
								var t = e.replace("imgur.com", "imgurp.com");
								$(this).attr("src", t), $(this).attr("href") && $(this).attr("href", t)
							}
						}))
					}), 0)
				}
				$('.wf-card input[type="checkbox"]').on("change", (function() {
					var t, n;
					t = $(this).attr("id"), (n = JSON.parse(localStorage.getItem("settings")) || {})[t] = $("#" + t).is(":checked"), localStorage.setItem("settings", JSON.stringify(n)), e()
				})), $(document).ready((function() {
					var t;
					t = JSON.parse(localStorage.getItem("settings")) || {}, $("#hide_flags").prop("checked", t.hide_flags), $("#hide_stars").prop("checked", t.hide_stars), $("#esports_mode").prop("checked", t.esports_mode), $("#sticky_header").prop("checked", t.sticky_header), $("#match_comments").prop("checked", t.match_comments), $("#live_streams").prop("checked", t.live_streams), $("#stickied_threads").prop("checked", t.stickied_threads), $("#recent_discussions").prop("checked", t.recent_discussions), $("#imgur_proxy").prop("checked", t.imgur_proxy), e()
				}))
			},
			899: () => {
				$(".post-editor-header-action[title=Spoiler]").after('\n<label class="post-editor-header-action" title="File Picker">\n    <i class="fa fa-picture-o"></i>\n    <input id="file-upload" type="file" multiple accept="image/*" style="display: none;">\n</label>');
				const e = {
					uploadUrl: "https://api.imgur.com/3/image",
					jsonFieldName: "data.link",
					uploadFieldName: "image",
					progressText: "[UPLOADING FILE] ",
					urlText: "{filename}",
					errorText: "[ERROR UPLOADING FILE] ",
					extraHeaders: {
						Authorization: "Client-ID b234bda60e00570"
					},
					onFileUploadResponse: function(e) {
						var t = JSON.parse(e.responseText);
						if (t && t.data && t.data.link) {
							var n, i = t.data.link + " ";
							n = "function" == typeof this.settings.urlText ? this.settings.urlText.call(this, i, t) : this.settings.urlText.replace(this.filenameTag, i);
							var o = this.editor.getValue().replace(this.lastValue, n);
							this.editor.setValue(o), this.settings.onFileUploaded.call(this, i)
						}
					},
					onFileUploadError: function() {
						var t = this.editor.getValue().replace(this.lastValue, e.errorText);
						this.editor.setValue(t)
					}
				};
				$(document).on("focus", ".post-editor-text", (function() {
					var t = $(this);
					t.data("inlineattachment") || (t.inlineattachment(e), t.data("inlineattachment", !0))
				})), $(document).on("change", "#file-upload", (function() {
					for (var t = e.progressText, n = e.errorText, i = $(".post-editor-text:focus")[0], o = new FormData, r = 0; r < this.files.length; r++) inlineAttachment.util.insertTextAtCursor(i, t), o.append(e.uploadFieldName, this.files[r]), $.ajax({
						url: e.uploadUrl,
						type: "POST",
						headers: e.extraHeaders,
						data: o,
						processData: !1,
						contentType: !1,
						success: function(e) {
							var n = e.data.link + " ",
								o = $(i).val().replace(t, n);
							$(i).val(o)
						},
						error: function() {
							var e = $(i).val().replace(t, n);
							$(i).val(e)
						}
					})
				}))
			},
			335: () => {
				if (0 === $(".mod-login").length) var e = $(".header-nav-item.mod-user").attr("href").split("/user/")[1];

				function t(e) {
					var t = $("#blocked_users");
					for (var n in t.empty(), e) {
						var i = `\n            <li class="wf-module-item" style="display: flex; justify-content: space-between; align-items: center; height: 50px;">\n                <a href="/user/${n}">${n}</a>\n                <button class="btn mod-action unblock-btn btn" data-user="${n}" style="background-color: #79c38a; width: 50px;">Unblock</button>\n            </li>`;
						t.append(i)
					}
				}

				function n(e, t) {
					e.find(".post-header-author").text(t)
				}

				function i(e, t) {
					var n = e.find(".post-header-children"),
						i = (e.find(".post-body"), function(e, t, n) {
							var i = $("<div></div>").addClass("show-post").text("Show Post");
							return i.css({
								"background-color": "#da626c",
								padding: "7px",
								"border-radius": "5px",
								"margin-left": "10px",
								cursor: "pointer"
							}), i.on("click", (function() {
								t.trigger("click"), "Show Post" === i.text() ? (i.text("Hide Post"), $(this).parent().find(".post-header-flag").css("filter", "brightness(1)"), $(this).parent().find(".post-header-author").text(n)) : (i.text("Show Post"), $(this).parent().find(".post-header-flag").css("filter", "brightness(0)"), $(this).parent().find(".post-header-author").text("Blocked User"))
							})), i
						}(0, e.find(".js-post-toggle"), t));
					n.after(i)
				}
				$(document).ready((function() {
					if (localStorage.getItem("blocked_users")) {
						var e = JSON.parse(localStorage.getItem("blocked_users"));
						t(e),
							function(e) {
								for (var t in e) $(`.wf-card:contains('${t}')`).each((function() {
									var e = $(this).find(".js-post-toggle"),
										t = $(this).find(".post-header-author").text();
									e.trigger("click"), n($(this), t), i($(this), t), $(this).parent().find(".post-header-flag").css("filter", "brightness(0)"), $(this).parent().find(".post-header-author").text("Blocked User")
								}))
							}(e)
					}
				})), $(document).on("click", "#block-btn", (function(n) {
					n.preventDefault();
					var i = $("#user-to-block").val().trim();
					$.ajax({
						url: `https://www.vlr.gg/user/${i}`,
						method: "GET",
						success: function(n) {
							if ($(n).find("#profile-header").length) {
								i = $(n).find("#profile-header").text().trim();
								var o = JSON.parse(localStorage.getItem("blocked_users")) || {},
									r = o.hasOwnProperty(i),
									d = i === e;
								r ? alert("User already blocked") : d ? alert("You cant block yourself!") : (o[i] = "blocked", localStorage.setItem("blocked_users", JSON.stringify(o)), $("#user-to-block").val(""), t(o))
							}
						},
						error: function() {
							alert("User doesn't exist")
						}
					})
				})), $(document).on("click", ".unblock-btn", (function() {
					var e = $(this).data("user"),
						n = JSON.parse(localStorage.getItem("blocked_users")) || {};
					delete n[e], localStorage.setItem("blocked_users", JSON.stringify(n)), t(n)
				}))
			}
		},
		t = {};

	function n(i) {
		var o = t[i];
		if (void 0 !== o) return o.exports;
		var r = t[i] = {
			exports: {}
		};
		return e[i](r, r.exports, n), r.exports
	}(() => {
		"use strict";

		function e(e) {
			if (null == e) return window;
			if ("[object Window]" !== e.toString()) {
				var t = e.ownerDocument;
				return t && t.defaultView || window
			}
			return e
		}

		function t(t) {
			return t instanceof e(t).Element || t instanceof Element
		}

		function i(t) {
			return t instanceof e(t).HTMLElement || t instanceof HTMLElement
		}

		function o(t) {
			return "undefined" != typeof ShadowRoot && (t instanceof e(t).ShadowRoot || t instanceof ShadowRoot)
		}
		var r = Math.max,
			d = Math.min,
			s = Math.round;

		function a() {
			var e = navigator.userAgentData;
			return null != e && e.brands && Array.isArray(e.brands) ? e.brands.map((function(e) {
				return e.brand + "/" + e.version
			})).join(" ") : navigator.userAgent
		}

		function u() {
			return !/^((?!chrome|android).)*safari/i.test(a())
		}

		function c(n, o, r) {
			void 0 === o && (o = !1), void 0 === r && (r = !1);
			var d = n.getBoundingClientRect(),
				a = 1,
				c = 1;
			o && i(n) && (a = n.offsetWidth > 0 && s(d.width) / n.offsetWidth || 1, c = n.offsetHeight > 0 && s(d.height) / n.offsetHeight || 1);
			var l = (t(n) ? e(n) : window).visualViewport,
				f = !u() && r,
				p = (d.left + (f && l ? l.offsetLeft : 0)) / a,
				h = (d.top + (f && l ? l.offsetTop : 0)) / c,
				m = d.width / a,
				g = d.height / c;
			return {
				width: m,
				height: g,
				top: h,
				right: p + m,
				bottom: h + g,
				left: p,
				x: p,
				y: h
			}
		}

		function l(t) {
			var n = e(t);
			return {
				scrollLeft: n.pageXOffset,
				scrollTop: n.pageYOffset
			}
		}

		function f(e) {
			return e ? (e.nodeName || "").toLowerCase() : null
		}

		function p(e) {
			return ((t(e) ? e.ownerDocument : e.document) || window.document).documentElement
		}

		function h(e) {
			return c(p(e)).left + l(e).scrollLeft
		}

		function m(t) {
			return e(t).getComputedStyle(t)
		}

		function g(e) {
			var t = m(e),
				n = t.overflow,
				i = t.overflowX,
				o = t.overflowY;
			return /auto|scroll|overlay|hidden/.test(n + o + i)
		}

		function v(t, n, o) {
			void 0 === o && (o = !1);
			var r, d, a = i(n),
				u = i(n) && function(e) {
					var t = e.getBoundingClientRect(),
						n = s(t.width) / e.offsetWidth || 1,
						i = s(t.height) / e.offsetHeight || 1;
					return 1 !== n || 1 !== i
				}(n),
				m = p(n),
				v = c(t, u, o),
				b = {
					scrollLeft: 0,
					scrollTop: 0
				},
				y = {
					x: 0,
					y: 0
				};
			return (a || !a && !o) && (("body" !== f(n) || g(m)) && (b = (r = n) !== e(r) && i(r) ? {
				scrollLeft: (d = r).scrollLeft,
				scrollTop: d.scrollTop
			} : l(r)), i(n) ? ((y = c(n, !0)).x += n.clientLeft, y.y += n.clientTop) : m && (y.x = h(m))), {
				x: v.left + b.scrollLeft - y.x,
				y: v.top + b.scrollTop - y.y,
				width: v.width,
				height: v.height
			}
		}

		function b(e) {
			var t = c(e),
				n = e.offsetWidth,
				i = e.offsetHeight;
			return Math.abs(t.width - n) <= 1 && (n = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), {
				x: e.offsetLeft,
				y: e.offsetTop,
				width: n,
				height: i
			}
		}

		function y(e) {
			return "html" === f(e) ? e : e.assignedSlot || e.parentNode || (o(e) ? e.host : null) || p(e)
		}

		function w(e) {
			return ["html", "body", "#document"].indexOf(f(e)) >= 0 ? e.ownerDocument.body : i(e) && g(e) ? e : w(y(e))
		}

		function _(t, n) {
			var i;
			void 0 === n && (n = []);
			var o = w(t),
				r = o === (null == (i = t.ownerDocument) ? void 0 : i.body),
				d = e(o),
				s = r ? [d].concat(d.visualViewport || [], g(o) ? o : []) : o,
				a = n.concat(s);
			return r ? a : a.concat(_(y(s)))
		}

		function x(e) {
			return ["table", "td", "th"].indexOf(f(e)) >= 0
		}

		function k(e) {
			return i(e) && "fixed" !== m(e).position ? e.offsetParent : null
		}

		function C(t) {
			for (var n = e(t), r = k(t); r && x(r) && "static" === m(r).position;) r = k(r);
			return r && ("html" === f(r) || "body" === f(r) && "static" === m(r).position) ? n : r || function(e) {
				var t = /firefox/i.test(a());
				if (/Trident/i.test(a()) && i(e) && "fixed" === m(e).position) return null;
				var n = y(e);
				for (o(n) && (n = n.host); i(n) && ["html", "body"].indexOf(f(n)) < 0;) {
					var r = m(n);
					if ("none" !== r.transform || "none" !== r.perspective || "paint" === r.contain || -1 !== ["transform", "perspective"].indexOf(r.willChange) || t && "filter" === r.willChange || t && r.filter && "none" !== r.filter) return n;
					n = n.parentNode
				}
				return null
			}(t) || n
		}
		var S = "top",
			j = "bottom",
			E = "right",
			O = "left",
			T = "auto",
			M = [S, j, E, O],
			P = "start",
			I = "end",
			L = "viewport",
			z = "popper",
			A = M.reduce((function(e, t) {
				return e.concat([t + "-" + P, t + "-" + I])
			}), []),
			B = [].concat(M, [T]).reduce((function(e, t) {
				return e.concat([t, t + "-" + P, t + "-" + I])
			}), []),
			R = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];

		function H(e) {
			var t = new Map,
				n = new Set,
				i = [];

			function o(e) {
				n.add(e.name), [].concat(e.requires || [], e.requiresIfExists || []).forEach((function(e) {
					if (!n.has(e)) {
						var i = t.get(e);
						i && o(i)
					}
				})), i.push(e)
			}
			return e.forEach((function(e) {
				t.set(e.name, e)
			})), e.forEach((function(e) {
				n.has(e.name) || o(e)
			})), i
		}
		var D = {
			placement: "bottom",
			modifiers: [],
			strategy: "absolute"
		};

		function V() {
			for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
			return !t.some((function(e) {
				return !(e && "function" == typeof e.getBoundingClientRect)
			}))
		}

		function F(e) {
			void 0 === e && (e = {});
			var n = e,
				i = n.defaultModifiers,
				o = void 0 === i ? [] : i,
				r = n.defaultOptions,
				d = void 0 === r ? D : r;
			return function(e, n, i) {
				void 0 === i && (i = d);
				var r, s, a = {
						placement: "bottom",
						orderedModifiers: [],
						options: Object.assign({}, D, d),
						modifiersData: {},
						elements: {
							reference: e,
							popper: n
						},
						attributes: {},
						styles: {}
					},
					u = [],
					c = !1,
					l = {
						state: a,
						setOptions: function(i) {
							var r = "function" == typeof i ? i(a.options) : i;
							f(), a.options = Object.assign({}, d, a.options, r), a.scrollParents = {
								reference: t(e) ? _(e) : e.contextElement ? _(e.contextElement) : [],
								popper: _(n)
							};
							var s, c, p = function(e) {
								var t = H(e);
								return R.reduce((function(e, n) {
									return e.concat(t.filter((function(e) {
										return e.phase === n
									})))
								}), [])
							}((s = [].concat(o, a.options.modifiers), c = s.reduce((function(e, t) {
								var n = e[t.name];
								return e[t.name] = n ? Object.assign({}, n, t, {
									options: Object.assign({}, n.options, t.options),
									data: Object.assign({}, n.data, t.data)
								}) : t, e
							}), {}), Object.keys(c).map((function(e) {
								return c[e]
							}))));
							return a.orderedModifiers = p.filter((function(e) {
								return e.enabled
							})), a.orderedModifiers.forEach((function(e) {
								var t = e.name,
									n = e.options,
									i = void 0 === n ? {} : n,
									o = e.effect;
								if ("function" == typeof o) {
									var r = o({
										state: a,
										name: t,
										instance: l,
										options: i
									});
									u.push(r || function() {})
								}
							})), l.update()
						},
						forceUpdate: function() {
							if (!c) {
								var e = a.elements,
									t = e.reference,
									n = e.popper;
								if (V(t, n)) {
									a.rects = {
										reference: v(t, C(n), "fixed" === a.options.strategy),
										popper: b(n)
									}, a.reset = !1, a.placement = a.options.placement, a.orderedModifiers.forEach((function(e) {
										return a.modifiersData[e.name] = Object.assign({}, e.data)
									}));
									for (var i = 0; i < a.orderedModifiers.length; i++)
										if (!0 !== a.reset) {
											var o = a.orderedModifiers[i],
												r = o.fn,
												d = o.options,
												s = void 0 === d ? {} : d,
												u = o.name;
											"function" == typeof r && (a = r({
												state: a,
												options: s,
												name: u,
												instance: l
											}) || a)
										} else a.reset = !1, i = -1
								}
							}
						},
						update: (r = function() {
							return new Promise((function(e) {
								l.forceUpdate(), e(a)
							}))
						}, function() {
							return s || (s = new Promise((function(e) {
								Promise.resolve().then((function() {
									s = void 0, e(r())
								}))
							}))), s
						}),
						destroy: function() {
							f(), c = !0
						}
					};
				if (!V(e, n)) return l;

				function f() {
					u.forEach((function(e) {
						return e()
					})), u = []
				}
				return l.setOptions(i).then((function(e) {
					!c && i.onFirstUpdate && i.onFirstUpdate(e)
				})), l
			}
		}
		var N = {
			passive: !0
		};

		function q(e) {
			return e.split("-")[0]
		}

		function U(e) {
			return e.split("-")[1]
		}

		function W(e) {
			return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y"
		}

		function J(e) {
			var t, n = e.reference,
				i = e.element,
				o = e.placement,
				r = o ? q(o) : null,
				d = o ? U(o) : null,
				s = n.x + n.width / 2 - i.width / 2,
				a = n.y + n.height / 2 - i.height / 2;
			switch (r) {
				case S:
					t = {
						x: s,
						y: n.y - i.height
					};
					break;
				case j:
					t = {
						x: s,
						y: n.y + n.height
					};
					break;
				case E:
					t = {
						x: n.x + n.width,
						y: a
					};
					break;
				case O:
					t = {
						x: n.x - i.width,
						y: a
					};
					break;
				default:
					t = {
						x: n.x,
						y: n.y
					}
			}
			var u = r ? W(r) : null;
			if (null != u) {
				var c = "y" === u ? "height" : "width";
				switch (d) {
					case P:
						t[u] = t[u] - (n[c] / 2 - i[c] / 2);
						break;
					case I:
						t[u] = t[u] + (n[c] / 2 - i[c] / 2)
				}
			}
			return t
		}
		var G = {
			top: "auto",
			right: "auto",
			bottom: "auto",
			left: "auto"
		};

		function K(t) {
			var n, i = t.popper,
				o = t.popperRect,
				r = t.placement,
				d = t.variation,
				a = t.offsets,
				u = t.position,
				c = t.gpuAcceleration,
				l = t.adaptive,
				f = t.roundOffsets,
				h = t.isFixed,
				g = a.x,
				v = void 0 === g ? 0 : g,
				b = a.y,
				y = void 0 === b ? 0 : b,
				w = "function" == typeof f ? f({
					x: v,
					y
				}) : {
					x: v,
					y
				};
			v = w.x, y = w.y;
			var _ = a.hasOwnProperty("x"),
				x = a.hasOwnProperty("y"),
				k = O,
				$ = S,
				T = window;
			if (l) {
				var M = C(i),
					P = "clientHeight",
					L = "clientWidth";
				M === e(i) && "static" !== m(M = p(i)).position && "absolute" === u && (P = "scrollHeight", L = "scrollWidth"), (r === S || (r === O || r === E) && d === I) && ($ = j, y -= (h && M === T && T.visualViewport ? T.visualViewport.height : M[P]) - o.height, y *= c ? 1 : -1), r !== O && (r !== S && r !== j || d !== I) || (k = E, v -= (h && M === T && T.visualViewport ? T.visualViewport.width : M[L]) - o.width, v *= c ? 1 : -1)
			}
			var z, A = Object.assign({
					position: u
				}, l && G),
				B = !0 === f ? function(e, t) {
					var n = e.x,
						i = e.y,
						o = t.devicePixelRatio || 1;
					return {
						x: s(n * o) / o || 0,
						y: s(i * o) / o || 0
					}
				}({
					x: v,
					y
				}, e(i)) : {
					x: v,
					y
				};
			return v = B.x, y = B.y, c ? Object.assign({}, A, ((z = {})[$] = x ? "0" : "", z[k] = _ ? "0" : "", z.transform = (T.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + y + "px)" : "translate3d(" + v + "px, " + y + "px, 0)", z)) : Object.assign({}, A, ((n = {})[$] = x ? y + "px" : "", n[k] = _ ? v + "px" : "", n.transform = "", n))
		}
		const Z = {
			name: "applyStyles",
			enabled: !0,
			phase: "write",
			fn: function(e) {
				var t = e.state;
				Object.keys(t.elements).forEach((function(e) {
					var n = t.styles[e] || {},
						o = t.attributes[e] || {},
						r = t.elements[e];
					i(r) && f(r) && (Object.assign(r.style, n), Object.keys(o).forEach((function(e) {
						var t = o[e];
						!1 === t ? r.removeAttribute(e) : r.setAttribute(e, !0 === t ? "" : t)
					})))
				}))
			},
			effect: function(e) {
				var t = e.state,
					n = {
						popper: {
							position: t.options.strategy,
							left: "0",
							top: "0",
							margin: "0"
						},
						arrow: {
							position: "absolute"
						},
						reference: {}
					};
				return Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
					function() {
						Object.keys(t.elements).forEach((function(e) {
							var o = t.elements[e],
								r = t.attributes[e] || {},
								d = Object.keys(t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]).reduce((function(e, t) {
									return e[t] = "", e
								}), {});
							i(o) && f(o) && (Object.assign(o.style, d), Object.keys(r).forEach((function(e) {
								o.removeAttribute(e)
							})))
						}))
					}
			},
			requires: ["computeStyles"]
		};
		var Y = {
			left: "right",
			right: "left",
			bottom: "top",
			top: "bottom"
		};

		function X(e) {
			return e.replace(/left|right|bottom|top/g, (function(e) {
				return Y[e]
			}))
		}
		var Q = {
			start: "end",
			end: "start"
		};

		function ee(e) {
			return e.replace(/start|end/g, (function(e) {
				return Q[e]
			}))
		}

		function te(e, t) {
			var n = t.getRootNode && t.getRootNode();
			if (e.contains(t)) return !0;
			if (n && o(n)) {
				var i = t;
				do {
					if (i && e.isSameNode(i)) return !0;
					i = i.parentNode || i.host
				} while (i)
			}
			return !1
		}

		function ne(e) {
			return Object.assign({}, e, {
				left: e.x,
				top: e.y,
				right: e.x + e.width,
				bottom: e.y + e.height
			})
		}

		function ie(n, i, o) {
			return i === L ? ne(function(t, n) {
				var i = e(t),
					o = p(t),
					r = i.visualViewport,
					d = o.clientWidth,
					s = o.clientHeight,
					a = 0,
					c = 0;
				if (r) {
					d = r.width, s = r.height;
					var l = u();
					(l || !l && "fixed" === n) && (a = r.offsetLeft, c = r.offsetTop)
				}
				return {
					width: d,
					height: s,
					x: a + h(t),
					y: c
				}
			}(n, o)) : t(i) ? function(e, t) {
				var n = c(e, !1, "fixed" === t);
				return n.top = n.top + e.clientTop, n.left = n.left + e.clientLeft, n.bottom = n.top + e.clientHeight, n.right = n.left + e.clientWidth, n.width = e.clientWidth, n.height = e.clientHeight, n.x = n.left, n.y = n.top, n
			}(i, o) : ne(function(e) {
				var t, n = p(e),
					i = l(e),
					o = null == (t = e.ownerDocument) ? void 0 : t.body,
					d = r(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0),
					s = r(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0),
					a = -i.scrollLeft + h(e),
					u = -i.scrollTop;
				return "rtl" === m(o || n).direction && (a += r(n.clientWidth, o ? o.clientWidth : 0) - d), {
					width: d,
					height: s,
					x: a,
					y: u
				}
			}(p(n)))
		}

		function oe(e) {
			return Object.assign({}, {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}, e)
		}

		function re(e, t) {
			return t.reduce((function(t, n) {
				return t[n] = e, t
			}), {})
		}

		function de(e, n) {
			void 0 === n && (n = {});
			var o = n,
				s = o.placement,
				a = void 0 === s ? e.placement : s,
				u = o.strategy,
				l = void 0 === u ? e.strategy : u,
				h = o.boundary,
				g = void 0 === h ? "clippingParents" : h,
				v = o.rootBoundary,
				b = void 0 === v ? L : v,
				w = o.elementContext,
				x = void 0 === w ? z : w,
				k = o.altBoundary,
				$ = void 0 !== k && k,
				O = o.padding,
				T = void 0 === O ? 0 : O,
				P = oe("number" != typeof T ? T : re(T, M)),
				I = x === z ? "reference" : z,
				A = e.rects.popper,
				B = e.elements[$ ? I : x],
				R = function(e, n, o, s) {
					var a = "clippingParents" === n ? function(e) {
							var n = _(y(e)),
								o = ["absolute", "fixed"].indexOf(m(e).position) >= 0 && i(e) ? C(e) : e;
							return t(o) ? n.filter((function(e) {
								return t(e) && te(e, o) && "body" !== f(e)
							})) : []
						}(e) : [].concat(n),
						u = [].concat(a, [o]),
						c = u[0],
						l = u.reduce((function(t, n) {
							var i = ie(e, n, s);
							return t.top = r(i.top, t.top), t.right = d(i.right, t.right), t.bottom = d(i.bottom, t.bottom), t.left = r(i.left, t.left), t
						}), ie(e, c, s));
					return l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l
				}(t(B) ? B : B.contextElement || p(e.elements.popper), g, b, l),
				H = c(e.elements.reference),
				D = J({
					reference: H,
					element: A,
					strategy: "absolute",
					placement: a
				}),
				V = ne(Object.assign({}, A, D)),
				F = x === z ? V : H,
				N = {
					top: R.top - F.top + P.top,
					bottom: F.bottom - R.bottom + P.bottom,
					left: R.left - F.left + P.left,
					right: F.right - R.right + P.right
				},
				q = e.modifiersData.offset;
			if (x === z && q) {
				var U = q[a];
				Object.keys(N).forEach((function(e) {
					var t = [E, j].indexOf(e) >= 0 ? 1 : -1,
						n = [S, j].indexOf(e) >= 0 ? "y" : "x";
					N[e] += U[n] * t
				}))
			}
			return N
		}

		function se(e, t, n) {
			return r(e, d(t, n))
		}

		function ae(e, t, n) {
			return void 0 === n && (n = {
				x: 0,
				y: 0
			}), {
				top: e.top - t.height - n.y,
				right: e.right - t.width + n.x,
				bottom: e.bottom - t.height + n.y,
				left: e.left - t.width - n.x
			}
		}

		function ue(e) {
			return [S, E, j, O].some((function(t) {
				return e[t] >= 0
			}))
		}
		var ce = F({
				defaultModifiers: [{
					name: "eventListeners",
					enabled: !0,
					phase: "write",
					fn: function() {},
					effect: function(t) {
						var n = t.state,
							i = t.instance,
							o = t.options,
							r = o.scroll,
							d = void 0 === r || r,
							s = o.resize,
							a = void 0 === s || s,
							u = e(n.elements.popper),
							c = [].concat(n.scrollParents.reference, n.scrollParents.popper);
						return d && c.forEach((function(e) {
								e.addEventListener("scroll", i.update, N)
							})), a && u.addEventListener("resize", i.update, N),
							function() {
								d && c.forEach((function(e) {
									e.removeEventListener("scroll", i.update, N)
								})), a && u.removeEventListener("resize", i.update, N)
							}
					},
					data: {}
				}, {
					name: "popperOffsets",
					enabled: !0,
					phase: "read",
					fn: function(e) {
						var t = e.state,
							n = e.name;
						t.modifiersData[n] = J({
							reference: t.rects.reference,
							element: t.rects.popper,
							strategy: "absolute",
							placement: t.placement
						})
					},
					data: {}
				}, {
					name: "computeStyles",
					enabled: !0,
					phase: "beforeWrite",
					fn: function(e) {
						var t = e.state,
							n = e.options,
							i = n.gpuAcceleration,
							o = void 0 === i || i,
							r = n.adaptive,
							d = void 0 === r || r,
							s = n.roundOffsets,
							a = void 0 === s || s,
							u = {
								placement: q(t.placement),
								variation: U(t.placement),
								popper: t.elements.popper,
								popperRect: t.rects.popper,
								gpuAcceleration: o,
								isFixed: "fixed" === t.options.strategy
							};
						null != t.modifiersData.popperOffsets && (t.styles.popper = Object.assign({}, t.styles.popper, K(Object.assign({}, u, {
							offsets: t.modifiersData.popperOffsets,
							position: t.options.strategy,
							adaptive: d,
							roundOffsets: a
						})))), null != t.modifiersData.arrow && (t.styles.arrow = Object.assign({}, t.styles.arrow, K(Object.assign({}, u, {
							offsets: t.modifiersData.arrow,
							position: "absolute",
							adaptive: !1,
							roundOffsets: a
						})))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
							"data-popper-placement": t.placement
						})
					},
					data: {}
				}, Z, {
					name: "offset",
					enabled: !0,
					phase: "main",
					requires: ["popperOffsets"],
					fn: function(e) {
						var t = e.state,
							n = e.options,
							i = e.name,
							o = n.offset,
							r = void 0 === o ? [0, 0] : o,
							d = B.reduce((function(e, n) {
								return e[n] = function(e, t, n) {
									var i = q(e),
										o = [O, S].indexOf(i) >= 0 ? -1 : 1,
										r = "function" == typeof n ? n(Object.assign({}, t, {
											placement: e
										})) : n,
										d = r[0],
										s = r[1];
									return d = d || 0, s = (s || 0) * o, [O, E].indexOf(i) >= 0 ? {
										x: s,
										y: d
									} : {
										x: d,
										y: s
									}
								}(n, t.rects, r), e
							}), {}),
							s = d[t.placement],
							a = s.x,
							u = s.y;
						null != t.modifiersData.popperOffsets && (t.modifiersData.popperOffsets.x += a, t.modifiersData.popperOffsets.y += u), t.modifiersData[i] = d
					}
				}, {
					name: "flip",
					enabled: !0,
					phase: "main",
					fn: function(e) {
						var t = e.state,
							n = e.options,
							i = e.name;
						if (!t.modifiersData[i]._skip) {
							for (var o = n.mainAxis, r = void 0 === o || o, d = n.altAxis, s = void 0 === d || d, a = n.fallbackPlacements, u = n.padding, c = n.boundary, l = n.rootBoundary, f = n.altBoundary, p = n.flipVariations, h = void 0 === p || p, m = n.allowedAutoPlacements, g = t.options.placement, v = q(g), b = a || (v !== g && h ? function(e) {
									if (q(e) === T) return [];
									var t = X(e);
									return [ee(e), t, ee(t)]
								}(g) : [X(g)]), y = [g].concat(b).reduce((function(e, n) {
									return e.concat(q(n) === T ? function(e, t) {
										void 0 === t && (t = {});
										var n = t,
											i = n.placement,
											o = n.boundary,
											r = n.rootBoundary,
											d = n.padding,
											s = n.flipVariations,
											a = n.allowedAutoPlacements,
											u = void 0 === a ? B : a,
											c = U(i),
											l = c ? s ? A : A.filter((function(e) {
												return U(e) === c
											})) : M,
											f = l.filter((function(e) {
												return u.indexOf(e) >= 0
											}));
										0 === f.length && (f = l);
										var p = f.reduce((function(t, n) {
											return t[n] = de(e, {
												placement: n,
												boundary: o,
												rootBoundary: r,
												padding: d
											})[q(n)], t
										}), {});
										return Object.keys(p).sort((function(e, t) {
											return p[e] - p[t]
										}))
									}(t, {
										placement: n,
										boundary: c,
										rootBoundary: l,
										padding: u,
										flipVariations: h,
										allowedAutoPlacements: m
									}) : n)
								}), []), w = t.rects.reference, _ = t.rects.popper, x = new Map, k = !0, C = y[0], $ = 0; $ < y.length; $++) {
								var I = y[$],
									L = q(I),
									z = U(I) === P,
									R = [S, j].indexOf(L) >= 0,
									H = R ? "width" : "height",
									D = de(t, {
										placement: I,
										boundary: c,
										rootBoundary: l,
										altBoundary: f,
										padding: u
									}),
									V = R ? z ? E : O : z ? j : S;
								w[H] > _[H] && (V = X(V));
								var F = X(V),
									N = [];
								if (r && N.push(D[L] <= 0), s && N.push(D[V] <= 0, D[F] <= 0), N.every((function(e) {
										return e
									}))) {
									C = I, k = !1;
									break
								}
								x.set(I, N)
							}
							if (k)
								for (var W = function(e) {
										var t = y.find((function(t) {
											var n = x.get(t);
											if (n) return n.slice(0, e).every((function(e) {
												return e
											}))
										}));
										if (t) return C = t, "break"
									}, J = h ? 3 : 1; J > 0 && "break" !== W(J); J--);
							t.placement !== C && (t.modifiersData[i]._skip = !0, t.placement = C, t.reset = !0)
						}
					},
					requiresIfExists: ["offset"],
					data: {
						_skip: !1
					}
				}, {
					name: "preventOverflow",
					enabled: !0,
					phase: "main",
					fn: function(e) {
						var t = e.state,
							n = e.options,
							i = e.name,
							o = n.mainAxis,
							s = void 0 === o || o,
							a = n.altAxis,
							u = void 0 !== a && a,
							c = n.boundary,
							l = n.rootBoundary,
							f = n.altBoundary,
							p = n.padding,
							h = n.tether,
							m = void 0 === h || h,
							g = n.tetherOffset,
							v = void 0 === g ? 0 : g,
							y = de(t, {
								boundary: c,
								rootBoundary: l,
								padding: p,
								altBoundary: f
							}),
							w = q(t.placement),
							_ = U(t.placement),
							x = !_,
							k = W(w),
							$ = "x" === k ? "y" : "x",
							T = t.modifiersData.popperOffsets,
							M = t.rects.reference,
							I = t.rects.popper,
							L = "function" == typeof v ? v(Object.assign({}, t.rects, {
								placement: t.placement
							})) : v,
							z = "number" == typeof L ? {
								mainAxis: L,
								altAxis: L
							} : Object.assign({
								mainAxis: 0,
								altAxis: 0
							}, L),
							A = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
							B = {
								x: 0,
								y: 0
							};
						if (T) {
							if (s) {
								var R, H = "y" === k ? S : O,
									D = "y" === k ? j : E,
									V = "y" === k ? "height" : "width",
									F = T[k],
									N = F + y[H],
									J = F - y[D],
									G = m ? -I[V] / 2 : 0,
									K = _ === P ? M[V] : I[V],
									Z = _ === P ? -I[V] : -M[V],
									Y = t.elements.arrow,
									X = m && Y ? b(Y) : {
										width: 0,
										height: 0
									},
									Q = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : {
										top: 0,
										right: 0,
										bottom: 0,
										left: 0
									},
									ee = Q[H],
									te = Q[D],
									ne = se(0, M[V], X[V]),
									ie = x ? M[V] / 2 - G - ne - ee - z.mainAxis : K - ne - ee - z.mainAxis,
									oe = x ? -M[V] / 2 + G + ne + te + z.mainAxis : Z + ne + te + z.mainAxis,
									re = t.elements.arrow && C(t.elements.arrow),
									ae = re ? "y" === k ? re.clientTop || 0 : re.clientLeft || 0 : 0,
									ue = null != (R = null == A ? void 0 : A[k]) ? R : 0,
									ce = F + oe - ue,
									le = se(m ? d(N, F + ie - ue - ae) : N, F, m ? r(J, ce) : J);
								T[k] = le, B[k] = le - F
							}
							if (u) {
								var fe, pe = "x" === k ? S : O,
									he = "x" === k ? j : E,
									me = T[$],
									ge = "y" === $ ? "height" : "width",
									ve = me + y[pe],
									be = me - y[he],
									ye = -1 !== [S, O].indexOf(w),
									we = null != (fe = null == A ? void 0 : A[$]) ? fe : 0,
									_e = ye ? ve : me - M[ge] - I[ge] - we + z.altAxis,
									xe = ye ? me + M[ge] + I[ge] - we - z.altAxis : be,
									ke = m && ye ? function(e, t, n) {
										var i = se(e, t, n);
										return i > n ? n : i
									}(_e, me, xe) : se(m ? _e : ve, me, m ? xe : be);
								T[$] = ke, B[$] = ke - me
							}
							t.modifiersData[i] = B
						}
					},
					requiresIfExists: ["offset"]
				}, {
					name: "arrow",
					enabled: !0,
					phase: "main",
					fn: function(e) {
						var t, n = e.state,
							i = e.name,
							o = e.options,
							r = n.elements.arrow,
							d = n.modifiersData.popperOffsets,
							s = q(n.placement),
							a = W(s),
							u = [O, E].indexOf(s) >= 0 ? "height" : "width";
						if (r && d) {
							var c = function(e, t) {
									return oe("number" != typeof(e = "function" == typeof e ? e(Object.assign({}, t.rects, {
										placement: t.placement
									})) : e) ? e : re(e, M))
								}(o.padding, n),
								l = b(r),
								f = "y" === a ? S : O,
								p = "y" === a ? j : E,
								h = n.rects.reference[u] + n.rects.reference[a] - d[a] - n.rects.popper[u],
								m = d[a] - n.rects.reference[a],
								g = C(r),
								v = g ? "y" === a ? g.clientHeight || 0 : g.clientWidth || 0 : 0,
								y = h / 2 - m / 2,
								w = c[f],
								_ = v - l[u] - c[p],
								x = v / 2 - l[u] / 2 + y,
								k = se(w, x, _),
								$ = a;
							n.modifiersData[i] = ((t = {})[$] = k, t.centerOffset = k - x, t)
						}
					},
					effect: function(e) {
						var t = e.state,
							n = e.options.element,
							i = void 0 === n ? "[data-popper-arrow]" : n;
						null != i && ("string" != typeof i || (i = t.elements.popper.querySelector(i))) && te(t.elements.popper, i) && (t.elements.arrow = i)
					},
					requires: ["popperOffsets"],
					requiresIfExists: ["preventOverflow"]
				}, {
					name: "hide",
					enabled: !0,
					phase: "main",
					requiresIfExists: ["preventOverflow"],
					fn: function(e) {
						var t = e.state,
							n = e.name,
							i = t.rects.reference,
							o = t.rects.popper,
							r = t.modifiersData.preventOverflow,
							d = de(t, {
								elementContext: "reference"
							}),
							s = de(t, {
								altBoundary: !0
							}),
							a = ae(d, i),
							u = ae(s, o, r),
							c = ue(a),
							l = ue(u);
						t.modifiersData[n] = {
							referenceClippingOffsets: a,
							popperEscapeOffsets: u,
							isReferenceHidden: c,
							hasPopperEscaped: l
						}, t.attributes.popper = Object.assign({}, t.attributes.popper, {
							"data-popper-reference-hidden": c,
							"data-popper-escaped": l
						})
					}
				}]
			}),
			le = "tippy-content",
			fe = "tippy-backdrop",
			pe = "tippy-arrow",
			he = "tippy-svg-arrow",
			me = {
				passive: !0,
				capture: !0
			},
			ge = function() {
				return document.body
			};

		function ve(e, t, n) {
			if (Array.isArray(e)) {
				var i = e[t];
				return null == i ? Array.isArray(n) ? n[t] : n : i
			}
			return e
		}

		function be(e, t) {
			var n = {}.toString.call(e);
			return 0 === n.indexOf("[object") && n.indexOf(t + "]") > -1
		}

		function ye(e, t) {
			return "function" == typeof e ? e.apply(void 0, t) : e
		}

		function we(e, t) {
			return 0 === t ? e : function(i) {
				clearTimeout(n), n = setTimeout((function() {
					e(i)
				}), t)
			};
			var n
		}

		function _e(e) {
			return [].concat(e)
		}

		function xe(e, t) {
			-1 === e.indexOf(t) && e.push(t)
		}

		function ke(e) {
			return [].slice.call(e)
		}

		function Ce(e) {
			return Object.keys(e).reduce((function(t, n) {
				return void 0 !== e[n] && (t[n] = e[n]), t
			}), {})
		}

		function $e() {
			return document.createElement("div")
		}

		function Se(e) {
			return ["Element", "Fragment"].some((function(t) {
				return be(e, t)
			}))
		}

		function je(e, t) {
			e.forEach((function(e) {
				e && (e.style.transitionDuration = t + "ms")
			}))
		}

		function Ee(e, t) {
			e.forEach((function(e) {
				e && e.setAttribute("data-state", t)
			}))
		}

		function Oe(e, t, n) {
			var i = t + "EventListener";
			["transitionend", "webkitTransitionEnd"].forEach((function(t) {
				e[i](t, n)
			}))
		}

		function Te(e, t) {
			for (var n = t; n;) {
				var i;
				if (e.contains(n)) return !0;
				n = null == n.getRootNode || null == (i = n.getRootNode()) ? void 0 : i.host
			}
			return !1
		}
		var Me = {
				isTouch: !1
			},
			Pe = 0;

		function Ie() {
			Me.isTouch || (Me.isTouch = !0, window.performance && document.addEventListener("mousemove", Le))
		}

		function Le() {
			var e = performance.now();
			e - Pe < 20 && (Me.isTouch = !1, document.removeEventListener("mousemove", Le)), Pe = e
		}

		function ze() {
			var e, t = document.activeElement;
			if ((e = t) && e._tippy && e._tippy.reference === e) {
				var n = t._tippy;
				t.blur && !n.state.isVisible && t.blur()
			}
		}
		var Ae = !("undefined" == typeof window || "undefined" == typeof document || !window.msCrypto),
			Be = Object.assign({
				appendTo: ge,
				aria: {
					content: "auto",
					expanded: "auto"
				},
				delay: 0,
				duration: [300, 250],
				getReferenceClientRect: null,
				hideOnClick: !0,
				ignoreAttributes: !1,
				interactive: !1,
				interactiveBorder: 2,
				interactiveDebounce: 0,
				moveTransition: "",
				offset: [0, 10],
				onAfterUpdate: function() {},
				onBeforeUpdate: function() {},
				onCreate: function() {},
				onDestroy: function() {},
				onHidden: function() {},
				onHide: function() {},
				onMount: function() {},
				onShow: function() {},
				onShown: function() {},
				onTrigger: function() {},
				onUntrigger: function() {},
				onClickOutside: function() {},
				placement: "top",
				plugins: [],
				popperOptions: {},
				render: null,
				showOnCreate: !1,
				touch: !0,
				trigger: "mouseenter focus",
				triggerTarget: null
			}, {
				animateFill: !1,
				followCursor: !1,
				inlinePositioning: !1,
				sticky: !1
			}, {
				allowHTML: !1,
				animation: "fade",
				arrow: !0,
				content: "",
				inertia: !1,
				maxWidth: 350,
				role: "tooltip",
				theme: "",
				zIndex: 9999
			}),
			Re = Object.keys(Be);

		function He(e) {
			var t = (e.plugins || []).reduce((function(t, n) {
				var i, o = n.name,
					r = n.defaultValue;
				return o && (t[o] = void 0 !== e[o] ? e[o] : null != (i = Be[o]) ? i : r), t
			}), {});
			return Object.assign({}, e, t)
		}

		function De(e, t) {
			var n = Object.assign({}, t, {
				content: ye(t.content, [e])
			}, t.ignoreAttributes ? {} : function(e, t) {
				return (t ? Object.keys(He(Object.assign({}, Be, {
					plugins: t
				}))) : Re).reduce((function(t, n) {
					var i = (e.getAttribute("data-tippy-" + n) || "").trim();
					if (!i) return t;
					if ("content" === n) t[n] = i;
					else try {
						t[n] = JSON.parse(i)
					} catch (e) {
						t[n] = i
					}
					return t
				}), {})
			}(e, t.plugins));
			return n.aria = Object.assign({}, Be.aria, n.aria), n.aria = {
				expanded: "auto" === n.aria.expanded ? t.interactive : n.aria.expanded,
				content: "auto" === n.aria.content ? t.interactive ? null : "describedby" : n.aria.content
			}, n
		}
		var Ve = function() {
			return "innerHTML"
		};

		function Fe(e, t) {
			e[Ve()] = t
		}

		function Ne(e) {
			var t = $e();
			return !0 === e ? t.className = pe : (t.className = he, Se(e) ? t.appendChild(e) : Fe(t, e)), t
		}

		function qe(e, t) {
			Se(t.content) ? (Fe(e, ""), e.appendChild(t.content)) : "function" != typeof t.content && (t.allowHTML ? Fe(e, t.content) : e.textContent = t.content)
		}

		function Ue(e) {
			var t = e.firstElementChild,
				n = ke(t.children);
			return {
				box: t,
				content: n.find((function(e) {
					return e.classList.contains(le)
				})),
				arrow: n.find((function(e) {
					return e.classList.contains(pe) || e.classList.contains(he)
				})),
				backdrop: n.find((function(e) {
					return e.classList.contains(fe)
				}))
			}
		}

		function We(e) {
			var t = $e(),
				n = $e();
			n.className = "tippy-box", n.setAttribute("data-state", "hidden"), n.setAttribute("tabindex", "-1");
			var i = $e();

			function o(n, i) {
				var o = Ue(t),
					r = o.box,
					d = o.content,
					s = o.arrow;
				i.theme ? r.setAttribute("data-theme", i.theme) : r.removeAttribute("data-theme"), "string" == typeof i.animation ? r.setAttribute("data-animation", i.animation) : r.removeAttribute("data-animation"), i.inertia ? r.setAttribute("data-inertia", "") : r.removeAttribute("data-inertia"), r.style.maxWidth = "number" == typeof i.maxWidth ? i.maxWidth + "px" : i.maxWidth, i.role ? r.setAttribute("role", i.role) : r.removeAttribute("role"), n.content === i.content && n.allowHTML === i.allowHTML || qe(d, e.props), i.arrow ? s ? n.arrow !== i.arrow && (r.removeChild(s), r.appendChild(Ne(i.arrow))) : r.appendChild(Ne(i.arrow)) : s && r.removeChild(s)
			}
			return i.className = le, i.setAttribute("data-state", "hidden"), qe(i, e.props), t.appendChild(n), n.appendChild(i), o(e.props, e.props), {
				popper: t,
				onUpdate: o
			}
		}
		We.$$tippy = !0;
		var Je = 1,
			Ge = [],
			Ke = [];

		function Ze(e, t) {
			var n, i, o, r, d, s, a, u, c = De(e, Object.assign({}, Be, He(Ce(t)))),
				l = !1,
				f = !1,
				p = !1,
				h = !1,
				m = [],
				g = we(J, c.interactiveDebounce),
				v = Je++,
				b = (u = c.plugins).filter((function(e, t) {
					return u.indexOf(e) === t
				})),
				y = {
					id: v,
					reference: e,
					popper: $e(),
					popperInstance: null,
					props: c,
					state: {
						isEnabled: !0,
						isVisible: !1,
						isDestroyed: !1,
						isMounted: !1,
						isShown: !1
					},
					plugins: b,
					clearDelayTimeouts: function() {
						clearTimeout(n), clearTimeout(i), cancelAnimationFrame(o)
					},
					setProps: function(t) {
						if (!y.state.isDestroyed) {
							I("onBeforeUpdate", [y, t]), U();
							var n = y.props,
								i = De(e, Object.assign({}, n, Ce(t), {
									ignoreAttributes: !0
								}));
							y.props = i, q(), n.interactiveDebounce !== i.interactiveDebounce && (A(), g = we(J, i.interactiveDebounce)), n.triggerTarget && !i.triggerTarget ? _e(n.triggerTarget).forEach((function(e) {
								e.removeAttribute("aria-expanded")
							})) : i.triggerTarget && e.removeAttribute("aria-expanded"), z(), P(), x && x(n, i), y.popperInstance && (Y(), Q().forEach((function(e) {
								requestAnimationFrame(e._tippy.popperInstance.forceUpdate)
							}))), I("onAfterUpdate", [y, t])
						}
					},
					setContent: function(e) {
						y.setProps({
							content: e
						})
					},
					show: function() {
						var e = y.state.isVisible,
							t = y.state.isDestroyed,
							n = !y.state.isEnabled,
							i = Me.isTouch && !y.props.touch,
							o = ve(y.props.duration, 0, Be.duration);
						if (!(e || t || n || i || E().hasAttribute("disabled") || (I("onShow", [y], !1), !1 === y.props.onShow(y)))) {
							if (y.state.isVisible = !0, j() && (_.style.visibility = "visible"), P(), D(), y.state.isMounted || (_.style.transition = "none"), j()) {
								var r = T();
								je([r.box, r.content], 0)
							}
							var d, a, u;
							s = function() {
								var e;
								if (y.state.isVisible && !h) {
									if (h = !0, _.offsetHeight, _.style.transition = y.props.moveTransition, j() && y.props.animation) {
										var t = T(),
											n = t.box,
											i = t.content;
										je([n, i], o), Ee([n, i], "visible")
									}
									L(), z(), xe(Ke, y), null == (e = y.popperInstance) || e.forceUpdate(), I("onMount", [y]), y.props.animation && j() && function(e, t) {
										F(e, (function() {
											y.state.isShown = !0, I("onShown", [y])
										}))
									}(o)
								}
							}, a = y.props.appendTo, u = E(), (d = y.props.interactive && a === ge || "parent" === a ? u.parentNode : ye(a, [u])).contains(_) || d.appendChild(_), y.state.isMounted = !0, Y()
						}
					},
					hide: function() {
						var e = !y.state.isVisible,
							t = y.state.isDestroyed,
							n = !y.state.isEnabled,
							i = ve(y.props.duration, 1, Be.duration);
						if (!(e || t || n) && (I("onHide", [y], !1), !1 !== y.props.onHide(y))) {
							if (y.state.isVisible = !1, y.state.isShown = !1, h = !1, l = !1, j() && (_.style.visibility = "hidden"), A(), V(), P(!0), j()) {
								var o = T(),
									r = o.box,
									d = o.content;
								y.props.animation && (je([r, d], i), Ee([r, d], "hidden"))
							}
							L(), z(), y.props.animation ? j() && function(e, t) {
								F(e, (function() {
									!y.state.isVisible && _.parentNode && _.parentNode.contains(_) && t()
								}))
							}(i, y.unmount) : y.unmount()
						}
					},
					hideWithInteractivity: function(e) {
						O().addEventListener("mousemove", g), xe(Ge, g), g(e)
					},
					enable: function() {
						y.state.isEnabled = !0
					},
					disable: function() {
						y.hide(), y.state.isEnabled = !1
					},
					unmount: function() {
						y.state.isVisible && y.hide(), y.state.isMounted && (X(), Q().forEach((function(e) {
							e._tippy.unmount()
						})), _.parentNode && _.parentNode.removeChild(_), Ke = Ke.filter((function(e) {
							return e !== y
						})), y.state.isMounted = !1, I("onHidden", [y]))
					},
					destroy: function() {
						y.state.isDestroyed || (y.clearDelayTimeouts(), y.unmount(), U(), delete e._tippy, y.state.isDestroyed = !0, I("onDestroy", [y]))
					}
				};
			if (!c.render) return y;
			var w = c.render(y),
				_ = w.popper,
				x = w.onUpdate;
			_.setAttribute("data-tippy-root", ""), _.id = "tippy-" + y.id, y.popper = _, e._tippy = y, _._tippy = y;
			var k = b.map((function(e) {
					return e.fn(y)
				})),
				C = e.hasAttribute("aria-expanded");
			return q(), z(), P(), I("onCreate", [y]), c.showOnCreate && ee(), _.addEventListener("mouseenter", (function() {
				y.props.interactive && y.state.isVisible && y.clearDelayTimeouts()
			})), _.addEventListener("mouseleave", (function() {
				y.props.interactive && y.props.trigger.indexOf("mouseenter") >= 0 && O().addEventListener("mousemove", g)
			})), y;

			function $() {
				var e = y.props.touch;
				return Array.isArray(e) ? e : [e, 0]
			}

			function S() {
				return "hold" === $()[0]
			}

			function j() {
				var e;
				return !(null == (e = y.props.render) || !e.$$tippy)
			}

			function E() {
				return a || e
			}

			function O() {
				var e, t, n = E().parentNode;
				return n ? null != (t = _e(n)[0]) && null != (e = t.ownerDocument) && e.body ? t.ownerDocument : document : document
			}

			function T() {
				return Ue(_)
			}

			function M(e) {
				return y.state.isMounted && !y.state.isVisible || Me.isTouch || r && "focus" === r.type ? 0 : ve(y.props.delay, e ? 0 : 1, Be.delay)
			}

			function P(e) {
				void 0 === e && (e = !1), _.style.pointerEvents = y.props.interactive && !e ? "" : "none", _.style.zIndex = "" + y.props.zIndex
			}

			function I(e, t, n) {
				var i;
				void 0 === n && (n = !0), k.forEach((function(n) {
					n[e] && n[e].apply(n, t)
				})), n && (i = y.props)[e].apply(i, t)
			}

			function L() {
				var t = y.props.aria;
				if (t.content) {
					var n = "aria-" + t.content,
						i = _.id;
					_e(y.props.triggerTarget || e).forEach((function(e) {
						var t = e.getAttribute(n);
						if (y.state.isVisible) e.setAttribute(n, t ? t + " " + i : i);
						else {
							var o = t && t.replace(i, "").trim();
							o ? e.setAttribute(n, o) : e.removeAttribute(n)
						}
					}))
				}
			}

			function z() {
				!C && y.props.aria.expanded && _e(y.props.triggerTarget || e).forEach((function(e) {
					y.props.interactive ? e.setAttribute("aria-expanded", y.state.isVisible && e === E() ? "true" : "false") : e.removeAttribute("aria-expanded")
				}))
			}

			function A() {
				O().removeEventListener("mousemove", g), Ge = Ge.filter((function(e) {
					return e !== g
				}))
			}

			function B(t) {
				if (!Me.isTouch || !p && "mousedown" !== t.type) {
					var n = t.composedPath && t.composedPath()[0] || t.target;
					if (!y.props.interactive || !Te(_, n)) {
						if (_e(y.props.triggerTarget || e).some((function(e) {
								return Te(e, n)
							}))) {
							if (Me.isTouch) return;
							if (y.state.isVisible && y.props.trigger.indexOf("click") >= 0) return
						} else I("onClickOutside", [y, t]);
						!0 === y.props.hideOnClick && (y.clearDelayTimeouts(), y.hide(), f = !0, setTimeout((function() {
							f = !1
						})), y.state.isMounted || V())
					}
				}
			}

			function R() {
				p = !0
			}

			function H() {
				p = !1
			}

			function D() {
				var e = O();
				e.addEventListener("mousedown", B, !0), e.addEventListener("touchend", B, me), e.addEventListener("touchstart", H, me), e.addEventListener("touchmove", R, me)
			}

			function V() {
				var e = O();
				e.removeEventListener("mousedown", B, !0), e.removeEventListener("touchend", B, me), e.removeEventListener("touchstart", H, me), e.removeEventListener("touchmove", R, me)
			}

			function F(e, t) {
				var n = T().box;

				function i(e) {
					e.target === n && (Oe(n, "remove", i), t())
				}
				if (0 === e) return t();
				Oe(n, "remove", d), Oe(n, "add", i), d = i
			}

			function N(t, n, i) {
				void 0 === i && (i = !1), _e(y.props.triggerTarget || e).forEach((function(e) {
					e.addEventListener(t, n, i), m.push({
						node: e,
						eventType: t,
						handler: n,
						options: i
					})
				}))
			}

			function q() {
				var e;
				S() && (N("touchstart", W, {
					passive: !0
				}), N("touchend", G, {
					passive: !0
				})), (e = y.props.trigger, e.split(/\s+/).filter(Boolean)).forEach((function(e) {
					if ("manual" !== e) switch (N(e, W), e) {
						case "mouseenter":
							N("mouseleave", G);
							break;
						case "focus":
							N(Ae ? "focusout" : "blur", K);
							break;
						case "focusin":
							N("focusout", K)
					}
				}))
			}

			function U() {
				m.forEach((function(e) {
					var t = e.node,
						n = e.eventType,
						i = e.handler,
						o = e.options;
					t.removeEventListener(n, i, o)
				})), m = []
			}

			function W(e) {
				var t, n = !1;
				if (y.state.isEnabled && !Z(e) && !f) {
					var i = "focus" === (null == (t = r) ? void 0 : t.type);
					r = e, a = e.currentTarget, z(), !y.state.isVisible && be(e, "MouseEvent") && Ge.forEach((function(t) {
						return t(e)
					})), "click" === e.type && (y.props.trigger.indexOf("mouseenter") < 0 || l) && !1 !== y.props.hideOnClick && y.state.isVisible ? n = !0 : ee(e), "click" === e.type && (l = !n), n && !i && te(e)
				}
			}

			function J(e) {
				var t = e.target,
					n = E().contains(t) || _.contains(t);
				if ("mousemove" !== e.type || !n) {
					var i = Q().concat(_).map((function(e) {
						var t, n = null == (t = e._tippy.popperInstance) ? void 0 : t.state;
						return n ? {
							popperRect: e.getBoundingClientRect(),
							popperState: n,
							props: c
						} : null
					})).filter(Boolean);
					(function(e, t) {
						var n = t.clientX,
							i = t.clientY;
						return e.every((function(e) {
							var t = e.popperRect,
								o = e.popperState,
								r = e.props.interactiveBorder,
								d = o.placement.split("-")[0],
								s = o.modifiersData.offset;
							if (!s) return !0;
							var a = "bottom" === d ? s.top.y : 0,
								u = "top" === d ? s.bottom.y : 0,
								c = "right" === d ? s.left.x : 0,
								l = "left" === d ? s.right.x : 0,
								f = t.top - i + a > r,
								p = i - t.bottom - u > r,
								h = t.left - n + c > r,
								m = n - t.right - l > r;
							return f || p || h || m
						}))
					})(i, e) && (A(), te(e))
				}
			}

			function G(e) {
				Z(e) || y.props.trigger.indexOf("click") >= 0 && l || (y.props.interactive ? y.hideWithInteractivity(e) : te(e))
			}

			function K(e) {
				y.props.trigger.indexOf("focusin") < 0 && e.target !== E() || y.props.interactive && e.relatedTarget && _.contains(e.relatedTarget) || te(e)
			}

			function Z(e) {
				return !!Me.isTouch && S() !== e.type.indexOf("touch") >= 0
			}

			function Y() {
				X();
				var t = y.props,
					n = t.popperOptions,
					i = t.placement,
					o = t.offset,
					r = t.getReferenceClientRect,
					d = t.moveTransition,
					a = j() ? Ue(_).arrow : null,
					u = r ? {
						getBoundingClientRect: r,
						contextElement: r.contextElement || E()
					} : e,
					c = [{
						name: "offset",
						options: {
							offset: o
						}
					}, {
						name: "preventOverflow",
						options: {
							padding: {
								top: 2,
								bottom: 2,
								left: 5,
								right: 5
							}
						}
					}, {
						name: "flip",
						options: {
							padding: 5
						}
					}, {
						name: "computeStyles",
						options: {
							adaptive: !d
						}
					}, {
						name: "$$tippy",
						enabled: !0,
						phase: "beforeWrite",
						requires: ["computeStyles"],
						fn: function(e) {
							var t = e.state;
							if (j()) {
								var n = T().box;
								["placement", "reference-hidden", "escaped"].forEach((function(e) {
									"placement" === e ? n.setAttribute("data-placement", t.placement) : t.attributes.popper["data-popper-" + e] ? n.setAttribute("data-" + e, "") : n.removeAttribute("data-" + e)
								})), t.attributes.popper = {}
							}
						}
					}];
				j() && a && c.push({
					name: "arrow",
					options: {
						element: a,
						padding: 3
					}
				}), c.push.apply(c, (null == n ? void 0 : n.modifiers) || []), y.popperInstance = ce(u, _, Object.assign({}, n, {
					placement: i,
					onFirstUpdate: s,
					modifiers: c
				}))
			}

			function X() {
				y.popperInstance && (y.popperInstance.destroy(), y.popperInstance = null)
			}

			function Q() {
				return ke(_.querySelectorAll("[data-tippy-root]"))
			}

			function ee(e) {
				y.clearDelayTimeouts(), e && I("onTrigger", [y, e]), D();
				var t = M(!0),
					i = $(),
					o = i[0],
					r = i[1];
				Me.isTouch && "hold" === o && r && (t = r), t ? n = setTimeout((function() {
					y.show()
				}), t) : y.show()
			}

			function te(e) {
				if (y.clearDelayTimeouts(), I("onUntrigger", [y, e]), y.state.isVisible) {
					if (!(y.props.trigger.indexOf("mouseenter") >= 0 && y.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(e.type) >= 0 && l)) {
						var t = M(!1);
						t ? i = setTimeout((function() {
							y.state.isVisible && y.hide()
						}), t) : o = requestAnimationFrame((function() {
							y.hide()
						}))
					}
				} else V()
			}
		}

		function Ye(e, t) {
			void 0 === t && (t = {});
			var n = Be.plugins.concat(t.plugins || []);
			document.addEventListener("touchstart", Ie, me), window.addEventListener("blur", ze);
			var i, o = Object.assign({}, t, {
					plugins: n
				}),
				r = (i = e, Se(i) ? [i] : function(e) {
					return be(e, "NodeList")
				}(i) ? ke(i) : Array.isArray(i) ? i : ke(document.querySelectorAll(i))).reduce((function(e, t) {
					var n = t && Ze(t, o);
					return n && e.push(n), e
				}), []);
			return Se(e) ? r[0] : r
		}
		Ye.defaultProps = Be, Ye.setDefaultProps = function(e) {
			Object.keys(e).forEach((function(t) {
				Be[t] = e[t]
			}))
		}, Ye.currentInput = Me, Object.assign({}, Z, {
			effect: function(e) {
				var t = e.state,
					n = {
						popper: {
							position: t.options.strategy,
							left: "0",
							top: "0",
							margin: "0"
						},
						arrow: {
							position: "absolute"
						},
						reference: {}
					};
				Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow)
			}
		});
		var Xe = {
			mouseover: "mouseenter",
			focusin: "focus",
			click: "click"
		};

		function Qe(e) {
			const t = JSON.parse(localStorage.getItem("quick_links")) || [],
				n = $(e.target).closest(".quick-links"),
				i = n.find("a.wf-module-item img").attr("src"),
				o = n.find("a.wf-module-item").text(),
				r = n.find("a.wf-module-item").attr("href"),
				d = t.findIndex((e => e.image === i && e.text === o && e.href === r)); - 1 !== d && (n.remove(), t.splice(d, 1), localStorage.setItem("quick_links", JSON.stringify(t)))
		}
		Ye.setDefaultProps({
				render: We
			}), n(729), n(990), n(83), n(704), $(".header-nav-item.mod-stats").next().after('\n<div class="header-nav-item dropdown mod-vlr" style="align-items: center;" tabindex="0">\n\t<i class="fa fa-chevron-right" aria-hidden="true"></i>\n\t<div class="dropdown-content wf-card">\n\t\t<a class="wf-module-item" href="/vct-2023"><img src="https://i.imgur.com/2dqrmN2.png" alt="VCT 2023">VCT 2023</a>\n\t\t<a class="wf-module-item" href="/vct-2022"><img src="https://i.imgur.com/wiQInjN.png" alt="VCT 2022">VCT 2022</a>\n\t\t<a class="wf-module-item" href="/vct-2021"><img src="https://i.imgur.com/bgkt9iS.png" alt="VCT 2021">VCT 2021</a>\n\t\t<a class="wf-module-item" href="/transfers"><img src="https://i.imgur.com/O6aeTiv.png" alt="Transfers">Transfers</a>\n\t</div>\n</div>\n<div class="header-div"></div>'), $(".header-nav-item.mod-vlr-spacing").css("width", "107px"),
			function() {
				const e = JSON.parse(localStorage.getItem("quick_links")) || [],
					t = $(".dropdown-content");
				e.forEach((e => {
					const {
						image: n,
						text: i,
						href: o
					} = e, r = $(`<a class="wf-module-item" href="${o}"><img src="${n}" />${i}</a>`);
					t.append(r)
				}))
			}(), $(".header-switch, .mod-dropdown").attr("tabindex", "0"), $(".header-switch, .mod-dropdown").on("keydown", (function(e) {
				13 === e.which && $(this).trigger("click")
			}));
		const et = {
			items: {
				src: '\n\t\t<div class="quick-links-popup wf-card">\n\t\t\t<form id="quick-links">\n\t\t\t\t<div>\n\t\t\t\t\t<label class="wf-card"><i class="fa fa-picture-o"></i></label>\n\t\t\t\t\t<input placeholder="IMAGE (will use default if left empty)" type="text" />\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="wf-card"><i class="fa fa-font" style="color: #da626c;"></i></label>\n\t\t\t\t\t<input placeholder="TEXT" type="text" required />\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label class="wf-card"><i class="fa fa-link" style="color: #da626c;"></i></label>\n\t\t\t\t\t<input placeholder="LINK" type="text" required />\n\t\t\t\t</div>\n\t\t\t\t<button class="btn mod-action">Save</button>\n\t\t\t</form>\n\t\t</div>',
				type: "inline"
			},
			callbacks: {
				open: function() {
					$("#quick-links").submit((function(e) {
						e.preventDefault();
						var t = $("#quick-links input").eq(0).val(),
							n = $("#quick-links input").eq(1).val(),
							i = $("#quick-links input").eq(2).val();
						"" === t && (t = "https://www.vlr.gg/img/vlr/favicon.png");
						const o = $(`<a class="wf-module-item" href="${i}"> <img src="${t}" /> ${n}</a>`),
							r = $(`\n\t\t\t\t<div class="quick-links" style="overflow-wrap: anywhere;">\n\t\t\t\t\t<a class="wf-module-item" href="${i}"><img src="${t}">${n}</a>\n\t\t\t\t\t<div class="wf-module-item">EDIT<i class="fa fa-pencil" aria-hidden="true"></i></div>\n\t\t\t\t\t<div class="wf-module-item">REMOVE<i class="fa fa-ban" aria-hidden="true"></i></div>\n\t\t\t\t</div>`);
						$(".dropdown-content").append(o), $("#sortable-container .quick-links:last").before(r);
						var d = JSON.parse(localStorage.getItem("quick_links")) || [];
						d.push({
							image: t,
							text: n,
							href: i
						}), localStorage.setItem("quick_links", JSON.stringify(d)), $.magnificPopup.close()
					}))
				}
			}
		};
		if (window.location.href.startsWith("https://www.vlr.gg/settings")) {
			const e = '\n\t<div class="wf-card mod-header mod-full">\n\t\t<div class="wf-nav">\n\t\t\t<a class="wf-nav-item mod-first" href="https://www.vlr.gg/settings">\n\t\t\t\t<div class="wf-nav-item-title">VLR</div>\n\t\t\t</a>\n\t\t\t<a class="wf-nav-item" href="https://www.vlr.gg/settings?statsvlr">\n\t\t\t\t<div class="wf-nav-item-title">StatsVLR</div>\n\t\t\t</a>\n\t\t\t<a class="wf-nav-item" href="https://www.vlr.gg/settings?blocked-users">\n\t\t\t\t<div class="wf-nav-item-title">Blocked Users</div>\n\t\t\t</a>\n\t\t</div>\n\t</div>';
			$(".col-container").before(e)
		}
		$(document).ready((function() {
			const e = window.location.href;
			$(".wf-nav-item").each((function() {
				const t = $(this).attr("href");
				e === t && $(this).addClass("mod-active")
			}))
		})), "?statsvlr" === window.location.search && ($(".wf-card.mod-form").not("form .wf-card.mod-form").hide(), $("form:eq(1)").html('\n<div class="wf-card mod-form mod-dark">\n\t<div class="form-section" style="margin-top: 0;">Display</div>\n\t<div class="form-label">Threads</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="hide_flags">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Flags</span>\n\t</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="hide_stars">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Stars</span>\n\t</div>\n\t<div class="form-label" style="margin-top: 15px;">General</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="esports_mode">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Esports Mode</span>\n\t</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="sticky_header">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Sticky Header</span>\n\t</div>\n</div>\n<div class="wf-card mod-form mod-dark">\n\t<div class="form-section" style="margin-top: 0;">Discussion</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="hide_match_comments">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Match Comments</span>\n\t</div>\n</div>\n<div class="wf-card mod-form mod-dark">\n\t<div class="form-section" style="margin-top: 0;">Sidebar</div>\n\t<div class="form-hint">select which sidebar items to hide</div>\n\t<div class="form-label" style="margin-top: 15px;">Valorant</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="hide_live_streams">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Live Streams (unofficial ones only)</span>\n\t</div>\n\t<div class="form-label" style="margin-top: 15px;">General</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="hide_stickied_threads">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Stickied Threads</span>\n\t</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="hide_recent_discussions">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Hide Recent Discussions</span>\n\t</div>\n</div>\n<div id="sortable-container" class="wf-card mod-form mod-dark">\n\t<div class="form-section" style="margin-top: 0;">Quick Links</div>\n\t<div class="quick-links">\n\t\t<a class="wf-module-item" href="/vct-2023"><img src="https://i.imgur.com/2dqrmN2.png" alt="VCT 2023">VCT 2023</a>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">EDIT<i class="fa fa-pencil" aria-hidden="true"></i></div>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">REMOVE<i class="fa fa-ban" aria-hidden="true"></i></div>\n\t</div>\n\t<div class="quick-links">\n\t\t<a class="wf-module-item" href="/vct-2022"><img src="https://i.imgur.com/wiQInjN.png" alt="VCT 2022">VCT 2022</a>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">EDIT<i class="fa fa-pencil" aria-hidden="true"></i></div>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">REMOVE<i class="fa fa-ban" aria-hidden="true"></i></div>\n\t</div>\n\t<div class="quick-links">\n\t\t<a class="wf-module-item" href="/vct-2021"><img src="https://i.imgur.com/bgkt9iS.png" alt="VCT 2021">VCT 2021</a>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">EDIT<i class="fa fa-pencil" aria-hidden="true"></i></div>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">REMOVE<i class="fa fa-ban" aria-hidden="true"></i></div>\n\t</div>\n\t<div class="quick-links">\n\t\t<a class="wf-module-item" href="/transfers"><img src="https://i.imgur.com/O6aeTiv.png" alt="Transfers">Transfers</a>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">EDIT<i class="fa fa-pencil" aria-hidden="true"></i></div>\n\t\t<div class="wf-module-item" style="cursor: not-allowed;">REMOVE<i class="fa fa-ban" aria-hidden="true"></i></div>\n\t</div>\n\t<div class="quick-links">\n\t\t<div class="wf-module-item"><i class="fa fa-plus" aria-hidden="true"></i></div>\n\t</div>\n</div>\n<div class="wf-card mod-form mod-dark">\n\t<div class="form-section" style="margin-top: 0;">Misc</div>\n\t<div style="margin-bottom: 5px;">\n\t\t<input type="checkbox" id="imgur_proxy">\n\t\t<span style="font-size: 11px; vertical-align: -1px; margin-left: 1px;">Imgur Proxy (enable this if imgur is blocked for you)</span>\n\t</div>\n</div>'), $(".quick-links div:has(.fa-plus)").magnificPopup(et), function() {
			const e = JSON.parse(localStorage.getItem("quick_links")) || [],
				t = $("#sortable-container .quick-links:last");
			e.forEach((e => {
				const {
					image: n,
					text: i,
					href: o
				} = e, r = $(`\n\t\t<div class="quick-links" style="overflow-wrap: anywhere;">\n\t\t\t<a class="wf-module-item" href="${o}"><img src="${n}">${i}</a>\n\t\t\t<div class="wf-module-item">EDIT<i class="fa fa-pencil" aria-hidden="true"></i></div>\n\t\t\t<div class="wf-module-item">REMOVE<i class="fa fa-ban" aria-hidden="true"></i></div>\n\t\t</div>`);
				$(document).on("click", ".wf-module-item:has(.fa-ban)", Qe), t.before(r)
			}))
		}()), "?blocked-users" === window.location.search && ($(".wf-card.mod-form").not("form .wf-card.mod-form").hide(), $("form:eq(1)").html('\n<div class="wf-card mod-form mod-dark">\n\t<div class="form-section" style="margin: 0;">Block Users</div>\n\t<div style="display: flex; justify-content: space-between; padding: 15px 20px 15px 0; flex-wrap: wrap; gap: 5px;">\n\t\t<input type="text" id="user-to-block" placeholder="USER TO BLOCK" style="margin: 0px">\n\t\t<button id="block-btn" class="btn mod-action" style="background-color: #d04e59; width: 50px;">Block</button>\n\t</div>\n\t<ul id="blocked_users"></ul>\n</div>')), n(246), n(335), n(104);
		const tt = function() {
			var e = {
					base: "https://twemoji.maxcdn.com/v/14.0.2/",
					ext: ".png",
					size: "72x72",
					className: "emoji",
					convert: {
						fromCodePoint: function(e) {
							var t = "string" == typeof e ? parseInt(e, 16) : e;
							return t < 65536 ? s(t) : s(55296 + ((t -= 65536) >> 10), 56320 + (1023 & t))
						},
						toCodePoint: v
					},
					onerror: function() {
						this.parentNode && this.parentNode.replaceChild(a(this.alt, !1), this)
					},
					parse: function(t, n) {
						return n && "function" != typeof n || (n = {
							callback: n
						}), ("string" == typeof t ? p : f)(t, {
							callback: n.callback || u,
							attributes: "function" == typeof n.attributes ? n.attributes : m,
							base: "string" == typeof n.base ? n.base : e.base,
							ext: n.ext || e.ext,
							size: n.folder || (i = n.size || e.size, "number" == typeof i ? i + "x" + i : i),
							className: n.className || e.className,
							onerror: n.onerror || e.onerror
						});
						var i
					},
					replace: g,
					test: function(e) {
						n.lastIndex = 0;
						var t = n.test(e);
						return n.lastIndex = 0, t
					}
				},
				t = {
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					"'": "&#39;",
					'"': "&quot;"
				},
				n = /(?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc8f\udc91]|\ud83e\udd1d)|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd\udec3-\udec5\udef0-\udef6]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udedd-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7c\ude80-\ude86\ude90-\udeac\udeb0-\udeba\udec0-\udec2\uded0-\uded9\udee0-\udee7]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,
				i = /\uFE0F/g,
				o = String.fromCharCode(8205),
				r = /[&<>'"]/g,
				d = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,
				s = String.fromCharCode;
			return e;

			function a(e, t) {
				return document.createTextNode(t ? e.replace(i, "") : e)
			}

			function u(e, t) {
				return "".concat(t.base, t.size, "/", e, t.ext)
			}

			function c(e, t) {
				for (var n, i, o = e.childNodes, r = o.length; r--;) 3 === (i = (n = o[r]).nodeType) ? t.push(n) : 1 !== i || "ownerSVGElement" in n || d.test(n.nodeName.toLowerCase()) || c(n, t);
				return t
			}

			function l(e) {
				return v(e.indexOf(o) < 0 ? e.replace(i, "") : e)
			}

			function f(e, t) {
				for (var i, o, r, d, s, u, f, p, h, m, g, v, b, y = c(e, []), w = y.length; w--;) {
					for (r = !1, d = document.createDocumentFragment(), u = (s = y[w]).nodeValue, p = 0; f = n.exec(u);) {
						if ((h = f.index) !== p && d.appendChild(a(u.slice(p, h), !0)), v = l(g = f[0]), p = h + g.length, b = t.callback(v, t), v && b) {
							for (o in (m = new Image).onerror = t.onerror, m.setAttribute("draggable", "false"), i = t.attributes(g, v)) i.hasOwnProperty(o) && 0 !== o.indexOf("on") && !m.hasAttribute(o) && m.setAttribute(o, i[o]);
							m.className = t.className, m.alt = g, m.src = b, r = !0, d.appendChild(m)
						}
						m || d.appendChild(a(g, !1)), m = null
					}
					r && (p < u.length && d.appendChild(a(u.slice(p), !0)), s.parentNode.replaceChild(d, s))
				}
				return e
			}

			function p(e, t) {
				return g(e, (function(e) {
					var n, i, o = e,
						d = l(e),
						s = t.callback(d, t);
					if (d && s) {
						for (i in o = "<img ".concat('class="', t.className, '" ', 'draggable="false" ', 'alt="', e, '"', ' src="', s, '"'), n = t.attributes(e, d)) n.hasOwnProperty(i) && 0 !== i.indexOf("on") && -1 === o.indexOf(" " + i + "=") && (o = o.concat(" ", i, '="', n[i].replace(r, h), '"'));
						o = o.concat("/>")
					}
					return o
				}))
			}

			function h(e) {
				return t[e]
			}

			function m() {
				return null
			}

			function g(e, t) {
				return String(e).replace(n, t)
			}

			function v(e, t) {
				for (var n = [], i = 0, o = 0, r = 0; r < e.length;) i = e.charCodeAt(r++), o ? (n.push((65536 + (o - 55296 << 10) + (i - 56320)).toString(16)), o = 0) : 55296 <= i && i <= 56319 ? o = i : n.push(i.toString(16));
				return n.join(t || "-")
			}
		}();

		function nt(e) {
			return e && e.__esModule ? e.default : e
		}

		function it(e, t, n) {
			return t in e ? Object.defineProperty(e, t, {
				value: n,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = n, e
		}
		var ot, rt, dt, st, at, ut, ct = {},
			lt = [],
			ft = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

		function pt(e, t) {
			for (var n in t) e[n] = t[n];
			return e
		}

		function ht(e) {
			var t = e.parentNode;
			t && t.removeChild(e)
		}

		function mt(e, t, n) {
			var i, o, r, d = {};
			for (r in t) "key" == r ? i = t[r] : "ref" == r ? o = t[r] : d[r] = t[r];
			if (arguments.length > 2 && (d.children = arguments.length > 3 ? ot.call(arguments, 2) : n), "function" == typeof e && null != e.defaultProps)
				for (r in e.defaultProps) void 0 === d[r] && (d[r] = e.defaultProps[r]);
			return gt(e, d, i, o, null)
		}

		function gt(e, t, n, i, o) {
			var r = {
				type: e,
				props: t,
				key: n,
				ref: i,
				__k: null,
				__: null,
				__b: 0,
				__e: null,
				__d: void 0,
				__c: null,
				__h: null,
				constructor: void 0,
				__v: null == o ? ++dt : o
			};
			return null == o && null != rt.vnode && rt.vnode(r), r
		}

		function vt(e) {
			return e.children
		}

		function bt(e, t) {
			this.props = e, this.context = t
		}

		function yt(e, t) {
			if (null == t) return e.__ ? yt(e.__, e.__.__k.indexOf(e) + 1) : null;
			for (var n; t < e.__k.length; t++)
				if (null != (n = e.__k[t]) && null != n.__e) return n.__e;
			return "function" == typeof e.type ? yt(e) : null
		}

		function wt(e) {
			var t, n;
			if (null != (e = e.__) && null != e.__c) {
				for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
					if (null != (n = e.__k[t]) && null != n.__e) {
						e.__e = e.__c.base = n.__e;
						break
					} return wt(e)
			}
		}

		function _t(e) {
			(!e.__d && (e.__d = !0) && st.push(e) && !xt.__r++ || ut !== rt.debounceRendering) && ((ut = rt.debounceRendering) || at)(xt)
		}

		function xt() {
			for (var e; xt.__r = st.length;) e = st.sort((function(e, t) {
				return e.__v.__b - t.__v.__b
			})), st = [], e.some((function(e) {
				var t, n, i, o, r, d;
				e.__d && (r = (o = (t = e).__v).__e, (d = t.__P) && (n = [], (i = pt({}, o)).__v = o.__v + 1, Mt(d, o, i, t.__n, void 0 !== d.ownerSVGElement, null != o.__h ? [r] : null, n, null == r ? yt(o) : r, o.__h), Pt(n, o), o.__e != r && wt(o)))
			}))
		}

		function kt(e, t, n, i, o, r, d, s, a, u) {
			var c, l, f, p, h, m, g, v = i && i.__k || lt,
				b = v.length;
			for (n.__k = [], c = 0; c < t.length; c++)
				if (null != (p = n.__k[c] = null == (p = t[c]) || "boolean" == typeof p ? null : "string" == typeof p || "number" == typeof p || "bigint" == typeof p ? gt(null, p, null, null, p) : Array.isArray(p) ? gt(vt, {
						children: p
					}, null, null, null) : p.__b > 0 ? gt(p.type, p.props, p.key, null, p.__v) : p)) {
					if (p.__ = n, p.__b = n.__b + 1, null === (f = v[c]) || f && p.key == f.key && p.type === f.type) v[c] = void 0;
					else
						for (l = 0; l < b; l++) {
							if ((f = v[l]) && p.key == f.key && p.type === f.type) {
								v[l] = void 0;
								break
							}
							f = null
						}
					Mt(e, p, f = f || ct, o, r, d, s, a, u), h = p.__e, (l = p.ref) && f.ref != l && (g || (g = []), f.ref && g.push(f.ref, null, p), g.push(l, p.__c || h, p)), null != h ? (null == m && (m = h), "function" == typeof p.type && p.__k === f.__k ? p.__d = a = Ct(p, a, e) : a = St(e, p, f, v, h, a), "function" == typeof n.type && (n.__d = a)) : a && f.__e == a && a.parentNode != e && (a = yt(f))
				} for (n.__e = m, c = b; c--;) null != v[c] && ("function" == typeof n.type && null != v[c].__e && v[c].__e == n.__d && (n.__d = yt(i, c + 1)), Lt(v[c], v[c]));
			if (g)
				for (c = 0; c < g.length; c++) It(g[c], g[++c], g[++c])
		}

		function Ct(e, t, n) {
			for (var i, o = e.__k, r = 0; o && r < o.length; r++)(i = o[r]) && (i.__ = e, t = "function" == typeof i.type ? Ct(i, t, n) : St(n, i, i, o, i.__e, t));
			return t
		}

		function $t(e, t) {
			return t = t || [], null == e || "boolean" == typeof e || (Array.isArray(e) ? e.some((function(e) {
				$t(e, t)
			})) : t.push(e)), t
		}

		function St(e, t, n, i, o, r) {
			var d, s, a;
			if (void 0 !== t.__d) d = t.__d, t.__d = void 0;
			else if (null == n || o != r || null == o.parentNode) e: if (null == r || r.parentNode !== e) e.appendChild(o), d = null;
				else {
					for (s = r, a = 0;
						(s = s.nextSibling) && a < i.length; a += 2)
						if (s == o) break e;
					e.insertBefore(o, r), d = r
				} return void 0 !== d ? d : o.nextSibling
		}

		function jt(e, t, n) {
			"-" === t[0] ? e.setProperty(t, n) : e[t] = null == n ? "" : "number" != typeof n || ft.test(t) ? n : n + "px"
		}

		function Et(e, t, n, i, o) {
			var r;
			e: if ("style" === t)
				if ("string" == typeof n) e.style.cssText = n;
				else {
					if ("string" == typeof i && (e.style.cssText = i = ""), i)
						for (t in i) n && t in n || jt(e.style, t, "");
					if (n)
						for (t in n) i && n[t] === i[t] || jt(e.style, t, n[t])
				}
			else if ("o" === t[0] && "n" === t[1]) r = t !== (t = t.replace(/Capture$/, "")), t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + r] = n, n ? i || e.addEventListener(t, r ? Tt : Ot, r) : e.removeEventListener(t, r ? Tt : Ot, r);
			else if ("dangerouslySetInnerHTML" !== t) {
				if (o) t = t.replace(/xlink[H:h]/, "h").replace(/sName$/, "s");
				else if ("href" !== t && "list" !== t && "form" !== t && "tabIndex" !== t && "download" !== t && t in e) try {
					e[t] = null == n ? "" : n;
					break e
				} catch (e) {}
				"function" == typeof n || (null != n && (!1 !== n || "a" === t[0] && "r" === t[1]) ? e.setAttribute(t, n) : e.removeAttribute(t))
			}
		}

		function Ot(e) {
			this.l[e.type + !1](rt.event ? rt.event(e) : e)
		}

		function Tt(e) {
			this.l[e.type + !0](rt.event ? rt.event(e) : e)
		}

		function Mt(e, t, n, i, o, r, d, s, a) {
			var u, c, l, f, p, h, m, g, v, b, y, w = t.type;
			if (void 0 !== t.constructor) return null;
			null != n.__h && (a = n.__h, s = t.__e = n.__e, t.__h = null, r = [s]), (u = rt.__b) && u(t);
			try {
				e: if ("function" == typeof w) {
					if (g = t.props, v = (u = w.contextType) && i[u.__c], b = u ? v ? v.props.value : u.__ : i, n.__c ? m = (c = t.__c = n.__c).__ = c.__E : ("prototype" in w && w.prototype.render ? t.__c = c = new w(g, b) : (t.__c = c = new bt(g, b), c.constructor = w, c.render = zt), v && v.sub(c), c.props = g, c.state || (c.state = {}), c.context = b, c.__n = i, l = c.__d = !0, c.__h = []), null == c.__s && (c.__s = c.state), null != w.getDerivedStateFromProps && (c.__s == c.state && (c.__s = pt({}, c.__s)), pt(c.__s, w.getDerivedStateFromProps(g, c.__s))), f = c.props, p = c.state, l) null == w.getDerivedStateFromProps && null != c.componentWillMount && c.componentWillMount(), null != c.componentDidMount && c.__h.push(c.componentDidMount);
					else {
						if (null == w.getDerivedStateFromProps && g !== f && null != c.componentWillReceiveProps && c.componentWillReceiveProps(g, b), !c.__e && null != c.shouldComponentUpdate && !1 === c.shouldComponentUpdate(g, c.__s, b) || t.__v === n.__v) {
							c.props = g, c.state = c.__s, t.__v !== n.__v && (c.__d = !1), c.__v = t, t.__e = n.__e, t.__k = n.__k, t.__k.forEach((function(e) {
								e && (e.__ = t)
							})), c.__h.length && d.push(c);
							break e
						}
						null != c.componentWillUpdate && c.componentWillUpdate(g, c.__s, b), null != c.componentDidUpdate && c.__h.push((function() {
							c.componentDidUpdate(f, p, h)
						}))
					}
					c.context = b, c.props = g, c.state = c.__s, (u = rt.__r) && u(t), c.__d = !1, c.__v = t, c.__P = e, u = c.render(c.props, c.state, c.context), c.state = c.__s, null != c.getChildContext && (i = pt(pt({}, i), c.getChildContext())), l || null == c.getSnapshotBeforeUpdate || (h = c.getSnapshotBeforeUpdate(f, p)), y = null != u && u.type === vt && null == u.key ? u.props.children : u, kt(e, Array.isArray(y) ? y : [y], t, n, i, o, r, d, s, a), c.base = t.__e, t.__h = null, c.__h.length && d.push(c), m && (c.__E = c.__ = null), c.__e = !1
				} else null == r && t.__v === n.__v ? (t.__k = n.__k, t.__e = n.__e) : t.__e = function(e, t, n, i, o, r, d, s) {
					var a, u, c, l = n.props,
						f = t.props,
						p = t.type,
						h = 0;
					if ("svg" === p && (o = !0), null != r)
						for (; h < r.length; h++)
							if ((a = r[h]) && "setAttribute" in a == !!p && (p ? a.localName === p : 3 === a.nodeType)) {
								e = a, r[h] = null;
								break
							} if (null == e) {
						if (null === p) return document.createTextNode(f);
						e = o ? document.createElementNS("http://www.w3.org/2000/svg", p) : document.createElement(p, f.is && f), r = null, s = !1
					}
					if (null === p) l === f || s && e.data === f || (e.data = f);
					else {
						if (r = r && ot.call(e.childNodes), u = (l = n.props || ct).dangerouslySetInnerHTML, c = f.dangerouslySetInnerHTML, !s) {
							if (null != r)
								for (l = {}, h = 0; h < e.attributes.length; h++) l[e.attributes[h].name] = e.attributes[h].value;
							(c || u) && (c && (u && c.__html == u.__html || c.__html === e.innerHTML) || (e.innerHTML = c && c.__html || ""))
						}
						if (function(e, t, n, i, o) {
								var r;
								for (r in n) "children" === r || "key" === r || r in t || Et(e, r, null, n[r], i);
								for (r in t) o && "function" != typeof t[r] || "children" === r || "key" === r || "value" === r || "checked" === r || n[r] === t[r] || Et(e, r, t[r], n[r], i)
							}(e, f, l, o, s), c) t.__k = [];
						else if (h = t.props.children, kt(e, Array.isArray(h) ? h : [h], t, n, i, o && "foreignObject" !== p, r, d, r ? r[0] : n.__k && yt(n, 0), s), null != r)
							for (h = r.length; h--;) null != r[h] && ht(r[h]);
						s || ("value" in f && void 0 !== (h = f.value) && (h !== l.value || h !== e.value || "progress" === p && !h) && Et(e, "value", h, l.value, !1), "checked" in f && void 0 !== (h = f.checked) && h !== e.checked && Et(e, "checked", h, l.checked, !1))
					}
					return e
				}(n.__e, t, n, i, o, r, d, a);
				(u = rt.diffed) && u(t)
			}
			catch (e) {
				t.__v = null, (a || null != r) && (t.__e = s, t.__h = !!a, r[r.indexOf(s)] = null), rt.__e(e, t, n)
			}
		}

		function Pt(e, t) {
			rt.__c && rt.__c(t, e), e.some((function(t) {
				try {
					e = t.__h, t.__h = [], e.some((function(e) {
						e.call(t)
					}))
				} catch (e) {
					rt.__e(e, t.__v)
				}
			}))
		}

		function It(e, t, n) {
			try {
				"function" == typeof e ? e(t) : e.current = t
			} catch (e) {
				rt.__e(e, n)
			}
		}

		function Lt(e, t, n) {
			var i, o;
			if (rt.unmount && rt.unmount(e), (i = e.ref) && (i.current && i.current !== e.__e || It(i, null, t)), null != (i = e.__c)) {
				if (i.componentWillUnmount) try {
					i.componentWillUnmount()
				} catch (e) {
					rt.__e(e, t)
				}
				i.base = i.__P = null
			}
			if (i = e.__k)
				for (o = 0; o < i.length; o++) i[o] && Lt(i[o], t, "function" != typeof e.type);
			n || null == e.__e || ht(e.__e), e.__e = e.__d = void 0
		}

		function zt(e, t, n) {
			return this.constructor(e, n)
		}

		function At(e, t, n) {
			var i, o, r;
			rt.__ && rt.__(e, t), o = (i = "function" == typeof n) ? null : n && n.__k || t.__k, r = [], Mt(t, e = (!i && n || t).__k = mt(vt, null, [e]), o || ct, ct, void 0 !== t.ownerSVGElement, !i && n ? [n] : o ? null : t.firstChild ? ot.call(t.childNodes) : null, r, !i && n ? n : o ? o.__e : t.firstChild, i), Pt(r, e)
		}
		ot = lt.slice, rt = {
			__e: function(e, t) {
				for (var n, i, o; t = t.__;)
					if ((n = t.__c) && !n.__) try {
						if ((i = n.constructor) && null != i.getDerivedStateFromError && (n.setState(i.getDerivedStateFromError(e)), o = n.__d), null != n.componentDidCatch && (n.componentDidCatch(e), o = n.__d), o) return n.__E = n
					} catch (t) {
						e = t
					}
				throw e
			}
		}, dt = 0, bt.prototype.setState = function(e, t) {
			var n;
			n = null != this.__s && this.__s !== this.state ? this.__s : this.__s = pt({}, this.state), "function" == typeof e && (e = e(pt({}, n), this.props)), e && pt(n, e), null != e && this.__v && (t && this.__h.push(t), _t(this))
		}, bt.prototype.forceUpdate = function(e) {
			this.__v && (this.__e = !0, e && this.__h.push(e), _t(this))
		}, bt.prototype.render = vt, st = [], at = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, xt.__r = 0;
		var Bt = 0;

		function Rt(e, t, n, i, o) {
			var r, d, s = {};
			for (d in t) "ref" == d ? r = t[d] : s[d] = t[d];
			var a = {
				type: e,
				props: s,
				key: n,
				ref: r,
				__k: null,
				__: null,
				__b: 0,
				__e: null,
				__d: void 0,
				__c: null,
				__h: null,
				constructor: void 0,
				__v: --Bt,
				__source: i,
				__self: o
			};
			if ("function" == typeof e && (r = e.defaultProps))
				for (d in r) void 0 === s[d] && (s[d] = r[d]);
			return rt.vnode && rt.vnode(a), a
		}
		var Ht = function(e, t) {
				try {
					window.localStorage[`emoji-mart.${e}`] = JSON.stringify(t)
				} catch (e) {}
			},
			Dt = function(e) {
				try {
					const t = window.localStorage[`emoji-mart.${e}`];
					if (t) return JSON.parse(t)
				} catch (e) {}
			};
		const Vt = new Map,
			Ft = [{
				v: 14,
				emoji: "🫠"
			}, {
				v: 13.1,
				emoji: "😶‍🌫️"
			}, {
				v: 13,
				emoji: "🥸"
			}, {
				v: 12.1,
				emoji: "🧑‍🦰"
			}, {
				v: 12,
				emoji: "🥱"
			}, {
				v: 11,
				emoji: "🥰"
			}, {
				v: 5,
				emoji: "🤩"
			}, {
				v: 4,
				emoji: "👱‍♀️"
			}, {
				v: 3,
				emoji: "🤣"
			}, {
				v: 2,
				emoji: "👋🏻"
			}, {
				v: 1,
				emoji: "🙃"
			}];

		function Nt(e) {
			if (Vt.has(e)) return Vt.get(e);
			const t = qt(e);
			return Vt.set(e, t), t
		}
		const qt = (() => {
			let e = null;
			try {
				navigator.userAgent.includes("jsdom") || (e = document.createElement("canvas").getContext("2d", {
					willReadFrequently: !0
				}))
			} catch {}
			if (!e) return () => !1;
			const t = 20,
				n = Math.floor(12.5);
			return e.font = n + "px Arial, Sans-Serif", e.textBaseline = "top", e.canvas.width = 40, e.canvas.height = 25, n => {
				e.clearRect(0, 0, 40, 25), e.fillStyle = "#FF0000", e.fillText(n, 0, 22), e.fillStyle = "#0000FF", e.fillText(n, t, 22);
				const i = e.getImageData(0, 0, t, 25).data,
					o = i.length;
				let r = 0;
				for (; r < o && !i[r + 3]; r += 4);
				if (r >= o) return !1;
				const d = t + r / 4 % t,
					s = Math.floor(r / 4 / t),
					a = e.getImageData(d, s, 1, 1).data;
				return i[r] === a[0] && i[r + 2] === a[2] && !(e.measureText(n).width >= t)
			}
		})();
		var Ut = function() {
				for (const {
						v: e,
						emoji: t
					}
					of Ft)
					if (Nt(t)) return e
			},
			Wt = function() {
				return !Nt("🇨🇦")
			};
		const Jt = ["+1", "grinning", "kissing_heart", "heart_eyes", "laughing", "stuck_out_tongue_winking_eye", "sweat_smile", "joy", "scream", "disappointed", "unamused", "weary", "sob", "sunglasses", "heart"];
		let Gt = null;
		var Kt, Zt = function(e) {
				Gt || (Gt = Dt("frequently") || {});
				const t = e.id || e;
				t && (Gt[t] || (Gt[t] = 0), Gt[t] += 1, Ht("last", t), Ht("frequently", Gt))
			},
			Yt = function({
				maxFrequentRows: e,
				perLine: t
			}) {
				if (!e) return [];
				Gt || (Gt = Dt("frequently"));
				let n = [];
				if (!Gt) {
					Gt = {};
					for (let e in Jt.slice(0, t)) {
						const i = Jt[e];
						Gt[i] = t - e, n.push(i)
					}
					return n
				}
				const i = e * t,
					o = Dt("last");
				for (let e in Gt) n.push(e);
				if (n.sort(((e, t) => {
						const n = Gt[t],
							i = Gt[e];
						return n == i ? e.localeCompare(t) : n - i
					})), n.length > i) {
					const e = n.slice(i);
					n = n.slice(0, i);
					for (let t of e) t != o && delete Gt[t];
					o && -1 == n.indexOf(o) && (delete Gt[n[n.length - 1]], n.splice(-1, 1, o)), Ht("frequently", Gt)
				}
				return n
			};
		Kt = JSON.parse('{"search":"Search","search_no_results_1":"Oh no!","search_no_results_2":"That emoji couldn’t be found","pick":"Pick an emoji…","add_custom":"Add custom emoji","categories":{"activity":"Activity","custom":"Custom","flags":"Flags","foods":"Food & Drink","frequent":"Frequently used","nature":"Animals & Nature","objects":"Objects","people":"Smileys & People","places":"Travel & Places","search":"Search Results","symbols":"Symbols"},"skins":{"1":"Default","2":"Light","3":"Medium-Light","4":"Medium","5":"Medium-Dark","6":"Dark","choose":"Choose default skin tone"}}');
		var Xt = {
			autoFocus: {
				value: !1
			},
			dynamicWidth: {
				value: !1
			},
			emojiButtonColors: {
				value: null
			},
			emojiButtonRadius: {
				value: "100%"
			},
			emojiButtonSize: {
				value: 36
			},
			emojiSize: {
				value: 24
			},
			emojiVersion: {
				value: 14,
				choices: [1, 2, 3, 4, 5, 11, 12, 12.1, 13, 13.1, 14]
			},
			exceptEmojis: {
				value: []
			},
			icons: {
				value: "auto",
				choices: ["auto", "outline", "solid"]
			},
			locale: {
				value: "en",
				choices: ["en", "ar", "be", "cs", "de", "es", "fa", "fi", "fr", "hi", "it", "ja", "kr", "nl", "pl", "pt", "ru", "sa", "tr", "uk", "vi", "zh"]
			},
			maxFrequentRows: {
				value: 4
			},
			navPosition: {
				value: "top",
				choices: ["top", "bottom", "none"]
			},
			noCountryFlags: {
				value: !1
			},
			noResultsEmoji: {
				value: null
			},
			perLine: {
				value: 9
			},
			previewEmoji: {
				value: null
			},
			previewPosition: {
				value: "bottom",
				choices: ["top", "bottom", "none"]
			},
			searchPosition: {
				value: "sticky",
				choices: ["sticky", "static", "none"]
			},
			set: {
				value: "native",
				choices: ["native", "apple", "facebook", "google", "twitter"]
			},
			skin: {
				value: 1,
				choices: [1, 2, 3, 4, 5, 6]
			},
			skinTonePosition: {
				value: "preview",
				choices: ["preview", "search", "none"]
			},
			theme: {
				value: "auto",
				choices: ["auto", "light", "dark"]
			},
			categories: null,
			categoryIcons: null,
			custom: null,
			data: null,
			i18n: null,
			getImageURL: null,
			getSpritesheetURL: null,
			onAddCustomEmoji: null,
			onClickOutside: null,
			onEmojiSelect: null,
			stickySearch: {
				deprecated: !0,
				value: !0
			}
		};
		let Qt = null,
			en = null;
		const tn = {};
		async function nn(e) {
			if (tn[e]) return tn[e];
			const t = await fetch(e),
				n = await t.json();
			return tn[e] = n, n
		}
		let on = null,
			rn = null,
			dn = !1;

		function sn(e, {
			caller: t
		} = {}) {
			return on || (on = new Promise((e => {
				rn = e
			}))), e ? async function(e) {
				dn = !0;
				let {
					emojiVersion: t,
					set: n,
					locale: i
				} = e;
				if (t || (t = Xt.emojiVersion.value), n || (n = Xt.set.value), i || (i = Xt.locale.value), en) en.categories = en.categories.filter((e => !e.name));
				else {
					en = ("function" == typeof e.data ? await e.data() : e.data) || await nn(`https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/${t}/${n}.json`), en.emoticons = {}, en.natives = {}, en.categories.unshift({
						id: "frequent",
						emojis: []
					});
					for (const e in en.aliases) {
						const t = en.aliases[e],
							n = en.emojis[t];
						n && (n.aliases || (n.aliases = []), n.aliases.push(e))
					}
					en.originalCategories = en.categories
				}
				if (Qt = ("function" == typeof e.i18n ? await e.i18n() : e.i18n) || ("en" == i ? nt(Kt) : await nn(`https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/i18n/${i}.json`)), e.custom)
					for (let t in e.custom) {
						t = parseInt(t);
						const n = e.custom[t],
							i = e.custom[t - 1];
						if (n.emojis && n.emojis.length) {
							n.id || (n.id = `custom_${t+1}`), n.name || (n.name = Qt.categories.custom), i && !n.icon && (n.target = i.target || i), en.categories.push(n);
							for (const e of n.emojis) en.emojis[e.id] = e
						}
					}
				e.categories && (en.categories = en.originalCategories.filter((t => -1 != e.categories.indexOf(t.id))).sort(((t, n) => e.categories.indexOf(t.id) - e.categories.indexOf(n.id))));
				let o = null,
					r = null;
				"native" == n && (o = Ut(), r = e.noCountryFlags || Wt());
				let d = en.categories.length,
					s = !1;
				for (; d--;) {
					const t = en.categories[d];
					if ("frequent" == t.id) {
						let {
							maxFrequentRows: n,
							perLine: i
						} = e;
						n = n >= 0 ? n : Xt.maxFrequentRows.value, i || (i = Xt.perLine.value), t.emojis = Yt({
							maxFrequentRows: n,
							perLine: i
						})
					}
					if (!t.emojis || !t.emojis.length) {
						en.categories.splice(d, 1);
						continue
					}
					const {
						categoryIcons: n
					} = e;
					if (n) {
						const e = n[t.id];
						e && !t.icon && (t.icon = e)
					}
					let i = t.emojis.length;
					for (; i--;) {
						const n = t.emojis[i],
							d = n.id ? n : en.emojis[n],
							a = () => {
								t.emojis.splice(i, 1)
							};
						if (!d || e.exceptEmojis && e.exceptEmojis.includes(d.id)) a();
						else if (o && d.version > o) a();
						else if (!r || "flags" != t.id || fn.includes(d.id)) {
							if (!d.search) {
								if (s = !0, d.search = "," + [
										[d.id, !1],
										[d.name, !0],
										[d.keywords, !1],
										[d.emoticons, !1]
									].map((([e, t]) => {
										if (e) return (Array.isArray(e) ? e : [e]).map((e => (t ? e.split(/[-|_|\s]+/) : [e]).map((e => e.toLowerCase())))).flat()
									})).flat().filter((e => e && e.trim())).join(","), d.emoticons)
									for (const e of d.emoticons) en.emoticons[e] || (en.emoticons[e] = d.id);
								let e = 0;
								for (const t of d.skins) {
									if (!t) continue;
									e++;
									const {
										native: n
									} = t;
									n && (en.natives[n] = d.id, d.search += `,${n}`);
									const i = 1 == e ? "" : `:skin-tone-${e}:`;
									t.shortcodes = `:${d.id}:${i}`
								}
							}
						} else a()
					}
				}
				s && ln.reset(), rn()
			}(e): t && !dn && console.warn(`\`${t}\` requires data to be initialized first. Promise will be pending until \`init\` is called.`), on
		}

		function an(e, t, n) {
			e || (e = {});
			const i = {};
			for (let o in t) i[o] = un(o, e, t, n);
			return i
		}

		function un(e, t, n, i) {
			const o = n[e];
			let r = i && i.getAttribute(e) || (null != t[e] && null != t[e] ? t[e] : null);
			return o ? (null != r && o.value && typeof o.value != typeof r && (r = "boolean" == typeof o.value ? "false" != r : o.value.constructor(r)), o.transform && r && (r = o.transform(r)), (null == r || o.choices && -1 == o.choices.indexOf(r)) && (r = o.value), r) : r
		}
		let cn = null;
		var ln = {
			search: async function(e, {
				maxResults: t,
				caller: n
			} = {}) {
				if (!e || !e.trim().length) return null;
				t || (t = 90), await sn(null, {
					caller: n || "SearchIndex.search"
				});
				const i = e.toLowerCase().replace(/(\w)-/, "$1 ").split(/[\s|,]+/).filter(((e, t, n) => e.trim() && n.indexOf(e) == t));
				if (!i.length) return;
				let o, r, d = cn || (cn = Object.values(en.emojis));
				for (const e of i) {
					if (!d.length) break;
					o = [], r = {};
					for (const t of d) {
						if (!t.search) continue;
						const n = t.search.indexOf(`,${e}`); - 1 != n && (o.push(t), r[t.id] || (r[t.id] = 0), r[t.id] += t.id == e ? 0 : n + 1)
					}
					d = o
				}
				return o.length < 2 || (o.sort(((e, t) => {
					const n = r[e.id],
						i = r[t.id];
					return n == i ? e.id.localeCompare(t.id) : n - i
				})), o.length > t && (o = o.slice(0, t))), o
			},
			get: function(e) {
				return e.id ? e : en.emojis[e] || en.emojis[en.aliases[e]] || en.emojis[en.natives[e]]
			},
			reset: function() {
				cn = null
			},
			SHORTCODES_REGEX: /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/
		};
		const fn = ["checkered_flag", "crossed_flags", "pirate_flag", "rainbow-flag", "transgender_flag", "triangular_flag_on_post", "waving_black_flag", "waving_white_flag"];
		var pn = {
			categories: {
				activity: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: Rt("path", {
							d: "M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.372-12-12-12m9.949 11H17.05c.224-2.527 1.232-4.773 1.968-6.113A9.966 9.966 0 0 1 21.949 11M13 11V2.051a9.945 9.945 0 0 1 4.432 1.564c-.858 1.491-2.156 4.22-2.392 7.385H13zm-2 0H8.961c-.238-3.165-1.536-5.894-2.393-7.385A9.95 9.95 0 0 1 11 2.051V11zm0 2v8.949a9.937 9.937 0 0 1-4.432-1.564c.857-1.492 2.155-4.221 2.393-7.385H11zm4.04 0c.236 3.164 1.534 5.893 2.392 7.385A9.92 9.92 0 0 1 13 21.949V13h2.04zM4.982 4.887C5.718 6.227 6.726 8.473 6.951 11h-4.9a9.977 9.977 0 0 1 2.931-6.113M2.051 13h4.9c-.226 2.527-1.233 4.771-1.969 6.113A9.972 9.972 0 0 1 2.051 13m16.967 6.113c-.735-1.342-1.744-3.586-1.968-6.113h4.899a9.961 9.961 0 0 1-2.931 6.113"
						})
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 512 512",
						children: Rt("path", {
							d: "M16.17 337.5c0 44.98 7.565 83.54 13.98 107.9C35.22 464.3 50.46 496 174.9 496c9.566 0 19.59-.4707 29.84-1.271L17.33 307.3C16.53 317.6 16.17 327.7 16.17 337.5zM495.8 174.5c0-44.98-7.565-83.53-13.98-107.9c-4.688-17.54-18.34-31.23-36.04-35.95C435.5 27.91 392.9 16 337 16c-9.564 0-19.59 .4707-29.84 1.271l187.5 187.5C495.5 194.4 495.8 184.3 495.8 174.5zM26.77 248.8l236.3 236.3c142-36.1 203.9-150.4 222.2-221.1L248.9 26.87C106.9 62.96 45.07 177.2 26.77 248.8zM256 335.1c0 9.141-7.474 16-16 16c-4.094 0-8.188-1.564-11.31-4.689L164.7 283.3C161.6 280.2 160 276.1 160 271.1c0-8.529 6.865-16 16-16c4.095 0 8.189 1.562 11.31 4.688l64.01 64C254.4 327.8 256 331.9 256 335.1zM304 287.1c0 9.141-7.474 16-16 16c-4.094 0-8.188-1.564-11.31-4.689L212.7 235.3C209.6 232.2 208 228.1 208 223.1c0-9.141 7.473-16 16-16c4.094 0 8.188 1.562 11.31 4.688l64.01 64.01C302.5 279.8 304 283.9 304 287.1zM256 175.1c0-9.141 7.473-16 16-16c4.094 0 8.188 1.562 11.31 4.688l64.01 64.01c3.125 3.125 4.688 7.219 4.688 11.31c0 9.133-7.468 16-16 16c-4.094 0-8.189-1.562-11.31-4.688l-64.01-64.01C257.6 184.2 256 180.1 256 175.1z"
						})
					})
				},
				custom: Rt("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					viewBox: "0 0 448 512",
					children: Rt("path", {
						d: "M417.1 368c-5.937 10.27-16.69 16-27.75 16c-5.422 0-10.92-1.375-15.97-4.281L256 311.4V448c0 17.67-14.33 32-31.1 32S192 465.7 192 448V311.4l-118.3 68.29C68.67 382.6 63.17 384 57.75 384c-11.06 0-21.81-5.734-27.75-16c-8.828-15.31-3.594-34.88 11.72-43.72L159.1 256L41.72 187.7C26.41 178.9 21.17 159.3 29.1 144C36.63 132.5 49.26 126.7 61.65 128.2C65.78 128.7 69.88 130.1 73.72 132.3L192 200.6V64c0-17.67 14.33-32 32-32S256 46.33 256 64v136.6l118.3-68.29c3.838-2.213 7.939-3.539 12.07-4.051C398.7 126.7 411.4 132.5 417.1 144c8.828 15.31 3.594 34.88-11.72 43.72L288 256l118.3 68.28C421.6 333.1 426.8 352.7 417.1 368z"
					})
				}),
				flags: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: Rt("path", {
							d: "M0 0l6.084 24H8L1.916 0zM21 5h-4l-1-4H4l3 12h3l1 4h13L21 5zM6.563 3h7.875l2 8H8.563l-2-8zm8.832 10l-2.856 1.904L12.063 13h3.332zM19 13l-1.5-6h1.938l2 8H16l3-2z"
						})
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 512 512",
						children: Rt("path", {
							d: "M64 496C64 504.8 56.75 512 48 512h-32C7.25 512 0 504.8 0 496V32c0-17.75 14.25-32 32-32s32 14.25 32 32V496zM476.3 0c-6.365 0-13.01 1.35-19.34 4.233c-45.69 20.86-79.56 27.94-107.8 27.94c-59.96 0-94.81-31.86-163.9-31.87C160.9 .3055 131.6 4.867 96 15.75v350.5c32-9.984 59.87-14.1 84.85-14.1c73.63 0 124.9 31.78 198.6 31.78c31.91 0 68.02-5.971 111.1-23.09C504.1 355.9 512 344.4 512 332.1V30.73C512 11.1 495.3 0 476.3 0z"
						})
					})
				},
				foods: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: Rt("path", {
							d: "M17 4.978c-1.838 0-2.876.396-3.68.934.513-1.172 1.768-2.934 4.68-2.934a1 1 0 0 0 0-2c-2.921 0-4.629 1.365-5.547 2.512-.064.078-.119.162-.18.244C11.73 1.838 10.798.023 9.207.023 8.579.022 7.85.306 7 .978 5.027 2.54 5.329 3.902 6.492 4.999 3.609 5.222 0 7.352 0 12.969c0 4.582 4.961 11.009 9 11.009 1.975 0 2.371-.486 3-1 .629.514 1.025 1 3 1 4.039 0 9-6.418 9-11 0-5.953-4.055-8-7-8M8.242 2.546c.641-.508.943-.523.965-.523.426.169.975 1.405 1.357 3.055-1.527-.629-2.741-1.352-2.98-1.846.059-.112.241-.356.658-.686M15 21.978c-1.08 0-1.21-.109-1.559-.402l-.176-.146c-.367-.302-.816-.452-1.266-.452s-.898.15-1.266.452l-.176.146c-.347.292-.477.402-1.557.402-2.813 0-7-5.389-7-9.009 0-5.823 4.488-5.991 5-5.991 1.939 0 2.484.471 3.387 1.251l.323.276a1.995 1.995 0 0 0 2.58 0l.323-.276c.902-.78 1.447-1.251 3.387-1.251.512 0 5 .168 5 6 0 3.617-4.187 9-7 9"
						})
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 512 512",
						children: Rt("path", {
							d: "M481.9 270.1C490.9 279.1 496 291.3 496 304C496 316.7 490.9 328.9 481.9 337.9C472.9 346.9 460.7 352 448 352H64C51.27 352 39.06 346.9 30.06 337.9C21.06 328.9 16 316.7 16 304C16 291.3 21.06 279.1 30.06 270.1C39.06 261.1 51.27 256 64 256H448C460.7 256 472.9 261.1 481.9 270.1zM475.3 388.7C478.3 391.7 480 395.8 480 400V416C480 432.1 473.3 449.3 461.3 461.3C449.3 473.3 432.1 480 416 480H96C79.03 480 62.75 473.3 50.75 461.3C38.74 449.3 32 432.1 32 416V400C32 395.8 33.69 391.7 36.69 388.7C39.69 385.7 43.76 384 48 384H464C468.2 384 472.3 385.7 475.3 388.7zM50.39 220.8C45.93 218.6 42.03 215.5 38.97 211.6C35.91 207.7 33.79 203.2 32.75 198.4C31.71 193.5 31.8 188.5 32.99 183.7C54.98 97.02 146.5 32 256 32C365.5 32 457 97.02 479 183.7C480.2 188.5 480.3 193.5 479.2 198.4C478.2 203.2 476.1 207.7 473 211.6C469.1 215.5 466.1 218.6 461.6 220.8C457.2 222.9 452.3 224 447.3 224H64.67C59.73 224 54.84 222.9 50.39 220.8zM372.7 116.7C369.7 119.7 368 123.8 368 128C368 131.2 368.9 134.3 370.7 136.9C372.5 139.5 374.1 141.6 377.9 142.8C380.8 143.1 384 144.3 387.1 143.7C390.2 143.1 393.1 141.6 395.3 139.3C397.6 137.1 399.1 134.2 399.7 131.1C400.3 128 399.1 124.8 398.8 121.9C397.6 118.1 395.5 116.5 392.9 114.7C390.3 112.9 387.2 111.1 384 111.1C379.8 111.1 375.7 113.7 372.7 116.7V116.7zM244.7 84.69C241.7 87.69 240 91.76 240 96C240 99.16 240.9 102.3 242.7 104.9C244.5 107.5 246.1 109.6 249.9 110.8C252.8 111.1 256 112.3 259.1 111.7C262.2 111.1 265.1 109.6 267.3 107.3C269.6 105.1 271.1 102.2 271.7 99.12C272.3 96.02 271.1 92.8 270.8 89.88C269.6 86.95 267.5 84.45 264.9 82.7C262.3 80.94 259.2 79.1 256 79.1C251.8 79.1 247.7 81.69 244.7 84.69V84.69zM116.7 116.7C113.7 119.7 112 123.8 112 128C112 131.2 112.9 134.3 114.7 136.9C116.5 139.5 118.1 141.6 121.9 142.8C124.8 143.1 128 144.3 131.1 143.7C134.2 143.1 137.1 141.6 139.3 139.3C141.6 137.1 143.1 134.2 143.7 131.1C144.3 128 143.1 124.8 142.8 121.9C141.6 118.1 139.5 116.5 136.9 114.7C134.3 112.9 131.2 111.1 128 111.1C123.8 111.1 119.7 113.7 116.7 116.7L116.7 116.7z"
						})
					})
				},
				frequent: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: [Rt("path", {
							d: "M13 4h-2l-.001 7H9v2h2v2h2v-2h4v-2h-4z"
						}), Rt("path", {
							d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"
						})]
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 512 512",
						children: Rt("path", {
							d: "M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z"
						})
					})
				},
				nature: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: [Rt("path", {
							d: "M15.5 8a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 15.5 8M8.5 8a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 8.5 8"
						}), Rt("path", {
							d: "M18.933 0h-.027c-.97 0-2.138.787-3.018 1.497-1.274-.374-2.612-.51-3.887-.51-1.285 0-2.616.133-3.874.517C7.245.79 6.069 0 5.093 0h-.027C3.352 0 .07 2.67.002 7.026c-.039 2.479.276 4.238 1.04 5.013.254.258.882.677 1.295.882.191 3.177.922 5.238 2.536 6.38.897.637 2.187.949 3.2 1.102C8.04 20.6 8 20.795 8 21c0 1.773 2.35 3 4 3 1.648 0 4-1.227 4-3 0-.201-.038-.393-.072-.586 2.573-.385 5.435-1.877 5.925-7.587.396-.22.887-.568 1.104-.788.763-.774 1.079-2.534 1.04-5.013C23.929 2.67 20.646 0 18.933 0M3.223 9.135c-.237.281-.837 1.155-.884 1.238-.15-.41-.368-1.349-.337-3.291.051-3.281 2.478-4.972 3.091-5.031.256.015.731.27 1.265.646-1.11 1.171-2.275 2.915-2.352 5.125-.133.546-.398.858-.783 1.313M12 22c-.901 0-1.954-.693-2-1 0-.654.475-1.236 1-1.602V20a1 1 0 1 0 2 0v-.602c.524.365 1 .947 1 1.602-.046.307-1.099 1-2 1m3-3.48v.02a4.752 4.752 0 0 0-1.262-1.02c1.092-.516 2.239-1.334 2.239-2.217 0-1.842-1.781-2.195-3.977-2.195-2.196 0-3.978.354-3.978 2.195 0 .883 1.148 1.701 2.238 2.217A4.8 4.8 0 0 0 9 18.539v-.025c-1-.076-2.182-.281-2.973-.842-1.301-.92-1.838-3.045-1.853-6.478l.023-.041c.496-.826 1.49-1.45 1.804-3.102 0-2.047 1.357-3.631 2.362-4.522C9.37 3.178 10.555 3 11.948 3c1.447 0 2.685.192 3.733.57 1 .9 2.316 2.465 2.316 4.48.313 1.651 1.307 2.275 1.803 3.102.035.058.068.117.102.178-.059 5.967-1.949 7.01-4.902 7.19m6.628-8.202c-.037-.065-.074-.13-.113-.195a7.587 7.587 0 0 0-.739-.987c-.385-.455-.648-.768-.782-1.313-.076-2.209-1.241-3.954-2.353-5.124.531-.376 1.004-.63 1.261-.647.636.071 3.044 1.764 3.096 5.031.027 1.81-.347 3.218-.37 3.235"
						})]
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 576 512",
						children: Rt("path", {
							d: "M332.7 19.85C334.6 8.395 344.5 0 356.1 0C363.6 0 370.6 3.52 375.1 9.502L392 32H444.1C456.8 32 469.1 37.06 478.1 46.06L496 64H552C565.3 64 576 74.75 576 88V112C576 156.2 540.2 192 496 192H426.7L421.6 222.5L309.6 158.5L332.7 19.85zM448 64C439.2 64 432 71.16 432 80C432 88.84 439.2 96 448 96C456.8 96 464 88.84 464 80C464 71.16 456.8 64 448 64zM416 256.1V480C416 497.7 401.7 512 384 512H352C334.3 512 320 497.7 320 480V364.8C295.1 377.1 268.8 384 240 384C211.2 384 184 377.1 160 364.8V480C160 497.7 145.7 512 128 512H96C78.33 512 64 497.7 64 480V249.8C35.23 238.9 12.64 214.5 4.836 183.3L.9558 167.8C-3.331 150.6 7.094 133.2 24.24 128.1C41.38 124.7 58.76 135.1 63.05 152.2L66.93 167.8C70.49 182 83.29 191.1 97.97 191.1H303.8L416 256.1z"
						})
					})
				},
				objects: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: [Rt("path", {
							d: "M12 0a9 9 0 0 0-5 16.482V21s2.035 3 5 3 5-3 5-3v-4.518A9 9 0 0 0 12 0zm0 2c3.86 0 7 3.141 7 7s-3.14 7-7 7-7-3.141-7-7 3.14-7 7-7zM9 17.477c.94.332 1.946.523 3 .523s2.06-.19 3-.523v.834c-.91.436-1.925.689-3 .689a6.924 6.924 0 0 1-3-.69v-.833zm.236 3.07A8.854 8.854 0 0 0 12 21c.965 0 1.888-.167 2.758-.451C14.155 21.173 13.153 22 12 22c-1.102 0-2.117-.789-2.764-1.453z"
						}), Rt("path", {
							d: "M14.745 12.449h-.004c-.852-.024-1.188-.858-1.577-1.824-.421-1.061-.703-1.561-1.182-1.566h-.009c-.481 0-.783.497-1.235 1.537-.436.982-.801 1.811-1.636 1.791l-.276-.043c-.565-.171-.853-.691-1.284-1.794-.125-.313-.202-.632-.27-.913-.051-.213-.127-.53-.195-.634C7.067 9.004 7.039 9 6.99 9A1 1 0 0 1 7 7h.01c1.662.017 2.015 1.373 2.198 2.134.486-.981 1.304-2.058 2.797-2.075 1.531.018 2.28 1.153 2.731 2.141l.002-.008C14.944 8.424 15.327 7 16.979 7h.032A1 1 0 1 1 17 9h-.011c-.149.076-.256.474-.319.709a6.484 6.484 0 0 1-.311.951c-.429.973-.79 1.789-1.614 1.789"
						})]
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 384 512",
						children: Rt("path", {
							d: "M112.1 454.3c0 6.297 1.816 12.44 5.284 17.69l17.14 25.69c5.25 7.875 17.17 14.28 26.64 14.28h61.67c9.438 0 21.36-6.401 26.61-14.28l17.08-25.68c2.938-4.438 5.348-12.37 5.348-17.7L272 415.1h-160L112.1 454.3zM191.4 .0132C89.44 .3257 16 82.97 16 175.1c0 44.38 16.44 84.84 43.56 115.8c16.53 18.84 42.34 58.23 52.22 91.45c.0313 .25 .0938 .5166 .125 .7823h160.2c.0313-.2656 .0938-.5166 .125-.7823c9.875-33.22 35.69-72.61 52.22-91.45C351.6 260.8 368 220.4 368 175.1C368 78.61 288.9-.2837 191.4 .0132zM192 96.01c-44.13 0-80 35.89-80 79.1C112 184.8 104.8 192 96 192S80 184.8 80 176c0-61.76 50.25-111.1 112-111.1c8.844 0 16 7.159 16 16S200.8 96.01 192 96.01z"
						})
					})
				},
				people: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: [Rt("path", {
							d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"
						}), Rt("path", {
							d: "M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0"
						})]
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 512 512",
						children: Rt("path", {
							d: "M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 432C332.1 432 396.2 382 415.2 314.1C419.1 300.4 407.8 288 393.6 288H118.4C104.2 288 92.92 300.4 96.76 314.1C115.8 382 179.9 432 256 432V432zM176.4 160C158.7 160 144.4 174.3 144.4 192C144.4 209.7 158.7 224 176.4 224C194 224 208.4 209.7 208.4 192C208.4 174.3 194 160 176.4 160zM336.4 224C354 224 368.4 209.7 368.4 192C368.4 174.3 354 160 336.4 160C318.7 160 304.4 174.3 304.4 192C304.4 209.7 318.7 224 336.4 224z"
						})
					})
				},
				places: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: [Rt("path", {
							d: "M6.5 12C5.122 12 4 13.121 4 14.5S5.122 17 6.5 17 9 15.879 9 14.5 7.878 12 6.5 12m0 3c-.275 0-.5-.225-.5-.5s.225-.5.5-.5.5.225.5.5-.225.5-.5.5M17.5 12c-1.378 0-2.5 1.121-2.5 2.5s1.122 2.5 2.5 2.5 2.5-1.121 2.5-2.5-1.122-2.5-2.5-2.5m0 3c-.275 0-.5-.225-.5-.5s.225-.5.5-.5.5.225.5.5-.225.5-.5.5"
						}), Rt("path", {
							d: "M22.482 9.494l-1.039-.346L21.4 9h.6c.552 0 1-.439 1-.992 0-.006-.003-.008-.003-.008H23c0-1-.889-2-1.984-2h-.642l-.731-1.717C19.262 3.012 18.091 2 16.764 2H7.236C5.909 2 4.738 3.012 4.357 4.283L3.626 6h-.642C1.889 6 1 7 1 8h.003S1 8.002 1 8.008C1 8.561 1.448 9 2 9h.6l-.043.148-1.039.346a2.001 2.001 0 0 0-1.359 2.097l.751 7.508a1 1 0 0 0 .994.901H3v1c0 1.103.896 2 2 2h2c1.104 0 2-.897 2-2v-1h6v1c0 1.103.896 2 2 2h2c1.104 0 2-.897 2-2v-1h1.096a.999.999 0 0 0 .994-.901l.751-7.508a2.001 2.001 0 0 0-1.359-2.097M6.273 4.857C6.402 4.43 6.788 4 7.236 4h9.527c.448 0 .834.43.963.857L19.313 9H4.688l1.585-4.143zM7 21H5v-1h2v1zm12 0h-2v-1h2v1zm2.189-3H2.811l-.662-6.607L3 11h18l.852.393L21.189 18z"
						})]
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 512 512",
						children: Rt("path", {
							d: "M39.61 196.8L74.8 96.29C88.27 57.78 124.6 32 165.4 32H346.6C387.4 32 423.7 57.78 437.2 96.29L472.4 196.8C495.6 206.4 512 229.3 512 256V448C512 465.7 497.7 480 480 480H448C430.3 480 416 465.7 416 448V400H96V448C96 465.7 81.67 480 64 480H32C14.33 480 0 465.7 0 448V256C0 229.3 16.36 206.4 39.61 196.8V196.8zM109.1 192H402.9L376.8 117.4C372.3 104.6 360.2 96 346.6 96H165.4C151.8 96 139.7 104.6 135.2 117.4L109.1 192zM96 256C78.33 256 64 270.3 64 288C64 305.7 78.33 320 96 320C113.7 320 128 305.7 128 288C128 270.3 113.7 256 96 256zM416 320C433.7 320 448 305.7 448 288C448 270.3 433.7 256 416 256C398.3 256 384 270.3 384 288C384 305.7 398.3 320 416 320z"
						})
					})
				},
				symbols: {
					outline: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 24 24",
						children: Rt("path", {
							d: "M0 0h11v2H0zM4 11h3V6h4V4H0v2h4zM15.5 17c1.381 0 2.5-1.116 2.5-2.493s-1.119-2.493-2.5-2.493S13 13.13 13 14.507 14.119 17 15.5 17m0-2.986c.276 0 .5.222.5.493 0 .272-.224.493-.5.493s-.5-.221-.5-.493.224-.493.5-.493M21.5 19.014c-1.381 0-2.5 1.116-2.5 2.493S20.119 24 21.5 24s2.5-1.116 2.5-2.493-1.119-2.493-2.5-2.493m0 2.986a.497.497 0 0 1-.5-.493c0-.271.224-.493.5-.493s.5.222.5.493a.497.497 0 0 1-.5.493M22 13l-9 9 1.513 1.5 8.99-9.009zM17 11c2.209 0 4-1.119 4-2.5V2s.985-.161 1.498.949C23.01 4.055 23 6 23 6s1-1.119 1-3.135C24-.02 21 0 21 0h-2v6.347A5.853 5.853 0 0 0 17 6c-2.209 0-4 1.119-4 2.5s1.791 2.5 4 2.5M10.297 20.482l-1.475-1.585a47.54 47.54 0 0 1-1.442 1.129c-.307-.288-.989-1.016-2.045-2.183.902-.836 1.479-1.466 1.729-1.892s.376-.871.376-1.336c0-.592-.273-1.178-.818-1.759-.546-.581-1.329-.871-2.349-.871-1.008 0-1.79.293-2.344.879-.556.587-.832 1.181-.832 1.784 0 .813.419 1.748 1.256 2.805-.847.614-1.444 1.208-1.794 1.784a3.465 3.465 0 0 0-.523 1.833c0 .857.308 1.56.924 2.107.616.549 1.423.823 2.42.823 1.173 0 2.444-.379 3.813-1.137L8.235 24h2.819l-2.09-2.383 1.333-1.135zm-6.736-6.389a1.02 1.02 0 0 1 .73-.286c.31 0 .559.085.747.254a.849.849 0 0 1 .283.659c0 .518-.419 1.112-1.257 1.784-.536-.651-.805-1.231-.805-1.742a.901.901 0 0 1 .302-.669M3.74 22c-.427 0-.778-.116-1.057-.349-.279-.232-.418-.487-.418-.766 0-.594.509-1.288 1.527-2.083.968 1.134 1.717 1.946 2.248 2.438-.921.507-1.686.76-2.3.76"
						})
					}),
					solid: Rt("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 512 512",
						children: Rt("path", {
							d: "M500.3 7.251C507.7 13.33 512 22.41 512 31.1V175.1C512 202.5 483.3 223.1 447.1 223.1C412.7 223.1 383.1 202.5 383.1 175.1C383.1 149.5 412.7 127.1 447.1 127.1V71.03L351.1 90.23V207.1C351.1 234.5 323.3 255.1 287.1 255.1C252.7 255.1 223.1 234.5 223.1 207.1C223.1 181.5 252.7 159.1 287.1 159.1V63.1C287.1 48.74 298.8 35.61 313.7 32.62L473.7 .6198C483.1-1.261 492.9 1.173 500.3 7.251H500.3zM74.66 303.1L86.5 286.2C92.43 277.3 102.4 271.1 113.1 271.1H174.9C185.6 271.1 195.6 277.3 201.5 286.2L213.3 303.1H239.1C266.5 303.1 287.1 325.5 287.1 351.1V463.1C287.1 490.5 266.5 511.1 239.1 511.1H47.1C21.49 511.1-.0019 490.5-.0019 463.1V351.1C-.0019 325.5 21.49 303.1 47.1 303.1H74.66zM143.1 359.1C117.5 359.1 95.1 381.5 95.1 407.1C95.1 434.5 117.5 455.1 143.1 455.1C170.5 455.1 191.1 434.5 191.1 407.1C191.1 381.5 170.5 359.1 143.1 359.1zM440.3 367.1H496C502.7 367.1 508.6 372.1 510.1 378.4C513.3 384.6 511.6 391.7 506.5 396L378.5 508C372.9 512.1 364.6 513.3 358.6 508.9C352.6 504.6 350.3 496.6 353.3 489.7L391.7 399.1H336C329.3 399.1 323.4 395.9 321 389.6C318.7 383.4 320.4 376.3 325.5 371.1L453.5 259.1C459.1 255 467.4 254.7 473.4 259.1C479.4 263.4 481.6 271.4 478.7 278.3L440.3 367.1zM116.7 219.1L19.85 119.2C-8.112 90.26-6.614 42.31 24.85 15.34C51.82-8.137 93.26-3.642 118.2 21.83L128.2 32.32L137.7 21.83C162.7-3.642 203.6-8.137 231.6 15.34C262.6 42.31 264.1 90.26 236.1 119.2L139.7 219.1C133.2 225.6 122.7 225.6 116.7 219.1H116.7z"
						})
					})
				}
			},
			search: {
				loupe: Rt("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					viewBox: "0 0 20 20",
					children: Rt("path", {
						d: "M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
					})
				}),
				delete: Rt("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					viewBox: "0 0 20 20",
					children: Rt("path", {
						d: "M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
					})
				})
			}
		};

		function hn(e) {
			let {
				id: t,
				skin: n,
				emoji: i
			} = e;
			if (e.shortcodes) {
				const i = e.shortcodes.match(ln.SHORTCODES_REGEX);
				i && (t = i[1], i[2] && (n = i[2]))
			}
			if (i || (i = ln.get(t || e.native)), !i) return e.fallback;
			const o = i.skins[n - 1] || i.skins[0],
				r = o.src || ("native" == e.set || e.spritesheet ? void 0 : "function" == typeof e.getImageURL ? e.getImageURL(e.set, o.unified) : `https://cdn.jsdelivr.net/npm/emoji-datasource-${e.set}@14.0.0/img/${e.set}/64/${o.unified}.png`),
				d = "function" == typeof e.getSpritesheetURL ? e.getSpritesheetURL(e.set) : `https://cdn.jsdelivr.net/npm/emoji-datasource-${e.set}@14.0.0/img/${e.set}/sheets-256/64.png`;
			return Rt("span", {
				class: "emoji-mart-emoji",
				"data-emoji-set": e.set,
				children: r ? Rt("img", {
					style: {
						maxWidth: e.size || "1em",
						maxHeight: e.size || "1em",
						display: "inline-block"
					},
					alt: o.native || o.shortcodes,
					src: r
				}) : "native" == e.set ? Rt("span", {
					style: {
						fontSize: e.size,
						fontFamily: '"EmojiMart", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"'
					},
					children: o.native
				}) : Rt("span", {
					style: {
						display: "block",
						width: e.size,
						height: e.size,
						backgroundImage: `url(${d})`,
						backgroundSize: `${100*en.sheet.cols}% ${100*en.sheet.rows}%`,
						backgroundPosition: `${100/(en.sheet.cols-1)*o.x}% ${100/(en.sheet.rows-1)*o.y}%`
					}
				})
			})
		}
		const mn = "undefined" != typeof window && window.HTMLElement ? window.HTMLElement : Object;
		class gn extends mn {
			static get observedAttributes() {
				return Object.keys(this.Props)
			}
			update(e = {}) {
				for (let t in e) this.attributeChangedCallback(t, null, e[t])
			}
			attributeChangedCallback(e, t, n) {
				if (!this.component) return;
				const i = un(e, {
					[e]: n
				}, this.constructor.Props, this);
				this.component.componentWillReceiveProps ? this.component.componentWillReceiveProps({
					[e]: i
				}) : (this.component.props[e] = i, this.component.forceUpdate())
			}
			disconnectedCallback() {
				this.disconnected = !0, this.component && this.component.unregister && this.component.unregister()
			}
			constructor(e = {}) {
				if (super(), this.props = e, e.parent || e.ref) {
					let t = null;
					const n = e.parent || (t = e.ref && e.ref.current);
					t && (t.innerHTML = ""), n && n.appendChild(this)
				}
			}
		}
		class vn extends gn {
			setShadow() {
				this.attachShadow({
					mode: "open"
				})
			}
			injectStyles(e) {
				if (!e) return;
				const t = document.createElement("style");
				t.textContent = e, this.shadowRoot.insertBefore(t, this.shadowRoot.firstChild)
			}
			constructor(e, {
				styles: t
			} = {}) {
				super(e), this.setShadow(), this.injectStyles(t)
			}
		}
		var bn = {
			fallback: "",
			id: "",
			native: "",
			shortcodes: "",
			size: {
				value: "",
				transform: e => /\D/.test(e) ? e : `${e}px`
			},
			set: Xt.set,
			skin: Xt.skin
		};
		class yn extends gn {
			async connectedCallback() {
				const e = an(this.props, bn, this);
				e.element = this, e.ref = e => {
					this.component = e
				}, await sn(), this.disconnected || At(Rt(hn, {
					...e
				}), this)
			}
			constructor(e) {
				super(e)
			}
		}
		it(yn, "Props", bn), "undefined" == typeof customElements || customElements.get("em-emoji") || customElements.define("em-emoji", yn);
		var wn, _n, xn = [],
			kn = rt.__b,
			Cn = rt.__r,
			$n = rt.diffed,
			Sn = rt.__c,
			jn = rt.unmount;

		function En() {
			var e;
			for (xn.sort((function(e, t) {
					return e.__v.__b - t.__v.__b
				})); e = xn.pop();)
				if (e.__P) try {
					e.__H.__h.forEach(Tn), e.__H.__h.forEach(Mn), e.__H.__h = []
				} catch (t) {
					e.__H.__h = [], rt.__e(t, e.__v)
				}
		}
		rt.__b = function(e) {
			wn = null, kn && kn(e)
		}, rt.__r = function(e) {
			Cn && Cn(e);
			var t = (wn = e.__c).__H;
			t && (t.__h.forEach(Tn), t.__h.forEach(Mn), t.__h = [])
		}, rt.diffed = function(e) {
			$n && $n(e);
			var t = e.__c;
			t && t.__H && t.__H.__h.length && (1 !== xn.push(t) && _n === rt.requestAnimationFrame || ((_n = rt.requestAnimationFrame) || function(e) {
				var t, n = function() {
						clearTimeout(i), On && cancelAnimationFrame(t), setTimeout(e)
					},
					i = setTimeout(n, 100);
				On && (t = requestAnimationFrame(n))
			})(En)), wn = null
		}, rt.__c = function(e, t) {
			t.some((function(e) {
				try {
					e.__h.forEach(Tn), e.__h = e.__h.filter((function(e) {
						return !e.__ || Mn(e)
					}))
				} catch (n) {
					t.some((function(e) {
						e.__h && (e.__h = [])
					})), t = [], rt.__e(n, e.__v)
				}
			})), Sn && Sn(e, t)
		}, rt.unmount = function(e) {
			jn && jn(e);
			var t, n = e.__c;
			n && n.__H && (n.__H.__.forEach((function(e) {
				try {
					Tn(e)
				} catch (e) {
					t = e
				}
			})), t && rt.__e(t, n.__v))
		};
		var On = "function" == typeof requestAnimationFrame;

		function Tn(e) {
			var t = wn,
				n = e.__c;
			"function" == typeof n && (e.__c = void 0, n()), wn = t
		}

		function Mn(e) {
			var t = wn;
			e.__c = e.__(), wn = t
		}

		function Pn(e, t) {
			for (var n in e)
				if ("__source" !== n && !(n in t)) return !0;
			for (var i in t)
				if ("__source" !== i && e[i] !== t[i]) return !0;
			return !1
		}

		function In(e) {
			this.props = e
		}(In.prototype = new bt).isPureReactComponent = !0, In.prototype.shouldComponentUpdate = function(e, t) {
			return Pn(this.props, e) || Pn(this.state, t)
		};
		var Ln = rt.__b;
		rt.__b = function(e) {
			e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), Ln && Ln(e)
		}, "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref");
		var zn = rt.__e;
		rt.__e = function(e, t, n) {
			if (e.then)
				for (var i, o = t; o = o.__;)
					if ((i = o.__c) && i.__c) return null == t.__e && (t.__e = n.__e, t.__k = n.__k), i.__c(e, t);
			zn(e, t, n)
		};
		var An = rt.unmount;

		function Bn() {
			this.__u = 0, this.t = null, this.__b = null
		}

		function Rn(e) {
			var t = e.__.__c;
			return t && t.__e && t.__e(e)
		}

		function Hn() {
			this.u = null, this.o = null
		}
		rt.unmount = function(e) {
			var t = e.__c;
			t && t.__R && t.__R(), t && !0 === e.__h && (e.type = null), An && An(e)
		}, (Bn.prototype = new bt).__c = function(e, t) {
			var n = t.__c,
				i = this;
			null == i.t && (i.t = []), i.t.push(n);
			var o = Rn(i.__v),
				r = !1,
				d = function() {
					r || (r = !0, n.__R = null, o ? o(s) : s())
				};
			n.__R = d;
			var s = function() {
					if (!--i.__u) {
						if (i.state.__e) {
							var e = i.state.__e;
							i.__v.__k[0] = function e(t, n, i) {
								return t && (t.__v = null, t.__k = t.__k && t.__k.map((function(t) {
									return e(t, n, i)
								})), t.__c && t.__c.__P === n && (t.__e && i.insertBefore(t.__e, t.__d), t.__c.__e = !0, t.__c.__P = i)), t
							}(e, e.__c.__P, e.__c.__O)
						}
						var t;
						for (i.setState({
								__e: i.__b = null
							}); t = i.t.pop();) t.forceUpdate()
					}
				},
				a = !0 === t.__h;
			i.__u++ || a || i.setState({
				__e: i.__b = i.__v.__k[0]
			}), e.then(d, d)
		}, Bn.prototype.componentWillUnmount = function() {
			this.t = []
		}, Bn.prototype.render = function(e, t) {
			if (this.__b) {
				if (this.__v.__k) {
					var n = document.createElement("div"),
						i = this.__v.__k[0].__c;
					this.__v.__k[0] = function e(t, n, i) {
						return t && (t.__c && t.__c.__H && (t.__c.__H.__.forEach((function(e) {
							"function" == typeof e.__c && e.__c()
						})), t.__c.__H = null), null != (t = function(e, t) {
							for (var n in t) e[n] = t[n];
							return e
						}({}, t)).__c && (t.__c.__P === i && (t.__c.__P = n), t.__c = null), t.__k = t.__k && t.__k.map((function(t) {
							return e(t, n, i)
						}))), t
					}(this.__b, n, i.__O = i.__P)
				}
				this.__b = null
			}
			var o = t.__e && mt(vt, null, e.fallback);
			return o && (o.__h = null), [mt(vt, null, t.__e ? null : e.children), o]
		};
		var Dn = function(e, t, n) {
			if (++n[1] === n[0] && e.o.delete(t), e.props.revealOrder && ("t" !== e.props.revealOrder[0] || !e.o.size))
				for (n = e.u; n;) {
					for (; n.length > 3;) n.pop()();
					if (n[1] < n[0]) break;
					e.u = n = n[2]
				}
		};
		(Hn.prototype = new bt).__e = function(e) {
			var t = this,
				n = Rn(t.__v),
				i = t.o.get(e);
			return i[0]++,
				function(o) {
					var r = function() {
						t.props.revealOrder ? (i.push(o), Dn(t, e, i)) : o()
					};
					n ? n(r) : r()
				}
		}, Hn.prototype.render = function(e) {
			this.u = null, this.o = new Map;
			var t = $t(e.children);
			e.revealOrder && "b" === e.revealOrder[0] && t.reverse();
			for (var n = t.length; n--;) this.o.set(t[n], this.u = [1, 0, this.u]);
			return e.children
		}, Hn.prototype.componentDidUpdate = Hn.prototype.componentDidMount = function() {
			var e = this;
			this.o.forEach((function(t, n) {
				Dn(e, n, t)
			}))
		};
		var Vn = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103,
			Fn = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
			Nn = "undefined" != typeof document;
		bt.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach((function(e) {
			Object.defineProperty(bt.prototype, e, {
				configurable: !0,
				get: function() {
					return this["UNSAFE_" + e]
				},
				set: function(t) {
					Object.defineProperty(this, e, {
						configurable: !0,
						writable: !0,
						value: t
					})
				}
			})
		}));
		var qn = rt.event;

		function Un() {}

		function Wn() {
			return this.cancelBubble
		}

		function Jn() {
			return this.defaultPrevented
		}
		rt.event = function(e) {
			return qn && (e = qn(e)), e.persist = Un, e.isPropagationStopped = Wn, e.isDefaultPrevented = Jn, e.nativeEvent = e
		};
		var Gn = {
				configurable: !0,
				get: function() {
					return this.class
				}
			},
			Kn = rt.vnode;
		rt.vnode = function(e) {
			var t, n = e.type,
				i = e.props,
				o = i;
			if ("string" == typeof n) {
				var r = -1 === n.indexOf("-");
				for (var d in o = {}, i) {
					var s = i[d];
					Nn && "children" === d && "noscript" === n || "value" === d && "defaultValue" in i && null == s || ("defaultValue" === d && "value" in i && null == i.value ? d = "value" : "download" === d && !0 === s ? s = "" : /ondoubleclick/i.test(d) ? d = "ondblclick" : /^onchange(textarea|input)/i.test(d + n) && (t = i.type, !("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/i : /fil|che|ra/i).test(t)) ? d = "oninput" : /^onfocus$/i.test(d) ? d = "onfocusin" : /^onblur$/i.test(d) ? d = "onfocusout" : /^on(Ani|Tra|Tou|BeforeInp)/.test(d) ? d = d.toLowerCase() : r && Fn.test(d) ? d = d.replace(/[A-Z0-9]/, "-$&").toLowerCase() : null === s && (s = void 0), o[d] = s)
				}
				"select" == n && o.multiple && Array.isArray(o.value) && (o.value = $t(i.children).forEach((function(e) {
					e.props.selected = -1 != o.value.indexOf(e.props.value)
				}))), "select" == n && null != o.defaultValue && (o.value = $t(i.children).forEach((function(e) {
					e.props.selected = o.multiple ? -1 != o.defaultValue.indexOf(e.props.value) : o.defaultValue == e.props.value
				}))), e.props = o, i.class != i.className && (Gn.enumerable = "className" in i, null != i.className && (o.class = i.className), Object.defineProperty(o, "className", Gn))
			}
			e.$$typeof = Vn, Kn && Kn(e)
		};
		var Zn = rt.__r;
		rt.__r = function(e) {
			Zn && Zn(e), e.__c
		};
		const Yn = {
			light: "outline",
			dark: "solid"
		};
		class Xn extends In {
			renderIcon(e) {
				const {
					icon: t
				} = e;
				if (t) {
					if (t.svg) return Rt("span", {
						class: "flex",
						dangerouslySetInnerHTML: {
							__html: t.svg
						}
					});
					if (t.src) return Rt("img", {
						src: t.src
					})
				}
				const n = pn.categories[e.id] || pn.categories.custom;
				return n["auto" == this.props.icons ? Yn[this.props.theme] : this.props.icons] || n
			}
			render() {
				let e = null;
				return Rt("nav", {
					id: "nav",
					class: "padding",
					"data-position": this.props.position,
					dir: this.props.dir,
					children: Rt("div", {
						class: "flex relative",
						children: [this.categories.map(((t, n) => {
							const i = t.name || Qt.categories[t.id],
								o = !this.props.unfocused && t.id == this.state.categoryId;
							return o && (e = n), Rt("button", {
								"aria-label": i,
								"aria-selected": o || void 0,
								title: i,
								type: "button",
								class: "flex flex-grow flex-center",
								onMouseDown: e => e.preventDefault(),
								onClick: () => {
									this.props.onClick({
										category: t,
										i: n
									})
								},
								children: this.renderIcon(t)
							})
						})), Rt("div", {
							class: "bar",
							style: {
								width: 100 / this.categories.length + "%",
								opacity: null == e ? 0 : 1,
								transform: "rtl" === this.props.dir ? `scaleX(-1) translateX(${100*e}%)` : `translateX(${100*e}%)`
							}
						})]
					})
				})
			}
			constructor() {
				super(), this.categories = en.categories.filter((e => !e.target)), this.state = {
					categoryId: this.categories[0].id
				}
			}
		}
		class Qn extends In {
			shouldComponentUpdate(e) {
				for (let t in e)
					if ("children" != t && e[t] != this.props[t]) return !0;
				return !1
			}
			render() {
				return this.props.children
			}
		}
		class ei extends bt {
			getInitialState(e = this.props) {
				return {
					skin: Dt("skin") || e.skin,
					theme: this.initTheme(e.theme)
				}
			}
			componentWillMount() {
				this.dir = Qt.rtl ? "rtl" : "ltr", this.refs = {
					menu: {
						current: null
					},
					navigation: {
						current: null
					},
					scroll: {
						current: null
					},
					search: {
						current: null
					},
					searchInput: {
						current: null
					},
					skinToneButton: {
						current: null
					},
					skinToneRadio: {
						current: null
					}
				}, this.initGrid(), 0 == this.props.stickySearch && "sticky" == this.props.searchPosition && (console.warn("[EmojiMart] Deprecation warning: `stickySearch` has been renamed `searchPosition`."), this.props.searchPosition = "static")
			}
			componentDidMount() {
				if (this.register(), this.shadowRoot = this.base.parentNode, this.props.autoFocus) {
					const {
						searchInput: e
					} = this.refs;
					e.current && e.current.focus()
				}
			}
			componentWillReceiveProps(e) {
				this.nextState || (this.nextState = {});
				for (const t in e) this.nextState[t] = e[t];
				clearTimeout(this.nextStateTimer), this.nextStateTimer = setTimeout((() => {
					let e = !1;
					for (const t in this.nextState) this.props[t] = this.nextState[t], "custom" !== t && "categories" !== t || (e = !0);
					delete this.nextState;
					const t = this.getInitialState();
					if (e) return this.reset(t);
					this.setState(t)
				}))
			}
			componentWillUnmount() {
				this.unregister()
			}
			async reset(e = {}) {
				await sn(this.props), this.initGrid(), this.unobserve(), this.setState(e, (() => {
					this.observeCategories(), this.observeRows()
				}))
			}
			register() {
				document.addEventListener("click", this.handleClickOutside), this.observe()
			}
			unregister() {
				document.removeEventListener("click", this.handleClickOutside), this.unobserve()
			}
			observe() {
				this.observeCategories(), this.observeRows()
			}
			unobserve({
				except: e = []
			} = {}) {
				Array.isArray(e) || (e = [e]);
				for (const t of this.observers) e.includes(t) || t.disconnect();
				this.observers = [].concat(e)
			}
			initGrid() {
				const {
					categories: e
				} = en;
				this.refs.categories = new Map;
				const t = en.categories.map((e => e.id)).join(",");
				this.navKey && this.navKey != t && this.refs.scroll.current && (this.refs.scroll.current.scrollTop = 0), this.navKey = t, this.grid = [], this.grid.setsize = 0;
				const n = (e, t) => {
					const n = [];
					n.__categoryId = t.id, n.__index = e.length, this.grid.push(n);
					const i = this.grid.length - 1,
						o = i % 10 ? {} : {
							current: null
						};
					return o.index = i, o.posinset = this.grid.setsize + 1, e.push(o), n
				};
				for (let t of e) {
					const e = [];
					let i = n(e, t);
					for (let o of t.emojis) i.length == this.getPerLine() && (i = n(e, t)), this.grid.setsize += 1, i.push(o);
					this.refs.categories.set(t.id, {
						root: {
							current: null
						},
						rows: e
					})
				}
			}
			initTheme(e) {
				if ("auto" != e) return e;
				if (!this.darkMedia) {
					if (this.darkMedia = matchMedia("(prefers-color-scheme: dark)"), this.darkMedia.media.match(/^not/)) return "light";
					this.darkMedia.addListener((() => {
						"auto" == this.props.theme && this.setState({
							theme: this.darkMedia.matches ? "dark" : "light"
						})
					}))
				}
				return this.darkMedia.matches ? "dark" : "light"
			}
			initDynamicPerLine(e = this.props) {
				if (!e.dynamicWidth) return;
				const {
					element: t,
					emojiButtonSize: n
				} = e, i = () => {
					const {
						width: e
					} = t.getBoundingClientRect();
					return Math.floor(e / n)
				}, o = new ResizeObserver((() => {
					this.unobserve({
						except: o
					}), this.setState({
						perLine: i()
					}, (() => {
						this.initGrid(), this.forceUpdate((() => {
							this.observeCategories(), this.observeRows()
						}))
					}))
				}));
				return o.observe(t), this.observers.push(o), i()
			}
			getPerLine() {
				return this.state.perLine || this.props.perLine
			}
			getEmojiByPos([e, t]) {
				const n = this.state.searchResults || this.grid,
					i = n[e] && n[e][t];
				if (i) return ln.get(i)
			}
			observeCategories() {
				const e = this.refs.navigation.current;
				if (!e) return;
				const t = new Map,
					n = {
						root: this.refs.scroll.current,
						threshold: [0, 1]
					},
					i = new IntersectionObserver((n => {
						for (const e of n) {
							const n = e.target.dataset.id;
							t.set(n, e.intersectionRatio)
						}
						const i = [...t];
						for (const [t, n] of i)
							if (n) {
								(o = t) != e.state.categoryId && e.setState({
									categoryId: o
								});
								break
							} var o
					}), n);
				for (const {
						root: e
					}
					of this.refs.categories.values()) i.observe(e.current);
				this.observers.push(i)
			}
			observeRows() {
				const e = {
						...this.state.visibleRows
					},
					t = new IntersectionObserver((t => {
						for (const n of t) {
							const t = parseInt(n.target.dataset.index);
							n.isIntersecting ? e[t] = !0 : delete e[t]
						}
						this.setState({
							visibleRows: e
						})
					}), {
						root: this.refs.scroll.current,
						rootMargin: `${15*this.props.emojiButtonSize}px 0px ${10*this.props.emojiButtonSize}px`
					});
				for (const {
						rows: e
					}
					of this.refs.categories.values())
					for (const n of e) n.current && t.observe(n.current);
				this.observers.push(t)
			}
			preventDefault(e) {
				e.preventDefault()
			}
			unfocusSearch() {
				const e = this.refs.searchInput.current;
				e && e.blur()
			}
			navigate({
				e,
				input: t,
				left: n,
				right: i,
				up: o,
				down: r
			}) {
				const d = this.state.searchResults || this.grid;
				if (!d.length) return;
				let [s, a] = this.state.pos;
				const u = (() => {
					if (0 == s && 0 == a && !e.repeat && (n || o)) return null;
					if (-1 == s) return e.repeat || !i && !r || t.selectionStart != t.value.length ? null : [0, 0];
					if (n || i) {
						let e = d[s];
						const t = n ? -1 : 1;
						if (a += t, !e[a]) {
							if (s += t, e = d[s], !e) return s = n ? 0 : d.length - 1, a = n ? 0 : d[s].length - 1, [s, a];
							a = n ? e.length - 1 : 0
						}
						return [s, a]
					}
					if (o || r) {
						s += o ? -1 : 1;
						const e = d[s];
						return e ? (e[a] || (a = e.length - 1), [s, a]) : (s = o ? 0 : d.length - 1, a = o ? 0 : d[s].length - 1, [s, a])
					}
				})();
				u ? (e.preventDefault(), this.setState({
					pos: u,
					keyboard: !0
				}, (() => {
					this.scrollTo({
						row: u[0]
					})
				}))) : this.state.pos[0] > -1 && this.setState({
					pos: [-1, -1]
				})
			}
			scrollTo({
				categoryId: e,
				row: t
			}) {
				const n = this.state.searchResults || this.grid;
				if (!n.length) return;
				const i = this.refs.scroll.current,
					o = i.getBoundingClientRect();
				let r = 0;
				if (t >= 0 && (e = n[t].__categoryId), e && (r = (this.refs[e] || this.refs.categories.get(e).root).current.getBoundingClientRect().top - (o.top - i.scrollTop) + 1), t >= 0)
					if (t) {
						const e = r + n[t].__index * this.props.emojiButtonSize,
							d = e + this.props.emojiButtonSize + .88 * this.props.emojiButtonSize;
						if (e < i.scrollTop) r = e;
						else {
							if (!(d > i.scrollTop + o.height)) return;
							r = d - o.height
						}
					} else r = 0;
				this.ignoreMouse(), i.scrollTop = r
			}
			ignoreMouse() {
				this.mouseIsIgnored = !0, clearTimeout(this.ignoreMouseTimer), this.ignoreMouseTimer = setTimeout((() => {
					delete this.mouseIsIgnored
				}), 100)
			}
			handleEmojiOver(e) {
				this.mouseIsIgnored || this.state.showSkins || this.setState({
					pos: e || [-1, -1],
					keyboard: !1
				})
			}
			handleEmojiClick({
				e,
				emoji: t,
				pos: n
			}) {
				if (this.props.onEmojiSelect && (!t && n && (t = this.getEmojiByPos(n)), t)) {
					const n = function(e, {
						skinIndex: t = 0
					} = {}) {
						const n = e.skins[t] || (t = 0, e.skins[t]),
							i = {
								id: e.id,
								name: e.name,
								native: n.native,
								unified: n.unified,
								keywords: e.keywords,
								shortcodes: n.shortcodes || e.shortcodes
							};
						return e.skins.length > 1 && (i.skin = t + 1), n.src && (i.src = n.src), e.aliases && e.aliases.length && (i.aliases = e.aliases), e.emoticons && e.emoticons.length && (i.emoticons = e.emoticons), i
					}(t, {
						skinIndex: this.state.skin - 1
					});
					this.props.maxFrequentRows && Zt(n, this.props), this.props.onEmojiSelect(n, e)
				}
			}
			closeSkins() {
				this.state.showSkins && (this.setState({
					showSkins: null,
					tempSkin: null
				}), this.base.removeEventListener("click", this.handleBaseClick), this.base.removeEventListener("keydown", this.handleBaseKeydown))
			}
			handleSkinMouseOver(e) {
				this.setState({
					tempSkin: e
				})
			}
			handleSkinClick(e) {
				this.ignoreMouse(), this.closeSkins(), this.setState({
					skin: e,
					tempSkin: null
				}), Ht("skin", e)
			}
			renderNav() {
				return Rt(Xn, {
					ref: this.refs.navigation,
					icons: this.props.icons,
					theme: this.state.theme,
					dir: this.dir,
					unfocused: !!this.state.searchResults,
					position: this.props.navPosition,
					onClick: this.handleCategoryClick
				}, this.navKey)
			}
			renderPreview() {
				const e = this.getEmojiByPos(this.state.pos),
					t = this.state.searchResults && !this.state.searchResults.length;
				return Rt("div", {
					id: "preview",
					class: "flex flex-middle",
					dir: this.dir,
					"data-position": this.props.previewPosition,
					children: [Rt("div", {
						class: "flex flex-middle flex-grow",
						children: [Rt("div", {
							class: "flex flex-auto flex-middle flex-center",
							style: {
								height: this.props.emojiButtonSize,
								fontSize: this.props.emojiButtonSize
							},
							children: Rt(hn, {
								emoji: e,
								id: t ? this.props.noResultsEmoji || "cry" : this.props.previewEmoji || ("top" == this.props.previewPosition ? "point_down" : "point_up"),
								set: this.props.set,
								size: this.props.emojiButtonSize,
								skin: this.state.tempSkin || this.state.skin,
								spritesheet: !0,
								getSpritesheetURL: this.props.getSpritesheetURL
							})
						}), Rt("div", {
							class: `margin-${this.dir[0]}`,
							children: Rt("div", e || t ? {
								class: `padding-${this.dir[2]} align-${this.dir[0]}`,
								children: [Rt("div", {
									class: "preview-title ellipsis",
									children: e ? e.name : Qt.search_no_results_1
								}), Rt("div", {
									class: "preview-subtitle ellipsis color-c",
									children: e ? e.skins[0].shortcodes : Qt.search_no_results_2
								})]
							} : {
								class: "preview-placeholder color-c",
								children: Qt.pick
							})
						})]
					}), !e && "preview" == this.props.skinTonePosition && this.renderSkinToneButton()]
				})
			}
			renderEmojiButton(e, {
				pos: t,
				posinset: n,
				grid: i
			}) {
				const o = this.props.emojiButtonSize,
					r = this.state.tempSkin || this.state.skin,
					d = (e.skins[r - 1] || e.skins[0]).native,
					s = (a = this.state.pos, u = t, Array.isArray(a) && Array.isArray(u) && a.length === u.length && a.every(((e, t) => e == u[t])));
				var a, u;
				const c = t.concat(e.id).join("");
				return Rt(Qn, {
					selected: s,
					skin: r,
					size: o,
					children: Rt("button", {
						"aria-label": d,
						"aria-selected": s || void 0,
						"aria-posinset": n,
						"aria-setsize": i.setsize,
						"data-keyboard": this.state.keyboard,
						title: "none" == this.props.previewPosition ? e.name : void 0,
						type: "button",
						class: "flex flex-center flex-middle",
						tabindex: "-1",
						onClick: t => this.handleEmojiClick({
							e: t,
							emoji: e
						}),
						onMouseEnter: () => this.handleEmojiOver(t),
						onMouseLeave: () => this.handleEmojiOver(),
						style: {
							width: this.props.emojiButtonSize,
							height: this.props.emojiButtonSize,
							fontSize: this.props.emojiSize,
							lineHeight: 0
						},
						children: [Rt("div", {
							"aria-hidden": "true",
							class: "background",
							style: {
								borderRadius: this.props.emojiButtonRadius,
								backgroundColor: this.props.emojiButtonColors ? this.props.emojiButtonColors[(n - 1) % this.props.emojiButtonColors.length] : void 0
							}
						}), Rt(hn, {
							emoji: e,
							set: this.props.set,
							size: this.props.emojiSize,
							skin: r,
							spritesheet: !0,
							getSpritesheetURL: this.props.getSpritesheetURL
						})]
					})
				}, c)
			}
			renderSearch() {
				const e = "none" == this.props.previewPosition || "search" == this.props.skinTonePosition;
				return Rt("div", {
					children: [Rt("div", {
						class: "spacer"
					}), Rt("div", {
						class: "flex flex-middle",
						children: [Rt("div", {
							class: "search relative flex-grow",
							children: [Rt("input", {
								type: "search",
								ref: this.refs.searchInput,
								placeholder: Qt.search,
								onClick: this.handleSearchClick,
								onInput: this.handleSearchInput,
								onKeyDown: this.handleSearchKeyDown,
								autoComplete: "off"
							}), Rt("span", {
								class: "icon loupe flex",
								children: pn.search.loupe
							}), this.state.searchResults && Rt("button", {
								title: "Clear",
								"aria-label": "Clear",
								type: "button",
								class: "icon delete flex",
								onClick: this.clearSearch,
								onMouseDown: this.preventDefault,
								children: pn.search.delete
							})]
						}), e && this.renderSkinToneButton()]
					})]
				})
			}
			renderSearchResults() {
				const {
					searchResults: e
				} = this.state;
				return e ? Rt("div", {
					class: "category",
					ref: this.refs.search,
					children: [Rt("div", {
						class: `sticky padding-small align-${this.dir[0]}`,
						children: Qt.categories.search
					}), Rt("div", {
						children: e.length ? e.map(((t, n) => Rt("div", {
							class: "flex",
							children: t.map(((t, i) => this.renderEmojiButton(t, {
								pos: [n, i],
								posinset: n * this.props.perLine + i + 1,
								grid: e
							})))
						}))) : Rt("div", {
							class: `padding-small align-${this.dir[0]}`,
							children: this.props.onAddCustomEmoji && Rt("a", {
								onClick: this.props.onAddCustomEmoji,
								children: Qt.add_custom
							})
						})
					})]
				}) : null
			}
			renderCategories() {
				const {
					categories: e
				} = en, t = !!this.state.searchResults, n = this.getPerLine();
				return Rt("div", {
					style: {
						visibility: t ? "hidden" : void 0,
						display: t ? "none" : void 0,
						height: "100%"
					},
					children: e.map((e => {
						const {
							root: t,
							rows: i
						} = this.refs.categories.get(e.id);
						return Rt("div", {
							"data-id": e.target ? e.target.id : e.id,
							class: "category",
							ref: t,
							children: [Rt("div", {
								class: `sticky padding-small align-${this.dir[0]}`,
								children: e.name || Qt.categories[e.id]
							}), Rt("div", {
								class: "relative",
								style: {
									height: i.length * this.props.emojiButtonSize
								},
								children: i.map(((t, i) => {
									const o = t.index - t.index % 10,
										r = this.state.visibleRows[o],
										d = "current" in t ? t : void 0;
									if (!r && !d) return null;
									const s = i * n,
										a = s + n,
										u = e.emojis.slice(s, a);
									return u.length < n && u.push(...new Array(n - u.length)), Rt("div", {
										"data-index": t.index,
										ref: d,
										class: "flex row",
										style: {
											top: i * this.props.emojiButtonSize
										},
										children: r && u.map(((e, n) => {
											if (!e) return Rt("div", {
												style: {
													width: this.props.emojiButtonSize,
													height: this.props.emojiButtonSize
												}
											});
											const i = ln.get(e);
											return this.renderEmojiButton(i, {
												pos: [t.index, n],
												posinset: t.posinset + n,
												grid: this.grid
											})
										}))
									}, t.index)
								}))
							})]
						})
					}))
				})
			}
			renderSkinToneButton() {
				return "none" == this.props.skinTonePosition ? null : Rt("div", {
					class: "flex flex-auto flex-center flex-middle",
					style: {
						position: "relative",
						width: this.props.emojiButtonSize,
						height: this.props.emojiButtonSize
					},
					children: Rt("button", {
						type: "button",
						ref: this.refs.skinToneButton,
						class: "skin-tone-button flex flex-auto flex-center flex-middle",
						"aria-selected": this.state.showSkins ? "" : void 0,
						"aria-label": Qt.skins.choose,
						title: Qt.skins.choose,
						onClick: this.openSkins,
						style: {
							width: this.props.emojiSize,
							height: this.props.emojiSize
						},
						children: Rt("span", {
							class: `skin-tone skin-tone-${this.state.skin}`
						})
					})
				})
			}
			renderLiveRegion() {
				const e = this.getEmojiByPos(this.state.pos);
				return Rt("div", {
					"aria-live": "polite",
					class: "sr-only",
					children: e ? e.name : ""
				})
			}
			renderSkins() {
				const e = this.refs.skinToneButton.current.getBoundingClientRect(),
					t = this.base.getBoundingClientRect(),
					n = {};
				return "ltr" == this.dir ? n.right = t.right - e.right - 3 : n.left = e.left - t.left - 3, "bottom" == this.props.previewPosition && "preview" == this.props.skinTonePosition ? n.bottom = t.bottom - e.top + 6 : (n.top = e.bottom - t.top + 3, n.bottom = "auto"), Rt("div", {
					ref: this.refs.menu,
					role: "radiogroup",
					dir: this.dir,
					"aria-label": Qt.skins.choose,
					class: "menu hidden",
					"data-position": n.top ? "top" : "bottom",
					style: n,
					children: [...Array(6).keys()].map((e => {
						const t = e + 1,
							n = this.state.skin == t;
						return Rt("div", {
							children: [Rt("input", {
								type: "radio",
								name: "skin-tone",
								value: t,
								"aria-label": Qt.skins[t],
								ref: n ? this.refs.skinToneRadio : null,
								defaultChecked: n,
								onChange: () => this.handleSkinMouseOver(t),
								onKeyDown: e => {
									"Enter" != e.code && "Space" != e.code && "Tab" != e.code || (e.preventDefault(), this.handleSkinClick(t))
								}
							}), Rt("button", {
								"aria-hidden": "true",
								tabindex: "-1",
								onClick: () => this.handleSkinClick(t),
								onMouseEnter: () => this.handleSkinMouseOver(t),
								onMouseLeave: () => this.handleSkinMouseOver(),
								class: "option flex flex-grow flex-middle",
								children: [Rt("span", {
									class: `skin-tone skin-tone-${t}`
								}), Rt("span", {
									class: "margin-small-lr",
									children: Qt.skins[t]
								})]
							})]
						})
					}))
				})
			}
			render() {
				const e = this.props.perLine * this.props.emojiButtonSize;
				return Rt("section", {
					id: "root",
					class: "flex flex-column",
					dir: this.dir,
					style: {
						width: this.props.dynamicWidth ? "100%" : `calc(${e}px + (var(--padding) + var(--sidebar-width)))`
					},
					"data-emoji-set": this.props.set,
					"data-theme": this.state.theme,
					"data-menu": this.state.showSkins ? "" : void 0,
					children: ["top" == this.props.previewPosition && this.renderPreview(), "top" == this.props.navPosition && this.renderNav(), "sticky" == this.props.searchPosition && Rt("div", {
						class: "padding-lr",
						children: this.renderSearch()
					}), Rt("div", {
						ref: this.refs.scroll,
						class: "scroll flex-grow padding-lr",
						children: Rt("div", {
							style: {
								width: this.props.dynamicWidth ? "100%" : e,
								height: "100%"
							},
							children: ["static" == this.props.searchPosition && this.renderSearch(), this.renderSearchResults(), this.renderCategories()]
						})
					}), "bottom" == this.props.navPosition && this.renderNav(), "bottom" == this.props.previewPosition && this.renderPreview(), this.state.showSkins && this.renderSkins(), this.renderLiveRegion()]
				})
			}
			constructor(e) {
				super(), it(this, "handleClickOutside", (e => {
					const {
						element: t
					} = this.props;
					e.target != t && (this.state.showSkins && this.closeSkins(), this.props.onClickOutside && this.props.onClickOutside(e))
				})), it(this, "handleBaseClick", (e => {
					this.state.showSkins && (e.target.closest(".menu") || (e.preventDefault(), e.stopImmediatePropagation(), this.closeSkins()))
				})), it(this, "handleBaseKeydown", (e => {
					this.state.showSkins && "Escape" == e.key && (e.preventDefault(), e.stopImmediatePropagation(), this.closeSkins())
				})), it(this, "handleSearchClick", (() => {
					this.getEmojiByPos(this.state.pos) && this.setState({
						pos: [-1, -1]
					})
				})), it(this, "handleSearchInput", (async () => {
					const e = this.refs.searchInput.current;
					if (!e) return;
					const {
						value: t
					} = e, n = await ln.search(t), i = () => {
						this.refs.scroll.current && (this.refs.scroll.current.scrollTop = 0)
					};
					if (!n) return this.setState({
						searchResults: n,
						pos: [-1, -1]
					}, i);
					const o = e.selectionStart == e.value.length ? [0, 0] : [-1, -1],
						r = [];
					r.setsize = n.length;
					let d = null;
					for (let e of n) r.length && d.length != this.getPerLine() || (d = [], d.__categoryId = "search", d.__index = r.length, r.push(d)), d.push(e);
					this.ignoreMouse(), this.setState({
						searchResults: r,
						pos: o
					}, i)
				})), it(this, "handleSearchKeyDown", (e => {
					const t = e.currentTarget;
					switch (e.stopImmediatePropagation(), e.key) {
						case "ArrowLeft":
							this.navigate({
								e,
								input: t,
								left: !0
							});
							break;
						case "ArrowRight":
							this.navigate({
								e,
								input: t,
								right: !0
							});
							break;
						case "ArrowUp":
							this.navigate({
								e,
								input: t,
								up: !0
							});
							break;
						case "ArrowDown":
							this.navigate({
								e,
								input: t,
								down: !0
							});
							break;
						case "Enter":
							e.preventDefault(), this.handleEmojiClick({
								e,
								pos: this.state.pos
							});
							break;
						case "Escape":
							e.preventDefault(), this.state.searchResults ? this.clearSearch() : this.unfocusSearch()
					}
				})), it(this, "clearSearch", (() => {
					const e = this.refs.searchInput.current;
					e && (e.value = "", e.focus(), this.handleSearchInput())
				})), it(this, "handleCategoryClick", (({
					category: e,
					i: t
				}) => {
					this.scrollTo(0 == t ? {
						row: -1
					} : {
						categoryId: e.id
					})
				})), it(this, "openSkins", (e => {
					const {
						currentTarget: t
					} = e, n = t.getBoundingClientRect();
					this.setState({
						showSkins: n
					}, (async () => {
						await async function(e = 1) {
							for (let t in [...Array(e).keys()]) await new Promise(requestAnimationFrame)
						}(2);
						const e = this.refs.menu.current;
						e && (e.classList.remove("hidden"), this.refs.skinToneRadio.current.focus(), this.base.addEventListener("click", this.handleBaseClick, !0), this.base.addEventListener("keydown", this.handleBaseKeydown, !0))
					}))
				})), this.observers = [], this.state = {
					pos: [-1, -1],
					perLine: this.initDynamicPerLine(e),
					visibleRows: {
						0: !0
					},
					...this.getInitialState(e)
				}
			}
		}
		class ti extends vn {
			async connectedCallback() {
				const e = an(this.props, Xt, this);
				e.element = this, e.ref = e => {
					this.component = e
				}, await sn(e), this.disconnected || At(Rt(ei, {
					...e
				}), this.shadowRoot)
			}
			constructor(e) {
				super(e, {
					styles: nt(ni)
				})
			}
		}
		it(ti, "Props", Xt), "undefined" == typeof customElements || customElements.get("em-emoji-picker") || customElements.define("em-emoji-picker", ti);
		var ni = {};

		function ii(e) {
			document.querySelectorAll(e).forEach((e => {
				tt.parse(e, {
					folder: "svg",
					ext: ".svg"
				})
			})), $(e).each((function() {
				if (!$(this).text().trim().length) {
					const e = $(this).find(".emoji");
					let t = 0;
					e.each((function() {
						if ($(this).next().hasClass("emoji") ? t++ : t = 0, t >= 10) return !1
					})), t < 10 && e.addClass("jumboable")
				}
			}))
		}

		function oi(e) {
			$.getJSON("https://snippet.host/sgyddt/raw", (function(t) {
				$(e).each((function() {
					var e = $(this),
						n = e.html();
					t.forEach((function(e) {
						e.emojis.forEach((function(e) {
							var t = new RegExp(":" + e.id + ":", "g");
							n = n.replace(t, `\n          <img class="custom-emoji" draggable="false" src="${e.skins[0].src}" alt=":${e.id}:" title=":${e.id}:">`)
						}))
					})), e.html(n)
				}))
			}))
		}
		ni = ':host {\n  width: min-content;\n  height: 435px;\n  min-height: 230px;\n  border-radius: var(--border-radius);\n  box-shadow: var(--shadow);\n  --border-radius: 10px;\n  --category-icon-size: 18px;\n  --font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;\n  --font-size: 15px;\n  --preview-placeholder-size: 21px;\n  --preview-title-size: 1.1em;\n  --preview-subtitle-size: .9em;\n  --shadow-color: 0deg 0% 0%;\n  --shadow: .3px .5px 2.7px hsl(var(--shadow-color) / .14), .4px .8px 1px -3.2px hsl(var(--shadow-color) / .14), 1px 2px 2.5px -4.5px hsl(var(--shadow-color) / .14);\n  display: flex;\n}\n\n[data-theme="light"] {\n  --em-rgb-color: var(--rgb-color, 34, 36, 39);\n  --em-rgb-accent: var(--rgb-accent, 34, 102, 237);\n  --em-rgb-background: var(--rgb-background, 255, 255, 255);\n  --em-rgb-input: var(--rgb-input, 255, 255, 255);\n  --em-color-border: var(--color-border, rgba(0, 0, 0, .05));\n  --em-color-border-over: var(--color-border-over, rgba(0, 0, 0, .1));\n}\n\n[data-theme="dark"] {\n  --em-rgb-color: var(--rgb-color, 222, 222, 221);\n  --em-rgb-accent: var(--rgb-accent, 58, 130, 247);\n  --em-rgb-background: var(--rgb-background, 21, 22, 23);\n  --em-rgb-input: var(--rgb-input, 0, 0, 0);\n  --em-color-border: var(--color-border, rgba(255, 255, 255, .1));\n  --em-color-border-over: var(--color-border-over, rgba(255, 255, 255, .2));\n}\n\n#root {\n  --color-a: rgb(var(--em-rgb-color));\n  --color-b: rgba(var(--em-rgb-color), .65);\n  --color-c: rgba(var(--em-rgb-color), .45);\n  --padding: 12px;\n  --padding-small: calc(var(--padding) / 2);\n  --sidebar-width: 16px;\n  --duration: 225ms;\n  --duration-fast: 125ms;\n  --duration-instant: 50ms;\n  --easing: cubic-bezier(.4, 0, .2, 1);\n  width: 100%;\n  text-align: left;\n  border-radius: var(--border-radius);\n  background-color: rgb(var(--em-rgb-background));\n  position: relative;\n}\n\n@media (prefers-reduced-motion) {\n  #root {\n    --duration: 0;\n    --duration-fast: 0;\n    --duration-instant: 0;\n  }\n}\n\n#root[data-menu] button {\n  cursor: auto;\n}\n\n#root[data-menu] .menu button {\n  cursor: pointer;\n}\n\n:host, #root, input, button {\n  color: rgb(var(--em-rgb-color));\n  font-family: var(--font-family);\n  font-size: var(--font-size);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  line-height: normal;\n}\n\n*, :before, :after {\n  box-sizing: border-box;\n  min-width: 0;\n  margin: 0;\n  padding: 0;\n}\n\n.relative {\n  position: relative;\n}\n\n.flex {\n  display: flex;\n}\n\n.flex-auto {\n  flex: none;\n}\n\n.flex-center {\n  justify-content: center;\n}\n\n.flex-column {\n  flex-direction: column;\n}\n\n.flex-grow {\n  flex: auto;\n}\n\n.flex-middle {\n  align-items: center;\n}\n\n.flex-wrap {\n  flex-wrap: wrap;\n}\n\n.padding {\n  padding: var(--padding);\n}\n\n.padding-t {\n  padding-top: var(--padding);\n}\n\n.padding-lr {\n  padding-left: var(--padding);\n  padding-right: var(--padding);\n}\n\n.padding-r {\n  padding-right: var(--padding);\n}\n\n.padding-small {\n  padding: var(--padding-small);\n}\n\n.padding-small-b {\n  padding-bottom: var(--padding-small);\n}\n\n.padding-small-lr {\n  padding-left: var(--padding-small);\n  padding-right: var(--padding-small);\n}\n\n.margin {\n  margin: var(--padding);\n}\n\n.margin-r {\n  margin-right: var(--padding);\n}\n\n.margin-l {\n  margin-left: var(--padding);\n}\n\n.margin-small-l {\n  margin-left: var(--padding-small);\n}\n\n.margin-small-lr {\n  margin-left: var(--padding-small);\n  margin-right: var(--padding-small);\n}\n\n.align-l {\n  text-align: left;\n}\n\n.align-r {\n  text-align: right;\n}\n\n.color-a {\n  color: var(--color-a);\n}\n\n.color-b {\n  color: var(--color-b);\n}\n\n.color-c {\n  color: var(--color-c);\n}\n\n.ellipsis {\n  white-space: nowrap;\n  max-width: 100%;\n  width: auto;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n.sr-only {\n  width: 1px;\n  height: 1px;\n  position: absolute;\n  top: auto;\n  left: -10000px;\n  overflow: hidden;\n}\n\na {\n  cursor: pointer;\n  color: rgb(var(--em-rgb-accent));\n}\n\na:hover {\n  text-decoration: underline;\n}\n\n.spacer {\n  height: 10px;\n}\n\n[dir="rtl"] .scroll {\n  padding-left: 0;\n  padding-right: var(--padding);\n}\n\n.scroll {\n  padding-right: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.scroll::-webkit-scrollbar {\n  width: var(--sidebar-width);\n  height: var(--sidebar-width);\n}\n\n.scroll::-webkit-scrollbar-track {\n  border: 0;\n}\n\n.scroll::-webkit-scrollbar-button {\n  width: 0;\n  height: 0;\n  display: none;\n}\n\n.scroll::-webkit-scrollbar-corner {\n  background-color: rgba(0, 0, 0, 0);\n}\n\n.scroll::-webkit-scrollbar-thumb {\n  min-height: 20%;\n  min-height: 65px;\n  border: 4px solid rgb(var(--em-rgb-background));\n  border-radius: 8px;\n}\n\n.scroll::-webkit-scrollbar-thumb:hover {\n  background-color: var(--em-color-border-over) !important;\n}\n\n.scroll:hover::-webkit-scrollbar-thumb {\n  background-color: var(--em-color-border);\n}\n\n.sticky {\n  z-index: 1;\n  background-color: rgba(var(--em-rgb-background), .9);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  font-weight: 500;\n  position: sticky;\n  top: -1px;\n}\n\n[dir="rtl"] .search input[type="search"] {\n  padding: 10px 2.2em 10px 2em;\n}\n\n[dir="rtl"] .search .loupe {\n  left: auto;\n  right: .7em;\n}\n\n[dir="rtl"] .search .delete {\n  left: .7em;\n  right: auto;\n}\n\n.search {\n  z-index: 2;\n  position: relative;\n}\n\n.search input, .search button {\n  font-size: calc(var(--font-size)  - 1px);\n}\n\n.search input[type="search"] {\n  width: 100%;\n  background-color: var(--em-color-border);\n  transition-duration: var(--duration);\n  transition-property: background-color, box-shadow;\n  transition-timing-function: var(--easing);\n  border: 0;\n  border-radius: 10px;\n  outline: 0;\n  padding: 10px 2em 10px 2.2em;\n  display: block;\n}\n\n.search input[type="search"]::-ms-input-placeholder {\n  color: inherit;\n  opacity: .6;\n}\n\n.search input[type="search"]::placeholder {\n  color: inherit;\n  opacity: .6;\n}\n\n.search input[type="search"], .search input[type="search"]::-webkit-search-decoration, .search input[type="search"]::-webkit-search-cancel-button, .search input[type="search"]::-webkit-search-results-button, .search input[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance: none;\n  -ms-appearance: none;\n  appearance: none;\n}\n\n.search input[type="search"]:focus {\n  background-color: rgb(var(--em-rgb-input));\n  box-shadow: inset 0 0 0 1px rgb(var(--em-rgb-accent)), 0 1px 3px rgba(65, 69, 73, .2);\n}\n\n.search .icon {\n  z-index: 1;\n  color: rgba(var(--em-rgb-color), .7);\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n}\n\n.search .loupe {\n  pointer-events: none;\n  left: .7em;\n}\n\n.search .delete {\n  right: .7em;\n}\n\nsvg {\n  fill: currentColor;\n  width: 1em;\n  height: 1em;\n}\n\nbutton {\n  -webkit-appearance: none;\n  -ms-appearance: none;\n  appearance: none;\n  cursor: pointer;\n  color: currentColor;\n  background-color: rgba(0, 0, 0, 0);\n  border: 0;\n}\n\n#nav {\n  z-index: 2;\n  padding-top: 12px;\n  padding-bottom: 12px;\n  padding-right: var(--sidebar-width);\n  position: relative;\n}\n\n#nav button {\n  color: var(--color-b);\n  transition: color var(--duration) var(--easing);\n}\n\n#nav button:hover {\n  color: var(--color-a);\n}\n\n#nav svg, #nav img {\n  width: var(--category-icon-size);\n  height: var(--category-icon-size);\n}\n\n#nav[dir="rtl"] .bar {\n  left: auto;\n  right: 0;\n}\n\n#nav .bar {\n  width: 100%;\n  height: 3px;\n  background-color: rgb(var(--em-rgb-accent));\n  transition: transform var(--duration) var(--easing);\n  border-radius: 3px 3px 0 0;\n  position: absolute;\n  bottom: -12px;\n  left: 0;\n}\n\n#nav button[aria-selected] {\n  color: rgb(var(--em-rgb-accent));\n}\n\n#preview {\n  z-index: 2;\n  padding: calc(var(--padding)  + 4px) var(--padding);\n  padding-right: var(--sidebar-width);\n  position: relative;\n}\n\n#preview .preview-placeholder {\n  font-size: var(--preview-placeholder-size);\n}\n\n#preview .preview-title {\n  font-size: var(--preview-title-size);\n}\n\n#preview .preview-subtitle {\n  font-size: var(--preview-subtitle-size);\n}\n\n#nav:before, #preview:before {\n  content: "";\n  height: 2px;\n  position: absolute;\n  left: 0;\n  right: 0;\n}\n\n#nav[data-position="top"]:before, #preview[data-position="top"]:before {\n  background: linear-gradient(to bottom, var(--em-color-border), transparent);\n  top: 100%;\n}\n\n#nav[data-position="bottom"]:before, #preview[data-position="bottom"]:before {\n  background: linear-gradient(to top, var(--em-color-border), transparent);\n  bottom: 100%;\n}\n\n.category:last-child {\n  min-height: calc(100% + 1px);\n}\n\n.category button {\n  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif;\n  position: relative;\n}\n\n.category button > * {\n  position: relative;\n}\n\n.category button .background {\n  opacity: 0;\n  background-color: var(--em-color-border);\n  transition: opacity var(--duration-fast) var(--easing) var(--duration-instant);\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n\n.category button:hover .background {\n  transition-duration: var(--duration-instant);\n  transition-delay: 0s;\n}\n\n.category button[aria-selected] .background {\n  opacity: 1;\n}\n\n.category button[data-keyboard] .background {\n  transition: none;\n}\n\n.row {\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.skin-tone-button {\n  border: 1px solid rgba(0, 0, 0, 0);\n  border-radius: 100%;\n}\n\n.skin-tone-button:hover {\n  border-color: var(--em-color-border);\n}\n\n.skin-tone-button:active .skin-tone {\n  transform: scale(.85) !important;\n}\n\n.skin-tone-button .skin-tone {\n  transition: transform var(--duration) var(--easing);\n}\n\n.skin-tone-button[aria-selected] {\n  background-color: var(--em-color-border);\n  border-top-color: rgba(0, 0, 0, .05);\n  border-bottom-color: rgba(0, 0, 0, 0);\n  border-left-width: 0;\n  border-right-width: 0;\n}\n\n.skin-tone-button[aria-selected] .skin-tone {\n  transform: scale(.9);\n}\n\n.menu {\n  z-index: 2;\n  white-space: nowrap;\n  border: 1px solid var(--em-color-border);\n  background-color: rgba(var(--em-rgb-background), .9);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  transition-property: opacity, transform;\n  transition-duration: var(--duration);\n  transition-timing-function: var(--easing);\n  border-radius: 10px;\n  padding: 4px;\n  position: absolute;\n  box-shadow: 1px 1px 5px rgba(0, 0, 0, .05);\n}\n\n.menu.hidden {\n  opacity: 0;\n}\n\n.menu[data-position="bottom"] {\n  transform-origin: 100% 100%;\n}\n\n.menu[data-position="bottom"].hidden {\n  transform: scale(.9)rotate(-3deg)translateY(5%);\n}\n\n.menu[data-position="top"] {\n  transform-origin: 100% 0;\n}\n\n.menu[data-position="top"].hidden {\n  transform: scale(.9)rotate(3deg)translateY(-5%);\n}\n\n.menu input[type="radio"] {\n  clip: rect(0 0 0 0);\n  width: 1px;\n  height: 1px;\n  border: 0;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  overflow: hidden;\n}\n\n.menu input[type="radio"]:checked + .option {\n  box-shadow: 0 0 0 2px rgb(var(--em-rgb-accent));\n}\n\n.option {\n  width: 100%;\n  border-radius: 6px;\n  padding: 4px 6px;\n}\n\n.option:hover {\n  color: #fff;\n  background-color: rgb(var(--em-rgb-accent));\n}\n\n.skin-tone {\n  width: 16px;\n  height: 16px;\n  border-radius: 100%;\n  display: inline-block;\n  position: relative;\n  overflow: hidden;\n}\n\n.skin-tone:after {\n  content: "";\n  mix-blend-mode: overlay;\n  background: linear-gradient(rgba(255, 255, 255, .2), rgba(0, 0, 0, 0));\n  border: 1px solid rgba(0, 0, 0, .8);\n  border-radius: 100%;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  box-shadow: inset 0 -2px 3px #000, inset 0 1px 2px #fff;\n}\n\n.skin-tone-1 {\n  background-color: #ffc93a;\n}\n\n.skin-tone-2 {\n  background-color: #ffdab7;\n}\n\n.skin-tone-3 {\n  background-color: #e7b98f;\n}\n\n.skin-tone-4 {\n  background-color: #c88c61;\n}\n\n.skin-tone-5 {\n  background-color: #a46134;\n}\n\n.skin-tone-6 {\n  background-color: #5d4437;\n}\n\n[data-index] {\n  justify-content: space-between;\n}\n\n[data-emoji-set="twitter"] .skin-tone:after {\n  box-shadow: none;\n  border-color: rgba(0, 0, 0, .5);\n}\n\n[data-emoji-set="twitter"] .skin-tone-1 {\n  background-color: #fade72;\n}\n\n[data-emoji-set="twitter"] .skin-tone-2 {\n  background-color: #f3dfd0;\n}\n\n[data-emoji-set="twitter"] .skin-tone-3 {\n  background-color: #eed3a8;\n}\n\n[data-emoji-set="twitter"] .skin-tone-4 {\n  background-color: #cfad8d;\n}\n\n[data-emoji-set="twitter"] .skin-tone-5 {\n  background-color: #a8805d;\n}\n\n[data-emoji-set="twitter"] .skin-tone-6 {\n  background-color: #765542;\n}\n\n[data-emoji-set="google"] .skin-tone:after {\n  box-shadow: inset 0 0 2px 2px rgba(0, 0, 0, .4);\n}\n\n[data-emoji-set="google"] .skin-tone-1 {\n  background-color: #f5c748;\n}\n\n[data-emoji-set="google"] .skin-tone-2 {\n  background-color: #f1d5aa;\n}\n\n[data-emoji-set="google"] .skin-tone-3 {\n  background-color: #d4b48d;\n}\n\n[data-emoji-set="google"] .skin-tone-4 {\n  background-color: #aa876b;\n}\n\n[data-emoji-set="google"] .skin-tone-5 {\n  background-color: #916544;\n}\n\n[data-emoji-set="google"] .skin-tone-6 {\n  background-color: #61493f;\n}\n\n[data-emoji-set="facebook"] .skin-tone:after {\n  border-color: rgba(0, 0, 0, .4);\n  box-shadow: inset 0 -2px 3px #000, inset 0 1px 4px #fff;\n}\n\n[data-emoji-set="facebook"] .skin-tone-1 {\n  background-color: #f5c748;\n}\n\n[data-emoji-set="facebook"] .skin-tone-2 {\n  background-color: #f1d5aa;\n}\n\n[data-emoji-set="facebook"] .skin-tone-3 {\n  background-color: #d4b48d;\n}\n\n[data-emoji-set="facebook"] .skin-tone-4 {\n  background-color: #aa876b;\n}\n\n[data-emoji-set="facebook"] .skin-tone-5 {\n  background-color: #916544;\n}\n\n[data-emoji-set="facebook"] .skin-tone-6 {\n  background-color: #61493f;\n}\n\n', $(document).on("click", ".js-post-spoiler", (function() {
			$(this).replaceWith($(this).contents())
		})), ii(".post-body"), oi(".post-body"), $(document).on("click", ".post-editor-header-preview", (function() {
			const e = () => {
				$(".post-preview").is(":visible") ? (ii(".post-preview"), oi(".post-body")) : setTimeout(e, 0)
			};
			e()
		})), $(".post-editor-header-action[title=Spoiler]").after('<li class="post-editor-header-action emoji-button" title="Emoji Picker"><i class="fa fa-smile-o"></i></li>'), $.getJSON("https://snippet.host/sgyddt/raw", (function(e) {
			const t = {
					set: "twitter",
					skinTonePosition: "search",
					theme: $(".js-dark-switch .on").is(":visible") ? "dark" : "light",
					custom: e,
					categories: ["frequent", "custom", "teams", "agents", "people", "nature", "foods", "activity", "places", "objects", "symbols", "flags"],
					onEmojiSelect: function(e, t) {
						if (r) {
							const t = r,
								n = t.val(),
								i = t.prop("selectionStart"),
								o = t.prop("selectionEnd"),
								d = `${n.substring(0,i)}${e.native?e.native:`:${e.id}:`} ${n.substring(o)}`;
							t.val(d).trigger("focus")
						}
						t.shiftKey || (o.destroy(), o = null, $("#popup").hide())
					},
					onClickOutside: function(e) {
						const t = null !== e.target.closest(".emoji-button");
						o && !t && (o.destroy(), o = null, $("#popup").hide())
					},
					onAddCustomEmoji: function() {
						d(), $.magnificPopup.open({
							items: {
								src: '\n        <div class="request-emoji-popup wf-card">\n          <h2>Request Custom Emojis</h2>\n          <p>To request a custom emoji, please join our Discord server or open a GitHub issue.</p>\n          <div>\n            <a class="btn mod-action" href="https://discord.gg/SqN4aY6aFE" target="_blank" onclick="$.magnificPopup.close();">\n              <svg width="24" height="24" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg">\n                <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" fill="white" />\n              </svg>DISCORD</a>\n            <a class="btn mod-action" href="https://github.com/StatsVLR" target="_blank" onclick="$.magnificPopup.close();">\n              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n                <path d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z" fill="white"></path>\n              </svg>GITHUB</a>\n          </div>\n        </div>',
								type: "inline"
							}
						})
					}
				},
				n = new ti(t);
			$(n).appendTo("body").attr("id", "popup"), $(".emoji-button")[1];
			const i = $("#popup")[0];
			let o = null,
				r = null;

			function d() {
				o ? (o.destroy(), o = null, $("#popup").hide()) : (o = ce(this, i, {
					placement: "top",
					modifiers: [{
						name: "offset",
						options: {
							offset: [0, 8]
						}
					}]
				}), $("#popup").show(), i.shadowRoot.querySelector("input").focus({
					preventScroll: !0
				}))
			}
			$(document).on("focus", ".post-editor-text", (function() {
				r = $(this)
			})), $(document).on("click", ".emoji-button", d)
		})), n(840), n(428), n(165), n(899), n(568);
		const ri = $(".post-header-author").first().text();
		$(".thread-header").is(":visible") && $(`.post-header-author:contains(${ri})`).after('<div class="badge-pill" title="Original Poster">OP</div>'), $(".thread-item-header-title, .select2-selection__rendered").removeAttr("title"),
			function(e, t) {
				var n, i, o, r = [],
					d = [],
					s = !1,
					a = t.target,
					u = (n = t, i = ["target"], o = Object.assign({}, n), i.forEach((function(e) {
						delete o[e]
					})), o),
					c = Object.assign({}, u, {
						trigger: "manual",
						touch: !1
					}),
					l = Object.assign({
						touch: Be.touch
					}, u, {
						showOnCreate: !0
					});

				function f(e) {
					if (e.target && !s) {
						var n = e.target.closest(a);
						if (n) {
							var i = n.getAttribute("data-tippy-trigger") || t.trigger || Be.trigger;
							if (!n._tippy && !("touchstart" === e.type && "boolean" == typeof l.touch || "touchstart" !== e.type && i.indexOf(Xe[e.type]) < 0)) {
								var o = Ye(n, l);
								o && (d = d.concat(o))
							}
						}
					}
				}

				function p(e, t, n, i) {
					void 0 === i && (i = !1), e.addEventListener(t, n, i), r.push({
						node: e,
						eventType: t,
						handler: n,
						options: i
					})
				}
				_e(Ye(e, c)).forEach((function(e) {
					var t = e.destroy,
						n = e.enable,
						i = e.disable;
					e.destroy = function(e) {
							void 0 === e && (e = !0), e && d.forEach((function(e) {
								e.destroy()
							})), d = [], r.forEach((function(e) {
								var t = e.node,
									n = e.eventType,
									i = e.handler,
									o = e.options;
								t.removeEventListener(n, i, o)
							})), r = [], t()
						}, e.enable = function() {
							n(), d.forEach((function(e) {
								return e.enable()
							})), s = !1
						}, e.disable = function() {
							i(), d.forEach((function(e) {
								return e.disable()
							})), s = !0
						},
						function(e) {
							var t = e.reference;
							p(t, "touchstart", f, me), p(t, "mouseover", f), p(t, "focusin", f), p(t, "click", f)
						}(e)
				}))
			}(document.body, {
				target: '[title]:not([title=""]):not(iframe)',
				content: e => {
					const t = e.getAttribute("title");
					return e.setAttribute("title", ""), t
				},
				theme: "translucent",
				arrow: '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>',
				allowHTML: !0
			}), $(".bracket-item-team-name").hover((function() {
				const e = $(this).text().trim();
				"" !== e && $(`.bracket-item-team-name:contains("${e}")`).parent().css({
					"background-color": "steelblue",
					color: "#333",
					"font-weight": "700"
				})
			}), (function() {
				const e = $(this).text().trim();
				"" !== e && $(`.bracket-item-team-name:contains("${e}")`).parent().css({
					"background-color": "",
					color: "",
					"font-weight": ""
				})
			})), $.get("https://snippet.host/wfrgud/raw", (function(e) {
				$(".js-home-threads").after(e), $(".bettervlr-unread").each((function() {
					const e = $(this).text().replace(/\s+/g, " ").trim(),
						t = JSON.parse(localStorage.getItem("changelog_read")) || {};
					t[e] ? $(this).removeClass("bettervlr-unread") : $(this).on("click", (function() {
						$(this).removeClass("bettervlr-unread"), t[e] = "read", localStorage.setItem("changelog_read", JSON.stringify(t))
					}))
				}))
			})), window.location.href.startsWith("https://www.vlr.gg/settings/flair") && ($(".form-label:first").before('<input id="flairs" type="text" placeholder="Search...">'), $("input#flairs").on("input", (function() {
				var e = $(this).val().trim().toLowerCase();
				$(".form-label:not(:last)").next().children().filter((function() {
					$(this).toggle($(this).text().toLowerCase().indexOf(e) > -1)
				})), $(".form-label").each((function() {
					$(this).next().children().children(":visible").length < 1 ? ($(this).hide(), $(this).next().css("margin-bottom", "0px")) : ($(this).show(), $(this).next().css("margin-bottom", "10px"))
				}))
			})), $("label").each((function() {
				var e = $(this).find("img").attr("src");
				$(this).attr("title", `<img src="${e}" style="width: 100%; max-width: 100px;">`)
			}))), $.extend(!0, $.magnificPopup.defaults, {
				tClose: "",
				gallery: {
					tPrev: "",
					tNext: ""
				}
			}), $(".btn.mod-page.mod-to-bottom").parent().prev().css({
				flex: "1",
				"white-space": "nowrap"
			}).append('\n<div class="wf-label comments-label" style="margin-right: 12px; padding: 0;">Sort by:</div>\n<select id="sort-posts" style="margin: 0px; min-width: 0px;">\n    <option value="default">Default</option>\n    <option value="upvotes">Upvotes</option>\n    <option value="comments">Comments</option>\n</select>'), window.location.search.includes("?view=linear") && $('#sort-posts option[value="comments"]').remove(), $("#sort-posts").change((function() {
				var e = $(this).val(),
					t = $(".post-container"),
					n = t.find(".threading:not(.threading .threading):not(:first)");
				"upvotes" === e ? n.sort((function(e, t) {
					var n = parseInt($(e).find(".post-frag-count").text().trim());
					return parseInt($(t).find(".post-frag-count").text().trim()) - n
				})) : "comments" === e ? n.sort((function(e, t) {
					var n = $(e).find(".threading").length;
					return $(t).find(".threading").length - n
				})) : "default" === e && location.reload(), n.detach().appendTo(t)
			}))
	})()
})();
