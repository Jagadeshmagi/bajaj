import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn,btnPrimary, selectStyle} from 'sharedStyles/styles.css'
import {Col, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger} from 'react-bootstrap'
import {addIntegrationModalHeader, modalCloseStyle, footerDivContainer, integrationModal, modalContainer} from './styles.css'
import {verifyPDconnection, addIntegration, getAllIntegrations,
        verifySlackConnection, verifyJiraConnection,verifyUserPasswordForServiceNow} from 'helpers/integration'
import {IntegrationTypes} from 'containers'
import {infoCircle} from './styles.css'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip';
import Select from 'react-select'

const AddIntegration = React.createClass({
  getInitialState(){
    return{
      showIntegration:false,
      integrationsList:[],
      apiKey:'',
      integrationType:'pagerduty',
      apiIntegrationStatus:'',
      apiIntegrationDescription:'',
      loadingDiv:true,
      selectedIntegrationType:"pagerduty",
      slackOverlayTrigger:['hover','focus'],
      username:'',
      password:'',
      hosturl:'',
      projectkey:'',
      serviceusernameValue:'',
      servicePasswordValue:'',
      serviceDescValue:'',
      servicecommentValue:'',
      serviceUrlValue:'',
      integrationValues:[
        {label:'PagerDuty', value:'pagerduty'},
        {label:'Slack', value:'slack'},
        {label:'JIRA', value:'jira'},
        {label:'ServiceNow', value:'serviceNow'},
      ]


      }
  },
  componentDidMount(){

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
    this.setState({showIntegration: false,
                  integrationsList:[],
                  apiKey:'',
                  apiIntegrationStatus:'',
                  apiIntegrationDescription:'',
                  loadingDiv:true,
                  slackOverlayTrigger:['hover','focus'],
                  selectedIntegrationType:"pagerduty"});
  },

  selectIntegrationTypeChange(integrationType){
    this.setState({selectedIntegrationType:integrationType,
                    apiKey:'',
                    username:'',
                    password:'',
                    hosturl:'',
                    projectkey:'',
                    serviceusernameValue:'',
                    servicePasswordValue:'',
                    serviceDescValue:'',
                    servicecommentValue:''})
  },
  serviceusernameSet(username){
    this.setState({serviceusernameValue:username})

  },
  servicepasswordSet(pass){
    this.setState({servicePasswordValue:pass})

  },
  servicedescSet(desc){
    this.setState({serviceDescValue:desc})

  },
  servicecommentSet(comm){
    this.setState({servicecommentValue:comm})

  },
  serviceUrlSet(url){
    this.setState({serviceUrlValue:url})
  },


  hosturlChange(e){
    
    this.setState({hosturl:e.target.value})
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

    if(apiKey.target.value==""){
      this.setState({slackOverlayTrigger:['hover','focus']})
      ReactTooltip.show(findDOMNode(this.refs.apiKey))
      ReactTooltip.show(findDOMNode(this.refs.apiKey2))
      //this.refs.child.showOverlay();
    }else{
      //this.refs.child.hideOverlay();
      ReactTooltip.hide()
      this.setState({slackOverlayTrigger:'manual'})
    }
    this.setState({apiKey:apiKey.target.value})
  },

//+++++++++++ Adding integration +++++++++++++++++++++
addThirdPartyIntegration(){
  console.log("addThirdPartyIntegration called")
  let credentialObj = {};
  /*****

    JIRA Api calls goes below if condition
    @username : jira Username
    @password : jira Passqord
    @hosturl : Url for Login to jira
    @projectkey : key which jira should login
    #Date : 17/07/2017

  ****/
  if(this.state.selectedIntegrationType === 'jira'){
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
                          addIntegration(this.state.selectedIntegrationType, integration_request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            console.log("Integration response "+JSON.stringify(addIntegrationResponse))
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
                          //+++++++++++ Error flow-->Call Add API Integration API
                          console.log("Error integration")
                          addIntegration(this.state.selectedIntegrationType, integration_request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
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
      else
      {
        this.setState({apiIntegrationStatus:'Offline',
                        apiIntegrationDescription:Response.data.output},function(){
                          //+++++++++++ Error flow-->Call Add API Integration API
                          console.log("Error integration")
                          addIntegration(this.state.selectedIntegrationType, integration_request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            console.log("Integration response "+JSON.stringify(addIntegrationResponse))
                            this.props.refreshIntegrationsList();
                        })
                          .catch((addIntegrationError)=>{
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
      }
      console.log("JIRA RESP"+Response.data.response.statusCode);
    })
    //.catch((error) => alert("Something went Wrong"))
  }
  else if(this.state.selectedIntegrationType === 'pagerduty'){

  //++++++++++++ Validating API Key ++++++++++++++++++
  verifyPDconnection(this.state.apiKey, "trigger", "Welcome to Cavirin-Verifying Integration")
   .then((verifyPDconnectionStatus)=>{
      let statusCode = verifyPDconnectionStatus.data.response.statusCode

      //++++++++++++++++ Add Integration checkpoint ++++++++++++++++++++++++
      if(statusCode!=null && statusCode!=''){
         credentialObj["accesskey"]= this.state.apiKey;
        if(statusCode === 200){
          this.setState({ apiIntegrationStatus:'Active',
                          apiIntegrationDescription:'Integrated Successfully'},function(){
                          //+++++++++++ Success-->Add Integration API ++++++++++++++
                          addIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.refreshIntegrationsList();
                          })
                          .catch((addIntegrationError)=>{
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
        }
        else if(statusCode === 400){
           this.setState({apiIntegrationStatus:'Offline',
                        apiIntegrationDescription:'Invalid API Key'},function(){
                          // +++++++++++ Error flow ++++++++++++++++++ //
                          addIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
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
    }
    else if(this.state.selectedIntegrationType === "slack")
    {
      verifySlackConnection(this.state.apiKey)
      .then((verifySlackConnectionStatus)=>{
        let statusCode = verifySlackConnectionStatus.data.response.statusCode
      //++++++++++++++++ Add Integration checkpoint ++++++++++++++++++++++++
      if(statusCode!=null && statusCode!='' && statusCode!=undefined){
         credentialObj["webhook"]= this.state.apiKey;
        if(statusCode === 200){
          this.setState({apiIntegrationStatus:'Active',
                          apiIntegrationDescription:'Integrated Successfully'},function(){
                          //+++++++++++ Success-->Add Integration API ++++++++++++++
                          addIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
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
                        apiIntegrationDescription:'Invalid webhook url'},function(){
                          //+++++++++++ Error flow ++++++++++ //
                          addIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
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
                          apiIntegrationDescription:'Invalid webhook url'},function(){
                          //+++++++++++ Error flow-->Call Add API Integration Api
                          addIntegration(this.state.selectedIntegrationType, credentialObj, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                          .then((addIntegrationResponse)=>{
                            this.props.refreshIntegrationsList();
                        })
                          .catch((addIntegrationError)=>{
                            this.props.refreshIntegrationsList();
                            console.log("Error in addIntegration "+addIntegrationError)
                          })
                        })
      }
    })
    .catch((error) => console.log("Error in apiKeyValidation in container:" + error))
    }
    else if(this.state.selectedIntegrationType === "serviceNow") {
     /* var ServiceNowApi_Request = {"username":this.state.serviceusernameValue,"password":this.state.servicePasswordValue}
        this.setState({apiIntegrationStatus:'Active',
                              apiIntegrationDescription:'Integrated Successfully'},function(){
                              //+++++++++++ Success-->Add Integration API ++++++++++++++
                              addIntegration(this.state.selectedIntegrationType, ServiceNowApi_Request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                              .then((addIntegrationResponse)=>{
                                console.log("Integration response "+JSON.stringify(addIntegrationResponse))
                                this.props.refreshIntegrationsList();
                              })
                              .catch((addIntegrationError)=>{
                                console.log("Error in addIntegration "+addIntegrationError)
                                this.props.refreshIntegrationsList();
                              })
                            })*/
        let host= this.state.serviceUrlValue;
              host = host.replace(/\/$/, "");
              if (!host.match(/^[a-zA-Z]+:\/\//))
                {

                  host = 'https://' + host;
                }

        verifyUserPasswordForServiceNow(this.state.serviceusernameValue,this.state.servicePasswordValue,host)
          .then((verifyServiceNowConnectionStatus)=>{

            let statusCode = verifyServiceNowConnectionStatus.data.statuscode

             var ServiceNowApi_Request = {"username":this.state.serviceusernameValue,"password":this.state.servicePasswordValue,"url":host}
          //++++++++++++++++ Add Integration checkpoint ++++++++++++++++++++++++
          if(statusCode!=null && statusCode!='' && statusCode!=undefined){

            if(statusCode === 200){
              this.setState({apiIntegrationStatus:'Active',
                              apiIntegrationDescription:'Integrated Successfully'},function(){
                              //+++++++++++ Success-->Add Integration API ++++++++++++++
                              addIntegration(this.state.selectedIntegrationType, ServiceNowApi_Request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                              .then((addIntegrationResponse)=>{
                                console.log("Integration response "+JSON.stringify(addIntegrationResponse))
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
                              console.log("Error integration")
                              addIntegration(this.state.selectedIntegrationType, ServiceNowApi_Request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                              .then((addIntegrationResponse)=>{
                                console.log("Integration response "+JSON.stringify(addIntegrationResponse))
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
                              addIntegration(this.state.selectedIntegrationType, ServiceNowApi_Request, this.state.apiIntegrationStatus, this.state.apiIntegrationDescription)
                              .then((addIntegrationResponse)=>{
                                console.log("Integration response "+JSON.stringify(addIntegrationResponse))
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


    }
    this.setState({showIntegration:false})
},

  render() {
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:120,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}
    let posstyle = {  position: 'relative', top:40, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto' }

    const IntegrationButtonHover = (
      <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverIntegration'>
        By adding integration<br/>
        you will allow us to<br/>
        integrate with 3-rd party applications<br/>
      </Popover>
    );

    let doneButtonDisability;
    doneButtonDisability=!(this.state.selectedIntegrationType=="serviceNow"&&this.state.serviceusernameValue!=""&&this.state.servicePasswordValue!=""||
                          this.state.selectedIntegrationType=="pagerduty"&&this.state.apiKey!=''||
                          this.state.selectedIntegrationType=="slack"&&this.state.apiKey!=''||
                          this.state.selectedIntegrationType=="jira"&&this.state.username!=''&&this.state.password!=''
                          )

    /*if(this.state.apiKey!=null&&this.state.apiKey!='')
      doneButtonDisability=false
    else
      doneButtonDisability=true*/

    let addIntbutStyle = {borderRadius: 0, marginTop: 20,
                        marginBottom: 20,width:'300px'}
    let wrapperAddInt = {position:'absolute', top:-115, right:30}

    let oTrigger = ['hover','focus']
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
      <span style={wrapperAddInt}>
        <OverlayTrigger placement="right" trigger={oTrigger} overlay={IntegrationButtonHover}>
          <Button href='JavaScript: void(0)' onClick={this.openIntegrationModal}
            bsStyle='primary' bsSize='large' className={btnPrimary}
            style={addIntbutStyle}>
              Add Integration
          </Button>
        </OverlayTrigger>
            <Modal show={this.state.showIntegration}
                   onHide={this.closeIntegration}
                   dialogClassName={integrationModal}
                   keyboard={false}
                   backdrop='static'>
              <Modal.Header style={{float:'middle'}} className={addIntegrationModalHeader} >
                <a style={{textDecoration:'none', top:8, right:37, color:'#4b58a4'}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeIntegration}>
                  x
                </a>
                <Modal.Title id="contained-modal-title"
                  style={{width:'100%',fontWeight:'bold',padding:0,
                        marginTop:20,textAlign:'left',marginLeft:'29px',
                        fontSize:'18px'}}>
                  ADD INTEGRATION
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{margin:'0px',padding:'0px', width:'100%',backgroundColor:'#FFF'}}>
                <div>
                  <div className="row" id="integrationModal" style={{margin:'0px',width:'100%'}}>
                    <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" id="integrationDescription" style={{padding:'15px 0px 15px 15px'}}>
                      <p style={{margin:'0px', paddingLeft:'15px', marginBottom:'10px'}}>
                        Cavirin can send alert(s) and notification(s) to a wide variety of monitoring and conflict resolution tools.<br/>
                      Select the option below that best describes your case, and we will guide you through the <br/>
                        integration steps.
                      </p>
                      <div id="integrationTypeSelection" className="col-lg-offset-3 col-lg-9 col-xs-9 col-md-9 col-sm-9" style={{paddingTop:'5px', paddingLeft:'10px'}}>
                        <p style={{margin:'0px', "fontWeight": "500","color": "rgb(76, 88, 164)", marginBottom:10}}>Integration type</p>
                        <Select id="severity" className="dropdownForm"
                          placeholder={<i>Select Severity</i>}
                          name=""
                          value={this.state.selectedIntegrationType}
                          options={this.state.integrationValues}
                          searchable={true}
                          multi={false}
                          clearable={false}
                          allowCreate={false}
                          onChange={this.selectIntegrationTypeChange}/>

                        {/*<select  className={selectStyle} id="integrationType" onChange={this.selectIntegrationTypeChange}
                          defaultValue={this.state.selectedIntegrationType} style={{width:326,height:40,border:this.state.bordercolt,borderRadius:0, marginTop:'10px'}} componentClass="select" >
                          <option value="pagerduty">PagerDuty</option>
                          <option value="slack">Slack</option>
                          <option value="jira" >JIRA</option>
                          <option value="serviceNow" >ServiceNow</option>
                        </select>*/}
                      </div>
                    </div>
                  </div>

                  <IntegrationTypes ref="child"
                      selectedIntegrationType={this.state.selectedIntegrationType}
                      pdIntegrated={this.props.pdIntegrated}
                      serviceNowInegrated={this.props.serviceNowInegrated}
                      jiraIntegrated={this.props.jiraIntegrated}
                      slackIntegrated={this.props.slackIntegrated}
                      handleAPIKeyChange={this.handleAPIKeyChange}
                      usernameChange={this.usernameChange}
                      passwordChange={this.passwordChange}
                      hosturlChange={this.hosturlChange}
                      projectkeyChange={this.projectkeyChange}
                      slackOverlayTrigger={this.state.slackOverlayTrigger}
                      serviceusernameSet={this.serviceusernameSet}
                      servicepasswordSet={this.servicepasswordSet}
                      serviceUrlSet={this.serviceUrlSet}

                      />
               </div>
              </Modal.Body>
              <Modal.Footer className={footerDivContainer}>
                <Button onClick={this.closeIntegration}
                  style={{backgroundColor:'#FFF',margin:'20px 5px 0px 0px',
                          color:'#4C58A4',borderRadius:0,height:30,paddingTop:'5px'}}>
                    Cancel
                </Button>
                <Button
                  style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 15px',
                        color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}}
                  disabled={doneButtonDisability}
                  onClick={this.addThirdPartyIntegration}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
       </span>
        )
      },
    }
  )

export default AddIntegration
