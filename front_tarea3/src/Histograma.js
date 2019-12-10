
import * as d3 from 'd3';

export default function Histograma(target, data, cambiarRango, minParaRojoP, cambiarMinParaRojo) {
    const Histograma = {};
    var data = data;
    var margin = { top: 50, left: 50, bottom: 50, right: 75 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select(target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const mean = d3.mean(data);
    const std = d3.deviation(data);
    const minParaRojo = mean + std * 1.96;
    if(minParaRojo != minParaRojoP){
        cambiarMinParaRojo(minParaRojo);
    }

    data.sort(function (a, b) { return a - b; });

    var x = d3.scaleLinear()
        .domain(d3.extent(data)).nice()
        .range([0, width]);


    var ticks = { req: { min: 5, max: 20 }, got: [] };

    (function () {
        var t = 0;
        for (var i = ticks.req.min; i <= ticks.req.max + 1; i++) {
            var xilength = x.ticks(i).length;
            if (xilength > t) {
                t = xilength;
                ticks.got.push(xilength)
            }
        }
    })();

    ticks.def = ticks.got[Math.round(ticks.got.length / 2) - 1];
    ticks.cur = ticks.def;

    var bins = binData(data, x, ticks.def);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins.map(function (d) { return d.count }))]);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    var minusButton = svg.append("g")
        .attr("class", "zoomButton minus")
        .attr("transform", "translate(" + width + "," + 55 + ")")
        .classed("active", ticks.got.indexOf(ticks.cur) > 0)
        .classed("inactive", ticks.got.indexOf(ticks.cur) == 0)
        .on("click", zoom)

    var plusButton = svg.append("g")
        .attr("class", "zoomButton plus")
        .attr("transform", "translate(" + width + ",0)")
        .classed("active", ticks.got.indexOf(ticks.cur) < (ticks.got.length - 1))
        .classed("inactive", ticks.got.indexOf(ticks.cur) == (ticks.got.length - 1))
        .on("click", zoom)



    plusButton.append("rect")
        .attr("width", 50)
        .attr("height", 50)
        .attr("fill", "green")

    plusButton.append("text")
        .attr("x", 25)
        .attr("y", 50)
        .text("+")
        .attr("text-anchor", "middle")


    minusButton.append("rect")
        .attr("width", 50)
        .attr("height", 50)
        .attr("fill", "red")

    minusButton.append("text")
        .attr("x", 25)
        .attr("y", 50)
        .attr("dy", -2)
        .text("-")
        .attr("text-anchor", "middle");


    var duration = 1000;

    function clickeadopapu(){
        cambiarRango(this.attributes.minG.value, this.attributes.maxG.value);
    }

    function binData(dat, s, t) {
        var b = [];

        console.log("bindata", { s: s.ticks(t), t: t })

        s.ticks(t).forEach(function (d, i) {
            if (i < x.ticks(t).length - 1) {
                b.push({ bin: i, min: d, max: x.ticks(t)[i + 1] })
            }
        });

        b.forEach(function (d) {
            d.count = dat.filter(function (e) { return e >= d.min && e < d.max }).length;
        })
        return b;
    }

    function zoom() {

        if (this) {
            if (d3.select(this).classed("inactive")) { return 0; }

            if (d3.select(this).classed("plus")) {
                ticks.cur = ticks.got[ticks.got.indexOf(ticks.cur) + 1]
            } else {
                ticks.cur = ticks.got[ticks.got.indexOf(ticks.cur) - 1]
            }
        }


        minusButton.classed("active", ticks.got.indexOf(ticks.cur) > 0)
            .classed("inactive", ticks.got.indexOf(ticks.cur) == 0)

        plusButton.classed("active", ticks.got.indexOf(ticks.cur) < (ticks.got.length - 1))
            .classed("inactive", ticks.got.indexOf(ticks.cur) == (ticks.got.length - 1))

        svg.select(".axis.x")
            .transition()
            .duration(duration)
            .call(xAxis.ticks(ticks.cur))

        var newBins = binData(data, x, ticks.cur);

        y.domain([0, d3.max(newBins.map(function (d) { return d.count }))]);

        svg.select(".axis.y")
            .transition()
            .duration(duration)
            .call(yAxis);

        svg.selectAll(".bar")
            .transition()
            .duration(duration)
            .attr("height", function (d) { return height - y(0) })
            .attr("y", function (d) { return y(0) })
            .transition()
            .remove();

        let newBars = svg.selectAll(null)
            .data(newBins)
            .enter()
            .append("rect");
        newBars.attr("class", "bar")
            .attr("width", x(newBins[0].max) - x(newBins[0].min) - 2)
            .attr("height", function (d) { return height - y(0) })
            .attr("y", function (d) { return y(0) })
            .attr("x", function (d) { return x(d.min) })
            .attr("minG", d => d.min)
            .attr("maxG", d => d.max)
            .attr("fill", d => {
                // console.log("datos", { d: d, media: mean, desv: std, calc: mean + std * 1.96 })
                if (mean + std * 1.96 <= d.max)
                    return "red"
                else
                    return "steelblue"
            })
            .transition()
            .duration(duration)
            .attr("height", function (d) { return height - y(d.count) })
            .attr("y", function (d) { return y(d.count) });
        newBars.on("click", clickeadopapu);

    }

    Histograma.update = (valores) => {
        console.log("update", valores)
        if (valores && valores.length > 0 && valores != data) {
            data = valores;
            zoom();
        }
    }

    // console.log("datos", { bins: bins, data: data, ticks: ticks.def })
    Histograma.pintar = () => {
        svg.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", x(bins[0].max) - x(bins[0].min) - 2)
            .attr("height", function (d) { return height - y(d.count) })
            .attr("x", function (d) { return x(d.min) })
            .attr("y", function (d) { return y(d.count) })
            .attr("minG", d => d.min)
            .attr("maxG", d => d.max)
            .attr("fill", d => {
                if (mean + std * 1.96 <= d.max)
                    return "red"
                else
                    return "steelblue"
            })
            .on("click", clickeadopapu);

        svg.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis.tickFormat(d3.format("$.2s")));

        svg.append("g")
            .attr("class", "axis y")
            .call(yAxis.tickFormat(d3.format(".2s")));

        return svg.node();
    }

    return Histograma;
}