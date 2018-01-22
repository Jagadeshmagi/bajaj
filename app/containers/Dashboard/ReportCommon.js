import React from 'react'
import {Col, Button, btnPrimary} from 'react-bootstrap'
import {blueBtn} from 'sharedStyles/styles.css'
import {legend, low, medium, high, passed} from './styles.css'

export function ReportHeader (props) {
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
    var e2 = document.getElementById('scoreDiv');
    var spanElem = document.getElementById('scoreSpan');
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
    span.textContent = this.state.graphScore;
    span.style.color=mycolorCode;
    span.style.display='block';
    span.style.lineHeight='160px';
    span.style.textAlign='center';
    span.style.width='160px';
    span.style.fontFamily='Source Sans Pro';
    span.style.fontSize='40px';
    span.style.fontWeight=800;
    span.style. marginLeft='2px';
    span.id = "scoreSpan";
    e2.appendChild(span);}
    else{
      spanElem.textContent = this.state.graphScore;
      spanElem.style.color=mycolorCode;
    }
    var canvasBg = document.getElementById('scoreCanvasBg');
    var canvas = document.getElementById('scoreCanvas');
    canvas.style.display='block';
    canvas.style.position='absolute';

    var context = canvas.getContext('2d');
    var contextBg = canvasBg.getContext('2d');
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var radius = 50;
    var endPercent = this.state.graphScore;
    var curPerc = 0 ;
    var counterClockwise = false;
    var circ = Math.PI * 2;
    var quart = Math.PI / 2;

    context.lineWidth = 15;
    contextBg.lineWidth = 15;
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
      curPerc++;
     if (curPerc <= endPercent) { 
          requestAnimationFrame(function () {
             animate(curPerc / 100)
         });
     }
    };
    
    var drawCircle=function(current) {
      contextBg.clearRect(0, 0, canvas.width, canvas.height);
      contextBg.beginPath();
      contextBg.arc(x, y, radius,  -(quart), ((circ) * current) - quart, false);
      contextBg.strokeStyle = '#efefef';
      contextBg.stroke();
    };
    
    //animate();
    setTimeout(function(){animate()}, 700);
    drawCircle(100 / 100);
  },

  render: function () {
    return(
      <div style={{marginLeft:"-50px"}} id="scoreDiv">
        <canvas width="160" height="160" id="scoreCanvasBg" style={{position:'absolute', left:-36}}>
        </canvas>
        <canvas width="160" height="160" id="scoreCanvas" style={{position:'absolute', left:-36}}>
        </canvas>
      </div> 
    );
  }
})
