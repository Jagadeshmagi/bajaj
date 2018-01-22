import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn,btnPrimary, selectStyle} from 'sharedStyles/styles.css'
import {Col, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger} from 'react-bootstrap'
import {addIntegrationModalHeader, modalCloseStyle, footerDivContainer, integrationModal, modalContainer} from './styles.css'
import {verifyPDconnection, addIntegration, getAllIntegrations,verifyUserPasswordForServiceNow} from 'helpers/integration'
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
import ReactTooltip from 'react-tooltip';

const IntegrationTypes = React.createClass({
  getInitialState(){
    return{
      showIntegration:false,
      slackOverlayTrigger:this.props.slackOverlayTrigger,
      integrationsList:[],
      apiKey:'',
      integrationType:'pagerduty',
      apiIntegrationStatus:'',
      apiIntegrationDescription:'',
      loadingDiv:true,
      selectedIntegrationType:"pagerduty",
      seruserTrigger:false,
      serpassTrigger:false,
      serUrlTrigger:false,
      serviceusernameValue:'',
      servicePasswordValue:'',
      serviceUrlValue:'',
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


    //  serviceDescValue:'',
     // servicecommentValue:'',

      }
  },
  componentDidMount(){
     document.addEventListener('click', this.handleClickOutside.bind(this), true);
     //get count of integrations
     getAllIntegrations()
      .then(
      (integrations) =>  {
        this.setState({integrationsList:integrations,
          loadingDiv:false},function(){
            //alert(this.props.pdIntegrated)
          });
      }
     )
    .catch((error) => console.log("Error in getCredentialsList in container:" + error))

  },

  componentWillReceiveProps(nextProps,nextState){
    this.setState({slackOverlayTrigger:nextProps.slackOverlayTrigger})
    //alert(nextProps.pdIntegrated)
    if(nextProps.pdIntegrated != this.state.pdIntegrated){
      this.setState({pdIntegrated:nextProps.pdIntegrated})
    }
    if(nextProps.serviceNowInegrated != this.state.serviceNowInegrated){
      this.setState({serviceNowInegrated:nextProps.serviceNowInegrated})
       }
    if(nextProps.jiraIntegrated != this.state.jiraIntegrated){
      this.setState({jiraIntegrated:nextProps.jiraIntegrated})
    }
  },

  openIntegrationModal(){
    this.setState({showIntegration:true})
  },

  closeIntegration() {
    this.setState({showIntegration: false});
  },

  selectIntegrationTypeChange(integrationType){
    this.setState({selectedIntegrationType:integrationType.target.value})
  },

  showOverlay(){
    this.refs.slackWebhook.show();
  },

  hideOverlay(){
    this.refs.slackWebhook.hide();
  },
 /* validateUserPassForService(){
    if(this.state.serviceusernameValue!=""&&this.state.servicePasswordValue!=""){
      verifyUserPasswordForServiceNow(this.state.serviceusernameValue,this.state.servicePasswordValue)
      .then((res)=>{
        if(res.output==200){
          alert("200")
         this.props.serviceusernameSet(e.target.value);
         this.props.servicepasswordSet(e.target.value);
        }
        if(res.output==401){
          this.setState({seruserTrigger:['hover','focus']})
        this.refs.serviceUser.show();
        this.setState({serpassTrigger:['hover','focus']})
        this.refs.servicepass.show();
        alert("401")

        }



      })
      .catch((error)=>{
        this.setState({seruserTrigger:['hover','focus']})
        this.refs.serviceUser.show();
        this.setState({serpassTrigger:['hover','focus']})
        this.refs.servicepass.show();
          alert("fail")



      })
    }

  },*/
  serviceusername(e){

    if(e.target.value==""){
      this.setState({seruserTrigger:['hover','focus']})
      ReactTooltip.show(findDOMNode(this.refs.uname))
    }else{
      ReactTooltip.hide(findDOMNode(this.refs.uname))

      this.setState({seruserTrigger:'manual'})
    }
    this.setState({serviceusernameValue:e.target.value},()=>{
      //this.validateUserPassForService();
    })
    this.props.serviceusernameSet(e.target.value);

  },
  servicepassword(e){
     if(e.target.value==""){
      this.setState({serpassTrigger:['hover','focus']})
       ReactTooltip.show(findDOMNode(this.refs.pwd))
    }else{
     ReactTooltip.hide(findDOMNode(this.refs.pwd))

      this.setState({serpassTrigger:'manual'})
    }
    this.setState({servicePasswordValue:e.target.value},()=>{
       //this.validateUserPassForService();
    })
    this.props.servicepasswordSet(e.target.value);


  },
  urlChange(e){

    if(e.target.value==""){

      this.setState({serUrlTrigger:false})
      ReactTooltip.show(findDOMNode(this.refs.url))

    }else{
      ReactTooltip.hide(findDOMNode(this.refs.url))

      this.setState({serUrlTrigger:true})
    }
    this.setState({serviceUrlValue:e.target.value},()=>{
       //this.validateUserPassForService();
    })
    this.props.serviceUrlSet(e.target.value);

  },
 /* servicedescription(e){
    if(e.target.value==""){
      this.setState({serdescTrigger:['hover','focus']})
      this.refs.serviceDesc.show();
    }else{
      this.refs.serviceDesc.hide();

      this.setState({serdescTrigger:'manual'})
    }
    this.setState({serviceDescValue:e.target.value})
    this.props.servicedescSet(e.target.value);

  },
  servicecomment(e){
    if(e.target.value==""){
      this.setState({sercommTrigger:['hover','focus']})
      this.refs.servicecomm.show();
    }else{
      this.refs.servicecomm.hide();

      this.setState({sercommTrigger:'manual'})
    }
    this.setState({servicecommentValue:e.target.value})
    this.props.servicecommentSet(e.target.value);

  },*/

// componentDidMount() {
//     document.addEventListener('click', this.handleClickOutside.bind(this), true);
// },

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
//+++++++++++ Adding integration +++++++++++++++++++++
addThirdPartyIntegration(){
  console.log("addThirdPartyIntegration called")
   let credentialObj = {};
  //++++++++++++ Validating API Key ++++++++++++++++++
  verifyPDconnection(this.state.apiKey, "trigger", "Welcome to Cavirin-Verifying Integration")
   .then((verifyPDconnectionStatus)=>{
      /*console.log("verify pd connection status "+JSON.stringify(verifyPDconnectionStatus))
      console.log("status code for pd verifyPDconnection "+verifyPDconnectionStatus.data.response.statusCode)
      console.log("api key inside "+verifyPDconnectionStatus.data.response.body.errors)*/
      let statusCode = verifyPDconnectionStatus.data.response.statusCode

      //++++++++++++++++ Add Integration checkpoint ++++++++++++++++++++++++
      if(statusCode!=null && statusCode!=''){
        //credentialObj={"credential": {"accesskey":this.state.apiKey}}
         credentialObj["accesskey"]= this.state.apiKey;
        if(statusCode === 200){
          this.setState({ apiIntegrationStatus:'Active',
                          apiIntegrationDescription:'Integrated Successfully'},function(){
                          //+++++++++++ Success-->Add Integration API ++++++++++++++
                          addIntegration(this.state.integrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            console.log("Integration response "+JSON.stringify(addIntegrationResponse))
                            this.props.refreshIntegrationsList();
                          })
                          .catch((addIntegrationError)=>{
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
        }
        else if(statusCode === 400){
          console.log("credentialObj in 400 "+credentialObj+" errors capturing "+verifyPDconnectionStatus.data.response.body.errors)
           this.setState({apiIntegrationStatus:'Offline',
                        apiIntegrationDescription:verifyPDconnectionStatus.data.response.body.errors},function(){
                          //+++++++++++ Error flow-->Call Add API Integration API
                          console.log("Error integration")
                          addIntegration(this.state.integrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            console.log("Integration response "+JSON.stringify(addIntegrationResponse))
                            this.props.refreshIntegrationsList();
                        })
                          .catch((addIntegrationError)=>{
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
        }
      }
    })
    .catch((error) => console.log("Error in apiKeyValidation in container:" + error))
    this.setState({showIntegration:false})
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
MouseOutDisable(ref,e){
    ReactTooltip.hide()
},
DisableTooltip(ref,e){

  if(e.target.value=='')
  {

    ReactTooltip.show(findDOMNode(ref))
  }
  else
  {
   // alert("hai")
    ReactTooltip.hide()
  }

},
  render() {
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:90,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}

    let posstyle = {  position: 'relative', top:40, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto' }

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

     const serviceNowUsername = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
      Provide user name to login to ServiceNow
      </Popover>)

      const serviceNowPassword = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide password to login to ServiceNow
      </Popover>)



      const servicenowurlHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
       Provide URL for ServiceNow
      </Popover>
    );


    let addIntbutStyle = {borderRadius: 0, marginTop: 20,
                        marginBottom: 20,width:'300px'}
    let wrapperAddInt = {position:'absolute', top:-124, right:20}

    let oTrigger = ['hover','focus']
    // if(this.state.slackOverlayTrigger)
    // {
    //   ReactTooltip.hide();
    // }

    if(this.props.totalIntegrationsCount>0)
      {
        addIntbutStyle.backgroundColor='#fff',
        addIntbutStyle.color='#4C58A4',
        oTrigger = 'manual',
        addIntbutStyle.width='150px'
      }
    else{
      wrapperAddInt.position='static',
      wrapperAddInt.top = 0,
      wrapperAddInt.right = 0,
      wrapperAddInt.ponterEvents = 'none'
    }
    return (
        <div>
        {/***** JIRA INTEGRATION STARTED HERE ******/}
        {this.props.selectedIntegrationType=="jira"?
         <div>
        {!this.props.jiraIntegrated?
          <div className='row' style={{"margin":0}}>
          <p style={{"padding": "10px 35px 10px 35px","textAlign":"justify"}}>JIRA is a proprietary issue tracking product, developed by Atlassian. It provides bug tracking, issue tracking, and project management functions.</p>
          <div id="integrationTypeSelection" className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9" style={{"paddingLeft":"21px"}}>

             <div className="form-group">
              <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>JIRA Url</label>

              <input ref='hosturljira' data-for='hosturljira' data-tip="<div class='arrow'></div>Provide a Jira URL to enable jira integration" type="text" name="hosturl" onChange={this.props.hosturlChange} onMouseOver={this.DisableTooltip.bind(this,this.refs.hosturljira)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.hosturljira)}style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder='https://"Company Name".atlassian.net' className="form-control" />

              <ReactTooltip id="hosturljira" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right"   event="focus"/>

            </div>
            <div className="form-group">

              <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>Username</label>

                <input ref='unamejira' data-for='unamejira' type="text" data-tip="<div class='arrow'></div>Provide a Jira Username to enable jira integration" name="username" autoComplete="off" onChange={this.props.usernameChange} onMouseOver={this.DisableTooltip.bind(this,this.refs.unamejira)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.unamejira)} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="UserName" className="form-control" />

              <ReactTooltip id="unamejira" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right"   event="focus"/>

            </div>
            <div className="form-group">
              <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>Password</label>

              <input ref='pwdjira' data-for='pwdjira' data-tip="<div class='arrow'></div>Provide a Jira password to enable jira integration" type="password" name="password" autoComplete="new-password" onChange={this.props.passwordChange} onMouseOver={this.DisableTooltip.bind(this,this.refs.pwdjira)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.pwdjira)} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Password" className="form-control" />

               <ReactTooltip id="pwdjira" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right"   event="focus"/>

            </div>

            <div className="form-group">
              <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>JIRA Project Key</label>

              <input ref='pkeyjira' data-for='pkeyjira' data-tip="<div class='arrow'></div>Provide a Jira Project key to enable jira integration" onMouseOver={this.DisableTooltip.bind(this,this.refs.pkeyjira)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.pkeyjira)}  type="text" name="projectkey"  onChange={this.props.projectkeyChange} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Add project key" className="form-control" />

               <ReactTooltip id="pkeyjira" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right"   event="focus"/>

            </div>
            </div>
                   </div>:
          <div className="row" id="integrationModal"
            style={{margin:'0px',width:'100%'}}>
              <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" id="integrationDescription" style={{padding:'15px 0px 15px 15px',backgroundColor:'#F9FAFC'}}>
                <p style={{margin:'0px', paddingLeft:'15px'}}>
                  Maximum number of integrations for Jira exceeded.
                </p>
              </div>
          </div>
        }
          </div>
          :''
        }
      {/***** JIRA INTEGRATION ENDS HERE ******/}




      {this.props.selectedIntegrationType=="serviceNow"?
          <div>
          {!this.props.serviceNowInegrated?
           <div className='row' style={{"margin":0}}>
            <p style={{"padding": "10px 35px 10px 35px","textAlign":"justify"}}>ServiceNow is a company that provides service management software as a service. It specializes in IT services management, IT operations management and IT business management.</p>
            <div id="integrationTypeSelection" className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9" style={{"paddingLeft":"21px"}}>

               <div className="form-group">
                <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>User Name</label>


                  <input ref='uname' data-for='uname' data-tip="<div class='arrow'></div>Provide username to login to ServiceNow" type="text" name="serusername" onChange={this.serviceusername} onMouseOver={this.DisableTooltip.bind(this,this.refs.uname)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.uname)} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Provide User Name" className="form-control" />
                  <ReactTooltip id="uname" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right"   event="focus"/>

              </div>

              <div className="form-group">
                <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>Password</label>
                <input ref='pwd'  data-for='password' data-tip="<div class='arrow'></div>Provide password to login to ServiceNow" type="password" name="serpassword" autoComplete="off" onChange={this.servicepassword} onMouseOver={this.DisableTooltip.bind(this,this.refs.pwd)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.pwd)}style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Password" className="form-control" />

                 <ReactTooltip id="password" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right" event="focus"/>
              </div>

              <div className="form-group">
                <label style={{"fontWeight": "500","color": "rgb(76, 88, 164)"}}>ServiceNow Url</label>

                <input ref='url'  data-for='url'  data-tip="<div class='arrow'></div>Provide URL for ServiceNow" type="text" name="hosturl" onChange={this.urlChange} onMouseOver={this.DisableTooltip.bind(this,this.refs.url)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.url)} style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder='https://"Instance Name".service-now.com' className="form-control" />

                <ReactTooltip id="url" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right" event="focus"/>

             </div>

              </div>
            </div>

        :
          <div className="row" id="integrationModal"
            style={{margin:'0px',width:'100%'}}>
              <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" id="integrationDescription" style={{padding:'15px 0px 15px 15px',backgroundColor:'#F9FAFC'}}>
                <p style={{margin:'0px', paddingLeft:'15px'}}>
                  Maximum number of integrations for ServiceNow exceeded.
                </p>
              </div>
          </div>
        }
          </div>
          :''
        }




         {this.props.selectedIntegrationType=="pagerduty"?
          <div>
          {!this.props.pdIntegrated?
          <div id="integrationTypeDescriptionAndSteps">

             <div id="pagerDescription" className='row'
              style={{margin:'0px',width:'100%',paddingLeft:'35px', paddingBottom:'10px', backgroundColor:'#FFF'}}>
              <div className="col-lg-offset-4 col-lg-8 col-xs-8 col-md-8 col-sm-8" style={{paddingTop:'5px'}}>
               <p style={{margin:'5px 0px 10px 0px', fontWeight:700}}>PAGERDUTY INTEGRATION</p>
              </div>
              <p style={{margin:'0px'}}>
                PagerDuty is Event Intelligence, Response Orchestration, Incident resolution platform, helping IT <br/>
                Operations and DevSecOps teams deliver alerting, on-call scheduling, compliance policies<br/>
                escalations, incident tracking and resolution, performance, and uptime of your infrastructure
              </p>
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

                      <input ref="apikey" data-for='apiKey' className={apiKey} id="apiKey" type="text" placeholder="Add Integration Key"
                        style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}}
                        onChange={this.props.handleAPIKeyChange}
                        onMouseOver={this.DisableTooltip.bind(this,this.refs.apikey)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.apikey)}
                        data-tip="<div class='arrow'></div>Provide a Integration Key to enable PagerDuty integration"/>

                </FormGroup>
                  <ReactTooltip id="apiKey" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right" event="focus"/>
              </div>
            </div>
          </div>
        :
          <div className="row" id="integrationModal"
            style={{margin:'0px',width:'100%'}}>
              <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" id="integrationDescription" style={{padding:'15px 0px 15px 15px',backgroundColor:'#FFF'}}>
                <p style={{margin:'0px', paddingLeft:'15px'}}>
                  Maximum number of integrations for PagerDuty exceeded.
                </p>
              </div>
          </div>
        }
          </div>:''
        }
        {this.props.selectedIntegrationType=="slack"?
          <div>
          {!this.props.slackIntegrated?
          <div id="slackTypeDescriptionAndSteps">
            <div id="slackDescription" className='row' style={{margin:'0px',width:'100%',paddingLeft:'35px', paddingBottom:'10px', backgroundColor:'#FFF'}}>
              <div className="col-lg-offset-4 col-lg-8 col-xs-8 col-md-8 col-sm-8" style={{paddingTop:'5px'}}>
               <p style={{margin:'5px 0px 10px 0px', fontWeight:700}}>SLACK INTEGRATION</p>
              </div>
              <p style={{margin:'0px','wordWrap': 'break-word', paddingLeft:'10px'}}>
                Slack brings all your communication together in one place. It's real time messaging, archiving and <br/>
                search for modern teams.
              </p>
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



                    <input ref="apiKey" data-for="apiKey" className={apiKey} id="webhookurl" type="text" placeholder="Add WebHookUrl here"
                      style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:'1px solid #4C58A4',borderRadius:0}}
                      onChange={this.props.handleAPIKeyChange}
                        onMouseOver={this.DisableTooltip.bind(this,this.refs.apiKey)} onMouseLeave={this.MouseOutDisable.bind(this,this.refs.apiKey)}
                        data-tip="<div class='arrow'></div>Provide a WebHookURL Slack integration"/>


                </FormGroup>
                <ReactTooltip id="apiKey" place="right" type="light" effect="solid" html={true}  className="custom_tooltip_input popover right" event="focus"/>
              </div>
            </div>
          </div>
        :
          <div className="row" id="integrationModal"
            style={{margin:'0px',width:'100%'}}>
              <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" id="integrationDescription" style={{padding:'15px 0px 15px 15px',backgroundColor:'#F9FAFC'}}>
                <p style={{margin:'0px', paddingLeft:'15px'}}>
                  Maximum number of integrations for Slack exceeded.
                </p>
              </div>
          </div>
        }
          </div>
          :''
        }
        </div>
        )
      },
    }
  )

export default IntegrationTypes
