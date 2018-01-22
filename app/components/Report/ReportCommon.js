import React, {PropTypes} from 'react'
import {legend, low, medium, high, passed, toolTipStyle} from './styles.css'
import {Bar} from 'react-chartjs'
import Chart from 'chart.js'
import { modalContainer } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel ,Col} from 'react-bootstrap'
import {stopDiscovery} from 'helpers/discovery'

export const DownloadReport = React.createClass({
  getInitialState(){
    return{
      showModal: false,
      isGenerating: false,
      reportType:"PDF"
    }
  },
  closeModal() {
    this.setState({showModal: false});
  },
  openModal(){
    this.setState({showModal: true });
  },
  generatePDF(){
    let downloadLink;
    let pp="root.";
    let concatPp=pp.concat(this.props.selectedPolicyPack)
    if(this.props.resourceId===-1){
      //+++ End point for downloading onPrem/Cloud report +++//
      downloadLink = NetworkConstants.API_SERVER+'/report/download?worklogId='+this.props.reportId+'&reporttype='+this.state.reportType+'&policypack='+concatPp+'&assettype='+this.props.assetType;
    }
    else{
       //+++ End point for downloading devicedetails report ++//
      downloadLink = NetworkConstants.API_SERVER+'/report/download?worklogId='+this.props.reportId+'&reporttype='+this.state.reportType+'&policypack='+concatPp+'&resourceId='+this.props.resourceId+'&assettype='+this.props.assetType;
    }
    this.closeModal();
     var filename = "Pulsar Report-"+this.props.reportId+".pdf";
      if(this.state.reportType=="EXCEL")
      {
        filename = "Pulsar Report-"+this.props.reportId+".xls";
      }
   // e.preventDefault();
    var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {


                var disposition = this.getResponseHeader('Content-Disposition');

                 if (disposition) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches !== null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                var linkelem = document.createElement('a');
                try {

                    var blob = new Blob([this.response], { type: 'application/octet-stream' });

                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        //   IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."

                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);
//alert(downloadUrl);
                        if (filename) {

                            // use HTML5 a[download] attribute to specify filename
                            var a = document.createElement("a");

                            // safari doesn't support this yet
                            if (typeof a.download === 'undefined') {
                               console.log("LINE NUMBER 72")
                                window.location = downloadUrl;
                            } else {
                               console.log("LINE NUMBER 74")
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.target = "_blank";
                                a.click();
                            }
                        } else {
                             console.log("LINE NUMBER 81")
                            window.location = downloadUrl;
                        }
                    }

                } catch (ex) {
                    console.log(ex);
                }
      //document.getElementById("demo").innerHTML = this.getResponseHeader('Content-Disposition');
    }
  };
  var accessToken = localStorage.getItem('accessToken');
  xhttp.open("POST", downloadLink, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("authorization", 'Bearer ' + accessToken);
  //xhttp.setRequestHeader("authorization", "Bearer 043b5fa7-8df2-4909-aab5-2b414243e800");
  xhttp.responseType = 'blob';
  xhttp.send();

  },
   handleReportType(e){
    this.setState({reportType:e.target.value})
  },
  render() {
    let close = () => this.setState({ show: false});
    let style = {
      ...this.props.style,
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid Navy',
      borderRadius: 0,
      marginTop: 200,
      width:500,
    }
    let downloadLink;
    let pp="root.";
    let concatPp=pp.concat(this.props.selectedPolicyPack)
    if(this.props.resourceId===-1){
      //+++ End point for downloading onPrem/Cloud report +++//
      downloadLink = NetworkConstants.API_SERVER+'/reports/download?worklogId='+this.props.reportId+'&reporttype='+this.state.reportType+'&policypack='+concatPp+'&assettype='+this.props.assetType;
    }
    else{
       //+++ End point for downloading devicedetails report ++//
      downloadLink = NetworkConstants.API_SERVER+'/reports/download?worklogId='+this.props.reportId+'&reporttype='+this.state.reportType+'&policypack='+concatPp+'&resourceId='+this.props.resourceId+'&assettype='+this.props.assetType;
    }

    return (
      <span className={modalContainer} >
        <Button className={btnPrimary} onClick={this.openModal} style={{margin:'0 10px',border:'1.5px solid #4C58A4',borderRadius:0,marginLeft:'12px', color:'white'}}>Export</Button>
        {this.state.isGenerating?
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'GENERATE REPORT'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Generating report. Please wait...</p>
          </Modal.Body>
        </Modal>
          :
        <Modal
          show={this.state.showModal}
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'GENERATE REPORT'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px'}}>
            <div style={{marginLeft:'15px'}}>

            <input checked={this.state.reportType==='PDF'?true:false} type="radio" value="PDF" id="PDF" name="reportType" onChange={this.handleReportType}/>
            <label htmlFor="PDF"> &nbsp;&nbsp;&nbsp;PDF </label>
            <br/>
           <input checked={this.state.reportType==='EXCEL'?true:false} type="radio" value="EXCEL" id="EXCEL" name="reportType" onChange={this.handleReportType}/>
            <label htmlFor="EXCEL"> &nbsp;&nbsp;&nbsp;EXCEL </label>
            </div>
              {/*<FormGroup controlId="formGroupEmail">
                <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Send report to</ControlLabel></Col>
                <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,}}
                  type="text" name="email" placeholder="Enter email" />
              </FormGroup>*/}

         </Modal.Body>
         <Modal.Footer style={{marginRight:35,marginBottom:5,borderTop:0}}>
          <form>
            <Button className={blueBtn} onClick={this.closeModal}>Cancel</Button>
            <Button type="button" bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.generatePDF}>Done</Button>
          </form>
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})


