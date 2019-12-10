
import * as d3 from 'd3';

export default function GridChart(ciudades, target) {
    const GridChart = {};
    const getRubros = (ciudades) => {
        let rubrs = []
        console.log("ciudades", ciudades)
        ciudades.forEach(ciudad => ciudad.irregularidadesEncontradas.forEach(rubro => rubrs.push(rubro.name)))
        return [... new Set(rubrs)]
    };

    const rubros = ["ciudad"].concat(getRubros(ciudades));
    const marginTopDown = 100;
    const marginLeftRight = 400;
    const p = 4;
    const r = 100;
    const cols = ciudades.length;
    const rows = rubros.length;
    const nElements = ciudades.length * rubros.length;

    const width = 20 * cols + 2 * marginLeftRight;
    const height = 20 * rows + 2 * marginTopDown;;

    const gridLayout = function (cols, rows, padding, width, height) {

        let __c = d3.scaleOrdinal().domain(d3.range(cols * rows)).range(d3.range(marginLeftRight, width - marginLeftRight, (width - 2 * marginLeftRight) / cols));
        let __r = d3.scaleQuantile().domain([0, cols * rows]).range(d3.range(marginTopDown, height - marginTopDown, (height - 2 * marginTopDown) / rows));
        let c = d3.scaleOrdinal().domain(d3.range(cols * rows)).range(d3.range(cols));
        let r = d3.scaleQuantile().domain([0, cols * rows]).range(d3.range(rows));

        // let __cellWidth = (width - 2 * marginLeftRight) / cols;
        // let __cellHeight = (height - 2 * marginTopDown) / rows;
        //let __cellHeight = (height - 2 * marginTopDown) / rows;
        let __cellWidth = 20;
        let __cellHeight = 20;

        let __boxWidth = __cellWidth - padding * 2;
        let __boxHeight = __cellHeight - padding * 2;

        function gridLayout(selection) {
            let grid = d3.select(selection.node().parentNode).append("g").attr("class", "grid");
            return selection.each(function (d, i) {
                let el = this;
                let grr = grid.append("g")
                    .attr("class", _ => "cell " + "col-" + c(i) + " row-" + r(i))
                    .attr("transform", function (_) {

                        let span_element = document.createElement("span");
                        document.body.appendChild(span_element);

                        d3.select(span_element).append("svg").attr("width", width).attr("hieght", height).append(x => el);
                        //d3.select(span_element).append("svg").attr("width", __cellWidth*cols+2*marginTopDown).attr("hieght", height).append(x => el);

                        let size = d3.select(el).node().getBBox()
                        document.body.removeChild(span_element);

                        let fw = size.width > __boxWidth ? __boxWidth / size.width : 1;
                        let fh = size.height > __boxHeight ? __boxHeight / size.height : 1;

                        let xp = 0;
                        let yp = 0;

                        if (fw > fh)
                            xp = (__boxWidth - (fh * size.width)) / 2;

                        if (fh > fw)
                            yp = (__boxHeight - (fw * size.height)) / 2;

                        if (fh == fw) {
                            xp = (__boxWidth - (fh * size.width)) / 2;
                            yp = (__boxHeight - (fw * size.height)) / 2;
                        }


                        return "translate(" + (__c(i) + padding + xp) + " " + (__r(i) + padding + yp) + ")" + " " +
                            "scale(" + d3.min([fw, fh]) + ")"


                    });
                grr.append(x => el);

                grr.append("text").text(dd => {
                    let coord = getGridCoordinates(d, ciudades.length)
                    let ciudad = ciudades[coord[0]]
                    let rubro = rubros[coord[1]]
                    if (rubro == "ciudad")
                        return ciudad.name
                    else
                        return ""
                })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "200px")
                    .attr("fill", "black")
                    .attr("transform", "translate(175,0) rotate(270)");
            })

        };

        gridLayout.rows = rows;
        gridLayout.cols = cols;
        gridLayout.width = width;
        gridLayout.height = height;
        gridLayout.padding = padding;


        return gridLayout;
    };

    const getGridCoordinates = (n, grx) => {
        let lvy = Math.floor(n / grx);
        let lvx = n % grx;
        return [lvx, lvy];
    };

    const yAxis = svg => svg
        .attr("transform", `translate(${marginLeftRight},0)`)
        .call(d3.axisLeft(yy));

    const yy = d3.scaleBand()
        .domain(rubros)
        .range([marginTopDown, height - marginTopDown]);


    GridChart.pintar = () => {
        d3.select(target).selectAll("svg").remove();
        const svgg = d3.select(target).append("svg").attr("width", width).attr("height", height)

        svgg.append("g")
            .call(yAxis);

        var circulos = svgg.selectAll("circle").data(d3.range(nElements)).enter().append("circle")
            .attr("r", r).attr("cx", r).attr("cy", r)
            .attr("fill", d => {
                let coord = getGridCoordinates(d, ciudades.length)
                let ciudad = ciudades[coord[0]]
                let rubro = rubros[coord[1]]
                let incos = ciudad.irregularidadesEncontradas.find(d => d.name == rubro)
                if (rubro == "ciudad")
                    return "white"
                return incos ? incos.ingreso ? "#F9CA3D" : "#B75952" : "#9E9FA3"
            });

        circulos.call(gridLayout(cols, rows, p, width, height));


        return svgg.node();

    };


    return GridChart;

}