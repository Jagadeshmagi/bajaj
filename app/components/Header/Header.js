import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import {Navbar, Glyphicon , ProgressBar, Popover, Overlay, Row, Grid, Col, OverlayTrigger} from 'react-bootstrap';
import image from 'assets/ARAPCavirinLogo.png';
import { numberCircle, progress, popoverNotification, toolTipStyle } from './styles.css'
import {scheduledTestsData, eventLogData, pulsarUpdatesData, getAlertList} from 'helpers/header'
import {getReportsMainList} from 'helpers/reports'
import {navbar} from 'sharedStyles/styles.css'
import { Link } from 'react-router'
import {container, center, diamondRed, triangleupOrange, circleBlue, circleGreen} from 'containers/Infrastructure/styles.css'
import io from 'socket.io-client'
import moment from 'moment'
import sockets from 'constants/socket'
import _ from 'lodash'

let socket = sockets.io;

function findIndex(arr, propValue) {
  for (let i=0; i < arr.length; i++){
    console.log("arr[i][3], propValue", arr[i][3], propValue)
    if (arr[i][3] == propValue){
      return i;
    }
  }
}

function checkDuplicates(newItem, currentList){
  let duplicate = false;
  console.log("newItem, currentList", newItem, currentList)
  for(var i = 0; i < currentList.length; i++){
    if(currentList[i][0]===newItem[0] && currentList[i][1]===newItem[1]){
      console.log("checkDuplicatescheckDuplicates duplicates")
      duplicate = true;
    } else {
      console.log("checkDuplicatescheckDuplicates no duplicates")
    }
  }
  return duplicate;
}

const ContentSection = React.createClass({
  getInitialState() {
    return {
      all:false,
      arrow:"menu-down",
      name: "",
      number: 1
    }
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      name:nextProps.name,
      number:nextProps.number
    })
  },
  toggleViewAll() {
    let newArrow;
    if (this.state.arrow === "menu-down") {
      newArrow = "menu-up";
    } else if (this.state.arrow === "menu-up") {
      newArrow = "menu-down";
    }
    this.setState({
      all: !this.state.all,
      arrow: newArrow
    }, (res)=>{console.log("newarrow", this.state.arrow)})
  },
  render() {
    let toBeRendered, number, iconOne;
    if (this.props.list.length > 5) {
      if (this.state.all) {
        toBeRendered = this.props.list;
        number = `View Less`
      } else {
        toBeRendered = this.props.list.slice(0, 5);
        number = `View All (${this.state.number})`
      }
    } else {
      toBeRendered = this.props.list;
      number = ``
    }

    return (
      <div>
        <Row style={{backgroundColor:"#EDF2F8", height:"45px", verticalAlign:"center",marginRight:2}}>
          <Col lg={7} style={{top: '25%', fontSize:"15px", fontWeight:"600", marginLeft:"15px", marginRight:"15px"}}>{this.state.name}</Col>
          <Col lg={4} style={{top: '25%', textAlign:"right"}}>
            {this.props.list.length>5?<a style={{textDecoration:'none', cursor:'pointer'}} href="javascript:void(0)" onClick={this.toggleViewAll}>
              {number}&nbsp;&nbsp;<Glyphicon style={{fontSize: '10px'}} glyph={this.state.arrow}></Glyphicon>
            </a>
            :
            <div></div>
          }
          </Col>
        </Row>
        <Row style={{marginLeft:-10}}>
          {toBeRendered.map(function(value, index) {
            if(value[2]==="Completed"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'rgb(0, 196, 132)'}} glyph="ok-circle"/>)
            } else if (value[2] ==="SQUARE"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'#4C58A4'}} glyph="stop"/>)
            } else if (value[2] ==="TIME"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'#737684'}} glyph="time"/>)
            // } else if (value[2] ==="SUCCESS"){
            } else if (value[2] ==="Started"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'#4C58A4'}} glyph="play"/>)
            } else if (value[2] ==="REMOVE"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'red'}} glyph="remove"/>)
            } else if (value[2] ==="WARNING"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'orange'}} glyph="warning-sign"/>)
            } else if (value[2] ==="EDIT"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'black'}} glyph="edit"/>)
            }else if (value[2] ==="DOWNLOAD"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'black'}} glyph="download"/>)
            } else if (value[2] ==="pPComplete"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'rgb(0, 196, 132)'}} glyph="ok"/>)
            } else if (value[2] ==="latestTest"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'rgb(0, 196, 132)', marginTop:"10"}} glyph="play-circle"/>)
            } else if (value[2] ==="high"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'rgb(255, 68, 77)', marginTop:"10"}} glyph="warning-sign"/>)
            } else if (value[2] ==="medium"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'rgb(249, 199, 61)', marginTop:"10"}} glyph="warning-sign"/>)
            } else if (value[2] ==="low"){
              iconOne = (<Glyphicon style={{fontSize: '17px', color:'rgb(41, 171, 226)', marginTop:"10"}} glyph="warning-sign"/>)
            }

              return <div key={index}>
                <Row style={{margin:"15px", width:"435px", marginRight:"30px"}}>
                  <Col lg={1}>{iconOne}</Col>
                  <Col lg={6} title={value[3]} value={value[3]} style={{color:"#4C58A4", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:217, paddingRight:"10px"}}>{value[0]}</Col>
                  <Col style={{textAlign:"right"}} lg={5}>{value[1]}</Col>
                </Row>
              </div>;
            })}
        </Row>
      </div>
    )
  }
})

