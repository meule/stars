Template.map.rendered = function() {

	var graticule, height, magnitude, map_austral, map_boreal, maps, path_generator, map_projection, svg, width, zoom;

	svg = d3.select('svg');

	width = svg.node().clientWidth;

	height = svg.node().clientHeight;

	map_projection = d3.geo.naturalEarth().scale(150).rotate([180, -90, 0]).center([0, 0]).translate([width / 4 + 4.35, height / 2]).precision(.1)//.clipAngle(90 + 1e-3);

	graticule = d3.geo.graticule().minorStep([15, 10]).majorStep([90, 10]);

  console.log(graticule.extent())

	path_generator = d3.geo.path().projection(map_projection);

	/* create maps groups
	*/

	maps = svg.append('g');

	map_boreal = maps.append('g').attr('id', 'map_boreal');

	/* draw the graticules
	*/

	map_boreal.append('path').datum(graticule).attr('class', 'graticule').attr('d', path_generator);

	/* define a zoom behavior
	*/

	zoom = d3.behavior.zoom().scaleExtent([1, 20]).on('zoom', function() {
		return maps.attr('transform', "translate(" + (zoom.translate()) + ")scale(" + (zoom.scale()) + ")");
	});

	/* bind the zoom behavior to the main SVG
	*/

	svg.call(zoom);

	/* define a scale for magnitude
	*/

	magnitude = d3.scale.quantize().domain([-1, 5]).range([7, 6, 5, 4, 3, 2, 1]);

	d3.csv('/stars.csv', function(data) {
		map_boreal.selectAll('.star').data(data)
      .enter().append('circle').attr('class', 'star').attr('r', function(d) {
  			return magnitude(+d.magnitude) / 2;
  		}).attr('transform', function(d) {
  			var lat, lon, x, y, _ref;
  			lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
  			lon = (+d.RA_hour + +d.RA_min / 60 + +d.RA_sec / 3600) * (360 / 24);
  			_ref = map_projection([-lon, lat]), x = _ref[0], y = _ref[1];
  			return "translate(" + x + "," + y + ")";
  		});
    
	});

}