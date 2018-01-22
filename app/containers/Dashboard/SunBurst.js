// import React, {PropTypes} from 'react'
// import ReactDOM from 'react-dom'
// import Chart from './src/main';
//
//
// const SunBurstChart = React.createClass ({
//
//   render: function () {
//     console.log("Last hope")
//     return (
//     <Chart/>
//     )
//   }
//
// })
//
// export default SunBurstChart

import rd3 from 'react-d3-library';
import ReactFauxDOM from 'react-faux-dom'
import * as d3 from "d3";
import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
var data = require('./sundata.json');
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {getQuestionData} from 'helpers/dashboard'

// var data

// getQuestionData(4)
// .then((data) => {
// data = data
// })
// .catch((error) => console.log("Error in getting Question 4 data:", error))
// var data = {
//  "name": "",
//  "children": [
//   {
//    "name": "analytics",
//    "children": [
//     {
//      "name": "cluster",
//      "children": [
//       {"name": "AgglomerativeCluster", "size": 3938},
//       {"name": "CommunityStructure", "size": 3812},
//       {"name": "HierarchicalCluster", "size": 6714},
//       {"name": "MergeEdge", "size": 743}
//      ]
//     },
//     {
//      "name": "graph",
//      "children": [
//       {"name": "BetweennessCentrality", "size": 3534},
//       {"name": "LinkDistance", "size": 5731},
//       {"name": "MaxFlowMinCut", "size": 7840},
//       {"name": "ShortestPaths", "size": 5914},
//       {"name": "SpanningTree", "size": 3416}
//      ]
//     },
//     {
//      "name": "optimization",
//      "children": [
//       {"name": "AspectRatioBanker", "size": 7074}
//      ]
//     }
//    ]
//   },
//   {
//    "name": "animate",
//    "children": [
//     {"name": "Easing", "size": 17010},
//     {"name": "FunctionSequence", "size": 5842},
//     {
//      "name": "interpolate",
//      "children": [
//       {"name": "ArrayInterpolator", "size": 1983},
//       {"name": "ColorInterpolator", "size": 2047},
//       {"name": "DateInterpolator", "size": 1375},
//       {"name": "Interpolator", "size": 8746},
//       {"name": "MatrixInterpolator", "size": 2202},
//       {"name": "NumberInterpolator", "size": 1382},
//       {"name": "ObjectInterpolator", "size": 1629},
//       {"name": "PointInterpolator", "size": 1675},
//       {"name": "RectangleInterpolator", "size": 2042}
//      ]
//     },
//     {"name": "ISchedulable", "size": 1041},
//     {"name": "Parallel", "size": 5176},
//     {"name": "Pause", "size": 449},
//     {"name": "Scheduler", "size": 5593},
//     {"name": "Sequence", "size": 5534},
//     {"name": "Transition", "size": 9201},
//     {"name": "Transitioner", "size": 19975},
//     {"name": "TransitionEvent", "size": 1116},
//     {"name": "Tween", "size": 6006}
//    ]
//   },
//   {
//    "name": "data",
//    "children": [
//     {
//      "name": "converters",
//      "children": [
//       {"name": "Converters", "size": 721},
//       {"name": "DelimitedTextConverter", "size": 4294},
//       {"name": "GraphMLConverter", "size": 9800},
//       {"name": "IDataConverter", "size": 1314},
//       {"name": "JSONConverter", "size": 2220}
//      ]
//     },
//     {"name": "DataField", "size": 1759},
//     {"name": "DataSchema", "size": 2165},
//     {"name": "DataSet", "size": 586},
//     {"name": "DataSource", "size": 3331},
//     {"name": "DataTable", "size": 772},
//     {"name": "DataUtil", "size": 3322}
//    ]
//   },
//   {
//    "name": "display",
//    "children": [
//     {"name": "DirtySprite", "size": 8833},
//     {"name": "LineSprite", "size": 1732},
//     {"name": "RectSprite", "size": 3623},
//     {"name": "TextSprite", "size": 10066}
//    ]
//   },
//   {
//    "name": "flex",
//    "children": [
//     {"name": "FlareVis", "size": 4116}
//    ]
//   },
//   {
//    "name": "physics",
//    "children": [
//     {"name": "DragForce", "size": 1082},
//     {"name": "GravityForce", "size": 1336},
//     {"name": "IForce", "size": 319},
//     {"name": "NBodyForce", "size": 10498},
//     {"name": "Particle", "size": 2822},
//     {"name": "Simulation", "size": 9983},
//     {"name": "Spring", "size": 2213},
//     {"name": "SpringForce", "size": 1681}
//    ]
//   },
//   {
//    "name": "query",
//    "children": [
//     {"name": "AggregateExpression", "size": 1616},
//     {"name": "And", "size": 1027},
//     {"name": "Arithmetic", "size": 3891},
//     {"name": "Average", "size": 891},
//     {"name": "BinaryExpression", "size": 2893},
//     {"name": "Comparison", "size": 5103},
//     {"name": "CompositeExpression", "size": 3677},
//     {"name": "Count", "size": 781},
//     {"name": "DateUtil", "size": 4141},
//     {"name": "Distinct", "size": 933},
//     {"name": "Expression", "size": 5130},
//     {"name": "ExpressionIterator", "size": 3617},
//     {"name": "Fn", "size": 3240},
//     {"name": "If", "size": 2732},
//     {"name": "IsA", "size": 2039},
//     {"name": "Literal", "size": 1214},
//     {"name": "Match", "size": 3748},
//     {"name": "Maximum", "size": 843},
//     {
//      "name": "methods",
//      "children": [
//       {"name": "add", "size": 593},
//       {"name": "and", "size": 330},
//       {"name": "average", "size": 287},
//       {"name": "count", "size": 277},
//       {"name": "distinct", "size": 292},
//       {"name": "div", "size": 595},
//       {"name": "eq", "size": 594},
//       {"name": "fn", "size": 460},
//       {"name": "gt", "size": 603},
//       {"name": "gte", "size": 625},
//       {"name": "iff", "size": 748},
//       {"name": "isa", "size": 461},
//       {"name": "lt", "size": 597},
//       {"name": "lte", "size": 619},
//       {"name": "max", "size": 283},
//       {"name": "min", "size": 283},
//       {"name": "mod", "size": 591},
//       {"name": "mul", "size": 603},
//       {"name": "neq", "size": 599},
//       {"name": "not", "size": 386},
//       {"name": "or", "size": 323},
//       {"name": "orderby", "size": 307},
//       {"name": "range", "size": 772},
//       {"name": "select", "size": 296},
//       {"name": "stddev", "size": 363},
//       {"name": "sub", "size": 600},
//       {"name": "sum", "size": 280},
//       {"name": "update", "size": 307},
//       {"name": "variance", "size": 335},
//       {"name": "where", "size": 299},
//       {"name": "xor", "size": 354},
//       {"name": "_", "size": 264}
//      ]
//     },
//     {"name": "Minimum", "size": 843},
//     {"name": "Not", "size": 1554},
//     {"name": "Or", "size": 970},
//     {"name": "Query", "size": 13896},
//     {"name": "Range", "size": 1594},
//     {"name": "StringUtil", "size": 4130},
//     {"name": "Sum", "size": 791},
//     {"name": "Variable", "size": 1124},
//     {"name": "Variance", "size": 1876},
//     {"name": "Xor", "size": 1101}
//    ]
//   },
//   {
//    "name": "scale",
//    "children": [
//     {"name": "IScaleMap", "size": 2105},
//     {"name": "LinearScale", "size": 1316},
//     {"name": "LogScale", "size": 3151},
//     {"name": "OrdinalScale", "size": 3770},
//     {"name": "QuantileScale", "size": 2435},
//     {"name": "QuantitativeScale", "size": 4839},
//     {"name": "RootScale", "size": 1756},
//     {"name": "Scale", "size": 4268},
//     {"name": "ScaleType", "size": 1821},
//     {"name": "TimeScale", "size": 5833}
//    ]
//   },
//   {
//    "name": "util",
//    "children": [
//     {"name": "Arrays", "size": 8258},
//     {"name": "Colors", "size": 10001},
//     {"name": "Dates", "size": 8217},
//     {"name": "Displays", "size": 12555},
//     {"name": "Filter", "size": 2324},
//     {"name": "Geometry", "size": 10993},
//     {
//      "name": "heap",
//      "children": [
//       {"name": "FibonacciHeap", "size": 9354},
//       {"name": "HeapNode", "size": 1233}
//      ]
//     },
//     {"name": "IEvaluable", "size": 335},
//     {"name": "IPredicate", "size": 383},
//     {"name": "IValueProxy", "size": 874},
//     {
//      "name": "math",
//      "children": [
//       {"name": "DenseMatrix", "size": 3165},
//       {"name": "IMatrix", "size": 2815},
//       {"name": "SparseMatrix", "size": 3366}
//      ]
//     },
//     {"name": "Maths", "size": 17705},
//     {"name": "Orientation", "size": 1486},
//     {
//      "name": "palette",
//      "children": [
//       {"name": "ColorPalette", "size": 6367},
//       {"name": "Palette", "size": 1229},
//       {"name": "ShapePalette", "size": 2059},
//       {"name": "SizePalette", "size": 2291}
//      ]
//     },
//     {"name": "Property", "size": 5559},
//     {"name": "Shapes", "size": 19118},
//     {"name": "Sort", "size": 6887},
//     {"name": "Stats", "size": 6557},
//     {"name": "Strings", "size": 22026}
//    ]
//   },
//   {
//    "name": "vis",
//    "children": [
//     {
//      "name": "axis",
//      "children": [
//       {"name": "Axes", "size": 1302},
//       {"name": "Axis", "size": 24593},
//       {"name": "AxisGridLine", "size": 652},
//       {"name": "AxisLabel", "size": 636},
//       {"name": "CartesianAxes", "size": 6703}
//      ]
//     },
//     {
//      "name": "controls",
//      "children": [
//       {"name": "AnchorControl", "size": 2138},
//       {"name": "ClickControl", "size": 3824},
//       {"name": "Control", "size": 1353},
//       {"name": "ControlList", "size": 4665},
//       {"name": "DragControl", "size": 2649},
//       {"name": "ExpandControl", "size": 2832},
//       {"name": "HoverControl", "size": 4896},
//       {"name": "IControl", "size": 763},
//       {"name": "PanZoomControl", "size": 5222},
//       {"name": "SelectionControl", "size": 7862},
//       {"name": "TooltipControl", "size": 8435}
//      ]
//     },
//     {
//      "name": "data",
//      "children": [
//       {"name": "Data", "size": 20544},
//       {"name": "DataList", "size": 19788},
//       {"name": "DataSprite", "size": 10349},
//       {"name": "EdgeSprite", "size": 3301},
//       {"name": "NodeSprite", "size": 19382},
//       {
//        "name": "render",
//        "children": [
//         {"name": "ArrowType", "size": 698},
//         {"name": "EdgeRenderer", "size": 5569},
//         {"name": "IRenderer", "size": 353},
//         {"name": "ShapeRenderer", "size": 2247}
//        ]
//       },
//       {"name": "ScaleBinding", "size": 11275},
//       {"name": "Tree", "size": 7147},
//       {"name": "TreeBuilder", "size": 9930}
//      ]
//     },
//     {
//      "name": "events",
//      "children": [
//       {"name": "DataEvent", "size": 2313},
//       {"name": "SelectionEvent", "size": 1880},
//       {"name": "TooltipEvent", "size": 1701},
//       {"name": "VisualizationEvent", "size": 1117}
//      ]
//     },
//     {
//      "name": "legend",
//      "children": [
//       {"name": "Legend", "size": 20859},
//       {"name": "LegendItem", "size": 4614},
//       {"name": "LegendRange", "size": 10530}
//      ]
//     },
//     {
//      "name": "operator",
//      "children": [
//       {
//        "name": "distortion",
//        "children": [
//         {"name": "BifocalDistortion", "size": 4461},
//         {"name": "Distortion", "size": 6314},
//         {"name": "FisheyeDistortion", "size": 3444}
//        ]
//       },
//       {
//        "name": "encoder",
//        "children": [
//         {"name": "ColorEncoder", "size": 3179},
//         {"name": "Encoder", "size": 4060},
//         {"name": "PropertyEncoder", "size": 4138},
//         {"name": "ShapeEncoder", "size": 1690},
//         {"name": "SizeEncoder", "size": 1830}
//        ]
//       },
//       {
//        "name": "filter",
//        "children": [
//         {"name": "FisheyeTreeFilter", "size": 5219},
//         {"name": "GraphDistanceFilter", "size": 3165},
//         {"name": "VisibilityFilter", "size": 3509}
//        ]
//       },
//       {"name": "IOperator", "size": 1286},
//       {
//        "name": "label",
//        "children": [
//         {"name": "Labeler", "size": 9956},
//         {"name": "RadialLabeler", "size": 3899},
//         {"name": "StackedAreaLabeler", "size": 3202}
//        ]
//       },
//       {
//        "name": "layout",
//        "children": [
//         {"name": "AxisLayout", "size": 6725},
//         {"name": "BundledEdgeRouter", "size": 3727},
//         {"name": "CircleLayout", "size": 9317},
//         {"name": "CirclePackingLayout", "size": 12003},
//         {"name": "DendrogramLayout", "size": 4853},
//         {"name": "ForceDirectedLayout", "size": 8411},
//         {"name": "IcicleTreeLayout", "size": 4864},
//         {"name": "IndentedTreeLayout", "size": 3174},
//         {"name": "Layout", "size": 7881},
//         {"name": "NodeLinkTreeLayout", "size": 12870},
//         {"name": "PieLayout", "size": 2728},
//         {"name": "RadialTreeLayout", "size": 12348},
//         {"name": "RandomLayout", "size": 870},
//         {"name": "StackedAreaLayout", "size": 9121},
//         {"name": "TreeMapLayout", "size": 9191}
//        ]
//       },
//       {"name": "Operator", "size": 2490},
//       {"name": "OperatorList", "size": 5248},
//       {"name": "OperatorSequence", "size": 4190},
//       {"name": "OperatorSwitch", "size": 2581},
//       {"name": "SortOperator", "size": 2023}
//      ]
//     },
//     {"name": "Visualization", "size": 16540}
//    ]
//   }
//  ]
// }

