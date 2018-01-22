import image from 'assets/gear.png'
import ReactDOM from 'react-dom'
import { modalContainer, tableContainer, tablePointer, modalCloseStyle, barContainer, dashboardBar,popupCustom, toolTipStyle} from './styles.css'
//import url("sharedStyles/styles.css");
import {MetaItem, ReportHeader, ReportTitle, CircularScoreGraph, GraphLegendsForHorizontal} from './ReportCommon'
import {StackedHorizontalBarChart} from '../../components/Report/ReportCommon'

import { blueBtn , btnPrimary, mytable, selectStyle, navbar,modalDialogClassDash, modalDialogClassDashLarge, hrStyle,hrStyleInDash} from 'sharedStyles/styles.css'
import styles from 'sharedStyles/styles.css'
import React, { PropTypes } from 'react'
import {  Nav, Navbar, Form, FormGroup,
         ControlLabel, Button, Grid, Row , Col, Glyphicon, OverlayTrigger, Popover,FormControl, Modal, pullRight, Tooltip, Overlay, HelpBlock} from 'react-bootstrap'
//import DatePicker from 'react-bootstrap-date-picker'
import { score, scoreDescription , paddingThirty, diamond, triangleup, sevcircle,
            lineSeparator, sideLine, triangle, border, tooltip, dropdown, numberCircle, public_fixedDataTableCell_cellContent, Q1severityHigh} from './styles.css'
import { BarChart, PieChart, LineChart, AreaChart } from 'react-d3-components'
import { Header } from 'components'
import {Table,Column, Cell} from 'fixed-data-table'
import Dimensions from 'react-dimensions'
import {getIntegrations, pagerDutyAPI,JiraAPI, getQuestionData, getQoneTableData, getHorizontalChartData, getHorizontalScoreChartData, saveTemplateAPI, loadTemplateAPI, deleteTemplateAPI, getTemplateAPIById,ServiceNowAPI} from 'helpers/dashboard'
import {getSummaryData,newGetSummaryData} from 'helpers/complianceSummary'
import {getCloudPolicyResultsList, getScoreWithWorklogId} from 'helpers/reports'
import {getPolicyDetails, newGetPolicyPackRules} from 'helpers/policies'
import {AccessCell,ArrayLinkCell,ScoreCell,TextCell,LinkCell,CheckboxCell} from 'components/Table/Table'
import {ResponsiveBarChart,
ResponsiveLineChart,
ResponsiveAreaChart,
ResponsiveScatterPlot,
ResponsivePieChart} from './responsive';
import getAssetGroupsList from 'helpers/assetGroups'
import {DashboardFilters} from './DashboardFilters'
import SunBurstChart from './SunBurst'
import Top25Issues from './Top25Issues'
import UmbrellaChart from './Umbrella'
import SunBurstZoomChart from './SunBurstZoom'
import {SpinnyLogo} from 'containers'
import Joi from 'joi-browser'
import moment from 'moment'
import onClickOutside from 'react-onclickoutside'
import handleClickOutside from 'react-onclickoutside'
import AlertComponent from 'components/Common/AlertComponent'
import Select from 'react-select'
import DatePicker from 'components/Common/DatePicker'
import AttributeConstants from 'constants/AttributeConstants'
import GenerateDashboardReport from "./GenerateDashboardReport"
import DashboardBarChart from './DashboardBarChart'
import DashboardStackedChart from './DashboardStackedChart'

//
// let range = [ '#F44336', '#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#FF8A80', '#FF5252', '#FF1744', '#D50000', '#E91E63', '#FCE4EC', '#F8BBD0', '#F48FB1', '#F06292', '#EC407A', '#E91E63', '#D81B60', '#C2185B', '#AD1457', '#880E4F', '#FF80AB', '#FF4081', '#F50057', '#C51162', '#9C27B0', '#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A', '#4A148C', '#EA80FC', '#E040FB', '#D500F9', '#AA00FF', '#673AB7', '#EDE7F6', '#D1C4E9', '#B39DDB', '#9575CD', '#7E57C2', '#673AB7', '#5E35B1', '#512DA8', '#4527A0', '#311B92', '#B388FF', '#7C4DFF', '#651FFF', '#6200EA', '#3F51B5', '#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB', '#5C6BC0', '#3F51B5', '#3949AB', '#303F9F', '#283593', '#1A237E', '#8C9EFF', '#536DFE', '#3D5AFE', '#304FFE', '#2196F3', '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF', '#03A9F4', '#E1F5FE', '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#0277BD', '#01579B', '#80D8FF', '#40C4FF', '#00B0FF', '#0091EA', '#00BCD4', '#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#0097A7', '#00838F', '#006064', '#84FFFF', '#18FFFF', '#00E5FF', '#00B8D4', '#009688', '#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B', '#00695C', '#004D40', '#A7FFEB', '#64FFDA', '#1DE9B6', '#00BFA5', '#4CAF50', '#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20', '#B9F6CA', '#69F0AE', '#00E676', '#00C853', '#8BC34A', '#F1F8E9', '#DCEDC8', '#C5E1A5', '#AED581', '#9CCC65', '#8BC34A', '#7CB342', '#689F38', '#558B2F', '#33691E', '#CCFF90', '#B2FF59', '#76FF03', '#64DD17', '#CDDC39', '#F9FBE7', '#F0F4C3', '#E6EE9C', '#DCE775', '#D4E157', '#CDDC39', '#C0CA33', '#AFB42B', '#9E9D24', '#827717', '#F4FF81', '#EEFF41', '#C6FF00', '#AEEA00', '#FFEB3B', '#FFFDE7', '#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#F57F17', '#FFFF8D', '#FFFF00', '#FFEA00', '#FFD600', '#FFC107', '#FFF8E1', '#FFECB3', '#FFE082', '#FFD54F', '#FFCA28', '#FFC107', '#FFB300', '#FFA000', '#FF8F00', '#FF6F00', '#FFE57F', '#FFD740', '#FFC400', '#FFAB00', '#FF9800', '#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100', '#FFD180', '#FFAB40', '#FF9100', '#FF6D00', '#FF5722', '#FBE9E7', '#FFCCBC', '#FFAB91', '#FF8A65', '#FF7043', '#FF5722', '#F4511E', '#E64A19', '#D84315', '#BF360C', '#FF9E80', '#FF6E40', '#FF3D00', '#DD2C00', '#795548', '#EFEBE9', '#D7CCC8', '#BCAAA4', '#A1887F', '#8D6E63', '#795548', '#6D4C41', '#5D4037', '#4E342E', '#3E2723', '#9E9E9E', '#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242', '#212121', '#607D8B', '#ECEFF1', '#CFD8DC', '#B0BEC5', '#90A4AE', '#78909C', '#607D8B', '#546E7A', '#455A64', '#37474F', '#263238', '#00000']
//
// let newArr = [];
//
// for (var i = 0; i < range.length; i++){
//   if(i%11 === 0){
//      newArr.push(range[i])
//   }
// }
//
// console.log(newArr)

// the <div> tag is used to position and wrap the chart.
  function getFormatterDate(date)
{
  if(date!=undefined)
  {
    var fullDate = new Date(date);
  }
  else{
    var fullDate = new Date()
  }
   fullDate.setHours(0, 0, 0, 0);

  // var twoDigitMonth = (fullDate.getMonth()+1) + "";
  // if (twoDigitMonth.length == 1)
  //     twoDigitMonth = "0" + twoDigitMonth;
  // var twoDigitDate = fullDate.getDate() + "";
  // if (twoDigitDate.length == 1)
  //     twoDigitDate = "0" + twoDigitDate;
  // var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear(); console.log(currentDate);
  console.log("ABCD"+new Date(fullDate).getTime());
  return new Date(fullDate).getTime();
}
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}


function findElement(arr, propName, propValue) {
  for (let i = 0; i < arr.length; i++)
    if (arr[i].propName == propValue){
      return arr[i];
    }
}

//wrapped by this onclickoutside HOC:
const ComplianceChartChooser = onClickOutside(React.createClass({
  getInitialState() {
    return {
      chartsList:this.props.chartsList,
      dataList:this.props.dataList
    }
  },

  handleClickOutside() {
    // ...handling click outside the component goes here...
    this.props.clickOutside()
  },

  handleChange(e){
    this.props.changeHandler(e.target.id)
    // this.props.toggle()
  },
  handleChangeData(e){
    this.props.changeHandlerData(e.target.id)
    // this.props.toggle()
  },
  componentWillReceiveProps(nextProps){
    this.setState({
      chartsList:nextProps.chartsList,
      dataList:nextProps.dataList
    });
  },
  render() {
    let style = {
        ...this.props.style,
        position: 'absolute',
        left:-102,
        top:25,
        backgroundColor: '#FFF',
        borderRadius: 0,
        width:180,
        zIndex: 2,
        minHeight:90,
        padding:'5px 0 0 24px',
        boxShadow:'rgb(173, 173, 173) 4px 3px 6px 1px'
    }
    if(this.props.chartShow){
      style.display='block'
    }else{
      style.display='none'
    }

    let dashboardOptionsPopover = (
      <div className={popupCustom} style={style}>
        <div>
          <div style={{marginTop:'5px', textAlign:'left'}}>Chart Type</div>
         { this.state.chartsList.map((item) =>
           {
             return  (
              <div style={{marginTop:'5px', textAlign:'left'}} key={item.name}>
                <input type='radio' id={item.name} name="chartSelect"
                    defaultChecked={item.show} onClick={this.handleChange}/>
                  <label style={{fontWeight:"400", fontSize: '15'}}
                  htmlFor={item.name}>&nbsp;&nbsp;{item.displayText}</label>
              </div>
           )}
         )}
         <hr style={{marginTop:'5px', textAlign:'left', marginRight:"10px"}}/>
         <div style={{marginTop:'5px', textAlign:'left'}}>Data Type</div>
         { this.state.dataList.map((item) =>
           {
             return  (
              <div style={{marginTop:'5px', textAlign:'left'}} key={item.name}>
                <input type='radio' id={item.name} name="chartDataSelect"
                    defaultChecked={item.show} onClick={this.handleChangeData}/>
                  <label style={{fontWeight:"400", fontSize: '15'}}
                  htmlFor={item.name}>&nbsp;&nbsp;{item.displayText}</label>
              </div>
           )}
         )}
        </div>
      </div>
    )

    return (
      <div style={{height:'22px',width:'22px'}}>
          <span style={{position:'relative'}}>
          <a ref="chooserLink"  style={{fontSize:'24px'}} onClick={this.props.toggle}>
             <img src={image} style={{marginBottom:'20px', textAlign:"right"}}
                height="22px" width="22px" />
          </a>
          {dashboardOptionsPopover}
          </span>
      </div>

    )
  }
}));

