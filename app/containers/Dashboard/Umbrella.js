import rd3 from 'react-d3-library';
import ReactFauxDOM from 'react-faux-dom'
//import * as d3 from "d3";
import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
var data = require('./sundata.json');
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {getQuestionData} from 'helpers/dashboard'
import d3 from 'd3'

var tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        //.style("width", "18%")
        .style("z-index", "10")
        .style("opacity", 0);


  function mouseOverArc(d) {
    let widthsize="10%"
    if(d.name.length>10)
      widthsize="14%"
    else if(d.name.length>35)
      widthsize="17%"

    d3.select(this).attr("stroke","black")
      tooltip.html(d.name);
      tooltip
      // .transition()
      //   .duration(50)
        .style("opacity", 0.9)
        .style("width",widthsize)
        .style("z-index","99999")
        .style("display","block")

  }

    function mouseOutArc(){
      tooltip.style("opacity", 0);
      tooltip.style("display","none");
      d3.select(this).attr("stroke","")
    }

    function mouseMoveArc (d) {
        /*var coordinates = [0, 0];
      coordinates = d3.mouse(this);
      coordinates = d.x;
      var x = coordinates[0];
      var y = coordinates[1];
      */


      return tooltip
        .style("top", (d3.event.pageY-10)+"px")
        .style("left", (d3.event.pageX+10)+"px");
    }