// var data =
// {"name": "",
//   "children": [{
//     "name":"Linux",
//     "children":[
//       {"name":"NIST",
//         "children":[
//           {"name":"Access Control",
//             "children":[
//               {"name":"high","size":15},
//               {"name":"low","size":50},{"name":"med","size":132},
//               {"name":"pass","size":190}]},
//           {"name":"Audit And Accountability",
//             "children":[
//               {"name":"high","size":4},
//               {"name":"low","size":119},
//               {"name":"med","size":60},
//               {"name":"pass","size":186}]},
//           {"name":"Configuration Management",
//             "children":[
//               {"name":"high","size":19},
//               {"name":"low","size":138},
//               {"name":"med","size":131},
//               {"name":"pass","size":288}]},
//           {"name":"Contingency Planning",
//             "children":[{"name":"high","size":0},
//               {"name":"low","size":5},
//               {"name":"med","size":5},
//               {"name":"pass","size":8}]},
//           {"name":"Identification And Authentication",
//             "children":[
//               {"name":"high","size":10},
//               {"name":"low","size":26},
//               {"name":"med","size":46},
//               {"name":"pass","size":98}]},
//           {"name":"Maintenance",
//             "children":[
//               {"name":"high","size":4},
//               {"name":"low","size":6},
//               {"name":"med","size":0},
//               {"name":"pass","size":8}]},
//           {"name":"Risk Assessment",
//             "children":[
//               {"name":"high","size":0},
//               {"name":"low","size":0},
//               {"name":"med","size":5},
//               {"name":"pass","size":4}]},
//           {"name":"Security Assessment And Authorization",
//             "children":[
//               {"name":"high","size":0},
//               {"name":"low","size":0},
//               {"name":"med","size":4},
//               {"name":"pass","size":5}]},
//           {"name":"System And Communications Protection",
//             "children":[
//               {"name":"high","size":0},
//               {"name":"low","size":11},
//               {"name":"med","size":7},
//               {"name":"pass","size":18}]},
//           {"name":"System And Information Integrity",
//             "children":[
//               {"name":"high","size":0},
//               {"name":"low","size":0},
//               {"name":"med","size":4},
//               {"name":"pass","size":5}
//             ]
//           }
//         ]
//       }
//     ]
//   }]
// }

