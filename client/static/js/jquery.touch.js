(function (a) {
    function b(b, c) {
        if (!(1 < b.originalEvent.touches.length)) {
            var d = b.originalEvent.changedTouches[0],
                e = document.createEvent("MouseEvents");
            a(d.target).is("input") || a(d.target).is("textarea") ? b.stopPropagation() : b.preventDefault();
            e.initMouseEvent(c, !0, !0, window, 1, d.screenX, d.screenY, d.clientX, d.clientY, !1, !1, !1, !1, 0, null);
            b.target.dispatchEvent(e)
        }
    }

    a.support.touch = "ontouchend" in document;
    if (a.support.touch) {
        var c = a.ui.mouse.prototype,
            d = c._mouseInit,
            e = c._mouseDestroy,
            f;
        c._touchStart = function (a) {
            !f &&
            this._mouseCapture(a.originalEvent.changedTouches[0]) && (f = !0, this._touchMoved = !1, b(a, "mouseover"), b(a, "mousemove"), b(a, "mousedown"))
        };
        c._touchMove = function (a) {
            f && (this._touchMoved = !0, b(a, "mousemove"))
        };
        c._touchEnd = function (a) {
            f && (b(a, "mouseup"), b(a, "mouseout"), this._touchMoved || b(a, "click"), f = !1)
        };
        c._mouseInit = function () {
            this.element.bind({
                touchstart: a.proxy(this, "_touchStart"),
                touchmove: a.proxy(this, "_touchMove"),
                touchend: a.proxy(this, "_touchEnd")
            });
            d.call(this)
        };
        c._mouseDestroy = function () {
            this.element.unbind({
                touchstart: a.proxy(this,
                    "_touchStart"),
                touchmove: a.proxy(this, "_touchMove"),
                touchend: a.proxy(this, "_touchEnd")
            });
            e.call(this)
        }
    }
})(jQuery);