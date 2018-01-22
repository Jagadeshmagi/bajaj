import React, { PropTypes } from 'react'
import {blueBtn,btnPrimary, selectStyle} from 'sharedStyles/styles.css'
import {Col, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger} from 'react-bootstrap'
import {addIntegrationModalHeader, modalCloseStyle, footerDivContainer, integrationModal, modalContainer} from './styles.css'
import {addIntegration,verifyPDconnection, verifyJiraConnection,
        updateIntegration, getIntegrationById,verifySlackConnection,verifyUserPasswordForServiceNow} from 'helpers/integration'
import {infoCircle,apiKey} from './styles.css'
import slackStep2 from 'assets/step2.jpg'
import slackStep3 from 'assets/step3.jpg'
import slackStep4 from 'assets/step4.png'
import slackStep5 from 'assets/step5.png'
import slackStep6 from 'assets/step6.png'
import slackStep7 from 'assets/step7.png'
import pagerStep2 from 'assets/pdStep2.jpg'
import pagerStep3 from 'assets/pdStep3.jpg'
import pagerStep4 from 'assets/pdStep4.jpg'
import pagerStep5 from 'assets/pdStep5.jpg'
import pagerStep6 from 'assets/pdStep6.jpg'
import pagerStep7 from 'assets/pdStep7.jpg'
import ReactDOM from 'react-dom';
import {findDOMNode} from 'react-dom'

const EditIntegration = React.createClass({
  getInitialState(){
    return{
      showIntegration:false,
      integrationsList:[],
      apiKey:'',
      integrationType:'pagerduty',
      apiIntegrationStatus:'',
      apiIntegrationDescription:'',
      selectedIntegrationType:"pagerduty",
      integrationData:{},
      toolTip1:'',
      toolTip2:'',
      toolTip3:'',
      toolTip4:'',
      toolTip5:'',
      toolTip6:'',
      toolTipSlack1:'',
      toolTipSlack2:'',
      toolTipSlack3:'',
      toolTipSlack4:'',
      toolTipSlack5:'',
      toolTipSlack6:'',

      }
  },
  componentDidMount(){

    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  },
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
},
handleClickOutside(event) {

if(event.target.id!='tooltipx')
{
 this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
 this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})

}

},

  openIntegrationModal(){
    //this.setState({showIntegration:true})
    let integrationId=this.props.selectedIntegrationIds;
    getIntegrationById(integrationId)
    .then((integrationResponseData)=>{
      this.setState({integrationData:integrationResponseData},function(){
        this.setState({selectedIntegrationType:this.state.integrationData.output.name,
          apiKey:this.state.integrationData.output.credentials.accesskey,
          username:this.state.integrationData.output.credentials.username?this.state.integrationData.output.credentials.username:'',
          password:this.state.integrationData.output.credentials.password?this.state.integrationData.output.credentials.password:'',
          url:this.state.integrationData.output.credentials.url?this.state.integrationData.output.credentials.url:'',
          hosturl:this.state.integrationData.output.credentials.host?this.state.integrationData.output.credentials.host:'',
          webhook:this.state.integrationData.output.credentials.webhook?this.state.integrationData.output.credentials.webhook:'',
          showIntegration:true})
      })
    })
    .catch((integrationResponseError)=>console.log("integrationResponseError "+integrationResponseError))
  },

  closeIntegration() {
    this.setState({showIntegration: false});
    for(let i =0 ; i< this.props.selectedIntegrationIds.length;i++){
         this.props.removeFromSelected(this.props.selectedIntegrationIds[i]);
         }
          this.props.refreshIntegrationsList();
  },

  hosturlChange(e){
    this.setState({hosturl:e.target.value})
  },
  urlChange(e){

     this.setState({url:e.target.value},function(){

     })
  },
  usernameChange(e){
    this.setState({username:e.target.value})
  },
  passwordChange(e){
    this.setState({password:e.target.value})
  },
  projectkeyChange(e){
    /*********************************************
        Project key is keeping saving in
        state variable apiKey For reusablity
        in other integration like(slack,pagerduty)
    ***********************************************/
    this.setState({apiKey:e.target.value})
  },
  handleAPIKeyChange(apiKey){
    if(this.state.selectedIntegrationType=='pagerduty')
    {
      this.setState({apiKey:apiKey.target.value})
    }
    if(this.state.selectedIntegrationType=='slack')
    {
      //this.setState({apiKey:apiKey.target.value})
      this.setState({webhook:apiKey.target.value})
    }
  },

