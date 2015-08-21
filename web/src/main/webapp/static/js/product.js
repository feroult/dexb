(function () {

    function productChart(_width, _height) {

        var margin = {
                top: 80,
                right: 80,
                bottom: 80,
                left: 80
            },
            width = _width - margin.left - margin.right,
            height = _height - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .3);

        var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]),
            y1 = d3.scale.linear().domain([20, 80]).range([height, 0]);

        var xAxis = d3.svg.axis()
            .tickSize(0)
            .scale(x)
            .orient("bottom");

        // create left yAxis
        var yAxisLeft = d3.svg.axis()
            .scale(y0)
            .ticks(4)
            .outerTickSize(0)
            .orient("left");
        
        // create right yAxis
        var yAxisRight = d3.svg.axis()
            .scale(y1)
            .ticks(6)
            .outerTickSize(0)
            .orient("right");

        var svg = d3.select("#product-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.tsv("data/product.tsv", type, function (error, data) {
            x.domain(data.map(function (d) {
                return d.year;
            }));
            y0.domain([0, d3.max(data, function (d) {
                return d.money;
            })]);


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height + 6) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis axisLeft")
                .attr("transform", "translate(0,0)")
                .call(yAxisLeft)

            svg.append("g")
                .attr("class", "y axis axisRight")
                .attr("transform", "translate(" + (width) + ",0)")
                .call(yAxisRight)

            bars = svg.selectAll(".bar").data(data).enter();

            bars.append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(d.year);
                })
                .attr("width", x.rangeBand())

            .attr("y", height)
                .attr("height", 0)

            .transition()
                .delay(function (d, i) {
                    return i * 100;
                })

            .attr("y", function (d) {
                    return y0(d.money);
                })
                .attr("height", function (d, i, j) {
                    return height - y0(d.money);
                });

        });
    }

    function type(d) {
        d.money = +d.money;
        return d;
    }

    productChart(800, 400);
})();