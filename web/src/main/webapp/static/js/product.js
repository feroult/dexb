(function () {

    function productChart(width, height) {
        var dim = defineChartDimentions(width, height);
        var svg = createChartSVG(dim);

        d3.tsv("data/product.tsv", type, function (error, data) {
            var x = createX(dim, svg, data);
            var y0 = createY0(dim, svg, data);
            var y1 = createY1(dim, svg, data);

            createBars(dim, svg, data, x, y0);
        });
    }
    
    function defineChartDimentions(width, height) {
        var margin = {
            top: 80,
            right: 80,
            bottom: 80,
            left: 80
        };

        return {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom,
            margin: margin
        }
    }

    function createChartSVG(dim) {
        return d3.select("#product-chart").append("svg")
            .attr("width", dim.width + dim.margin.left + dim.margin.right)
            .attr("height", dim.height + dim.margin.top + dim.margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");
    }

    function createX(dim, svg, data) {
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, dim.width], .3)
            .domain(data.map(function (d) {
                return d.year;
            }));

        var xAxis = d3.svg.axis()
            .tickSize(0)
            .scale(x)
            .orient("bottom");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (dim.height + 6) + ")")
            .call(xAxis);

        return x;
    }

    function createY0(dim, svg, data) {
        var y0 = d3.scale.linear().domain([300, 1100]).range([dim.height, 0])
            .domain([0, d3.max(data, function (d) {
                return d.money;
            })]);

        var yAxisLeft = d3.svg.axis()
            .scale(y0)
            .ticks(4)
            .outerTickSize(0)
            .orient("left");

        svg.append("g")
            .attr("class", "y axis axisLeft")
            .attr("transform", "translate(0,0)")
            .call(yAxisLeft);

        return y0;
    }

    function createY1(dim, svg, data) {
        var y1 = d3.scale.linear().domain([20, 80]).range([dim.height, 0]);

        var yAxisRight = d3.svg.axis()
            .scale(y1)
            .ticks(6)
            .outerTickSize(0)
            .orient("right");

        svg.append("g")
            .attr("class", "y axis axisRight")
            .attr("transform", "translate(" + (dim.width) + ",0)")
            .call(yAxisRight);

        return y1;
    }

    function createBars(dim, svg, data, x, y0) {
        var bars = svg.selectAll(".bar").data(data).enter();

        bars.append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.year);
            })
            .attr("width", x.rangeBand())

        .attr("y", dim.height)
            .attr("height", 0)

        .transition()
            .delay(function (d, i) {
                return i * 100;
            })

        .attr("y", function (d) {
                return y0(d.money);
            })
            .attr("height", function (d, i, j) {
                return dim.height - y0(d.money);
            });

        return bars;
    }

    function type(d) {
        d.money = +d.money;
        return d;
    }

    productChart(800, 400);

})();