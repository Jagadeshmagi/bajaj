import React, {PropTypes} from 'react'
import {Col,InputGroup,FormGroup,FormControl,Checkbox,
        Glyphicon,ControlLabel,Button, ProgressBar} from 'react-bootstrap'
import {TextCell,LinkCell,CheckboxCell} from 'components/Table/Table'
import {spacer, blueBtn} from 'sharedStyles/styles.css'
import {progress, mytable,centeredContainer} from 'sharedStyles/styles.css'
import getIpConfig from 'helpers/applicationSettings'
import {saveIPConfig} from 'helpers/applicationSettings'
import UpdateComponent from './UpdateComponent'
import {SpinnyLogo} from 'containers'
import {hmenu, dropdown} from '.././styles.css'
import {getAllsoftwareAndContentData, getAllsoftwareData, upgradeStatus} from 'helpers/Upgrade'
import moment from 'moment'
import {modalContainer, CreateGroupDialogClass, modalCloseStyle, ubtnPrimary, toolTipStyle} from '.././styles.css'

const About = React.createClass({
  getInitialState(){
    return{
      loadingDiv: true,
      contentData: [],
      softwareData: [],
      insertedRecordId: 0,//... Record id in DB...// 
      statusText: '',
      loadingDiv: false,
      upgradeContentPercent: '',//... Progress percent ...//
      showContentUpgradeProgress: 'none',//... Display/hide progress bar ...//
      contentSpanPercent: 'hidden',//... Display/hide % of progress ...//
      contentUpgradeProcessCompleted: false, //... To stop continuous polling ... //
      contentProgressDisplay: 'none'
    }
  },

  componentDidMount(){
    this.getSoftwareAndContent(false);
    getAllsoftwareData()
     .then((softwareData) => {
          if(softwareData !== undefined && softwareData.contents !== undefined)
           this.setState({softwareData: softwareData.contents})
      })
     .catch((getSoftwareError) => {console.log('error in getSoftware'+getSoftwareError)})
    //check if any inProgress upgrade id?
  },

  getSoftwareAndContent(isStopPolling){
    this.setState({loadingDiv: true})
    getAllsoftwareAndContentData()
      .then((responseData) => {
        this.setState({loadingDiv:false,
          contentData:responseData.contents})
      })
      .catch((getAllsoftwareAndContentError)=>{console.log('error in getAllsoftwareAndContentError '+getAllsoftwareAndContentError)})
    
    if(isStopPolling){
      this.stopPolling(true);
    }
  },

  setId(recordId){
    this.setState({
      insertedRecordId:recordId,
      showContentUpgradeProgress:'block',
      statusText:''}, function(){
      this.getUpgradeStatus();
    })
  },

  getUpgradeStatus(){
    let recordId = this.state.insertedRecordId
    if(recordId > 0){
      return upgradeStatus(recordId)
      .then((upgradeResponse) => {
        this.setState({
          statusText:upgradeResponse.status,
          upgradeContentPercent:upgradeResponse.upgradepercentage,
          contentSpanPercent:'visible',
          contentProgressDisplay:'block'})  
      })
      .catch((error) => console.log("Error in getUpgradeStatus:" + error))
    }
  },

  stopPolling(isCompleted){
    //... Stop polling-hide status bar ...//
    this.setState({contentSpanPercent:'hidden',
                  contentProgressDisplay:'none'})
    if(isCompleted)
      this.setState({contentUpgradeProcessCompleted:true})
    else
      this.setState({contentUpgradeProcessCompleted:false})
  },


  showSoftwareUpgradeToolTip(){
    document.getElementById('softwareUpgrade').style.visibility="visible";
  },
  hideSoftwareUpgradeToolTip(){
    document.getElementById('softwareUpgrade').style.visibility="hidden";
  },

  showContentUpgradeToolTip(){
    document.getElementById('contentUpgrade').style.visibility="visible";
  },
  hideContentUpgradeToolTip(){
    document.getElementById('contentUpgrade').style.visibility="hidden";
  },  

  showPandVUpgradeToolTip(){
    document.getElementById('PandVUpgrade').style.visibility="visible";
  },
  hidePandVUpgradeToolTip(){
    document.getElementById('PandVUpgrade').style.visibility="hidden";
  },

  render() {
    let spanStyle = {fontSize:'20px',color:'#4C58A4',fontWeight:500}
    let packageDiv = {width:'100%',paddingTop:'20px'}
    let wrapperVersionAndSystemStyle = {marginLeft:'60px',marginRight:'75px',marginTop:'-25px'}
    let selectStyle = {marginLeft: '10px'}  
    let status =this.state.statusText
    let percentComplete = this.state.upgradeContentPercent

    if(status != '' && status!= null && !this.state.contentUpgradeProcessCompleted)
    {
      if (status === 'Successful'){

        // ... Upload successful, stop polling, refresh the table contents...
        this.getSoftwareAndContent(true);

      }else if (status!= null && status.startsWith('Error')){
        
        //... Error in upgrade, display error and stop polling ...//
        this.stopPolling(true);
      
      }else{
        this.getUpgradeStatus();
      }
    }
    return (
      <div className={spacer}>
        <div id="wrapperVersionAndSystem" style={wrapperVersionAndSystemStyle}>
          <span style={spanStyle}>Version:</span>
          <div id="versionInfo" style={{marginBottom:'50px'}}>
            <div className={hmenu} style={{marginTop:'20px'}}></div>          
            <div style={packageDiv}>
              <table style={{width:'100%'}}>
                <tr id="ProductName" style={{height:'40px'}}>
                  <td>
                    <table>
                      <tr style={{height:'30px'}}>  
                        <td className="Col-md-4 Col-xs-4 Col-lg-4" 
                            style={{textAlign: 'right',color:'#ACB3B7',paddingLeft:'70px',
                            paddingRight:'40px'}}>Product full name:
                        </td>
                        <td className="Col-md-4 Col-xs-4 Col-lg-4" 
                            style={{textAlign: 'left',color:'#4C58A4'}}>Cavirin-Pulsar
                        </td>       
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr id="packageRow" style={{backgroundColor:'#EDF2F8',height:'100px'}}>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'20px'}}>
                    <table>
                      <tr style={{height:'35px'}}>
                        <td style={{textAlign: 'right',color:'#ACB3B7',paddingLeft:'20px',paddingRight:'40px'}}>
                          Software Package Version: 
                        </td>
                        <td style={{textAlign: 'left',color:'#4C58A4'}}>
                          {this.state.softwareData.length > 0 ?this.state.softwareData[0].version:'-'}
                        </td>
                      </tr>
                      <tr style={{height:'35px'}}>
                        <td style={{textAlign: 'right', fontWeight: 'bold',
                                    paddingRight:'40px'}}>Released at: 
                        </td>
                        <td style={{textAlign: 'left'}}>{this.state.softwareData.length>0?moment.utc(this.state.softwareData[0].versionDate).format('MMM DD YYYY'):'-'}</td>
                      </tr>
                    </table>
                  </td>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'35px'}}></td>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'35px'}}>{/*<UpdateComponent upgradeType="Software" />*/}
                    <span style={{position:'relative'}}>
                      <Button onMouseOver={this.showSoftwareUpgradeToolTip} onMouseOut={this.hideSoftwareUpgradeToolTip} bsStyle='primary' bsSize='large' className={ubtnPrimary} style={{borderRadius: 0,width: '100px',height: '40px'}} >
                        Update
                      </Button>
                      <div id='softwareUpgrade' className={toolTipStyle} style={{width:110, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:40, left:-10, padding:'6px 4px', borderRadius:3, zIndex:"3"}}>Coming soon</div>
                    </span>
                  </td>
                </tr>
                <tr id="contentPackageVersion" style={{backgroundColor:'#F9FAFC',height:'100px'}}>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'20px'}}>
                    <table>
                      <tr style={{height:'35px'}}>
                        <td style={{textAlign: 'right',color:'#ACB3B7',paddingLeft:'20px',paddingRight:'40px'}}>
                          Content Package Version: 
                        </td>
                        <td style={{textAlign: 'left',color:'#4C58A4'}}>{this.state.contentData.length>0?this.state.contentData[0].version:'-'}</td>
                      </tr>
                      <tr style={{height:'35px'}}>
                          <td style={{textAlign: 'right', fontWeight: 'bold',paddingRight:'40px'}}>Released at: </td>
                          <td style={{textAlign: 'left'}}>{this.state.contentData.length>0?moment.utc(this.state.contentData[0].versionDate).format('MMM DD YYYY'):'-'}</td>
                      </tr>
                    </table>
                  </td>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'25px', paddingRight:'60px'}}>
                    <div style={{fontSize:'18px',display:this.state.showContentUpgradeProgress}}>
                      {status} &nbsp;&nbsp;&nbsp;<span style={{'visibility':this.state.contentSpanPercent}}>{percentComplete} %</span>
                      <div id='progressBar' style={{display: this.state.contentProgressDisplay, width: '150px'}}>
                        <ProgressBar style={{height:'10px'}} bsStyle="success" now={percentComplete}/>
                      </div>
                    </div>
                  </td>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'35px'}}>
                    {/*<UpdateComponent upgradeType="Content" contentStatus={this.state.contentUpgradeProcessCompleted} setId={this.setId}/>*/}
                    <span style={{position:'relative'}}>
                      <Button onMouseOver={this.showContentUpgradeToolTip} onMouseOut={this.hideContentUpgradeToolTip} bsStyle='primary' bsSize='large' className={ubtnPrimary} style={{borderRadius: 0,width: '100px',height: '40px'}} >
                        Update
                      </Button>
                      <div id='contentUpgrade' className={toolTipStyle} style={{width:110, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:40, left:-10, padding:'6px 4px', borderRadius:3, zIndex:"3"}}>Coming soon</div>
                    </span>
                  </td>
                </tr>
                <tr id="patchesandVulnarabilitesVersion" style={{backgroundColor:'#EDF2F8',height:'100px'}}>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'20px'}}>
                    <table>
                      <tr style={{height:'35px'}}>
                        <td style={{textAlign: 'right',color:'#ACB3B7',paddingLeft:'20px',paddingRight:'40px'}}>
                          Patches & vulnarabilites : 
                        </td>
                        <td style={{textAlign: 'left',color:'#4C58A4'}}>-</td>
                      </tr>
                      <tr style={{height:'35px'}}>
                        <td style={{textAlign: 'right', fontWeight: 'bold',paddingRight:'40px'}}>Released at: </td>
                        <td style={{textAlign: 'left'}}>-</td>
                      </tr>
                    </table>
                  </td>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'35px'}}> </td>
                  <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'35px'}}>{/*<UpdateComponent upgradeType="PatchesAndVul"/>*/}
                    <span style={{position:'relative'}}>
                      <Button onMouseOver={this.showPandVUpgradeToolTip} onMouseOut={this.hidePandVUpgradeToolTip} bsStyle='primary' bsSize='large' className={ubtnPrimary} style={{borderRadius: 0,width: '100px',height: '40px'}} >
                        Update
                      </Button>
                      <div id='PandVUpgrade' className={toolTipStyle} style={{width:110, visibility:'hidden', backgroundColor:'#00C484', color:'#fff', textAlign:'center', position:'absolute', top:40, left:-10, padding:'6px 4px', borderRadius:3, zIndex:"3"}}>Coming soon</div>
                    </span>
                  </td>
                </tr>
              </table>         
            </div>
          </div>  
         {/* System table configuration
          <span style={spanStyle}>System:</span>
            <div id="systemInfo">
              <div className={hmenu} style={{marginTop:'20px'}}></div>          
              <div style={packageDiv}>
                <table id="systemTable" style={{width:'100%'}}>
                  <tr id="spceRow" style={{height:'40px'}}></tr>
                  <tr id="packageRow" style={{backgroundColor:'#EDF2F8',height:'60px'}}>
                    <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'20px'}}>
                      <table>
                        <tr style={{height:'25px'}}>
                          <td style={{textAlign: 'right',color:'#ACB3B7',
                                      paddingLeft:'100px',paddingRight:'40px'}}>Deployed at: </td>
                          <td style={{textAlign: 'left',color:'#4C58A4'}}>AWS</td>
                        </tr>    
                      </table>
                    </td>
                  </tr>
                  <tr id="restartedLastTime" style={{backgroundColor:'#F9FAFC',height:'30px'}}>
                    <td className="Col-md-4 Col-xs-4 Col-lg-4" style={{paddingTop:'20px'}}>
                      <table>
                        <tr style={{height:'35px'}}>
                          <td style={{textAlign: 'right',color:'#ACB3B7',paddingLeft:'60px',
                              paddingRight:'40px'}}>Restarted last time:
                          </td>
                          <td style={{textAlign: 'left',color:'#4C58A4'}}>AUG 09 2017</td>
                        </tr> 
                      </table>
                    </td>
                  </tr>
                </table>      
              </div>
            </div>  */}
            {/* dropdown section */}
            {/*<div id="systemDropdown" style={{textAlign:'right',paddingRight:'90px',
                marginTop:'10px',marginBottom:'50px'}}>
              <span style={selectStyle}>
                <select className={dropdown} value='ssh'>
                    <option value='ssh'>SSH</option>
                  </select>
                </span>
            </div>*/}
          </div>
        </div>
      )
    }
})

export default About

    