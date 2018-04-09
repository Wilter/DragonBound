(function (a) {
	function b(a) {
		a = a.split(/\s/);
		return {
			X : a[0],
			Y : a[1]
		}
	}
	var c = a('<div style="background-position: 3px 5px">');
	a.support.backgroundPosition = "3px 5px" === c.css("backgroundPosition") ? !0 : !1;
	a.support.backgroundPositionXY = "3px" === c.css("backgroundPositionX") ? !0 : !1;
	var c = null,
	d = ["X", "Y"];
	!a.support.backgroundPosition && a.support.backgroundPositionXY && (a.cssHooks.backgroundPosition = {
			get : function (b, c, h) {
				return a.map(d, function (c, d) {
					return a.css(b, "backgroundPosition" + c)
				}).join(" ")
			},
			set : function (c, f) {
				a.each(d, function (a, d) {
					var m = b(f);
					c.style["backgroundPosition" + d] = m[d]
				})
			}
		});
	a.support.backgroundPosition && !a.support.backgroundPositionXY && a.each(d, function (c, d) {
		a.cssHooks["backgroundPosition" + d] = {
			get : function (c, e, m) {
				return b(a.css(c, "backgroundPosition"))[d]
			},
			set : function (c, e) {
				var m = b(a.css(c, "backgroundPosition")),
				n = "X" === d;
				c.style.backgroundPosition = (n ? e : m.X) + " " + (n ? m.Y : e)
			}
		};
		a.fx.step["backgroundPosition" + d] = function (b) {
			a.cssHooks["backgroundPosition" + d].set(b.elem, b.now + b.unit)
		}
	})
})(jQuery);