const TopFailedPolicies = React.createClass({
  propTypes: {
    for: PropTypes.string.isRequired,
    failed: PropTypes.number.isRequired,
    profile: PropTypes.string.isRequired,
    pagerDuty: PropTypes.bool.isRequired

  },
  getInitialState() {
    return {
      list:[],
      profile: "high",
      pdDesc:"test",
      pdIp:'',
      pagerDuty:"disabled",
      chef:"disabled",
      serviceNow:"disabled",
      jira:"disabled",
      showModalJira:false,
      req_param:{issueType:"Bug"},
    }
  },
  componentWillReceiveProps(nextProps){
    if(this.state.list != nextProps.list) {
      this.setState({
        list: nextProps.list,
      })
    }
    var elements = document.getElementsByClassName('custom_select');
      for (var i = 0; i < elements.length; i++)
      {
          elements[i].selectedIndex = 0;
      }
    if(nextProps.pagerDuty === true) {
      this.setState({
        pagerDuty: ""
      })
    }
     if(nextProps.jira === true) {
      this.setState({
        jira: ""
      })
    }
    if(nextProps.serviceNow === true) {
      this.setState({
        serviceNow: ""
      })
    }
  },
  handleChange: function (rid, e) {

    var tableData = this.state.list[rid];
    console.log("JGHJ"+JSON.stringify(tableData))
    let testIndex = this.getIndex()
    let test = {
      "event_type": "trigger",
      "description": "FAILURE for production/HTTP on machine srv01.acme.com"
    }
    if(e.target.value === "pagerDuty"){
      var FailCount = 0;
      if(this.props.profile=='low')
      {
         FailCount = tableData.low_sev_cnt;
      }
      else if(this.props.profile=='high')
      {
         FailCount = tableData.high_sev_cnt;
      }
      else if(this.props.profile=='medium')
      {
         FailCount = tableData.med_sev_cnt;
      }
      else
      {
         FailCount = tableData.fail_count;
      }
      var request_param ={
                          "severity":this.props.profile,
                          "ipAddress":tableData.ipaddress,
                          "deviceName":tableData.groupnames,
                          "testFailNumber":FailCount,
                          "os":tableData.ostype,
                          "groupName":tableData.groupnames,
                          "link":NetworkConstants.NGINX_SERVER+"pulsar"
                        }

      //this.setState({"req_param":request_param})
      this.callPagerDuty(request_param)
    };
    if(e.target.value === "jira"){
      // Request Params For Jira create issue
      var url = this.props.jira_details.host;
      var host = url.replace(/(^\w+:|^)\/\//, '');
      host = host.replace(/\/$/, "");
      // var request_param ={
      //                     "username": this.props.jira_details.username,
      //                     "password": this.props.jira_details.password,
      //                     "host": host,
      //                     "key": this.props.jira_details.accesskey,
      //                     "summary":"Notification for the IP :"+this.state.pdIp,
      //                     "description":"Notification for the IP :"+this.state.pdIp,
      //                     "name": "Bug"
      //                   }
      var FailCount = 0;
      if(this.props.profile=='low')
      {
         FailCount = tableData.low_sev_cnt;
      }
      else if(this.props.profile=='high')
      {
         FailCount = tableData.high_sev_cnt;
      }
      else if(this.props.profile=='medium')
      {
         FailCount = tableData.med_sev_cnt;
      }
      else
      {
         FailCount = tableData.fail_count;
      }
      var request_param ={
                          "severity":this.props.profile,
                          "ipAddress":tableData.ipaddress,
                          "deviceName":tableData.groupnames,
                          "testFailNumber":FailCount,
                          "os":tableData.ostype,
                          "groupName":tableData.groupnames,
                          "link":NetworkConstants.NGINX_SERVER+"pulsar",
                          "issueType":this.state.req_param.issueType,

                        }

      this.setState({"req_param":request_param})
      this.setState({showModalJira:true})
      //this.callJira(request_param)
    };

    if(e.target.value === "serviceNow"){


      /*var host = this.props.serviceNowDetails.url;
      host = host.replace(/\/$/, "");
      if (!host.match(/^[a-zA-Z]+:\/\//))
        {

          host = 'https://' + host;
        }*/
      // Request Params For Jira create issue
      // var request_param_ser ={
      //                     //"username": this.props.serviceNowDetails.username,
      //                     //"password": this.props.serviceNowDetails.password,
      //                    // "url":host,
      //                     "desc":"ServiceNow notification for the ip "+this.state.pdIp,
      //                     "comments": "ServiceNow notification for the ip "+this.state.pdIp
      //                   }
       var FailCount = 0;
      if(this.props.profile=='low')
      {
         FailCount = tableData.low_sev_cnt;
      }
      else if(this.props.profile=='high')
      {
         FailCount = tableData.high_sev_cnt;
      }
      else if(this.props.profile=='medium')
      {
         FailCount = tableData.med_sev_cnt;
      }
      else
      {
         FailCount = tableData.fail_count;
      }

      var request_param_ser ={
                         "severity":this.props.profile,
                          "ipAddress":tableData.ipaddress,
                          "deviceName":tableData.groupnames,
                          "testFailNumber":FailCount,
                          "os":tableData.ostype,
                          "groupName":tableData.groupnames,
                          "link":NetworkConstants.NGINX_SERVER+"pulsar"
                        }


      this.callServiceNow(request_param_ser)
    };

  },
  getIndex:function(e) {
    e = e || window.event;
    var data = [];
    var send = {};
    send.event_type="trigger"
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        var cells = target.getElementsByTagName("td");
        for (var i = 0; i < cells.length-1; i++) {

            data.push(cells[i].innerHTML);
        }
    }
    if (data.length > 5 && e.target.value) {
      console.log(data, e.target.value);
      var IpRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/; //http://www.regular-expressions.info/examples.html
      var Content = data[1];
      var Match = Content.match(IpRegex);
      var IP = '';
      if(Match.length>0)
      {
        IP = Match[0];
      }
      //alert(IP)
      send.description = data[1];
      // send.details = {
      //   hihi: 'supsup'
      // }
      this.setState({pdDesc:send,pdIp:IP})
      // this.callPagerDuty(send)
      // return data;
    } else {
      console.log(data);
    }
  },
  callJira(value){
    console.log(value)
    this.setState({showModalJira:false})
    JiraAPI(value)
    .then((response)=>{
      Alert.show("Jira Notification sent Successfully");
      //alert("Jira Notification sent Successfully");
    })
    .catch((error)=>{
      Alert.show("Unsuccessful Jira Notification");
    })

  },
   callServiceNow(value){

    ServiceNowAPI(value)
    .then((responseservice)=>{


        if(responseservice.response.statusCode&&responseservice.response.statusCode==201){

          Alert.show("ServiceNow Notification sent Successfully with the number "+responseservice.response.body.result.number);
        }

      else
        Alert.show("Unsuccessful ServiceNow Notification ");

    })
    .catch((error)=>{

      Alert.show("Unsuccessful ServiceNow Notification");
    })

  },
  callPagerDuty(value){
    // const song = event.target.getAttribute('index');

    pagerDutyAPI(value)
    .then((response)=>{
      Alert.show("PagerDuty Notification sent Successfully");
    })
    .catch((error)=>{
      Alert.show("Unsuccessful PagerDuty Notification");
    })
  },
  CreateAlert:function(){

    var request_param = {};
    request_param = this.state.req_param;
    this.callJira(request_param)

  },
handleIssuetype:function(e){

    var request_param = {};
    request_param = this.state.req_param;
    request_param.issueType = e.target.value;
    this.setState({"req_param":request_param})

  },
  closeJira()
  {
   this.setState({showModalJira:false})
 },
render() {
    let style = {marginTop: 15}
    let style1 = {paddingBottom: 15}
    let tdstyle = {marginLeft: 15}
    var selectClassName = dropdown+" custom_select"
    // let modalCloseStyle = {fontSize:30, color: '#4C58A4'}
    let iconStyle = {marginTop:"15"}
    let textStyle = {marginTop:"10"}
    let dropdownStyle = {backgroundColor:"white"}
    let that = this;
    let symbol = (<td><div style={iconStyle} className={diamond}></div> </td>)
    if( that.props.profile === 'high'){
      symbol = (<td><div style={iconStyle} className={diamond}></div> </td>)
    } else if( that.props.profile === 'medium'){
      symbol = (<td><div style={iconStyle} className={triangleup}></div> </td>)
    } else if( that.props.profile === 'low'){
      symbol = (<td><div style={iconStyle} className={sevcircle}></div> </td>)
    }
    return (
      <div>
      <AlertComponent ref={(a) => global.Alert = a}/>
        <Row style={{position:'relative', marginBottom:30}}>
          <div style={{right:46, top:-60 }} className={modalCloseStyle} onClick={this.props.onClickHandler}>x</div>
        </Row>
        <Row><Col lg={11} >
          <table className={mytable} style={{boxShadow:'none', marginTop:-21}}>
            <thead>
              <tr>
                <th style={{width:'1%'}}></th>
                <th style={{width:'14%'}}>IP ADDRESS</th>
                <th style={{width:'15%'}}>ASSESSMENTS FAILED</th>
                <th style={{width:'10%'}}>OS</th>
                <th style={{width:'15%'}}>GROUP NAME</th>
                <th style={{width:'15%'}}>ENVIRONMENT</th>
                <th style={{width:'15%'}}>REMEDIATION</th>
              </tr>
            </thead>
            <tbody onClick={this.getIndex}>
            {this.state.list.map(function(reportDetail,index){
              let env = '-';
              env = (reportDetail.assettype && reportDetail.assettype !== 'null' && reportDetail.assettype !== null)? AttributeConstants.ASSET_TYPE[reportDetail.assettype] : '-';

              let fail_count;
              if(reportDetail.high_sev_cnt) {
                fail_count = reportDetail.high_sev_cnt
              } else if(reportDetail.med_sev_cnt) {
                fail_count = reportDetail.med_sev_cnt
              } else if(reportDetail.low_sev_cnt) {
                fail_count = reportDetail.low_sev_cnt
              }
                return (
                  <tr key={index} >
                    {symbol}
                    <td><div style={textStyle}> {reportDetail.ipaddress} </div></td>
                    <td><div style={textStyle}> {fail_count} </div></td>
                    <td><div style={textStyle}> {reportDetail.ostype} </div></td>
                    <td><div style={{marginTop:"10", width:"130px", overflow:"auto"}}> {reportDetail.groupnames} </div></td>
                    <td><div style={textStyle}> {env} </div></td>
                    <td key={index}>
                      <select style={dropdownStyle} className={selectClassName} onChange={that.handleChange.bind(that, index)}>
                        <option selected disabled>Select Action</option>
                        {/*<option disabled disabled={that.state.chef} value='chef'>Remediate with CHEF</option>*/}
                        <option disabled disabled={that.state.serviceNow} value='serviceNow'>ServiceNow request</option>
                        <option disabled={that.state.pagerDuty} ref="pagerDuty" value='pagerDuty'>Notify via PagerDuty </option>
                        <option disabled={that.state.jira} ref="jira" value='jira'>Notify via Jira </option>
                        {/*<option value='custom'>Use custom rule</option>*/}
                      </select>
                     </td>
                  </tr>
                );
            })}
            </tbody>
          </table>
        </Col></Row>

        <Modal show={this.state.showModalJira}
           aria-labelledby="contained-modal-title"
           dialogClassName={modalDialogClassDash}
           backdrop='static' onHide={this.close} style={{"width":"400px"}}>
           <form style={{border: '1px solid Navy'}}>
             <div style={{marginTop:'25px',paddingLeft:'15px'}}>
             <Modal.Header  style={{marginRight:25,borderBottom:0}}>
               <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} style={{fontSize:27, top:12, right:26, transform: 'scale(1.3,0.9)'}} onClick={this.closeJira}>X</a>
               <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'SELECT ISSUETYPE'}</Modal.Title>
             </Modal.Header>
             <Modal.Body>
              <label>Issue Type</label><br/>
              <select style={{"width":"95%"}} onChange={this.handleIssuetype} className={dropdown}><option value="Bug">Bug</option><option value="Task">Task</option><option value="Story">Story</option></select>
             </Modal.Body>
             <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
               <Button style={{backgroundColor:'#FFF',margin:'20px 5px 0px 0px',
                          color:'#4C58A4',borderRadius:0,height:30,paddingTop:'5px'}} onClick={this.closeJira}>Cancel</Button>&nbsp;&nbsp;&nbsp;
               <Button style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 15px',
                        color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}} onClick={this.CreateAlert}>Done</Button>
             </Modal.Footer>
            </div>
           </form>
          </Modal>
      </div>
    )
  }
})

const SeverityTabs = React.createClass({
  getInitialState: function() {
    return {
      highSelect: false,
      midSelect:false,
      lowSelect:false
    }
  },
  propTypes: {
    onClickHandler: PropTypes.func.isRequired,
  },
  render: function () {
    let showStatus = this.props.closeButtonStatus
    let style = {backgroundColor: 'WhiteSmoke', padding: 5}
    let style1 = { padding: '11px 5px 5px'}
    let bgstyle = {backgroundColor: 'WhiteSmoke', marginRight: 20}
    let bgstyle1 ={margin:'0 15px 0 5px'},bgstyle2={margin:'0 15px 0 5px'},bgstyle3={margin:'0 15px 0 5px'}
    // bgstyle1 = bgstyle2 = bgstyle3  = { }
    let hrstyle = {marginTop:0, paddingTop:0}
    let buttonStyle = {display:'inline-block',margin: '50px 0 15px 15px', borderRadius: 0, border:0, fontSize:20, fontWeight:500, letterSpacing:0.2, cursor:'pointer'}
    let buffer = {paddingTop:15, marginBottom:15}
    let Dimensions={height: 25, width: 25, backgroundColor:'#FF444D',transform: 'rotate(45deg)', position:'absolute', left:76.5, top:-11, zIndex:99}
    let glypOnSelect = {position:'absolute', top:-45, left:21, borderTop:'3px solid #4c58a4', color:'#4c58a4', marginTop:20, width:140, paddingLeft:50, paddingTop:0 }
    let Q1severityHighVariable ={}
    let selectionWrapper={marginTop:-10, position:'relative'}

    if(this.state.highSelect){
      Dimensions.backgroundColor='#FF444D'
    }
    else if(this.state.midSelect){
      Q1severityHighVariable.left=185;
      Q1severityHighVariable.color='#ffa500';
      glypOnSelect.left=205;
      Dimensions.left=261;
      Dimensions.backgroundColor='#F9C73D'
    }
    else if(this.state.lowSelect){
      Q1severityHighVariable.left=370;
      glypOnSelect.left=388
      Dimensions.left=446.5
      Dimensions.backgroundColor='#29abe2'
    }
    if(this.state.highSelect){bgstyle1.fontWeight=600} else if(this.state.midSelect){bgstyle2.fontWeight=600}else if(this.state.lowSelect){bgstyle3.fontWeight=600}
    if(!showStatus){
      selectionWrapper.display='none';
      bgstyle1.fontWeight =  bgstyle2.fontWeight = bgstyle3.fontWeight =500
    }

    return (
      <div>
        <div style={buffer}>

          <Row id="severityTabsWrapper">
            <Col lg={10}>
              <div style={buttonStyle} onClick={() => {this.props.onClickHandler("high"); this.setState({ highSelect:true, midSelect:false,lowSelect:false })}}>
                <td style={style1}><div className={diamond}></div></td>
                <td valign='top'><span style={bgstyle1}>High Severity</span></td>
              </div>

              <div style={buttonStyle} onClick={() => {this.props.onClickHandler("medium"); this.setState({midSelect:true, highSelect:false, lowSelect:false })}}>
                <td style={style1}><div className={triangleup}></div></td>
                <td valign='top'><span style={bgstyle2}>Medium Severity </span></td>
              </div>

              <div style={buttonStyle} onClick={() => {this.props.onClickHandler("low"); this.setState({lowSelect:true, midSelect:false,highSelect:false })}}>
                <td style={style1}><div className={sevcircle}> </div></td>
                <td valign='top'><span style={bgstyle3}>Low Severity </span></td>
              </div>
              <div style={selectionWrapper}>
                <span style={glypOnSelect}></span>
                <div style={Dimensions}></div>
                <span style={{display:'block', backgroundColor:'#e8e8e8', position:'absolute', top:0, left:0, height:1, width:'120%'}}></span>
                <div style={Q1severityHighVariable} className={Q1severityHigh}></div>
              </div>
            </Col>
          </Row>
          <Row>
            <div className='tableContainer'>
              <div className='tablePointer'></div>
            </div>
          </Row>
        </div>
      </div>
    )
  }
})

const TableResults = React.createClass({
  propTypes: {
    show: PropTypes.bool.isRequired,
    profile: PropTypes.string.isRequired,
    failuresFromScan: PropTypes.number.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    pagerDuty:PropTypes.bool.isRequired,
    loadNumber: PropTypes.number.isRequired,
  },
  getInitialState: function() {
    return {
      loadNumber: 20,
    }
  },
  render: function () {
    return this.props.show == true
    ?
      <Row>
        <Col lg={12}>
          <TopFailedPolicies
            onClickHandler={this.props.onClickHandler}
              for={this.props.profile}
              list={this.props.list}
              failed={this.props.failuresFromScan}
              profile= {this.props.profile}
              loadNumber={this.props.loadNumber}
              pagerDuty={this.props.pagerDuty}
              jira={this.props.jira}
              jira_details={this.props.jira_details}
              serviceNow={this.props.serviceNow}
              serviceNowDetails={this.props.serviceNowDetails}
            />
        </Col>
      </Row>
    :
      <noscript />
  }
})

 let tooltipPie = function(x, y) {
  return y.toString();
  };

 const GeneralPie = React.createClass({
   getInitialState: function() {
     return {
       isTabOpen: false,
       data: {
           values: [ {x: 'Score',    y: this.props.score},
                     {x: 'WhiteSpace',    y: this.props.WhiteSpace},
                    ]
       }
     }
   },

   render: function () {
     const scale = d3.scale.ordinal().range(['#4C58A4', '#E5EAF4']);
     let data = this.state.data;
     let sort = null; // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...
     let style = {textAlign: 'center', marginTop: '25', marginRight: '25'}

     let pie = {zIndex:' -1', position:'absolute'}
     return (
       <div>
       <Row style={style}>
         <Col>
           <div className={numberCircle}>{this.props.score}</div>
             <PieChart
               data={data}
               width={200}
               height={200}
               colorScale={scale}
               radius={30}
               innerRadius={0}
               />
          </Col>
        </Row>
     </div>
     )
   }
 })


const PolicyPackChart = React.createClass({
  propTypes: {
    high: PropTypes.number.isRequired,
    med: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    selectedProfile: PropTypes.string.isRequired,
  },
  getInitialState: function() {
    return {
      isTabOpen: false,
      data: {
          label: "By Policy Pack",
          values: [ {x: 'Policy Pack 1',    y: this.props.low},
                    {x: 'Policy Pack 2',    y: this.props.med},
                    {x: 'Policy Pack 3',   y: this.props.high},
                    {x: 'Policy Pack 4',   y: this.props.high},
                    {x: 'Policy Pack 5',   y: this.props.high},
                    {x: 'Policy Pack 6',   y: this.props.high},
                   ]
      }
    }
  },
  render: function () {
    const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E']);
    let data = this.state.data;
    let sort = null; // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...
    let style = {textAlign: 'center'}
    let arrow = ''
    return (
      <div>
      <Row style={style}>
        <Col>
        <PieChart
                data={data}
                width={300}
                height={300}
                colorScale={scale}
                radius={100}
                innerRadius={0}
                tooltipHtml={tooltipPie}
                tooltipMode={'mouse'}
                margin={{top: 10, bottom: 10, left: 30, right: 30}}
                sort={null}
                />
              </Col>
            </Row>
      <Row style={style}>{data.label}</Row>
    </div>
    )
  }
})


const ControlFamilyIDChart = React.createClass({
  propTypes: {
    high: PropTypes.number.isRequired,
    med: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    selectedProfile: PropTypes.string.isRequired,
  },
  getInitialState: function() {
    return {
      isTabOpen: false,
      data:  {
          label: "By Control Family ID",
          values: [ {x: '1',    y: this.props.low},
                    {x: '2',    y: this.props.med},
                    {x: '3',   y: this.props.high},
                    {x: '4',   y: this.props.high},
                    {x: '5',   y: this.props.high},
                    {x: '6',   y: this.props.high},
                    {x: '7',   y: this.props.high},
                    {x: '8',   y: this.props.high},
                   ]
      }
    }
  },
  render: function () {
     const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E']);
    let data = this.state.data;
    let sort = null; // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...
    let style = {textAlign: 'center'}
    let arrow = ''
    return (
      <div>
      <Row style={style}>
        <Col>
        <PieChart
                data={data}
                width={300}
                height={300}
                colorScale={scale}
                radius={100}
                innerRadius={0}
                tooltipHtml={tooltipPie}
                tooltipMode={'mouse'}
                margin={{top: 10, bottom: 10, left: 30, right: 30}}
                sort={sort}
                />
              </Col>
            </Row>
      <Row style={style}>{data.label}</Row>
    </div>
    )
  }
})

