var jasmine = (function (R) {
  "use strict";
  const le = "",
    ue = "";
  /**
   * Sticky Sidebar JavaScript Plugin.
   * @version 3.3.1
   * @author Ahmed Bouhuolia <a.bouhuolia@gmail.com>
   * @license The MIT License (MIT)
   */ const W = (() => {
    const o = ".stickySidebar",
      f = {
        topSpacing: 0,
        bottomSpacing: 0,
        containerSelector: !1,
        innerWrapperSelector: ".inner-wrapper-sticky",
        stickyClass: "is-affixed",
        resizeSensor: !0,
        minWidth: !1,
      };
    class l {
      constructor(e, r = {}) {
        if (
          ((this.options = l.extend(f, r)),
          (this.sidebar = typeof e == "string" ? document.querySelector(e) : e),
          typeof this.sidebar > "u")
        )
          throw new Error("There is no specific sidebar element.");
        (this.sidebarInner = !1),
          (this.container = this.sidebar.parentElement),
          (this.affixedType = "STATIC"),
          (this.direction = "down"),
          (this.support = { transform: !1, transform3d: !1 }),
          (this._initialized = !1),
          (this._reStyle = !1),
          (this._breakpoint = !1),
          (this._resizeListeners = []),
          (this.dimensions = {
            translateY: 0,
            topSpacing: 0,
            lastTopSpacing: 0,
            bottomSpacing: 0,
            lastBottomSpacing: 0,
            sidebarHeight: 0,
            sidebarWidth: 0,
            containerTop: 0,
            containerHeight: 0,
            viewportHeight: 0,
            viewportTop: 0,
            lastViewportTop: 0,
          }),
          ["handleEvent"].forEach((n) => {
            this[n] = this[n].bind(this);
          }),
          this.initialize();
      }
      initialize() {
        if (
          (this._setSupportFeatures(),
          this.options.innerWrapperSelector &&
            ((this.sidebarInner = this.sidebar.querySelector(
              this.options.innerWrapperSelector,
            )),
            this.sidebarInner === null && (this.sidebarInner = !1)),
          !this.sidebarInner)
        ) {
          let e = document.createElement("div");
          for (
            e.setAttribute("class", "inner-wrapper-sticky"),
              this.sidebar.appendChild(e);
            this.sidebar.firstChild != e;

          )
            e.appendChild(this.sidebar.firstChild);
          this.sidebarInner = this.sidebar.querySelector(
            ".inner-wrapper-sticky",
          );
        }
        if (this.options.containerSelector) {
          let e = document.querySelectorAll(this.options.containerSelector);
          if (
            ((e = Array.prototype.slice.call(e)),
            e.forEach((r, n) => {
              r.contains(this.sidebar) && (this.container = r);
            }),
            !e.length)
          )
            throw new Error("The container does not contains on the sidebar.");
        }
        typeof this.options.topSpacing != "function" &&
          (this.options.topSpacing = parseInt(this.options.topSpacing) || 0),
          typeof this.options.bottomSpacing != "function" &&
            (this.options.bottomSpacing =
              parseInt(this.options.bottomSpacing) || 0),
          this._widthBreakpoint(),
          this.calcDimensions(),
          this.stickyPosition(),
          this.bindEvents(),
          (this._initialized = !0);
      }
      bindEvents() {
        window.addEventListener("resize", this, { passive: !0, capture: !1 }),
          window.addEventListener("scroll", this, { passive: !0, capture: !1 }),
          this.sidebar.addEventListener("update" + o, this),
          this.options.resizeSensor &&
            typeof ResizeSensor < "u" &&
            (new ResizeSensor(this.sidebarInner, this.handleEvent),
            new ResizeSensor(this.container, this.handleEvent));
      }
      handleEvent(e) {
        this.updateSticky(e);
      }
      calcDimensions() {
        if (!this._breakpoint) {
          var e = this.dimensions;
          (e.containerTop = l.offsetRelative(this.container).top),
            (e.containerHeight = this.container.clientHeight),
            (e.containerBottom = e.containerTop + e.containerHeight),
            (e.sidebarHeight = this.sidebarInner.offsetHeight),
            (e.sidebarWidth = this.sidebar.offsetWidth),
            (e.viewportHeight = window.innerHeight),
            this._calcDimensionsWithScroll();
        }
      }
      _calcDimensionsWithScroll() {
        var e = this.dimensions;
        (e.sidebarLeft = l.offsetRelative(this.sidebar).left),
          (e.viewportTop =
            document.documentElement.scrollTop || document.body.scrollTop),
          (e.viewportBottom = e.viewportTop + e.viewportHeight),
          (e.viewportLeft =
            document.documentElement.scrollLeft || document.body.scrollLeft),
          (e.topSpacing = this.options.topSpacing),
          (e.bottomSpacing = this.options.bottomSpacing),
          typeof e.topSpacing == "function" &&
            (e.topSpacing = parseInt(e.topSpacing(this.sidebar)) || 0),
          typeof e.bottomSpacing == "function" &&
            (e.bottomSpacing = parseInt(e.bottomSpacing(this.sidebar)) || 0),
          this.affixedType === "VIEWPORT-TOP"
            ? e.topSpacing < e.lastTopSpacing &&
              ((e.translateY += e.lastTopSpacing - e.topSpacing),
              (this._reStyle = !0))
            : this.affixedType === "VIEWPORT-BOTTOM" &&
              e.bottomSpacing < e.lastBottomSpacing &&
              ((e.translateY += e.lastBottomSpacing - e.bottomSpacing),
              (this._reStyle = !0)),
          (e.lastTopSpacing = e.topSpacing),
          (e.lastBottomSpacing = e.bottomSpacing);
      }
      isSidebarFitsViewport() {
        return this.dimensions.sidebarHeight < this.dimensions.viewportHeight;
      }
      observeScrollDir() {
        var e = this.dimensions;
        if (e.lastViewportTop !== e.viewportTop) {
          var r = this.direction === "down" ? Math.min : Math.max;
          e.viewportTop === r(e.viewportTop, e.lastViewportTop) &&
            (this.direction = this.direction === "down" ? "up" : "down");
        }
      }
      getAffixType() {
        var e = this.dimensions,
          r = !1;
        this._calcDimensionsWithScroll();
        var n = e.sidebarHeight + e.containerTop,
          t = e.viewportTop + e.topSpacing,
          s = e.viewportBottom - e.bottomSpacing;
        return (
          this.direction === "up"
            ? t <= e.containerTop
              ? ((e.translateY = 0), (r = "STATIC"))
              : t <= e.translateY + e.containerTop
                ? ((e.translateY = t - e.containerTop), (r = "VIEWPORT-TOP"))
                : !this.isSidebarFitsViewport() &&
                  e.containerTop <= t &&
                  (r = "VIEWPORT-UNBOTTOM")
            : this.isSidebarFitsViewport()
              ? e.sidebarHeight + t >= e.containerBottom
                ? ((e.translateY = e.containerBottom - n),
                  (r = "CONTAINER-BOTTOM"))
                : t >= e.containerTop &&
                  ((e.translateY = t - e.containerTop), (r = "VIEWPORT-TOP"))
              : e.containerBottom <= s
                ? ((e.translateY = e.containerBottom - n),
                  (r = "CONTAINER-BOTTOM"))
                : n + e.translateY <= s
                  ? ((e.translateY = s - n), (r = "VIEWPORT-BOTTOM"))
                  : e.containerTop + e.translateY <= t &&
                    (r = "VIEWPORT-UNBOTTOM"),
          (e.translateY = Math.max(0, e.translateY)),
          (e.translateY = Math.min(e.containerHeight, e.translateY)),
          (e.lastViewportTop = e.viewportTop),
          r
        );
      }
      _getStyle(e) {
        if (!(typeof e > "u")) {
          var r = { inner: {}, outer: {} },
            n = this.dimensions;
          switch (e) {
            case "VIEWPORT-TOP":
              r.inner = {
                position: "fixed",
                top: n.topSpacing,
                left: n.sidebarLeft - n.viewportLeft,
                width: n.sidebarWidth,
              };
              break;
            case "VIEWPORT-BOTTOM":
              r.inner = {
                position: "fixed",
                top: "auto",
                left: n.sidebarLeft,
                bottom: n.bottomSpacing,
                width: n.sidebarWidth,
              };
              break;
            case "CONTAINER-BOTTOM":
            case "VIEWPORT-UNBOTTOM":
              let t = this._getTranslate(0, n.translateY + "px");
              t
                ? (r.inner = { transform: t })
                : (r.inner = {
                    position: "absolute",
                    top: n.translateY,
                    width: n.sidebarWidth,
                  });
              break;
          }
          switch (e) {
            case "VIEWPORT-TOP":
            case "VIEWPORT-BOTTOM":
            case "VIEWPORT-UNBOTTOM":
            case "CONTAINER-BOTTOM":
              r.outer = { height: n.sidebarHeight, position: "relative" };
              break;
          }
          return (
            (r.outer = l.extend({ height: "", position: "" }, r.outer)),
            (r.inner = l.extend(
              {
                position: "relative",
                top: "",
                left: "",
                bottom: "",
                width: "",
                transform: this._getTranslate(),
              },
              r.inner,
            )),
            r
          );
        }
      }
      stickyPosition(e) {
        if (!this._breakpoint) {
          (e = this._reStyle || e || !1),
            this.options.topSpacing,
            this.options.bottomSpacing;
          var r = this.getAffixType(),
            n = this._getStyle(r);
          if ((this.affixedType != r || e) && r) {
            let t = "affix." + r.toLowerCase().replace("viewport-", "") + o;
            l.eventTrigger(this.sidebar, t),
              r === "STATIC"
                ? l.removeClass(this.sidebar, this.options.stickyClass)
                : l.addClass(this.sidebar, this.options.stickyClass);
            for (let d in n.outer)
              n.outer[d], (this.sidebar.style[d] = n.outer[d]);
            for (let d in n.inner) {
              let m = typeof n.inner[d] == "number" ? "px" : "";
              this.sidebarInner.style[d] = n.inner[d] + m;
            }
            let s = "affixed." + r.toLowerCase().replace("viewport-", "") + o;
            l.eventTrigger(this.sidebar, s);
          } else
            this._initialized && (this.sidebarInner.style.left = n.inner.left);
          this.affixedType = r;
        }
      }
      _widthBreakpoint() {
        window.innerWidth <= this.options.minWidth
          ? ((this._breakpoint = !0),
            (this.affixedType = "STATIC"),
            this.sidebar.removeAttribute("style"),
            l.removeClass(this.sidebar, this.options.stickyClass),
            this.sidebarInner.removeAttribute("style"))
          : (this._breakpoint = !1);
      }
      updateSticky(e = {}) {
        this._running ||
          ((this._running = !0),
          ((r) => {
            requestAnimationFrame(() => {
              switch (r) {
                case "scroll":
                  this._calcDimensionsWithScroll(),
                    this.observeScrollDir(),
                    this.stickyPosition();
                  break;
                case "resize":
                default:
                  this._widthBreakpoint(),
                    this.calcDimensions(),
                    this.stickyPosition(!0);
                  break;
              }
              this._running = !1;
            });
          })(e.type));
      }
      _setSupportFeatures() {
        var e = this.support;
        (e.transform = l.supportTransform()),
          (e.transform3d = l.supportTransform(!0));
      }
      _getTranslate(e = 0, r = 0, n = 0) {
        return this.support.transform3d
          ? "translate3d(" + e + ", " + r + ", " + n + ")"
          : this.support.translate
            ? "translate(" + e + ", " + r + ")"
            : !1;
      }
      destroy() {
        window.removeEventListener("resize", this, { caption: !1 }),
          window.removeEventListener("scroll", this, { caption: !1 }),
          this.sidebar.classList.remove(this.options.stickyClass),
          (this.sidebar.style.minHeight = ""),
          this.sidebar.removeEventListener("update" + o, this);
        var e = { inner: {}, outer: {} };
        (e.inner = {
          position: "",
          top: "",
          left: "",
          bottom: "",
          width: "",
          transform: "",
        }),
          (e.outer = { height: "", position: "" });
        for (let r in e.outer) this.sidebar.style[r] = e.outer[r];
        for (let r in e.inner) this.sidebarInner.style[r] = e.inner[r];
        this.options.resizeSensor &&
          typeof ResizeSensor < "u" &&
          (ResizeSensor.detach(this.sidebarInner, this.handleEvent),
          ResizeSensor.detach(this.container, this.handleEvent));
      }
      static supportTransform(e) {
        var r = !1,
          n = e ? "perspective" : "transform",
          t = n.charAt(0).toUpperCase() + n.slice(1),
          s = ["Webkit", "Moz", "O", "ms"],
          d = document.createElement("support"),
          m = d.style;
        return (
          (n + " " + s.join(t + " ") + t).split(" ").forEach(function (E, S) {
            if (m[E] !== void 0) return (r = E), !1;
          }),
          r
        );
      }
      static eventTrigger(e, r, n) {
        try {
          var t = new CustomEvent(r, { detail: n });
        } catch {
          var t = document.createEvent("CustomEvent");
          t.initCustomEvent(r, !0, !0, n);
        }
        e.dispatchEvent(t);
      }
      static extend(e, r) {
        var n = {};
        for (let t in e) typeof r[t] < "u" ? (n[t] = r[t]) : (n[t] = e[t]);
        return n;
      }
      static offsetRelative(e) {
        var r = { left: 0, top: 0 };
        do {
          let n = e.offsetTop,
            t = e.offsetLeft;
          isNaN(n) || (r.top += n),
            isNaN(t) || (r.left += t),
            (e = e.tagName === "BODY" ? e.parentElement : e.offsetParent);
        } while (e);
        return r;
      }
      static addClass(e, r) {
        l.hasClass(e, r) ||
          (e.classList ? e.classList.add(r) : (e.className += " " + r));
      }
      static removeClass(e, r) {
        l.hasClass(e, r) &&
          (e.classList
            ? e.classList.remove(r)
            : (e.className = e.className.replace(
                new RegExp(
                  "(^|\\b)" + r.split(" ").join("|") + "(\\b|$)",
                  "gi",
                ),
                " ",
              )));
      }
      static hasClass(e, r) {
        return e.classList
          ? e.classList.contains(r)
          : new RegExp("(^| )" + r + "( |$)", "gi").test(e.className);
      }
    }
    return l;
  })();
  window.StickySidebar = W;
  var j =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof self < "u"
            ? self
            : {};
  function Q(o) {
    return o &&
      o.__esModule &&
      Object.prototype.hasOwnProperty.call(o, "default")
      ? o.default
      : o;
  }
  var q = { exports: {} };
  (function (o) {
    var f =
      typeof window < "u"
        ? window
        : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope
          ? self
          : {};
    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */ var l = (function (g) {
      var e = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
        r = 0,
        n = {},
        t = {
          manual: g.Prism && g.Prism.manual,
          disableWorkerMessageHandler:
            g.Prism && g.Prism.disableWorkerMessageHandler,
          util: {
            encode: function i(a) {
              return a instanceof s
                ? new s(a.type, i(a.content), a.alias)
                : Array.isArray(a)
                  ? a.map(i)
                  : a
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/\u00a0/g, " ");
            },
            type: function (i) {
              return Object.prototype.toString.call(i).slice(8, -1);
            },
            objId: function (i) {
              return (
                i.__id || Object.defineProperty(i, "__id", { value: ++r }),
                i.__id
              );
            },
            clone: function i(a, u) {
              u = u || {};
              var c, p;
              switch (t.util.type(a)) {
                case "Object":
                  if (((p = t.util.objId(a)), u[p])) return u[p];
                  (c = {}), (u[p] = c);
                  for (var h in a) a.hasOwnProperty(h) && (c[h] = i(a[h], u));
                  return c;
                case "Array":
                  return (
                    (p = t.util.objId(a)),
                    u[p]
                      ? u[p]
                      : ((c = []),
                        (u[p] = c),
                        a.forEach(function (T, b) {
                          c[b] = i(T, u);
                        }),
                        c)
                  );
                default:
                  return a;
              }
            },
            getLanguage: function (i) {
              for (; i; ) {
                var a = e.exec(i.className);
                if (a) return a[1].toLowerCase();
                i = i.parentElement;
              }
              return "none";
            },
            setLanguage: function (i, a) {
              (i.className = i.className.replace(RegExp(e, "gi"), "")),
                i.classList.add("language-" + a);
            },
            currentScript: function () {
              if (typeof document > "u") return null;
              if ("currentScript" in document && 1 < 2)
                return document.currentScript;
              try {
                throw new Error();
              } catch (c) {
                var i = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(c.stack) ||
                  [])[1];
                if (i) {
                  var a = document.getElementsByTagName("script");
                  for (var u in a) if (a[u].src == i) return a[u];
                }
                return null;
              }
            },
            isActive: function (i, a, u) {
              for (var c = "no-" + a; i; ) {
                var p = i.classList;
                if (p.contains(a)) return !0;
                if (p.contains(c)) return !1;
                i = i.parentElement;
              }
              return !!u;
            },
          },
          languages: {
            plain: n,
            plaintext: n,
            text: n,
            txt: n,
            extend: function (i, a) {
              var u = t.util.clone(t.languages[i]);
              for (var c in a) u[c] = a[c];
              return u;
            },
            insertBefore: function (i, a, u, c) {
              c = c || t.languages;
              var p = c[i],
                h = {};
              for (var T in p)
                if (p.hasOwnProperty(T)) {
                  if (T == a)
                    for (var b in u) u.hasOwnProperty(b) && (h[b] = u[b]);
                  u.hasOwnProperty(T) || (h[T] = p[T]);
                }
              var y = c[i];
              return (
                (c[i] = h),
                t.languages.DFS(t.languages, function (v, N) {
                  N === y && v != i && (this[v] = h);
                }),
                h
              );
            },
            DFS: function i(a, u, c, p) {
              p = p || {};
              var h = t.util.objId;
              for (var T in a)
                if (a.hasOwnProperty(T)) {
                  u.call(a, T, a[T], c || T);
                  var b = a[T],
                    y = t.util.type(b);
                  y === "Object" && !p[h(b)]
                    ? ((p[h(b)] = !0), i(b, u, null, p))
                    : y === "Array" &&
                      !p[h(b)] &&
                      ((p[h(b)] = !0), i(b, u, T, p));
                }
            },
          },
          plugins: {},
          highlightAll: function (i, a) {
            t.highlightAllUnder(document, i, a);
          },
          highlightAllUnder: function (i, a, u) {
            var c = {
              callback: u,
              container: i,
              selector:
                'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
            };
            t.hooks.run("before-highlightall", c),
              (c.elements = Array.prototype.slice.apply(
                c.container.querySelectorAll(c.selector),
              )),
              t.hooks.run("before-all-elements-highlight", c);
            for (var p = 0, h; (h = c.elements[p++]); )
              t.highlightElement(h, a === !0, c.callback);
          },
          highlightElement: function (i, a, u) {
            var c = t.util.getLanguage(i),
              p = t.languages[c];
            t.util.setLanguage(i, c);
            var h = i.parentElement;
            h && h.nodeName.toLowerCase() === "pre" && t.util.setLanguage(h, c);
            var T = i.textContent,
              b = { element: i, language: c, grammar: p, code: T };
            function y(N) {
              (b.highlightedCode = N),
                t.hooks.run("before-insert", b),
                (b.element.innerHTML = b.highlightedCode),
                t.hooks.run("after-highlight", b),
                t.hooks.run("complete", b),
                u && u.call(b.element);
            }
            if (
              (t.hooks.run("before-sanity-check", b),
              (h = b.element.parentElement),
              h &&
                h.nodeName.toLowerCase() === "pre" &&
                !h.hasAttribute("tabindex") &&
                h.setAttribute("tabindex", "0"),
              !b.code)
            ) {
              t.hooks.run("complete", b), u && u.call(b.element);
              return;
            }
            if ((t.hooks.run("before-highlight", b), !b.grammar)) {
              y(t.util.encode(b.code));
              return;
            }
            if (a && g.Worker) {
              var v = new Worker(t.filename);
              (v.onmessage = function (N) {
                y(N.data);
              }),
                v.postMessage(
                  JSON.stringify({
                    language: b.language,
                    code: b.code,
                    immediateClose: !0,
                  }),
                );
            } else y(t.highlight(b.code, b.grammar, b.language));
          },
          highlight: function (i, a, u) {
            var c = { code: i, grammar: a, language: u };
            if ((t.hooks.run("before-tokenize", c), !c.grammar))
              throw new Error(
                'The language "' + c.language + '" has no grammar.',
              );
            return (
              (c.tokens = t.tokenize(c.code, c.grammar)),
              t.hooks.run("after-tokenize", c),
              s.stringify(t.util.encode(c.tokens), c.language)
            );
          },
          tokenize: function (i, a) {
            var u = a.rest;
            if (u) {
              for (var c in u) a[c] = u[c];
              delete a.rest;
            }
            var p = new E();
            return S(p, p.head, i), m(i, p, a, p.head, 0), k(p);
          },
          hooks: {
            all: {},
            add: function (i, a) {
              var u = t.hooks.all;
              (u[i] = u[i] || []), u[i].push(a);
            },
            run: function (i, a) {
              var u = t.hooks.all[i];
              if (!(!u || !u.length)) for (var c = 0, p; (p = u[c++]); ) p(a);
            },
          },
          Token: s,
        };
      g.Prism = t;
      function s(i, a, u, c) {
        (this.type = i),
          (this.content = a),
          (this.alias = u),
          (this.length = (c || "").length | 0);
      }
      s.stringify = function i(a, u) {
        if (typeof a == "string") return a;
        if (Array.isArray(a)) {
          var c = "";
          return (
            a.forEach(function (y) {
              c += i(y, u);
            }),
            c
          );
        }
        var p = {
            type: a.type,
            content: i(a.content, u),
            tag: "span",
            classes: ["token", a.type],
            attributes: {},
            language: u,
          },
          h = a.alias;
        h &&
          (Array.isArray(h)
            ? Array.prototype.push.apply(p.classes, h)
            : p.classes.push(h)),
          t.hooks.run("wrap", p);
        var T = "";
        for (var b in p.attributes)
          T +=
            " " +
            b +
            '="' +
            (p.attributes[b] || "").replace(/"/g, "&quot;") +
            '"';
        return (
          "<" +
          p.tag +
          ' class="' +
          p.classes.join(" ") +
          '"' +
          T +
          ">" +
          p.content +
          "</" +
          p.tag +
          ">"
        );
      };
      function d(i, a, u, c) {
        i.lastIndex = a;
        var p = i.exec(u);
        if (p && c && p[1]) {
          var h = p[1].length;
          (p.index += h), (p[0] = p[0].slice(h));
        }
        return p;
      }
      function m(i, a, u, c, p, h) {
        for (var T in u)
          if (!(!u.hasOwnProperty(T) || !u[T])) {
            var b = u[T];
            b = Array.isArray(b) ? b : [b];
            for (var y = 0; y < b.length; ++y) {
              if (h && h.cause == T + "," + y) return;
              var v = b[y],
                N = v.inside,
                V = !!v.lookbehind,
                X = !!v.greedy,
                ae = v.alias;
              if (X && !v.pattern.global) {
                var ie = v.pattern.toString().match(/[imsuy]*$/)[0];
                v.pattern = RegExp(v.pattern.source, ie + "g");
              }
              for (
                var K = v.pattern || v, A = c.next, _ = p;
                A !== a.tail && !(h && _ >= h.reach);
                _ += A.value.length, A = A.next
              ) {
                var C = A.value;
                if (a.length > i.length) return;
                if (!(C instanceof s)) {
                  var F = 1,
                    I;
                  if (X) {
                    if (((I = d(K, _, i, V)), !I || I.index >= i.length)) break;
                    var M = I.index,
                      se = I.index + I[0].length,
                      O = _;
                    for (O += A.value.length; M >= O; )
                      (A = A.next), (O += A.value.length);
                    if (((O -= A.value.length), (_ = O), A.value instanceof s))
                      continue;
                    for (
                      var D = A;
                      D !== a.tail && (O < se || typeof D.value == "string");
                      D = D.next
                    )
                      F++, (O += D.value.length);
                    F--, (C = i.slice(_, O)), (I.index -= _);
                  } else if (((I = d(K, 0, C, V)), !I)) continue;
                  var M = I.index,
                    B = I[0],
                    H = C.slice(0, M),
                    Z = C.slice(M + B.length),
                    $ = _ + C.length;
                  h && $ > h.reach && (h.reach = $);
                  var U = A.prev;
                  H && ((U = S(a, U, H)), (_ += H.length)), w(a, U, F);
                  var oe = new s(T, N ? t.tokenize(B, N) : B, ae, B);
                  if (((A = S(a, U, oe)), Z && S(a, A, Z), F > 1)) {
                    var G = { cause: T + "," + y, reach: $ };
                    m(i, a, u, A.prev, _, G),
                      h && G.reach > h.reach && (h.reach = G.reach);
                  }
                }
              }
            }
          }
      }
      function E() {
        var i = { value: null, prev: null, next: null },
          a = { value: null, prev: i, next: null };
        (i.next = a), (this.head = i), (this.tail = a), (this.length = 0);
      }
      function S(i, a, u) {
        var c = a.next,
          p = { value: u, prev: a, next: c };
        return (a.next = p), (c.prev = p), i.length++, p;
      }
      function w(i, a, u) {
        for (var c = a.next, p = 0; p < u && c !== i.tail; p++) c = c.next;
        (a.next = c), (c.prev = a), (i.length -= p);
      }
      function k(i) {
        for (var a = [], u = i.head.next; u !== i.tail; )
          a.push(u.value), (u = u.next);
        return a;
      }
      if (!g.document)
        return (
          g.addEventListener &&
            (t.disableWorkerMessageHandler ||
              g.addEventListener(
                "message",
                function (i) {
                  var a = JSON.parse(i.data),
                    u = a.language,
                    c = a.code,
                    p = a.immediateClose;
                  g.postMessage(t.highlight(c, t.languages[u], u)),
                    p && g.close();
                },
                !1,
              )),
          t
        );
      var L = t.util.currentScript();
      L &&
        ((t.filename = L.src),
        L.hasAttribute("data-manual") && (t.manual = !0));
      function P() {
        t.manual || t.highlightAll();
      }
      if (!t.manual) {
        var x = document.readyState;
        x === "loading" || (x === "interactive" && L && L.defer)
          ? document.addEventListener("DOMContentLoaded", P)
          : window.requestAnimationFrame
            ? window.requestAnimationFrame(P)
            : window.setTimeout(P, 16);
      }
      return t;
    })(f);
    o.exports && (o.exports = l), typeof j < "u" && (j.Prism = l);
  })(q);
  var J = q.exports;
  const ee = Q(J);
  (Prism.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0,
        greedy: !0,
      },
      { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0,
    },
    "class-name": {
      pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ },
    },
    keyword:
      /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/,
  }),
    (function (o) {
      var f =
          /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
        l = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,
        g = {
          pattern: RegExp(
            /(^|[^\w.])/.source + l + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source,
          ),
          lookbehind: !0,
          inside: {
            namespace: {
              pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
              inside: { punctuation: /\./ },
            },
            punctuation: /\./,
          },
        };
      (o.languages.java = o.languages.extend("clike", {
        string: {
          pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
          lookbehind: !0,
          greedy: !0,
        },
        "class-name": [
          g,
          {
            pattern: RegExp(
              /(^|[^\w.])/.source +
                l +
                /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/
                  .source,
            ),
            lookbehind: !0,
            inside: g.inside,
          },
          {
            pattern: RegExp(
              /(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/
                .source +
                l +
                /[A-Z]\w*\b/.source,
            ),
            lookbehind: !0,
            inside: g.inside,
          },
        ],
        keyword: f,
        function: [
          o.languages.clike.function,
          { pattern: /(::\s*)[a-z_]\w*/, lookbehind: !0 },
        ],
        number:
          /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
        operator: {
          pattern:
            /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
          lookbehind: !0,
        },
        constant: /\b[A-Z][A-Z_\d]+\b/,
      })),
        o.languages.insertBefore("java", "string", {
          "triple-quoted-string": {
            pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
            greedy: !0,
            alias: "string",
          },
          char: { pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/, greedy: !0 },
        }),
        o.languages.insertBefore("java", "class-name", {
          annotation: {
            pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
            lookbehind: !0,
            alias: "punctuation",
          },
          generics: {
            pattern:
              /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
            inside: {
              "class-name": g,
              keyword: f,
              punctuation: /[<>(),.:]/,
              operator: /[?&|]/,
            },
          },
          import: [
            {
              pattern: RegExp(
                /(\bimport\s+)/.source + l + /(?:[A-Z]\w*|\*)(?=\s*;)/.source,
              ),
              lookbehind: !0,
              inside: {
                namespace: g.inside.namespace,
                punctuation: /\./,
                operator: /\*/,
                "class-name": /\w+/,
              },
            },
            {
              pattern: RegExp(
                /(\bimport\s+static\s+)/.source +
                  l +
                  /(?:\w+|\*)(?=\s*;)/.source,
              ),
              lookbehind: !0,
              alias: "static",
              inside: {
                namespace: g.inside.namespace,
                static: /\b\w+$/,
                punctuation: /\./,
                operator: /\*/,
                "class-name": /\w+/,
              },
            },
          ],
          namespace: {
            pattern: RegExp(
              /(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(
                /<keyword>/g,
                function () {
                  return f.source;
                },
              ),
            ),
            lookbehind: !0,
            inside: { punctuation: /\./ },
          },
        });
    })(Prism),
    (Prism.languages.markup = {
      comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
      prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
      doctype: {
        pattern:
          /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
          "internal-subset": {
            pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
            lookbehind: !0,
            greedy: !0,
            inside: null,
          },
          string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
          punctuation: /^<!|>$|[[\]]/,
          "doctype-tag": /^DOCTYPE/i,
          name: /[^\s<>'"]+/,
        },
      },
      cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
      tag: {
        pattern:
          /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/,
            inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
          },
          "special-attr": [],
          "attr-value": {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
            inside: {
              punctuation: [
                { pattern: /^=/, alias: "attr-equals" },
                { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
              ],
            },
          },
          punctuation: /\/?>/,
          "attr-name": {
            pattern: /[^\s>\/]+/,
            inside: { namespace: /^[^\s>\/:]+:/ },
          },
        },
      },
      entity: [
        { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
        /&#x?[\da-f]{1,8};/i,
      ],
    }),
    (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
      Prism.languages.markup.entity),
    (Prism.languages.markup.doctype.inside["internal-subset"].inside =
      Prism.languages.markup),
    Prism.hooks.add("wrap", function (o) {
      o.type === "entity" &&
        (o.attributes.title = o.content.replace(/&amp;/, "&"));
    }),
    Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
      value: function (f, l) {
        var g = {};
        (g["language-" + l] = {
          pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
          lookbehind: !0,
          inside: Prism.languages[l],
        }),
          (g.cdata = /^<!\[CDATA\[|\]\]>$/i);
        var e = {
          "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: g },
        };
        e["language-" + l] = { pattern: /[\s\S]+/, inside: Prism.languages[l] };
        var r = {};
        (r[f] = {
          pattern: RegExp(
            /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
              /__/g,
              function () {
                return f;
              },
            ),
            "i",
          ),
          lookbehind: !0,
          greedy: !0,
          inside: e,
        }),
          Prism.languages.insertBefore("markup", "cdata", r);
      },
    }),
    Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
      value: function (o, f) {
        Prism.languages.markup.tag.inside["special-attr"].push({
          pattern: RegExp(
            /(^|["'\s])/.source +
              "(?:" +
              o +
              ")" +
              /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
            "i",
          ),
          lookbehind: !0,
          inside: {
            "attr-name": /^[^\s=]+/,
            "attr-value": {
              pattern: /=[\s\S]+/,
              inside: {
                value: {
                  pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                  lookbehind: !0,
                  alias: [f, "language-" + f],
                  inside: Prism.languages[f],
                },
                punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
              },
            },
          },
        });
      },
    }),
    (Prism.languages.html = Prism.languages.markup),
    (Prism.languages.mathml = Prism.languages.markup),
    (Prism.languages.svg = Prism.languages.markup),
    (Prism.languages.xml = Prism.languages.extend("markup", {})),
    (Prism.languages.ssml = Prism.languages.xml),
    (Prism.languages.atom = Prism.languages.xml),
    (Prism.languages.rss = Prism.languages.xml),
    (Prism.languages.javascript = Prism.languages.extend("clike", {
      "class-name": [
        Prism.languages.clike["class-name"],
        {
          pattern:
            /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
          lookbehind: !0,
        },
      ],
      keyword: [
        { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
        {
          pattern:
            /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
          lookbehind: !0,
        },
      ],
      function:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
      number: {
        pattern: RegExp(
          /(^|[^\w$])/.source +
            "(?:" +
            (/NaN|Infinity/.source +
              "|" +
              /0[bB][01]+(?:_[01]+)*n?/.source +
              "|" +
              /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
              "|" +
              /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
              "|" +
              /\d+(?:_\d+)*n/.source +
              "|" +
              /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                .source) +
            ")" +
            /(?![\w$])/.source,
        ),
        lookbehind: !0,
      },
      operator:
        /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
    })),
    (Prism.languages.javascript["class-name"][0].pattern =
      /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
    Prism.languages.insertBefore("javascript", "keyword", {
      regex: {
        pattern: RegExp(
          /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
            /\//.source +
            "(?:" +
            /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/
              .source +
            "|" +
            /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
              .source +
            ")" +
            /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/
              .source,
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          "regex-source": {
            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
            lookbehind: !0,
            alias: "language-regex",
            inside: Prism.languages.regex,
          },
          "regex-delimiter": /^\/|\/$/,
          "regex-flags": /^[a-z]+$/,
        },
      },
      "function-variable": {
        pattern:
          /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: "function",
      },
      parameter: [
        {
          pattern:
            /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
          lookbehind: !0,
          inside: Prism.languages.javascript,
        },
        {
          pattern:
            /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
          lookbehind: !0,
          inside: Prism.languages.javascript,
        },
        {
          pattern:
            /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
          lookbehind: !0,
          inside: Prism.languages.javascript,
        },
        {
          pattern:
            /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
          lookbehind: !0,
          inside: Prism.languages.javascript,
        },
      ],
      constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
    }),
    Prism.languages.insertBefore("javascript", "string", {
      hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
      "template-string": {
        pattern:
          /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: !0,
        inside: {
          "template-punctuation": { pattern: /^`|`$/, alias: "string" },
          interpolation: {
            pattern:
              /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
            lookbehind: !0,
            inside: {
              "interpolation-punctuation": {
                pattern: /^\$\{|\}$/,
                alias: "punctuation",
              },
              rest: Prism.languages.javascript,
            },
          },
          string: /[\s\S]+/,
        },
      },
      "string-property": {
        pattern:
          /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: !0,
        greedy: !0,
        alias: "property",
      },
    }),
    Prism.languages.insertBefore("javascript", "operator", {
      "literal-property": {
        pattern:
          /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: !0,
        alias: "property",
      },
    }),
    Prism.languages.markup &&
      (Prism.languages.markup.tag.addInlined("script", "javascript"),
      Prism.languages.markup.tag.addAttribute(
        /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
          .source,
        "javascript",
      )),
    (Prism.languages.js = Prism.languages.javascript),
    (function (o) {
      var f =
        /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
      (o.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
          pattern: RegExp(
            "@[\\w-](?:" +
              /[^;{\s"']|\s+(?!\s)/.source +
              "|" +
              f.source +
              ")*?" +
              /(?:;|(?=\s*\{))/.source,
          ),
          inside: {
            rule: /^@[\w-]+/,
            "selector-function-argument": {
              pattern:
                /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
              lookbehind: !0,
              alias: "selector",
            },
            keyword: {
              pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
              lookbehind: !0,
            },
          },
        },
        url: {
          pattern: RegExp(
            "\\burl\\((?:" +
              f.source +
              "|" +
              /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
              ")\\)",
            "i",
          ),
          greedy: !0,
          inside: {
            function: /^url/i,
            punctuation: /^\(|\)$/,
            string: { pattern: RegExp("^" + f.source + "$"), alias: "url" },
          },
        },
        selector: {
          pattern: RegExp(
            `(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` +
              f.source +
              ")*(?=\\s*\\{)",
          ),
          lookbehind: !0,
        },
        string: { pattern: f, greedy: !0 },
        property: {
          pattern:
            /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
          lookbehind: !0,
        },
        important: /!important\b/i,
        function: {
          pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
          lookbehind: !0,
        },
        punctuation: /[(){};:,]/,
      }),
        (o.languages.css.atrule.inside.rest = o.languages.css);
      var l = o.languages.markup;
      l &&
        (l.tag.addInlined("style", "css"), l.tag.addAttribute("style", "css"));
    })(Prism),
    (function (o) {
      function f(l, g) {
        return "___" + l.toUpperCase() + g + "___";
      }
      Object.defineProperties((o.languages["markup-templating"] = {}), {
        buildPlaceholders: {
          value: function (l, g, e, r) {
            if (l.language === g) {
              var n = (l.tokenStack = []);
              (l.code = l.code.replace(e, function (t) {
                if (typeof r == "function" && !r(t)) return t;
                for (
                  var s = n.length, d;
                  l.code.indexOf((d = f(g, s))) !== -1;

                )
                  ++s;
                return (n[s] = t), d;
              })),
                (l.grammar = o.languages.markup);
            }
          },
        },
        tokenizePlaceholders: {
          value: function (l, g) {
            if (l.language !== g || !l.tokenStack) return;
            l.grammar = o.languages[g];
            var e = 0,
              r = Object.keys(l.tokenStack);
            function n(t) {
              for (var s = 0; s < t.length && !(e >= r.length); s++) {
                var d = t[s];
                if (
                  typeof d == "string" ||
                  (d.content && typeof d.content == "string")
                ) {
                  var m = r[e],
                    E = l.tokenStack[m],
                    S = typeof d == "string" ? d : d.content,
                    w = f(g, m),
                    k = S.indexOf(w);
                  if (k > -1) {
                    ++e;
                    var L = S.substring(0, k),
                      P = new o.Token(
                        g,
                        o.tokenize(E, l.grammar),
                        "language-" + g,
                        E,
                      ),
                      x = S.substring(k + w.length),
                      i = [];
                    L && i.push.apply(i, n([L])),
                      i.push(P),
                      x && i.push.apply(i, n([x])),
                      typeof d == "string"
                        ? t.splice.apply(t, [s, 1].concat(i))
                        : (d.content = i);
                  }
                } else d.content && n(d.content);
              }
              return t;
            }
            n(l.tokens);
          },
        },
      });
    })(Prism),
    (function (o) {
      var f = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
        l = [
          { pattern: /\b(?:false|true)\b/i, alias: "boolean" },
          {
            pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
            greedy: !0,
            lookbehind: !0,
          },
          /\b(?:null)\b/i,
          /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/,
        ],
        g =
          /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
        e =
          /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
        r = /[{}\[\](),:;]/;
      o.languages.php = {
        delimiter: {
          pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
          alias: "important",
        },
        comment: f,
        variable: /\$+(?:\w+\b|(?=\{))/,
        package: {
          pattern:
            /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
          lookbehind: !0,
          inside: { punctuation: /\\/ },
        },
        "class-name-definition": {
          pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
          lookbehind: !0,
          alias: "class-name",
        },
        "function-definition": {
          pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
          lookbehind: !0,
          alias: "function",
        },
        keyword: [
          {
            pattern:
              /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
            alias: "type-casting",
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern:
              /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
            alias: "type-hint",
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern:
              /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
            alias: "return-type",
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern:
              /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
            alias: "type-declaration",
            greedy: !0,
          },
          {
            pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
            alias: "type-declaration",
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern: /\b(?:parent|self|static)(?=\s*::)/i,
            alias: "static-context",
            greedy: !0,
          },
          { pattern: /(\byield\s+)from\b/i, lookbehind: !0 },
          /\bclass\b/i,
          {
            pattern:
              /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
            lookbehind: !0,
          },
        ],
        "argument-name": {
          pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
          lookbehind: !0,
        },
        "class-name": [
          {
            pattern:
              /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
            greedy: !0,
            lookbehind: !0,
          },
          { pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i, greedy: !0 },
          {
            pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
            alias: "class-name-fully-qualified",
            greedy: !0,
            lookbehind: !0,
            inside: { punctuation: /\\/ },
          },
          {
            pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
            alias: "class-name-fully-qualified",
            greedy: !0,
            inside: { punctuation: /\\/ },
          },
          {
            pattern:
              /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
            alias: "class-name-fully-qualified",
            greedy: !0,
            lookbehind: !0,
            inside: { punctuation: /\\/ },
          },
          {
            pattern: /\b[a-z_]\w*(?=\s*\$)/i,
            alias: "type-declaration",
            greedy: !0,
          },
          {
            pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
            alias: ["class-name-fully-qualified", "type-declaration"],
            greedy: !0,
            inside: { punctuation: /\\/ },
          },
          {
            pattern: /\b[a-z_]\w*(?=\s*::)/i,
            alias: "static-context",
            greedy: !0,
          },
          {
            pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
            alias: ["class-name-fully-qualified", "static-context"],
            greedy: !0,
            inside: { punctuation: /\\/ },
          },
          {
            pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
            alias: "type-hint",
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
            alias: ["class-name-fully-qualified", "type-hint"],
            greedy: !0,
            lookbehind: !0,
            inside: { punctuation: /\\/ },
          },
          {
            pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
            alias: "return-type",
            greedy: !0,
            lookbehind: !0,
          },
          {
            pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
            alias: ["class-name-fully-qualified", "return-type"],
            greedy: !0,
            lookbehind: !0,
            inside: { punctuation: /\\/ },
          },
        ],
        constant: l,
        function: {
          pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
          lookbehind: !0,
          inside: { punctuation: /\\/ },
        },
        property: { pattern: /(->\s*)\w+/, lookbehind: !0 },
        number: g,
        operator: e,
        punctuation: r,
      };
      var n = {
          pattern:
            /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
          lookbehind: !0,
          inside: o.languages.php,
        },
        t = [
          {
            pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
            alias: "nowdoc-string",
            greedy: !0,
            inside: {
              delimiter: {
                pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                alias: "symbol",
                inside: { punctuation: /^<<<'?|[';]$/ },
              },
            },
          },
          {
            pattern:
              /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
            alias: "heredoc-string",
            greedy: !0,
            inside: {
              delimiter: {
                pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                alias: "symbol",
                inside: { punctuation: /^<<<"?|[";]$/ },
              },
              interpolation: n,
            },
          },
          {
            pattern: /`(?:\\[\s\S]|[^\\`])*`/,
            alias: "backtick-quoted-string",
            greedy: !0,
          },
          {
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            alias: "single-quoted-string",
            greedy: !0,
          },
          {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            alias: "double-quoted-string",
            greedy: !0,
            inside: { interpolation: n },
          },
        ];
      o.languages.insertBefore("php", "variable", {
        string: t,
        attribute: {
          pattern:
            /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
          greedy: !0,
          inside: {
            "attribute-content": {
              pattern: /^(#\[)[\s\S]+(?=\]$)/,
              lookbehind: !0,
              inside: {
                comment: f,
                string: t,
                "attribute-class-name": [
                  {
                    pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                    alias: "class-name",
                    greedy: !0,
                    lookbehind: !0,
                  },
                  {
                    pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                    alias: ["class-name", "class-name-fully-qualified"],
                    greedy: !0,
                    lookbehind: !0,
                    inside: { punctuation: /\\/ },
                  },
                ],
                constant: l,
                number: g,
                operator: e,
                punctuation: r,
              },
            },
            delimiter: { pattern: /^#\[|\]$/, alias: "punctuation" },
          },
        },
      }),
        o.hooks.add("before-tokenize", function (s) {
          if (/<\?/.test(s.code)) {
            var d =
              /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g;
            o.languages["markup-templating"].buildPlaceholders(s, "php", d);
          }
        }),
        o.hooks.add("after-tokenize", function (s) {
          o.languages["markup-templating"].tokenizePlaceholders(s, "php");
        });
    })(Prism),
    (Prism.languages.sql = {
      comment: {
        pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
        lookbehind: !0,
      },
      variable: [
        { pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/, greedy: !0 },
        /@[\w.$]+/,
      ],
      string: {
        pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
        greedy: !0,
        lookbehind: !0,
      },
      identifier: {
        pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /^`|`$/ },
      },
      function:
        /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
      keyword:
        /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
      boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
      number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
      operator:
        /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
      punctuation: /[;[\]()`,.]/,
    }),
    (Prism.languages.c = Prism.languages.extend("clike", {
      comment: {
        pattern:
          /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0,
      },
      string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
      "class-name": {
        pattern:
          /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
        lookbehind: !0,
      },
      keyword:
        /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
      function: /\b[a-z_]\w*(?=\s*\()/i,
      number:
        /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
      operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
    })),
    Prism.languages.insertBefore("c", "string", {
      char: { pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/, greedy: !0 },
    }),
    Prism.languages.insertBefore("c", "string", {
      macro: {
        pattern:
          /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: !0,
        greedy: !0,
        alias: "property",
        inside: {
          string: [
            { pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0 },
            Prism.languages.c.string,
          ],
          char: Prism.languages.c.char,
          comment: Prism.languages.c.comment,
          "macro-name": [
            { pattern: /(^#\s*define\s+)\w+\b(?!\()/i, lookbehind: !0 },
            {
              pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
              lookbehind: !0,
              alias: "function",
            },
          ],
          directive: {
            pattern: /^(#\s*)[a-z]+/,
            lookbehind: !0,
            alias: "keyword",
          },
          "directive-hash": /^#/,
          punctuation: /##|\\(?=[\r\n])/,
          expression: { pattern: /\S[\s\S]*/, inside: Prism.languages.c },
        },
      },
    }),
    Prism.languages.insertBefore("c", "function", {
      constant:
        /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
    }),
    delete Prism.languages.c.boolean,
    (Prism.languages.c = Prism.languages.extend("clike", {
      comment: {
        pattern:
          /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0,
      },
      string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
      "class-name": {
        pattern:
          /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
        lookbehind: !0,
      },
      keyword:
        /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
      function: /\b[a-z_]\w*(?=\s*\()/i,
      number:
        /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
      operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
    })),
    Prism.languages.insertBefore("c", "string", {
      char: { pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/, greedy: !0 },
    }),
    Prism.languages.insertBefore("c", "string", {
      macro: {
        pattern:
          /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: !0,
        greedy: !0,
        alias: "property",
        inside: {
          string: [
            { pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0 },
            Prism.languages.c.string,
          ],
          char: Prism.languages.c.char,
          comment: Prism.languages.c.comment,
          "macro-name": [
            { pattern: /(^#\s*define\s+)\w+\b(?!\()/i, lookbehind: !0 },
            {
              pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
              lookbehind: !0,
              alias: "function",
            },
          ],
          directive: {
            pattern: /^(#\s*)[a-z]+/,
            lookbehind: !0,
            alias: "keyword",
          },
          "directive-hash": /^#/,
          punctuation: /##|\\(?=[\r\n])/,
          expression: { pattern: /\S[\s\S]*/, inside: Prism.languages.c },
        },
      },
    }),
    Prism.languages.insertBefore("c", "function", {
      constant:
        /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
    }),
    delete Prism.languages.c.boolean,
    (function (o) {
      var f = /[*&][^\s[\]{},]+/,
        l =
          /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
        g =
          "(?:" +
          l.source +
          "(?:[ 	]+" +
          f.source +
          ")?|" +
          f.source +
          "(?:[ 	]+" +
          l.source +
          ")?)",
        e =
          /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(
            /<PLAIN>/g,
            function () {
              return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/
                .source;
            },
          ),
        r = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;
      function n(t, s) {
        s = (s || "").replace(/m/g, "") + "m";
        var d =
          /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source
            .replace(/<<prop>>/g, function () {
              return g;
            })
            .replace(/<<value>>/g, function () {
              return t;
            });
        return RegExp(d, s);
      }
      (o.languages.yaml = {
        scalar: {
          pattern: RegExp(
            /([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
              /<<prop>>/g,
              function () {
                return g;
              },
            ),
          ),
          lookbehind: !0,
          alias: "string",
        },
        comment: /#.*/,
        key: {
          pattern: RegExp(
            /((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source
              .replace(/<<prop>>/g, function () {
                return g;
              })
              .replace(/<<key>>/g, function () {
                return "(?:" + e + "|" + r + ")";
              }),
          ),
          lookbehind: !0,
          greedy: !0,
          alias: "atrule",
        },
        directive: {
          pattern: /(^[ \t]*)%.+/m,
          lookbehind: !0,
          alias: "important",
        },
        datetime: {
          pattern: n(
            /\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/
              .source,
          ),
          lookbehind: !0,
          alias: "number",
        },
        boolean: {
          pattern: n(/false|true/.source, "i"),
          lookbehind: !0,
          alias: "important",
        },
        null: {
          pattern: n(/null|~/.source, "i"),
          lookbehind: !0,
          alias: "important",
        },
        string: { pattern: n(r), lookbehind: !0, greedy: !0 },
        number: {
          pattern: n(
            /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/
              .source,
            "i",
          ),
          lookbehind: !0,
        },
        tag: l,
        important: f,
        punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
      }),
        (o.languages.yml = o.languages.yaml);
    })(Prism),
    (Prism.languages.json = {
      property: {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        lookbehind: !0,
        greedy: !0,
      },
      string: {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        lookbehind: !0,
        greedy: !0,
      },
      comment: { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: !0 },
      number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
      punctuation: /[{}[\],]/,
      operator: /:/,
      boolean: /\b(?:false|true)\b/,
      null: { pattern: /\bnull\b/, alias: "keyword" },
    }),
    (Prism.languages.webmanifest = Prism.languages.json),
    (Prism.languages.go = Prism.languages.extend("clike", {
      string: {
        pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
        lookbehind: !0,
        greedy: !0,
      },
      keyword:
        /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
      boolean: /\b(?:_|false|iota|nil|true)\b/,
      number: [
        /\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
        /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
        /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i,
      ],
      operator:
        /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
      builtin:
        /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/,
    })),
    Prism.languages.insertBefore("go", "string", {
      char: { pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/, greedy: !0 },
    }),
    delete Prism.languages.go["class-name"],
    (function (o) {
      var f =
          "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",
        l = {
          pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
          lookbehind: !0,
          alias: "punctuation",
          inside: null,
        },
        g = {
          bash: l,
          environment: { pattern: RegExp("\\$" + f), alias: "constant" },
          variable: [
            {
              pattern: /\$?\(\([\s\S]+?\)\)/,
              greedy: !0,
              inside: {
                variable: [
                  { pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 },
                  /^\$\(\(/,
                ],
                number:
                  /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
                operator:
                  /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
                punctuation: /\(\(?|\)\)?|,|;/,
              },
            },
            {
              pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
              greedy: !0,
              inside: { variable: /^\$\(|^`|\)$|`$/ },
            },
            {
              pattern: /\$\{[^}]+\}/,
              greedy: !0,
              inside: {
                operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                punctuation: /[\[\]]/,
                environment: {
                  pattern: RegExp("(\\{)" + f),
                  lookbehind: !0,
                  alias: "constant",
                },
              },
            },
            /\$(?:\w+|[#?*!@$])/,
          ],
          entity:
            /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
        };
      (o.languages.bash = {
        shebang: { pattern: /^#!\s*\/.*/, alias: "important" },
        comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
        "function-name": [
          {
            pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
            lookbehind: !0,
            alias: "function",
          },
          { pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: "function" },
        ],
        "for-or-select": {
          pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
          alias: "variable",
          lookbehind: !0,
        },
        "assign-left": {
          pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
          inside: {
            environment: {
              pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + f),
              lookbehind: !0,
              alias: "constant",
            },
          },
          alias: "variable",
          lookbehind: !0,
        },
        parameter: {
          pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
          alias: "variable",
          lookbehind: !0,
        },
        string: [
          {
            pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
            lookbehind: !0,
            greedy: !0,
            inside: g,
          },
          {
            pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
            lookbehind: !0,
            greedy: !0,
            inside: { bash: l },
          },
          {
            pattern:
              /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
            lookbehind: !0,
            greedy: !0,
            inside: g,
          },
          { pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0 },
          {
            pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
            greedy: !0,
            inside: { entity: g.entity },
          },
        ],
        environment: { pattern: RegExp("\\$?" + f), alias: "constant" },
        variable: g.variable,
        function: {
          pattern:
            /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
          lookbehind: !0,
        },
        keyword: {
          pattern:
            /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
          lookbehind: !0,
        },
        builtin: {
          pattern:
            /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
          lookbehind: !0,
          alias: "class-name",
        },
        boolean: {
          pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
          lookbehind: !0,
        },
        "file-descriptor": { pattern: /\B&\d\b/, alias: "important" },
        operator: {
          pattern:
            /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
          inside: { "file-descriptor": { pattern: /^\d/, alias: "important" } },
        },
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        number: {
          pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
          lookbehind: !0,
        },
      }),
        (l.inside = o.languages.bash);
      for (
        var e = [
            "comment",
            "function-name",
            "for-or-select",
            "assign-left",
            "parameter",
            "string",
            "environment",
            "function",
            "keyword",
            "builtin",
            "boolean",
            "file-descriptor",
            "operator",
            "punctuation",
            "number",
          ],
          r = g.variable[1].inside,
          n = 0;
        n < e.length;
        n++
      )
        r[e[n]] = o.languages.bash[e[n]];
      (o.languages.sh = o.languages.bash),
        (o.languages.shell = o.languages.bash);
    })(Prism),
    (Prism.languages.python = {
      comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0, greedy: !0 },
      "string-interpolation": {
        pattern:
          /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
        greedy: !0,
        inside: {
          interpolation: {
            pattern:
              /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
            lookbehind: !0,
            inside: {
              "format-spec": { pattern: /(:)[^:(){}]+(?=\}$)/, lookbehind: !0 },
              "conversion-option": {
                pattern: /![sra](?=[:}]$)/,
                alias: "punctuation",
              },
              rest: null,
            },
          },
          string: /[\s\S]+/,
        },
      },
      "triple-quoted-string": {
        pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
        greedy: !0,
        alias: "string",
      },
      string: {
        pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
        greedy: !0,
      },
      function: {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: !0,
      },
      "class-name": { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
      decorator: {
        pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
        lookbehind: !0,
        alias: ["annotation", "punctuation"],
        inside: { punctuation: /\./ },
      },
      keyword:
        /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
      builtin:
        /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
      boolean: /\b(?:False|None|True)\b/,
      number:
        /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
      operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
      punctuation: /[{}[\];(),.:]/,
    }),
    (Prism.languages.python[
      "string-interpolation"
    ].inside.interpolation.inside.rest = Prism.languages.python),
    (Prism.languages.py = Prism.languages.python);
  const ce = "";
  (function () {
    if (typeof Prism > "u" || typeof document > "u") return;
    var o = "line-numbers",
      f = /\n(?!$)/g,
      l = (Prism.plugins.lineNumbers = {
        getLine: function (n, t) {
          if (!(n.tagName !== "PRE" || !n.classList.contains(o))) {
            var s = n.querySelector(".line-numbers-rows");
            if (s) {
              var d = parseInt(n.getAttribute("data-start"), 10) || 1,
                m = d + (s.children.length - 1);
              t < d && (t = d), t > m && (t = m);
              var E = t - d;
              return s.children[E];
            }
          }
        },
        resize: function (n) {
          g([n]);
        },
        assumeViewportIndependence: !0,
      });
    function g(n) {
      if (
        ((n = n.filter(function (s) {
          var d = e(s),
            m = d["white-space"];
          return m === "pre-wrap" || m === "pre-line";
        })),
        n.length != 0)
      ) {
        var t = n
          .map(function (s) {
            var d = s.querySelector("code"),
              m = s.querySelector(".line-numbers-rows");
            if (!(!d || !m)) {
              var E = s.querySelector(".line-numbers-sizer"),
                S = d.textContent.split(f);
              E ||
                ((E = document.createElement("span")),
                (E.className = "line-numbers-sizer"),
                d.appendChild(E)),
                (E.innerHTML = "0"),
                (E.style.display = "block");
              var w = E.getBoundingClientRect().height;
              return (
                (E.innerHTML = ""),
                {
                  element: s,
                  lines: S,
                  lineHeights: [],
                  oneLinerHeight: w,
                  sizer: E,
                }
              );
            }
          })
          .filter(Boolean);
        t.forEach(function (s) {
          var d = s.sizer,
            m = s.lines,
            E = s.lineHeights,
            S = s.oneLinerHeight;
          (E[m.length - 1] = void 0),
            m.forEach(function (w, k) {
              if (w && w.length > 1) {
                var L = d.appendChild(document.createElement("span"));
                (L.style.display = "block"), (L.textContent = w);
              } else E[k] = S;
            });
        }),
          t.forEach(function (s) {
            for (
              var d = s.sizer, m = s.lineHeights, E = 0, S = 0;
              S < m.length;
              S++
            )
              m[S] === void 0 &&
                (m[S] = d.children[E++].getBoundingClientRect().height);
          }),
          t.forEach(function (s) {
            var d = s.sizer,
              m = s.element.querySelector(".line-numbers-rows");
            (d.style.display = "none"),
              (d.innerHTML = ""),
              s.lineHeights.forEach(function (E, S) {
                m.children[S].style.height = E + "px";
              });
          });
      }
    }
    function e(n) {
      return n
        ? window.getComputedStyle
          ? getComputedStyle(n)
          : n.currentStyle || null
        : null;
    }
    var r = void 0;
    window.addEventListener("resize", function () {
      (l.assumeViewportIndependence && r === window.innerWidth) ||
        ((r = window.innerWidth),
        g(Array.prototype.slice.call(document.querySelectorAll("pre." + o))));
    }),
      Prism.hooks.add("complete", function (n) {
        if (n.code) {
          var t = n.element,
            s = t.parentNode;
          if (
            !(!s || !/pre/i.test(s.nodeName)) &&
            !t.querySelector(".line-numbers-rows") &&
            Prism.util.isActive(t, o)
          ) {
            t.classList.remove(o), s.classList.add(o);
            var d = n.code.match(f),
              m = d ? d.length + 1 : 1,
              E,
              S = new Array(m + 1).join("<span></span>");
            (E = document.createElement("span")),
              E.setAttribute("aria-hidden", "true"),
              (E.className = "line-numbers-rows"),
              (E.innerHTML = S),
              s.hasAttribute("data-start") &&
                (s.style.counterReset =
                  "linenumber " +
                  (parseInt(s.getAttribute("data-start"), 10) - 1)),
              n.element.appendChild(E),
              g([s]),
              Prism.hooks.run("line-numbers", n);
          }
        }
      }),
      Prism.hooks.add("line-numbers", function (n) {
        (n.plugins = n.plugins || {}), (n.plugins.lineNumbers = !0);
      });
  })();
  const de = "";
  (function () {
    if (typeof Prism > "u" || typeof document > "u") return;
    var o = [],
      f = {},
      l = function () {};
    Prism.plugins.toolbar = {};
    var g = (Prism.plugins.toolbar.registerButton = function (n, t) {
      var s;
      if (
        (typeof t == "function"
          ? (s = t)
          : (s = function (d) {
              var m;
              return (
                typeof t.onClick == "function"
                  ? ((m = document.createElement("button")),
                    (m.type = "button"),
                    m.addEventListener("click", function () {
                      t.onClick.call(this, d);
                    }))
                  : typeof t.url == "string"
                    ? ((m = document.createElement("a")), (m.href = t.url))
                    : (m = document.createElement("span")),
                t.className && m.classList.add(t.className),
                (m.textContent = t.text),
                m
              );
            }),
        n in f)
      ) {
        console.warn(
          'There is a button with the key "' + n + '" registered already.',
        );
        return;
      }
      o.push((f[n] = s));
    });
    function e(n) {
      for (; n; ) {
        var t = n.getAttribute("data-toolbar-order");
        if (t != null)
          return (t = t.trim()), t.length ? t.split(/\s*,\s*/g) : [];
        n = n.parentElement;
      }
    }
    var r = (Prism.plugins.toolbar.hook = function (n) {
      var t = n.element.parentNode;
      if (
        !(!t || !/pre/i.test(t.nodeName)) &&
        !t.parentNode.classList.contains("code-toolbar")
      ) {
        var s = document.createElement("div");
        s.classList.add("code-toolbar"),
          t.parentNode.insertBefore(s, t),
          s.appendChild(t);
        var d = document.createElement("div");
        d.classList.add("toolbar");
        var m = o,
          E = e(n.element);
        E &&
          (m = E.map(function (S) {
            return f[S] || l;
          })),
          m.forEach(function (S) {
            var w = S(n);
            if (w) {
              var k = document.createElement("div");
              k.classList.add("toolbar-item"),
                k.appendChild(w),
                d.appendChild(k);
            }
          }),
          s.appendChild(d);
      }
    });
    g("label", function (n) {
      var t = n.element.parentNode;
      if (!(!t || !/pre/i.test(t.nodeName)) && t.hasAttribute("data-label")) {
        var s,
          d,
          m = t.getAttribute("data-label");
        try {
          d = document.querySelector("template#" + m);
        } catch {}
        return (
          d
            ? (s = d.content)
            : (t.hasAttribute("data-url")
                ? ((s = document.createElement("a")),
                  (s.href = t.getAttribute("data-url")))
                : (s = document.createElement("span")),
              (s.textContent = m)),
          s
        );
      }
    }),
      Prism.hooks.add("complete", r);
  })(),
    (function () {
      if (!(typeof Prism > "u" || typeof document > "u")) {
        if (!Prism.plugins.toolbar) {
          console.warn("Show Languages plugin loaded before Toolbar plugin.");
          return;
        }
        var o = {
          none: "Plain text",
          plain: "Plain text",
          plaintext: "Plain text",
          text: "Plain text",
          txt: "Plain text",
          html: "HTML",
          xml: "XML",
          svg: "SVG",
          mathml: "MathML",
          ssml: "SSML",
          rss: "RSS",
          css: "CSS",
          clike: "C-like",
          js: "JavaScript",
          abap: "ABAP",
          abnf: "ABNF",
          al: "AL",
          antlr4: "ANTLR4",
          g4: "ANTLR4",
          apacheconf: "Apache Configuration",
          apl: "APL",
          aql: "AQL",
          ino: "Arduino",
          arff: "ARFF",
          armasm: "ARM Assembly",
          "arm-asm": "ARM Assembly",
          art: "Arturo",
          asciidoc: "AsciiDoc",
          adoc: "AsciiDoc",
          aspnet: "ASP.NET (C#)",
          asm6502: "6502 Assembly",
          asmatmel: "Atmel AVR Assembly",
          autohotkey: "AutoHotkey",
          autoit: "AutoIt",
          avisynth: "AviSynth",
          avs: "AviSynth",
          "avro-idl": "Avro IDL",
          avdl: "Avro IDL",
          awk: "AWK",
          gawk: "GAWK",
          sh: "Shell",
          basic: "BASIC",
          bbcode: "BBcode",
          bbj: "BBj",
          bnf: "BNF",
          rbnf: "RBNF",
          bqn: "BQN",
          bsl: "BSL (1C:Enterprise)",
          oscript: "OneScript",
          csharp: "C#",
          cs: "C#",
          dotnet: "C#",
          cpp: "C++",
          cfscript: "CFScript",
          cfc: "CFScript",
          cil: "CIL",
          cilkc: "Cilk/C",
          "cilk-c": "Cilk/C",
          cilkcpp: "Cilk/C++",
          "cilk-cpp": "Cilk/C++",
          cilk: "Cilk/C++",
          cmake: "CMake",
          cobol: "COBOL",
          coffee: "CoffeeScript",
          conc: "Concurnas",
          csp: "Content-Security-Policy",
          "css-extras": "CSS Extras",
          csv: "CSV",
          cue: "CUE",
          dataweave: "DataWeave",
          dax: "DAX",
          django: "Django/Jinja2",
          jinja2: "Django/Jinja2",
          "dns-zone-file": "DNS zone file",
          "dns-zone": "DNS zone file",
          dockerfile: "Docker",
          dot: "DOT (Graphviz)",
          gv: "DOT (Graphviz)",
          ebnf: "EBNF",
          editorconfig: "EditorConfig",
          ejs: "EJS",
          etlua: "Embedded Lua templating",
          erb: "ERB",
          "excel-formula": "Excel Formula",
          xlsx: "Excel Formula",
          xls: "Excel Formula",
          fsharp: "F#",
          "firestore-security-rules": "Firestore security rules",
          ftl: "FreeMarker Template Language",
          gml: "GameMaker Language",
          gamemakerlanguage: "GameMaker Language",
          gap: "GAP (CAS)",
          gcode: "G-code",
          gdscript: "GDScript",
          gedcom: "GEDCOM",
          gettext: "gettext",
          po: "gettext",
          glsl: "GLSL",
          gn: "GN",
          gni: "GN",
          "linker-script": "GNU Linker Script",
          ld: "GNU Linker Script",
          "go-module": "Go module",
          "go-mod": "Go module",
          graphql: "GraphQL",
          hbs: "Handlebars",
          hs: "Haskell",
          hcl: "HCL",
          hlsl: "HLSL",
          http: "HTTP",
          hpkp: "HTTP Public-Key-Pins",
          hsts: "HTTP Strict-Transport-Security",
          ichigojam: "IchigoJam",
          "icu-message-format": "ICU Message Format",
          idr: "Idris",
          ignore: ".ignore",
          gitignore: ".gitignore",
          hgignore: ".hgignore",
          npmignore: ".npmignore",
          inform7: "Inform 7",
          javadoc: "JavaDoc",
          javadoclike: "JavaDoc-like",
          javastacktrace: "Java stack trace",
          jq: "JQ",
          jsdoc: "JSDoc",
          "js-extras": "JS Extras",
          json: "JSON",
          webmanifest: "Web App Manifest",
          json5: "JSON5",
          jsonp: "JSONP",
          jsstacktrace: "JS stack trace",
          "js-templates": "JS Templates",
          keepalived: "Keepalived Configure",
          kts: "Kotlin Script",
          kt: "Kotlin",
          kumir: "KuMir (КуМир)",
          kum: "KuMir (КуМир)",
          latex: "LaTeX",
          tex: "TeX",
          context: "ConTeXt",
          lilypond: "LilyPond",
          ly: "LilyPond",
          emacs: "Lisp",
          elisp: "Lisp",
          "emacs-lisp": "Lisp",
          llvm: "LLVM IR",
          log: "Log file",
          lolcode: "LOLCODE",
          magma: "Magma (CAS)",
          md: "Markdown",
          "markup-templating": "Markup templating",
          matlab: "MATLAB",
          maxscript: "MAXScript",
          mel: "MEL",
          metafont: "METAFONT",
          mongodb: "MongoDB",
          moon: "MoonScript",
          n1ql: "N1QL",
          n4js: "N4JS",
          n4jsd: "N4JS",
          "nand2tetris-hdl": "Nand To Tetris HDL",
          naniscript: "Naninovel Script",
          nani: "Naninovel Script",
          nasm: "NASM",
          neon: "NEON",
          nginx: "nginx",
          nsis: "NSIS",
          objectivec: "Objective-C",
          objc: "Objective-C",
          ocaml: "OCaml",
          opencl: "OpenCL",
          openqasm: "OpenQasm",
          qasm: "OpenQasm",
          parigp: "PARI/GP",
          objectpascal: "Object Pascal",
          psl: "PATROL Scripting Language",
          pcaxis: "PC-Axis",
          px: "PC-Axis",
          peoplecode: "PeopleCode",
          pcode: "PeopleCode",
          php: "PHP",
          phpdoc: "PHPDoc",
          "php-extras": "PHP Extras",
          "plant-uml": "PlantUML",
          plantuml: "PlantUML",
          plsql: "PL/SQL",
          powerquery: "PowerQuery",
          pq: "PowerQuery",
          mscript: "PowerQuery",
          powershell: "PowerShell",
          promql: "PromQL",
          properties: ".properties",
          protobuf: "Protocol Buffers",
          purebasic: "PureBasic",
          pbfasm: "PureBasic",
          purs: "PureScript",
          py: "Python",
          qsharp: "Q#",
          qs: "Q#",
          q: "Q (kdb+ database)",
          qml: "QML",
          rkt: "Racket",
          cshtml: "Razor C#",
          razor: "Razor C#",
          jsx: "React JSX",
          tsx: "React TSX",
          renpy: "Ren'py",
          rpy: "Ren'py",
          res: "ReScript",
          rest: "reST (reStructuredText)",
          robotframework: "Robot Framework",
          robot: "Robot Framework",
          rb: "Ruby",
          sas: "SAS",
          sass: "Sass (Sass)",
          scss: "Sass (SCSS)",
          "shell-session": "Shell session",
          "sh-session": "Shell session",
          shellsession: "Shell session",
          sml: "SML",
          smlnj: "SML/NJ",
          solidity: "Solidity (Ethereum)",
          sol: "Solidity (Ethereum)",
          "solution-file": "Solution file",
          sln: "Solution file",
          soy: "Soy (Closure Template)",
          sparql: "SPARQL",
          rq: "SPARQL",
          "splunk-spl": "Splunk SPL",
          sqf: "SQF: Status Quo Function (Arma 3)",
          sql: "SQL",
          stata: "Stata Ado",
          iecst: "Structured Text (IEC 61131-3)",
          supercollider: "SuperCollider",
          sclang: "SuperCollider",
          systemd: "Systemd configuration file",
          "t4-templating": "T4 templating",
          "t4-cs": "T4 Text Templates (C#)",
          t4: "T4 Text Templates (C#)",
          "t4-vb": "T4 Text Templates (VB)",
          tap: "TAP",
          tt2: "Template Toolkit 2",
          toml: "TOML",
          trickle: "trickle",
          troy: "troy",
          trig: "TriG",
          ts: "TypeScript",
          tsconfig: "TSConfig",
          uscript: "UnrealScript",
          uc: "UnrealScript",
          uorazor: "UO Razor Script",
          uri: "URI",
          url: "URL",
          vbnet: "VB.Net",
          vhdl: "VHDL",
          vim: "vim",
          "visual-basic": "Visual Basic",
          vba: "VBA",
          vb: "Visual Basic",
          wasm: "WebAssembly",
          "web-idl": "Web IDL",
          webidl: "Web IDL",
          wgsl: "WGSL",
          wiki: "Wiki markup",
          wolfram: "Wolfram language",
          nb: "Mathematica Notebook",
          wl: "Wolfram language",
          xeoracube: "XeoraCube",
          "xml-doc": "XML doc (.net)",
          xojo: "Xojo (REALbasic)",
          xquery: "XQuery",
          yaml: "YAML",
          yml: "YAML",
          yang: "YANG",
        };
        Prism.plugins.toolbar.registerButton("show-language", function (f) {
          var l = f.element.parentNode;
          if (!l || !/pre/i.test(l.nodeName)) return;
          function g(n) {
            return (
              n &&
              (n.substring(0, 1).toUpperCase() + n.substring(1)).replace(
                /s(?=cript)/,
                "S",
              )
            );
          }
          var e =
            l.getAttribute("data-language") || o[f.language] || g(f.language);
          if (e) {
            var r = document.createElement("span");
            return (r.textContent = e), r;
          }
        });
      }
    })(),
    (function () {
      if (typeof Prism > "u" || typeof document > "u") return;
      if (!Prism.plugins.toolbar) {
        console.warn("Copy to Clipboard plugin loaded before Toolbar plugin.");
        return;
      }
      function o(r, n) {
        r.addEventListener("click", function () {
          l(n);
        });
      }
      function f(r) {
        var n = document.createElement("textarea");
        (n.value = r.getText()),
          (n.style.top = "0"),
          (n.style.left = "0"),
          (n.style.position = "fixed"),
          document.body.appendChild(n),
          n.focus(),
          n.select();
        try {
          var t = document.execCommand("copy");
          setTimeout(function () {
            t ? r.success() : r.error();
          }, 1);
        } catch (s) {
          setTimeout(function () {
            r.error(s);
          }, 1);
        }
        document.body.removeChild(n);
      }
      function l(r) {
        navigator.clipboard
          ? navigator.clipboard
              .writeText(r.getText())
              .then(r.success, function () {
                f(r);
              })
          : f(r);
      }
      function g(r) {
        window.getSelection().selectAllChildren(r);
      }
      function e(r) {
        var n = {
            copy: "Copy",
            "copy-error": "Press Ctrl+C to copy",
            "copy-success": "Copied!",
            "copy-timeout": 5e3,
          },
          t = "data-prismjs-";
        for (var s in n) {
          for (var d = t + s, m = r; m && !m.hasAttribute(d); )
            m = m.parentElement;
          m && (n[s] = m.getAttribute(d));
        }
        return n;
      }
      Prism.plugins.toolbar.registerButton("copy-to-clipboard", function (r) {
        var n = r.element,
          t = e(n),
          s = document.createElement("button");
        (s.className = "copy-to-clipboard-button"),
          s.setAttribute("type", "button");
        var d = document.createElement("span");
        return (
          s.appendChild(d),
          E("copy"),
          o(s, {
            getText: function () {
              return n.textContent;
            },
            success: function () {
              E("copy-success"), m();
            },
            error: function () {
              E("copy-error"),
                setTimeout(function () {
                  g(n);
                }, 1),
                m();
            },
          }),
          s
        );
        function m() {
          setTimeout(function () {
            E("copy");
          }, t["copy-timeout"]);
        }
        function E(S) {
          (d.textContent = t[S]), s.setAttribute("data-copy-state", S);
        }
      });
    })();
  const pe = "";
  function te() {
    var o;
    (o = document.getElementById("search-input")) == null || o.blur();
  }
  function ne() {
    localStorage.theme === "light"
      ? (localStorage.theme = "dark")
      : localStorage.theme === "dark"
        ? (localStorage.theme = "light")
        : (localStorage.theme = "dark"),
      z();
  }
  function z() {
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }
  z(),
    ee.highlightAll(),
    console.log(
      "%c Jasmine ",
      "background:#000;color:#fff",
      "https://www.liaocp.cn/",
    ),
    (window.onload = () => {
      var o;
      new W("#sidebar-right", {
        innerWrapperSelector: ".sidebar__right__inner",
      }),
        Array.from(document.getElementsByClassName("nav-li")).forEach((f) => {
          f.addEventListener("mouseover", () => {
            f.getElementsByTagName("span")[0].classList.add("!block");
          }),
            f.addEventListener("mouseout", () => {
              f.getElementsByTagName("span")[0].classList.remove("!block");
            });
        }),
        (o = document.querySelector("#mobile-menus-bg")) == null ||
          o.addEventListener("click", () => {
            Y();
          });
    });
  function re() {
    (document.body.scrollTop = 0), (document.documentElement.scrollTop = 0);
  }
  function Y() {
    var f, l, g, e;
    document.querySelector("#mobile-menus").classList.contains("!translate-x-0")
      ? ((f = document.querySelector("#mobile-menus-bg")) == null ||
          f.classList.add("hidden"),
        (l = document.querySelector("#mobile-menus")) == null ||
          l.classList.remove("!translate-x-0"))
      : ((g = document.querySelector("#mobile-menus-bg")) == null ||
          g.classList.remove("hidden"),
        (e = document.querySelector("#mobile-menus")) == null ||
          e.classList.add("!translate-x-0"));
  }
  return (
    (R.backtop = re),
    (R.clickSearch = te),
    (R.loadTheme = z),
    (R.switchDark = ne),
    (R.toggleMobileMenu = Y),
    Object.defineProperty(R, Symbol.toStringTag, { value: "Module" }),
    R
  );
})({});
