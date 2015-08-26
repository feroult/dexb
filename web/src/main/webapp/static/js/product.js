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

            renderScopeArea(x, y0);
            renderDoneBars(x, y1);
            renderProductBurnLines(x, y0);
        }

        function createX() {
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, dim.width], 0.3)
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
            var max = d3.max(data, function (d) {
                return d.points;
            });

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
            }) * 1.5;

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

        function renderProductBurnLines(x, y0) {
            var dotOffset = 4;

            var lines = svg.selectAll(".line").data(data).enter();

            function x1(d) {
                if (d.index == 0) {
                    return 0;
                }
                return x(data[d.index - 1].sprint) + x.rangeBand() / 2;
            }

            function y1(d) {
                if (d.index == 0) {
                    return y0(project.points);
                }

                return y0(data[d.index - 1].remaining);
            }

            function x2(d) {
                return x(d.sprint) + x.rangeBand() / 2;

            }

            function y2(d) {
                return y0(d.remaining);
            }

            lines.append("line")
                .attr("class", function (d) {
                    if (d.projection) {
                        return "line projection";
                    }
                    return "line";
                })
                .attr("x1", function (d) {
                    return x1(d) + dotOffset;
                })
                .attr("x2", function (d) {
                    return x2(d) - dotOffset;
                })
                .attr("y1", 0)
                .attr("y2", 0)
                .transition()
                .ease("sin")
                .delay(function (d, i) {
                    return i * 100;
                })
                .attr("y1", function (d) {
                    var slope = (y2(d) - y1(d)) / (x2(d) - x1(d));
                    var x1_ = x1(d) + dotOffset;
                    var y1_ = y2(d) - slope * (x2(d) - x1_);
                    return y1_;
                })
                .attr("y2", function (d) {
                    var slope = (y2(d) - y1(d)) / (x2(d) - x1(d));
                    var x2_ = x2(d) - dotOffset;
                    var y2_ = slope * (x2_ - x1(d)) + y1(d);
                    return y2_;
                });


            var data_ = data.map(function (d) {
                return d;
            });

            data_.unshift({
                remaining: project.points
            });

            var dots = svg.selectAll(".dot").data(data_).enter();

            dots.append("circle")
                .attr("class", "circle")
                .attr("r", 3)
                .attr("cx", function (d) {
                    if (!d.sprint) {
                        return 0;
                    }
                    return x(d.sprint) + x.rangeBand() / 2;
                })
                .attr("cy", 0)
                .transition()
                .ease("sin")
                .delay(function (d, i) {
                    return i * 60;
                })
                .attr("cy", function (d) {
                    return y0(d.remaining);
                });

            return lines;
        }

        function renderDoneBars(x, y1) {
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
                .ease("linear")
                .delay(function (d, i) {
                    return i * 100;
                })
                .duration(500)
                .attr("y", function (d) {
                    return y1(d.done);
                })
                .attr("height", function (d, i, j) {
                    return dim.height - y1(d.done);
                });

            return bars;
        }

        function renderScopeArea(x, y0) {
            function createArea() {
                return d3.svg.area()
                    .x(function (d) {
                        if (d.index == 0) {
                            return 0;
                        }
                        if (d.index == data.length - 1) {
                            return dim.width;
                        }
                        return x(d.sprint);
                    }).y0(function (d) {
                        return y0(d.y0);
                    })
                    .y1(function (d) {
                        return y0(d.y0 + d.y);
                    });
            }

            function createStack() {
                return d3.layout.stack()
                    .values(function (d) {
                        return d.values;
                    });
            }

            function scopeStack(stack, data, yAccessor) {
                return stack([{
                    values: data.map(function (d) {
                        return {
                            index: d.index,
                            sprint: d.sprint,
                            y: yAccessor(d)
                        };
                    })
                }]);
            }

            function renderScopeStack(emptyStack, stack, clazz) {
                var scope = svg.selectAll("." + clazz).data(data).enter();

                scope.append("path")
                    .data(emptyStack)
                    .attr("class", clazz)
                    .attr("d", function (d) {
                        return area(d.values);
                    });

                d3.selectAll("." + clazz)
                    .data(stack)
                    .transition()
                    .duration(2000)
                    .attr("d", function (d) {
                        return area(d.values);
                    });
            }

            var area = createArea();
            var stack = createStack();

            var emptyStack = scopeStack(stack, data, function (d) {
                return 0;
            });

            var pointsStack = scopeStack(stack, data, function (d) {
                return d.points;
            });

            var doneStack = scopeStack(stack, data, function (d) {
                return d.totalDone;
            });

            renderScopeStack(emptyStack, pointsStack, "scopePoints");
            renderScopeStack(emptyStack, doneStack, "scopeDone");
        }

        render();
    }



    function data(project) {
        var remaining = project.points;
        var points = project.points;
        var totalDone = 0;

        var data = project.sprints.map(function (sprint, i) {
            var added = sprint.added ? sprint.added : 0;
            var removed = sprint.removed ? sprint.removed : 0;

            remaining = remaining - sprint.done + added - removed;
            points = points + added - removed;
            totalDone += sprint.done;

            return {
                index: i,
                sprint: 'Sprint ' + (i + 1),
                done: sprint.done,
                remaining: remaining,
                points: points,
                totalDone: totalDone
            };
        });

        var mean = d3.mean(data, function (d) {
            return d.done;
        });


        do {
            remaining -= mean;
            if (remaining < 0) {
                remaining = 0;
            }

            data.push({
                index: data.length,
                sprint: 'Sprint ' + (data.length + 1),
                done: 0,
                remaining: remaining,
                points: points,
                projection: true,
                totalDone: totalDone
            });

        } while (remaining != 0);

        return data;
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
            .attr("width", "100%")
            .attr("height", dim.height + dim.margin.top + dim.margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");
    }

    productChart(1400, 500);

})();