export function ReportHeader (props) {
  let navColorStyle = {
      backgroundColor: '#00C484', border: 0, borderRadius: 0,
      marginBottom: 0, paddingTop: 20,
      color: 'white', fontSize: 24, height: 80, textAlign: 'center'}
  return (
          <div style={navColorStyle}>
            <div style={{position:'absolute', top:9, left:15}}>
              <svg style={{align:'center'}}  width="60px" height="60px"  viewBox="656 156 288 288" version="1.1" >
                <g id="Group-2" stroke="none" strokeWidth="5" fill="none" fillRule="evenodd" transform="translate(660.000000, 160.000000)">
                  <path d="M238.529268,238.300807 C213.343231,263.458971 178.555888,279.020052 140.127469,279.020052 C63.2799069,279.020052 0.978093317,216.784994 0.978093317,139.999073 C0.978093317,63.2177865 63.2799069,0.978094172 140.127469,0.978094172 C189.701753,0.978094172 233.213762,26.8684345 257.861755,65.845283" id="Stroke-1" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                  <path d="M193.088648,192.956335 C179.516946,206.51088 160.773525,214.893845 140.072736,214.893845 C98.6757973,214.893845 65.0990531,181.357351 65.0990531,139.993976 C65.0990531,98.6306005 98.6757973,65.0941063 140.072736,65.0941063 C161.752209,65.0941063 181.284143,74.2926611 194.971803,88.9871786" id="Stroke-3" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                  <path d="M158.681646,140 C158.681646,150.231944 150.383705,158.536131 140.128396,158.536131 C129.89164,158.536131 121.575146,150.231944 121.575146,140 C121.575146,129.768056 129.89164,121.463869 140.128396,121.463869 C150.383705,121.463869 158.681646,129.768056 158.681646,140 L158.681646,140 Z" id="Stroke-5" stroke="#FFFFFF" strokeWidth="8"></path>
                  <path d="M279.504121,139.995366 C279.504121,155.35255 267.045614,167.799562 251.674246,167.799562 C236.302878,167.799562 223.844371,155.35255 223.844371,139.995366 C223.844371,124.642816 236.302878,112.19117 251.674246,112.19117 C267.045614,112.19117 279.504121,124.642816 279.504121,139.995366 L279.504121,139.995366 Z" id="Stroke-7" stroke="#FFFFFF" strokeWidth="8"></path>
                  <path d="M153.19174,153.046655 L238.527413,238.298954" id="Stroke-9" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </div>
            {props.name}
          </div>
    )
}
function showToolTip(){
 document.getElementById('tootTipId').style.visibility="visible";
}