const LatestTests = React.createClass({
  getInitialState(){
    return {
      customList:[],
      list:[]
    }
  },
  componentDidMount() {
    this.buildCustom(this.props.list)
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list
    }, this.buildCustom(nextProps.list))

  },
  buildCustom(list) {
    console.log("this is the list for LATEST ASSESSMENTS", list)
    let customList = [];
    if (list.length > 0){
      list.forEach((item)=>{
        if (item.length > 0){
          let set = [];
          let scoreStyle;
          // console.log("item2", item[2].slice(5))
          let score = item[2]?parseInt(item[2].slice(5)):0

          if(score <= 50){
            scoreStyle = diamondRed;
          }else if(50 < score && score <= 80){
             scoreStyle = triangleupOrange;
          }else if(score > 80){
            scoreStyle = circleGreen;
          }

          if (item[2] === "Score undefined") {
            set.push(<div><div style={{color:'rgb(76, 88, 164)', color:"#4C58A4", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:217, paddingRight:"10px"}}>{item[0]}</div><div></div><div style={{color:'#737684'}}>{item[1]}</div></div>);
            set.push(<div style={{textAlign:'right',display:'flex',justifyContent:'flex-end'}}>No Score</div>);
            set.push("latestTest");
            set.push(item[0]);
            customList.push(set);
          } else {
            set.push(<div><div style={{color:'rgb(76, 88, 164)'}}>{item[0]}</div><div></div><div style={{color:'#737684'}}>{item[1]}</div></div>);
            set.push(<div style={{textAlign:'right',display:'flex',justifyContent:'flex-end'}}><div className={scoreStyle}>{item[2]}</div></div>);
            set.push("latestTest");
            set.push(item[0]);
            customList.push(set);
          }
        }
      })
    }
    this.setState({
      customList: customList
    }, (res)=>{console.log("this.state.customListfor lastest test", this.state.customList)})
  },
  render() {
    return (
      <div>
        <ContentSection
          name={"LATEST ASSESSMENTS"}
          number={this.state.customList.length}
          list={this.state.customList}
          />
      </div>
    )
  }
})

const TestInProgress = React.createClass({
  getInitialState(){
    return {
      customList:[],
      list:[]
    }
  },
  componentDidMount() {
    this.buildCustom(this.props.list)
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list
    }, this.buildCustom(nextProps.list))

  },
  buildCustom(list) {
    let customList = [];
    list.forEach((item)=>{
      let set = [];
      set.push(<div>{item[0]}<div></div><div>{item[1]}</div></div>);
      set.push(<div>
        <Col style={{textAlign:"right"}} lg={5}>
            {`${item[2]}%`}
            <ProgressBar className = {progress} active now={item[2]} bsStyle="success"/>
        </Col>
      </div>);
      customList.push(set);
    })
    this.setState({
      customList: customList
    }, (res)=>{console.log("this.state.customList", this.state.customList)})
  },
  render() {
    return (
      <div>
        <ContentSection
          name={"TEST IN PROGRESS"}
          number={this.state.customList.length}
          list={this.state.customList}
          />
      </div>
    )
  }
})

const ScheduledTests = React.createClass({
  getInitialState(){
    return {
      customList:[],
      list:[]
    }
  },
  componentDidMount() {
    this.buildCustom(this.props.list)
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list
    }, this.buildCustom(nextProps.list))

  },
  buildCustom(list) {
    let customList = [];
    list.forEach((item)=>{
      let set = [];
      set.push(item[0]);
      set.push(item[1]);
      set.push("TIME")
      customList.push(set);
    })
    this.setState({
      customList: customList
    })
  },
  render() {
    return (
      <div>
        <ContentSection
          name={"SCHEDULED ASSESSMENTS"}
          number={this.state.customList.length}
          list={this.state.customList}
          />
      </div>
    )
  }
})

const EventLog = React.createClass({
  getInitialState(){
    return {
      customList:[],
      list:[]
    }
  },
  componentDidMount() {
    this.buildCustom(this.props.list)
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list
    }, this.buildCustom(nextProps.list))

  },
  buildCustom(list) {
    let customList = [];
    list.forEach((item)=>{
      if (item){
        let set = [];
        set.push(item[0]);
        set.push(item[1]);
        set.push(item[2])
        set.push(item[0]);
        customList.push(set);
      }
    })
    this.setState({
      customList: customList
    })
  },
  render() {
    return (
      <div>
        <ContentSection
          name={"EVENT LOG"}
          number={this.state.customList.length}
          list={this.state.customList}
          />
      </div>
    )
  }
})

