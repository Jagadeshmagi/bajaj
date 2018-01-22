import React from "react";
import ReactDOM from "react-dom";
import { scaleLinear } from "d3-scale";
import { arc } from "d3-shape";
import rmc from "random-material-color";

import * as utils from "./utils";

// let data = window.data;

// The MIT License (MIT)
//
// Copyright (c) 2016 Vivek Kumar Bansal
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var data = {
             "name": "flare",
             "children": [
              {
               "name": "analytics",
               "children": [
                {
                 "name": "cluster",
                 "children": [
                  {"name": "AgglomerativeCluster", "size": 3938},
                  {"name": "CommunityStructure", "size": 3812},
                  {"name": "HierarchicalCluster", "size": 6714},
                  {"name": "MergeEdge", "size": 743}
                 ]
                },
                {
                 "name": "graph",
                 "children": [
                  {"name": "BetweennessCentrality", "size": 3534},
                  {"name": "LinkDistance", "size": 5731},
                  {"name": "MaxFlowMinCut", "size": 7840},
                  {"name": "ShortestPaths", "size": 5914},
                  {"name": "SpanningTree", "size": 3416}
                 ]
                },
                {
                 "name": "optimization",
                 "children": [
                  {"name": "AspectRatioBanker", "size": 7074}
                 ]
                }
               ]
              },
              {
               "name": "animate",
               "children": [
                {"name": "Easing", "size": 17010},
                {"name": "FunctionSequence", "size": 5842},
                {
                 "name": "interpolate",
                 "children": [
                  {"name": "ArrayInterpolator", "size": 1983},
                  {"name": "ColorInterpolator", "size": 2047},
                  {"name": "DateInterpolator", "size": 1375},
                  {"name": "Interpolator", "size": 8746},
                  {"name": "MatrixInterpolator", "size": 2202},
                  {"name": "NumberInterpolator", "size": 1382},
                  {"name": "ObjectInterpolator", "size": 1629},
                  {"name": "PointInterpolator", "size": 1675},
                  {"name": "RectangleInterpolator", "size": 2042}
                 ]
                },
                {"name": "ISchedulable", "size": 1041},
                {"name": "Parallel", "size": 5176},
                {"name": "Pause", "size": 449},
                {"name": "Scheduler", "size": 5593},
                {"name": "Sequence", "size": 5534},
                {"name": "Transition", "size": 9201},
                {"name": "Transitioner", "size": 19975},
                {"name": "TransitionEvent", "size": 1116},
                {"name": "Tween", "size": 6006}
               ]
              },
              {
               "name": "data",
               "children": [
                {
                 "name": "converters",
                 "children": [
                  {"name": "Converters", "size": 721},
                  {"name": "DelimitedTextConverter", "size": 4294},
                  {"name": "GraphMLConverter", "size": 9800},
                  {"name": "IDataConverter", "size": 1314},
                  {"name": "JSONConverter", "size": 2220}
                 ]
                },
                {"name": "DataField", "size": 1759},
                {"name": "DataSchema", "size": 2165},
                {"name": "DataSet", "size": 586},
                {"name": "DataSource", "size": 3331},
                {"name": "DataTable", "size": 772},
                {"name": "DataUtil", "size": 3322}
               ]
              },
              {
               "name": "display",
               "children": [
                {"name": "DirtySprite", "size": 8833},
                {"name": "LineSprite", "size": 1732},
                {"name": "RectSprite", "size": 3623},
                {"name": "TextSprite", "size": 10066}
               ]
              },
              {
               "name": "flex",
               "children": [
                {"name": "FlareVis", "size": 4116}
               ]
              },
              {
               "name": "physics",
               "children": [
                {"name": "DragForce", "size": 1082},
                {"name": "GravityForce", "size": 1336},
                {"name": "IForce", "size": 319},
                {"name": "NBodyForce", "size": 10498},
                {"name": "Particle", "size": 2822},
                {"name": "Simulation", "size": 9983},
                {"name": "Spring", "size": 2213},
                {"name": "SpringForce", "size": 1681}
               ]
              },
              {
               "name": "query",
               "children": [
                {"name": "AggregateExpression", "size": 1616},
                {"name": "And", "size": 1027},
                {"name": "Arithmetic", "size": 3891},
                {"name": "Average", "size": 891},
                {"name": "BinaryExpression", "size": 2893},
                {"name": "Comparison", "size": 5103},
                {"name": "CompositeExpression", "size": 3677},
                {"name": "Count", "size": 781},
                {"name": "DateUtil", "size": 4141},
                {"name": "Distinct", "size": 933},
                {"name": "Expression", "size": 5130},
                {"name": "ExpressionIterator", "size": 3617},
                {"name": "Fn", "size": 3240},
                {"name": "If", "size": 2732},
                {"name": "IsA", "size": 2039},
                {"name": "Literal", "size": 1214},
                {"name": "Match", "size": 3748},
                {"name": "Maximum", "size": 843},
                {
                 "name": "methods",
                 "children": [
                  {"name": "add", "size": 593},
                  {"name": "and", "size": 330},
                  {"name": "average", "size": 287},
                  {"name": "count", "size": 277},
                  {"name": "distinct", "size": 292},
                  {"name": "div", "size": 595},
                  {"name": "eq", "size": 594},
                  {"name": "fn", "size": 460},
                  {"name": "gt", "size": 603},
                  {"name": "gte", "size": 625},
                  {"name": "iff", "size": 748},
                  {"name": "isa", "size": 461},
                  {"name": "lt", "size": 597},
                  {"name": "lte", "size": 619},
                  {"name": "max", "size": 283},
                  {"name": "min", "size": 283},
                  {"name": "mod", "size": 591},
                  {"name": "mul", "size": 603},
                  {"name": "neq", "size": 599},
                  {"name": "not", "size": 386},
                  {"name": "or", "size": 323},
                  {"name": "orderby", "size": 307},
                  {"name": "range", "size": 772},
                  {"name": "select", "size": 296},
                  {"name": "stddev", "size": 363},
                  {"name": "sub", "size": 600},
                  {"name": "sum", "size": 280},
                  {"name": "update", "size": 307},
                  {"name": "variance", "size": 335},
                  {"name": "where", "size": 299},
                  {"name": "xor", "size": 354},
                  {"name": "_", "size": 264}
                 ]
                },
                {"name": "Minimum", "size": 843},
                {"name": "Not", "size": 1554},
                {"name": "Or", "size": 970},
                {"name": "Query", "size": 13896},
                {"name": "Range", "size": 1594},
                {"name": "StringUtil", "size": 4130},
                {"name": "Sum", "size": 791},
                {"name": "Variable", "size": 1124},
                {"name": "Variance", "size": 1876},
                {"name": "Xor", "size": 1101}
               ]
              },
              {
               "name": "scale",
               "children": [
                {"name": "IScaleMap", "size": 2105},
                {"name": "LinearScale", "size": 1316},
                {"name": "LogScale", "size": 3151},
                {"name": "OrdinalScale", "size": 3770},
                {"name": "QuantileScale", "size": 2435},
                {"name": "QuantitativeScale", "size": 4839},
                {"name": "RootScale", "size": 1756},
                {"name": "Scale", "size": 4268},
                {"name": "ScaleType", "size": 1821},
                {"name": "TimeScale", "size": 5833}
               ]
              },
              {
               "name": "util",
               "children": [
                {"name": "Arrays", "size": 8258},
                {"name": "Colors", "size": 10001},
                {"name": "Dates", "size": 8217},
                {"name": "Displays", "size": 12555},
                {"name": "Filter", "size": 2324},
                {"name": "Geometry", "size": 10993},
                {
                 "name": "heap",
                 "children": [
                  {"name": "FibonacciHeap", "size": 9354},
                  {"name": "HeapNode", "size": 1233}
                 ]
                },
                {"name": "IEvaluable", "size": 335},
                {"name": "IPredicate", "size": 383},
                {"name": "IValueProxy", "size": 874},
                {
                 "name": "math",
                 "children": [
                  {"name": "DenseMatrix", "size": 3165},
                  {"name": "IMatrix", "size": 2815},
                  {"name": "SparseMatrix", "size": 3366}
                 ]
                },
                {"name": "Maths", "size": 17705},
                {"name": "Orientation", "size": 1486},
                {
                 "name": "palette",
                 "children": [
                  {"name": "ColorPalette", "size": 6367},
                  {"name": "Palette", "size": 1229},
                  {"name": "ShapePalette", "size": 2059},
                  {"name": "SizePalette", "size": 2291}
                 ]
                },
                {"name": "Property", "size": 5559},
                {"name": "Shapes", "size": 19118},
                {"name": "Sort", "size": 6887},
                {"name": "Stats", "size": 6557},
                {"name": "Strings", "size": 22026}
               ]
              },
              {
               "name": "vis",
               "children": [
                {
                 "name": "axis",
                 "children": [
                  {"name": "Axes", "size": 1302},
                  {"name": "Axis", "size": 24593},
                  {"name": "AxisGridLine", "size": 652},
                  {"name": "AxisLabel", "size": 636},
                  {"name": "CartesianAxes", "size": 6703}
                 ]
                },
                {
                 "name": "controls",
                 "children": [
                  {"name": "AnchorControl", "size": 2138},
                  {"name": "ClickControl", "size": 3824},
                  {"name": "Control", "size": 1353},
                  {"name": "ControlList", "size": 4665},
                  {"name": "DragControl", "size": 2649},
                  {"name": "ExpandControl", "size": 2832},
                  {"name": "HoverControl", "size": 4896},
                  {"name": "IControl", "size": 763},
                  {"name": "PanZoomControl", "size": 5222},
                  {"name": "SelectionControl", "size": 7862},
                  {"name": "TooltipControl", "size": 8435}
                 ]
                },
                {
                 "name": "data",
                 "children": [
                  {"name": "Data", "size": 20544},
                  {"name": "DataList", "size": 19788},
                  {"name": "DataSprite", "size": 10349},
                  {"name": "EdgeSprite", "size": 3301},
                  {"name": "NodeSprite", "size": 19382},
                  {
                   "name": "render",
                   "children": [
                    {"name": "ArrowType", "size": 698},
                    {"name": "EdgeRenderer", "size": 5569},
                    {"name": "IRenderer", "size": 353},
                    {"name": "ShapeRenderer", "size": 2247}
                   ]
                  },
                  {"name": "ScaleBinding", "size": 11275},
                  {"name": "Tree", "size": 7147},
                  {"name": "TreeBuilder", "size": 9930}
                 ]
                },
                {
                 "name": "events",
                 "children": [
                  {"name": "DataEvent", "size": 2313},
                  {"name": "SelectionEvent", "size": 1880},
                  {"name": "TooltipEvent", "size": 1701},
                  {"name": "VisualizationEvent", "size": 1117}
                 ]
                },
                {
                 "name": "legend",
                 "children": [
                  {"name": "Legend", "size": 20859},
                  {"name": "LegendItem", "size": 4614},
                  {"name": "LegendRange", "size": 10530}
                 ]
                },
                {
                 "name": "operator",
                 "children": [
                  {
                   "name": "distortion",
                   "children": [
                    {"name": "BifocalDistortion", "size": 4461},
                    {"name": "Distortion", "size": 6314},
                    {"name": "FisheyeDistortion", "size": 3444}
                   ]
                  },
                  {
                   "name": "encoder",
                   "children": [
                    {"name": "ColorEncoder", "size": 3179},
                    {"name": "Encoder", "size": 4060},
                    {"name": "PropertyEncoder", "size": 4138},
                    {"name": "ShapeEncoder", "size": 1690},
                    {"name": "SizeEncoder", "size": 1830}
                   ]
                  },
                  {
                   "name": "filter",
                   "children": [
                    {"name": "FisheyeTreeFilter", "size": 5219},
                    {"name": "GraphDistanceFilter", "size": 3165},
                    {"name": "VisibilityFilter", "size": 3509}
                   ]
                  },
                  {"name": "IOperator", "size": 1286},
                  {
                   "name": "label",
                   "children": [
                    {"name": "Labeler", "size": 9956},
                    {"name": "RadialLabeler", "size": 3899},
                    {"name": "StackedAreaLabeler", "size": 3202}
                   ]
                  },
                  {
                   "name": "layout",
                   "children": [
                    {"name": "AxisLayout", "size": 6725},
                    {"name": "BundledEdgeRouter", "size": 3727},
                    {"name": "CircleLayout", "size": 9317},
                    {"name": "CirclePackingLayout", "size": 12003},
                    {"name": "DendrogramLayout", "size": 4853},
                    {"name": "ForceDirectedLayout", "size": 8411},
                    {"name": "IcicleTreeLayout", "size": 4864},
                    {"name": "IndentedTreeLayout", "size": 3174},
                    {"name": "Layout", "size": 7881},
                    {"name": "NodeLinkTreeLayout", "size": 12870},
                    {"name": "PieLayout", "size": 2728},
                    {"name": "RadialTreeLayout", "size": 12348},
                    {"name": "RandomLayout", "size": 870},
                    {"name": "StackedAreaLayout", "size": 9121},
                    {"name": "TreeMapLayout", "size": 9191}
                   ]
                  },
                  {"name": "Operator", "size": 2490},
                  {"name": "OperatorList", "size": 5248},
                  {"name": "OperatorSequence", "size": 4190},
                  {"name": "OperatorSwitch", "size": 2581},
                  {"name": "SortOperator", "size": 2023}
                 ]
                },
                {"name": "Visualization", "size": 16540}
               ]
              }
             ]
         };

