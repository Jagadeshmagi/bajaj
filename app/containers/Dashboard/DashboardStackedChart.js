import React, { Component } from 'react';
import Chart from 'chart.js'

class DashboardStackedChart extends Component {
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
  var loMedHigh = this.props.data1
    var myXaxisArray =[], myLineChart=[], lowArray=[], midArray=[], highArray=[], passArray=[]

    this.props.response.dataByDate.map((val,key)=>{
      myXaxisArray.push(val.date)
      myLineChart.push(val.values[4])
    })

    if(myXaxisArray.length < 5){
      for(var i =1; i<=5;  i++){
        var string0=myXaxisArray[0].slice(0,3)
        var string1 = parseInt(myXaxisArray[0].slice(3,5)) + i
        console.log('string1', string1)
        var string2 = myXaxisArray[0].slice(5,myXaxisArray[0].length)
        var resultString0 = string1.toString()
        if(string1<10){
          resultString0 = "0"+string1.toString()
        }
        var resultString = string0.concat(resultString0).concat(string2)
        myXaxisArray.push(resultString)
      }
    }

    loMedHigh.map((val, key)=>{
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

    this.setState({xAxisValue:myXaxisArray, myLineChart:myLineChart, low:lowArray, med:midArray, high:highArray, pass:passArray},function(){
      this.dataSetsForCanvas()
    })
   
  }

  dataSetsForCanvas(){
    var barChartData = {
      labels: this.state.xAxisValue,
      datasets: [{
        type: 'line',
        lineTension:0,
        label: 'Score',
        fill:false,
        yAxisID: "y-axis-0",
        backgroundColor: '#4d59a4',
        borderColor: '#4d59a4',
        borderWidth: 2,
        hoverBackgroundColor: '#4d59a4',
        hoverBorderColor: '#4d59a4',
        data: this.state.myLineChart
      },
      {
        label: 'Low',
        backgroundColor: '#39ace2',
        borderColor: '#39ace2',
        borderWidth: 1,
        hoverBackgroundColor: '#39ace2',
        hoverBorderColor: '#39ace2',
        data: this.state.low,
        yAxisID: 'y-axis-1'
      },
      {
        label: 'Med',
        type:'bar',
        backgroundColor: '#fac73e',
        borderColor: '#fac73e',
        borderWidth: 1,
        hoverBackgroundColor: '#fac73e',
        hoverBorderColor: '#fac73e',
        data: this.state.med,
        yAxisID: 'y-axis-1'
      }, 
      {
        label: 'High',
        type:'bar',
        backgroundColor: '#f04e4b',
        borderColor: '#f04e4b',
        borderWidth: 1,
        hoverBackgroundColor: '#f04e4b',
        hoverBorderColor: '#f04e4b',
        data: this.state.high,
        yAxisID: 'y-axis-1'
      }, 
      {
        label: 'Passed',
        type:'bar',
        backgroundColor: '#57c684',
        borderColor: '#57c684',
        borderWidth: 1,
        hoverBackgroundColor: '#57c684',
        hoverBorderColor: '#57c684',
        data: this.state.pass,
        yAxisID: 'y-axis-1'
      }
      ]
    };

    var canvasBg = document.getElementById('chartNew');
    console.log('canvasBg  ',this.state.myLineChart)
    var ctx = canvasBg.getContext("2d");
    if(this.props.dataChoice == 'Percent'){
    var ch = new Chart(ctx, {
      type: 'bar',
      data: barChartData,
      options: {
        tooltips: {
          mode: 'label'
        },
        responsive: false,
        legend:{display:true, 
          position:'bottom',
          labels:{
            boxWidth:15,
            fontSize:14
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            barThickness : 45,
            gridLines: { display: false },
          }
          ],
          yAxes: [{
            gridLines: { display: false },
            type: 'linear',
            display: true,
            stacked: false,
            position: "right",
            id: "y-axis-0",
            ticks: {
              beginAtZero: true
            },
            scaleLabel:{
              display: true,
              labelString: 'Score',
              fontColor: "#000"
            }
          }, 
          {
            display: true,
            stacked: true,
            position: "left",
            id: "y-axis-1",
            ticks: {
              beginAtZero: true,
              steps: 5,
              maxTicksLimit: 5,
              max: 100
            },
            scaleLabel:{
              display: true,
              labelString: this.props.dataChoice,
              fontColor: "#000"
            }
          }
          ]
        }
      }
    }); 
  }else{
    var ch = new Chart(ctx, {
      type: 'bar',
      data: barChartData,
      options: {
        tooltips: {
          mode: 'label'
        },
        responsive: false,
        legend:{display:true, 
          position:'bottom',
          labels:{
            boxWidth:15,
            fontSize:14
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            barThickness : 45,
            gridLines: { display: false },
          }
          ],
          yAxes: [{
            gridLines: { display: false },
            type: 'linear',
            display: true,
            stacked: false,
            position: "right",
            id: "y-axis-0",
            ticks: {
              beginAtZero: true
            },
            scaleLabel:{
              display: true,
              labelString: 'Score',
              fontColor: "#000"
            }
          }, 
          {
            display: true,
            stacked: true,
            position: "left",
            id: "y-axis-1",
            ticks: {
              maxTicksLimit: 5,
              steps: 5,
              beginAtZero: true,
            },
            scaleLabel:{
              display: true,
              labelString:this.props.dataChoice,
              fontColor: "#000"
            }
          }
          ]
        }
      }
    }); 
  }
    this.chart = ch;
  }

  clickStackHandler(e){
    var x, y;
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
      <canvas onClick={this.clickStackHandler.bind(this)} id="chartNew" width={chartWidh} height={300}></canvas>
    );
  }
}

export default DashboardStackedChart;
