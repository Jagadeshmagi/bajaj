import React, {PropTypes} from 'react'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Glyphicon } from 'react-bootstrap'

const MultiChart = React.createClass({
  
componentDidMount(){
 var tooltip = d3.select(".tooltip1");
    var container = ('.chart-container'),
        τ = 2 * Math.PI,
        width = 600,
        height = 600,
        innerRadius = Math.min(width,height)/4,
        //innerRadius = (outerRadius/4)*3,
        fontSize = (Math.min(width,height)/4);

var dataset = {
GE: [{"name":"MED","count":600},{"name":"HIGH","count":550},{"name":"LOW","count":550}],
FG: [{"name":"MED","count":100},{"name":"HIGH","count":150},{"name":"LOW","count":180}],

};

var dataset2 = {
GE: [{"name":"M","count":300},{"name":"F","count":400}],
FG: [{"name":"AD","count":400},{"name":"AST","count":100},{"name":"ASTSC","count":80}],
DG: [{"name":"RTD","count":100}],
HI: [{"name":"RTD","count":200},{"name":"DEVCO","count":400},{"name":"ENTR","count":40},{"name":"FPI","count":5}]

};

    
var seriesNames = ["Gender","Function Group","DG"];


var color = d3.scale.ordinal().range(["#29abe2","#f9c73d","#ff444d"]);


//var color = d3.scale.category20();

var pie = d3.layout.pie()
    .value(function(d) { return d.count; })
    .sort(null);

var arc = d3.svg.arc();

var svg = d3.select('.chart-container').append("svg")
        .attr("width", '300')
        .attr("height", '300')
        .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
        .attr('preserveAspectRatio','xMinYMin')
        .append("g")
        .attr("transform", "translate(" +  width / 2 + "," + height / 2 + ")")
        .attr("class", "labels");

var gs = svg.selectAll("g")
        .data(d3.values(dataset))
        .enter()
        .append("g")
        .attr("class", "arc");
        
    
var path = gs.selectAll("path")
    .data(function(d) { return pie(d); })
    .enter().append("path")
    .attr("fill", function(d, i) { return color(i);alert(i) })
    .attr("d", function(d, i, j)
          { return arc.innerRadius(innerRadius+(80*j)).outerRadius(innerRadius+75+(80*j))(d); })
.on("mouseover", function(d,i,j){ 
   //  alert("regenerate chart tween event, aparam:"+d.data.name);
    // tooltip.style("left", d3.event.pageX+10+"px");
    //  tooltip.style("top", d3.event.pageY-25+"px");
    //  tooltip.style("display", "inline-block");
    // tooltip.select("span").text(seriesNames[j]+": " +d.data.name+" " +d.value);
}).on("mouseout",function(){
   // tooltip.style("display","none");
}).on("click",function(d,j){
    console.log(d3.event)
    tooltip.style("left", d3.event.layerX+"px");
     tooltip.style("top", d3.event.layerY+"px");
     tooltip.style("display", "inline-block");
    tooltip.select("span").text(d.data.name+" " +d.value);
});
},
  render() {
    
return(<div><div className="chart-container"></div>
<div className='tooltip1'>
    <span></span>
</div></div>)
  }
})

export default MultiChart