// var data =
// {"name": "",
//   "children":[{"name":"Linux",
// "children":[{"name":"NIST",
//              "children":[{"name":"Access Control",
//                          "children":[{"name":"high","size":28},{"name":"low","size":91},{"name":"med","size":255},{"name":"pass","size":314}]},
//                          {"name":"Audit And Accountability",
//                          "children":[{"name":"high","size":7},{"name":"low","size":215},{"name":"med","size":107},{"name":"pass","size":327}]},{"name":"Configuration Management","children":[{"name":"high","size":31},{"name":"low","size":245},{"name":"med","size":232},{"name":"pass","size":516}]},
//                          {"name":"Contingency Planning",
//                          "children":[{"name":"high","size":0},{"name":"low","size":8},{"name":"med","size":10},{"name":"pass","size":14}]},
//                          {"name":"Identification And Authentication",
//                          "children":[{"name":"high","size":16},{"name":"low","size":54},{"name":"med","size":89},{"name":"pass","size":161}]},{"name":"Maintenance","children":[{"name":"high","size":9},{"name":"low","size":8},{"name":"med","size":0},{"name":"pass","size":15}]},
//                          {"name":"Risk Assessment","children":[{"name":"high","size":0},{"name":"low","size":0},{"name":"med","size":8},{"name":"pass","size":8}]},
//                          {"name":"Security Assessment And Authorization",
//                          "children":[{"name":"high","size":0},{"name":"low","size":0},{"name":"med","size":10},{"name":"pass","size":6}]},
//                          {"name":"System And Communications Protection",
//                          "children":[{"name":"high","size":0},{"name":"low","size":25},{"name":"med","size":10},{"name":"pass","size":29}]},
//                          {"name":"System And Information Integrity",
//                          "children":[{"name":"high","size":0},{"name":"low","size":0},{"name":"med","size":8},{"name":"pass","size":8}]}]}]},
// {"name":"Microsoft Windows",
// "children":[{"name":"NIST",
//              "children":[{"name":"Access Control",
//                          "children":[{"name":"high","size":2},{"name":"low",'children':[], "size":7},{"name":"med","size":9},{"name":"pass","size":25}]},
//                          {"name":"Audit And Accountability",
//                          "children":[{"name":"high","size":0},{"name":"low","size":16},{"name":"med","size":6},{"name":"pass","size":19}]},
//                          {"name":"Configuration Management",
//                          "children":[{"name":"high","size":3},{"name":"low","size":16},{"name":"med","size":20},{"name":"pass","size":25}]},
//                          {"name":"Contingency Planning",
//                          "children":[{"name":"high","size":0},{"name":"low","size":1},{"name":"med","size":1},{"name":"pass","size":0}]},
//                          {"name":"Identification And Authentication",
//                          "children":[{"name":"high","size":0},{"name":"low","size":5},{"name":"med","size":6},{"name":"pass","size":9}]},
//                          {"name":"Maintenance",
//                          "children":[{"name":"high","size":0},{"name":"low","size":1},{"name":"med","size":0},{"name":"pass","size":1}]},
//                          {"name":"Risk Assessment",
//                          "children":[{"name":"high","size":0},{"name":"low","size":0},{"name":"med","size":0},{"name":"pass","size":1}]},
//                          {"name":"Security Assessment And Authorization",
//                          "children":[{"name":"high","size":0},{"name":"low","size":0},{"name":"med","size":1},{"name":"pass","size":0}]},
//                          {"name":"System And Communications Protection",
//                          "children":[{"name":"high","size":0},{"name":"low","size":1},{"name":"med","size":0},{"name":"pass","size":3}]},
//                          {"name":"System And Information Integrity",
//                          "children":[{"name":"high","size":0},{"name":"low","size":0},{"name":"med","size":1},{"name":"pass","size":0}]}]}]}]
// }

