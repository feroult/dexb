(function () {
    var svg = dimple.newSvg("#chartContainer", 840, 400);
    d3.json("/data/project_1.json", function (data) {
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(60, 30, 710, 305)
        var x = myChart.addCategoryAxis("x", "sprint");
        x.title = '';
        var y = myChart.addMeasureAxis("y", "points");
        y.showGridlines = false;
        y.title = '';
        y.ticks = 2;

        myChart.addSeries(null, dimple.plot.bar);
        myChart.ease = "sin";
        myChart.draw(1000);

        // y
        var line = d3.svg.line()
            .x(function (d) {
                console.log('here');
                return d.x;
            })
            .y(function (d) {
                return d.y;
            }).interpolate("linear");

        y.shapes.selectAll("text").attr("fill", "#aaa").style("font-size", "10px");
        y.shapes.selectAll("line").style("stroke", "#aaa");

        y.shapes.selectAll("path")[0].map(function (d) {
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

        y.shapes.selectAll("path").style("stroke", "#aaa").style("stroke-width", 1.5);

        // x
        x.shapes.selectAll("text").attr("fill", "#aaa").style("font-size", "10px");
        x.shapes.selectAll("path").remove();
        x.shapes.selectAll("line").remove();
    });
})();