export const SeverityChart = React.createClass({
  propTypes: {
    high: PropTypes.number.isRequired,
    med: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    selectedProfile: PropTypes.string.isRequired,
  },
  getInitialState: function() {
    return {
      isTabOpen: false,
      data:  {
          label: "By Severity",
          values: [ {x: 'low',    y: this.props.low},
                    {x: 'med',    y: this.props.med},
                    {x: 'high',   y: this.props.high},
                   ]
      }
    }
  },
  labelAccessor: function(stack) {
    return stack.label.slice(0,8);
  },

  componentDidMount(){
    var arcClass = d3.selectAll('.arc polyline')
    arcClass.attr("stroke-width","1");
  },

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

  render: function () {
    // const scale = d3.scale.ordinal().range(['#29ABE2','#FF444D', '#F9C73D', '#00C484','#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E']);
    // let range = ['#29ABE2','#FF444D', '#F9C73D', '#00C484','#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E']
    let range = ['#29ABE2','#FF444D', '#F9C73D', "#F44336", "#FF8A80", "#D81B60", "#CE93D8", "#AA00FF", "#311B92", "#3F51B5", "#BBDEFB", "#2979FF", "#0277BD", "#26C6DA", "#E0F2F1", "#64FFDA", "#388E3C", "#AED581", "#CDDC39", "#F4FF81", "#FDD835", "#FFE082", "#FFAB00", "#E65100", "#FF5722", "#D7CCC8", "#F5F5F5", "#CFD8DC", "#F44336", "#D50000", "#F50057", "#E040FB", "#B388FF", "#1A237E", "#1565C0", "#0288D1", "#00ACC1", "#009688", "#66BB6A", "#AED581", "#E6EE9C", "#FFF9C4", "#FFF8E1", "#FF9800", "#FF6D00", "#FF3D00", "#FAFAFA", "#90A4AE"]
    let q8OSRange = ['hsl(21, 88%, 59%)','hsl(21, 88%, 55%)','hsl(21, 88%, 58%)','hsl(21, 88%, 56%)', 'hsl(21, 88%, 60%)']
    let q8GroupRange = ['hsl(45, 96%, 59%)', 'hsl(45, 96%, 45%)',  'hsl(45, 96%, 51%)', 'hsl(45, 96%, 40%)', 'hsl(45, 96%, 53%)']
    let q8PolicyRange = ['#68b4f0', '#2488e2', '#60acf0','#1d6fb8', 'hsl(206, 82%, 55%)']
    const scale = d3.scale.ordinal().range(range);
    const osScale = d3.scale.ordinal().range(q8OSRange);
    const groupScale = d3.scale.ordinal().range(q8GroupRange);
    const policyScale = d3.scale.ordinal().range(q8PolicyRange)
    let data = this.state.data;
    let sort = null; // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...
    let style = {textAlign: 'center'}
    let arrow = ''
    let contentRowColor
    let contentFontWeight = 600
    // let tooltipPie1 = function(x, y) {
    //   // return x.toUpperCase() + ": " + y;
    //   (<div>{x}: {y}</div>)
    // };


    // <span style={{marginRight:"20px"}}>{data.x}</span>
    // <span style={{color:"#4C58A4", paddingRight:"10px"}}>{data.y}</span>

    let toolTipContent, toolTipContentTop25, toolTipTop25Lable;
      if(this.props.data.values) {
        let dataArray = this.props.data.values
        if(this.props.sort === "desc"){
          dataArray.sort(function(a,b) {return parseFloat(b.y) - parseFloat(a.y);;} );
        }
          toolTipContent = dataArray.map(function(data, index){

          return <div key={index}>
            <Row style={{margin:"1px", width:"470px"}}>
              <Col lg={1}>
                <Glyphicon style={{color:range[index], fontSize: '15px'}} glyph='stop'/>
              </Col>
              <Col lg={7} style={{marginRight:"20px", fontSize: '15px', fontFamily: "Source Sans Pro"}}>{data.x}</Col>
              <Col lg={2} style={{color:"#4C58A4", paddingRight:"10px", fontSize: '15px', fontFamily: "Source Sans Pro"}}>{data.y}</Col>
            </Row>
          </div>;
        })

        toolTipContentTop25 = dataArray.map(function(data, index){
          let tooltipColorRange
          if(this.props.donut === 'OS'){
            tooltipColorRange = q8OSRange[index]
          }else if(this.props.donut === 'groups'){
            tooltipColorRange = q8GroupRange[index]
          }else if(this.props.donut === 'policyPack'){
            tooltipColorRange = q8PolicyRange[index]
          }
          return <div key={index}>
            <Row style={{margin:"1px", width:"450px", padding:0}}>
              <Col lg={1}>
                <Glyphicon style={{color: tooltipColorRange, fontSize: '15px'}} glyph='stop'/>
              </Col>
              <Col lg={6} style={{marginRight:"10px", fontSize: '15px', fontFamily: "Source Sans Pro"}}>{data.x}</Col>
              <Col lg={3} style={{color:"#4C58A4", paddingRight:"5px", fontSize: '15px', fontFamily: "Source Sans Pro"}}>{data.y} devices</Col>
            </Row>
          </div>;
        }.bind(this))

        toolTipTop25Lable = this.props.data.label

        // .bind(this)
      }

    var tooltipPie1 = function(label, data) {
      // <div style={{margin:"15px", width:"370px", marginRight:"30px", height:"200px", overflowX:"none", overflowY:"auto"}}>
      return (
        <div style={{margin:"15px", width:"370px", marginRight:"30px"}}>
          <div style={{fontSize: '20px', fontWeight:"bold", fontFamily: "Source Sans Pro"}}>Number of Failed Tests</div>
          <div style={{marginTop:"10px"}}>{toolTipContent}</div>
        </div>
      );
    }

    var tooltipPie1New = function(label, data) {
      console.log('Data', label, data)
      // <div style={{margin:"15px", width:"370px", marginRight:"30px", height:"200px", overflowX:"none", overflowY:"auto"}}>
      return (
        <div style={{margin:"15px", width:"370px", marginRight:"30px"}}>
          <div style={{fontSize: '20px', fontWeight:"bold", fontFamily: "Source Sans Pro"}}>{toolTipTop25Lable}</div>
          <div style={{marginTop:"10px"}}>{toolTipContentTop25}</div>
        </div>
      );
    }

    let tooltipPieAll = function(x, y) {
      return x.toUpperCase() + ": " + y;
    };
    let colScale
    if(this.props.currentQuestion === 1){
      colScale = scale
    }else if(this.props.currentQuestion === 8){
      contentRowColor = '#4C58A4'
      contentFontWeight = 400
      if(this.props.donut === 'OS'){
        colScale = osScale
      }else if (this.props.donut === 'groups'){
        colScale = groupScale
      }else if (this.props.donut === 'policyPack'){
        colScale = policyScale
      }
    }
    return (
      <div>
      <Row style={style}>
        <Col>
        {this.props.currentQuestion === 1 || this.props.currentQuestion === 8 ?
              <PieChart
                      data={this.props.data}
                      width={this.props.width?this.props.width:300}
                      height={300}
                      colorScale={colScale}
                      radius={100}
                      innerRadius={0}
                      tooltipHtml={this.props.currentQuestion === 8 ? tooltipPie1New : tooltipPie1}
                      tooltipMode={'mouse'}
                      margin={{top: 10, bottom: 10, left: 30, right: 30}}
                      sort={sort}
                      hideLabels={true}
                      />
              :
              <PieChart
                      data={this.props.data}
                      width={this.props.width?this.props.width:300}
                      height={300}
                      colorScale={scale}
                      radius={100}
                      innerRadius={0}
                      tooltipHtml={tooltipPieAll}
                      tooltipMode={'mouse'}
                      margin={{top: 10, bottom: 10, left: 30, right: 30}}
                      sort={sort}
                      />
          }
              </Col>
            </Row>
      <Row id='Content' style={{marginTop:-35, color:contentRowColor, textAlign:'center',fontWeight:contentFontWeight, fontSize:17, marginBottom:30}}>{this.props.data.label}</Row>
    </div>
    )
  }
})

const ResultDevicePanel = React.createClass({
  getInitialState () {
    return {
      profile:"high",
      show:true,
      loadingDiv:true,
      loadNumber:20,
      pagerDuty:false,
      d1:[
      {
        "values": [
        ],
        "label": ""
      }
    ],
      d2:[
      {
        "values": [
        ],
        "label": ""
      }
    ],
      d3:[
      {
        "values": [
        ],
        "label": ""
      }
    ],
      list:[]
    }
  },
  parseData(data){
    var data2 = data[0].values.sort(function(a,b) {return parseFloat(b.y) - parseFloat(a.y);}).slice(0,10);
    data[0].values = data2
    return data;
  },
  componentDidMount () {
    getQuestionData(1)
    .then((data) => {
      let d1 = this.parseData(data.combinedData.d1);
      console.log('d1111 ',d1)
      let d2 = this.parseData(data.combinedData.d2);
      let d3 = this.parseData(data.combinedData.d3);
      this.setState({
        loadingDiv:false,
        d1: d1,
        d2: d2,
        d3: d3
      });
    })
    .catch((error) => console.log("Error in getting Question 1 data:", error))
    this.questionOneTableAPI(this.state.loadNumber, this.state.profile)
  },
  componentWillReceiveProps(nextProps){
    if(this.state.loadNumber != nextProps.loadNumber){
      this.setState({
        loadNumber:nextProps.loadNumber
      }, (res)=>{
        if(this.state.show){
          this.questionOneTableAPI(this.state.loadNumber, this.state.profile)
        }
      })
    }
  },
  closeTab () {
    this.setState({ show: false, profile:''});
  },
  questionOneTableAPI(loadNumber, profile){
     getQoneTableData(0, loadNumber, profile)
    .then((data) => {
       this.setState({list: data.resources});
    })
    .catch((error) => console.log("Error in getting Question 1 data:", error))
  },
  onClickHandler: function(profile) {
    this.setState({show: true, profile: profile}, this.questionOneTableAPI(this.state.loadNumber, profile))
  },
  render: function () {
    let renderCharts = [];
    let style = {
        zIndex: 100
    }
    if (this.state.d1[0].values.length > 0) {
      renderCharts.push(<Col lg={4} >
        <SeverityChart data={this.state.d1[0]}
          sort={"desc"}
          currentQuestion={1}
          // width={550}
          selectedProfile={this.state.d1.label}/>
        </Col>)
      renderCharts.push(<Col lg={4} >
        <SeverityChart
          sort={"desc"}
          currentQuestion={1}
          style={style}
          data={this.state.d2[0]}
          selectedProfile={this.state.d2.label}
          // width={800}
          />
        </Col>)
      renderCharts.push(<Col lg={4} >
        <SeverityChart data={this.state.d3[0]}
          sort={"desc"}
          currentQuestion={1}
          // width={550}
          style={style}
          selectedProfile={this.state.d3.label}/>
        </Col>)
    } else {
      if (this.state.loadingDiv) {
        renderCharts.push(
        <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
          <SpinnyLogo />
        </div>)
      } else {
        renderCharts.push(
          <Row>
            <Col className={dashboardBar} style={{paddingTop: 20, marginLeft:40, marginRight:40}}>
              <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
                  There is currently no data available for the specified time range or data filter
              </div>
            </Col>
          </Row>
        )
      }
    }
    return (
      <div>
        <Row>
          { renderCharts }
          <Col><SeverityTabs
            sort={"desc"}
            onClickHandler={this.onClickHandler}
            closeButtonStatus={this.state.show}
            /></Col>
        </Row>
        <TableResults show={this.state.show}
          profile={this.state.profile}
          failuresFromScan={27}
          list={this.state.list}
          onClickHandler={this.closeTab}
          pagerDuty={this.props.pagerDuty}
          jira={this.props.jira}
          jira_details={this.props.jira_details}
          loadNumber={this.props.loadNumber}
          loadNumberAgain={this.props.loadNumberAgain}
          serviceNow={this.props.serviceNow}
          serviceNowDetails={this.props.serviceNowDetails}
            />
      </div>
    )
  }
})

const ResultViolationsPanel = React.createClass({
  getInitialState () {
    return {
      loadingDiv:true,
      show:false,
      apiData:false,
      data:
      {"name": "",
        "children": [{
          "name":"Linux",
          "children":[
            {"name":"NIST",
              "children":[
                {"name":"Access Control",
                  "children":[
                    {"name":"high","size":15},
                    {"name":"low","size":50},{"name":"med","size":132},
                    {"name":"pass","size":190}]},
                {"name":"Audit And Accountability",
                  "children":[
                    {"name":"high","size":4},
                    {"name":"low","size":119},
                    {"name":"med","size":60},
                    {"name":"pass","size":186}]},
                {"name":"Configuration Management",
                  "children":[
                    {"name":"high","size":19},
                    {"name":"low","size":138},
                    {"name":"med","size":131},
                    {"name":"pass","size":288}]},
                {"name":"Contingency Planning",
                  "children":[{"name":"high","size":0},
                    {"name":"low","size":5},
                    {"name":"med","size":5},
                    {"name":"pass","size":8}]},
                {"name":"Identification And Authentication",
                  "children":[
                    {"name":"high","size":10},
                    {"name":"low","size":26},
                    {"name":"med","size":46},
                    {"name":"pass","size":98}]},
                {"name":"Maintenance",
                  "children":[
                    {"name":"high","size":4},
                    {"name":"low","size":6},
                    {"name":"med","size":0},
                    {"name":"pass","size":8}]},
                {"name":"Risk Assessment",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":0},
                    {"name":"med","size":5},
                    {"name":"pass","size":4}]},
                {"name":"Security Assessment And Authorization",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":0},
                    {"name":"med","size":4},
                    {"name":"pass","size":5}]},
                {"name":"System And Communications Protection",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":11},
                    {"name":"med","size":7},
                    {"name":"pass","size":18}]},
                {"name":"System And Information Integrity",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":0},
                    {"name":"med","size":4},
                    {"name":"pass","size":5}
                  ]
                }
              ]
            }
          ]
        }]
      }
    }
  },
  componentDidMount(){
    getQuestionData(4)
    .then((data) => {
      this.setState({
        loadingDiv:false,
        data: data,
        apiData: true
      });
    })
    .catch((error) => console.log("Error in getting Question 4 data:", error))
  },
  closeTab () {
    this.setState({ show: false, profile:''});
  },
  onClickHandler: function(profile) {
    this.setState({show: true, profile: profile})
  },
  render: function () {
    let renderChartorMessage;
    if (this.state.apiData && this.state.data.children) {
      renderChartorMessage = (<div style={{paddingLeft:"30", paddingTop:"30"}}>
            <SunBurstZoomChart
              data={this.state.data}
              />
        </div>)
    } else {
      if (this.state.loadingDiv) {
        renderChartorMessage = (
        <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
          <SpinnyLogo />
        </div>)
      } else {
        renderChartorMessage = (<Row>
            <Col className={dashboardBar} style={{paddingTop: 20, marginLeft:40, marginRight:40}}>
              <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
                  There is currently no data available for the specified time range or data filter
              </div>
            </Col>
          </Row>)
      }
    }
    return (
      <div>
        {renderChartorMessage}
      </div>
    )
  }
})