const UmbrellaChart = React.createClass ({
  getInitialState(){
    return{
      d3:"",
      data:this.props.data
    }
  },
  componentWillReceiveProps(nextProps){
    console.log("nextPropsnextPropsnextPropsnextProps", JSON.stringify(nextProps.data))
    // if(this.state.data != nextProps.data){
      this.setState({
        data: nextProps.data,
        d3: this.createUmbrella(nextProps.data),
        nodeDiv:""
      })
    // }
    // this.createUmbrella(nextProps.data)
  },
  componentDidMount() {
  this.setState({d3: this.createUmbrella(this.state.data)});
  },
  middle(path, controlid, id){
    this.props.updateTree(path, controlid, id)
  },

  createUmbrella(datas) {
    var nodeDiv = document.createElement('div')
    nodeDiv.setAttribute("id", "umbrellaDiv")

    // var data = this.state.data;
    var data = datas
    console.log("THIS IS THE NEWDATA THAT SHOULD BE RENDERED", data)
    var that = this;


    // var width = 1280,
    //     height = 1200,

    var m = [20, 120, 20, 120],
        // w = 1280 - m[1] - m[3],
        // h = 800 - m[0] - m[2],
        w = 1580 - m[1] - m[3],
        h = 1800 - m[0] - m[2],
        i = 0,
        root;

    var tree = d3.layout.tree()
        .size([h, w]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var vis = d3.select(nodeDiv).append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // d3.json("flare.json", function(json) {
      root = datas;
      root.x0 = h / 2;
      root.y0 = 0;
      console.log("why you no update??????>?", root)

      // Initialize the display to show a few nodes.
      root.children.forEach(toggleAll);
      // toggle(root.children[1]);
      // toggle(root.children[1].children[2]);
      // toggle(root.children[9]);
      console.log("why you no update???????1", root)
      update(root);
    // });

    function toggleAll(d) {
      if (d.children) {
        d.children.forEach(toggleAll);
        toggle(d);
      }
    }

//////////////////////////////////////////////////////////////////////////////////
function update(source) {
  console.log("this is inside the update function", source)

  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 230; });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.;
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) { toggle(d); update(d);});

      nodeEnter.append("svg:circle")
          .attr("r", 1e-6)
          .attr("cursor", "pointer")
          .style("fill", "#fff")
          .style("stroke", "steelblue")
          .style("stroke-width", "1.5px")
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("svg:text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .style("font-size", "11px")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name.length>35?d.name.slice(0,35)+"...":d.name; })
          .style("fill-opacity", 1e-6)
           .on("mouseover", mouseOverArc)
           .on("mousemove", mouseMoveArc)
           .on("mouseout", mouseOutArc);
      console.log("nodeEnter", nodeEnter)


  // Transition nodes to their new position.
  var nodeUpdate = node
      // .transition()
      // .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit()
      // .transition()
      // .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", "1.5px")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    // .transition()
    //   .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link
  // .transition()
  //     .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit()
  // .transition()
  //     .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
//////////////////////////////////////////////////////////////////////////////////



    //   // Initialize the display to show a few nodes.
    //   root.children.forEach(toggleAll);
    //   // toggle(root.children[1]);
    //   // toggle(root.children[1].children[2]);
    //   // toggle(root.children[9]);
    //   console.log("why you no update???????1", root)
    //   update(root);
    // // });


      vis.on("mount", function(){
       applyTransition()
      });

      function applyTransition() {
        update(root);

      // console.log("APPLY transition")
          // d3.selectAll("path")
          // // .on("click", click)
          //     .transition()
          //     .duration(500)
          //     .delay(function(d) { return d * 40; })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function update(source) {
          // console.log("this is inside the update function", source)

          var duration = d3.event && d3.event.altKey ? 5000 : 500;

          // Compute the new tree layout.
          var nodes = tree.nodes(root).reverse();

          // Normalize for fixed-depth.
          nodes.forEach(function(d) { d.y = d.depth * 230; });

          // Update the nodes…
          var node = vis.selectAll("g.node")
              .data(nodes, function(d) { return d.id || (d.id = ++i); });

          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append("svg:g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
              .on("click", function(d) { toggle(d); update(d); });

          nodeEnter.append("svg:circle")
              .attr("r", 1e-6)
              .attr("cursor", "pointer")
              .attr("fill", "#fff")
              .attr("stroke", "steelblue")
              .attr("stroke-width", "1.5px")
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

          nodeEnter.append("svg:text")
              .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
              .attr("dy", ".35em")
              .attr("font-size", "11px")
              .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .text(function(d) { return d.name.length>35?d.name.slice(0,35)+"...":d.name; })
              .style("fill-opacity", 1e-6)
               .on("mouseover", mouseOverArc)
               .on("mousemove", mouseMoveArc)
                .on("mouseout", mouseOutArc);

          // Transition nodes to their new position.
          var nodeUpdate = node
          // .transition()
          //     .duration(duration)
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

          nodeUpdate.select("circle")
              .attr("r", 4.5)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

          nodeUpdate.select("text")
              .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit()
          // .transition()
          //     .duration(duration)
              .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
              .remove();

          nodeExit.select("circle")
              .attr("r", 1e-6);

          nodeExit.select("text")
              .style("fill-opacity", 1e-6);

          // Update the links…
          var link = vis.selectAll("path.link")
              .data(tree.links(nodes), function(d) { return d.target.id; });

          // Enter any new links at the parent's previous position.
          link.enter().insert("svg:path", "g")
              .attr("class", "link")
              .style("fill", "none")
              .style("stroke", "#ccc")
              .style("stroke-width", "1.5px")
              .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
              })
            // .transition()
            //   .duration(duration)
              .attr("d", diagonal);

          // Transition links to their new position.
          link
          // .transition()
          //     .duration(duration)
              .attr("d", diagonal);

          // Transition exiting nodes to the parent's new position.
          link.exit()
          // .transition()
          //     .duration(duration)
              .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
              })
              .remove();

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
            d.x0 = d.x
            d.y0 = d.y;
          });

          that.setState({
            nodeDiv:nodeDiv
          }
          // , (test)=>{console.log("this.state.nodeDiv", that.state.nodeDiv)}
         )
        }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    // Toggle children.
    function toggle(d) {

      if (d.children) {
        console.log("ONONONONONONONONONONO", d)
        d._children = d.children;
        d.children = null;
      } else {
          console.log("OFFOFFOFFOFFOFFOFFOFFOFFOFFOFF", d)
          /* other node collapse logic*/
          //var nodes = tree.nodes(root).reverse();
          var nodes = tree.nodes(root);
          var xm=vis.selectAll("g.node")
                .data(nodes, function(dd) {

                  if(dd.name!="Cavirin"&&dd.parent==d.parent){
                    if(dd.children){

                       dd._children = dd.children;
                      dd.children = null;

                    }

                }
            });

          vis.select("g.node").select('text').html(nodes[0].name)
          /* other node collapse logic*/
          d.children = d._children;
          d._children = null;
          let parentPath = d.parent.path;
          console.log("parentPathparentPath", d)
          // root.NISTPP
          // root.NIST
          // root.NISTCS
          // root.PCIDSS
          // root.ISOPP
          // if(d.controlid && parentPath !== "root.SOC2" && parentPath !== "root.NISTPP" && parentPath !== "root.NIST" && parentPath !== "root.NISTCS" ){
          if(d.controlid && d.childCount == 0){
            console.log("22222-22222", d.path, d.controlid)
            that.middle(d.path, d.controlid)
          } else if (d.rid) {
            console.log("33333-33333", d.rid)
            console.log("d.ridd.ridd.ridd.ridd.ridd.ridd.rid", d.rid)
            that.middle(d.path, null, d.rid)
          } else if (d.childCount > 0){
            console.log("11111-11111", d.path)
            that.middle(d.path)
          }

      }

    }

    d3.select(self.frameElement).style("height", h + "px");
    // this.setState({
    //   nodeDiv:nodeDiv
    // })
    // return this.state.nodeDiv;
    return nodeDiv;
  },

  render() {
    var RD3Component = rd3.Component;
    return (
      <div>
        <RD3Component data={this.state.d3} />
      </div>
    )
  },
})

export default UmbrellaChart
