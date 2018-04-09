(function (a) {
    function b(b, d) {
        var e,
            f;

        function h(b) {
            y.start = x ? b.pageX : b.pageY;
            b = parseInt(t.obj.css(w));
            e = "auto" == b ? 0 : b;
            a(document).bind("mousemove", n);
            document.ontouchmove = function (b) {
                a(document).unbind("mousemove");
                n(b.touches[0])
            };
            a(document).bind("mouseup", m);
            t.obj.bind("mouseup", m);
            t.obj[0].ontouchend = document.ontouchend = function (b) {
                a(document).unbind("mouseup");
                t.obj.unbind("mouseup");
                m(b.touches[0])
            };
            return !1
        }

        function k(a) {
            1 <= q.ratio || (v -= (a.wheelDelta ? a.wheelDelta / 120 : -a.detail / 3) * d.wheel, v =
                Math.min(q[d.axis] - p[d.axis], Math.max(0, v)), t.obj.css(w, v / r.ratio), q.obj.css(w, -v), a.preventDefault())
        }

        function m(b) {
            a(document).unbind("mousemove", n);
            a(document).unbind("mouseup", m);
            t.obj.unbind("mouseup", m);
            document.ontouchmove = t.obj[0].ontouchend = document.ontouchend = null;
            return !1
        }

        function n(a) {
            1 <= q.ratio || (f = Math.min(s[d.axis] - t[d.axis], Math.max(0, e + ((x ? a.pageX : a.pageY) - y.start))), v = f * r.ratio, q.obj.css(w, -v), t.obj.css(w, f));
            return !1
        }

        var p = {
                obj: a(".viewport", b)
            },
            q = {
                obj: a(".overview", b)
            },
            r = {
                obj: a(".scrollbar",
                    b)
            },
            s = {
                obj: a(".track", r.obj)
            },
            t = {
                obj: a(".thumb", r.obj)
            },
            x = "x" == d.axis,
            w = x ? "left" : "top",
            u = x ? "Width" : "Height",
            v;
        f = e = 0;
        var y = {};
        this.update = function (a) {
            p[d.axis] = p.obj[0]["offset" + u];
            q[d.axis] = q.obj[0]["scroll" + u];
            q.ratio = p[d.axis] / q[d.axis];
            r.obj.toggleClass("disable", 1 <= q.ratio);
            s[d.axis] = "auto" == d.size ? p[d.axis] : d.size;
            t[d.axis] = Math.min(s[d.axis], Math.max(d.min_thumb_size, "auto" == d.sizethumb ? s[d.axis] * q.ratio : d.sizethumb));
            r.ratio = (q[d.axis] - p[d.axis]) / (s[d.axis] - t[d.axis]);
            v = "relative" == a && 1 >= q.ratio ?
                Math.min(q[d.axis] - p[d.axis], Math.max(0, v)) : 0;
            v = "bottom" == a && 1 >= q.ratio ? q[d.axis] - p[d.axis] : isNaN(parseInt(a)) ? v : parseInt(a);
            t.obj.css(w, v / r.ratio);
            q.obj.css(w, -v);
            y.start = t.obj.offset()[w];
            a = u.toLowerCase();
            r.obj.css(a, s[d.axis]);
            s.obj.css(a, s[d.axis]);
            t.obj.css(a, t[d.axis]);
            Number(q.obj.css("height").slice(0, -2)) > Number(p.obj.css("height").slice(0, -2)) ? r.obj.show() : r.obj.hide()
        };
        this.isAtLastScrollLine = function () {
            return 1 <= q.ratio || v == q.obj[0]["scroll" + u] - p.obj[0]["offset" + u]
        };
        this.update();
        (function () {
            t.obj.bind("mousedown",
                h);
            t.obj[0].ontouchstart = function (a) {
                a.preventDefault();
                t.obj.unbind("mousedown");
                h(a.touches[0]);
                return !1
            };
            s.obj.bind("mouseup", n);
            d.scroll && this.addEventListener ? (b[0].addEventListener("DOMMouseScroll", k, !1), b[0].addEventListener("mousewheel", k, !1)) : d.scroll && (b[0].onmousewheel = k)
        })();
        return this
    }

    a.tiny = a.tiny || {};
    a.tiny.scrollbar = {
        options: {
            axis: "y",
            wheel: 40,
            scroll: !0,
            size: "auto",
            sizethumb: "auto",
            min_thumb_size: 20
        }
    };
    a.fn.tinyscrollbar = function (c) {
        c = a.extend({}, a.tiny.scrollbar.options, c);
        this.each(function () {
            a(this).data("tsb",
                new b(a(this), c))
        });
        return this
    };
    a.fn.tinyscrollbar_update = function (b) {
        return a(this).data("tsb").update(b)
    };
    a.fn.tinyscrollbar_isAtLastScrollLine = function () {
        return a(this).data("tsb").isAtLastScrollLine()
    }
})(jQuery);