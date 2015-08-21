(function () {

    function productChart(width, height) {
        var dim = defineChartDimentions(width, height);
        var svg = createChartSVG(dim);

        yawp('/projects').first(function (project) {
            renderChart(dim, svg, project, data(project));
        });
    }

    function renderChart(dim, svg, project, data) {
        function render() {
            var x = createX();
            var y0 = createY0();
            var y1 = createY1();

            renderBars(x, y1);
            renderLines(x, y0);
        }

        function createX() {
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, dim.width], 0.15)
                .domain(data.map(function (d) {
                    return d.sprint;
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

        function createY0() {
            var min = 0;
            var max = project.points;

            var y0 = d3.scale.linear().domain([min, max]).range([dim.height, 0]);

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

        function createY1() {
            var min = 0;
            var max = d3.max(data, function (d) {
                return d.done;
            });

            var y1 = d3.scale.linear().domain([min, max]).range([dim.height, 0]);

            var yAxisRight = d3.svg.axis()
                .scale(y1)
                .ticks(8)
                .outerTickSize(0)
                .orient("right");

            svg.append("g")
                .attr("class", "y axis axisRight")
                .attr("transform", "translate(" + (dim.width) + ",0)")
                .call(yAxisRight);

            return y1;
        }

        function renderLines(x, y0) {
            var lines = svg.selectAll(".line").data(data).enter();

            lines.append("line")
                .attr("class", "line")
                .attr("x1", function (d) {
                    if (d.index == 0) {
                        return 0;
                    }
                    return x(data[d.index - 1].sprint) + x.rangeBand() / 2;
                })
                .attr("y1", function (d) {
                    if (d.index == 0) {
                        return y0(project.points);
                    }

                    return y0(data[d.index - 1].remaining);
                })
                .attr("x2", function (d) {
                    return x(d.sprint) + x.rangeBand() / 2;
                })
                .attr("y2", function (d) {
                    return y0(d.remaining);
                });

            return lines;
        }


        function renderBars(x, y1) {
            var bars = svg.selectAll(".bar").data(data).enter();

            bars.append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(d.sprint);
                })
                .attr("width", x.rangeBand())

            .attr("y", dim.height)
                .attr("height", 0)

            .transition()
                .delay(function (d, i) {
                    return i * 100;
                })

            .attr("y", function (d) {
                    return y1(d.done);
                })
                .attr("height", function (d, i, j) {
                    return dim.height - y1(d.done);
                });

            return bars;
        }

        render();
    }

    function data(project) {
        var remaining = project.points;

        return project.sprints.map(function (sprint, i) {
            remaining -= sprint.done;
            return {
                index: i,
                sprint: 'Sprint ' + (i + 1),
                done: sprint.done,
                remaining: remaining
            };
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

    productChart(600, 400);

})();