// function createSunburst() {
//   var node = document.createElement('div')
//   node.setAttribute("id", "sunburstDiv")
//
//     var width = 1280,
//         height = 1200,
//         radius = (Math.min(width, height) / 2) - 10;
//
//     var formatNumber = d3.format(",d");
//
//     var x = d3.scale.linear()
//         .range([0, 2 * Math.PI]);
//
//     var y = d3.scale.sqrt()
//         .range([0, radius]);
//
//     // var color = d3.scale.category20c();
//     // const color = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E']);
//     // const color = d3.scale.ordinal().range(['#00C484', '#F9C73D', '#29ABE2', '#FF444D', '#E91E63', '#9C27B0', '#3F51B5', '#009688'].reverse());
//
//     const color = d3.scale.ordinal().range(['#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548','#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E','#00C484', '#F9C73D', '#29ABE2', '#FF444D', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4'].reverse());
//
//
//     // const color = d3.scale.ordinal().range(["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"]);
//     var partition = d3.layout.partition()
//         .value(function(d) { return d.size; });
//
//     // var nodes = partition.nodes(data)
//     //   .filter(function(d) {
//     //     console.log("partitionnodes", d)
//     //   return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
//     //   });
//     //
//     // var uniqueNames = (function(a) {
//     //   var output = [];
//     //   a.forEach(function(d) {
//     //     if (output.indexOf(d.name) === -1) {
//     //       output.push(d.name);
//     //     }
//     //   });
//     //   return output;
//     // })(nodes);
//     //
//     // color.domain(uniqueNames);
//
//     var arc = d3.svg.arc()
//         .startAngle(function(d) {console.log("dddddddddd1", d); if(d){return Math.max(0, Math.min(2 * Math.PI, x(d.x))); }})
//         .endAngle(function(d) {console.log("dddddddddd2", d); if(d){return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); }})
//         .innerRadius(function(d) {console.log("dddddddddd3", d); if(d){return Math.max(0, y(d.y));}})
//         .outerRadius(function(d) {console.log("dddddddddd4", d); if(d){return Math.max(0, y(d.y + d.dy));}});
//
//     var svg = d3.select(node).append("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .append("g")
//         .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");
//
//       svg.on("mouseout", function(d) {
//         d3.selectAll("path")
//             // .transition()
//             // .duration(1000)
//             .style("opacity", 1)
//             // .each("end", function() {
//             //         d3.select(this).on("mouseover", mouseover);
//             // });
//         d3.select("#sunburstText")
//           .style("opacity", 0)
//         d3.select("#sunburstPercent")
//           .style("opacity", 0)
//         d3.select("#sunburstNumber")
//           .style("opacity", 0)
//       });
//
//       var root = data;
//
//       var g = svg.selectAll("g")
//           .data(partition.nodes(root))
//         .enter().append("g");
//
//       var path = g.append("path")
//         .attr("id","sunburstPath")
//         .style("opacity", 1)
//         .attr("d", arc)
//         // .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
//         .style("fill", function(d) { return color(d.name); })
//         .style("stroke", "#fff")
//         .on("mouseover", mouseover)
//
//         var tooltip = d3.select(node)
//       		.append("div")
//       		.attr("class", "tooltip")
//       		.style("position", "absolute")
//       		.style("z-index", "10")
//       		.style("opacity", 0);
//
//         var text = g.append("text")
//              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
//              .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
//              .attr("dx", function (d) { return computeTextRotation(d) > 180 ? "25" : "-20"; }) // margin
//              .attr("dy", ".35em") // vertical-align
//              .style("font-size", "14px")
//              .text(function(d) {return d.dx < 0.005? "" : d.name.length < 5 ? d.name : d.name.slice(0, 6)+"..."; });
//
//         g.append("text")
//         // .html(function(d) {return "<p>" + d.name + "<p>"})
//            .attr("id","sunburstText")
//            .attr("text-anchor", "middle")
//            .attr("font-size", "30")
//            .attr("dy", "-25")
//            .style("z-index", "10")
//           //  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; });
//         g.append("text")
//            .attr("id","sunburstNumber")
//            .attr("text-anchor", "middle")
//            .attr("font-size", "16")
//            .style("z-index", "10")
//          g.append("text")
//             .attr("id","sunburstPercent")
//             .attr("text-anchor", "middle")
//             .attr("dy", "25")
//             .attr("font-size", "16")
//             .style("z-index", "10")
//
//         var totalSize = path.datum().value;
//
//         function arcTween(d) {
//           var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
//               yd = d3.interpolate(y.domain(), [d.y, 1]),
//               yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
//           return function(d, i) {
//             return i
//                 ? function(t) { return arc(d); }
//                 : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
//           };
//         }
//
//         function computeTextRotation(d) {
//             var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
//             return (ang > 90) ? 180 + ang : ang;
//         }
//
//         function mouseover(d) {
//           var percentage = (100 * d.value / totalSize).toPrecision(3);
//           var percentageString = percentage + "%";
//           if (percentage < 0.1) {
//             percentageString = "< 0.1%";
//           }
//           console.log("percentageString", d, percentageString)
//           // var percentages = d3.select("#percentage")
//           // percentages.text('percentageString');
//           let test = d
//
//           // let g = d3.select("#sunburstDiv svg g text")
//           let sunburstText = d3.select("#sunburstText")
//           console.log("sunburstText", sunburstText)
//           sunburstText.attr("text-anchor", "middle")
//             .style("opacity", 1)
//              .text(`${d.name}`)
//             //  .text(d.name)
//
//             // .text(function(d) {
//             //     let
//             //     return (<div><div>d.name</div><div>d.value</div><div>percentageString</div></div>)
//             // });
//
//             let sunburstNumber = d3.select("#sunburstNumber")
//             console.log("sunburstText", sunburstNumber)
//
//             sunburstNumber.attr("text-anchor", "middle")
//               .style("opacity", 1)
//               .text(`${d.value} Devices`)
//
//              let sunburstPercent = d3.select("#sunburstPercent")
//              console.log("sunburstText", sunburstPercent)
//              sunburstPercent.attr("text-anchor", "middle")
//                .style("opacity", 1)
//                .text(`${percentageString} of Total Devices`)
//
//           d3.select("#explanation")
//               .style("visibility", "");
//
//           var sequenceArray = getAncestors(d);
//
//           // Fade all the segments.
//           d3.selectAll("path")
//               .style("opacity", 0.3);
//
//           // Then highlight only those that are an ancestor of the current segment.
//           d3.selectAll("path")
//               .filter(function(node) {
//                         return (sequenceArray.indexOf(node) >= 0);
//                       })
//               .style("opacity", 1);
//
//               // tooltip.html("d.name")
//         }
//
//         function getAncestors(node) {
//           var path = [];
//           var current = node;
//           while (current.parent) {
//             path.unshift(current);
//             current = current.parent;
//           }
//           return path;
//         }
//
//         svg.on("mount", function(){
//          applyTransition()
//         });
//
//         function applyTransition() {
//         console.log("APPLY transition")
//             d3.selectAll("path")
//             // .on("click", click)
//                 .transition()
//                 .duration(500)
//                 .delay(function(d) { return d * 40; })
//                 function click(d) {
//                     var path = d3.select(this);
//                   path.transition()
//                     .duration(750)
//                     .attrTween("d", arcTween(d))
//                     .each("end", function(e, i) {
//                         // check if the animated element's data e lies within the visible angle span given in d
//                         if (e.x >= d.x && e.x < (d.x + d.dx)) {
//                           // get a selection of the associated text element
//                           var arcText = d3.select(this.parentNode).select("text");
//                           // fade in the text element and recalculate positions
//                           arcText.transition().duration(750)
//                             .attr("opacity", 1)
//                             .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
//                             .attr("x", function(d) { return y(d.y); });
//                         }
//                     });
//                 }
//         }
//       d3.select(self.frameElement).style("height", height + "px");
//       return node;
// }

