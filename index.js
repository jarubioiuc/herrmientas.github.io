var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = { top: 20, bottom: 20, right: 20, left: 20 };

function clickHandle(d) {
    alert(`Se ha seleccionado ${d.properties.name}`)
}

d3.json("map.json", function (error, data) {
    if (error) throw error;
    var land = topojson.feature(data, {
        type: "GeometryCollection",
        geometries: data.objects.Latam.geometries.filter(function (d) {
            return (d.id / 10000 | 0) % 100 !== 99;
        })
    });

    var path = d3.geoPath()
        .projection(d3.geoTransverseMercator()
            .rotate([74 + 30 / 60, -38 - 50 / 60])
            .fitExtent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]], land));

    
    // create a tooltip
    var Tooltip = d3.select("svg")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 1)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
        .html("Pais: "+d.properties.name)
        .style("left", (d3.mouse(this)[0]+10) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mousemove = function(d) {
      Tooltip
        //.html(d.name + "<br>" + "Country: " + d.properties.name + "<br>" + "lat: " + d.lat)
        .html("Pais: "+d.properties.name)
        .style("left", (d3.mouse(this)[0]+10) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
    }
    
    svg.selectAll("path")
        .data(land.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path)
        //.on("click", clickHandle)
        .append("title")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .text(function (d) { return d.properties.name; });
    svg.append("path")
        .datum(topojson.mesh(data, data.objects.Latam, function (a, b) { return a !== b; }))
        .attr("class", "tract-border")
        .attr("d", path)
    ;
});