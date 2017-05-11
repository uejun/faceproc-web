import * as d3 from "d3";

export class Donut3d {

    constructor(public svg: any, public elemId: string, public cx: number, public cy: number, public rx: number, public ry: number, public h: number, public ir: number) {
    }

    static pieTop(d, rx, ry, ir) {
        if (d.endAngle - d.startAngle == 0) return "M 0 0";
        var sx = rx * Math.cos(d.startAngle),
            sy = ry * Math.sin(d.startAngle),
            ex = rx * Math.cos(d.endAngle),
            ey = ry * Math.sin(d.endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
        ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
        return ret.join(" ");
    }

    static pieOuter(d, rx, ry, h) {
        var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

        var sx = rx * Math.cos(startAngle),
            sy = ry * Math.sin(startAngle),
            ex = rx * Math.cos(endAngle),
            ey = ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
        return ret.join(" ");
    }

    static pieInner(d, rx, ry, h, ir) {
        var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

        var sx = ir * rx * Math.cos(startAngle),
            sy = ir * ry * Math.sin(startAngle),
            ex = ir * rx * Math.cos(endAngle),
            ey = ir * ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
        return ret.join(" ");
    }

    static getPercent(d) {
        return (d.endAngle - d.startAngle > 0.2 ?
        Math.round(1000 * (d.endAngle - d.startAngle) / (Math.PI * 2)) / 10 + '%' : '');
    }

    static getLabel(d) {
        return (d.endAngle - d.startAngle > 0.2 ? d.data.label : '');
    }

    createPie(data: any) {
        let svg = this.svg;
        let elemId = this.elemId;
        let cx = this.cx;
        let cy = this.cy;
        let rx = this.rx;
        let ry = this.ry;
        let h = this.h;
        let innerRadius = this.ir;

        let pie_g = svg.append("g").attr("id", elemId);

        let _data = d3.pie().sort(null).value(function (d: any) {
            return d.value;
        })(data);


        let slices = pie_g.append("g")
            .attr("transform", "translate(" + cx + "," + cy + ")")
            .attr("class", "slices");

        slices.selectAll(".innerSlice").data(_data)
            .enter()
            .append('path')
            .attr("class", "innerSlice")
            .style("fill", function (d: any): any {
                return d3.hsl(d.data.color).darker(0.7);
            })
            .attr("d", function (d: any): any {
                return Donut3d.pieInner(d, rx + 0.5, ry + 0.5, h, innerRadius);
            })
            .each(function (d: any): any {
                this._current = d;
            });

        slices.selectAll(".topSlice").data(_data)
            .enter()
            .append("path").attr("class", "topSlice")
            .style("fill", function (d: any): any {
                return d.data.color;
            })
            .style("stroke", function (d: any): any {
                return d.data.color;
            })
            .attr("d", function (d: any): any {
                return Donut3d.pieTop(d, rx, ry, innerRadius);
            })
            .each(function (d: any): any {
                this._current = d;
            });

        slices.selectAll(".outerSlice").data(_data)
            .enter()
            .append("path").attr("class", "outerSlice")
            .style("fill", function (d: any): any {
                return d3.hsl(d.data.color).darker(0.7);
            })
            .attr("d", function (d: any): any {
                return Donut3d.pieOuter(d, rx - .5, ry - .5, h);
            })
            .each(function (d: any) {
                this._current = d;
            });

        slices.selectAll(".percent").data(_data)
            .enter().append("text").attr("class", "percent")
            .attr("x", function (d: any): any {
                return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
            })
            .attr("y", function (d: any): any {
                return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
            })
            .text(Donut3d.getPercent)
            .each(function (d: any) {
                this._current = d;
            });

        slices.selectAll(".label").data(_data)
            .enter().append("text").attr("class", "label")
            .attr("x", function (d: any): any {
                return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
            })
            .attr("y", function (d: any): any {
                return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle)) + 15;
            })
            .text(Donut3d.getLabel)
            .each(function (d: any) {
                this._current = d;
            });
    }

    transition(data) {
        let svg = this.svg;
        let elemId = this.elemId;
        let cx = this.cx;
        let cy = this.cy;
        let rx = this.rx;
        let ry = this.ry;
        let h = this.h;
        let innerRadius = this.ir;

        function arcTweenInner(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return Donut3d.pieInner(i(t), rx + 0.5, ry + 0.5, h, innerRadius);
            };
        }

        function arcTweenTop(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return Donut3d.pieTop(i(t), rx, ry, innerRadius);
            };
        }

        function arcTweenOuter(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return Donut3d.pieOuter(i(t), rx - .5, ry - .5, h);
            };
        }

        function textTweenX(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return String(0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle)));
            };
        }

        function textTweenY(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t: any) {
                return String(0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle)));
            };
        }

        function labelTweenY(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t: any) {
                return String(0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle)) + 15);
            };
        }

        var _data = d3.pie().sort(null).value(function (d: any): any {
            return d.value;
        })(data);

        d3.select("#" + elemId).selectAll(".innerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenInner);

        d3.select("#" + elemId).selectAll(".topSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenTop);

        d3.select("#" + elemId).selectAll(".outerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenOuter);

        d3.select("#" + elemId).selectAll(".percent").data(_data).transition().duration(750)
            .attrTween("x", textTweenX)
            .attrTween("y", textTweenY)
            .text(Donut3d.getPercent);

        d3.select("#" + elemId).selectAll(".label").data(_data).transition().duration(750)
            .attrTween("x", textTweenX)
            .attrTween("y", labelTweenY)
            .text(Donut3d.getLabel);
    }


}