const SunBurstChart = React.createClass ({
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
        d3: this.createSunburst(nextProps.data)
      })
    // }
    // this.createSunburst(nextProps.data)
  },
  componentDidMount() {
  this.setState({d3: this.createSunburst(this.state.data)});
  },

  createSunburst(datas) {
    // var sequence = document.createElement('div')
    // node.setAttribute("id", "sequence")

    var node = document.createElement('div')
    node.setAttribute("id", "sunburstDiv")
    

    // var data = this.state.data;
    var data = datas

    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

      var width = 1280,
          height = 1200,
          radius = (Math.min(width, height) / 2) - 10;

      var formatNumber = d3.format(",d");

      var x = d3.scale.linear()
          .range([0, 2 * Math.PI]);

      var y = d3.scale.sqrt()
          .range([0, radius]);

      // var color = d3.scale.category20c();
      // const color = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E']);
      // const color = d3.scale.ordinal().range(['#00C484', '#F9C73D', '#29ABE2', '#FF444D', '#E91E63', '#9C27B0', '#3F51B5', '#009688'].reverse());

      const color = d3.scale.ordinal().range(['#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548','#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E','#00C484', '#F9C73D', '#29ABE2', '#FF444D', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4'].reverse());


      // const color = d3.scale.ordinal().range(["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"]);
      var partition = d3.layout.partition()
          .value(function(d) { return d.size; });

      // var nodes = partition.nodes(data)
      //   .filter(function(d) {
      //     console.log("partitionnodes", d)
      //   return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      //   });
      //
      // var uniqueNames = (function(a) {
      //   var output = [];
      //   a.forEach(function(d) {
      //     if (output.indexOf(d.name) === -1) {
      //       output.push(d.name);
      //     }
      //   });
      //   return output;
      // })(nodes);
      //
      // color.domain(uniqueNames);
      var sequence = d3.select(node).append("div")
          .attr("id", "sequence")
          .style("height", "50px")
          // .attr("padding", "30px")


      var arc = d3.svg.arc()
          .startAngle(function(d) {console.log("dddddddddd1", d); if(d){return Math.max(0, Math.min(2 * Math.PI, x(d.x))); }})
          .endAngle(function(d) {console.log("dddddddddd2", d); if(d){return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); }})
          .innerRadius(function(d) {console.log("dddddddddd3", d); if(d){return Math.max(0, y(d.y));}})
          .outerRadius(function(d) {console.log("dddddddddd4", d); if(d){return Math.max(0, y(d.y + d.dy));}});

      var svg = d3.select(node).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

          initializeBreadcrumbTrail();

        svg.on("mouseout", function(d) {
          d3.selectAll("path")
              // .transition()
              // .duration(1000)
              .style("opacity", 1)
              // .each("end", function() {
              //         d3.select(this).on("mouseover", mouseover);
              // });
          d3.select("#sunburstText")
            .style("opacity", 0)
          d3.select("#sunburstPercent")
            .style("opacity", 0)
          d3.select("#sunburstNumber")
            .style("opacity", 0)
          d3.select("#trail")
            .style("visibility", "hidden");
        });

        var root = data;

        var g = svg.selectAll("g")
            .data(partition.nodes(root))
          .enter().append("g");

        var path = g.append("path")
          .attr("id","sunburstPath")
          .style("opacity", 1)
          .attr("d", arc)
          // .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
          .style("fill", function(d) { return color(d.name); })
          .style("stroke", "#fff")
          .on("mouseover", mouseover)

          var tooltip = d3.select(node)
        		.append("div")
        		.attr("class", "tooltip")
        		.style("position", "absolute")
        		.style("z-index", "10")
        		.style("opacity", 0);

          var text = g.append("text")
               .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
               .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
               .attr("dx", function (d) { return computeTextRotation(d) > 180 ? "25" : "-20"; }) // margin
               .attr("dy", ".35em") // vertical-align
               .style("font-size", "14px")
               .text(function(d) {return d.dx < 0.005? "" : d.name.length < 5 ? d.name : d.name.slice(0, 6)+"..."; });

          g.append("text")
          // .html(function(d) {return "<p>" + d.name + "<p>"})
             .attr("id","sunburstText")
             .attr("text-anchor", "middle")
             .attr("font-size", "30")
             .attr("dy", "-25")
             .style("z-index", "10")
            //  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; });
          g.append("text")
             .attr("id","sunburstNumber")
             .attr("text-anchor", "middle")
             .attr("font-size", "16")
             .style("z-index", "10")
           g.append("text")
              .attr("id","sunburstPercent")
              .attr("text-anchor", "middle")
              .attr("dy", "25")
              .attr("font-size", "16")
              .style("z-index", "10")

          var totalSize = path.datum().value;

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

          function computeTextRotation(d) {
              var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
              return (ang > 90) ? 180 + ang : ang;
          }

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

          function mouseover(d) {
            var percentage = (100 * d.value / totalSize).toPrecision(3);
            var percentageString = percentage + "%";
            if (percentage < 0.1) {
              percentageString = "< 0.1%";
            }
            console.log("percentageString", d, percentageString)
            // var percentages = d3.select("#percentage")
            // percentages.text('percentageString');
            let test = d

            // let g = d3.select("#sunburstDiv svg g text")
            let sunburstText = d3.select("#sunburstText")
            console.log("sunburstText", sunburstText)
            sunburstText.attr("text-anchor", "middle")
              .style("opacity", 1)
               .text(`${d.name}`)
              //  .text(d.name)

              // .text(function(d) {
              //     let
              //     return (<div><div>d.name</div><div>d.value</div><div>percentageString</div></div>)
              // });

              let sunburstNumber = d3.select("#sunburstNumber")
              console.log("sunburstText", sunburstNumber)

              sunburstNumber.attr("text-anchor", "middle")
                .style("opacity", 1)
                .text(`${d.value} Tests`)

               let sunburstPercent = d3.select("#sunburstPercent")
               console.log("sunburstText", sunburstPercent)
               sunburstPercent.attr("text-anchor", "middle")
                 .style("opacity", 1)
                 .text(`${percentageString} of Total Tests`)

            d3.select("#explanation")
                .style("visibility", "");

            var sequenceArray = getAncestors(d);

            updateBreadcrumbs(sequenceArray, percentageString);

            // Fade all the segments.
            d3.selectAll("path")
                .style("opacity", 0.3);

            // Then highlight only those that are an ancestor of the current segment.
            d3.selectAll("path")
                .filter(function(node) {
                          return (sequenceArray.indexOf(node) >= 0);
                        })
                .style("opacity", 1);

                // tooltip.html("d.name")
          }

          function breadcrumbPoints(d, i) {
            var points = [];
            points.push("0,0");
            points.push(b.w + ",0");
            points.push(b.w + b.t + "," + (b.h / 2));
            points.push(b.w + "," + b.h);
            points.push("0," + b.h);
            if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
              points.push(b.t + "," + (b.h / 2));
            }
            return points.join(" ");
          }

          function updateBreadcrumbs(nodeArray, percentageString) {

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
                .attr("font-weight", "600")
                .attr("fill", "#fff")
                .attr("text-anchor", "middle")
                .text(function(d) { return d.name.length > 5 ? d.name.slice(0,5)+"..." : d.name; });

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
                .text(percentageString);

            // Make the breadcrumb trail visible, if it's hidden.
            d3.select("#trail")
                .style("visibility", "");

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

          // svg.on("mount", function(){
          //  applyTransition()
          // });
          //
          // function applyTransition() {
          // console.log("APPLY transition")
          //     d3.selectAll("path")
          //     // .on("click", click)
          //         .transition()
          //         .duration(500)
          //         .delay(function(d) { return d * 40; })
          //         function click(d) {
          //             var path = d3.select(this);
          //           path.transition()
          //             .duration(750)
          //             .attrTween("d", arcTween(d))
          //             .each("end", function(e, i) {
          //                 // check if the animated element's data e lies within the visible angle span given in d
          //                 if (e.x >= d.x && e.x < (d.x + d.dx)) {
          //                   // get a selection of the associated text element
          //                   var arcText = d3.select(this.parentNode).select("text");
          //                   // fade in the text element and recalculate positions
          //                   arcText.transition().duration(750)
          //                     .attr("opacity", 1)
          //                     .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
          //                     .attr("x", function(d) { return y(d.y); });
          //                 }
          //             });
          //         }
          // }
        // d3.select("#sequence").style("height", height + "px");

        d3.select(self.frameElement).style("height", height + "px");
        return node;
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

export default SunBurstChart