//used for downloading the async geneared report//
const GeneratedReport = React.createClass({
  getInitialState(){
    return {
      customList:[],
      list:[]
    }
  },
  componentDidMount() {
    this.buildCustom(this.props.list)
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list
    }, this.buildCustom(nextProps.list))

  },
  buildCustom(list) {
    let customList = [];

    list.forEach((item)=>{
      let itemArray = item.split(',');
      let set = [];
      set.push(<a href={itemArray[0]}>{itemArray[1]}</a>);
      set.push(moment.utc(itemArray[2]).local().format('MM[/]DD[/]YY [@] HH[:]mm'));
      set.push("DOWNLOAD")
      customList.push(set);
    })
    this.setState({
      customList: customList
    })
  },
  render() {
    return (
      <div>
        <ContentSection
          name={"GENERATED REPORT"}
          number={this.state.customList.length}
          list={this.state.customList}
          />
      </div>
    )
  }
})




const PulsarUpdates = React.createClass({
  getInitialState(){
    return {
      customList:[],
      list:[]
    }
  },
  componentDidMount() {
    this.buildCustom(this.props.list)
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list
    }, this.buildCustom(nextProps.list))

  },
  buildCustom(list) {
    let customList = [];
      let set = [];
      set.push(<div><div style={{color:'rgb(76, 88, 164)', color:"#4C58A4", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:215, paddingRight:"10px"}}>{list[0]}</div></div>);
      set.push(list[1]);
      set.push("SQUARE")
      set.push(list[2])
      customList.push(set);
    // })
    this.setState({
      customList: customList
    })
  },
  render() {
    return (
      <div>
        <ContentSection
          name={"PLATFORM UPDATES"}
          number={this.state.customList.length}
          list={this.state.customList}
          />
      </div>
    )
  }
})

const NewAlerts = React.createClass({
  getInitialState(){
    return {
      customList:[],
      list:[]
    }
  },
  componentDidMount() {
    this.buildCustom(this.props.list)
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list
    }, this.buildCustom(nextProps.list))

  },
  buildCustom(list) {
    console.log("lissdafsfasdt", list)
    let customList = [];
    list.forEach((itemString)=>{
      let item;
      if (typeof itemString === "string"){
        item = JSON.parse(itemString)
      } else {
        item = itemString
      }
      let alertDetailsLink = '#AlertReport/'+item.id+"?starttime="+item.startDate+"&endtime="+item.endDate
      if (item){
        let set = [];
        let time = moment.utc(item.triggeredTime).format('MM[/]DD[/]YY [@] HH[:]mm')
        set.push(<div><div style={{color:'rgb(76, 88, 164)'}}>{item.alert}</div><div></div><div style={{color:'#737684'}}>{time}</div></div>);
        set.push(<a href={alertDetailsLink} target="_blank">View Details</a>);
        set.push(item.severity)
        set.push(item.alert);
        customList.push(set);
      }
    })
    this.setState({
      customList: customList
    })
  },
  render() {
    return (
      <div>
        <ContentSection
          name={"ALERTS"}
          number={this.state.customList.length}
          list={this.state.customList}
          />
      </div>
    )
  }
})

const CustomPopover = React.createClass({
  render() {
    let style = {
          ...this.props.style,
          position: 'absolute',
          backgroundColor: '#FFF',
          border: '1px solid #4C58A4',
          borderRadius: '3px',
          marginLeft: '-100px',
          marginTop: 0,
          padding: '10px',
          zIndex: 2,
          fontSize: '14px',
    }
    return (
      <div style={{maxHeight: 'calc(100vh - 210px)', overflowY:'auto', overflowX:'hidden', margin: '-8px 0 0 -12px', width:460}}>
        {this.props.newAlerts && this.props.newAlerts.length > 0
          ?
          <NewAlerts
          list={this.props.newAlerts}
          />
          :
          <span></span>
          }
        {this.props.latestTests && this.props.latestTests.length > 0
          ?
          <LatestTests
          list={this.props.latestTests}
          />
          :
          <span></span>
          }
        {this.props.testProgress && this.props.testProgress.length > 0
          ?
          <TestInProgress
          list={this.props.testProgress}
          />
          :
          <span></span>
        }
        {this.props.scheduledTests && this.props.scheduledTests.length > 0
          ?
          <ScheduledTests
          list={this.props.scheduledTests}
          />
          :
          <span></span>
        }
        {this.props.eventLog && this.props.eventLog.length > 0
          ?
        <EventLog
          list={this.props.eventLog}
          />
          :
          <span></span>}
        {/*{this.props.generatedReport && /*{this.props.generatedReport.length > 0
          ?
        <GeneratedReport
          list={this.props.generatedReport}
          />
          :
          <span></span>}*/}
        {this.props.pulsarUpdates && this.props.pulsarUpdates.length > 0
          ?
        <PulsarUpdates
          list={this.props.pulsarUpdates}
          />
          :
          <span></span>}
        <div style={{width:"400px"}}></div>
      </div>
    );
  },
});