function hideToolTip(){
  document.getElementById('tootTipId').style.visibility="hidden";
}
function showToolTipShare(){
  document.getElementById('tootTipIdShare').style.visibility="visible";
}

function hideToolTipShare(){
  document.getElementById('tootTipIdShare').style.visibility="hidden";
}

export function ReportTitle (props) {
  let style = {
      fontSize: 24,
      color: '#454855',
      fontWeight: 'bold'
    }
  return (
    <div  style={{paddingTop: 20, paddingLeft: 0, height:60}}>
      {/*<div style={{position:'absolute', top:-70, left:-50}}>
        <svg style={{align:'center'}}  width="60px" height="60px"  viewBox="656 156 288 288" version="1.1" >
          <g id="Group-2" stroke="none" strokeWidth="5" fill="none" fillRule="evenodd" transform="translate(660.000000, 160.000000)">
            <path d="M238.529268,238.300807 C213.343231,263.458971 178.555888,279.020052 140.127469,279.020052 C63.2799069,279.020052 0.978093317,216.784994 0.978093317,139.999073 C0.978093317,63.2177865 63.2799069,0.978094172 140.127469,0.978094172 C189.701753,0.978094172 233.213762,26.8684345 257.861755,65.845283" id="Stroke-1" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
            <path d="M193.088648,192.956335 C179.516946,206.51088 160.773525,214.893845 140.072736,214.893845 C98.6757973,214.893845 65.0990531,181.357351 65.0990531,139.993976 C65.0990531,98.6306005 98.6757973,65.0941063 140.072736,65.0941063 C161.752209,65.0941063 181.284143,74.2926611 194.971803,88.9871786" id="Stroke-3" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
            <path d="M158.681646,140 C158.681646,150.231944 150.383705,158.536131 140.128396,158.536131 C129.89164,158.536131 121.575146,150.231944 121.575146,140 C121.575146,129.768056 129.89164,121.463869 140.128396,121.463869 C150.383705,121.463869 158.681646,129.768056 158.681646,140 L158.681646,140 Z" id="Stroke-5" stroke="#FFFFFF" strokeWidth="8"></path>
            <path d="M279.504121,139.995366 C279.504121,155.35255 267.045614,167.799562 251.674246,167.799562 C236.302878,167.799562 223.844371,155.35255 223.844371,139.995366 C223.844371,124.642816 236.302878,112.19117 251.674246,112.19117 C267.045614,112.19117 279.504121,124.642816 279.504121,139.995366 L279.504121,139.995366 Z" id="Stroke-7" stroke="#FFFFFF" strokeWidth="8"></path>
            <path d="M153.19174,153.046655 L238.527413,238.298954" id="Stroke-9" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"></path>
          </g>
        </svg>
      </div>*/}
      <div className="row col-lg-9 " style={{float:'left'}} >
        <span style={style}>{props.title}</span>
      </div>
      <div className="col-lg-3" style={{float:'right'}}>
        <span style={{position:'relative'}}>
          <Button className={blueBtn} style={{marginRight: 10}} onMouseOver={showToolTip} onMouseOut={hideToolTip}>Archive</Button>
          <div id="tootTipId" className={toolTipStyle} style={{width:110, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:40, left:-20, padding:'6px 4px', borderRadius:3, zIndex:"3"}}>Coming soon</div>
        </span>
        <DownloadReport
                      reportId={props.worklogId}
                      selectedPolicyPack={props.selectedPolicyPack}
                      resourceId={props.resourceId}
                      assetType={props.assetType}/>
        {/*<Button className={blueBtn} style={{marginLeft: 10,marginRight:10}}>Export</Button>
        <Button className={btnPrimary} style={{border:'1.5px solid #4C58A4',borderRadius:0,marginLeft:'12px', color:'white'}}>Share</Button>*/}
        <span style={{position:'relative'}}>
          <Button className={blueBtn} style={{marginLeft: 10}} onMouseOver={showToolTipShare} onMouseOut={hideToolTipShare}>Share</Button>
          <div id="tootTipIdShare" className={toolTipStyle} style={{width:110, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:40, left:-20, padding:'6px 4px', borderRadius:3, zIndex:"3"}}>Coming soon</div>
        </span>
      </div>
    </div>
    )
}

