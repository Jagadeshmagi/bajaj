import React from 'react'
import {Col, Button, btnPrimary, OverlayTrigger, Popover} from 'react-bootstrap'
import {blueBtn} from 'sharedStyles/styles.css'
import {legend, low, medium, high, passed} from './styles.css'

export function Top25ReportHeader (props) {
  let navColorStyle = {
      backgroundColor: '#00C484', border: 0, borderRadius: 0,
      marginBottom: 0, paddingTop: 20,
      color: 'white', fontSize: 24, height: 80, textAlign: 'center'}
  return (
          <div style={navColorStyle}>{props.name}</div>
    )
}

export function ReportTitle (props) {
  let style = {
      fontSize: 24,
      color: '#454855',
      fontWeight: 'bold'
    }
  return (
    <div style={{paddingTop: 20, paddingLeft: 0, height:60}}>
      <Col xs={9} >
        <span style={style}>{props.title}</span>
      </Col>
      <Col xs={3}>
        <Button className={blueBtn} style={{marginRight: 10}}>Archive</Button>
        <Button className={blueBtn} style={{marginLeft: 10,marginRight:10}}>Export</Button>
        <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0, marginLeft: 10,backgroundColor:'#4C58A4'}}>Share</Button>
      </Col>
    </div>
    )
}

export function MetaItem(props) {
  return (
    <tr>
      <td style={{textAlign: 'right', fontWeight: 'bold'}}>{props.title}: </td>
      <td style={{paddingLeft:'20px',textAlign: 'left'}}>{props.desc}</td>
    </tr>
    )
}

export function GraphLegends(){
  return(
     <ul className={legend}>
        <li><span className={low}></span>Low Severity</li>
        <li><span className={medium}></span> Medium Severity</li>
        <li><span className={high}></span>High Severity</li>
        <li><span className={passed}></span>Passed</li>
      </ul>
  )
}

export function GraphLegendsForHorizontal(){
  return(
     <ul className={legend}>
        <li><span style={{marginLeft:23}} className={low}></span>Low Severity</li>
        <li><span style={{marginLeft:23}} className={medium}></span> Medium Severity</li>
        <li><span style={{marginLeft:23}} className={high}></span>High Severity</li>
      </ul>
  )
}

let mycolorCode = '#efefef'
var graphScoreValue = []
export const CircularScoreGraph =  React.createClass({
    getInitialState(){
    return{
      graphScore:''
    }
  },

  componentDidMount(){
    this.setState({graphScore:this.props.score},function(){
       this.scoreCircle();
    })
   
  },

  componentWillReceiveProps(nextProps,nextState){
    if (nextProps.score !== this.props.score){
      this.setState({graphScore:nextProps.score},function(){
        this.deleteScoreCircle();
        this.scoreCircle();
      });
    }
  },

  deleteScoreCircle() {
    document.getElementById('scoreCanvas').innerHTML = "";
    //document.getElementById('scoreSpan').innerHTML = "";
  },

  scoreCircle(){
    graphScoreValue.push(this.props.score)
    // console.log('JHHHHHHHHHHHHHHHHHHHHHHHHHH', graphScoreValue)
    for(var i =0; i<= this.props.id; i++){
    var e2 = document.getElementById('scoreDiv'+i);

    var spanElem = document.getElementById('scoreSpan' + i);
    let myScore = parseInt(this.state.graphScore)
      if( myScore >= 0 && myScore <= 50){
        mycolorCode = '#FF444D'
      }else if(myScore >50 && myScore <=80){
        mycolorCode = '#F9C73D'
      }else if(myScore > 80 && myScore <=100){
        mycolorCode = '#00C484'  
      }

    if (spanElem === null) {
    var span = document.createElement('span');
    span.textContent = graphScoreValue[i];
    span.style.color=mycolorCode;
    span.style.display='block';
    span.style.lineHeight='78px';
    span.style.textAlign='center';
    span.style.width='80px';
    span.style.fontFamily='Source Sans Pro';
    span.style.fontSize='25px';
    span.style.fontWeight=800;
    span.style. marginLeft='50px';
    span.id = "scoreSpan" + i;
    e2.appendChild(span);}
    else{
      spanElem.textContent = graphScoreValue[i]
      spanElem.style.color=mycolorCode;
    }
  }

    for(var i =0; i<= this.props.id; i++){
      // console.log('HHHHHHHHHHHHH', i, this.props.id)
      var canvasBg = document.getElementById('scoreCanvasBg'+ i);
      var canvas = document.getElementById('scoreCanvas'+ i);
      
      
      canvas.style.display='block';
      canvas.style.position='absolute';

      var context = canvas.getContext('2d');
      var contextBg = canvasBg.getContext('2d');
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = 40;
      var endPercent;
      endPercent = this.state.graphScore
      // endPercent = this.state.graphScore * 10;
      // console.log('endPercent', endPercent)
      var curPerc = 0 ;
      var counterClockwise = false;
      var circ = Math.PI * 2;
      var quart = Math.PI / 2;

      context.lineWidth = 6;
      contextBg.lineWidth = 6;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.font="40px Source Sans Pro";
    
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
          
      var animate=function(current) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
        context.strokeStyle = mycolorCode
        context.stroke();
        // curPerc;
            requestAnimationFrame(function () {
               animate(endPercent / 100)
           });

      };
      
      var drawCircle=function(current) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextBg.clearRect(0, 0, canvas.width, canvas.height);
        contextBg.beginPath();
        contextBg.arc(x, y, radius,  -(quart), ((circ) * current) - quart, false);
        contextBg.strokeStyle = '#efefef';
        contextBg.stroke();
      };
      
      //animate();
      setTimeout(function(){animate()}, 700);
      drawCircle(100 / 100);
    }
  },

  render: function () {
    const tooltipImprovement = ( <Popover style={{margin:5, width:270, borderRadius:0, marginLeft:-40, boxShadow: 'none', opacity:0.9}}><div style={{fontSize: 15,fontFamily: "Source Sans Pro", padding:'0 5px'}}>Score improvement after remediation of this issue</div></Popover> )
    
    return(
        <OverlayTrigger ref={"scoreDiv"+this.props.id} placement="top" overlay={tooltipImprovement}>
          <div style={{marginLeft:"-50px"}} id={"scoreDiv"+this.props.id}>
              <canvas width="100" height="100" id={"scoreCanvasBg"+this.props.id} style={{position:'absolute', left:-11, padding:15, marginTop:-26}}>
              </canvas>
              <canvas width="100" height="100" id={"scoreCanvas"+this.props.id} style={{position:'absolute', left:-11, padding:15, marginTop:-26}}>
              </canvas>
          </div> 
        </OverlayTrigger>
    );
  }
})