const ResultDevicesFailedPanel = React.createClass({
  getInitialState () {
    return {
      show:false,
      data: {
       "name": "",
       "children": [],
     },
     failedDevices:true,
    }
  },
  componentDidMount(){
    this.fetchPolicyDetails('root')
  },
  updateTree(path, controlid, id, child){
      this.fetchPolicyDetails(path, controlid, id, child)
  },
  addChildren(path, newChild) {
    console.log("path, newChild", path, newChild)
    let currentNode = this.state.data;
    this.DFSelect(path, currentNode, newChild)
  },
  DFSelect(path, node, newChild) {
    var subroutine = function(node) {
      if (node.path === path) {
        node.children = newChild;
        return node;
      } else if (node.path != path && node.children) {
        for (var i = 0; i < node.children.length; i++) {
          var child = node.children[i];
          if (subroutine(child)) {
            return true;
          }
        }
      }
    };
    return subroutine(node);
  },
  findPath(path){
      var go = 0
      var newPath
      for(var i = 0; i < path.length; i++){
        if (path[i] === "."){
          go++
        }
        if(path[i] === "." && go === 1){
          newPath = path
        } else if(path[i] === "." && go === 2){
          newPath = path.slice(0, i)
        }
      }
    return newPath
  },
  fetchPolicyDetails(path, controlid, id, child){
    console.log("path, controlid, id, child", path, controlid, id, child)
    if (controlid){
      var pathToUse = this.findPath(path);
      var profile
      newGetPolicyPackRules(controlid, 'ALL',pathToUse, profile, 0, 0, true, true)
      .then((nodes) => {
        console.log("where are my real nodes? why are there so many? LEVEL 2", nodes)
        this.addChildren(path, nodes)
      })
      .catch((error) => console.log("Error in getting the getPolicyPackRules", error))
    } else if (id) {
      getQuestionData(5, id)
      .then((nodes) => {
        console.log("where are my real nodes? why are there so many? LEVEL 3", nodes)
        this.addChildren(path, nodes)
      })
      .catch((error) => console.log("Error in getting Question 5 data:", error))
    // } else if (child) {
    } else {
      getPolicyDetails(path, true)
      .then((nodes) => {
        console.log("where are my real nodes? why are there so many? LEVEL 1", nodes)
        if(!nodes) {
          this.setState({failedDevices:false})
        } else if (nodes.children && nodes.children.length < 1){
          this.setState({failedDevices:false})
        }
        else {
          if(this.state.data.name.length > 1){
            this.addChildren(path, nodes)
          } else {
            this.setState({data:nodes});
          }
        }
      })
      .catch((error) => console.log("Error in getting the getPolicyDetails", error))
    }
  },
  closeTab () {
    this.setState({ show: false, profile:''});
  },
  onClickHandler: function(profile) {
    this.setState({show: true, profile: profile})
  },
  render: function () {
    let pageWidth = document.body.clientWidth - 300;
    let failedDevicesChart
    console.log("(this.state.failedDevices", this.state.failedDevices, pageWidth)
    if(this.state.failedDevices){
      failedDevicesChart = (
        <div>
            <UmbrellaChart
              data={this.state.data}
              updateTree={this.updateTree}
              />
        </div>
      )
    } else {
      failedDevicesChart = (
        <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
            There is currently no Failed Devices for the specified time range or data filter
        </div>
      )
    }
    return (<div style={{maxWidth: pageWidth, overflow: "scroll"}}>
      {failedDevicesChart}
    </div>)
  }
})

const ResultCompliancePanel = React.createClass({
  getInitialState () {
    return {
      loadingDiv:true,
      show:false,
      apiData: false,
      data:
      {"name": "",
        "children": [{
          "name":"Linux",
          "children":[
            {"name":"NIST",
              "children":[
                {"name":"Access Control",
                  "children":[
                    {"name":"high","size":15},
                    {"name":"low","size":50},{"name":"med","size":132},
                    {"name":"pass","size":190}]},
                {"name":"Audit And Accountability",
                  "children":[
                    {"name":"high","size":4},
                    {"name":"low","size":119},
                    {"name":"med","size":60},
                    {"name":"pass","size":186}]},
                {"name":"Configuration Management",
                  "children":[
                    {"name":"high","size":19},
                    {"name":"low","size":138},
                    {"name":"med","size":131},
                    {"name":"pass","size":288}]},
                {"name":"Contingency Planning",
                  "children":[{"name":"high","size":0},
                    {"name":"low","size":5},
                    {"name":"med","size":5},
                    {"name":"pass","size":8}]},
                {"name":"Identification And Authentication",
                  "children":[
                    {"name":"high","size":10},
                    {"name":"low","size":26},
                    {"name":"med","size":46},
                    {"name":"pass","size":98}]},
                {"name":"Maintenance",
                  "children":[
                    {"name":"high","size":4},
                    {"name":"low","size":6},
                    {"name":"med","size":0},
                    {"name":"pass","size":8}]},
                {"name":"Risk Assessment",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":0},
                    {"name":"med","size":5},
                    {"name":"pass","size":4}]},
                {"name":"Security Assessment And Authorization",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":0},
                    {"name":"med","size":4},
                    {"name":"pass","size":5}]},
                {"name":"System And Communications Protection",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":11},
                    {"name":"med","size":7},
                    {"name":"pass","size":18}]},
                {"name":"System And Information Integrity",
                  "children":[
                    {"name":"high","size":0},
                    {"name":"low","size":0},
                    {"name":"med","size":4},
                    {"name":"pass","size":5}
                  ]
                }
              ]
            }
          ]
        }]
      }
    }
  },
  componentDidMount(){
    getQuestionData(4)
    .then((data) => {
      this.setState({
        loadingDiv:false,
        data: data,
        apiData: true
      });
    })
    .catch((error) => console.log("Error in getting Question 4 data:", error))
  },
  closeTab () {
    this.setState({ show: false, profile:''});
  },
  onClickHandler: function(profile) {
    this.setState({show: true, profile: profile})

  },
  render: function () {
    let renderChartorMessage;
    if (this.state.apiData && this.state.data.children) {
      renderChartorMessage = (<div style={{paddingLeft:"30", paddingTop:"30"}}>
            <SunBurstZoomChart
              data={this.state.data}
              />
        </div>)
    } else {
      if (this.state.loadingDiv) {
        renderChartorMessage = (
        <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
          <SpinnyLogo />
        </div>)
      } else {
        renderChartorMessage = (<Row>
            <Col className={dashboardBar} style={{paddingTop: 20, marginLeft:40, marginRight:40}}>
              <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
                  There is currently no data available for the specified time range or data filter
              </div>
            </Col>
          </Row>)
      }
    }
    return (
        <div>
           {renderChartorMessage}
         </div>
      )

  }
})

const ResultOSPanel = React.createClass({
  getInitialState () {
    return {
      loadingDiv:true,
      show:false,
      chartData: [
        // {
        //   label: "By Severity",
        //   values: [ {x: 'low',    y: 1234},
        //             {x: 'med',    y: 2345},
        //             {x: 'high',   y: 3456},
        //            ]
        // },
        // {
        //   label: "By Severity",
        //   values: [ {x: 'low',    y: 1234},
        //             {x: 'med',    y: 2345},
        //             {x: 'high',   y: 3456},
        //            ]
        // },
        // {
        //   label: "By Severity",
        //   values: [ {x: 'low',    y: 1234},
        //             {x: 'med',    y: 2345},
        //             {x: 'high',   y: 3456},
        //            ]
        // },
        // {
        //   label: "By Severity",
        //   values: [ {x: 'low',    y: 1234},
        //             {x: 'med',    y: 2345},
        //             {x: 'high',   y: 3456},
        //            ]
        // },
        // {
        //   label: "By Severity",
        //   values: [ {x: 'low',    y: 1234},
        //             {x: 'med',    y: 2345},
        //             {x: 'high',   y: 3456},
        //            ]
        // }
      ]
    }
  },
  componentDidMount () {
    getQuestionData(3)
    .then((data) => {
      this.setState({
        loadingDiv:false,
        chartData: data.charData
      });
    })
    .catch((error) => console.log("Error in getting Question 3 data:", error))
  },
  closeTab () {
    this.setState({ show: false, profile:''});
  },
  onClickHandler: function(profile) {
    this.setState({show: true, profile: profile})
  },
  render: function () {
    let renderCharts = [];
    if (this.state.chartData.length > 0) {
      for (let i = 0; i < this.state.chartData.length; i++) {
        renderCharts.push(<Col lg={4} lg={4} ><SeverityChart data={this.state.chartData[i]} high={this.state.chartData[i].values[2].y} low={this.state.chartData[i].values[0].y} med={this.state.chartData[i].values[1].y}
              selectedProfile={this.state.chartData[i].label}/></Col>)
      }
    } else {
      if (this.state.loadingDiv) {
        renderCharts.push(
        <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
          <SpinnyLogo />
        </div>)
      } else {
        renderCharts.push(
          <Row>
            <Col className={dashboardBar} style={{paddingTop: 20, marginLeft:40, marginRight:40}}>
              <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
                  There is currently no data available for the specified time range or data filter
              </div>
            </Col>
          </Row>
        )
      }
    }
    return (
      <div>
        <Row>{ renderCharts }</Row>
      </div>
    )
  }
})


const ResultSeverityPanel = React.createClass({
  getInitialState () {
    return {
      loadingDiv:true,
      show:false,
      chartData: [],
      question:''
    }
  },
  componentDidMount () {
    this.setState({question:this.props.question})
    if(this.props.question === 'q2')
    {
    getQuestionData(2)
    .then((data) => {
      if(data.charData.length > 0 ){
        console.log("datadatadatadata2data", data)
        for (var i = 0; i < data.charData.length; i++) {
          var newArray = [];
          var current = data.charData[i];
          var that = this;

          current.values.map(function(val, key){
            if(val.x === 'low'){
              val.x = 'Low'
            }if(val.x === 'med'){
              val.x = 'Medium'
            }else if(val.x === 'high'){
              val.x = 'High'
            }
          })

          var collect = function(data){
            getHorizontalChartData(data.label)
            .then((res)=>{
              data.horizontalChartData = res.charData
              newArray.push(data)
              that.setState({
                chartData: newArray,
              }, (res)=>{console.log("this.state.chartData, this.state.horizontalChartData", that.state.chartData)});
            })
            .catch((error)=>{
              console.log("Error in getting horizontalChartData ", error)
            })
          }
          collect(current);
        }
      }
      if (newArray){
        this.setState({
          chartData: newArray,
        }, (res)=>{console.log("this.state.chartData, this.state.horizontalChartData", this.state.chartData)});
      } else {
        this.setState({
          chartData: [],
        }, (res)=>{console.log("this.state.chartData, this.state.horizontalChartData []", this.state.chartData)});
      }
      this.setState({
        loadingDiv: false,
      });
    })
    .catch((error) => console.log("Error in getting Question 2 data:", error))
    }
    else
    {
      //++++++ Used for securtity risk across controlFamily ++++++//
    getHorizontalScoreChartData()
    .then((data) => {
      if(data.chartData.length > 0 ){
       this.setState({chartData:data.chartData})
      }

      this.setState({
        loadingDiv: false,
      });
    })
    .catch((error) => console.log("Error in getting Question 7 data:", error))
    }
  },

  componentWillReceiveProps (nextProps,nextState) {
    if(nextProps.question!==this.props.question)
    {
      this.setState({question:nextProps.question})
      if(nextProps.question === 'q2')
      {
      getQuestionData(2)
      .then((data) => {
        if(data.charData.length > 0 ){
          for (var i = 0; i < data.charData.length; i++) {
            var newArray = [];
            var current = data.charData[i];
            var that = this;

            current.values.map(function(val, key){
              if(val.x === 'low'){
                val.x = 'Low'
              }if(val.x === 'med'){
                val.x = 'Medium'
              }else if(val.x === 'high'){
                val.x = 'High'
              }
            })

            var collect = function(data){
              getHorizontalChartData(data.label)
              .then((res)=>{
                console.log("what inda res am i getting???", res)
                data.horizontalChartData = res.charData
                newArray.push(data)
                that.setState({
                  chartData: newArray,
                }, (res)=>{console.log("this.state.chartData, this.state.horizontalChartData", that.state.chartData)});
              })
              .catch((error)=>{
                console.log("Error in getting horizontalChartData ", error)
              })
            }
            collect(current);
          }
        }
        if (newArray){
          this.setState({
            chartData: newArray,
          }, (res)=>{console.log("this.state.chartData, this.state.horizontalChartData", this.state.chartData)});
        } else {
          this.setState({
            chartData: [],
          }, (res)=>{console.log("this.state.chartData, this.state.horizontalChartData []", this.state.chartData)});
        }
        this.setState({
          loadingDiv: false,
        });
      })
      .catch((error) => console.log("Error in getting Question 2 data:", error))
      }
      else
      {
        //++++++ Used for securtity risk across controlFamily ++++++//
      getHorizontalScoreChartData()
      .then((data) => {
        if(data.chartData.length > 0 ){
         this.setState({chartData:data.chartData})
        }

        this.setState({
          loadingDiv: false,
        });
      })
      .catch((error) => console.log("Error in getting Question 7 data:", error))
      }
    }
  },

  componentWillUnmount() {
    this.setState({  show: false, profile:'',chartData: []});
  },

  closeTab () {
    this.setState({ show: false, profile:''});
  },
  onClickHandler: function(profile) {
    this.setState({show: true, profile: profile})
  },
  render: function () {
    let renderCharts = [];
    if (this.state.chartData.length > 0) {
      for (let i = 0; i < this.state.chartData.length; i++) {
        renderCharts.push(
          <div key={i} style={{paddingLeft:"20px", paddingRight:"60px"}}>
            <Col lg={12} style={{paddingBottom:"20px", borderBottom:'2px solid #E5EAF4', marginRight:"-120px"}}>
              <Col lg={3}>
               <SeverityChart data={this.state.chartData[i]} high={this.state.chartData[i].values[1].y} low={this.state.chartData[i].values[0].y} med={this.state.chartData[i].values[2].y}
                    selectedProfile={this.state.chartData[i].label}/>
              </Col>
              <Col lg={9} style={{marginTop:'40px', overflowx: 'scroll', height:"200px"}}>
                <StackedHorizontalBarChart idProp={`hochart${i}`} canvasWidth={'550'}
                  score={true} horizontalChartData={this.props.question==='q2'?this.state.chartData[i].horizontalChartData:this.state.chartData[i]}/>
              </Col>
            </Col>
          </div>)
      }
    } else {
      if (this.state.loadingDiv) {
        renderCharts.push(
        <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
          <SpinnyLogo />
        </div>)
      } else {
        renderCharts.push(
          <Row>
            <Col className={dashboardBar} style={{paddingTop: 20, marginLeft:40, marginRight:40}}>
              <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
                  There is currently no data available for the specified time range or data filter
              </div>
            </Col>
          </Row>
        )
      }
    }

    return (
      <div>
        <Row>{ renderCharts }</Row>
      </div>
    )
  }
})


