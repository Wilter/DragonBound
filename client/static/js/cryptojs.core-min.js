var CryptoJS = CryptoJS || function (a, b) {
    var c = {},
        d = c.lib = {},
        e = function () {
        },
        f = d.Base = {
            extend: function (a) {
                e.prototype = this;
                var b = new e;
                a && b.mixIn(a);
                b.hasOwnProperty("init") || (b.init = function () {
                    b.$super.init.apply(this, arguments)
                });
                b.init.prototype = b;
                b.$super = this;
                return b
            },
            create: function () {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function () {
            },
            mixIn: function (a) {
                for (var b in a)
                    a.hasOwnProperty(b) && (this[b] = a[b]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function () {
                return this.init.prototype.extend(this)
            }
        },
        h = d.WordArray = f.extend({
            init: function (a, d) {
                a = this.words = a || [];
                this.sigBytes = d != b ? d : 4 * a.length
            },
            toString: function (a) {
                return (a || m).stringify(this)
            },
            concat: function (a) {
                var b = this.words,
                    d = a.words,
                    c = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (c % 4)
                    for (var e = 0; e < a; e++)
                        b[c + e >>> 2] |= (d[e >>> 2] >>> 24 - e % 4 * 8 & 255) << 24 - (c + e) % 4 * 8;
                else if (65535 < d.length)
                    for (e = 0; e < a; e += 4)
                        b[c + e >>> 2] = d[e >>> 2];
                else
                    b.push.apply(b, d);
                this.sigBytes += a;
                return this
            },
            clamp: function () {
                var b = this.words,
                    d = this.sigBytes;
                b[d >>> 2] &= 4294967295 << 32 -
                    d % 4 * 8;
                b.length = a.ceil(d / 4)
            },
            clone: function () {
                var a = f.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function (b) {
                for (var d = [], c = 0; c < b; c += 4)
                    d.push(4294967296 * a.random() | 0);
                return new h.init(d, b)
            }
        }),
        k = c.enc = {},
        m = k.Hex = {
            stringify: function (a) {
                var b = a.words;
                a = a.sigBytes;
                for (var d = [], c = 0; c < a; c++) {
                    var e = b[c >>> 2] >>> 24 - c % 4 * 8 & 255;
                    d.push((e >>> 4).toString(16));
                    d.push((e & 15).toString(16))
                }
                return d.join("")
            },
            parse: function (a) {
                for (var b = a.length, d = [], c = 0; c < b; c += 2)
                    d[c >>> 3] |= parseInt(a.substr(c, 2), 16) <<
                        24 - c % 8 * 4;
                return new h.init(d, b / 2)
            }
        },
        n = k.Latin1 = {
            stringify: function (a) {
                var b = a.words;
                a = a.sigBytes;
                for (var d = [], c = 0; c < a; c++)
                    d.push(String.fromCharCode(b[c >>> 2] >>> 24 - c % 4 * 8 & 255));
                return d.join("")
            },
            parse: function (a) {
                for (var b = a.length, d = [], c = 0; c < b; c++)
                    d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - c % 4 * 8;
                return new h.init(d, b)
            }
        },
        p = k.Utf8 = {
            stringify: function (a) {
                try {
                    return decodeURIComponent(escape(n.stringify(a)))
                } catch (b) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function (a) {
                return n.parse(unescape(encodeURIComponent(a)))
            }
        },
        q = d.BufferedBlockAlgorithm = f.extend({
            reset: function () {
                this._data = new h.init;
                this._nDataBytes = 0
            },
            _append: function (a) {
                "string" == typeof a && (a = p.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function (b) {
                var c = this._data,
                    d = c.words,
                    e = c.sigBytes,
                    f = this.blockSize,
                    n = e / (4 * f),
                    n = b ? a.ceil(n) : a.max((n | 0) - this._minBufferSize, 0);
                b = n * f;
                e = a.min(4 * b, e);
                if (b) {
                    for (var m = 0; m < b; m += f)
                        this._doProcessBlock(d, m);
                    m = d.splice(0, b);
                    c.sigBytes -= e
                }
                return new h.init(m, e)
            },
            clone: function () {
                var a = f.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    d.Hasher = q.extend({
        cfg: f.extend(),
        init: function (a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function () {
            q.reset.call(this);
            this._doReset()
        },
        update: function (a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function (a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function (a) {
            return function (b, c) {
                return (new a.init(c)).finalize(b)
            }
        },
        _createHmacHelper: function (a) {
            return function (b, c) {
                return (new r.HMAC.init(a,
                    c)).finalize(b)
            }
        }
    });
    var r = c.algo = {};
    return c
}(Math);
(function (a) {
    for (var b = CryptoJS, c = b.lib, d = c.WordArray, e = c.Hasher, c = b.algo, f = [], h = [], k = function (a) {
        return 4294967296 * (a - (a | 0)) | 0
    }, m = 2, n = 0; 64 > n;) {
        var p;
        a : {
            p = m;
            for (var q = a.sqrt(p), r = 2; r <= q; r++)
                if (!(p % r)) {
                    p = !1;
                    break a
                }
            p = !0
        }
        p && (8 > n && (f[n] = k(a.pow(m, 0.5))), h[n] = k(a.pow(m, 1 / 3)), n++);
        m++
    }
    var s = [],
        c = c.SHA256 = e.extend({
            _doReset: function () {
                this._hash = new d.init(f.slice(0))
            },
            _doProcessBlock: function (a, b) {
                for (var c = this._hash.words, d = c[0], e = c[1], f = c[2], n = c[3], m = c[4], k = c[5], p = c[6], q = c[7], r = 0; 64 > r; r++) {
                    if (16 > r)
                        s[r] =
                            a[b + r] | 0;
                    else {
                        var A = s[r - 15],
                            D = s[r - 2];
                        s[r] = ((A << 25 | A >>> 7) ^ (A << 14 | A >>> 18) ^ A >>> 3) + s[r - 7] + ((D << 15 | D >>> 17) ^ (D << 13 | D >>> 19) ^ D >>> 10) + s[r - 16]
                    }
                    A = q + ((m << 26 | m >>> 6) ^ (m << 21 | m >>> 11) ^ (m << 7 | m >>> 25)) + (m & k ^ ~m & p) + h[r] + s[r];
                    D = ((d << 30 | d >>> 2) ^ (d << 19 | d >>> 13) ^ (d << 10 | d >>> 22)) + (d & e ^ d & f ^ e & f);
                    q = p;
                    p = k;
                    k = m;
                    m = n + A | 0;
                    n = f;
                    f = e;
                    e = d;
                    d = A + D | 0
                }
                c[0] = c[0] + d | 0;
                c[1] = c[1] + e | 0;
                c[2] = c[2] + f | 0;
                c[3] = c[3] + n | 0;
                c[4] = c[4] + m | 0;
                c[5] = c[5] + k | 0;
                c[6] = c[6] + p | 0;
                c[7] = c[7] + q | 0
            },
            _doFinalize: function () {
                var b = this._data,
                    c = b.words,
                    d = 8 * this._nDataBytes,
                    e = 8 * b.sigBytes;
                c[e >>> 5] |= 128 << 24 - e % 32;
                c[(e + 64 >>> 9 << 4) + 14] = a.floor(d / 4294967296);
                c[(e + 64 >>> 9 << 4) + 15] = d;
                b.sigBytes = 4 * c.length;
                this._process();
                return this._hash
            },
            clone: function () {
                var a = e.clone.call(this);
                a._hash = this._hash.clone();
                return a
            }
        });
    b.SHA256 = e._createHelper(c);
    b.HmacSHA256 = e._createHmacHelper(c)
})(Math);