function toDegrees(rad) {
    let deg = rad * 180 / Math.PI;
    return deg > 359 ? deg % 360 : deg;
}

const Chart = React.createClass({
    componentDidMount(){

    },
    renderLabels(){

    },
    handleMouseOver(e) {
        let path = e.target.getAttribute("data-path"),
            name = e.target.getAttribute("data-name"),
            size = e.target.getAttribute("data-value"),
            total = this.svg.getAttribute("data-total"),
            slices = this.svg.querySelectorAll(`path.slice:not([data-path^='${path}'])`);

        let i = -1,
            n = slices.length;

        while(++i < n) slices[i].style.opacity = "0.3";

        this.details.textContent = name;
        this.percentage.textContent = `${(size * 100 / total).toFixed(2)}%`;
    },
    handleMouseOut(e) {
        let slices = this.svg.querySelectorAll("path.slice");

        let i = -1,
            n = slices.length;

        while(++i < n) slices[i].style.opacity = "1";

        this.details.textContent = "";
        this.percentage.textContent = "";
    },

    computeTextRotation(d) {
      var x = d3.scale.linear()
      .range([0, 2 * Math.PI]);

      var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
      console.log("WHAT IS THIS???>?>?>?", d)
      return (ang > 90) ? 180 + ang : ang;
      },

    // computeTextRotation(d) {
    //   var x = d3.scale.linear()
    //   .range([0, 2 * Math.PI]);
    //
    //   // var y = d3.scale.linear()
    //   // .range([0, radius]);
    //
    //   return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    // },
    render() {
        let width = 600,
            height = 600,
            radius = 400,
            donutRadius = 100,
            transform = `translate(${width * 0.45},${0.55 * height})`,
            // transform2 = function(d) { return "rotate(" + computeTextRotation(d) + ")"; }

            // transform2 = "rotate(" + this.computeTextRotation(dUse) + ")"
            slices = utils.flatten(utils.findSum(data)),
            // slices = utils.findSum(data),
            scale = scaleLinear().domain([0, slices[0].size]).range([0, 2 * Math.PI]),
            shape = arc(),
            depth = utils.depth(data);

        // let path = svg.datum(root).selectAll("path")
        //   .data(partition.nodes)
        //   .enter().append("g")
        //
        // path.append("path")
        //   .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
        //   .attr("d", arc)
        //   .style("stroke", "#fff")
        //   .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
        //   .style("fill-rule", "evenodd")
        //   .each(stash);

        let currentStartAngle = 0,
            currentLevel = 1,
            arcWidth = (radius - donutRadius)/depth,
            levelStartAngle = [0];


        let [labelX, labelY] = shape.centroid(data);
        // x = x0 + r*cos(t)
        // let labelTranslate = `translate(${innerRadius*sin(15)},${innerRadius*scos(15)})`;
        // <text transform={`translate(${(innerRadius + 30)*Math.cos(endAngle-(endAngle*0.01))},${(innerRadius+30)*Math.sin(endAngle-(endAngle*0.01))})`} dy="-10"fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text>
        // <text transform={`translate(${(innerRadius + 30)*Math.cos(startAngle+4.75)},${(innerRadius+30)*Math.sin(startAngle+4.75)})`} dy="-10"fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text>
        // <text transform={`translate(${(innerRadius + 30)*Math.sin(angleToUse-30)},${(innerRadius+30)*Math.cos(angleToUse-30)})`} dy="-10"fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text>
        // <text transform={"rotate(" + this.computeTextRotation(dUse) + ")"} dy="-10"fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text>
        // <text transform={`translate(${(innerRadius + 30)*Math.cos((endAngle-startAngle/2)+startAngle)},${(innerRadius+30)*Math.sin((endAngle-startAngle/2)+startAngle)})`} dy="-10"fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text>
        // <text transform ="rotate(-45 0 0)" x={(innerRadius + 30)*Math.cos((endAngle-startAngle/2)+startAngle+3)} y={(innerRadius+30)*Math.sin((endAngle-startAngle/2)+startAngle+3)} dy="-10"fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text>
        // <text transform={`rotate(2.5 0 0) translate(${(innerRadius + 30)*Math.cos(startAngle+4.75)},${(innerRadius+30)*Math.sin(startAngle+4.75)})`} dy="-10"fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text>


        let labelTranslate = `translate(${width * 0.05},${0.05 * height})`;

        return (
            <svg ref={(c) => this.svg = c} viewBox={`0 0 ${width} ${height}`} data-total={slices[0].size}>
                <g transform={transform}>
                {slices.map((slice, i) => {
                  console.log("LOOK AT ALL OF THE COLORS!!!", rmc.getColor())

                    let { level, size, name} = slice,
                        startAngle = currentStartAngle,
                        endAngle = startAngle + scale(slice.size),
                        innerRadius = (slice.level - 1) * arcWidth,
                        outerRadius = innerRadius + arcWidth,
                        midAngle = startAngle + (scale(slice.size))/3.5

                    if (slices[i + 1] && (slices[i + 1].level <= level)) {
                        currentStartAngle = endAngle;
                    }
                    currentLevel = slice.level;

                    let dUse=shape({
                        startAngle,
                        endAngle,
                        innerRadius,
                        outerRadius
                    })

                    let angleToUse = Math.atan2(Math.cos(startAngle), Math.sin(startAngle))

                    console.log("dUsedUsedUsedUsedUse", dUse)
                    var testText;
                    if((endAngle-startAngle)>0.1){
                      console.log("YESYESYESYES")
                      testText = (<text textAnchor="middle" transform={`translate(${(innerRadius + 25)*Math.cos(midAngle +29.9)},${(innerRadius+25)*Math.sin(midAngle +29.9)})`} dy="-10" fontSize="5" fill="black">{slice.name.slice(0, 5)+ '...'}</text> )
                    } else {
                      console.log("nononono", startAngle, endAngle, startAngle-endAngle)

                    }

                    return (
                      <g>
                        <path className="slice" data-path={slice.path}
                            data-value={slice.size}
                            data-name={slice.name}
                            label={slice.name}
                            display={i === 0 ? "none" : "inline"}
                            fill={rmc.getColor()}
                            d={dUse} onMouseOver={this.handleMouseOver}
                            onMouseOut={this.handleMouseOut}>
                            <title>{`${slice.name}\n${slice.size}`}</title>
                          </path>
                            {testText}
                        </g>
                    );
                })}
                </g>
                <text transform={transform} ref={(c) => this.details = c}
                    textAnchor="middle" className="details" dy={-10}/>
                <text transform={transform} ref={(c) => this.percentage = c}
                    textAnchor="middle" className="details-percentage" dy={10}/>
            </svg>
        );
    }
});
export default Chart

// ReactDOM.render(<Chart/>, document.getElementById("main"));