const TopFailures = React.createClass({
  getInitialState: function() {
    return {
      currentQuestion: '1',
      loadNumber:20,
      pagerDuty: false,
      jira:false,
      jira_details:'',
      serviceNow:false,
      serviceNowDetails:'',
      loadAmount:[{label:'20', value:20}, {label:'30', value:30},{label:'40', value:40}, {label:'50', value:50}],
      questionsOption:[
        {value:'1',label:'Show me where devices are contributing to the most security violations'},
        {value:'2',label:'Show me my security risk state by severity level '},
        {value:'3',label:'Show me security risk across different operating systems '},
        //{value:'4',label:'Show me overall security risk for my infrastructure'},
        {value:'5',label:'Show me where I have a risk exposure (devices failed x policy)'},
        {value:'7',label:'Show me my security risk across control families'},
        {value:'8',label:'Show me my Top 25 issues '}
      ],
    }
  },
  componentDidMount: function(){
    getIntegrations()
      .then((response)=>{
        if(response.output) {
          for (let i = 0; i < response.output.length; i++) {
            if (response.output[i].name === "pagerduty" && response.output[i].status=='Active') {
              this.setState({
                pagerDuty:true
              }, this.onPagerChange)
            }
            if (response.output[i].name === "jira" && response.output[i].status=='Active') {
              var jiraDetails = response.output[i].credentials;
              this.setState({
                jira_details:jiraDetails,
                jira:true
              }, this.onPagerChange)
            }
            if (response.output[i].name === "serviceNow" && response.output[i].status=='Active') {
              var serviceDetails = response.output[i].credentials;
              this.setState({
                serviceNowDetails:serviceDetails,
                serviceNow:true
              }, this.onPagerChange)
            }
          }
        }
      })
      .catch((error)=>{
        console.log("INTEGRATION ERROR ", error)
      })
  },
  componentWillReceiveProps(nextProps){
    if (nextProps.question != this.state.currentQuestion) {
      this.setState({
        currentQuestion:nextProps.question
      })
    }
    if (nextProps.loadNumber != this.state.loadNumber) {
      this.setState({
        loadNumber:nextProps.loadNumber
      })
    }
  },
  onQuestionChange: function(event){
    this.setState({
      currentQuestion:event
    })
    this.props.updateQuestion(event)
  },
  handleChangeLoad: function(event) {
    this.setState({
      loadNumber:event
    })
    this.props.updateLoad(event.target.value)
  },
  render:
    function () {
    let style = {paddingLeft: 30}
    let selectStyle = {marginRight: '10px', marginLeft: '10px'}
    let tdrightalign = {width: 100}
    let buffer = {paddingLeft: 40, overflow:'hidden'}
    let buffer2 = {paddingTop:10}
    let questionChoice, load;
    if (this.state.currentQuestion === '1') {
      questionChoice = (<ResultDevicePanel
        pagerDuty={this.state.pagerDuty}
        jira={this.state.jira}
        jira_details={this.state.jira_details}
        serviceNow={this.state.serviceNow}
        serviceNowDetails={this.state.serviceNowDetails}
        loadNumber={this.state.loadNumber}
        />)
      load = (
        <Col lg={3} style={{display:'flex', justifyContent:'flex-end', paddingRight:35}}>
          <span style={{ padding: '10px 8px 0 0'}}>Load Amount:</span>
          <span>
            <Select id="chartRange" className="dropdownLoadAmount"
              name=""
              value={this.state.loadNumber}
              options={this.state.loadAmount}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              onChange={this.props.handleChangeLoad}/>
          </span>


          {/*<select style={selectStyle } className={dropdown} value={this.state.loadNumber} onChange={this.handleChangeLoad}>
              <option selected="selected" value='20'>20</option>
              <option value='30'>30</option>
              <option value='40'>40</option>
              <option value='50'>50</option>
            </select>*/}
        </Col>
      )
    } else if (this.state.currentQuestion === '2') {
      console.log('222222222222222222222222222222')
      questionChoice = (<ResultSeverityPanel question='q2'/>)
      load = (
        <Col lg={3}>
        </Col>
      )
    } else if (this.state.currentQuestion === '3') {
      console.log('333333333333333333333333333333')
      questionChoice = (<ResultOSPanel />)
      load = (
        <Col lg={3}>
        </Col>
      )
    }
    else if (this.state.currentQuestion === '4') {
      console.log('444444444444444444444444444444')
      questionChoice = (<ResultCompliancePanel />)
      load = (
        <Col lg={3}>
        </Col>
      )
    }
    else if (this.state.currentQuestion === '5') {
      console.log('555555555555555555555555555555')
      questionChoice = (<ResultDevicesFailedPanel />)
      load = (
        <Col lg={3}>
        </Col>
      )
    }
    // else if (this.state.currentQuestion === '6') {
    //   console.log('666666666666666666666666666666')
    //   questionChoice = (<ResultViolationsPanel />)
    //   load = (
    //     <Col lg={3}>
    //     </Col>
    //   )
    // }

    else if (this.state.currentQuestion === '7') {
      questionChoice = (<ResultSeverityPanel question='q7'/>)
      load = (
        <Col lg={3}>
        </Col>
      )
    }else if (this.state.currentQuestion === '8'){
      questionChoice = (<Top25Issues />)
      load = (
        <Col lg={3}>
        </Col>
      )
    }
    return (
      <div style={buffer}>
          <Row>
            <div style={{fontSize: 20, fontWeight: 'bold',paddingTop: 20}}>RESULTS DETAILS</div>
          </Row>
          <Row style={buffer2}>
            <Col lg={9} >
              <span>
                <Select className="dropdownQuestions"
                  name=""
                  value={this.state.currentQuestion}
                  options={this.state.questionsOption}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.onQuestionChange}/>
              </span>
              {/*}<select className={dropdown} onChange={this.onQuestionChange}>
              <option value='1'> Show me where devices are contributing to the most security violations</option>
              <option value='2'> Show me my security risk state by severity level </option>
              <option value='3'> Show me security risk across different operating systems </option>
              <option value='4'> Show me overall security risk for my infrastructure</option>
              <option value='5'> Show me where I have a risk exposure (devices failed x policy)</option>
              <option value='6' disabled> Show me what devices contribute to most of the violations </option>
              <option value='7' disabled> Show me which violations have the biggest impact on my IT infrastructure</option>
              <option value='8' disabled> Show me where we need to focus to be more compliant</option>
              <option value='9' disabled> Show me where and how I am improving</option>
              <option value='10' disabled> Show me security risk by severity level</option>
              </select>*/}
            </Col>
            {load}
          </Row>
          <Row>
            { questionChoice }
          </Row>
      </div>
    )
  }
})

const Score = React.createClass({
  propTypes: {
    number: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  },
  render: function () {
    let style = {color: this.props.color}

    return (
      <div>
        <div style={style} className={score}>{this.props.number}</div>
        <div className={scoreDescription}>{this.props.description}</div>
      </div>
    )
  }
})

const CurrentScore = React.createClass({
  propTypes: {
    number: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  },
  render: function () {
    let trendGlyph,trendColor;
    var zoomMap = {
      Daily: "day",
      Weekly: "week",
      Monthly: "month",
      Quarterly: "quarter",
      Yearly: "year"
    }
    if(this.props.description==0){
      trendGlyph=''
    }
    else if(this.props.description>0){
      trendGlyph='triangle-top';
      trendColor='lightgreen'
    }else{
      trendGlyph='triangle-bottom';
      trendColor='red'
    }
  let style = {color: this.props.color}
    return (
      <div>
        <div style={{color: trendColor}}>
          <Glyphicon className={scoreDescription} style={{color:trendColor, fontSize: 8}} glyph={trendGlyph}/> {this.props.description}%
        </div>
        <div className={scoreDescription}>Since last {zoomMap[this.props.zoom]}</div>
      </div>
    )
  }
})

