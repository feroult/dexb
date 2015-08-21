(function () {
    const LABEL_FONT_COLOR = "#aaa";
    const LABEL_FONT_SIZE = "12px";

    var svg = null;

    function createChart(selector, data, width, height) {
        svg = dimple.newSvg(selector, width, height);
        var chart = new dimple.chart(svg, data);
        chart.setBounds(60, 30, width - 130, height - 90)
        return chart;
    }

    function defaultAxis(axis) {
        axis.title = '';
        axis.showGridlines = false;
        axis.ticks = 4;
        return axis;
    }

    function styleVerticalAxis(axis) {
        var line = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            }).interpolate("linear");

        axis.shapes.selectAll("text").attr("fill", LABEL_FONT_COLOR).style("font-size", LABEL_FONT_SIZE);
        axis.shapes.selectAll("line").style("stroke", LABEL_FONT_COLOR);

        axis.shapes.selectAll("path")[0].map(function (d) {
            var rect = d.getBoundingClientRect();

            var data = [{
                "x": 0,
                "y": rect.top - 20
                    }, {
                "x": 0,
                "y": rect.bottom
                    }];


            d3.select(d).attr("d", line(data));
        });

        axis.shapes.selectAll("path").style("stroke", LABEL_FONT_COLOR).style("stroke-width", 1.5);
    }

    function styleHorizontalAxis(axis) {
        axis.shapes.selectAll("text").attr("fill", LABEL_FONT_COLOR).style("font-size", LABEL_FONT_SIZE);
        axis.shapes.selectAll("path").remove();
        axis.shapes.selectAll("line").remove();
    }

    function data(project) {
        var remaining = project.points;

        return project.sprints.map(function (sprint, i) {
            remaining -= sprint.done;
            return {
                sprint: 'Sprint ' + (i + 1),
                points: sprint.done,
                remaining: remaining
            };
        });
    }

    function draw(chart) {
        //        chart.ease = "sin";
        //        chart.draw(1000);
        chart.draw();
    }

    function xpto(chart, axis) {
        var y = axis._scale(98);


        axis.shapes.selectAll("path")[0].map(function (d) {
            var rect = d.getBoundingClientRect();


            svg.append("circle")
                .attr("cx", rect.left - 2)
                .attr("cy", y)
                .attr("r", 5)
                .style("stroke", "#fff")
                .style("fill", "#6b94b0")
                .style("stroke-width", "2px");
        });

    }

    function init() {
        yawp('/projects').first(function (project) {
            var chart = createChart("#product-chart", data(project), 840, 400);

            // axis
            var sprints = defaultAxis(chart.addCategoryAxis("x", "sprint"));
            var remaining = defaultAxis(chart.addMeasureAxis("y", "remaining"));
            var points = defaultAxis(chart.addMeasureAxis("y", "points"));


            // series
            chart.addSeries(null, dimple.plot.bar, [sprints, points]);
            var remainingSeries = chart.addSeries(null, dimple.plot.line, [sprints, remaining]);
            remainingSeries.lineMarkers = true;
            //remainingSeries.interpolation = "step-after";

            // draw
            draw(chart);

            xpto(chart, remaining);

            // style
            styleHorizontalAxis(sprints);
            styleVerticalAxis(remaining);
            styleVerticalAxis(points);
        });
    }

    init();

})();