const MyHeader = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
  },
  getInitialState() {
    //*********Please keep the following comments to show required data type*********
    return {
      show: false,
      count: 0,
      countAlert: 0,
      latestTests:[
        // ["Azure Scan1", "09/17/2019 @ 15:53:37", "Score 45"],
        // ["Hybrid Cavirin", "09/17/2019 @ 15:53:37", "Score 63"],
        // ["My AWS Test2", "09/17/2019 @ 15:53:37", "Score 81"],
        // ["AWS Linux Prod", "09/28/2018 @ 15:53:37", "Score 68"],
        // ["Docker Scan1", "09/17/2019 @ 15:53:37", "Score 39"],
        // ["My AWS Test", "10/17/2019 @ 12:23:27", "Score 90"],
        // ["Docker Scan2", "09/17/2019 @ 15:53:37", "Score 33"],
        // ["Azure Scan2", "09/17/2019 @ 15:53:37", "Score 35"],
        // ["Test Prod", "09/17/2019 @ 15:53:37", "Score 63"],
        // ["Test Dev", "09/17/2019 @ 15:53:37", "Score 28"],
        // ["Amazon Scan2", "09/17/2019 @ 15:53:37", "Score 67"],
        // ["Prod Server test", "09/17/2019 @ 15:53:37", "Score 55"]
      ],
      testProgress:[
        // ["My AWS Test111", "09/17/2019 @ 15:53:37", 1, 1],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 71, 18],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 17, 19],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 55, 20],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 90, 21],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 7, 22],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 7, 23],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 7, 24],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 7, 25],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 7, 26],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 7, 27],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", 7, 28]
      ],
      generatedReport:[
        //["reportLink,reportName,date"]
        //["http://localhost:3000/sendreport/12,testName,Mon Jul 17 2017 16:34:05 GMT+0530 (IST)"]
      ],
      scheduledTests:[
        // ["My AWS test", "09/17/2019 @ 15:53:37"],
        // ["Hybrid Cavirin", "09/17/2019 @ 15:53:37"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37"],
        // ["AWS Linux Prod", "09/28/2018 @ 15:53:37"],
        // ["Docker Scan1", "09/17/2019 @ 15:53:37"],
        // ["My AWS Test", "10/17/2019 @ 12:23:27"],
        // ["Docker Scan2", "09/17/2019 @ 15:53:37"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37"]
      ],
      eventLog:[
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "SUCCESS"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "EDIT"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "REMOVE"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "REMOVE"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "WARNING"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "SUCCESS"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "WARNING"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "WARNING"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "SUCCESS"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "EDIT"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "REMOVE"],
        // ["My AWS Test", "09/17/2019 @ 15:53:37", "SUCCESS"],
      ],
      pulsarUpdates:[
        [
          // "PULSAR 0.9 Released", "04/08/2017 @ 08:53"
        ]
      ],
      newAlerts:[
        // starttime=2017-12-10T00:00:00.000Z&endtime=2017-12-11T22:55:57.929Z&_k=rblwkc
        // {"id": 1, "alertName": "testing", "severity":"High", "time":"09/17/2019 @ 15:53:37", "startDate":"2017-12-10T00:00:00.000Z", "endDate":"2017-12-11T22:55:57.929Z"},
        // {"id": 2, "alertName": "testing2", "severity":"Medium", "time":"09/17/2019 @ 15:53:37", "startDate":"2017-12-10T00:00:00.000Z", "endDate":"2017-12-11T22:55:57.929Z"},
        // {"id": 3, "alertName": "testing3", "severity":"Low", "time":"09/17/2019 @ 15:53:37", "startDate":"2017-12-10T00:00:00.000Z", "endDate":"2017-12-11T22:55:57.929Z"}

      ]
     };
  },
  componentDidMount() {
    scheduledTestsData()
    .then((data) => {
      this.setState({
        scheduledTests: data
      });
    })
    .catch((error) => console.log("Error in getting scheduledTests Data:", error))

    pulsarUpdatesData()
    .then((data) => {
      let dataFormated = this.parseBuild(data);
      this.setState({
        pulsarUpdates: dataFormated
      });
    })
    .catch((error) => console.log("Error in getting scheduledTests Data:", error))

    eventLogData(12)
    .then((data) => {
      var parsedData = [];
      for (var i = 0; i < data.length; i++){
        let messageError = data[i].message.slice(0, 19);
        // // CREDENTIALS_MISSING for IP: 52.90.230.18
        // var cred = "CREDENTIALS_MISSING";
        // console.log("data[i].message.substring(0, 20)", data, data[i].message.slice(0, 19), typeof messageError, messageError != cred)
        if (data[i].message.slice(0, 19) != "CREDENTIALS_MISSING" && data[i].message.slice(0, 15) != "CONTENT_MISSING"){
          // console.log("datafdkfjaskldf", data, data[i].message)
          parsedData.push(this.parseScanEvents(JSON.parse(data[i].message)))
        }
      }
      this.setState({
        eventLog: parsedData
      });
    })
    .catch((error) => console.log("Error in getting eventLog Data:", error))

    getReportsMainList(0,0,{})
      .then((res)=>{
          let data = this.parseReports(res.assessments)
          this.setState({
            latestTests: data
          });
      })
      .catch((error) => console.log("Error in getting reports Data:", error))

    getAlertList(12)
    .then((data) => {
      this.setState({
        newAlerts: data
      });
    })
    .catch((error) => console.log("Error in getting alertList Data:", error))

    this.showOngoingTests();
    socket.on('connection', (data)=>{console.log("a user has connected yayy")});
    socket.on('statusUpdate', (data)=>{this.debouncedtestProgressUpdate(this.testProgressUpdate, data)});
    socket.on('scanEvents',this.eventLogUpdate);
    socket.on('scheduledTests',this.scheduledTestsUpdate);
    socket.on('pulsarUpdates',this.pulsarUpdatesUpdate);
    socket.on('reportNotification', this.generatedReport);
    socket.on('removeFromLocalList', this.removeFromLocalList);
    socket.on('monitoringAlert', this.newAlert);


  },

  newAlert(data){
    console.log("monitoringAlert", data)
    var alert = this.state.newAlerts;
    alert.unshift(data);
    this.setState({
      newAlerts: alert
    }, ()=>{
      this.addCountAlert();
    })
  },

  removeFromLocalList(idObj){
    console.log("SOCKETS YO!", idObj)

    let id = idObj.assetgroupid;
    console.log("SOCKETS YO!", id)
    let localList = JSON.parse(localStorage.getItem("localInProgress"));
    let removedList = _.filter(localList, function(item){
        return item[3] != id;
      });
    localStorage.setItem("localInProgress", JSON.stringify(removedList));
    this.setState({
      testProgress:removedList
    }, (res)=>{console.log("new testProgress after COMPLETE update from sockets", this.state.testProgress)})
  },

  findDash(buildID){
    for(var i = 0; i < buildID.length; i++){
      if(buildID[i] === "-"){
        return i + 1
      }
    }
  },

  parseBuild(data){
    let dataFormated = [];
    let buildID = data.buildID[0];
    var dash = this.findDash(buildID);
    let backendBuild = data.buildID[0].length > 45? data.buildID[0].slice(((data.buildID[0].length/2) - 8), data.buildID[0].length/2):data.buildID[0].slice(dash, dash+8)
    let uiBuild = data.buildID[0].slice(data.buildID[0].length-8, data.buildID[0].length)
    let buildVersion = "Version " + data.majorversion[0] + "." + data.minorversion[0] + " (" + backendBuild + "-" + uiBuild + ")";
    console.log("buildIDbuildID", buildID, uiBuild, dash, backendBuild)
    dataFormated.push(buildVersion);
    dataFormated.push(moment.utc(data.builddatetime+"Z").format('MM[/]DD[/]YY [@] HH[:]mm'))
    dataFormated.push(buildID);
    return dataFormated;
  },

  parseReports(data){
    let results = [];
    for(var i = 0; i < data.length; i++){
      let test = []
      if (data[i].status === "COMPLETED"){
        test.push(data[i].testName)
        test.push(moment.utc(data[i].endtime).format('MM[/]DD[/]YY [@] HH[:]mm'))
        test.push(`Score ${data[i].score}`)
        results.push(test)
      }
    }
    return results
  },
    showOngoingTests(){
      let localInProgress = JSON.parse(localStorage.getItem("localInProgress")) || [];
      console.log("localInProgress6 get", localInProgress)
      this.setState({
        testProgress: localInProgress
      })
    },
    debouncedtestProgressUpdate: _.debounce(function(validatingFunction, update, status) {
      validatingFunction(update, status);
    }, 1500),
    testProgressUpdate(update, status){
      console.log("update, statusupdate, status", update, status)
      if (status === "Started") {
        let localInProgress = JSON.parse(localStorage.getItem("localInProgress")) || []
        console.log("localInProgress1 get", localInProgress)
        let newItem = [];
        newItem.push(update.name)
        newItem.push(update.time)
        newItem.push(0)
        newItem.push(update.id)
        this.updateList('testProgress', this.state.testProgress, newItem)

        localInProgress.push(newItem)
        console.log("localInProgress2", localInProgress)
        localStorage.setItem("localInProgress", JSON.stringify(localInProgress))
      } else if (status === "Completed"){
        let localInProgress = JSON.parse(localStorage.getItem("localInProgress")) || []
        console.log("localInProgress3 get", localInProgress)
        let currentTestProgress = this.state.testProgress;
        for (var i = 0; i < currentTestProgress.length; i++){
          if (currentTestProgress[i][3] == update.id){
            currentTestProgress.splice(i, 1)
          }
        }
        for (var i = 0; i < localInProgress.length; i++){
          if (localInProgress[i][3] == update.id){
            localInProgress.splice(i, 1)
          }
        }
        console.log("localInProgress4", localInProgress)
        localStorage.setItem("localInProgress", JSON.stringify(localInProgress))
        this.setState({
          testProgress:currentTestProgress
        }, (res)=>{console.log("new testProgress after COMPLETE update from sockets", this.state.testProgress)})
      } else {
        let currentTestProgress = this.state.testProgress;
        var itemToUpdate = findIndex(currentTestProgress, update.id);
          currentTestProgress[itemToUpdate][2] = update.percent;
          // console.log("localInProgress5", localInProgress)
          localStorage.setItem("localInProgress", JSON.stringify(currentTestProgress))
          this.setState({
            testProgress:currentTestProgress
          }, (res)=>{console.log("new testProgress after update from sockets", this.state.testProgress)})
      }
    },

    updateList(name, updateType, update){
      let duplicate = checkDuplicates(update, updateType);
      if (!duplicate){
        this.addCount();
        let currentLog = updateType;
        let newObj = {}
        if(currentLog.length > 15){
          currentLog.pop();
          currentLog.unshift(update);
        } else {
          currentLog.unshift(update);
        }
        newObj[name] = currentLog
        this.setState({
          newObj
        }, (res)=>{console.log("new list after update from sockets", updateType)})
      }
    },

    parseScanEvents(update){
      // console.log("Why am I getting an error here? parseScanEvents(update)", update, update.status)
        if (update.policypackname && update.status === "Completed"){
          var newUpdate = [];
          newUpdate.push("Policy Execution Completed: " + update.name + " " + update.policypackname)
          newUpdate.push(moment.utc(update.time).format('MM[/]DD[/]YY [@] HH[:]mm'))
          newUpdate.push('pPComplete')
          newUpdate.push(update.worklogID)
          return newUpdate;
        } else {
          var newUpdate = [];
          var event
          if(update.status === "Started"){
            event = "Scan Start: "
          } else {
            event = "Scan Completed: "
          }
          newUpdate.push(event + update.name)
          newUpdate.push(moment.utc(update.time).format('MM[/]DD[/]YY [@] HH[:]mm'))
          newUpdate.push(update.status)
          return newUpdate;
      }
    },

    eventLogUpdate(update){
      console.log("eventLogUpdateeventLogUpdate =)", update)
      //*********Please keep the following comments to show required data type*********

      // N Viriginia with Policy Pack  ,2017/07/14 @ 12:48 UTC,assessment ======START
      // N Viriginia,with policy pack root.CISPP,Fri Jul 14 00:48:38.639037 2017 UTC,assessment completed,WorklogPolicypackID:2 ======cCOMPLETE
      // Viriginia,Fri Jul 14 00:48:38.645989 2017 UTC,assessment completed,WorkLogID:2 ====== COMPLETE

      var newUpdate = this.parseScanEvents(update)
      this.updateList('eventLog', this.state.eventLog, newUpdate)
      this.debouncedtestProgressUpdate(this.testProgressUpdate, update, update.status);
    },

    latestTestsUpdate(update){
      this.updateList("latestTests", this.state.latestTests, update)
    },

    scheduledTestsUpdate(update){
      this.updateList("scheduledTests", this.state.scheduledTests, update)
    },

    generatedReport(update){
      this.updateList("generatedReport", this.state.generatedReport, update)
    },
    pulsarUpdatesUpdate(update){
      this.updateList("pulsarUpdates", this.state.pulsarUpdates, update)
    },
  addCount(){
    let count = this.state.count + 1;
    this.setState({
      count:count
    })
  },
  addCountAlert(){
    let count = this.state.countAlert + 1;
    this.setState({
      countAlert:count
    })
  },
  resetCount(){
    this.setState({
      count:0
    })
  },
  resetCountAlert(){
    this.setState({
      countAlert:0
    })
  },
  toggle() {
    if (this.state.show === false){
      this.resetCount();
    }
    this.setState({ show: !this.state.show });
  },
  toggleAlert() {
    if (this.state.show === false){
      this.resetCountAlert();
    }
    this.setState({ show: !this.state.show });
  },
  render() {
    let navColorStyle = {  backgroundColor: '#4C58A4', border: 0, marginBottom: 0, height: '80px', paddingTop: '15px', borderRadius:'0px'}
    let colstyle = {color: 'white'}
    let pstyle = { paddingLeft: '20px', fontSize:'27px', paddingTop:'-30px', paddingBottom:'24px', paddingRight: '-156px', marginTop: '10px'}
    let notificationCount;
    let notifColor;
      if(this.state.count == 0) {
        notificationCount = (<span style={{width:"25px", opacity:"0"}}>.....</span>)
        notifColor = "rgb(153, 160, 203)"
      } else if(0 < this.state.count && this.state.count < 10) {
        notificationCount = (<span className={numberCircle}>{` ${this.state.count} `}</span>)
        notifColor = "white"
      } else if(10 <= this.state.count && this.state.count <= 99) {
        notificationCount = (<span className={numberCircle}>{`${this.state.count}`}</span>)
        notifColor = "white"
      } else if(this.state.count > 99) {
        notificationCount = (<span className={numberCircle}>{`99+`}</span>)
        notifColor = "white"
      }

      let alertCount;
      let alertColor;
        if(this.state.countAlert == 0) {
          alertCount = (<span style={{width:"25px", opacity:"0"}}>.....</span>)
          alertColor = "rgb(153, 160, 203)"
        } else if(0 < this.state.countAlert && this.state.countAlert < 10) {
          alertCount = (<span className={numberCircle}>{` ${this.state.countAlert} `}</span>)
          alertColor = "white"
        } else if(10 <= this.state.countAlert && this.state.countAlert <= 99) {
          alertCount = (<span className={numberCircle}>{`${this.state.countAlert}`}</span>)
          alertColor = "white"
        } else if(this.state.countAlert > 99) {
          alertCount = (<span className={numberCircle}>{`99+`}</span>)
          alertColor = "white"
        }
      let that = this;
      let popover = (
        <Popover id="popover-trigger-click-root-close" style={{marginTop:'29px', marginLeft:"2", maxWidth:"600px", borderRadius: "0px"}}  placement="bottom">
          <CustomPopover
             closeHandler={this.toggle}
             latestTests={this.state.latestTests}
             generatedReport={this.state.generatedReport}
             testProgress={this.state.testProgress}
             scheduledTests={this.state.scheduledTests}
             eventLog={this.state.eventLog}
             pulsarUpdates={this.state.pulsarUpdates}
             />
         </Popover>
      )
      let popoverAlert = (
        <Popover id="popover-trigger-click-root-close" style={{marginTop:'29px', marginLeft:"2", maxWidth:"600px", borderRadius: "0px"}}  placement="bottom">
          <CustomPopover
             closeHandler={this.toggle}
             newAlerts={this.state.newAlerts}
             />
         </Popover>
      )
    return (
      <nav className="navbar navbar-default" style={navColorStyle}>
			  <div className="container-fluid">
			    <div className="navbar-header">
            <div className="navbar-brand" style={{color: 'white', fontSize: 24, marginTop: 10}}>{this.props.name}</div>
 			    </div>
			    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style={colstyle}>
			      <ul className="nav navbar-nav navbar-right">
                <span>
                  <span style={{borderRight: 'thin solid #D8D8D8', paddingTop:"13"}}>
                    <OverlayTrigger trigger="click" rootClose placement="bottom" style={{overflow:'auto'}} overlay={popover}>
                      <Glyphicon  ref="target" style={{fontSize: '27px', color:notifColor, marginRight:0, cursor:'pointer'}} glyph='list-alt' onClick={this.toggle} ></Glyphicon>
                    </OverlayTrigger>
                    {notificationCount}
                  </span>
                </span>
                {' '}
                <span>
                  <span style={{borderRight: 'thin solid #D8D8D8', paddingTop:"13"}}>
                    <OverlayTrigger trigger="click" rootClose placement="bottom" style={{overflow:'auto'}} overlay={popoverAlert}>
                      <Glyphicon  ref="target" style={{fontSize: '27px', color:alertColor, marginLeft:15, cursor:'pointer'}} glyph='bullhorn' onClick={this.toggleAlert} ></Glyphicon>
                    </OverlayTrigger>
                    {alertCount}
                  </span>
                </span>
                {' '}
                <UserOptions
                  login={this.props.login}
                  />
			      </ul>
			    </div>
			  </div>
			</nav>

    )
  },
})

