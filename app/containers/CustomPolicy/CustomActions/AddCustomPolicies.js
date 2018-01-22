import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn,btnPrimary, selectStyle} from 'sharedStyles/styles.css'
import {Row, Col, Button, Modal, ControlLabel, FormGroup, FormControl, Popover, OverlayTrigger} from 'react-bootstrap'
import {addIntegrationsModalHeader, modalCloseStyle, footerDivContainer, CustomPoliciesModal, modalContainer, buttons_footer} from './../styles.css'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip';
import Select from 'react-select'
import {addRule} from 'helpers/scriptedPolicy'
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/ruby';
import 'brace/theme/monokai';

// https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not

const AddCustomPolicies = React.createClass({
  getInitialState(){
    return {
      osOptions:[{label:"Windows", value:"Windows"}, {label:"RHEL", value:"RHEL"}],
      severityOptions:[{label:"High", value:"High"}, {label:"Medium", value:"Medium"}, {label:"Low", value:"Low"}],
      showCustomPolicies:false,
      border:'thin solid #4C58A4',
      policyName:'',
      uid:"",
      description:"",
      os:"",
      severity:"",
      policyPack:"",
      aceValue:"",
      validationResponse:"",
      validated:false
    }
  },
  componentDidMount(){

  },

  componentWillReceiveProps(nextProps,nextState){
  },

  openCustomPoliciesModal(){
    this.setState({showCustomPolicies:true})
  },

  closeCustomPolicies() {
    this.setState({
      showCustomPolicies: false,
    });
  },

  policyNameChange(e){
    this.setState({
      policyName:e.target.value
    })
  },

  uidChange(e){
    this.setState({
      uid:e.target.value
    })
  },

  descriptionChange(e){
    this.setState({
      description:e.target.value
    })
  },

  osChange(e){
    this.setState({
      os:e
    })
  },

  severityChange(e){
    this.setState({
      severity:e
    })
  },

  policyPackChange(e){
    this.setState({
      policyPack:e.target.value
    })
  },

  onChange(newValue) {
    this.setState({
      validated:false,
      aceValue:newValue
    })
  },

  isJsonString(str) {
    console.log("strasdfasfsf", str)
    if (this.state.aceValue !== null && typeof this.state.aceValue === 'object'){
      return true;
      console.log("tretetertertertertert+++++++++++++++++++++++++", this.state.aceValue)
    } else {
      // console.log("falseaflfadlasegalsare+++++++++++++++++++++++++", this.state.aceValue)
      // if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      //   console.log("falseaflfadlasegalsare+++++++++++++++++++++++++true", this.state.aceValue)
      //   return false
      // } else {
      //   console.log("falseaflfadlasegalsare+++++++++++++++++++++++++false", this.state.aceValue)
      //   return true
      // }

      try {
        console.log("sadflje98f90d8098sdf09asdf111", JSON.parse(str))
      } catch (e) {
        console.log("sadflje98f90d8098sdf09asdf222", e)
          return false;
      }
      if (typeof JSON.parse(str) == "string"){
        console.log("sadflje98f90d8098sdf09asdf333", JSON.parse(str))
        return false;
      } else {
        return true;
      }
        // return str === Object(str);
    }
  },

  validate(){
    // let value = JSON.stringify(this.state.aceValue);
    let value = this.state.aceValue;
    let validate = this.isJsonString(value);
    console.log("sdafasdfasdf", validate, value)
    if (validate){
      this.setState({
        aceValue:this.state.aceValue,
        validated:true
      })
    } else {
      console.log("sdafasdfasdf", validate, value)
      this.setState({
        validationResponse:"Input is not a true JSON",
        validated:false
      }, ()=>{console.log("sdafasdfasdf", this.state.validationResponse)})
    }
  },

  addNewRule(){
    let ruleJSON = this.state.aceValue;
    // let ruleJSON = JSON.parse(this.state.aceValue);
    addRule(ruleJSON, this.state.description, this.state.policyName, this.state.os, this.state.severity, this.state.uid)
    // addRule("test", "expected value", "check", "description", "title", "os", "severity", "uid")
    .then((res)=>{
      this.props.refreshCustomPoliciesList();
      this.closeCustomPolicies();
    })
    .catch((error)=>{
      console.log("addNewRule error ", error)
    })
  },

  render() {
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:120,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}
    let posstyle = {  position: 'relative', top:40, left: 0,
      width: '154px',
      float: 'right',
      margin: 'auto' }

    let addIntbutStyle = {borderRadius: 0, marginTop: 20,
                        marginBottom: 20,width:'300px'}
    let wrapperAddInt = {position:'absolute', top:-115, right:30}

    let oTrigger = ['hover','focus']
    if(this.props.totalCustomPoliciesCount>0)
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
          <a href='JavaScript: void(0)' onClick={this.openCustomPoliciesModal}>
            Add Custom Policies
          </a>
            <Modal show={this.state.showCustomPolicies}
                   onHide={this.closeCustomPolicies}
                   dialogClassName={CustomPoliciesModal}
                   keyboard={false}
                   backdrop='static'>
              <Modal.Header style={{float:'middle'}} className={addIntegrationsModalHeader} >
                <a style={{textDecoration:'none', top:8, right:37, color:'#4b58a4'}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeCustomPolicies}>
                  x
                </a>
                <Modal.Title id="contained-modal-title"
                  style={{width:'100%',fontWeight:'bold',padding:0,
                        marginTop:20,textAlign:'left',marginLeft:'29px',
                        fontSize:'18px'}}>
                  ADD POLICY
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{margin:'0px',padding:'0px', width:'100%',backgroundColor:'#FFF'}}>
                <Row>
                  <Col lg={5} style={{height:"74vh"}}>
                    {/*<FormGroup  controlId="Username" style={{marginTop:"20px"}}>
                     <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Username</ControlLabel>
                       <OverlayTrigger ref="Username" trigger={this.state.tooltipUsername} placement="right" overlay={tooltipUsername}>
                         <FormControl type="text"
                             name="GroupLabel"
                             defaultValue={this.state.userUsername}
                             disabled={this.props.edit?true:false}
                             onChange={this.handleUsername}
                             onBlur={this.validateUsername}
                             value={this.state.GroupLabel}
                             placeholder="Enter Username"
                             style={{width:326,height:40,border:this.state.bordercolUsername,borderRadius:0, marginLeft:"60px"}}
                               />
                       </OverlayTrigger>
                    </FormGroup>*/}
                    <FormGroup  style={{marginTop:"20px"}}>
                     <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Policy Name</ControlLabel>
                         <FormControl type="text"
                             onChange={this.policyNameChange}
                             placeholder="Create policy name"
                             style={{width:326,height:40,border:this.state.border,borderRadius:0, marginLeft:"60px"}}
                               />
                    </FormGroup>
                    <FormGroup style={{marginTop:"20px"}}>
                     <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>UID</ControlLabel>
                         <FormControl type="text"
                             onChange={this.uidChange}
                             placeholder="Provide unique identifier"
                             style={{width:326,height:40,border:this.state.border,borderRadius:0, marginLeft:"60px"}}
                               />
                    </FormGroup>
                    <FormGroup style={{marginTop:"20px"}}>
                     <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Description</ControlLabel>
                         <FormControl type="text"
                             onChange={this.descriptionChange}
                             placeholder="Custom policy description"
                             style={{width:326,height:40,border:this.state.border,borderRadius:0, marginLeft:"60px"}}
                               />
                    </FormGroup>
                    <FormGroup style={{marginTop:"20px", marginLeft:"60"}}>
                     <ControlLabel style={{fontWeight:500,padding:'0'}}>OS</ControlLabel>
                         <Select placeholder={<i>Select OS</i>}
                           // inputProps={{"id":"userRoles"}}
                           name="os"
                           value={this.state.os?this.state.os:""}
                           options={this.state.osOptions}
                           searchable={true}
                           multi={false}
                           clearable={false}
                           allowCreate={false}
                           onChange={this.osChange}/>
                    </FormGroup>
                    <FormGroup  controlId="Role" style={{marginTop:"20px", marginLeft:"60"}}>
                     <ControlLabel style={{fontWeight:500,padding:'0'}}>Severity</ControlLabel>
                         <Select placeholder={<i>Select Severity</i>}
                           // inputProps={{"id":"userRoles"}}
                           name="severity"
                           value={this.state.severity?this.state.severity:""}
                           options={this.state.severityOptions}
                           searchable={true}
                           multi={false}
                           clearable={false}
                           allowCreate={false}
                           onChange={this.severityChange}/>
                    </FormGroup>
                    <div className={buttons_footer}>
                      <Button onClick={this.closeCustomPolicies}
                        style={{backgroundColor:'#FFF',margin:'20px 5px 0px 0px',
                                color:'#4C58A4',borderRadius:0,height:30,paddingTop:'5px'}}>
                          Cancel
                      </Button>
                      <Button
                        style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 15px',
                              color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}}
                        onClick={this.validate}
                        disabled={this.state.aceValue?false:true}
                      >
                        Validate
                      </Button>
                      <Button
                        onClick={this.addNewRule}
                        style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 15px',
                              color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}}
                        disabled={this.state.validated?false:true}
                      >
                        Save
                      </Button>
                    </div>
                  </Col>
                  <Col lg={7}>
                    <Row>
                      <div style={{marginTop:"20px", marginBottom:"20px"}}>
                        <AceEditor
                          mode="ruby"
                          value={this.state.aceValue}
                          theme="monokai"
                          width={'90%'}
                          onChange={this.onChange}
                          name="UNIQUE_ID_OF_DIV"
                        />
                      </div>
                      <FormGroup controlId="formGroupDesc">
                        <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginTop:'20px'}}>Validation Logs</ControlLabel>
                        <FormControl
                          componentClass="textarea"
                          style={{height:100,padding:'12px',borderRadius:0,border:this.state.border, width:"68vh"}}
                          defaultValue={this.state.validationResponse}
                        />
                      </FormGroup>
                    </Row>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
       </span>
        )
      },
    }
  )

export default AddCustomPolicies
