import React from 'react'
import ReactDOM from 'react-dom'
import Faux from 'react-faux-dom'
import d3 from 'd3'

var SunBurstChart = React.createClass({
  mixins: [Faux.mixins.core, Faux.mixins.anim],
  getInitialState: function () {
		return {
			data: this.props.data
		}
  },

	componentWillReceiveProps(nextProps){
		console.log("nextPropsnextPropsnextPropsnextPropsnextProps", nextProps)
		// if(this.state.data != nextProps.data) {
			this.setState({
				data: nextProps.data
			}, this.renderSunburstZoom(nextProps.data))
		// }
	},

  componentDidMount: function () {
		this.renderSunburstZoom(this.state.data)
  },
	renderSunburstZoom: function(data) {
		var faux = this.connectFauxDOM('div', 'chart')

		var component = this

    var b = {
      w: 225, h: 30, s: 3, t: 10
    };

		//  D3 code below by Mike Bostock, https://bl.ocks.org/mbostock/3943967

		var width = 1000,
				height = 700,
				radius = (Math.min(width, height) / 2) - 10;

		var formatNumber = d3.format(",d");

		var x = d3.scale.linear()
				.range([0, 2 * Math.PI]);

		var y = d3.scale.sqrt()
				.range([0, radius]);

		var color = d3.scale.category20c();
    // const color = d3.scale.ordinal().range(['#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548','#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E','#00C484', '#F9C73D', '#29ABE2', '#FF444D', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4'].reverse());
    var sequence = d3.select(faux).append("div")
        .attr("id", "sequence")
        .style("height", "50px")
        // .attr("padding", "30px")

		var partition = d3.layout.partition()
				.value(function(d) { return d.size; });

		var arc = d3.svg.arc()
				.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
				.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
				.innerRadius(function(d) { return Math.max(0, y(d.y)); })
				.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
        initializeBreadcrumbTrail();

		var svg = d3.select(faux).append("svg")
				.attr("width", width)
				.attr("text-anchor", "middle")
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")")
        .on("mouseout", (d)=>{
          console.log("MOUSEOUTMOUSEOUT")
          tooltip.style("opacity", 0)
        });



		var root = data;
    // initializeBreadcrumbTrail();
    // var sequence = d3.select(faux).append("div")
    //     .attr("id", "sequence")
    //     .style("height", "50px")
    //     // .attr("padding", "30px")

		// var g = svg.selectAll("g")
		// 		.data(partition.nodes(root))
		// 		.enter().append("g");
		//
		// var text = g.append("text")
		// 		 .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
		// 		 .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
		// 		 .attr("dx", function (d) { return computeTextRotation(d) > 180 ? "25" : "-20"; }) // margin
		// 		 .attr("dy", ".35em") // vertical-align
		// 		 .style("font-size", "14px")
		// 		 .text(function(d) {return d.dx < 0.005? "" : d.name.length < 5 ? d.name : d.name.slice(0, 6)+"..."; });

		// svg.selectAll("path")
		//     .data(partition.nodes(root))
		//     .enter().append("path")
		//     .attr("d", arc)
		//     .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
		//     .on("click", click)
		//     .append("title")
		//     .text(function(d) { return d.name + "\n" + formatNumber(d.value); });

		var g = svg.selectAll("g")
				.data(partition.nodes(root))
				.enter().append("g");

		var path = g.append("path")
				.attr("d", arc)
				.style("stroke", "#fff")
				.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
				.on("click", click)
				.on("mouseover", mouseOverArc)
				.on("mousemove", mouseMoveArc)
				.on("mouseout", mouseOutArc);

		var tooltip = d3.select("body")
		    .append("div")
		    .attr("id", "tooltip")
		    .style("position", "absolute")
        .style("width", "15%")
		    .style("z-index", "10")
		    .style("opacity", 0);

    function initializeBreadcrumbTrail() {
      console.log("initializeBreadcrumbTrail", initializeBreadcrumbTrail )
        // Add the svg area.
        // var trail = d3.select("#sequence").append("svg:svg")
        var trail = sequence.append("svg:svg")
            .attr("width", width)
            .attr("height", 50)
            .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
          .attr("id", "endlabel")
          .style("fill", "#000");
      }

		function mouseOverArc(d) {
		 d3.select(this).attr("stroke","black")
      tooltip.html(format_description(d));
      tooltip
      // .transition()
      //   .duration(50)
        .style("opacity", 0.9);
    }

		function mouseOutArc(){
      tooltip.style("opacity", 0);
			d3.select(this).attr("stroke","")
		}

		function mouseMoveArc (d) {
      return tooltip
        .style("top", (d3.event.pageY-10)+"px")
        .style("left", (d3.event.pageX+10)+"px");
		}

		function format_description(d) {
      var totalSize = path.datum().value;
      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }
      console.log("percentageString", d, percentageString)

		  var description = d.description;
		      // return  '<b>' + d.name + '</b></br><div>' + percentageString '</div></br><div>' + d.value '</div>';
          return  '<b>' + d.name + '</b></br>'+ format_number(d.value) + ' Tests<br>' + percentageString + ' of Total Tests';

		}

		// var text = g.append("text")
		// 		 .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
		// 		 .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
		// 		 .attr("dx", function (d) { return computeTextRotation(d) > 180 ? "25" : "-20"; }) // margin
		// 		 .attr("dy", ".35em") // vertical-align
		// 		 .style("font-size", "14px")
		// 		 .text(function(d) {return d.dx < 0.007? "" : d.name.length < 5 ? d.name : d.name.slice(0, 4)+"..."; });

		var text = g.append("text")
			.attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
			.attr("x", function(d) { return y(d.y); })
			.attr("dx", "20") // margin
			.attr("dy", ".35em") // vertical-align
      .style("font-size", "11px")
			.text(function(d) {return d.name.length < 5 ? d.name : d.name.slice(0, 5)+"..."; })
			// .style("opacity", function(d) {return d.dx < 0.007? 0 : 1;});
			 .text(function(d) {return d.size < 1? "" : d.name.length < 5 ? d.name : d.name.slice(0, 5)+"..."; });

	 function click(d) {
		 // fade out all text elements
		 text.transition().attr("opacity", 0);

		 path.transition()
			 .duration(750)
			 .attrTween("d", arcTween(d))
			 .each("end", function(e, i) {
					 // check if the animated element's data e lies within the visible angle span given in d
					 if (e.x >= d.x && e.x < (d.x + d.dx)) {
						 // get a selection of the associated text element
						 var arcText = d3.select(this.parentNode).select("text");
						 // fade in the text element and recalculate positions
						 arcText.transition().duration(750)
							 .attr("opacity", 1)
							 .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
							 .attr("x", function(d) { return y(d.y); });
					 }
			 });

			 component.animateFauxDOM(2000)
       var sequenceArray = getAncestors(d);

       var totalSize = path.datum().value;
      //  var percentage = (100 * d.value / totalSize).toPrecision(3);
      //  var percentageString = percentage + "%";
      //  if (percentage < 0.1) {
      //    percentageString = "< 0.1%";
      //  }
      //  console.log("percentageString", d, percentageString)

       updateBreadcrumbs(sequenceArray);

       // Fade all the segments.
       d3.selectAll("path")
           .style("opacity", 1);

       // Then highlight only those that are an ancestor of the current segment.
       d3.selectAll("path")
           .filter(function(node) {
                     return (sequenceArray.indexOf(node) >= 0);
                   })
           .style("opacity", 1);


	 }

	// function computeTextRotation(d) {
	// 		var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
	// 		return (ang > 90) ? 180 + ang : ang;
	// }

	function computeTextRotation(d) {
		return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
  }

  function format_number(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

	function arcTween(d) {
		var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
				yd = d3.interpolate(y.domain(), [d.y, 1]),
				yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
		return function(d, i) {
			return i
					? function(t) { return arc(d); }
					: function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
		};
	}

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    // points.push((d.name.length*15) + ",0");
    // points.push((d.name.length*15) + b.t + "," + (b.h / 2));
    // points.push((d.name.length*15) + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
      points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
  }

  function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  function updateBreadcrumbs(nodeArray, percentageString) {
    // console.log("nodeArray, percentageString", nodeArray, percentageString)
    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.name + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function(d) { return color[d.name]; });

    entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
    		.style("font-size", "12px")
        .attr("font-weight", "400")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name.length > 45 ? d.name.slice(0,45)+"..." : d.name; });
console.log("enteringentering", entering)
    // Set position for entering and updating nodes.
    g.attr("transform", function(d, i) {
      return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        // .text(percentageString)
        // .style("opacity", function (d) { console.log("entering.length", entering[0].length); return entering[0].length > 0 ? "1" : "0"; })

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("visibility", "");

  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// component.setState({chart:faux.toReact()});

	// d3.select(self.frameElement).style("height", height + "px");
	},
	render: function () {
		console.log("this.state.chart", this.state.chart)
		return <div>
			{this.state.chart}
		</div>
	},
})
export default SunBurstChart
