(function (a) {
    function b(a, b) {
        return "function" == typeof a ? a.call(b) : a
    }

    function c(b, c) {
        this.$element = a(b);
        this.options = c;
        this.enabled = !0;
        this.fixTitle()
    }

    c.prototype = {
        show: function () {
            var c = this.getTitle();
            if (c && this.enabled) {
                var e = this.tip();
                e.find(".tipsy-inner")[this.options.html ? "html" : "text"](c);
                e[0].className = "tipsy";
                e.remove().css({
                    top: 0,
                    left: 0,
                    visibility: "hidden",
                    display: "block"
                }).prependTo(document.body);
                var c = a.extend({}, this.$element.offset(), {
                        width: this.$element[0].offsetWidth,
                        height: this.$element[0].offsetHeight
                    }),
                    f = e[0].offsetWidth,
                    h = e[0].offsetHeight,
                    k = b(this.options.gravity, this.$element[0]),
                    m;
                switch (k.charAt(0)) {
                    case "n":
                        m = {
                            top: c.top + c.height + this.options.offset,
                            left: c.left + c.width / 2 - f / 2
                        };
                        break;
                    case "s":
                        m = {
                            top: c.top - h - this.options.offset,
                            left: c.left + c.width / 2 - f / 2
                        };
                        break;
                    case "e":
                        m = {
                            top: c.top + c.height / 2 - h / 2,
                            left: c.left - f - this.options.offset
                        };
                        break;
                    case "w":
                        m = {
                            top: c.top + c.height / 2 - h / 2,
                            left: c.left + c.width + this.options.offset
                        }
                }
                2 == k.length && ("w" == k.charAt(1) ? m.left = c.left + c.width / 2 - 15 : m.left = c.left + c.width /
                    2 - f + 15);
                e.css(m).addClass("tipsy-" + k);
                e.find(".tipsy-arrow")[0].className = "tipsy-arrow tipsy-arrow-" + k.charAt(0);
                this.options.className && e.addClass(b(this.options.className, this.$element[0]));
                this.options.fade ? e.stop().css({
                    opacity: 0,
                    display: "block",
                    visibility: "visible"
                }).animate({
                    opacity: this.options.opacity
                }) : e.css({
                    visibility: "visible",
                    opacity: this.options.opacity
                })
            }
        },
        hide: function () {
            this.options.fade ? this.tip().stop().fadeOut(function () {
                a(this).remove()
            }) : this.tip().remove()
        },
        fixTitle: function () {
            var a =
                this.$element;
            (a.attr("title") || "string" != typeof a.attr("original-title")) && a.attr("original-title", a.attr("title") || "").removeAttr("title")
        },
        getTitle: function () {
            var a,
                b = this.$element,
                c = this.options;
            this.fixTitle();
            c = this.options;
            "string" == typeof c.title ? a = b.attr("title" == c.title ? "original-title" : c.title) : "function" == typeof c.title && (a = c.title.call(b[0]));
            return (a = ("" + a).replace(/(^\s*|\s*$)/, "")) || c.fallback
        },
        tip: function () {
            this.$tip || (this.$tip = a('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>'),
                this.$tip.data("tipsy-pointee", this.$element[0]));
            return this.$tip
        },
        validate: function () {
            this.$element[0].parentNode || (this.hide(), this.options = this.$element = null)
        },
        enable: function () {
            this.enabled = !0
        },
        disable: function () {
            this.enabled = !1
        },
        toggleEnabled: function () {
            this.enabled = !this.enabled
        }
    };
    a.fn.tipsy = function (b) {
        function e(e) {
            var f = a.data(e, "tipsy");
            f || (f = new c(e, a.fn.tipsy.elementOptions(e, b)), a.data(e, "tipsy", f));
            return f
        }

        function f() {
            var a = e(this);
            a.hoverState = "in";
            0 == b.delayIn ? a.show() : (a.fixTitle(),
                setTimeout(function () {
                    "in" == a.hoverState && a.show()
                }, b.delayIn))
        }

        function h() {
            var a = e(this);
            a.hoverState = "out";
            0 == b.delayOut ? a.hide() : setTimeout(function () {
                "out" == a.hoverState && a.hide()
            }, b.delayOut)
        }

        if (!0 === b)
            return this.data("tipsy");
        if ("string" == typeof b) {
            var k = this.data("tipsy");
            if (k)
                k[b]();
            return this
        }
        b = a.extend({}, a.fn.tipsy.defaults, b);
        b.live || this.each(function () {
            e(this)
        });
        if ("manual" != b.trigger) {
            var k = b.live ? "live" : "bind",
                m = "hover" == b.trigger ? "mouseleave" : "blur";
            this[k]("hover" == b.trigger ?
                "mouseenter" : "focus", f)[k](m, h)
        }
        return this
    };
    a.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: !1,
        fallback: "",
        gravity: "n",
        html: !1,
        live: !1,
        offset: 0,
        opacity: 0.8,
        title: "title",
        trigger: "hover"
    };
    a.fn.tipsy.revalidate = function () {
        a(".tipsy").each(function () {
            var b = a.data(this, "tipsy-pointee"),
                c;
            if (!(c = !b)) {
                a : {
                    for (; b = b.parentNode;)
                        if (b == document) {
                            b = !0;
                            break a
                        }
                    b = !1
                }
                c = !b
            }
            c && a(this).remove()
        })
    };
    a.fn.tipsy.elementOptions = function (b, c) {
        return a.metadata ? a.extend({}, c, a(b).metadata()) : c
    };
    a.fn.tipsy.autoNS =
        function () {
            return a(this).offset().top > a(document).scrollTop() + a(window).height() / 2 ? "s" : "n"
        };
    a.fn.tipsy.autoWE = function () {
        return a(this).offset().left > a(document).scrollLeft() + a(window).width() / 2 ? "e" : "w"
    };
    a.fn.tipsy.autoBounds = function (b, c) {
        return function () {
            var f = c[0],
                h = 1 < c.length ? c[1] : !1,
                k = a(document).scrollTop() + b,
                m = a(document).scrollLeft() + b,
                n = a(this);
            n.offset().top < k && (f = "n");
            n.offset().left < m && (h = "w");
            a(window).width() + a(document).scrollLeft() - n.offset().left < b && (h = "e");
            a(window).height() + a(document).scrollTop() -
            n.offset().top < b && (f = "s");
            return f + (h ? h : "")
        }
    }
})(jQuery);