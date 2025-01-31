import {
  __commonJS
} from "./chunk-3OV72XIM.js";

// node_modules/highcharts/modules/windbarb.js
var require_windbarb = __commonJS({
  "node_modules/highcharts/modules/windbarb.js"(exports, module) {
    !/**
    * Highcharts JS v11.4.8 (2024-08-29)
    *
    * Wind barb series module
    *
    * (c) 2010-2024 Torstein Honsi
    *
    * License: www.highcharts.com/license
    */
    function(t) {
      "object" == typeof module && module.exports ? (t.default = t, module.exports = t) : "function" == typeof define && define.amd ? define("highcharts/modules/windbarb", ["highcharts"], function(e) {
        return t(e), t.Highcharts = e, t;
      }) : t("undefined" != typeof Highcharts ? Highcharts : void 0);
    }(function(t) {
      "use strict";
      var e = t ? t._modules : {};
      function o(e2, o2, i, r) {
        e2.hasOwnProperty(o2) || (e2[o2] = r.apply(null, i), "function" == typeof CustomEvent && t.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", {
          detail: {
            path: o2,
            module: e2[o2]
          }
        })));
      }
      o(e, "Extensions/DataGrouping/ApproximationRegistry.js", [], function() {
        return {};
      }), o(e, "Series/OnSeriesComposition.js", [e["Series/Column/ColumnSeries.js"], e["Core/Globals.js"], e["Core/Series/Series.js"], e["Core/Utilities.js"]], function(t2, e2, o2, i) {
        var r;
        let {
          composed: s
        } = e2, {
          prototype: n
        } = t2, {
          prototype: a
        } = o2, {
          defined: l,
          pushUnique: p,
          stableSort: h
        } = i;
        return function(t3) {
          function e3(t4) {
            return a.getPlotBox.call(this.options.onSeries && this.chart.get(this.options.onSeries) || this, t4);
          }
          function o3() {
            n.translate.apply(this);
            let t4 = this, e4 = t4.options, o4 = t4.chart, i2 = t4.points, r2 = e4.onSeries, s2 = r2 && o4.get(r2), a2 = s2 && s2.options.step, p2 = s2 && s2.points, u = o4.inverted, d = t4.xAxis, c = t4.yAxis, f = i2.length - 1, b, g, m = e4.onKey || "y", x = p2 && p2.length, y = 0, S, v, j, C, L;
            if (s2 && s2.visible && x) {
              for (y = (s2.pointXOffset || 0) + (s2.barW || 0) / 2, C = s2.currentDataGrouping, v = p2[x - 1].x + (C ? C.totalRange : 0), h(i2, (t5, e5) => t5.x - e5.x), m = "plot" + m[0].toUpperCase() + m.substr(1); x-- && i2[f]; ) if (S = p2[x], (b = i2[f]).y = S.y, S.x <= b.x && void 0 !== S[m]) {
                if (b.x <= v && (b.plotY = S[m], S.x < b.x && !a2 && (j = p2[x + 1]) && void 0 !== j[m])) {
                  if (l(b.plotX) && s2.is("spline")) {
                    let t5 = [S.plotX || 0, S.plotY || 0], e5 = [j.plotX || 0, j.plotY || 0], o5 = S.controlPoints?.high || t5, i3 = j.controlPoints?.low || e5, r3 = (r4, s4) => Math.pow(1 - r4, 3) * t5[s4] + 3 * (1 - r4) * (1 - r4) * r4 * o5[s4] + 3 * (1 - r4) * r4 * r4 * i3[s4] + r4 * r4 * r4 * e5[s4], s3 = 0, n2 = 1, a3;
                    for (let t6 = 0; t6 < 100; t6++) {
                      let t7 = (s3 + n2) / 2, e6 = r3(t7, 0);
                      if (null === e6) break;
                      if (0.25 > Math.abs(e6 - b.plotX)) {
                        a3 = t7;
                        break;
                      }
                      e6 < b.plotX ? s3 = t7 : n2 = t7;
                    }
                    l(a3) && (b.plotY = r3(a3, 1), b.y = c.toValue(b.plotY, true));
                  } else L = (b.x - S.x) / (j.x - S.x), b.plotY += L * (j[m] - S[m]), b.y += L * (j.y - S.y);
                }
                if (f--, x++, f < 0) break;
              }
            }
            i2.forEach((e5, o5) => {
              let r3;
              e5.plotX += y, (void 0 === e5.plotY || u) && (e5.plotX >= 0 && e5.plotX <= d.len ? u ? (e5.plotY = d.translate(e5.x, 0, 1, 0, 1), e5.plotX = l(e5.y) ? c.translate(e5.y, 0, 0, 0, 1) : 0) : e5.plotY = (d.opposite ? 0 : t4.yAxis.len) + d.offset : e5.shapeArgs = {}), (g = i2[o5 - 1]) && g.plotX === e5.plotX && (void 0 === g.stackIndex && (g.stackIndex = 0), r3 = g.stackIndex + 1), e5.stackIndex = r3;
            }), this.onSeries = s2;
          }
          t3.compose = function(t4) {
            if (p(s, "OnSeries")) {
              let i2 = t4.prototype;
              i2.getPlotBox = e3, i2.translate = o3;
            }
            return t4;
          }, t3.getPlotBox = e3, t3.translate = o3;
        }(r || (r = {})), r;
      }), o(e, "Series/Windbarb/WindbarbPoint.js", [e["Series/Column/ColumnSeries.js"], e["Core/Utilities.js"]], function(t2, e2) {
        let {
          isNumber: o2
        } = e2;
        class i extends t2.prototype.pointClass {
          isValid() {
            return o2(this.value) && this.value >= 0;
          }
        }
        return i;
      }), o(e, "Series/Windbarb/WindbarbSeriesDefaults.js", [], function() {
        return {
          dataGrouping: {
            enabled: true,
            approximation: "windbarb",
            groupPixelWidth: 30
          },
          lineWidth: 2,
          onSeries: null,
          states: {
            hover: {
              lineWidthPlus: 0
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.value}</b> ({point.beaufort})<br/>'
          },
          vectorLength: 20,
          colorKey: "value",
          yOffset: -20,
          xOffset: 0
        };
      }), o(e, "Series/Windbarb/WindbarbSeries.js", [e["Core/Animation/AnimationUtilities.js"], e["Extensions/DataGrouping/ApproximationRegistry.js"], e["Core/Globals.js"], e["Series/OnSeriesComposition.js"], e["Core/Series/SeriesRegistry.js"], e["Core/Utilities.js"], e["Series/Windbarb/WindbarbPoint.js"], e["Series/Windbarb/WindbarbSeriesDefaults.js"]], function(t2, e2, o2, i, r, s, n, a) {
        let {
          animObject: l
        } = t2, {
          column: p
        } = r.seriesTypes, {
          extend: h,
          merge: u,
          pick: d
        } = s;
        class c extends p {
          init(t3, e3) {
            super.init(t3, e3);
          }
          pointAttribs(t3, e3) {
            let o3 = this.options, i2 = t3.color || this.color, r2 = this.options.lineWidth;
            return e3 && (i2 = o3.states[e3].color || i2, r2 = (o3.states[e3].lineWidth || r2) + (o3.states[e3].lineWidthPlus || 0)), {
              stroke: i2,
              "stroke-width": r2
            };
          }
          windArrow(t3) {
            let e3 = t3.beaufortLevel, o3 = this.options.vectorLength / 20, i2 = 1.943844 * t3.value, r2, s2 = -10;
            if (t3.isNull) return [];
            if (0 === e3) return this.chart.renderer.symbols.circle(-10 * o3, -10 * o3, 20 * o3, 20 * o3);
            let n2 = [["M", 0, 7 * o3], ["L", -1.5 * o3, 7 * o3], ["L", 0, 10 * o3], ["L", 1.5 * o3, 7 * o3], ["L", 0, 7 * o3], ["L", 0, -10 * o3]];
            if ((r2 = (i2 - i2 % 50) / 50) > 0) for (; r2--; ) n2.push(-10 === s2 ? ["L", 0, s2 * o3] : ["M", 0, s2 * o3], ["L", 5 * o3, s2 * o3 + 2], ["L", 0, s2 * o3 + 4]), i2 -= 50, s2 += 7;
            if ((r2 = (i2 - i2 % 10) / 10) > 0) for (; r2--; ) n2.push(-10 === s2 ? ["L", 0, s2 * o3] : ["M", 0, s2 * o3], ["L", 7 * o3, s2 * o3]), i2 -= 10, s2 += 3;
            if ((r2 = (i2 - i2 % 5) / 5) > 0) for (; r2--; ) n2.push(-10 === s2 ? ["L", 0, s2 * o3] : ["M", 0, s2 * o3], ["L", 4 * o3, s2 * o3]), i2 -= 5, s2 += 3;
            return n2;
          }
          drawPoints() {
            let t3 = this.chart, e3 = this.yAxis, o3 = t3.inverted, i2 = this.options.vectorLength / 2;
            for (let r2 of this.points) {
              let s2 = r2.plotX, n2 = r2.plotY;
              false === this.options.clip || t3.isInsidePlot(s2, 0) ? (r2.graphic || (r2.graphic = this.chart.renderer.path().add(this.markerGroup).addClass("highcharts-point highcharts-color-" + d(r2.colorIndex, r2.series.colorIndex))), r2.graphic.attr({
                d: this.windArrow(r2),
                translateX: s2 + this.options.xOffset,
                translateY: n2 + this.options.yOffset,
                rotation: r2.direction
              }), this.chart.styledMode || r2.graphic.attr(this.pointAttribs(r2))) : r2.graphic && (r2.graphic = r2.graphic.destroy()), r2.tooltipPos = [s2 + this.options.xOffset + (o3 && !this.onSeries ? i2 : 0), n2 + this.options.yOffset - (o3 ? 0 : i2 + e3.pos - t3.plotTop)];
            }
          }
          animate(t3) {
            t3 ? this.markerGroup.attr({
              opacity: 0.01
            }) : this.markerGroup.animate({
              opacity: 1
            }, l(this.options.animation));
          }
          markerAttribs() {
            return {};
          }
          getExtremes() {
            return {};
          }
          shouldShowTooltip(t3, e3, o3 = {}) {
            return o3.ignoreX = this.chart.inverted, o3.ignoreY = !o3.ignoreX, super.shouldShowTooltip(t3, e3, o3);
          }
        }
        return c.defaultOptions = u(p.defaultOptions, a), i.compose(c), h(c.prototype, {
          beaufortFloor: [0, 0.3, 1.6, 3.4, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7],
          beaufortName: ["Calm", "Light air", "Light breeze", "Gentle breeze", "Moderate breeze", "Fresh breeze", "Strong breeze", "Near gale", "Gale", "Strong gale", "Storm", "Violent storm", "Hurricane"],
          invertible: false,
          parallelArrays: ["x", "value", "direction"],
          pointArrayMap: ["value", "direction"],
          pointClass: n,
          trackerGroups: ["markerGroup"],
          translate: function() {
            let t3 = this.beaufortFloor, e3 = this.beaufortName;
            for (let o3 of (i.translate.call(this), this.points)) {
              let i2 = 0;
              for (; i2 < t3.length && !(t3[i2] > o3.value); i2++) ;
              o3.beaufortLevel = i2 - 1, o3.beaufort = e3[i2 - 1];
            }
          }
        }), r.registerSeriesType("windbarb", c), e2.windbarb || (e2.windbarb = (t3, e3) => {
          let i2 = 0, r2 = 0;
          for (let s2 = 0, n2 = t3.length; s2 < n2; s2++) i2 += t3[s2] * Math.cos(e3[s2] * o2.deg2rad), r2 += t3[s2] * Math.sin(e3[s2] * o2.deg2rad);
          return [t3.reduce((t4, e4) => t4 + e4, 0) / t3.length, Math.atan2(r2, i2) / o2.deg2rad];
        }), c;
      }), o(e, "masters/modules/windbarb.src.js", [e["Core/Globals.js"]], function(t2) {
        return t2;
      });
    });
  }
});
export default require_windbarb();
//# sourceMappingURL=highcharts_modules_windbarb.js.map