export function MetaItem(props) {
  return (
    <tr>
      <td style={{textAlign: 'left', fontWeight: 'bold',paddingRight:'20px',}}>{props.title}: </td>
      <td style={{textAlign: 'left'}}>{props.desc}</td>
    </tr>
    )
}

export function GraphLegends(){
  return(
     <ul className={legend}>
        <li><span style={{marginTop:'4px'}} className={low}></span>Low Severity</li>
        <li><span style={{marginTop:'4px'}} className={medium}></span> Medium Severity</li>
        <li><span style={{marginTop:'4px'}} className={high}></span>High Severity</li>
        {/*<li><span style={{marginTop:'4px'}} className={passed}></span>Passed</li>*/}
      </ul>
  )
}




export function GraphLegendsForHorizontal(){
  return(
     <ul className={legend}>
        <li><span style={{marginLeft:23,marginTop:'9px'}} className={low}></span>Low Severity</li>
        <li><span style={{marginLeft:23,marginTop:'9px'}} className={medium}></span> Medium Severity</li>
        <li><span style={{marginLeft:23,marginTop:'9px'}} className={high}></span>High Severity</li>
      </ul>
  )
}


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
    document.getElementById('scoreCanvas').innerHTML = ""

  },

  scoreCircle(){
    let mycolorCode = '#efefef';
    var e2 = document.getElementById('scoreDiv');
    var spanElem = document.getElementById('scoreSpan');
    let myScore = parseInt(this.state.graphScore)
      if( myScore >= 0 && myScore <= 50){
        mycolorCode = '#FF444D'
      }else if(myScore > 50 && myScore <=80){
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
    span.style.fontSize='70px';
    span.style.fontWeight=900;
    //span.style. marginLeft='5px';
    span.id = "scoreSpan";
    e2.appendChild(span);}
    else{
      spanElem.textContent = this.state.graphScore;
      spanElem.style.color= mycolorCode
    }
    var canvasBg = document.getElementById('scoreCanvasBg');
    var canvas = document.getElementById('scoreCanvas');
    canvas.style.display='block';
    canvas.style.position='absolute';

    var context = canvas.getContext('2d');
    var contextBg = canvasBg.getContext('2d');
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var radius = 65;
    var endPercent = this.state.graphScore;
    var curPerc = 0 ;
    var counterClockwise = false;
    var circ = Math.PI * 2;
    var quart = Math.PI / 2;

    context.lineWidth = 15;
    contextBg.lineWidth = 15;
    context.strokeStyle = 'green';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowColor = '#656565';
    context.font="40px Source Sans Pro";

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var animate=function(current) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
      context.strokeStyle = mycolorCode;
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
    animate();
    drawCircle(100 / 100);
  },

  render: function () {
    return(
      <div style={{margin:"30px"}} id="scoreDiv">
        <canvas width="160" height="160" id="scoreCanvasBg" style={{position:'absolute'}}>
        </canvas>
        <canvas width="160" height="160" id="scoreCanvas" style={{position:'absolute'}}>
        </canvas>
      </div>
    );
  }
})


