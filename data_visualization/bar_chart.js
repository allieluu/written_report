// import tip from 'd3-tip'

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Mean Accuracy:</strong> <span style='color:red'>" + d.accuracy + "</span>";
    });


var bar_chart = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

bar_chart.call(tip);

d3.tsv("accuracy.tsv", type, function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) {
        return d.classifier;
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.accuracy;
    })]);

    bar_chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    bar_chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Accuracy");

    bar_chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.classifier);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.accuracy);
        })
        .attr("height", function(d) {
            return height - y(d.accuracy);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

});

function type(d) {
    d.accuracy = +d.accuracy;
    return d;
}