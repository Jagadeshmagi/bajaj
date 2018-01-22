import React, { Component } from 'react';
import Chart from 'chart.js'

class DashboardBarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xAxisValue:[],
      myLineChart:[],
      low:[],
      med:[],
      high:[],
      pass:[],
      responseProps:[]
    }
  }
  componentDidMount() {
    this.setState({responseProps:this.props.data1}, function(){
      this.getDataForChart()
    })
  }

  componentWillReceiveProps(nextProps,nextState){
    if(nextProps.data1 !== this.props.data1){
      this.setState({responseProps:nextProps.data1}, function(){
        this.chart.destroy();
        this.getDataForChart()
      })
    }
  }

  getDataForChart(){
  var loMedHigh = this.state.responseProps
  var testArray = []
    var myXaxisArray =[], myLineChart=[], lowArray=[], midArray=[], highArray=[], passArray=[]

    this.props.response.dataByDate.map((val,key)=>{
      myXaxisArray.push(val.date)
      myLineChart.push(val.values[4])
    })

    loMedHigh.map((val, key)=>{
      console.log('GGGGGG', val, key)
      if(val.label=='Low'){
        val.values.map((val,i)=>{
          lowArray.push(val.y)
        })
      }
      if(val.label=='Med'){
        val.values.map((val,i)=>{
          midArray.push(val.y)
        })
      }
      if(val.label=='High'){
        val.values.map((val,i)=>{
          highArray.push(val.y)
        })
      }
      if(val.label=='Passed'){
        val.values.map((val,i)=>{
          passArray.push(val.y)
        })
      }
    })

   if(myXaxisArray.length < 5){     
      for(var i =1; i<=(6 - lowArray.length);  i++){
        var string0=myXaxisArray[0].slice(0,3)
        var string1 = parseInt(myXaxisArray[0].slice(3,5)) + i
        console.log('string1', string1)
        var string2 = myXaxisArray[0].slice(5,myXaxisArray[0].length)
        var resultString0 = string1.toString()
        if(string1<10){
          resultString0 = "0"+string1.toString()
        }
        var resultString= string0.concat(resultString0).concat(string2)
        myXaxisArray.push(resultString)
      }
      // console.log('FFFFFFFFFFF', testArray)
      // console.log('Coming', myXaxisArray[0].slice(0,2), myXaxisArray[0].length, myXaxisArray[0].slice(2,myXaxisArray[0].length))
    }

    this.setState({xAxisValue:myXaxisArray, myLineChart:myLineChart, low:lowArray, med:midArray, high:highArray, pass:passArray},function(){
      this.dataSetsForCanvas()
    })
   
  }

  dataSetsForCanvas(){
    var canvasBg = document.getElementById('dashboardBarChart');
    var ctx = canvasBg.getContext("2d");

    var data = {
      labels: this.state.xAxisValue,
      datasets: [{
        type: 'line',
        yAxisID:'lineYaxis',
        lineTension:0,
        label: 'Score',
        fill:false,
        backgroundColor: '#4d59a4',
        borderColor: '#4d59a4',
        borderWidth: 2,
        hoverBackgroundColor: '#4d59a4',
        hoverBorderColor: '#4d59a4',
        data: this.state.myLineChart
      },{
        label: 'Low',
        yAxisID: 'barYaxis',
        backgroundColor: '#39ace2',
        borderColor: '#39ace2',
        borderWidth: 1,
        hoverBackgroundColor: '#39ace2',
        hoverBorderColor: '#39ace2',
        data: this.state.low,
      }, {
        label: 'Med',
        yAxisID: 'barYaxis',
        type:'bar',
        backgroundColor: '#fac73e',
        borderColor: '#fac73e',
        borderWidth: 1,
        hoverBackgroundColor: '#fac73e',
        hoverBorderColor: '#fac73e',
        data: this.state.med,
      }, {
        label: 'High',
        yAxisID: 'barYaxis',
        type:'bar',
        backgroundColor: '#f04e4b',
        borderColor: '#f04e4b',
        borderWidth: 1,
        hoverBackgroundColor: '#f04e4b',
        hoverBorderColor: '#f04e4b',
        data: this.state.high,
      }]
    };

    var dataPercent = {
      labels: this.state.xAxisValue,
      datasets: [{
        type: 'line',
        yAxisID:'lineYaxis',
        lineTension:0,
        label: 'Score',
        fill:false,
        backgroundColor: '#4d59a4',
        borderColor: '#4d59a4',
        borderWidth: 2,
        hoverBackgroundColor: '#4d59a4',
        hoverBorderColor: '#4d59a4',
        data: this.state.myLineChart
      },{
        label: 'Low',
        yAxisID: 'barYaxis',
        backgroundColor: '#39ace2',
        borderColor: '#39ace2',
        borderWidth: 1,
        hoverBackgroundColor: '#39ace2',
        hoverBorderColor: '#39ace2',
        data: this.state.low,
      }, {
        label: 'Med',
        yAxisID: 'barYaxis',
        type:'bar',
        backgroundColor: '#fac73e',
        borderColor: '#fac73e',
        borderWidth: 1,
        hoverBackgroundColor: '#fac73e',
        hoverBorderColor: '#fac73e',
        data: this.state.med,
      }, {
        label: 'High',
        yAxisID: 'barYaxis',
        type:'bar',
        backgroundColor: '#f04e4b',
        borderColor: '#f04e4b',
        borderWidth: 1,
        hoverBackgroundColor: '#f04e4b',
        hoverBorderColor: '#f04e4b',
        data: this.state.high,
      }, {
        label: 'Passed',
        yAxisID: 'barYaxis',
        type:'bar',
        backgroundColor: '#57c684',
        borderColor: '#57c684',
        borderWidth: 1,
        hoverBackgroundColor: '#57c684',
        hoverBorderColor: '#57c684',
        data: this.state.pass,
      }]
    };

    if(this.props.dataChoice == 'Percent'){
      var ch = new Chart(ctx, {
        type: 'bar',
          data: dataPercent,
          options: {
          tooltips: {
            enabled: true,
            titleFontFamily:'Source Sans Pro',
            titleFontSize:15,
            titleFontStyle:'bold',
            bodyFontFamily:'Source Sans Pro',
            bodyFontSize:14,
            bodyFontStyle:'normal',
            footerFontSize:14,
            footerFontStyle:'normal',
            backgroundColor:'#57c684',
            mode: 'label',
            callbacks: {
              title: function(tooltipItems, data) {
                return data.labels[tooltipItems[0].index];
              }
            }               
          },
          responsive: false,
          legend:{display:true, 
                  position:'bottom',
                  labels:{
                    boxWidth:15,
                    fontSize:14
                  }},
            barValueSpacing: 50,
            scales: {
              xAxes: [
                {
                  barPercentage: 1.0,
                  gridLines: { display: false },
                  categoryPercentage: 0.82,
                  barThickness : 26,
                }
              ],
              yAxes: [{
                position: "left",
                "id": "barYaxis",
                gridLines: { display: false },
                ticks: {
                  maxTicksLimit: 5,
                  steps: 5,
                  beginAtZero: true,
                  max: 100
                },
                scaleLabel:{
                  display: true,
                  labelString: this.props.dataChoice,
                  fontColor: "#000"
                }
              }, 
              { 
                position: "right",
                "id": "lineYaxis",
                ticks: {
                  maxTicksLimit: 5,
                  steps: 5,
                  beginAtZero: true,
                  max: 100
                },
                scaleLabel:{
                  display: true,
                  labelString: 'Score',
                  fontColor: "#000"
                }
                // gridLines: { display: false },
              }
              ]
            }
          }
      });
    }else{
      var ch = new Chart(ctx, {
        type: 'bar',
          data: data,
          options: {
          tooltips: {
            enabled: true,
            titleFontFamily:'Source Sans Pro',
            titleFontSize:15,
            titleFontStyle:'bold',
            bodyFontFamily:'Source Sans Pro',
            bodyFontSize:14,
            bodyFontStyle:'normal',
            footerFontSize:14,
            footerFontStyle:'normal',
            backgroundColor:'#57c684',
            mode: 'label',
            callbacks: {
              title: function(tooltipItems, data) {
                return data.labels[tooltipItems[0].index];
              }
            }               
          },
          responsive: false,
          legend:{display:true, 
            position:'bottom',
            labels:{
              boxWidth:15,
              fontSize:14
            }
          },
            barValueSpacing: 50,
            scales: {
              xAxes: [
                {
                  barPercentage: 1.0,
                  gridLines: { display: false },
                  categoryPercentage: 0.62,
                  barThickness : 27,
                },
              ],
              yAxes: [{
                position: "left",
                "id": "barYaxis",
                gridLines: { display: false },
                ticks: {
                  steps: 5,
                  beginAtZero: true,
                },
                scaleLabel:{
                  display: true,
                  labelString: this.props.dataChoice,
                  fontColor: "#000"
                }
              }, 
              { 
                position: "right",
                "id": "lineYaxis",
                ticks: {
                  beginAtZero: true,
                },
                scaleLabel:{
                  display: true,
                  labelString: 'Score',
                  fontColor: "#000"
                }
                // gridLines: { display: false },
              }
              ]
            }
          }
      });
    }
    this.chart = ch; 
  }

  componentUnMount(){
    this.setState({
      responseProps:[],
      myLineChart:[],
      low:[],
      med:[],
      high:[],
      pass:[],
    })
  }

  clickBarHandler(e){
    var x;
    var y;
    if (e.pageX || e.pageY) {
      y = e.pageY;
      x = e.clientX + document.getElementById('chartWrapper').scrollLeft; 
    }
    console.log('X and Y values', x, y)

    let activePoint = this.chart.getElementAtEvent(e)[0];
    console.log('label label', this.chart.getElementAtEvent(e))
    let selectedDate = activePoint._model.label;

    this.props.setSelectedDate(selectedDate, x)
    // alert("clicked date is:"+selectedDate)
  }

  render() {
    var chartWidh
    if(this.props.actualWidth<850){
      chartWidh = this.state.xAxisValue.length * 165
    }else{
      chartWidh =  this.props.actualWidth
    }

    return (
      <canvas onClick={this.clickBarHandler.bind(this)} id="dashboardBarChart" width={chartWidh} height={300}></canvas>
    );
  }
}

export default DashboardBarChart;