const UserOptions = React.createClass({
  getInitialState(){
    return({
      show: false
    })
  },
  componentDidMount(){
  },
  toggle() {
    setTimeout(function(){
      let myVar = document.getElementById('popover-trigger-click-root-close').firstChild
    }, 10)

    this.setState({ show: !this.state.show });
  },
  render(){
    let pstyle = { paddingLeft: '20px', fontSize:'27px', paddingTop:'-30px', paddingBottom:'24px', paddingRight: '-156px', marginTop: '10px'}
    let userOptionsPopover = (
          <Popover  id="popover-trigger-click-root-close"
            style={{marginTop:'25px', maxWidth:"600px", borderRadius: "0px"}}
            placement="bottom">
              <UserPopover closeHandler={this.toggle}/>
          </Popover>
        )
    return (
      <span>
        <span style={{paddingLeft:"10"}}>
          <svg width="34px" height="34px" viewBox="1417 23 34 34" version="1.1">
              <g id="Group-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(1418.000000, 27.000000)">
                  <circle id="Oval-6" stroke="#FFFFFF" fill-opacity="0.3" fill="#D8D8D8" cx="16" cy="16" r="16"></circle>
                  <path d="M19.1550404,24.4269952 L19.1550404,23.908489 C20.2184177,22.9721469 21.1074011,21.6255463 21.5338154,20.0483782 C21.5423224,20.0483782 21.6125053,20.0527081 21.6220757,20.0527081 C22.9353467,20.0527081 23.2735006,17.2761562 23.2735006,16.8604853 C23.2735006,16.4458968 23.3245427,14.785378 21.9953211,14.785378 C24.8536793,6.88330043 17.2888133,3.71380958 11.6029349,7.76227126 C9.25818801,7.76227126 9.07316036,11.2738247 9.93449596,14.785378 C8.60740111,14.785378 8.66163335,16.4458968 8.66163335,16.8604853 C8.66163335,17.2761562 8.96788601,20.0527081 10.2822203,20.0527081 C10.2843471,20.0527081 10.410889,20.0505432 10.4130157,20.0505432 C10.8383667,21.6201339 11.7113994,22.9613222 12.7747767,23.8987467 L12.7747767,24.4269952 C12.7747767,25.3048836 12.6503615,26.7045255 8.33943003,27.4990632 C7.4281157,27.666847 6.61675883,27.9850951 6,28.3823639 C8.74032327,30.6414921 12.1952361,32 15.9957465,32 C19.7930668,32 23.2607401,30.6436571 26,28.3888588 C25.3864313,27.9937549 24.5059549,27.6733419 23.604211,27.4990632 C19.3049766,26.6623089 19.1550404,25.3048836 19.1550404,24.4269952" id="Fill-1" fill="#FFFFFF"></path>
              </g>
          </svg>
          <span>
            <span style={{fontSize: '20px', fontStyle: 'Italic'}}>{' '} &nbsp;&nbsp;Hi {this.props.login}&nbsp;!
              <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={userOptionsPopover}>
                  <Glyphicon style={{fontSize: '12px', marginLeft:"50px", marginRight:"50px", cursor:'pointer'}}
                    ref="targetUser" glyph="menu-down" onClick={this.toggle} >
                  </Glyphicon>
              </OverlayTrigger>
            </span>
          </span>
        </span>
      </span>
    )
  }
})

