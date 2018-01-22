import React, {PropTypes } from 'react'
import { Link } from 'react-router'
import { Grid, Row, Col, Button} from 'react-bootstrap'
import {Header} from 'components'
import {hmenu, active} from 'containers/UserOptions/styles.css'
import {blueBtn, spacer, footerBtn,btnPrimary} from 'sharedStyles/styles.css'
import TagButtonMenu from 'components/TagButton/TagButtonMenu'
import {plansWrapper} from 'containers/UserOptions/styles.css'
import UploadLicense from './UploadLicense'
import {getAllData} from 'helpers/license'
import moment from 'moment'

const BillingInformation = React.createClass({
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      loadingDiv:true,
      deviceCount:'100\\u001F-1',
      licenseInfo:{}
    }
  },
  onItemClick: function(e)  {
    //console.log('InfMain'+e.target.hash)
    this.setState({ activeTab: e.target.hash})
  },

  componentDidMount: function(){
    this.getLicenseData()
  },

   componentWillReceiveProps(nextProps,nextState){

  },

  getLicenseData(){
    getAllData()
    .then((res)=>{
      console.log("resresrsdfsdf", res)
      let info = {}
      //  "customerName": "Acme",
      //  "license": "5565-1039-AF89-GGX7-TN31-14AL",
      //  "deviceCount": "100\u001f-1",
      //  "issued": "22-Aug-2017",
      //  "expiration": "29-Aug-2017"
      info.customerName = res.customerName;
      info.deviceCount = res.deviceCount;
      info.activated = res.issued;
      info.expiration = res.expiration;
      info.inUse = res.inuse;

      console.log("resresrsdfsdf", res, info)

      this.setState({
        licenseInfo:info
      })
    })
    .catch((error)=>{
      console.log("getAllData", error)
    })
  },

  refresh(record){
    this.getLicenseData()
  },

  findDash(buildID){
    for(var i = 0; i < buildID.length; i++){
      if(buildID[i] === "-"){
        return i
      }
    }
  },

  render() {
  let css = {
    oddRow : {
      backgroundColor:'#f9fafc',
      height:'50px',
      width:'100%',
      lineHeight:'50px' //++ To Adjust the text to align to the middle
    },
    evenRow:{
      backgroundColor:'#EDF2F8',
      height:'50px',
      lineHeight:'50px',
      width:'100%',
    },
    leftCol:{
      display:'inline-block',
      textAlign:'right',
      width:'20%',
      overflow:'hidden'
    },
    rightCol:{
      paddingLeft:'100px',
      display:'inline-block',
      width:'80%',
      overflow:'hidden'
    },
    column1:{
      backgroundColor:'#FFF',
      border:'2px solid #E5EAF4',
      margin:'0 40px',
      width:'33%',
      position:'relative'
    },
    column2:{
      backgroundColor:'#FFF',
      border:'2px solid #E5EAF4',
      margin:'0 40px',
      width:'33%',
      position:'relative'
    },
    column3:{
      backgroundColor:'#FFF',
      border:'2px solid #E5EAF4',
      margin:'0 40px',
      width:'33%',
      position:'relative'
    },
    columnWrapper:{
      display:'flex',
      justifyContent:'center',
      padding:'0 50px',
      margin:'30px 0 100px -50px'
    },

    //++++++++ Used for planning section +++++++++++++
    colHeading:{
      textAlign:'center',
      color:'#4C58A4',
      fontSize: '20px',
      fontWeight: 'bold',
      borderBottom: '0.5px solid #E5EAF4',
      padding: '0 0 0 0',
      height:'50px',
      lineHeight:'50px'
    },

    colContents:{
      height:'280px',
      padding:'20px 0px',
      minHeight:'400px',
      height:'auto',
      marginBottom: 120
    },

    colFooter:{
      textAlign:'center',
      //borderTop:'2px solid #E5EAF4',
      height:'120px',
      position:'absolute',
      bottom:0,
      left:0,
      right:0
    },

    footerDiv:{
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column'
    }

  }

  let daysRemaining = '-';
  let licenseStatus;
  if(this.state.licenseInfo.activated && this.state.licenseInfo.expiration){
    let activated = moment(this.state.licenseInfo.activated)
    daysRemaining = moment(this.state.licenseInfo.expiration,'DD-MMM-YYYY').diff(moment(),'days')
    console.log("daysRemaining", daysRemaining, this.state.licenseInfo.expiration, moment().format('DD-MMM-YYYY'))
    if(daysRemaining < 0){
      licenseStatus = 'Expired'
      daysRemaining =  0;
    }
    else{
      licenseStatus = 'Active'
    }
  }

  let deviceCount = '-';
  if(this.state.licenseInfo.deviceCount)
  {
    let dCount = this.state.licenseInfo.deviceCount
    console.log("dCount "+dCount,dCount.toString())
    let deviceC = dCount.replace(/\u/g,'\\u')
    let dash = this.findDash(deviceC)
    deviceCount = deviceC.slice(0, dash)
    console.log("deviceCount "+deviceCount)
  }
  let spanStyle = {fontSize:'20px',color:'#4C58A4',fontWeight:500}
  let packageDiv = {width:'100%',paddingTop:'20px'}
  let wrapperVersionAndSystemStyle = {marginLeft:'60px',marginRight:'75px',marginTop:'-25px'}
  let selectStyle = {marginLeft: '10px'}
  let billingTableWrapper = {marginLeft:'60px',marginRight:'75px',marginTop:'50px'}
    return (
      <div id ="totalWrapper">
       <div style={{marginTop:'40px'}}>
      <div id="wrapperVersionAndSystem" style={wrapperVersionAndSystemStyle}>
        <span style={spanStyle}>License Key:</span>
        <div className={hmenu} style={{marginTop:'20px'}}></div>
      {/* License info top section*/}
          <div id="licenseInfoWrapper">
             <div style={css.oddRow}>
                <div style={css.leftCol}>Customer ID:</div>
                <div style={css.rightCol}> {this.state.licenseInfo.customerName?this.state.licenseInfo.customerName:'-'} </div>
             </div>
             <div style={css.evenRow}>
              <div style={css.leftCol}>License Status:</div>
             <div style={css.rightCol}>{licenseStatus}</div>
             </div>
             <div style={css.oddRow}>
              <div style={css.leftCol}>Activated:</div>
             <div style={css.rightCol}>{this.state.licenseInfo.activated?
              moment.utc(this.state.licenseInfo.activated).format('MM/DD/YYYY'):'-'}</div>
             </div>
             <div style={css.evenRow}>
              <div style={css.leftCol}>Expiration:</div>
             <div style={css.rightCol}>{this.state.licenseInfo.expiration?
              moment.utc(this.state.licenseInfo.expiration).format('MM/DD/YYYY'):'-'}</div>
             </div>
             <div style={css.oddRow}>
              <div style={css.leftCol}>Days Remaining:</div>
             <div style={css.rightCol}>{daysRemaining}</div>
             </div>
             <div style={css.evenRow}>
              <div style={css.leftCol}>Devices per license:</div>
             <div style={css.rightCol}>
             {deviceCount}</div>
             </div>
             <div style={css.oddRow}>
              <div style={css.leftCol}>Devices in use:</div>
             <div style={css.rightCol}>{this.state.licenseInfo.inUse}</div>
             </div>
              <div style={css.evenRow}>
              <div style={css.leftCol}>License Upload:</div>
             <div style={css.rightCol}>{/*<Button  style={{marginLeft:'-3px'}} disabled={this.state.savelater} className={footerBtn} >Upload License Key</Button>*/}
              <UploadLicense refresh={this.refresh}/>
             </div>
             </div>
          </div>
        {/*License Info end section*/}
         {/*<div className={hmenu} style={{marginTop:'40px'}}></div>
          <span style={spanStyle}>Plans:</span>
         <div className={plansWrapper} style={css.columnWrapper}>
          <div style={css.column1}>
            <div id="header" style={css.colHeading}>
                PLAN BASIC
            </div>

            <div id="contents" style={css.colContents}>
              <ul>
                <li>Up to 500 servers</li>
                <li>5 users</li>
                <li>3 Policy Pack bundles</li>
                <li>10K scans</li>
                <li>API</li>
                <li>Assessment reports (unlimited)</li>
                <li>Analytical Dashboard</li>
                <li>Email support</li>
              </ul>
            </div>

            <div id="footer" style={css.colFooter}>
              <div style={css.footerDiv}>
                <span style={{fontSize:'30px',fontWeight:'bold',color:'#4C58A4'}}>$190</span>
                <span style={{fontSize:'10px'}}>Per Month</span>
                <span><Button  disabled={this.state.savelater} className={footerBtn} >Select Plan</Button></span>
              </div>
            </div>

          </div>
          <div style={css.column2}>
          <div id="header" style={css.colHeading}>
                PLAN SMB
            </div>

            <div id="contents" style={css.colContents}>
              <ul>
                <li>Up to 5000 servers</li>
                <li>5 users</li>
                <li>10 Policy Pack bundles</li>
                <li>25K scans</li>
                <li>API and Integrations</li>
                <li>Assessment reports (unlimited)</li>
                <li>Analytical Dashboard</li>
                <li>Alerts</li>
                <li>Continuous monitoring</li>
                <li>Email support</li>
              </ul>
            </div>

            <div id="footer" style={css.colFooter}>
               <div style={css.footerDiv}>
                  <span style={{fontSize:'30px',fontWeight:'bold',color:'#4C58A4'}}>$490</span>
                  <span style={{fontSize:'12px'}}>Per Month</span>
                  <span><Button  disabled={this.state.savelater} className={footerBtn} >Select Plan</Button></span>
              </div>
            </div>
          </div>
          <div style={css.column3}>
          <div id="header" style={css.colHeading}>
                PLAN ENTERPRISE
            </div>

            <div id="contents" style={css.colContents}>
              <ul>
                <li>Unlimited servers</li>
                <li>5 users</li>
                <li>Unlimited Policy Pack bundles</li>
                <li>100K scans</li>
                <li>API and Integrations</li>
                <li>Assessment reports (unlimited)</li>
                <li>Analytical Dashboard</li>
                <li>Alerts</li>
                <li>Continuous monitoring</li>
                <li>Custom policies</li>
                <li>Email support</li>
              </ul>
            </div>

            <div id="footer" style={css.colFooter}>
              <div style={css.footerDiv}>
                  <span style={{fontSize:'30px',fontWeight:'bold',color:'#4C58A4'}}>$990</span>
                  <span style={{fontSize:'12px'}}>Per Month</span>
                  <span><Button  disabled={this.state.savelater} className={footerBtn} >Select Plan</Button></span>
              </div>
            </div>
          </div>
        </div>*/}
        </div>
      </div>


      </div>
    )
  },
})

export default BillingInformation