const ScorePanel = React.createClass({
  getInitialState: function() {
    return {
      current: this.props.score,
      deltaFromLast: this.props.delta,
      high: this.props.high,
      medium: this.props.medium,
      low: this.props.low,
      passed: this.props.passed,
      whiteSpace: this.props.whiteSpace
    }
  },
  conponentDidMount() {
    this.setState(
       {
        current: this.props.score,
        deltaFromLast: this.props.delta,
        high: this.props.high,
        medium: this.props.medium,
        low: this.props.low,
        passed: this.props.passed,
        whiteSpace: this.props.whiteSpace
    }
    )
  },
  render: function () {
    let delta =''
    if (this.state.deltaFromLast > 0)
      delta = '+'
    else
      delta =''
    let style = {
      // backgroundColor: 'grey', opacity:'0.5',
      paddingLeft: 30, paddingTop: 15}
    let styleCenter1 = {textAlign: 'center', paddingTop:'15'}
    let styleCenter = {textAlign: 'center', borderLeft: '2px solid #E5EAF4', marginTop:'15'}

    return (
      <div>
        <div style={style}>
          <Row lg={12}>
            <Col lg={3}>
              <div style={{fontSize: 18, textAlign: 'center', marginBottom:"20"}}>CURRENT SCORE</div>
                <Col lg={1} md={4} style={{textAlign:"right"}}>
                </Col>
              <Col lg={5} md={1} style={{textAlign:"right"}}>
                <div style={{
                    // backgroundColor: 'lightgrey',
                    width: 220, paddingBottom: '10', textAlign: 'center', marginTop: '-25', marginRight: '25'}}>
                    <CircularScoreGraph score={this.props.score} id={'dash'}/>
                </div>
              </Col>
              <Col lg={5} md={4}>
                <div style={styleCenter1}><CurrentScore
                  description={this.props.delta}
                  zoom={this.props.zoom}
                  color='black'/></div>
              </Col>
            </Col>
            <Col lg={9} md={9} style={{textAlign:'center'}}>
              <div colspan='4' style={{fontSize: 18}}>NUMBER OF ASSESSMENTS</div>
              <div>

                <Col style={styleCenter} lg={3} md={6}><Score number={this.props.low}    description='Low Severity' color='#29ABE2' /></Col>
                <Col style={styleCenter} lg={3} md={6}><Score number={this.props.medium} description='Medium Severity' color='#F9C73D'/></Col>
                <Col style={styleCenter} lg={3} md={6}><Score number={this.props.high}   description='High Severity' color='#FF444D'/></Col>
                <Col style={styleCenter} lg={3} md={6}><Score number={this.props.passed} description='Policies Passed' color='#00C484' /></Col>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
})

const ComplianceSummary = React.createClass({
  getInitialState: function() {
    return {
      loadingDiv:this.props.loadingDiv,
      data:this.props.data,
      percentageData:this.props.percentageData,
      dataByDate:this.props.dataByDate,
      date: null,
      high: this.props.totHigh,
      medium: this.props.totMedium,
      low: this.props.totLow,
      passed: this.props.totPassed,
      // score: this.props.currScore,
      delta: this.props.currDelta,
      whiteSpace:this.props.currWhiteSpace,
      time:this.props.time,
      chart:this.props.chart,
      dataChoice:this.props.dataChoice,
      dataLoad:this.props.dataLoad,
      selectedPolicyPack:this.props.selectedPolicyPack,
      selectedGroup:this.props.selectedGroup,
      selectedControlFamily:this.props.selectedControlFamily,
      selectedOS:this.props.selectedOS,
      chartChooserShow:false,
      chartsList:[
        {name:'bar',displayText:'Bar Chart',show:true},
        // {name:'line',displayText:'Line Chart',show:false},
        {name:'stack',displayText:'Stacked Bar Chart',show:false},
        // {name:'area',displayText:'Area Chart',show:false},
      ],
      dataList:[
        {name:'percentage',displayText:'Percent',show:false},
        {name:'absolute',displayText:'Test Count',show:true},
      ],
      textNodeY:0,
      order:this.props.order,
      to:"",
      from:"",
      barChartWidth:1250
    }
  },
  dynamicChartWidth(){
    let zoomTime = this.state.time;
    let dataCount = this.props.data[0].values.length +1;

    this.setState({data:''})

    if(zoomTime === 'Daily'){
      this.setState({barChartWidth:dataCount*170,data:this.props.data,});}
    else if(zoomTime === 'Weekly'){
      this.setState({barChartWidth:dataCount*170,data:this.props.data,});}
    else if(zoomTime === 'Monthly'){
      this.setState({barChartWidth:dataCount*170,data:this.props.data,})
    }else if(zoomTime === 'Quarterly'){
      this.setState({barChartWidth:dataCount*170,data:this.props.data,})
    }else if(zoomTime === 'Yearly'){
      this.setState({barChartWidth:dataCount*170,data:this.props.data,})
    }
  },

  componentWillReceiveProps(nextProps,nextState){
    setTimeout(this.dynamicChartWidth,1000);
    // if (nextProps.dataLoad != this.state.dataLoad) {
      this.setState({
        loadingDiv:nextProps.loadingDiv,
        order: nextProps.order,
        high: nextProps.totHigh,
        medium: nextProps.totMedium,
        low: nextProps.totLow,
        passed: nextProps.totPassed,
        score: nextProps.currScore,
        delta: nextProps.currDelta,
        percentageData:nextProps.percentageData,
        // data: nextProps.data,
        whiteSpace:nextProps.currWhiteSpace,
        to:nextProps.to,
        from:nextProps.from,
        chart:nextProps.chart,
        dataChoice:nextProps.dataChoice,
        dataLoad:nextProps.dataLoad,
        time:nextProps.time,
        selectedPolicyPack:nextProps.selectedPolicyPack,
        selectedGroup:nextProps.selectedGroup,
        selectedControlFamily:nextProps.selectedControlFamily,
        selectedOS:nextProps.selectedOS,
        // barChartWidth:nextProps.barChartWidth

      });
      // }
    },
    //   shouldComponentUpdate(nextProps, nextState) {
    //   //Return TRUE only once current and next state data got changed
    //   if(nextState.data!==this.state.data)
    //  {
    //     return true;
    //  }
    //  return false;
    // },
    // shouldComponentUpdate(nextProps, nextState) {
    //   console.log("this, nextProps, nextStatehis, nextProps, nextState", this, nextProps.currScore, nextState.score)
    //   return nextProps.currScore !== nextState.score
    //   // return this.shallowCompare(this, nextProps.score, nextState.graphScore);
    // },

    setSelectedDate(selectDate, position){
      let newDate = selectDate;
      this.setState({date:newDate, order:1}, function(){
        this.pointBar(this.state.date)
        this.onClickHandlerBar()
        var transformStyle = document.getElementById('selectBg'); 
        var positionValue = position - 205
        transformStyle.style.transform = 'translate('+ positionValue +'px, ' + 0 +'px)'
        console.log("clicked date is:"+this.state.date)
        console.log('transformStyle', transformStyle.style)
      })
    },

    onClickHandlerBar: function() {
      this.setState({
        data:this.props.data,
        dataByDate:this.props.dataByDate,
        order:1
      })
       let dateObj = {};
      for (let i = 0; i < this.props.dataByDate.length; i++){
        console.log('daaaattteee before', this.state.date)
         if (this.props.dataByDate[i].date == this.state.date){
           dateObj= this.props.dataByDate[i];
           console.log('daaaattteee ', this.state.date)
        }}
        if (!dateObj.values){
          this.setState({
            order:this.props.order,
          })
          // this.highlightBar(dateObj.date)
          this.pointBar(dateObj.date)
        } else {
          let whiteSpace = 100 - dateObj.values[4];
          this.setState({
            high: dateObj.values[0],
            medium: dateObj.values[1],
            low: dateObj.values[2],
            passed: dateObj.values[3],
            score: dateObj.values[4],
            delta: dateObj.values[5],
            whiteSpace: whiteSpace
          })
          // this.highlightBar(dateObj.date)
          this.pointBar(dateObj.date)
        }
    },
    pointBar(date) {
      let textNodeY;
      let textList = document.getElementsByTagName("text");
      for (let i = 0; i < textList.length; i++) {
        if (textList[i].innerHTML === date) {
          textNodeY = textList[i].parentNode.transform.animVal["0"].matrix.e
        }
      }
      this.setState({
        textNodeY:textNodeY+23
      })
    },
    tooltipBar: function(x, y0, y, total) {
      this.setState({
        date:x
      })
      return y;

    },
    handleChangeTime (e) {
      this.setState({
        order:-1
      }, (res)=>{console.log("showArrow")})
      this.props.handleChangeTime(e);
    },

    chartChooserToggle() {
      this.setState({ chartChooserShow: !this.state.chartChooserShow });
    },

    hideChartChooser(){
      //...Hiding chartChooser on outside click ...
      this.setState({chartChooserShow:false})
    },

    chartDisplayChangeHandler(chartName){
      let newChartsList = this.state.chartsList
      for (let i = 0; i < newChartsList.length; i++) {
        if (newChartsList[i].name === chartName) {
          newChartsList[i].show = true;
        } else {
          newChartsList[i].show = false;
        }
      }
      this.setState({
        chart:chartName,
        chartsList: newChartsList
      },  (res)=>{console.log(this.state.chartsList)})
      this.props.updateChartChoice(chartName)
    },
    chartDataChangeHandler(dataName){
      let newDataList = this.state.dataList
      for (let i = 0; i < newDataList.length; i++) {
        if (newDataList[i].name === dataName) {
          newDataList[i].show = true;
        } else {
          newDataList[i].show = false;
        }
      }
      this.setState({
        dataChoice:dataName,
        dataList: newDataList
      },  (res)=>{console.log(this.state.dataList)})
      this.props.updateDataChoice(dataName)
    },
    // printDocument() {
    //  const input = document.getElementById('complianceSummary');
    //  html2canvas(input)
    //    .then((canvas) => {
    //      const imgData = canvas.toDataURL('image/png');
    //      const pdf = new jsPDF();
    //      pdf.addImage(imgData, 'JPEG', 0, 0);
    //      // pdf.output('dataurlnewwindow');
    //      pdf.save("download.pdf");
    //    })
    //  },
    render: function () {
      const scale = d3.scale.ordinal().range(['#29ABE2', '#F9C73D', '#FF444D','#00C484']);
      // let data = this.state.data

      let data = this.state.dataChoice === "percentage"?this.state.percentageData:this.state.data
      let label = this.state.dataChoice === "percentage"?"Percent":"Test Count"
      let chartWidth = this.state.barChartWidth
      let selectBgStyle={position:'absolute', top:365, height:300,boxShadow: '3px 3px 5px 3px #000', backgroundColor:'#6f78b6',padding:'260px 0 0 0',margin:'-344px 0px 0px -40px',width:132,fontSize: '55px', transform: `translate(${this.state.textNodeY}px, 0px)`, zIndex: this.state.order}
      if(this.state.order== 1&& this.state.chart ==='bar' || this.state.order== 1&& this.state.chart ==='stack'){selectBgStyle.opacity=0.12}else{selectBgStyle.opacity=0}

      // let data = [{"label":"Low","values":[{"x":"Data does not exist wit","y":19}]},{"label":"Med","values":[{"x":"Data does not exist wit","y":19}]},{"label":"High","values":[{"x":"Data does not exist wit","y":19}]},{"label":"Passed","values":[{"x":"Data does not exist wit","y":19}]}]

      if(this.state.time=="Quarterly")
      {

        var MappedJson = JSON.stringify(data).replace(/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/g,
        function (match, capture) {
          var d = new Date(match);
          var y = d.getFullYear();
          var n = Math.ceil((d.getMonth()+1)/3);
            return "Q"+n+"-"+y;
        });
        data = JSON.parse(MappedJson);
        chartWidth = 340
      }
      // Map Dates in Json data to Year
      if(this.state.time=="Yearly")
      {
        var MappedJson = JSON.stringify(data).replace(/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/g,
        function (match, capture) {
          var d = new Date(match);
          var y = d.getFullYear();
          return y;
        });
        data = JSON.parse(MappedJson);
        chartWidth = 340
      }
      let chartChoice;
      if (this.state.chart === "bar") {
        chartChoice = (
          <DashboardBarChart
            data1={data} 
            setSelectedDate={this.setSelectedDate}
            actualWidth={chartWidth} 
            actualHeight={300}
            dataChoice={label}
            response={this.props.responceMainChart} />
          /*
          <BarChart
            groupedBars
            colorScale={scale}
            data={data}
            width={chartWidth}
            height={300}
            margin={{top: 10, bottom: 40, left: 50, right: 10}}
            tooltipHtml={this.tooltipBar}
            yAxis={{tickArguments: [5], label: label}}
            tooltipMode={'mouse'}/>
          */
        )
      } else if (this.state.chart === "line") {
        chartChoice = (
          <LineChart
            colorScale={scale}
            data={data}
            width={1250}
            height={300}
            margin={{top: 10, bottom: 40, left: 50, right: 10}}
            tooltipHtml={this.tooltipBar}
            tooltipMode={'mouse'}/>
        )
      } else if (this.state.chart === "stack") {
        chartChoice = (          
          <DashboardStackedChart
            data1={data}
            actualHeight={300}
            actualWidth={chartWidth}
            setSelectedDate={this.setSelectedDate}
            dataChoice={label}
            response={this.props.responceMainChart} />
          /*
          <BarChart
            colorScale={scale}
            data={data}
            width={chartWidth}
            height={300}
            margin={{top: 10, bottom: 40, left: 50, right: 10}}
            tooltipHtml={this.tooltipBar}
            yAxis={{label: label}}
            tooltipMode={'mouse'}/>
          */
        )
      } else if (this.state.chart === "area") {
        chartChoice = (
          <AreaChart
            colorScale={scale}
            data={data}
            width={1250}
            height={300}
            margin={{top: 10, bottom: 40, left: 50, right: 10}}
            tooltipHtml={this.tooltipBar}
            tooltipMode={'mouse'}/>
        )
      }

      setTimeout(function (){
        var vis = d3.selectAll('.tick line')
        var yis = d3.selectAll('.domain')
        // console.log("THIS IS THE VIS. WHAT IS IT?????", vis)
        yis.attr("stroke","#fff")
        vis.each(function(d,i) {
          let findYAxis = d3.select(this).attr("x2")
          if(findYAxis!=0){
            d3.select(this).attr("x2","350%").attr("stroke",'#d5deec')
          }
        });
        let yal = d3.select("body").selectAll(".y").filter(".axis")
        yal.attr("y", "-50")
      }, 1000);

      let xAxisLine = {border:'1px solid #000', width:'100%',width: '96%',float: 'right', position: 'absolute',right: 0,bottom: 59,margin:0,border: 'none',height: 2,background: '#d5deec'}
      // let yAxisLine = {width:2, backgroundColor:'#d5deec', height:267, position:'absolute', top:19, left:49}
      let chartScrollStyle = {maxWidth:1000,height:340, overflowX:'auto',paddingTop: 20, marginLeft:40, marginRight:40,position:'relative'}
      if(chartWidth> 1200){chartScrollStyle.height=351}

      let ComplianceSummaryCharts;
      if (this.state.loadingDiv){
        ComplianceSummaryCharts = (<div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
          <SpinnyLogo />
        </div>)
      } else {
        if (data[0] && data[0].values[0].x !== "Data does not exist within this date range." || data[1] && data[1].values[0].x !== "Data does not exist within this date range." || data[2] && data[2].values[0].x !== "Data does not exist within this date range." || data[3] && data[3].values[0].x !== "Data does not exist within this date range.") {
          ComplianceSummaryCharts =
          (<div style={{}}>
            <Row className={barContainer} onClick={() => this.onClickHandlerBar()}>
            <Col id='chartWrapper' style={chartScrollStyle}>
              <div>{chartChoice}</div>
                {/* <hr style={xAxisLine}/>
                <div style={yAxisLine}></div>*/}
              <div style={{paddingTop:'-500'}}>
                {/* <Glyphicon style={{fontSize: '55px', transform: `translate(${this.state.textNodeY}px, 0px)`, zIndex: this.state.order}} glyph="triangle-top"></Glyphicon>*/}
                <div id='selectBg' style={selectBgStyle}></div>
              </div>
            </Col>
              {/* <hr className={hrStyleInDash}></hr>*/}
          </Row>

          </div>
        )
        } else {
          ComplianceSummaryCharts = (
            this.state.loadingDiv?
            <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
              <SpinnyLogo />
            </div>:
            <Row>
              <Col className={dashboardBar} style={{paddingTop: 20, marginLeft:40, marginRight:40}}>
                <div style={{paddingTop:'100', textAlign:"center", paddingBottom:'100'}}>
                    There is currently no data available for the specified time range or data filter
                </div>
              </Col>
            </Row>
          )
        }
      }

      return (
        <div id="complianceSummary">
          <Row style={{position:'relative'}}>
            <Col lg={10} md={10}>
              <div className={paddingThirty} style={{fontSize: 20, fontWeight: 'bold',paddingTop: 20, paddingLeft:20}}>RISK SECURITY AND COMPLIANCE SUMMARY</div>
            </Col>
            <Col>
             <DashboardFilters
            handleChangeTime={this.handleChangeTime}
            handleChangeOS={this.props.handleChangeOS}
            handlePolicyPackChange={this.props.policyPackChange}
            handleControlFamilyChange={this.props.controlFamilyChange}
            handleGroupChange={this.props.groupChange}
            selectedPolicyPack={this.props.selectedPolicyPack}
            dataLoad={this.state.dataLoad}
            time={this.state.time}
            selectedPolicyPack={this.state.selectedPolicyPack}
            selectedGroup={this.state.selectedGroup}
            selectedControlFamily={this.state.selectedControlFamily}
            selectedOS={this.state.selectedOS}
            />
            </Col>
            <Col lg={1} md={1} className={paddingThirty} style={{textAlign:"right", position: 'absolute', right:0, top:23, cursor:'pointer'}}>
              <ComplianceChartChooser
                toggle={this.chartChooserToggle}
                chartShow={this.state.chartChooserShow}
                chartsList={this.state.chartsList}
                dataList={this.state.dataList}
                changeHandlerData={this.chartDataChangeHandler}
                changeHandler={this.chartDisplayChangeHandler}
                clickOutside={this.hideChartChooser}
              />
            </Col>
          </Row>
          <Row>
            <ScorePanel
              high={this.state.high}
              medium={this.state.medium}
              low={this.state.low}
              passed={this.state.passed}
              score={this.state.score}
              delta={this.state.delta}
              whiteSpace={this.state.whiteSpace}
              zoom={this.state.time}
              />
          </Row>

          {ComplianceSummaryCharts}
        </div>
    )
  }
})

const LoadTemplateClass = React.createClass({
  getInitialState() {
    return { showModal: false,
      templateName: '',
      templateDesc: '',
      templateNameValid: false,
      templateDescValid: false,
      templateName_validation: '',
      templateDesc_validation: '',
      templateName_error: '',
      templateDesc_error: '',
      templateName_border:'thin solid #4C58A4',
      templateDesc_border:'thin solid #4C58A4',
      list:[
        // {'id':1, "name":"Template101","creator":"Person101","date":"02/11/2017"},
        // {'id':2, "name":"Template102","creator":"Person102","date":"02/11/2017"},
        // {'id':3, "name":"Template103","creator":"Person103","date":"02/11/2017"},
        // {'id':4, "name":"Template104","creator":"Person104","date":"02/11/2017"},
        // {'id':5, "name":"Template105","creator":"Person105","date":"02/11/2017"},
        // {'id':6, "name":"Template106","creator":"Person106","date":"02/11/2017"},
        // {'id':7, "name":"Template107","creator":"Person107","date":"02/11/2017"},
        // {'id':8, "name":"Template108","creator":"Person108","date":"02/11/2017"},
        // {'id':9, "name":"Template109","creator":"Person109","date":"02/11/2017"},
        // {'id':10, "name":"Template110","creator":"Person110","date":"02/11/2017"}
      ],
      target:"",
      loadTemplate: '',
      showLoad: false,
      deleteTemplate: '',
      showDelete: false
    }
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    loadTemplateAPI()
      .then((res)=>{
        this.setState({
          list:res
        })
      })
      .catch((error)=>{console.log("loadTemplateAPI error: ", error)})
    this.setState({ showModal: true, showDelete:false, showLoad:false});
  },

  handleClickLoad(e) {
    this.setState({ loadTemplate: e.target.id, target: e.target, showLoad:true, showDelete:false});
  },

  handleClickDelete(e) {
    this.setState({ deleteTemplate: e.target.id, target: e.target, showDelete:true, showLoad:false});
  },

  findElement(arr, propName, propValue) {
    for (let i=0; i < arr.length; i++)
      if (arr[i].id == propValue)
        return arr[i];
  },

  load(e){
    this.setState({load: this.state.loadTemplate, showLoad: false, showModal: false });
    //call load API here
    // let targetObj = this.findElement(this.state.list,"id",this.state.loadTemplate);
    this.props.updateTarget("load", this.state.loadTemplate);
  },

  loadPopoverClose() {
     this.setState({showDelete:false, showLoad:false});
     this.hideToolTip();
  },

  closeAllPopover(){
    this.loadPopoverClose();
    this.deletePopoverClose();
  },

  delete(){
    this.setState({delete: this.state.deleteTemplate, showDelete: false});
    deleteTemplateAPI(this.state.deleteTemplate)
      .then((res)=>{
        console.log("deleted!!", res);
        this.open();
      })
      .catch((error)=>{
        console.log("Delete Error: ", error)
      })
  },

  deletePopoverClose() {
    this.setState({showDelete:false, showLoad:false});
  },
  showToolTip(){
    document.getElementById('tootTipIdLoad').style.visibility="visible";
  },
  hideToolTip(){
    document.getElementById('tootTipIdLoad').style.visibility="hidden";
  },

  render() {
    const tooltip = (
      <Tooltip style={{border:"none"}}><strong>Load Template</strong></Tooltip>
    );
    let style = {marginTop: 15}
    let style1 = {paddingBottom: 15}
    let tdstyle = {marginLeft: 15}
    let iconStyle = {marginTop:"15"}
    let textStyle = {marginTop:"10"}
    let dropdownStyle = {backgroundColor:"white"}
    let that = this;
    let pstyle = {paddingLeft: 20, paddingRight: 20, fontSize:25, paddingTop:'-30px', marginBottom:'24px', marginTop: 10, borderLeft: 'thin solid #D8D8D8', cursor:"pointer"}
    let svgTag = `
      <svg width="39px" height="28px" viewBox="1333 107 39 28" version="1.1">
          <g id="Switch_Dashboard_icon" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(1334.000000, 108.000000)">
              <g id="Page-1" transform="translate(20.000000, 13.000000)" stroke-linecap="round" stroke-width="2" stroke="#4C58A4">
                  <polyline id="Stroke-1" points="11.9981 5.9996 14.3981 8.4246 16.7991 5.9996"></polyline>
                  <polyline id="Stroke-3" points="4.7989 5.9996 2.4009 3.5756 -0.0001 5.9996"></polyline>
                  <path d="M11.2266,11.2789 C8.9746,12.5089 6.1016,12.1659 4.1996,10.2439 C2.5236,8.5499 2.0606,6.0989 2.8026,3.9859" id="Stroke-5"></path>
                  <path d="M5.5743,0.7203 C7.8243,-0.5097 10.6973,-0.1647 12.5993,1.7583 C14.2753,3.4493 14.7383,5.9003 13.9963,8.0153" id="Stroke-7"></path>
              </g>
              <g id="Page-1">
                  <g id="Group-5" stroke-linecap="round" stroke-width="2" stroke="#4C58A4">
                      <polyline id="Stroke-1" points="19 25 0 25 0 9 21 9 21 12"></polyline>
                      <polyline id="Stroke-3" points="8.999 9 8.999 0 29.999 0 29.999 9"></polyline>
                  </g>
                  <polygon id="Fill-6" fill="#4C58A4" points="3 14 9 14 9 12 3 12"></polygon>
                  <polygon id="Fill-7" fill="#4C58A4" points="12 14 18 14 18 12 12 12"></polygon>
                  <polygon id="Fill-8" fill="#4C58A4" points="12 5 27 5 27 3 12 3"></polygon>
                  <polygon id="Fill-9" fill="#4C58A4" points="12 18 17 18 17 16 12 16"></polygon>
                  <polygon id="Fill-10" fill="#4C58A4" points="3 18 9 18 9 16 3 16"></polygon>
                  <polygon id="Fill-11" fill="#4C58A4" points="3 22 9 22 9 20 3 20"></polygon>
                  <polygon id="Fill-12" fill="#4C58A4" points="12 22 18 22 18 20 12 20"></polygon>
              </g>
          </g>
      </svg>`;

    return (
      <span>
        {/*<OverlayTrigger placement="bottom" overlay={tooltip} rootClose>
          <span style={pstyle} onClick={this.open} dangerouslySetInnerHTML={{__html: svgTag}} ></span>
        </OverlayTrigger>*/}
        <span style={{position:'relative'}}>
          <span style={pstyle} onClick={this.open} onMouseOver={this.showToolTip} onMouseOut={this.hideToolTip} dangerouslySetInnerHTML={{__html: svgTag}} ></span>
          <div id="tootTipIdLoad" className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:30, left:-24, padding:'6px 4px', borderRadius:3}}>Load Template</div>
        </span>

         <Modal show={this.state.showModal}
           onScroll={this.closeAllPopover}
           aria-labelledby="contained-modal-title"
           dialogClassName={modalDialogClassDashLarge}
           backdrop='static'
           keyboard={false} onHide={this.close}>
           <form style={{border: '1px solid Navy'}}>
             <div style={{marginTop:'25px',paddingLeft:'15px'}}>
             <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
               <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} style={{fontSize:27, top:12, right:26, transform: 'scale(1.3,0.9)'}} onClick={this.close}>X</a>
               <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'LOAD TEMPLATE'}</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <table style={{marginLeft:10, marginRight:25,borderBottom:0, borderTop:0, width: "900"}} className={mytable}>
                 <thead>
                   <tr>
                     <th style={{width:'5%'}}></th>
                     <th style={{width:'25%'}}>TEMPLATE NAME</th>
                     <th style={{width:'25%'}}>CREATOR NAME</th>
                     <th style={{width:'25%'}}>DATE CREATED</th>
                     <th style={{width:'15%'}}></th>

                   </tr>
                 </thead>
                 <tbody onClick={this.getIndex}>
                 {this.state.list.map(function(reportDetail,index){
                     return (
                       <tr key={index} >
                         <td>
                           {that.state.load == reportDetail.id?<Glyphicon id={reportDetail.id} style={{color:'rgb(0, 196, 132)', fontSize: 18, marginRight:"20"}} glyph="ok"/>:<div style={textStyle}></div>}
                        </td>
                         <td>
                           <div style={textStyle}> {reportDetail.name} </div>
                        </td>
                         <td>
                           <div style={textStyle}> {reportDetail.createdby} </div>
                        </td>
                         <td>
                           <div style={textStyle}> {moment.utc(reportDetail.createtime).format('MM[/]DD[/]YY [@] HH[:]mm')} </div>
                        </td>
                        <td>
                          <div style={textStyle}> </div>
                            <Glyphicon id={reportDetail.id} onClick={that.handleClickLoad} style={{color:'#4C58A4', fontSize: 18, marginRight:"20"}} glyph="floppy-open">
                              <Overlay
                                show={that.state.showLoad}
                                target={that.state.target}
                                placement="bottom"
                                container={this}
                                containerPadding={20}
                              >
                                <Popover id="popover-load" title="Load this Template?">
                                    <Button bsStyle='primary' className={btnPrimary} style={{marginLeft:'15', borderRadius: 0}} onClick={that.load}>Load</Button>&nbsp;&nbsp;&nbsp;
                                    <Button className={blueBtn} onClick={that.loadPopoverClose}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                                </Popover>
                              </Overlay>
                            </Glyphicon>
                            <Glyphicon id={reportDetail.id} onClick={that.handleClickDelete} style={{color:'rgb(255, 68, 77)', fontSize: 18}} glyph="floppy-remove">
                              <Overlay
                                show={that.state.showDelete}
                                target={that.state.target}
                                placement="bottom"
                                container={this}
                                containerPadding={20}
                              >
                                <Popover id="popover-delete" title="Delete this Template?">
                                    <Button bsStyle='primary' className={btnPrimary} style={{marginLeft:'15', borderRadius: 0}} onClick={that.delete}>Delete</Button>&nbsp;&nbsp;&nbsp;
                                    <Button className={blueBtn} onClick={that.deletePopoverClose}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                                </Popover>
                              </Overlay>
                            </Glyphicon>
                       </td>
                       </tr>
                     );
                 })}
                 </tbody>
               </table>
             </Modal.Body>
             <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
               <Button className={blueBtn} onClick={this.close}>Cancel</Button>&nbsp;&nbsp;&nbsp;
             </Modal.Footer>
            </div>
           </form>
          </Modal>
      </span>
    );
  }
});