const UserPopover = React.createClass({
  showToolTip(){
    document.getElementById('tootTipLoadTemp').style.visibility="visible";
  },
  hideToolTip(){
    document.getElementById('tootTipLoadTemp').style.visibility="hidden";
  },

  showBillingToolTip(){
    document.getElementById('tootTipBilling').style.visibility="visible";
  },
  hideBillingToolTip(){
    document.getElementById('tootTipBilling').style.visibility="hidden";
  },

  showToolTipRN(){
    document.getElementById('tootTipRN').style.visibility="visible";
  },
  hideToolTipRN(){
    document.getElementById('tootTipRN').style.visibility="hidden";
  },
  showToolTipAppSettings(){
    document.getElementById('tootTipAppSettings').style.visibility="visible";
  },
  hideToolTipAppSettings(){
    document.getElementById('tootTipAppSettings').style.visibility="hidden";
  },

  render() {
    let style = {
          ...this.props.style,
          position: 'absolute',
          backgroundColor: '#FFF',
          border: '1px solid #4C58A4',
          borderRadius: '3px',
          marginLeft: '-100px',
          marginTop: 0,
          padding: '10px',
          zIndex: 2,
          fontSize: '14px',
    }
    return (
      <div>
        {/*}<div style={{paddingTop:"5"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="asterisk"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/addcloud">
            My Account Info
        </Link>
      </div>*/}
        <div style={{paddingTop:"15"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="th-list"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/addcloud">
            Cloud Management
        </Link>
      </div>
        <div style={{paddingTop:"15"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="user"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/usermanagement/userInfoTab">
            User Management
        </Link>
      </div>
        <div style={{paddingTop:"15"}}>
           <Glyphicon style={{fontSize: '17px'}} glyph="dashboard"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         <Link to="/billingInformation/billingInfoDetails">License Information</Link>
         {/*<span style={{position:'relative'}}>
          <span style={{color:'#95c3ea', cursor:'pointer'}} onMouseOver={this.showBillingToolTip} onMouseOut={this.hideBillingToolTip}>Billing Information</span>
          <div id="tootTipBilling" className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484 ', color:'#fff', textAlign:'center', position:'absolute', top:25, left:-24, padding:'6px 4px', borderRadius:3, zIndex:99}}>Coming soon</div>
        </span>*/}
      </div>
      <div style={{paddingTop:"15"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="wrench"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to='/applicationSettings/about'>
            Application Settings
          </Link>
          {/*<span style={{position:'relative'}}>
            <span style={{color:'#95c3ea', cursor:'pointer'}} onMouseOver={this.showToolTipAppSettings} onMouseOut={this.hideToolTipAppSettings}>Application Settings</span>
            <div id="tootTipAppSettings" className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484 ', color:'#fff', textAlign:'center', position:'absolute', top:25, left:-24, padding:'6px 4px', borderRadius:3, zIndex:99}}>Coming soon</div>
          </span>*/}
      </div>
      <hr/>
        <div style={{paddingTop:"5"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="thumbs-up"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://cavirin.zendesk.com/hc/en-us" target="_blank">
            Feedback and Support
        </a>
      </div>
        <div style={{paddingTop:"15"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="folder-open"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/*<Link to="">
            Product Guide
        </Link>*/}
        <span style={{position:'relative'}}>
          <span style={{color:'#95c3ea', cursor:'pointer'}} onMouseOver={this.showToolTip} onMouseOut={this.hideToolTip}>Product Guide</span>
          <div id="tootTipLoadTemp" className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484 ', color:'#fff', textAlign:'center', position:'absolute', top:25, left:-24, padding:'6px 4px', borderRadius:3, zIndex:99}}>Coming soon</div>
        </span>
      </div>
        <div style={{paddingTop:"15"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="briefcase"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a target="_blank" href={NetworkConstants.NGINX_SERVER+"documentation"}>API Documentation</a>
      </div>
        <div style={{paddingTop:"15"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="list-alt"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/*<Link to="/addcloud">
            Release Notes
        </Link>*/}

        <span style={{position:'relative'}}>
          <span style={{color:'#95c3ea', cursor:'pointer'}} onMouseOver={this.showToolTipRN} onMouseOut={this.hideToolTipRN}>Release Notes</span>
          <div id="tootTipRN" className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484 ', color:'#fff', textAlign:'center', position:'absolute', top:25, left:-24, padding:'6px 4px', borderRadius:3, zIndex:99}}>Coming soon</div>
        </span>
      </div>
      <hr/>
        <div style={{paddingTop:"5", paddingBottom:"5"}}>
          <Glyphicon style={{fontSize: '17px'}} glyph="time"></Glyphicon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to='/logout'>
            Log Out
          </Link>
      </div>
      </div>
    );
  },
})

const Header = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
   },
  render() {
    return (
       <MyHeader name={this.props.name} login={this.props.login}/>
    )
  },
})

export default connect(
  ({users}) => ({login: users.login}),
 )(Header)
