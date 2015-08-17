(function () {
    const LABEL_FONT_COLOR = "#aaa";
    const LABEL_FONT_SIZE = "12px";
    
    function createChart(selector, data, width, height) {
        var svg = dimple.newSvg(selector, width, height);
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

    function draw(chart) {
        chart.addSeries(null, dimple.plot.bar);
        chart.ease = "sin";
        chart.draw(1000);
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
        return project.sprints.map(function (sprint, i) {
            return {
                sprint: 'Sprint ' + (i + 1),
                points: sprint.done
            };
        });
    }

    function init() {
        yawp('/projects').first(function (project) {
            var chart = createChart("#product-chart", data(project), 840, 400);

            var sprints = defaultAxis(chart.addCategoryAxis("x", "sprint"));
            var points = defaultAxis(chart.addMeasureAxis("y", "points"));

            draw(chart);

            styleHorizontalAxis(sprints);
            styleVerticalAxis(points);
        });
    }

    init();
    
})();