const SaveTemplateClass = React.createClass({
  getInitialState() {
    return { showModal: false,
      Name: '',
      Desc: '',
      templateNameValid: false,
      templateDescValid: false,
      templateName_validation: '',
      templateDesc_validation: '',
      templateName_error: '',
      templateDesc_error: '',
      templateName_border:'thin solid #4C58A4',
      templateDesc_border:'thin solid #4C58A4',
      templateName_error:""
    };
  },

  close() {
    this.setState({ showModal: false,
      Name: '',
      Desc: '',
      templateNameValid: false,
      templateDescValid: false,
      templateName_validation: '',
      templateDesc_validation: '',
      templateName_error: '',
      templateDesc_error: '',
      templateName_border:'thin solid #4C58A4',
      templateDesc_border:'thin solid #4C58A4'
     });
  },

  open() {
    this.setState({ showModal: true, templateNameValid: false });
  },
  showError(error){
    if (error){
      console.log("The child component is showing the error", error)
      this.setState({
        templateNameValid:false,
        templateName_error:error,
        templateName_validation: 'error',
        templateName_border:'thin solid #a94442'
      })
    } else {
      console.log("noo errorrrr", error)
      this.setState({
        templateNameValid:true,
        templateName_error: '',
        templateName_validation : 'success',
        templateName_border:'thin solid #3c763d'
      }, ()=>{this.close()})
    }
  },

  saveTemplate(e) {
    //make obj with name and desc
    let templateObj = {};
    templateObj.name = this.state.name;
    templateObj.desc = this.state.desc;
    this.props.saveTemplate(templateObj, this.showError);
  },
  handleTemplateNameChange(e){
    this.setState({
      name: e.target.value
    })
    let templateName_schema = {"Template Name": Joi.string().min(3).max(32).required()}
    let result = Joi.validate({"Template Name": e.target.value}, templateName_schema);
    if (result.error) {
      this.setState({
        templateNameValid:false,
        templateName_error : result.error.details[0].message,
        templateName_validation: 'error',
        templateName_border:'thin solid #a94442'
      })
    } else {
      this.setState({
        templateNameValid:true,
        templateName_error: '',
        templateName_validation : 'success',
        templateName_border:'thin solid #3c763d'
      })
    }
  },
  // handletemplateNameChange(e){
  //   let templateName_schema = {templateName: Joi.string().min(3).max(32).required()}
  //   let result = Joi.validate({templateName: e.target.value}, templateName_schema)
  //   this.setState({templateName: e.target.value});
  //   if (result.error) {
  //     this.setState({
  //       templateNameValid:false,
  //       templateName_error : result.error.details[0].message,
  //       templateName_validation: 'error',
  //       templateName_border:'thin solid #a94442'
  //     })
  //   } else {
  //     this.setState({
  //       templateNameValid:true,
  //       templateName_error: '',
  //       templateName_validation : 'success',
  //       templateName_border:'thin solid #3c763d'
  //     })
  //   }
  // },

  handleTemplateDescChange(e){
    this.setState({
      desc: e.target.value
    })
  },
  showToolTip(){
    document.getElementById('tootTipId').style.visibility="visible";
  },
  hideToolTip(){
    document.getElementById('tootTipId').style.visibility="hidden";
  },

  render() {
    const tooltip = (
      <Tooltip style={{border:"none"}}><strong>Save Template</strong></Tooltip>
    );
    let disableDoneBtn = (this.state.templateNameValid) ? false : true
    let pstyle = { paddingLeft: 20, paddingRight: 20, fontSize:25, paddingTop:'-30px', marginBottom:'24px', marginTop: 10, borderLeft: 'thin solid #D8D8D8', cursor:"pointer"}
    let svgTag=`
      <svg width="32px" height="28px" viewBox="667 400 32 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <!-- Generator: Sketch 40.3 (33839) - http://www.bohemiancoding.com/sketch -->
          <desc>Created with Sketch.</desc>
          <defs>
              <polygon id="path-1" points="0 28 32 28 32 0 0 0"></polygon>
          </defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(667.000000, 400.000000)">
              <path d="M31,19 C31,23.42 27.42,27 23,27 C18.584,27 15,23.42 15,19 C15,14.582 18.584,11 23,11 C27.42,11 31,14.582 31,19 L31,19 Z" id="Stroke-1" stroke="#4C58A4" stroke-width="2"></path>
              <polyline id="Stroke-3" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" points="26.4961 17.0019 22.4981 21.5019 20.0001 19.0019"></polyline>
              <polyline id="Stroke-5" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" points="11 21 1 21 1 1 22 1 22 7"></polyline>
              <mask id="mask-2" fill="white">
                  <use xlink:href="#path-1"></use>
              </mask>
              <g id="Clip-8"></g>
              <polygon id="Fill-7" fill="#4C58A4" mask="url(#mask-2)" points="4 10 10 10 10 8 4 8"></polygon>
              <polygon id="Fill-9" fill="#4C58A4" mask="url(#mask-2)" points="13 10 17 10 17 8 13 8"></polygon>
              <polygon id="Fill-10" fill="#4C58A4" mask="url(#mask-2)" points="4 6 10 6 10 4 4 4"></polygon>
              <polygon id="Fill-11" fill="#4C58A4" mask="url(#mask-2)" points="13 6 19 6 19 4 13 4"></polygon>
              <polygon id="Fill-12" fill="#4C58A4" mask="url(#mask-2)" points="4 14 10 14 10 12 4 12"></polygon>
              <polygon id="Fill-13" fill="#4C58A4" mask="url(#mask-2)" points="4 18 10 18 10 16 4 16"></polygon>
          </g>
      </svg>`;

    return (
      <span>
        {/*<OverlayTrigger placement="bottom" overlay={tooltip} rootClose>
          <span style={pstyle} onClick={this.open} dangerouslySetInnerHTML={{__html: svgTag}} ></span>
        </OverlayTrigger>*/}
        <span style={{position:'relative'}}>
          <span style={pstyle} onClick={this.open} onMouseOver={this.showToolTip} onMouseOut={this.hideToolTip} dangerouslySetInnerHTML={{__html: svgTag}} ></span>
          <div id="tootTipId" className={toolTipStyle} style={{width:115, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:30, left:-24, padding:'6px 4px', borderRadius:3}}>Save Template</div>
        </span>
         <Modal show={this.state.showModal}
           aria-labelledby="contained-modal-title"
           dialogClassName={modalDialogClassDash}
           backdrop='static' keyboard={false} onHide={this.close}>
           <form style={{border: '1px solid Navy'}}>
             <div style={{marginTop:'25px',paddingLeft:'15px'}}>
             <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
               <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} style={{fontSize:27, top:12, right:26, transform: 'scale(1.3,0.9)'}} onClick={this.close}>X</a>
               <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'SAVE TEMPLATE'}</Modal.Title>
             </Modal.Header>
             <Modal.Body style={{width:'500'}}>
               <FormGroup controlId="formTemplateName" validationState={this.state.templateName_validation}>
                 <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Name</ControlLabel></Col>
                 <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.templateName_border}}
                   type="text" name="groupname" placeholder="Enter Template Name"
                   onChange={this.handleTemplateNameChange}/>
                 <Col xs={12}><HelpBlock>{this.state.templateName_error}</HelpBlock></Col>
               </FormGroup>
               <FormGroup controlId="formTemplateDesc" validationState={this.state.templateDesc_validation}>
                 <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500',marginTop:'20px'}}>Description</ControlLabel></Col>
                 <FormControl componentClass="textarea" style={{width:400,height:150,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.templateDesc_border}}
                  placeholder="Enter Template Description" onChange={this.handleTemplateDescChange}/>
                </FormGroup>
             </Modal.Body>
             <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
               <Button className={blueBtn} onClick={this.close}>Cancel</Button>&nbsp;&nbsp;&nbsp;
               <Button bsStyle='primary' className={btnPrimary} onClick={this.saveTemplate} disabled={disableDoneBtn} style={{borderRadius: 0}}>
                 Save
               </Button>
             </Modal.Footer>
            </div>
           </form>
          </Modal>
      </span>
    );
  }
});