(function (a) {
	function b(b) {
		var c,
		d,
		e,
		f;
		a(b.style[a.cssProps.transform].replace(/(?:\,\s|\)|\()/g, "|").split(" ")).each(function (a, b) {
			"" !== b && (void 0 === c && (c = {}), d = b.split("|"), e = d.shift(), f = /.*[^XY]/.exec(e)[0], c[f] || (c[f] = "     ".split(" ")), /Y/.test(e) || (c[f][0] = d[0]), /X/.test(e) || (c[f][1] = d[1]), 6 == d.length && (c[f][2] = d[2], c[f][3] = d[3], c[f][4] = d[4], c[f][5] = d[5]))
		});
		return void 0 !== c ? c : null
	}

	function c(a) {
		if ("number" === typeof a)
			return parseFloat(a);
		if (-1 != a.indexOf("deg"))
			return parseInt(a, 10) * (2 *
				Math.PI / 360);
		if (-1 != a.indexOf("grad"))
			return parseInt(a, 10) * (Math.PI / 200)
	}

	function d(b, d) {
		var e,
		f,
		p = "matrixFilter" === a.cssProps.transformOrigin ? !0 : !1;
		e = [a.cssHooks.scaleX.get(b), c(a.cssHooks.skewY.get(b)), c(a.cssHooks.skewX.get(b)), a.cssHooks.scaleY.get(b), a.cssHooks.translateX.get(b), a.cssHooks.translateY.get(b)];
		if (p) {
			b.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=0,M21=0,M22=1,SizingMethod='auto expand')";
			var q = a.cssHooks.transformOriginX.get(b),
			r = a.cssHooks.transformOriginY.get(b),
			q = 0 < q.indexOf("%") ? /[\d]*/.exec(q) / 100 : q,
			r = 0 < r.indexOf("%") ? /[\d]*/.exec(r) / 100 : r,
			s = b.offsetWidth,
			t = b.offsetHeight
		}
		d = "array" !== typeof d || 6 !== d.length ? e : [e[0] * d[0] + e[1] * d[2], e[0] * d[1] + e[1] * d[3], e[2] * d[0] + e[3] * d[2], e[2] * d[1] + e[3] * d[3], d[4], d[5]];
		if (f = a.data(b, "rotate"))
			f = c(f), e = Math.cos(f), f = Math.sin(f), f = [e, -f, f, e], d = [d[0] * f[0] + d[1] * f[2], d[0] * f[1] + d[1] * f[3], d[2] * f[0] + d[3] * f[2], d[2] * f[1] + d[3] * f[3], d[4], d[5]];
		b.style.filter = ["progid:DXImageTransform.Microsoft.Matrix(", "M11=" + d[0] + ", ", "M12=" + d[1] + ", ",
			"M21=" + d[2] + ", ", "M22=" + d[3] + ", ", "SizingMethod='auto expand')"].join("");
		p && (p = b.offsetWidth, e = b.offsetHeight, b.style.position = "relative", b.style.left = q * (s - p) + (parseInt(d[4]) || 0), b.style.top = r * (t - e) + (parseInt(d[5]) || 0))
	}

	var e = document.createElement("div"),
	e = e.style;
	a.cssProps.transform = "" === e.MozTransform ? "MozTransform" : "" === e.msTransform ? "msTransform" : "" === e.WebkitTransform ? "WebkitTransform" : "" === e.OTransform ? "OTransform" : "" === e.Transform ? "Transform" : !1;
	a.cssProps.transformOrigin = "" === e.MozTransformOrigin ?
		"MozTransformOrigin" : "" === e.msTransformOrigin ? "msTransformOrigin" : "" === e.WebkitTransformOrigin ? "WebkitTransformOrigin" : "" === e.OTransformOrigin ? "OTransformOrigin" : "" === e.TransformOrigin ? "TransformOrigin" : !1;
	a.support.transform = !1 !== a.cssProps.transform || "" === e.filter ? !0 : !1;
	a.support.transformOrigin = !1 !== a.cssProps.transformOrigin ? !0 : !1;
	a.support.matrixFilter = "" === e.filter && !1 === a.cssProps.transform ? !0 : !1;
	e = null;
	if (!1 !== a.support.transform) {
		a.cssNumber.skew = a.cssNumber.skewX = a.cssNumber.skewY = a.cssNumber.scale =
			a.cssNumber.scaleX = a.cssNumber.scaleY = a.cssNumber.rotate = a.cssNumber.matrix = !0;
		a.cssNumber.transformOrigin = a.cssNumber.transformOriginX = a.cssNumber.transformOriginY = !0;
		a.support.matrixFilter && (a.cssNumber.transformOrigin = a.cssNumber.transformOriginX = a.cssNumber.transformOriginY = !0, a.cssProps.transformOrigin = "matrixFilter");
		a.cssHooks.transform = {
			set : function (b, d, c) {
				a.support.matrixFilter ? b.style.filter = "" + d : b.style[a.cssProps.transform] = d + "%"
			},
			get : function (b, d) {
				return a.support.matrixFilter ? b.style.filter :
				b.style[a.cssProps.transform]
			}
		};
		a.cssHooks.transformOrigin = {
			set : function (b, d, c) {
				a.support.matrixFilter ? (d = d.split(","), a.cssHooks.transformOriginX.set(b, d[0]), 1 < d.length && a.cssHooks.transformOriginY.set(b, d[1])) : b.style[a.cssProps.transformOrigin] = "string" === typeof d ? d : d + (c || "%")
			},
			get : function (b, d) {
				if (a.support.matrixFilter) {
					var c = a.data(b, "transformOriginX"),
					e = a.data(b, "transformOriginY");
					return c && e && c === e ? c : "50%"
				}
				return b.style[a.cssProps.transformOrigin]
			}
		};
		a.fx.step.transformOrigin = function (b) {
			a.cssHooks.transformOrigin.set(b.elem,
				b.now, b.unit)
		};
		a.cssHooks.transformOriginX = {
			set : function (b, c, e) {
				a.support.matrixFilter ? (a.data(b, "transformOriginX", e ? c + e : c), d(b)) : b.style[a.cssProps.transformOrigin + "X"] = "string" === typeof c ? c : c + (e || "%")
			},
			get : function (b, d) {
				if (a.support.matrixFilter) {
					var c = a.data(b, "transformOriginX");
					switch (c) {
					case "left":
						return "0%";
					case "center":
						return "50%";
					case "right":
						return "100%"
					}
					return c ? c : "50%"
				}
				return b.style[a.cssProps.transformOrigin + "X"]
			}
		};
		a.fx.step.transformOriginX = function (b) {
			a.cssHooks.transformOriginX.set(b.elem,
				b.now, b.unit)
		};
		a.cssHooks.transformOriginY = {
			set : function (b, c, e) {
				a.support.matrixFilter ? (a.data(b, "transformOriginY", e ? c + e : c), d(b)) : b.style[a.cssProps.transformOrigin + "Y"] = "string" === typeof c ? c : c + (e || "%")
			},
			get : function (b, d) {
				if (a.support.matrixFilter) {
					var c = a.data(b, "transformOriginY");
					switch (c) {
					case "top":
						return "0%";
					case "center":
						return "50%";
					case "bottom":
						return "100%"
					}
					return c ? c : "50%"
				}
				return b.style[a.cssProps.transformOrigin + "Y"]
			}
		};
		a.fx.step.transformOriginY = function (b) {
			a.cssHooks.transformOriginY.set(b.elem,
				b.now, b.unit)
		};
		var e = function (a) {
			return a
		},
		f = [
			["X", "Y"],
			"X",
			"Y"
		];
		jQuery.each([{
					prop : "rotate",
					matrix : [function (a) {
							return Math.cos(a)
						}, function (a) {
							return -Math.sin(a)
						}, function (a) {
							return Math.sin(a)
						}, function (a) {
							return Math.cos(a)
						}
					],
					unit : "rad",
					subProps : [""],
					fnc : c
				}, {
					prop : "scale",
					matrix : [
						[e, 0, 0, e],
						[e, 0, 0, 1],
						[1, 0, 0, e]
					],
					unit : "",
					subProps : f,
					fnc : parseFloat,
					_default : 1
				}, {
					prop : "skew",
					matrix : [
						[1, e, e, 1],
						[1, e, 0, 1],
						[1, 0, e, 1]
					],
					unit : "rad",
					subProps : f,
					fnc : c
				}, {
					prop : "translate",
					matrix : [
						[1, 0, 0, 1, e, e],
						[1, 0, 0, 1, e, 0],
						[1, 0,
							0, 1, 0, e]
					],
					standardUnit : "px",
					subProps : f,
					fnc : parseFloat
				}, {
					prop : "matrix",
					matrix : [
						[e, e, e, e, e, e],
						[e, 0, 0, 1, 0, 0],
						[1, e, 0, 1, 0, 0],
						[1, 0, e, 1, 0, 0],
						[1, 0, 0, e, 0, 0],
						[1, 0, 0, 1, 0, e]
					],
					subProps : ["ABCDXY".split(""), "A", "B", "C", "D", "X", "Y"],
					fnc : parseFloat
				}
			], function (c, e) {
			jQuery.each(e.subProps, function (c, f) {
				var h;
				a.isArray(f) ? (h = e.prop, a.cssHooks[h] = {
						set : function (b, c, d) {
							jQuery.each(f, function (e, f) {
								a.cssHooks[h + f].set(b, c, d)
							})
						},
						get : function (b, c) {
							var d = [];
							jQuery.each(f, function (c, e) {
								d.push(a.cssHooks[h + e].get(b, d))
							});
							return d[0] ||
							d[1]
						}
					}) : (h = e.prop + f, a.cssHooks[h] = {
						set : function (c, f, n) {
							a.data(c, h, n ? f + n : f);
							f = e.fnc(n ? f + n : f);
							var m = h;
							n = e.unit || n || e.standardUnit;
							if (a.support.matrixFilter)
								d(c, f);
							else {
								var x = b(c),
								w = /[X|Y]/.exec(m),
								w = null === w ? "" : w[0] ? w[0] : w,
								m = /.*[^XY]/.exec(m)[0];
								n = void 0 === n ? "" : n;
								var u = "",
								v = !1,
								y;
								if (null !== x)
									for (var B in x)
										if (y = x[B], m === B)
											"matrix" !== m ? (u += m + "(", u += "X" === w || "" === w ? f + n : "" !== y[0] ? y[0] : a.cssHooks[m + "X"].get(c) + n, u += "Y" === w ? ", " + f + n : "" !== y[1] ? ", " + y[1] : m + "Y" in a.cssHooks ? ", " + a.cssHooks[m + "Y"].get(c) + n : "",
												u += ") ") : u += f + " ", v = !0;
										else {
											for (var u = u + (B + "("), z = 0; z < y.length; z++)
												if (u += y[z], z < y.length - 1 && "" !== y[z + 1])
													u += ", ";
												else
													break;
											u += ") "
										}
								v || (u += m + w + "(" + f + n + ") ");
								c.style[a.cssProps.transform] = u
							}
						},
						get : function (b, c) {
							var d = a.data(b, h);
							return d && void 0 !== d ? d : e._default || 0
						}
					});
				a.fx.step[h] = function (b) {
					b.unit = "px" === b.unit && a.cssNumber[h] ? e.standardUnit : b.unit;
					a.cssHooks[h].set(b.elem, b.now, b.unit)
				}
			})
		});
		a.rotate = {
			radToDeg : function (a) {
				return 180 * a / Math.PI
			}
		}
	}
})(jQuery);