//+++++++++++ Adding integration +++++++++++++++++++++
addThirdPartyIntegration(){
  let credentialObj = {};
  /*****

    JIRA Update Api calls goes below if condition
    @username : jira Username
    @password : jira Passqord
    @hosturl : Url for Login to jira
    @projectkey : key which jira should login
    #Date : 18/07/2017

  ****/
  if(this.state.selectedIntegrationType === 'jira'){
     // JIRA Api calls goes here!!!!
    var host = this.state.hosturl;
    host = host.replace(/\/$/, "");
    // JIRA Api calls goes here!!!!
    if (!host.match(/^[a-zA-Z]+:\/\//))
    {
      host = 'https://' + host;
    }
    var JiraApi_Request = {"username":this.state.username,"password":this.state.password,"key":this.state.apiKey,"host":host+"/"}
    var integration_request = {"username":this.state.username,"password":this.state.password,"accesskey":this.state.apiKey,"host":host}

    verifyJiraConnection(JiraApi_Request).then((Response)=>{
      //credentialObj["accesskey"]= this.state.apiKey;

      var statusCode = Response.data.statuscode;
      if(statusCode!=null && statusCode!=''){

        credentialObj["accesskey"]= this.state.apiKey;
        if(statusCode === 200){
          this.setState({ apiIntegrationStatus:'Active',
                          apiIntegrationDescription:'Integrated Successfully'},function(){
                          //+++++++++++ Success-->Add Integration API ++++++++++++++
                          updateIntegration(this.state.selectedIntegrationType, integration_request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                          })
                          .catch((addIntegrationError)=>{
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
        }
        else
        {
          this.setState({apiIntegrationStatus:'Offline',
                        apiIntegrationDescription:Response.data.output},function(){
                          //+++++++++++ Error flow-->Call Add API Integration API ++++++++++//
                          updateIntegration(this.state.selectedIntegrationType, integration_request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                        })
                          .catch((addIntegrationError)=>{
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
        }
      }
      else
      {
        this.setState({apiIntegrationStatus:'Offline',
                        apiIntegrationDescription:Response.data.output},function(){
                          //+++++++++++ Error flow-->Call Add API Integration API ++++++++++++//
                          updateIntegration(this.state.selectedIntegrationType, integration_request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                        })
                          .catch((addIntegrationError)=>{
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
      }
    })
  }
  else if(this.state.selectedIntegrationType === 'serviceNow'){
    let host= this.state.url;

        host = host.replace(/\/$/, "");
        if (!host.match(/^[a-zA-Z]+:\/\//))
          {

            host = 'https://' + host;
          }
    verifyUserPasswordForServiceNow(this.state.username,this.state.password,host)
          .then((verifyServiceNowConnectionStatus)=>{
            let statusCode = verifyServiceNowConnectionStatus.data.statuscode


              var ServiceNowApi_Request = {"username":this.state.username,"password":this.state.password,"url":host}


          //++++++++++++++++ Add Integration checkpoint ++++++++++++++++++++++++
          if(statusCode!=null && statusCode!='' && statusCode!=undefined){
            if(statusCode === 200){
              this.setState({apiIntegrationStatus:'Active',
                              apiIntegrationDescription:'Integrated Successfully'},function(){
                              //+++++++++++ Success-->Add Integration API ++++++++++++++
                              updateIntegration(this.state.selectedIntegrationType, ServiceNowApi_Request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                              .then((addIntegrationResponse)=>{
                                this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                                this.props.refreshIntegrationsList();
                              })
                              .catch((addIntegrationError)=>{
                                console.log("Error in addIntegration "+addIntegrationError)
                                this.props.refreshIntegrationsList();
                              })
                            })
            }
            else{
               this.setState({apiIntegrationStatus:'Offline',
                            apiIntegrationDescription:verifyServiceNowConnectionStatus.data.output},function(){
                              //+++++++++++ Error flow-->Call Add API Integration API
                              updateIntegration(this.state.selectedIntegrationType, ServiceNowApi_Request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                              .then((addIntegrationResponse)=>{
                                this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                                this.props.refreshIntegrationsList();
                            })
                              .catch((addIntegrationError)=>{
                                this.props.refreshIntegrationsList();
                                console.log("Error in addIntegration "+addIntegrationError)
                              })
                            })
            }
          }else if (statusCode===undefined){
               this.setState({apiIntegrationStatus:'Offline',
                              apiIntegrationDescription:verifyServiceNowConnectionStatus.data.output},function(){
                              //+++++++++++ Error flow-->Call Add API Integration Api
                              updateIntegration(this.state.selectedIntegrationType, ServiceNowApi_Request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                              .then((addIntegrationResponse)=>{
                                this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                                this.props.refreshIntegrationsList();
                            })
                              .catch((addIntegrationError)=>{
                                this.props.refreshIntegrationsList();
                                console.log("Error in addIntegration "+addIntegrationError)
                              })
                            })
          }
        })
        .catch((error) => console.log("Error in ServiceNow validation in container:" + error))
         //this.setState({showIntegration:false})

  }else if(this.state.selectedIntegrationType==='slack'){
    credentialObj["webhook"]= this.state.webhook;
    verifySlackConnection(this.state.webhook)
      .then((verifySlackConnectionStatus)=>{
        let statusCode = verifySlackConnectionStatus.data.response.statusCode

      //++++++++++++++++ Add Integration checkpoint ++++++++++++++++++++++++
      if(statusCode!=null && statusCode!='' && statusCode!=undefined){

        if(statusCode === 200){
          this.setState({apiIntegrationStatus:'Active',
                          apiIntegrationDescription:'Integrated Successfully'},function(){
                          //+++++++++++ Success-->Update Integration API ++++++++++++++
                          updateIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                          })
                          .catch((updateIntegrationError)=>{
                            console.log("Error in updateIntegration "+updateIntegrationError)
                          })
                        })
        }
        else{
           this.setState({apiIntegrationStatus:'Offline',
                        apiIntegrationDescription:'Invalid webhook url'},function(){
                          // +++++++++++ Error flow ++++++++++++++ //
                          updateIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                          })
                          .catch((updateIntegrationError)=>{
                            console.log("Error in updateIntegration "+updateIntegrationError)
                          })
                        })
        }
      }else if (statusCode===undefined){
           this.setState({apiIntegrationStatus:'Offline',
                          apiIntegrationDescription:'Invalid webhook url'},function(){
                         // +++++++++++ Error flow ++++++++++++++ //
                          updateIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                          })
                          .catch((updateIntegrationError)=>{
                            console.log("Error in updateIntegration "+updateIntegrationError)
                          })
                        })
      }
    })
    .catch((error) => console.log("Error in apiKeyValidation in container:" + error))
  }
  else if(this.state.selectedIntegrationType=='pagerduty'){
  //++++++++++++ Validating API Key for PagerDuty ++++++++++++++++++
  credentialObj["accesskey"]= this.state.apiKey;
  verifyPDconnection(this.state.apiKey, "trigger", "Welcome to Cavirin-Verifying Integration")
   .then((verifyPDconnectionStatus)=>{
      let statusCode = verifyPDconnectionStatus.data.response.statusCode
      //++++++++++++++++ Update Integration checkpoint ++++++++++++++++++++++++
      if(statusCode!=null && statusCode!=''){

        if(statusCode === 200){
          this.setState({ apiIntegrationStatus:'Active',
                          apiIntegrationDescription:'Integrated Successfully'},function(){
                          //+++++++++++ Success-->Update Integration ++++++++++++++
                          updateIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                          })
                          .catch((updateIntegrationError)=>{
                            console.log("Error in updateIntegration "+updateIntegrationError)
                          })
                        })
        }
        else if(statusCode === 400){
           this.setState({apiIntegrationStatus:'Offline',
                        apiIntegrationDescription:'Invalid API Key'},function(){
                          //+++++++++++ Error flow-->Call Update API Integration +++++++++++ //
                          updateIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((updateIntegrationResponse)=>{
                            this.props.removeFromSelected(this.props.selectedIntegrationIds[0]);
                            this.props.refreshIntegrationsList();
                        })
                          .catch((updateIntegrationError)=>{
                            console.log("Error in updateIntegration "+updateIntegrationError)
                          })
                        })
        }
      }
    })
    .catch((error) => console.log("Error in apiKeyValidation in container:" + error))
    //this.setState({showIntegration:false})
  }
},
showTooltip(id,e){
  //var id = 2;

  var tooltip = "toolTip"+id;
  var imgId = id+1;
  var image = "slackStep"+imgId;
   //this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
  if(id==1)
  {

    if(this.state.toolTip1=='')
    {

      this.setState({toolTip1:<div  role="tooltip" id="tooltipx"  className="fade in popover right" style={{display:"inline-table",left:"400px",top: "-34px"}}><div className="arrow" id="tooltipx"  ></div><div id="tooltipx"  className="popover-content"><img src={pagerStep2} id="tooltipx" ></img></div></div>})
      this.setState({toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
    else
    {
      this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }

  }
  else if(id==2)
  {
    if(this.state.toolTip2=='')
    {
      this.setState({[tooltip]:<div  role="tooltip" className="fade in popover right" style={{display:"inline-table",left:"400px"}}><div className="arrow" ></div><div className="popover-content"><img src={pagerStep3}></img></div></div>})
      this.setState({toolTip1:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
    else
    {
      this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
  }
  else if(id==3)
  {
    if(this.state.toolTip3=='')
    {
      this.setState({[tooltip]:<div  role="tooltip" className="fade in popover right" style={{display:"inline-table",left:"367px",top:"20px"}}><div className="arrow" ></div><div className="popover-content"><img src={pagerStep4}></img></div></div>})
      this.setState({toolTip1:'',toolTip2:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
    else
    {
      this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
  }
  else if(id==4)
  {
    if(this.state.toolTip4=='')
    {
      this.setState({[tooltip]:<div  role="tooltip" className="fade in popover right" style={{display:"inline-table",left:"400px",top: "51px"}}><div className="arrow" ></div><div className="popover-content"><img src={pagerStep5}></img></div></div>})
      this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip5:'',toolTip6:''})
    }
    else
    {
      this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
  }
  else if(id==5)
  {
    if(this.state.toolTip5=='')
    {
    this.setState({[tooltip]:<div  role="tooltip" className="fade in popover right" style={{display:"inline-table",left:"220px",top: "132px"}}><div className="arrow" ></div><div className="popover-content"><img src={pagerStep6}></img></div></div>})
    this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip6:''})
    }
    else
    {
      this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
  }
  else if(id==6)
  {
    if(this.state.toolTip6=='')
    {
    this.setState({[tooltip]:<div  role="tooltip" className="fade in popover right" style={{display:"inline-table",left:"250px",top: "158px"}}><div className="arrow" ></div><div className="popover-content"><img src={pagerStep7}></img></div></div>})
    this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:''})
    }
    else
    {
      this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
    }
  }
  else
  {
    this.setState({toolTip1:'',toolTip2:'',toolTip3:'',toolTip4:'',toolTip5:'',toolTip6:''})
  }

},
showtoolTipSlack(id,e){
  //var id = 2;

  var toolTipSlack = "toolTipSlack"+id;
  var imgId = id+1;
  var image = "slackStep"+imgId;
   //this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
  if(id==1)
  {

    if(this.state.toolTipSlack1=='')
    {

      this.setState({toolTipSlack1:<div  role="toolTipSlack" id="toolTipSlackx"  className="fade in popover right" style={{display:"inline-table",left:"329px",top: "-8px"}}><div className="arrow" id="toolTipSlackx"  ></div><div id="toolTipSlackx"  className="popover-content"><img src={slackStep2} id="toolTipSlackx" ></img></div></div>})
      this.setState({toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
    else
    {
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }

  }
  else if(id==2)
  {
    if(this.state.toolTipSlack2=='')
    {
      this.setState({[toolTipSlack]:<div  role="toolTipSlack" className="fade in popover right" style={{display:"inline-table",left:"408px",top: "-8px"}}><div className="arrow" ></div><div className="popover-content"><img src={slackStep3}></img></div></div>})
      this.setState({toolTipSlack1:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
    else
    {
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
  }
  else if(id==3)
  {
    if(this.state.toolTipSlack3=='')
    {
      this.setState({[toolTipSlack]:<div  role="toolTipSlack" className="fade in popover right" style={{display:"inline-table",left:"265px",top:"-18px"}}><div className="arrow" ></div><div className="popover-content"><img src={slackStep4}></img></div></div>})
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
    else
    {
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
  }
  else if(id==4)
  {
    if(this.state.toolTipSlack4=='')
    {
      this.setState({[toolTipSlack]:<div  role="toolTipSlack" className="fade in popover right" style={{display:"inline-table",left:"561px",top: "15px"}}><div className="arrow" ></div><div className="popover-content"><img src={slackStep5}></img></div></div>})
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack5:'',toolTipSlack6:''})
    }
    else
    {
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
  }
  else if(id==5)
  {
    if(this.state.toolTipSlack5=='')
    {
    this.setState({[toolTipSlack]:<div  role="toolTipSlack" className="fade in popover right" style={{display:"inline-table",left:"423px",top: "41px"}}><div className="arrow" ></div><div className="popover-content"><img src={slackStep6}></img></div></div>})
    this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack6:''})
    }
    else
    {
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
  }
  else if(id==6)
  {
    if(this.state.toolTipSlack6=='')
    {
    this.setState({[toolTipSlack]:<div  role="toolTipSlack" className="fade in popover right" style={{display:"inline-table",left:"342px",top: "117px"}}><div className="arrow" ></div><div className="popover-content"><img src={slackStep7}></img></div></div>})
    this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:''})
    }
    else
    {
      this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
    }
  }
  else
  {
    this.setState({toolTipSlack1:'',toolTipSlack2:'',toolTipSlack3:'',toolTipSlack4:'',toolTipSlack5:'',toolTipSlack6:''})
  }

},
  render() {
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:90,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}

    let doneButtonDisability;
    doneButtonDisability=!(this.state.selectedIntegrationType=="serviceNow"&&this.state.username!=""&&this.state.password!=""||
                          this.state.selectedIntegrationType=="pagerduty"&&this.state.apiKey!=''||
                          this.state.selectedIntegrationType=="slack"&&this.state.apiKey!=''||
                          this.state.selectedIntegrationType=="jira"&&this.state.username!=''&&this.state.password!=''
                          )


    const serviceUsernameHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a Username<br/>
       to enable ServiceNow integration
      </Popover>
    );

    const servicePasswordHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a Password<br/>
       to enable ServiceNow integration
      </Popover>
    );
     const serviceUrlHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a URL for ServiceNow

      </Popover>
    );

    const JiraUsernameHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a Username<br/>
       to enable Jira integration
      </Popover>
    );

    const JiraPasswordHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a Password<br/>
       to enable Jira integration
      </Popover>
    );

    const JiraurlHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a Jira URL<br/>
       to enable jira integration
      </Popover>
    );

    const JirakeyHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a Jira Project Key<br/>
       to enable Jira integration
      </Popover>
    );
      const SlackButtonHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a WebHookURL<br/>
       to enable Slack integration
      </Popover>
    );

    const PDButtonHover = (
        <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide a Integration Key<br/>
       to enable PagerDuty integration
      </Popover>
    );

    const tooltipOverlay = (
      <Popover style={{padding:0,width:308,display:'inline-table',
                      position:'absolute'}}>
        <img src={slackStep2}/>
      </Popover>)

    const tooltipOverlay2 = (
      <Popover style={{padding:0,width:308,display:'inline-table',
                      position:'absolute'}}>
        <img src={slackStep3}/>
      </Popover>)

     const tooltipOverlay3 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={slackStep4}/>
      </Popover>)

     const tooltipOverlay4 = (
      <Popover style={{padding:0,width:308,display:'inline-table',
                      position:'absolute'}}>
        <img src={slackStep5}/>
      </Popover>)

     const tooltipOverlay5 = (
      <Popover style={{padding:0,width:308,display:'inline-table',
                      position:'absolute'}}>
        <img src={slackStep6}/>
      </Popover>)

     const tooltipOverlay6 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={slackStep7}/>
      </Popover>)

     const pdStep2 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={pagerStep2}/>
      </Popover>)

     const pdStep3 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={pagerStep3}/>
      </Popover>)

     const pdStep4 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={pagerStep4}/>
      </Popover>)

     const pdStep5 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={pagerStep5}/>
      </Popover>)

     const pdStep6 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={pagerStep6}/>
      </Popover>)

     const pdStep7 = (
      <Popover style={{padding:0,display:'inline-table',
                      position:'absolute'}}>
        <img src={pagerStep7}/>
      </Popover>)
     var optionText = '';
     if(this.state.selectedIntegrationType=='slack'){optionText = "Slack";}
     else if(this.state.selectedIntegrationType=='pagerduty'){optionText = "PagerDuty";}
     else if(this.state.selectedIntegrationType=='serviceNow'){optionText = "ServiceNow";}
     else{optionText = "Jira";}

    return (
      <span className={modalContainer}>
        <a href='JavaScript: void(0)' onClick={this.openIntegrationModal}>
          Edit
        </a>
        <Modal show={this.state.showIntegration}
          onHide={this.closeIntegration}
          dialogClassName={integrationModal}
          keyboard={false}
          backdrop='static'>
          <Modal.Header style={{float:'middle'}} className={addIntegrationModalHeader} >
            <a style={{textDecoration:'none', top:8, right:20, color:'#4b58a4'}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeIntegration}>
              x
            </a>
            <Modal.Title id="contained-modal-title"
              style={{width:'100%',fontWeight:'bold',padding:0,
                    marginTop:20,textAlign:'left',marginLeft:'29px',
                    fontSize:'18px'}}>
              EDIT INTEGRATION
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{margin:'0px',padding:'0px', width:'100%',backgroundColor:'#F9FAFC'}}>
            <div>
              <div>
                <div className="row" id="integrationModal" style={{margin:'0px',width:'100%'}}>
                  <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" id="integrationDescription" style={{padding:'15px 0px 15px 15px',backgroundColor:'#FFF'}}>
                    <p style={{margin:'0px', paddingLeft:'15px'}}>
                      Pulsar can send alert(s) to wide variety of monitoring and conflict resolution tools.<br/>
                      Select the option below which best describes your case and we will guide you through the <br/>
                      required integration steps.
                    </p>
                    {/*<p>{this.state.selectedIntegrationType}</p>*/}
                    <div id="integrationTypeSelection" className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9" style={{paddingTop:'5px', paddingLeft:'10px'}}>
                      {/*<p style={{margin:'0px', paddingLeft:'15px'}}>Integration type</p>*/}
                      <select  disabled={true} className={selectStyle} id="integrationType"
                        defaultValue={this.state.selectedIntegrationType} style={{width:326,height:40,border:this.state.bordercolt,borderRadius:0, marginTop:'25px'}} componentClass="select" >
                        <option  value={this.state.selectedIntegrationType}>{optionText}</option>
                      </select>
                    </div>
                  </div>
                </div>
                  {this.state.selectedIntegrationType=="serviceNow"?
                    <div className='row' style={{"margin":0}}>
                    <p style={{"padding": "10px 35px 10px 35px","textAlign":"justify"}}>ServiceNow is a company that provides service management software as a service. It specializes in IT services management, IT operations management and IT business management.</p>
                    <div id="integrationTypeSelection" className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9" style={{"paddingLeft":"21px"}}>


                      <div className="form-group">

                        <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>Username</label>
                         <OverlayTrigger placement="right" overlay={serviceUsernameHover} ref="jiraWebhook" >
                          <input type="text" name="username" autoComplete="off" onChange={this.usernameChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="UserName" className="form-control"  value={this.state.username}/>
                        </OverlayTrigger>
                      </div>
                      <div className="form-group">
                        <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>Password</label>
                        <OverlayTrigger placement="right" overlay={servicePasswordHover} ref="jiraWebhook" >
                        <input type="password" name="password" autoComplete="new-password" onChange={this.passwordChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Password" className="form-control" value={this.state.password}/>
                        </OverlayTrigger>
                      </div>
                      <div className="form-group">
                        <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>ServiceNow Url</label>
                        <OverlayTrigger placement="right" overlay={serviceUrlHover} ref="jiraWebhook" >
                        <input type="text" name="hosturl" onChange={this.urlChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder='https://"Instance Name".service-now.com' className="form-control" value={this.state.url}/>
                        </OverlayTrigger>
                      </div>


                      </div>
                    </div>:''
                  }



                 {/***** JIRA INTEGRATION STARTED HERE ******/}
                  {this.state.selectedIntegrationType=="jira"?
                    <div className='row' style={{"margin":0}}>
                    <p style={{"padding": "10px 35px 10px 35px","textAlign":"justify"}}>JIRA is a proprietary issue tracking product, developed by Atlassian. It provides bug tracking, issue tracking, and project management functions.</p>
                    <div id="integrationTypeSelection" className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9" style={{"paddingLeft":"21px"}}>

                       <div className="form-group">
                        <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>JIRA Url</label>
                        <OverlayTrigger placement="right" overlay={JiraurlHover} ref="jiraWebhook" >
                        <input type="text" name="hosturl" onChange={this.hosturlChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder='https://"Company Name".atlassian.net' className="form-control" value={this.state.hosturl}/>
                        </OverlayTrigger>
                      </div>
                      <div className="form-group">

                        <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>Username</label>
                         <OverlayTrigger placement="right" overlay={JiraUsernameHover} ref="jiraWebhook" >
                          <input type="text" name="username" autoComplete="off" onChange={this.usernameChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="UserName" className="form-control"  value={this.state.username}/>
                        </OverlayTrigger>
                      </div>
                      <div className="form-group">
                        <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>Password</label>
                        <OverlayTrigger placement="right" overlay={JiraPasswordHover} ref="jiraWebhook" >
                        <input type="password" name="password" autoComplete="new-password" onChange={this.passwordChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Password" className="form-control" value={this.state.password}/>
                        </OverlayTrigger>
                      </div>

                      <div className="form-group">
                        <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>JIRA Project Key</label>
                        <OverlayTrigger placement="right" overlay={JirakeyHover} ref="jiraWebhook" >
                        <input type="text" name="projectkey"  onChange={this.projectkeyChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Add project key" className="form-control" value={this.state.apiKey}/>
                        </OverlayTrigger>
                      </div>
                      </div>
                    </div>:''
                  }
                {/***** JIRA INTEGRATION ENDS HERE ******/}
                {this.state.selectedIntegrationType==="pagerduty"?
                  <div id="integrationTypeDescriptionAndSteps">
                    <div id="pagerDescription" className='row'
                      style={{margin:'0px',width:'100%',paddingLeft:'15px', paddingBottom:'10px', backgroundColor:'#FFF'}}>
                      <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{paddingTop:'5px'}}>
                        <p style={{margin:'5px 0px 10px 0px', fontWeight:700}}>PAGERDUTY INTEGRATION</p>
                        <p style={{margin:'0px'}}>
                          PagerDuty is Event Intelligence, Response Orchestration, Incident resolution platform, helping IT <br/>
                          Operations and DevSecOps teams deliver alerting, on-call scheduling, compliance policies<br/>
                          escalations, incident tracking and resolution, performance, and uptime of your infrastructure
                        </p>
                      </div>
                    </div>
                    <div id="pagerSteps" className='row' style={{margin:'0px',width:'100%',backgroundColor:'#FFFFFF'}}>
                      <div className="col-lg-offset-1 col-lg-11 col-xs-11 col-md-11 col-sm-11"
                        style={{marginTop:'15px',marginBottom:'15px', paddingLeft:'25px', color:'#4C58A4'}}>
                      Directions:<br/>
                    </div>
                    <div className="col-lg-offset-1 col-lg-11 col-xs-11 col-md-11 col-sm-11" style={{paddingLeft:'40px', color:'#4C58A4'}}>
                <ol>
                  <li>Go to <a style={{textDecoration:'underline', fontStyle:'italic'}} href="https://www.pagerduty.com/" target='_blank'>PagerDuty</a> and log in to your account</li>
                  <li>From the Configuration menu, select Services.&nbsp;&nbsp;&nbsp;
                     <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showTooltip.bind(this,1)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTip1}
                  </li>
                  <li>On your Services page, click +Add New Service &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showTooltip.bind(this,2)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTip2}

                  </li>
                  <li>In General settings enter a Service Name &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showTooltip.bind(this,3)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTip3}
                  </li>
                  <li>Select Cavirin from the Integration Type menu &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showTooltip.bind(this,4)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTip4}
                  </li>
                  <li>Under Incident Settings, specify the Escalation Policy, Notification Urgency, and Incident Behavior for your new service &nbsp;&nbsp;&nbsp;
                  </li>
                  <li>Click Add Service &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showTooltip.bind(this,5)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTip5}
                  </li>
                  <li>Copy Integration Key &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showTooltip.bind(this,6)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTip6}
                  </li>
                  <li>Enter the service Integration Key below</li>
                </ol>
              </div>
                    <div className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9">
                      <FormGroup  style={{marginTop:'15px'}}controlId="apiKeyFormGroup">
                        <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12"
                          style={{fontWeight:500, color:'#4C58A4', padding:0}}>API Key: </ControlLabel>
                          <OverlayTrigger placement="right" overlay={PDButtonHover} ref="slackWebhook" trigger={this.state.slackOverlayTrigger}>
                            <input className={apiKey} id="apiKey" type="text" placeholder="Add Integration Key"
                              value={this.state.apiKey} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}}
                              onChange={this.handleAPIKeyChange}/>
                          </OverlayTrigger>
                      </FormGroup>
                    </div>
                  </div>
                </div>:''}
                {this.state.selectedIntegrationType==="slack"?
                  <div id="slackTypeDescriptionAndSteps">
                    <div id="slackDescription" className='row' style={{margin:'0px',width:'100%',paddingLeft:'20px', paddingBottom:'10px', backgroundColor:'#FFF'}}>
                      <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{paddingTop:'5px'}}>
                        <p style={{margin:'5px 0px 10px 0px', fontWeight:700}}>SLACK INTEGRATION</p>
                        <p style={{margin:'0px','wordWrap': 'break-word'}}>
                          Slack brings all your communication together in one place. It's real time messaging, archiving and <br/>
                          search for modern teams.
                        </p>
                      </div>
                    </div>
                    <div id="pagerSteps" className='row' style={{margin:'0px',width:'100%',backgroundColor:'#FFF'}}>
                      <div className="col-lg-offset-1 col-lg-11 col-xs-11 col-md-11 col-sm-11" style={{marginTop:'15px',marginBottom:'15px', paddingLeft:'25px', color:'#4C58A4'}}>
                        Directions:<br/>
                      </div>
                      <div className="col-lg-offset-1 col-lg-11 col-xs-11 col-md-11 col-sm-11" style={{paddingLeft:'40px', color:'#4C58A4'}}>
                <ol>
                  <li>Go to <a style={{textDecoration:'underline', fontStyle:'italic'}} href="https://slack.com/apps/A0F7XDUAZ-incoming-webhooks" target='_blank'>slack Incoming Webhooks</a></li>
                  <li>Click Sign in on the top right corner.&nbsp;&nbsp;&nbsp;
                   <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showtoolTipSlack.bind(this,1)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTipSlack1}
                  </li>
                  <li>Enter your team's Slack URL and click Continue.&nbsp;&nbsp;&nbsp;
                   <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showtoolTipSlack.bind(this,2)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTipSlack2}
                  </li>
                  <li>Click Add Configuration&nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showtoolTipSlack.bind(this,3)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTipSlack3}
                  </li>
                  <li>Choose a channel where your Incoming Webhook will post messages to &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showtoolTipSlack.bind(this,4)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTipSlack4}
                  </li>
                  <li>Click Add Incoming WebHooks integration button &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showtoolTipSlack.bind(this,5)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTipSlack5}
                  </li>
                  <li>Copy WebhookUrl and paste it below &nbsp;&nbsp;&nbsp;
                    <ControlLabel id="tooltipx" className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} data-toggle="tooltip" onClick={this.showtoolTipSlack.bind(this,6)}>
                        <i style={{paddingRight:'0.25em'}} id="tooltipx">i</i>
                      </ControlLabel>
                      {this.state.toolTipSlack6}
                  </li>
                </ol>
              </div>
                      <div className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9">
                        <FormGroup  style={{marginTop:'15px'}} controlId="apiKeyFormGroup">
                          <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{fontWeight:500,padding:'0px', color:'#4C58A4'}}>WebHookUrl: </ControlLabel>
                          <OverlayTrigger placement="right" overlay={SlackButtonHover} ref="slackWebhook" trigger={this.state.slackOverlayTrigger}>
                            <input className={apiKey} id="webhookurl" type="text" placeholder="Add WebHookUrl here"
                              style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}}
                              value={this.state.webhook} onChange={this.handleAPIKeyChange}/>
                          </OverlayTrigger>
                        </FormGroup>
                      </div>
                    </div>
                  </div>:
                '' }
               </div>
              </div>
              </Modal.Body>
              <Modal.Footer className={footerDivContainer} style={{paddingRight:40}}>
                <Button onClick={this.closeIntegration}
                  style={{backgroundColor:'#FFF',color:'#4C58A4',marginRight:10,borderRadius:0,paddingTop:'5px'}}>
                    Cancel
                </Button>
                <Button
                  bsStyle='primary'
                  className={btnPrimary} style={{borderRadius: 0}}
                  //style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 15px',color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}}
                  disabled={doneButtonDisability}
                  onClick={this.addThirdPartyIntegration}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
       </span>
        )
      },
    }
  )

export default EditIntegration