export const StackedHorizontalBarChart = React.createClass({

 getInitialState(){
    return{
      canvasId:'',
      clientsChart:null,
      graphChart:'',
      dataLength:'',
      passSeries:[],
      failSeries:[],
      scoreSeries:[],
      showScore:false
    }
  },
  componentDidMount() {
    this.setState({graphChart:this.props.horizontalChartData},function(){
      if(this.props.horizontalChartData.controlFamily){
      this.setState({dataLength:this.props.horizontalChartData.controlFamily.length,
        passSeries:this.props.horizontalChartData.pass,
        failSeries:this.props.horizontalChartData.fail,
        scoreSeries:this.props.horizontalChartData.score,
        canvasId:this.props.idProp,
        canvasWidth:this.props.canvasWidth,
        showScore: this.props.score
      },function(){
        this.horizontalStackedBar();
      })
    }});
  },

 componentWillReceiveProps(nextProps,nextState){
    if (nextProps.horizontalChartData !== this.props.horizontalChartData){
      this.setState({graphChart:nextProps.horizontalChartData},function(){
        this.setState({dataLength:nextProps.horizontalChartData.controlFamily.length,
          passSeries:nextProps.horizontalChartData.pass,
          failSeries:nextProps.horizontalChartData.fail,
          scoreSeries:nextProps.horizontalChartData.score,
          canvasId:nextProps.idProp,
          canvasWidth:nextProps.canvasWidth
        },function(){
          this.horizontalStackedBar();
        })
      });
    }
  },



  horizontalStackedBar(){
    let graphData = this.state.graphChart
    //Chart.defaults.global.defaultFontStyle="Bold";
    var backgroundColorArray=[];
      if(graphData.score && graphData.score.length>0){ 
        for(let i = 0;i< graphData.score.length; i++){ 
          let score = parseInt(graphData.score[i]) 
          if(score>=0 && score<=50){ 
            backgroundColorArray.push('#FF444D') 
          }else if(score>50 && score<=80){ 
            backgroundColorArray.push('#F9C73D') 
          }else if(score>80 && score<=100){ 
            backgroundColorArray.push('#00C484') 
          } 
        } 
      } 
    
    var barData = {
      xAxisID:'x-axis-0',
        labels : graphData.controlFamily,

        datasets : [
          {
            label : 'Low',
            yAxisID:'y-axis-0',
            backgroundColor : '#29ABE2',
            hoverBackgroundColor:'#29ABE2',
            data : graphData.low
          }, {
            label : 'Medium',
            yAxisID:'y-axis-0',
            backgroundColor : '#F9C73D',
            hoverBackgroundColor:'#F9C73D',
            data : graphData.med
          },{
            label : 'High',
            yAxisID:'y-axis-0',
            backgroundColor : '#FF444D',
            hoverBackgroundColor:'#FF444D',
            data : graphData.high
          },
          {
            label : 'Score',
            yAxisID:'y-axis-0',
            backgroundColor : backgroundColorArray,
            hoverBackgroundColor:backgroundColorArray,
            data : graphData.score
          },
        ]
    };


      var config = {
        type : 'horizontalBar',
        data : barData,
        options : {
          responsive: false,
          tooltips: {
              enabled: true,
              titleFontFamily:'Source Sans Pro',
              titleFontSize:17,
              titleFontStyle:'normal',
              bodyFontFamily:'Source Sans Pro',
              bodyFontSize:17,
              bodyFontStyle:'normal',
              footerFontSize:17,
              footerFontStyle:'normal',
              backgroundColor:'rgba(0, 196, 132,1)',
              callbacks: {
                title: function(tooltipItems, data) {
                  return data.labels[tooltipItems[0].index];
                }
              }               
          },


        title: {
            display: false,
            text: 'ISSUES COUNT PER CONTROL FAMILY'
        },
          hover :{
            animationDuration:0
          },
          legend: {
            display: false,
        },

          animation: {
            enabled:true,
            duration: 900,
            onComplete: function () {
              // render the value of the chart inside the bar
                  var ctx = this.chart.ctx;
                  ctx.font = Chart.helpers.fontString(8, 'normal', Chart.defaults.global.defaultFontFamily);
                   //ctx.font = "bold 8px Arial";
                  ctx.fillStyle = this.chart.config.options.defaultFontColor;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'bottom';
                  ctx.fontWeight = 'bold';
                  this.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                      if(dataset.data[i]>0){
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                        ctx.fillText(dataset.data[i], model.x - 5, model.y + 5);
                      }
                    }
                  });
            }
          },
          scaleShowVerticalLines: false,
          scaleShowGridLines:false,

          scales : {
            xAxes : [{
              id:"x-axis-0",
              stacked : true,
              display: false,
               gridLines: {
                    display:false
                }

            }],
            yAxes : [{
              id:"y-axis-0",
                barThickness:15,
              stacked : true,
              gridLines: {
                    display:false,
                    color: "#fff",
                    zeroLineColor: "#fff",
                    zeroLineWidth: 0
                },
              ticks: {
                    fontFamily: "Source Sans Pro",
                    fontSize: 18,
                    fontStyle:'normal',
                    userCallback: function(label, index, labels) {
                        if(label.length > 30)
                          return label.substring(0,29) + ' ..'
                        else
                          return label
                    }                     
                }
            }]
          }
        }
      }
      var context1;
      if(this.state.clientsChart==null){
        context1 = document.getElementById(this.state.canvasId).getContext('2d');
        if(this.state.dataLength === 1){
          context1.canvas.height = this.state.dataLength * 150;
        }else if(this.state.dataLength === 2){
          context1.canvas.height = this.state.dataLength * 43;
        }else{
          context1.canvas.height = this.state.dataLength * 30;
        }
        this.setState({clientsChart : new Chart(context1, config)})
    }else{
      //Destroying the chart and recreating it to fix the overlap issue on hover
      this.state.clientsChart.destroy();
      context1 = document.getElementById(this.state.canvasId).getContext('2d');
      context1.canvas.height="";
      // context1.canvas.height = this.state.dataLength * 30;
      if(this.state.dataLength === 1){
        context1.canvas.height = this.props.horizontalChartData.controlFamily.length * 150;
      }else if(this.state.dataLength === 2){
        context1.canvas.height = this.props.horizontalChartData.controlFamily.length * 43;
      }else{
        context1.canvas.height = this.props.horizontalChartData.controlFamily.length * 30;
      }
      this.setState({clientsChart : new Chart(context1, config)})
    }
  },

   render: function () {
    let datalen = this.state.dataLength;
    let canvasHeight=datalen*30;
    let rowLength= (canvasHeight-25)/datalen +'px'
    let tableRows, rowHeader, rowHeaderColor

    if(this.state.scoreSeries && this.state.scoreSeries.length > 0)
    {
      rowHeader = 'Score'
      rowHeaderColor = '#808080'
      tableRows = this.state.scoreSeries.map(function(item,index){
                  return(
                    <tr key={this.state.canvasId+index} style={{height: rowLength}}>
                      <td style={{padding:'0px 10px 0px 0px'}}>{this.state.scoreSeries[index]}</td>
                    </tr>);
                  }.bind(this))
    }else{
      rowHeader = 'Total Fail'
      rowHeaderColor = '#FF444D'
      tableRows = this.state.failSeries.map(function(item,index){
                  return(
                    <tr key={this.state.canvasId+index} style={{height: rowLength}}>
                      <td style={{padding:'0px 10px 0px 0px'}}>{this.state.failSeries[index]}</td>
                      {/*<td>|</td>
                      <td style={{padding:'0px 0px 0px 10px'}}>{item}</td>*/}
                    </tr>);
                  }.bind(this))
    }

    return(
        <div style={{height:'200px',overflowY:'auto'}}>
          <div className="col-lg-10 col-xs-10 col-md-10 col-sm-10" style={{marginTop:'10px'}}>
            <canvas id={this.state.canvasId} width={this.state.canvasWidth} style={{marginTop:this.state.dataLength==1?'-48px':0}}></canvas>
          </div>
          {this.state.dataLength!=0?
          <div className="col-lg-2 col-xs-2 col-md-2 col-sm-2">
            <table>
              <thead>
                <tr style={{height:'25px'}}>
                  <th style={{height:'25px', padding:'0px 10px 0px 0px', color:rowHeaderColor}}>{rowHeader}</th>
                </tr>
              </thead>
              <tbody style={{textAlign:'center'}}>
                {tableRows}
              </tbody>
            </table>
          </div>
          :<div className="col-lg-8 col-xs-8 col-md-8 col-sm-8" style={{marginTop:'100px',textAlign:'center'}}>No data available for the selected policypack</div>}
        </div>
    );
}
})