const DateRangeSelector = React.createClass({
  getInitialState: function(){
    return {
      // valueFrom: '',
      // valueTo: '2016-11-23T14:48:00+00:00',
      valueFrom: "",
      valueTo: "",
      fromValid:false,
      toValid:false,
      dateValid: false,
      showDateError: false,
      beforeTodayTo: true,
      beforeTodayFrom: true
    }
  },
  componentDidMount(){
    this.setState({
      valueFrom:this.props.from,
      valueTo:this.props.to
    })

  },
  componentWillReceiveProps(nextProps) {
    if(this.state.valueFrom != nextProps.from){
      this.setState({
        valueFrom:nextProps.from
      })
    }
    if(this.state.valueTo != nextProps.to){
      this.setState({
        valueTo:nextProps.to
      })
    }
  },
  handleChangeFrom: function(value) {
    console.log("does this call when delete??", value)
    // value is an ISO String.
    var today = moment().startOf('day')
    var beforeToday = moment(value).isBefore(today)
    if(getFormatterDate(value) == getFormatterDate())
    {
      beforeToday = true;
    }
    let from_schema = {from: Joi.string().required()}
    let result = Joi.validate({from: value}, from_schema)

    this.setState({
      beforeTodayFrom: beforeToday
    })

    if (!value || result.error) {
      console.log("HELLOOJOJOJ")
      this.setState({
        valueFrom: value,
        fromValid:false
      }, ()=>{console.log("this.state.fromValidthis.state.fromValid =P", this.state.fromValid); this.checkDateValid()});
    } else {
      this.setState({
        valueFrom: value,
        fromValid:true
      }, ()=>{console.log("this.state.fromValidthis.state.fromValid", this.state.fromValid); this.checkDateValid()});
    }
    this.props.getUpdatedFromDate(value)
  },
  handleChangeTo: function(value) {
    var today = moment().startOf('day')
    var beforeToday = moment(value).isBefore(today)
    console.log("whaaawhaaawhaaawhaaa", beforeToday)

    if(getFormatterDate(value) == getFormatterDate())
    {
      beforeToday = true;
    }
    // value is an ISO String.
    let to_schema = {to: Joi.string().required()}
    let result = Joi.validate({to: value}, to_schema)
    this.setState({
      beforeTodayTo: beforeToday
    })
    if (!value || result.error) {
      this.setState({
        valueTo: value,
        toValid:false
      }, ()=>{console.log("this.state.toValidthis.state.toValid", this.state.toValid); this.checkDateValid()});
    } else {
      this.setState({
        valueTo: value,
        toValid:true
      }, ()=>{console.log("this.state.toValidthis.state.toValid", this.state.toValid); this.checkDateValid()});
    }
    this.props.getUpdatedToDate(value)
  },
  checkDateValid(){
    console.log("this.state.fromValid && this.state.toValid", this.state.valueFrom, this.state.valueTo)
    console.log("this.state.fromValid && this.state.toValid", this.state.fromValid, this.state.toValid, this.state.valueFrom, this.state.valueTo, this.state.valueFrom < this.state.valueTo)
    // if(this.state.fromValid && this.state.toValid){
      if(getFormatterDate(this.state.valueFrom) <= getFormatterDate(this.state.valueTo)){
        this.setState({
          dateValid:true,
          showDateError:false
        });
      } else {
        this.setState({
          showDateError:true
        });
      }
    // } else {
    //   this.setState({
    //     dateValid:false
    //   });
    //   if(this.state.valueFrom < this.state.valueTo) {
    //     this.setState({
    //       dateValid:false
    //     });
    //   } else {
    //     this.setState({
    //       showDateError:false
    //     });
    //   }
    // }
  },
  showToolTip(){
    document.getElementById('tootTipIdAdd').style.visibility="visible";
  },
  hideToolTip(){
    document.getElementById('tootTipIdAdd').style.visibility="hidden";
  },

  render: function () {
    let errorMessage;
    if(this.state.showDateError){
      // errorMessage = (<div>Please select a "To" date that is later that is later than the "From" date</div>)
      errorMessage = (<span style={{color:"red", marginLeft:"40px"}}>"To" date must be later than "From" date</span>)
    } if (!this.state.beforeTodayTo || !this.state.beforeTodayFrom) {
      errorMessage = (<span style={{color:"red", marginLeft:"40px"}}>"To" and "From" need to be before current date</span>)
    } if (this.state.showDateError && !this.state.beforeTodayTo || this.state.showDateError && !this.state.beforeTodayFrom) {
      errorMessage = (<span style={{color:"red", marginLeft:"40px"}}>"To" date must be later than "From" date and before current date</span>)
    }
    let pstyle = { paddingLeft: 20, paddingRight: 20, fontSize:25, marginBottom:'24px', marginTop: 10, borderLeft: 'thin solid #D8D8D8', cursor:"pointer"}
    let svgTag1 = `
      <svg width="31px" height="31px" viewBox="1502 105 31 31" version="1.1">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(1503.000000, 106.000000)">
              <path d="M28,21 C28,25.42 24.42,29 20,29 C15.584,29 12,25.42 12,21 C12,16.582 15.584,13 20,13 C24.42,13 28,16.582 28,21 L28,21 Z" id="Stroke-1" stroke="#4C58A4" stroke-width="2"></path>
              <path d="M4,4 L18.998,4" id="Stroke-3" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M9,26.9981 L4,26.9981 C1.79,26.9981 0,25.2081 0,22.9981 L0,4.0001" id="Stroke-5" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M19.9981,0 L4.0001,0 C1.7901,0 0.0001,1.79 0.0001,4 C0.0001,6.209 1.7901,8 4.0001,8 L19.9981,8 L19.9981,9" id="Stroke-7" stroke="#4C58A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M20,18 L20,24" id="Stroke-9" stroke="#4C58A4" stroke-width="2" stroke-linecap="round"></path>
              <path d="M17,21 L23,21" id="Stroke-11" stroke="#4C58A4" stroke-width="2" stroke-linecap="round"></path>
          </g>
      </svg>
      `
     return (
      <nav className="navbar navbar-default" style={{paddingTop: 20, paddingLeft: 15, paddingBottom: 15, backgroundColor:'white', border: 0, borderRadius: 0, marginBottom: 0, height: 80, color: '#4C58A4'}}>
        <div className="container-fluid">
          <div className="navbar-header">
            <Form inline>
              <FormGroup className="datePick" controlId="formInlineName">
                <span style={{color:'#737685', paddingRight: 5}}>From</span>
                {' '}
                <DatePicker readonly={true} dateFormat="MM/DD/YYYY" value={this.state.valueFrom} onChange={this.handleChangeFrom} />
              </FormGroup>
              {' '}&nbsp;&nbsp;&nbsp;
              <FormGroup className="datePick" controlId="formInlineEmail">
                <span style={{color:'#737685', paddingRight: 5}}>To</span>
                {' '}
                <DatePicker readonly={true} dateFormat="MM/DD/YYYY" value={this.state.valueTo} onChange={this.handleChangeTo} />
              </FormGroup>
            </Form>
            {errorMessage}
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              {' '}
              <span>
                <LoadTemplateClass style={pstyle}
                  updateTarget={this.props.updateTarget}
                  />
              </span>

              <span>
                <SaveTemplateClass
                  saveTemplate={this.props.saveTemplate}
                  style={pstyle}/>
              </span>

              <span style={{position:'relative'}}>
                <GenerateDashboardReport
                  style={pstyle} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip}
                  />
                <div id="tootTipIdAdd" className={toolTipStyle} style={{width:100, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:30, left:-20, padding:'6px 4px', borderRadius:3}}>Generate Report</div>
              </span>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
})

const DashboardPage = React.createClass({
  getInitialState(){
    return {
      time:"Daily",
      to: new Date().toISOString(),
      from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
      chartChoice:"bar",
      dataChoice:"absolute",
      question:1,
      target:{},
      filterList:{},
      selectedPolicyPack:'',
      selectedGroup:'',
      selectedControlFamily:'',
      selectedOS:'',
      percentageData:[],
      data:[
        {
          label: 'Low',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        },
        {
          label: 'Med',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        },
        {
          label: 'High',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        },
        {
          label: 'Passed',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        }
      ],
      standardDate:[
        {
          label: 'Low',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        },
        {
          label: 'Med',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        },
        {
          label: 'High',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        },
        {
          label: 'Passed',
          values: [{x: 'Data does not exist within this date range.', y: 0}]
        }
      ],
      dataByDate:
      [
        {date:'07/16/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/17/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/18/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/19/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/20/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/21/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/22/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/23/2016',values:[0, 0, 0, 0, 0, 0]}
      ],
      standardDataByDate:
      [
        {date:'07/16/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/17/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/18/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/19/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/20/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/21/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/22/2016',values:[0, 0, 0, 0, 0, 0]},
        {date:'07/23/2016',values:[0, 0, 0, 0, 0, 0]}
      ],
      totHigh: 0,
      totMedium: 0,
      totLow: 0,
      totPassed: 0,
      currScore: 0,
      currDelta: 0,
      currWhiteSpace:0,
      loadNumber: 20,
      order: -1,
      pageLoad: true,
      loadingDiv:true
    }
  },
  // componentWillMount(){
  //   this.setState({
  //     pageLoad:false
  //   })
  // },
 componentDidMount() {
     let filters = {};
      filters["from"] = this.state.from;
      filters["to"] = this.state.to;
      filters["zoom"] = this.state.time
      filters["assetgroup"] = this.state.selectedGroup
      filters["policypack"] = this.state.selectedPolicyPack
      filters["controlfamily"] = this.state.selectedControlFamily
      filters["os"] = this.state.selectedOS
      this.setState({filterList:filters},function(){
        this.applyFilter();
      });
  },

  constructFilter(){
    let filters = {};
    if(this.state.from != null){
      filters["from"] = this.state.from;
    }
    if(this.state.to != null){
      filters["to"] = this.state.to;
    }
    if(this.state.time != null){
      filters["zoom"] = this.state.time;
    }
    if(this.state.selectedPolicyPack != null){
      filters["policypack"] = this.state.selectedPolicyPack;
    }
    if(this.state.selectedGroup != null){
      filters["assetgroup"]= this.state.selectedGroup;
    }
    if(this.state.selectedControlFamily !=null){
      filters["controlfamily"]=this.state.selectedControlFamily;
    }

    if(this.state.selectedOS !=null){
      filters["os"]=this.state.selectedOS;
    }

    this.setState({filterList:filters},function(){
      this.applyFilter()
    });
  },


  //+++++++ Common function to apply filter ++++++++++++++++++
  applyFilter(){
    this.setState({
      order:-1
    }, (res)=>{console.log("showArrow")})
    newGetSummaryData(this.state.filterList)
   .then((summary) => {
     console.log("summary.datasummary.data", summary.data.slice(0, 3))
     const summaryToUse = JSON.parse(JSON.stringify(summary));
    //  let summaryToUse = summary;
    //  this.makePercentageData(summaryToUse);
     this.setState({
       loadingDiv:false,
       actualRsponce:summaryToUse
     })
     // Calculating total values for render on page load
     let totHigh, totMedium, totLow, totPassed, currScore, currDelta, currWhiteSpace;
     if (summary.data[0].values.length !== 0) {
        totHigh = summary.data[2].values.reduce((a, b) => a + b.y, 0);
        totMedium = summary.data[1].values.reduce((a, b) => a + b.y, 0)
        totLow = summary.data[0].values.reduce((a, b) => a + b.y, 0)
        totPassed = summary.dataByDate[summary.dataByDate.length-1].values[3]
        currScore = summary.dataByDate[summary.dataByDate.length-1].values[4]
        currDelta = summary.dataByDate[summary.dataByDate.length-1].values[5]
        currWhiteSpace = 100 - currDelta
      this.setState({
        data:summary.data.slice(0, 3),
        dataByDate:summary.dataByDate,
        totHigh: totHigh,
        totMedium: totMedium,
        totLow: totLow,
        totPassed: totPassed,
        currScore: currScore,
        currDelta: currDelta,
        currWhiteSpace:currWhiteSpace
      }, (props)=>{
        this.makePercentageData(summaryToUse);
        if(this.state.pageLoad){
          this.setState({
            pageLoad:false
          })
        }
        console.log("this.state.data, this.state.dataByDate", this.state.data, this.state.dataByDate)});
      } else {
        this.setState({
          data:this.state.standardDate,
          dataByDate:this.state.standardDataByDate,
          totHigh: 0,
          totMedium: 0,
          totLow: 0,
          totPassed: 0,
          currScore: 0,
          currDelta: 0,
          currWhiteSpace:0
        })
      }
    })
    .catch((error) => {
      if(this.state.pageLoad){
        this.setState({
          pageLoad:false
        })
      }
      console.log("Error in getting summary list:"+error)
    })
  },

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("this, nextProps, nextStatehis, nextProps, nextState", this, nextProps, nextState, this.state.currScore, nextState.currScore)
  //   if (this.state.currScore){
  //     // console.log("this, this.state, nextStatehis, this.state, nextState", this, this.state.currScore, nextState.currScore)
  //     return this.state.currScore !== nextState.currScore
  //     // return this.shallowCompare(this, nextProps.score, nextState.graphScore);
  //   } else {
  //     return true
  //   }
  // },

  shouldComponentUpdate(nextProps, nextState) {
      // console.log("this, nextProps, nextStatehis, nextProps, nextState", this, nextProps, nextState, this.state.currScore, nextState.currScore)
    if (!this.state.pageLoad){
      console.log(", pageLoad:false", this.state.currScore !== nextState.currScore || shallowCompare(this, nextProps.filterList, nextState.filterList) )
      // console.log("this, this.state, nextStatehis, this.state, nextState", this, this.state.currScore, nextState.currScore)

      // return this.state.currScore !== nextState.currScore || shallowCompare(this, nextProps.filterList, nextState.filterList)

      // || this.state.currScore !== nextState.currScore && shallowCompare(this, nextProps.filterList, nextState.filterList)
      // return this.shallowCompare(this, nextProps.score, nextState.graphScore);
      return this.state.question == nextState.question

    } else {
      console.log(", pageLoad:true")

      return true
    }
  },
  findPercent(dayData){
    let percent = {};
    let total = dayData[0] + dayData[1] + dayData[2] + dayData[3];
    percent.high= Math.round((dayData[0]/total)*100);
    percent.medium = Math.round((dayData[1]/total)*100);
    percent.low = Math.round((dayData[2]/total)*100);
    percent.passed = Math.round((dayData[3]/total)*100);
    return percent;
  },

  makePercentageData(summary){
    // let result = [];
    let percent = summary.data;
      for (var i = 0; i < summary.dataByDate.length; i++){
        if (percent[0].values[i].y){
          let percentData = this.findPercent(summary.dataByDate[i].values)
          percent[0].values[i].y = percentData.low;
          percent[1].values[i].y = percentData.medium;
          percent[2].values[i].y = percentData.high;
          percent[3].values[i].y = percentData.passed;
          // result.push(percent)
          // console.log("this is the data I need to fixfadfasf", summary)
          // this.setState({
          //   percentageData:result
          // }, ()=>{console.log("afjaklfjklajflkjsdlfa", this.state.percentageData)})
        }
      }
    // let
    this.setState({
      percentageData:percent
    })
  },

  getUpdatedToDate(toDate) {
    this.setState({to:toDate},function(){
      this.constructFilter();
    })
  },

  getUpdatedFromDate(fromDate) {
    this.setState({from:fromDate},function(){
      this.constructFilter();
    })
  },

  updateChartChoice(chartChoice){
    this.setState({
      chartChoice:chartChoice
    })
  },

  updateDataChoice(dataChoice){
    this.setState({
      dataChoice:dataChoice
    })
  },

  handleChangeTime(event){
    this.setState({time:event},function(){
      this.constructFilter();
    })
  },

  groupChange(e){
    this.setState({selectedGroup:e},function(){
      this.constructFilter();
    });
  },

  policyPackChange(e){

    this.setState({selectedControlFamily:''})

    this.setState({selectedPolicyPack:e},function(){
      this.constructFilter();
    });
  },

  controlFamilyChange(e){
    this.setState({selectedControlFamily:e},function(){
      this.constructFilter();
    })
  },

// shouldComponentUpdate(nextProps, nextState) {

//     //Return TRUE only once current and next state data got changed
//      if(nextState.data!==this.state.data)
//      {
//        return true;
//      }

//      return false;
//     },
  handleChangeOS(os){
    this.setState({selectedOS:os},function(){
      this.constructFilter();
    })
  },

  updateQuestion(questionChoice){
    this.setState({
      question: questionChoice
    })
  },
  updateLoad(loadNumber){
    this.setState({
      loadNumber: loadNumber
    })
  },
  saveTemplate(templateObj, callback) {
    // make post request data here. (add template info to templateObj)
    var templateData = {}
    if (templateObj) {
      //from ComplianceSummary
      templateObj.toDate = this.state.to;
      templateObj.fromDate = this.state.from;
      templateObj.zoom = this.state.time;
      templateObj.chart = this.state.chartChoice;
      templateObj.dataChoice = this.state.dataChoice;
      templateObj.selectedPolicyPack = this.state.selectedPolicyPack;
      templateObj.selectedGroup = this.state.selectedGroup;
      templateObj.selectedControlFamily = this.state.selectedControlFamily;
      templateObj.selectedOS = this.state.selectedOS;
      //from Results Details
      templateObj.question = this.state.question;
      templateObj.loadNumber = this.state.loadNumber;
      templateData.name = templateObj.name;
      templateData.keyset = templateObj;
      templateData.createdby = 'admin';
    }
    // call API to save template with
    saveTemplateAPI(templateData)
    .then((res)=>{
      callback()
    })
    .catch((error)=>{
      callback(error.data.error)
    })
  },
  updateTarget(action, target) {
    getTemplateAPIById(target)
    .then((res)=>{
      this.setState({
        target:res,
        time:res.keyset.zoom,
        to:res.keyset.toDate,
        from: res.keyset.fromDate,
        chartChoice: res.keyset.chart,
        dataChoice: res.keyset.dataChoice,
        question:res.keyset.question,
        loadNumber:res.keyset.loadNumber,
        selectedPolicyPack:res.keyset.selectedPolicyPack,
        selectedGroup:res.keyset.selectedGroup,
        selectedControlFamily:res.keyset.selectedControlFamily,
        selectedOS:res.keyset.selectedOS
      }, (res)=>{
        console.log("This the state of the new template: ", this.state.target, this.state.time, this.state.to, this.state.from, this.state.chartChoice, this.state.question)
        this.constructFilter();
      });
    })
  },
  render: function () {
    // if(this.state.pageLoad){
    //   this.setState({
    //     pageLoad:false
    //   })
    // }
    // this.setState({
    //   pageLoad:false
    // })
    return (
      <div>
        <Header name='Dashboard'/>
          <DateRangeSelector
            getUpdatedToDate={this.getUpdatedToDate}
            to={this.state.to}
            getUpdatedFromDate={this.getUpdatedFromDate}
            from={this.state.from}
            saveTemplate={this.saveTemplate}
            updateTarget={this.updateTarget}
           />
         <div id="DashboardContent">
          <div className={border}>
            <ComplianceSummary
              loadingDiv={this.state.loadingDiv}
              order={this.state.order}
              updateChartChoice={this.updateChartChoice}
              updateDataChoice={this.updateDataChoice}
              handleChangeTime={this.handleChangeTime}
              handleChangeOS={this.handleChangeOS}
              to={this.state.to}
              from={this.state.from}
              percentageData={this.state.percentageData}
              data={this.state.data}
              dataByDate={this.state.dataByDate}
              totHigh= {this.state.totHigh}
              totMedium= {this.state.totMedium}
              totLow= {this.state.totLow}
              totPassed= {this.state.totPassed}
              currScore= {this.state.currScore}
              currDelta= {this.state.currDelta}
              currWhiteSpace={this.state.currWhiteSpace}
              chart={this.state.chartChoice}
              dataChoice={this.state.dataChoice}
              policyPackChange={this.policyPackChange}
              controlFamilyChange={this.controlFamilyChange}
              groupChange={this.groupChange}
              selectedPolicyPack={this.state.selectedPolicyPack}
              dataLoad={this.state.res}
              time={this.state.time}
              selectedPolicyPack={this.state.selectedPolicyPack}
              selectedGroup={this.state.selectedGroup}
              selectedControlFamily={this.state.selectedControlFamily}
              selectedOS={this.state.selectedOS}
              responceMainChart={this.state.actualRsponce}
              />
          </div>
          <div className={border}>
            <TopFailures
              updateQuestion={this.updateQuestion}
              updateLoad={this.updateLoad}
              loadNumber={this.state.loadNumber}
              question={this.state.question}
               />
          </div>
        </div>
      </div>
    )
  },
})

const Dashboard = React.createClass({
  render() {
    return (
      <div>
        <DashboardPage/>
      </div>

     )
  },
})

export default Dashboard
