import React, { Component, PropTypes } from 'react'
import {Popover,Tooltip,Table, ButtonToolbar,ButtonGroup, Button , SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio,fieldset,legend,Glyphicon} from 'react-bootstrap'
import { navbar, selectStyleCred} from 'sharedStyles/styles.css'
import getCredentialsList from 'helpers/credentials'
import {putCredential, uploadFile} from 'helpers/credentials'
import Joi from 'joi-browser'
import {dotted,fileGlyph,ulStyle,liStyle,italic1,infoCircle} from './styles.css'
import { blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import {SpinnyLogo} from 'containers'
import Select from 'react-select'
import OverLayCustom from 'components/Common/OverLayCustom'

const Selections=React.createClass({
render: function () {
  let count = this.props.slectedIds;
  if(count>0){
    return(
      <p>Select Credentials ({count} selected)</p>
      )
  }else{
    return(
    <p>Select Credentials</p>
    )
  }

  }
})

 const ResourceCredentials = React.createClass ({
  getInitialState() {
   return {
      selectedOption : 'PemKey',
      isDisablePassword:true,
      isDisablePem:false,
      selectedCredLabel:[],
      selectedCredLabelId:[],
      nlabel:'',
      isChecked:false,
      responseId:'',
      singleTypeSelectionField:true,
      isSelectedType:false,
      isSelectedUsage:false,
      userNameEntered:false,
      isLabelSet:false,
      pwdEntered:false,
      addButtonDisability:'true',
      clist:[],
      credentialsTypeBorderColor:'1px solid #4C58A4',
      credentialsUsageBorderColor:'1px solid #4C58A4',
      userNameBorderColor:'1px solid #4C58A4',
      passwordBorderColor:'1px solid #4C58A4',
      pemKeyBorderColor:'1px solid #4C58A4',
      labelBorderColor:'1px solid #4C58A4',
      userName_Message:'Username is required',
      credentialsType_Message:'Select credential type to add a new credential',
      credentialsLabel_Message:'Label is required',
      credentialsUsage_Message:'Select a Usage',
      credentialsPassword_Message:'Password is required',
      credentialsPemKey_Message:'Upload PEM Key file',
      tooltipPwdHeight:'40px',
      tooltipLabelHeight:'40px',
      tooltipUnameHeight:'40px',
      tooltipPemHeight:'40px',
      CredentialsType_validation:'',
      Usage_Validation:'',
      Username_Validation:'',
      Password_Validation:'',
      CredentialLabel_validation:'',
      showPemWithRadioButtons:false,
      showPwdDescription:"Show characters",
      passType:"password",
      addButtonName:"Add",
      loadingDiv:true,
      showToolTipForType:"hover",
      showToolTipForLabel:"hover",
      showToolTipForUsage:"hover",
      showToolTipForUsername:"hover",
      showToolTipForPwd:"hover",
      passwordOverlaytrigger:[],
      pemOverlayTrigger:['hover','focus'],
      pemContents:"",
      pemFileExists:false,
      uploadFileName:"",
      pemAreaColor:'white',
      credTypeOption:[
        {label:"Select credential type", value:""},
        {label:"Linux", value:"linux-server"},
        {label:"Windows Administrator", value:"windows-server"},
      ],
      credTypeValue:'',
      usageOption:[
        {label:"Select Usage", value:""},
        {label:"Global - tried on all devices", value:"Global"},
        {label:"Restricted - used only on assigned devices", value:"Restricted"},
      ],
      selectedUsage:'',
      selectedCredType:''
    }
  },


  componentDidMount: function(){
    getCredentialsList()
    .then(
      (credentials) =>  {
        this.setState({clist:credentials,
         loadingDiv:false});
      }
     )
    .catch((error) => console.log("Error in getCredentialsList in container:" + error))

      this.setState({selectedCredLabelId:this.props.credidsedit});
      if(this.state.selectedCredType == 'linux-server' || this.state.selectedCredType == 'windows-server'){
        this.setState({showToolTipForType:false})
      }else{
        this.setState({showToolTipForType:"hover"})
      }
  },
   componentWillReceiveProps(nextProps,nextState){
   if(this.props.idtobeedited!=-1 && this.props.credidsedit!== nextProps.credidsedit){
     this.setState({selectedCredLabelId:nextProps.credidsedit});
    // this.setState({selectedCredLabelId:this.state.selectedCredLabelId.concat([this.props.credidsedit])});
    }
  },

  saveCredentials(label,ncredType,loginId,password,usage,pemFileName){
     putCredential(label,ncredType,loginId,password,usage,pemFileName)
    .then(
      (response) => {
        this.setState({responseId:parseInt(response.data.id)})
        let newCredList = this.state.clist.slice();
        newCredList.splice(0,0,response.data);
        this.setState({selectedCredLabelId:this.state.selectedCredLabelId.concat([this.state.responseId])});
        this.props.getCredentialsId(this.state.selectedCredLabelId);
        this.setState({clist:newCredList});
        this.setState({
          selectedOption : 'PemKey',
          isDisablePassword:true,
          isDisablePem:false,
          nlabel:'',
          singleTypeSelectionField:true,
          isSelectedType:false,
          isSelectedUsage:false,
          userNameEntered:false,
          isLabelSet:false,
          pwdEntered:false,
          addButtonDisability:'true',
          addButtonName:'Add',
          credentialsTypeBorderColor:'1px solid #4C58A4',
          credentialsUsageBorderColor:'1px solid #4C58A4',
          userNameBorderColor:'1px solid #4C58A4',
          passwordBorderColor:'1px solid #4C58A4',
          pemKeyBorderColor:'1px solid #4C58A4',
          labelBorderColor:'1px solid #4C58A4',
          userName_Message:'Username is required',
          credentialsType_Message:'Select credential type to add a new credential',
          credentialsLabel_Message:'Label is required',
          credentialsUsage_Message:'Select a Usage',
          credentialsPassword_Message:'Password is required',
          credentialsPemKey_Message:'Upload PEM Key file',
          CredentialsType_validation:'',
          tooltipPwdHeight:'40px',
          tooltipLabelHeight:'40px',
          tooltipUnameHeight:'40px',
          tooltipPemHeight:'40px',
          Usage_Validation:'',
          Username_Validation:'',
          Password_Validation:'',
          CredentialLabel_validation:'',
          showPemWithRadioButtons:false,
          showPwdDescription:"Show characters",
          passType:"password",
          showToolTipForType:"hover",
          showToolTipForLabel:"hover",
          showToolTipForUsage:"hover",
          showToolTipForUsername:"hover",
          showToolTipForPwd:"hover",
          pemOverlayTrigger:['hover','focus'],
          uploadFileName:"",
          pemAreaColor:'white'
        });
      }
    )
    .catch((error) => {
      this.setState({addButtonName:'Add',
      addButtonDisability:false})
      if(error.data.message != null && error.data.status != null && error.data.status===409){
        if(error.data.message.indexOf("Credentials already exists")>-1)
        {
          this.setState({showToolTipForLabel:"hover",
           credentialsLabel_Message : "Label already exists",
           CredentialLabel_validation: 'error',
           labelBorderColor:'1px solid #FF444D'
           })
        }
      }
       error.preventDefault();
       return false;
    })
  },

  handleOptionChange: function (changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value,
    });
    if(changeEvent.target.value == 'Password')
    {
      this.setState({
        isDisablePem : true,
        isDisablePassword : false,
        showToolTipForPwd:"hover",
        pemOverlayTrigger:[],
        pemAreaColor:'#eee',
      });
       document.getElementById("uploadBtn").disabled = true;
      if(formPassword.value==''){
        this.setState({pwdEntered:false,
          passwordOverlaytrigger:['hover', 'focus']})
      }else{
        this.setsState({pwdEntered:true,
          passwordOverlaytrigger:false})
      }

    }
    else
    {
       this.refs.infoPwd.hide();
       document.getElementById("uploadBtn").disabled = false;
       if(this.state.uploadFileName==''){
        this.setState({pemFileExists:false,
          pemOverlayTrigger:['hover','focus']})
       }else{
        this.setState({pemFileExists:true,
          pemOverlayTrigger:false})
       }
      this.setState({
        Password_Validation:'',
        isDisablePassword : true,
        isDisablePem : false,
        showToolTipForPwd:"",
        passwordOverlaytrigger:[],
        pemAreaColor:'white'
     });
    }
  },


  handleSave(e){
    this.setState({addButtonName:'Saving',
    addButtonDisability:true})
    let label = this.state.nlabel;
    let ncredType=this.state.selectedCredType;
    let loginId=formControlsUsername.value;
    let password=formPassword.value;
    let usage=this.state.selectedUsage;
    let pemFileName="";

    if(this.state.selectedOption==="PemKey"){
      password="";
      pemFileName=document.getElementById('uploadBtn').files[0].name
      var data = new FormData();
      data.append('file', document.getElementById('uploadBtn').files[0]);
      uploadFile(data)
      .then((response)=>{
        console.log("inside upload data success- "+response)
        console.log("putCredential called");
        this.saveCredentials(label, ncredType, loginId, password, usage, pemFileName)
      })
      .catch((error)=>{
        console.log("error in saving pem file "+error)
      })

    }
    else{
      //password selection
      console.log("putCredential called");
      this.saveCredentials(label, ncredType, loginId, password, usage, pemFileName)
    }
    
    if(this.state.selectedCredType == 'linux-server' || this.state.selectedCredType == 'windows-server'){
      this.setState({showToolTipForType:false})
    }else{
      this.setState({showToolTipForType:"hover"})
    }

    this.setState({selectedCredType:'',selectedUsage:''})

  },

  handleCancel(){
   //Set everything back to initial state
    this.setState({
      selectedOption : 'PemKey',
      isDisablePassword:true,
      isDisablePem:false,
      nlabel:'',
      singleTypeSelectionField:true,
      isSelectedType:false,
      isSelectedUsage:false,
      userNameEntered:false,
      isLabelSet:false,
      pwdEntered:false,
      addButtonDisability:'true',
      credentialsTypeBorderColor:'1px solid #4C58A4',
      credentialsUsageBorderColor:'1px solid #4C58A4',
      userNameBorderColor:'1px solid #4C58A4',
      passwordBorderColor:'1px solid #4C58A4',
      pemKeyBorderColor:'1px solid #4C58A4',
      labelBorderColor:'1px solid #4C58A4',
      userName_Message:'Username is required',
      credentialsType_Message:'Select credential type to add a new credential',
      credentialsLabel_Message:'Label is required',
      credentialsUsage_Message:'Select a Usage',
      credentialsPassword_Message:'Password is required',
      credentialsPemKey_Message:'Upload PEM Key file',
      tooltipPwdHeight:'40px',
      tooltipLabelHeight:'40px',
      tooltipUnameHeight:'40px',
      tooltipUnameHeight:'40px',
      tooltipPemHeight:'40px',
      CredentialsType_validation:'',
      Usage_Validation:'',
      Username_Validation:'',
      Password_Validation:'',
      CredentialLabel_validation:'',
      showPemWithRadioButtons:false,
      showPwdDescription:"Show characters",
      passType:"password",
      addButtonName:'Add',
      showToolTipForType:"hover",
      showToolTipForLabel:"hover",
      showToolTipForUsage:"hover",
      showToolTipForUsername:"hover",
      showToolTipForPwd:"hover",
      pemOverlayTrigger:['hover','focus'],
      uploadFileName:"",
      pemAreaColor:'white'
    });
    this.setState({selectedCredType:'',selectedUsage:''})
  },

  selectedCredentials(e){
    let chkVal = parseInt(e.target.id);
    const index = this.state.selectedCredLabelId.indexOf(chkVal)
    console.log( "Index is "+this.state.selectedCredLabelId.indexOf(chkVal))
    let newList = this.state.selectedCredLabelId.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selectedCredLabelId: newList},
      function() {
       console.log("selected id list "+this.state.selectedCredLabelId);
       this.props.getCredentialsId(this.state.selectedCredLabelId)
      }.bind(this));
  },

  handleSelectTypeChanges(e){
    this.state.selectedCredType=e
    this.setState({
      singleTypeSelectionField:false,
      selectedCredType:e
    });

    if(e==""){
      this.setState({showToolTipForType:["hover","focus"],credentialsTypeBorderColor:'1px solid #FF444D'})
    }else
    {
      this.setState({showToolTipForType:false, credentialsTypeBorderColor:'1px solid #00C484'})
    }

    if(this.state.selectedCredType == 'linux-server'){
      this.setState({ showUsernameField: true,
                    showPasswordField: true,
                    isSelectedType:true,
                    showPemWithRadioButtons:true,
                    showToolTipForType:false,
                    isDisablePassword : true,
                    isDisablePem : false});
      if(this.state.selectedOption="PemKey"){
        this.setState({passwordOverlaytrigger:[]})
      }
    }
    if(this.state.selectedCredType  == 'windows-server'){
      this.setState({
                    showUsernameField: true,
                    showPasswordField: true,
                    isSelectedType:true,
                    showPemWithRadioButtons:false,
                    isDisablePassword:false,
                    showToolTipForType:false,
                    selectedOption:"Password",
                    passwordOverlaytrigger:['hover', 'focus']});
    }
    //Credentials Type Validation
    let CredentialsType_schema = {
      CredentialsType: Joi.string().required(),
    };
    let result = Joi.validate({CredentialsType: e}, CredentialsType_schema)
    if(result.error)
    {
      this.setState({
        credentialsType_Message:"Select credential type to add a new credential",
        CredentialsType_validation: 'error',
        addButtonDisability:true,
        isSelectedType:false,
        showToolTipForType:"hover"
      })
      this.state.credentialsTypeBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({CredentialsType_validation : 'success',
      isSelectedType:true,
      showToolTipForType:false,
      })
      this.state.showToolTipForType=""
      this.state.isSelectedType=true
      this.refs.infoType.hide();
      this.state.credentialsTypeBorderColor='1px solid #00C484'
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered  && this.state.isLabelSet && (this.state.selectedOption ==='PemKey'? this.state.pemFileExists : this.state.pwdEntered)){
        this.setState({addButtonDisability:false})
      }
    }
  },

  handleUsage(usage){
    // console.log('DDDDD', document.getElementsByClassName('Select-control'))
    // console.log('DDDDD', document.getElementById('usageId').classList)
    // document.getElementById('usageId').classList.add('dropdownFormGreen')

    if(usage==""){
      this.setState({showToolTipForUsage:["hover","focus"], credentialsUsageBorderColor:'1px solid #FF444D'})
    }else{
      this.setState({showToolTipForUsage:false, credentialsUsageBorderColor:'1px solid #00C484'})
    }

    this.setState({isSelectedUsage:true, selectedUsage:usage})
    //Usage Validation
    let Usage_schema = {
      Usage: Joi.string().required(),
    };
    let result = Joi.validate({Usage: usage}, Usage_schema)
    if(result.error)
    {
        this.setState({
          credentialsUsage_Message: "Select a Usage",
          Usage_Validation: 'error',
          addButtonDisability:true,
          isSelectedUsage:false,
          showToolTipForUsage:"hover"
        })
        this.state.credentialsUsageBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({Usage_Validation : 'success',
      showToolTipForUsage:false,
      isSelectedUsage:true
      })
      this.state.isSelectedUsage=true
      this.state.showToolTipForUsage=""
      this.refs.infoUsage.hide();
      this.state.credentialsUsageBorderColor='1px solid #00C484'
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered  && this.state.isLabelSet && (this.state.selectedOption ==='PemKey'? this.state.pemFileExists : this.state.pwdEntered)){
        this.setState({addButtonDisability:false})
      }
    }
  },


  handleUserName(uname){
    if(uname.target.value==""){
      this.setState({showToolTipForUsername:["hover","focus"]})
    }else{
      this.setState({showToolTipForUsername:false})
    }
    let Username_schema = {
      Username: Joi.string().required(),
    };
    let result = Joi.validate({Username: uname.target.value}, Username_schema)
    if(result.error)
    {
      this.setState({
        tooltipUnameHeight:'70px',
        userName_Message: "Username cannot be empty",
        Username_Validation: 'error',
        addButtonDisability:true,
        userNameEntered:false,
        showToolTipForUsername:["hover","focus"]
      })
      this.state.userNameBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({
        tooltipUnameHeight:'40px',
        userName_Message: "Username is required",
        Username_Validation : 'success',
        userNameEntered:true,
        showToolTipForUsername:false
      })
      this.state.userNameBorderColor='1px solid #00C484'
      this.state.showToolTipForUsername=""
      this.refs.infoUname.hide();
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered  && this.state.isLabelSet && (this.state.selectedOption ==='PemKey'? this.state.pemFileExists : this.state.pwdEntered))
      {
        this.setState({addButtonDisability:false})
      }
    }
  },

  handleLabel(label){
    console.log("Label "+label.target.value)
    if(label.target.value==""){
      this.setState({showToolTipForLabel:'false'})
    }else{
      this.setState({showToolTipForLabel:["hover","focus"]})
    }
    let Label_schema = {
      Label: Joi.string().required(),
    };
    let result = Joi.validate({Label: label.target.value}, Label_schema)
    if(result.error)
    {
      this.setState({
        tooltipLabelHeight:'40px',
        credentialsLabel_Message: "Label cannot be empty",
        CredentialLabel_validation: 'error',
        addButtonDisability:true,
        isLabelSet:false,
        showToolTipForLabel:["hover", "focus"]

      })
      this.state.labelBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({
        tooltipLabelHeight:'40px',
        credentialsLabel_Message: "Label is required",
        CredentialLabel_validation : 'success',
        isLabelSet:true,
        nlabel:label.target.value,
        showToolTipForLabel:"",
      })
      this.state.labelBorderColor='1px solid #00C484'
      this.state.showToolTipForLabel="",
      this.refs.infoLabel.hide();
      console.log("state of hover "+this.state.showToolTipForLabel)
      console.log("addButtonDisability state is "+this.state.addButtonDisability)

      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered  && this.state.isLabelSet && (this.state.selectedOption ==='PemKey'? this.state.pemFileExists : this.state.pwdEntered))
      {
        console.log("Enabling add button")
        this.setState({addButtonDisability:false})
        console.log("addButtonDisability state is "+this.state.addButtonDisability)
      }
    }
  },

  handlePassword(passwd){
    if(passwd.target.value==""){
      this.setState({passwordOverlaytrigger:['hover','focus']})
    }else{
      this.setState({passwordOverlaytrigger:false})
    }
    let Password_schema = {
      Password:  Joi.string().max(32).required(),
    };
    let result = Joi.validate({Password: passwd.target.value}, Password_schema)
    if(result.error)
    {
      this.setState({
        tooltipPwdHeight:'70px',
        credentialsPassword_Message: 'Password cannot be empty',
        Password_Validation: 'error',
        addButtonDisability:true,
        pwdEntered:false,
        passwordOverlaytrigger:['hover','focus']
      })
      this.state.passwordBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({
        tooltipPwdHeight:'40px',
        credentialsPassword_Message:'Password is required',
        Password_Validation : 'success',
        pwdEntered:true,
        passwordOverlaytrigger:false
      })
      this.state.passwordBorderColor='1px solid #00C484'
      this.refs.infoPwd.hide();
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pwdEntered && this.state.isLabelSet)
      {
        this.setState({addButtonDisability:false})
      }
    }
  },

  hideInfoPopup(){
    this.refs.infoPopup.hide();
  },

  charecterShowHide(){
    if(this.state.passType==="password")
    {
      this.setState({passType:"text"});
      this.setState({showPwdDescription:"Hide characters"});
    }
    else
    {
      this.setState({passType:"password"});
      this.setState({showPwdDescription:"Show characters"});
    }
  },

  handlePem(evt){

    let fileName=evt.target.files[0].name;
    let finalFileName=evt.target.files[0].name;

    var ext = fileName.substring(fileName.indexOf(".") + 1, fileName.length);
    if (ext != 'pem' && ext != 'PEM') {
      var uploadedFileName=fileName.substring(0, fileName.indexOf("."));
      if(uploadedFileName.length>25){
        let concatString='...'+ext
        let subFileName=uploadedFileName.substring(0,25);
        finalFileName= subFileName.concat(concatString)
      }
     this.setState({pemKeyBorderColor:'1px solid #FF444D',
                    tooltipPemHeight:'80px',
                    pemOverlayTrigger:['hover','focus'],
                    credentialsPemKey_Message:'File type is invalid,upload only .pem file',
                    uploadFileName:finalFileName,
                    pemFileExists:false})
    }
    else
    {
      this.refs.infoPem.hide();
      this.setState({pemKeyBorderColor:'1px solid #4C58A4',
      pemOverlayTrigger:false})
      var localFileName=fileName.substring(0, fileName.indexOf("."));
      if(localFileName.length>25){
        let concatString='...pem'
        let subFileName=localFileName.substring(0,25);
        finalFileName= subFileName.concat(concatString)
      }
      var file = evt.target.files[0];
      if (file)
      {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt)
        {
          let pemStroing=evt.target.result;
          this.setState({pemFileExists:true,
            credentialsPemKey_Message:'Upload PEM Key file'},function()
          {
            console.log("states are "+this.state.pemFileExists)
            this.setState({uploadFileName:finalFileName});
            if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pemFileExists && this.state.isLabelSet)
            {
              console.log("Enabling add button")
              this.setState({addButtonDisability:false})
              console.log("addButtonDisability state is "+this.state.addButtonDisability)
            }
          }.bind(this))
        }.bind(this)
        reader.onerror = function (evt) {
          console.log("error reading file "+evt);
        }
      }else{
        console.log("no file")
        this.setState({pemContents:''})
      }
    }
  },


  render(){
    let headingColor = {color: 'green'}
    let popoverwidth ={width:1200}
    let fieldsetStyle ={width:'576px',border: '1px solid #cdd1f3' ,marginLeft:'-125px', paddingLeft: '125px',paddingTop: '10px',paddingBottom:'10px'}
    let legendStyle={borderBottom: 'none',color: '#636363',width:0,marginBottom:0}
    let tooltipeffect= {color: 'black',borderWidth: 2,borderColor: 'black'}
    let tooltipeffect2= {color: 'black',borderWidth: 2,
                        borderRadius:0,width:180,height:60}
    this.state.addButtonDisability=!(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered  && this.state.isLabelSet && (this.state.selectedOption ==='PemKey'? this.state.pemFileExists : this.state.pwdEntered))
   console.log("render -->"+this.state.selectedCredType)
    const tooltipcredentiaalDetail =
      (
        <Popover style={{maxWidth:'100%',width:'600px', borderRadius:0}}>
        <h4> <strong>NETWORK REQUIREMENTS </strong></h4>
          <br/>
            <label> <strong> Windows : Windows Remote Management (port 5985) and WMI (port 135) </strong> </label>
            <p> WinRM should be enabled. By default WinRM is installed but not enabled.WMI should be enabled and running.
            Windows credentials should have administrator privileges,and WMI privileges should be granted to this user.
            Firewall rules should be in place to allow WinRM calls through port 5985. </p>

          <br/>
              <label> <strong>Linux & Unix : SSH (port 22) </strong> </label>
              <p> The user credentials should have root privileges.The user should be enabled for password-less sudo </p>

        </Popover>
    );

    const beforeLegendCredentialsTypeToolTip=(
    <Popover style={tooltipeffect2}>{'Select credential type to add a new credential'}</Popover>
    );

    const tooltipCredentialsType = (
      <Popover style={tooltipeffect2}>
        {this.state.credentialsType_Message}
      </Popover>
    );

    const tooltipCredentialsUsage = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:40}}>
        {this.state.credentialsUsage_Message}
      </Popover>
    );

    const tooltipCredentialsUsername = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipUnameHeightLabel}}>
        {this.state.userName_Message}
      </Popover>
    );

    const tooltipLabel = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipLabelHeight}}>
        {this.state.credentialsLabel_Message}
      </Popover>
    );

     const tooltipPassword = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipPwdHeight}}>
        {this.state.credentialsPassword_Message}
      </Popover>
      );

      const tooltipPem = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipPemHeight}}>
        {this.state.credentialsPemKey_Message} </Popover>
      );
       const tooltipStyle = {
      display: this.state.hover ? 'block' : 'none'
    }

  let myCredentials = this.state.clist;
  let selectedCredCount=this.state.selectedCredLabelId.length;
  return(
    <div>
      <div className="row"  style={{margin:'0px',width:'100%',backgroundColor:'#E8EFF9'}}>
        <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
        <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
          <ControlLabel><h3 style={{fontSize:'15px'}}><strong>RESOURCE CREDENTIALS  &nbsp;&nbsp;&nbsp; </strong>
            <OverlayTrigger ref="infoPopup" placement="right" rootClose trigger="click" overlay={tooltipcredentiaalDetail}>
              <ControlLabel className={infoCircle} style={{color:'#4C58A4'}} >
                  <i style={{paddingRight:'3px',paddingTop:'4px'}}>i</i>
              </ControlLabel>
            </OverlayTrigger></h3>
          </ControlLabel>
          <Selections slectedIds={selectedCredCount} />
          <div className={ulStyle} style={{width:326, position:'relative'}}>
            {this.state.loadingDiv?
              <div style={{ width:'90px',height:'90px',marginLeft:'50px',marginTop:'20px'}}>
                <SpinnyLogo />
              </div>
            :
            <ul className="list-unstyled" style={{padding:0, margin:10}}>
              <li className={liStyle}>
              {
                this.state.clist.map(function(cred)
                {
                  let finalLabel=cred.label
                  if(cred.label.length>25){
                    let shortCredLabel=cred.label.substring(0,25)
                    finalLabel=shortCredLabel.concat('...')
                  }

                  if((this.state.selectedCredLabelId.indexOf(cred.id))>-1)
                  {
                    return (<div>
                    <input type='Checkbox' style={{position:'absolute', height:'10px'}} id={cred.id} value={cred.label} name={cred.label} onChange={this.selectedCredentials} checked={true}/>
                    <label style={{fontWeight:'500'}} htmlFor={cred.id} title={cred.label}>&nbsp;&nbsp;{finalLabel}</label></div>);
                  }
                  else
                  {
                    return (
                    <div>
                      <input type='Checkbox' style={{position:'absolute', height:'10px'}} id={cred.id} value={cred.label} name={cred.label} onChange={this.selectedCredentials} checked={false}/>
                      <label style={{fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',height:'22px','lineHeight':'20px'}} htmlFor={cred.id} title={cred.label}>&nbsp;&nbsp;{finalLabel}</label>
                   </div>
                    );
                  }
                }.bind(this))
              }
              </li>
            </ul>}
          </div>
          <div>
            <br/>
            <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Add New Credential</ControlLabel>
          </div>
        </div>
      </div>
      <div className="row"  style={{margin:'0px',width:'100%',backgroundColor:'#E8EFF9'}}>
        {this.state.singleTypeSelectionField?
        <div className="row" style={{margin:'0px'}}>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
          </div>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4" >
            <FormGroup controlId="credentialsSelect">
              <OverlayTrigger placement="right"  ref="infoType" trigger={this.state.selectedCredType == 'linux-server' || this.state.selectedCredType == 'windows-server' ? false : 'hover'} overlay={beforeLegendCredentialsTypeToolTip}>
                <span style={{display:'inline-block', border:this.state.credentialsTypeBorderColor}}>
                  <Select className="dropdownFormValid" placeholder="Select Credential Type"
                  value={this.state.selectedCredType}
                  name='credentialType'
                  inputProps={{"id":"selectCredentials"}}
                  options={this.state.credTypeOption}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleSelectTypeChanges}/>
                </span>
              </OverlayTrigger>
            </FormGroup>
          </div>
        </div>
        :
        <div className="row" style={{margin:'0px'}}>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
          </div>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4" >
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}  controlId="formControlsCredentialType" className="select">
                <OverlayTrigger placement="right"  ref="infoType" trigger={this.state.showToolTipForType} overlay={tooltipCredentialsType}>
                  <span style={{display:'inline-block', border:this.state.credentialsTypeBorderColor}}>
                    <Select className="dropdownFormValid" placeholder="Select Credential Type"
                    value={this.state.selectedCredType}
                    inputProps={{"id":"selectCredentials"}}
                    name='selectCredentials'
                    options={this.state.credTypeOption}
                    searchable={true}
                    multi={false}
                    clearable={false}
                    allowCreate={false}
                    onChange={this.handleSelectTypeChanges}/>
                  </span>
                </OverlayTrigger>
              </legend>
              <FormGroup controlId="formControlsLabel">
                  <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px',marginTop:'31px'}}>Label</ControlLabel>
                  <OverlayTrigger placement="right"  trigger={this.state.showToolTipForLabel} ref="infoLabel" overlay={tooltipLabel}>
                    <FormControl type="text" placeholder="Enter Label for Credential" style={{width:326,height:40,border:this.state.labelBorderColor,borderRadius:0,marginBottom:'31px'}} onChange={this.handleLabel} validationState={this.state.CredentialLabel_validation}/>
                  </OverlayTrigger>
                </FormGroup>
                <FormGroup controlId="formControlsUsage">
                  <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Usage</ControlLabel><br/>
                    <OverlayTrigger placement="right"  ref="infoUsage" trigger={this.state.showToolTipForUsage} overlay={tooltipCredentialsUsage}>
                      <span style={{display:'inline-block', border:this.state.credentialsUsageBorderColor}}>
                        <Select className="dropdownFormValid" placeholder="Select Usage"
                        value={this.state.selectedUsage}
                        inputProps={{"id":"credentialsUsage"}}
                        name='credentialsUsage'
                        options={this.state.usageOption}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.handleUsage}/>
                      </span>
                    </OverlayTrigger>
                </FormGroup>
                <FormGroup controlId="formControlsUsername" style={{display:this.state.showUsernameField?'block':'none'}}>
                  <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px',}}>Username</ControlLabel>
                    <OverlayTrigger placement="right"  trigger={this.state.showToolTipForUsername} ref="infoUname"  overlay={tooltipCredentialsUsername}>
                      <FormControl type="text"  name="credentialsUsername"  placeholder="Enter Username" style={{width:326,height:40,border:this.state.userNameBorderColor,borderRadius:0,marginBottom:'31px'}} onChange={this.handleUserName} validationState={this.state.Username_Validation}/>
                    </OverlayTrigger>
                </FormGroup>
                <FormGroup controlId="formControlsAuthentication" style={{display:this.state.showPemWithRadioButtons?'block':'none'}}>
                  <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Authentication</ControlLabel>
                  <div className="form-group option_field radio" id="grping-server" style={{marginBottom:'60px'}}>
                    <div className="row col-xs-12 pull-right">
                      <input type="radio" name="authenticate" id="formControlsPassword" value="Password" checked={this.state.selectedOption === 'Password'} onChange={this.handleOptionChange}/>
                        Use Password &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input type="radio" name="authenticate" id="formControlsPemKey" value="PemKey" checked={this.state.selectedOption === 'PemKey'} onChange={this.handleOptionChange}/>
                        Use Key-Pair
                    </div>
                  </div>

                  <FormGroup controlId="formPemkey">
                    <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Pem Key File</ControlLabel>
                    <FormGroup style={{width:'326px',marginBottom:'31px'}}>
                      <OverlayTrigger ref="infoPem" trigger={this.state.pemOverlayTrigger} placement="right" overlay={tooltipPem}>
                        <div>
                          <div id="uploadFileDiv" style={{display:'inline-block', border:this.state.pemKeyBorderColor, backgroundColor:this.state.pemAreaColor, paddingTop:'8px', paddingLeft:'12px', paddingBottom:'3px', paddingRight:'12px', width:258,height:40}}>
                            {this.state.uploadFileName}&nbsp; {(this.state.uploadFileName === "") ?<i>Click Browse to add PEM key file</i>: <noscript/>}
                          </div>
                          <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0, marginTop:'-2px'}}>
                            <input id="uploadBtn" name="file" type="file" onChange={this.handlePem} style={{borderRadius:0, width: 70, height: 50, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>
                            <span style={{position:'absolute',top:'518px',left:'288px',WebkitUserSelect: 'none', pointerEvents:'none', borderRadius:0}}>Browse</span>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </FormGroup>
                  </FormGroup>
                </FormGroup>

                <FormGroup controlId="formPassword" style={{display:this.state.showPasswordField?'block':'none'}}>
                  <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Password </ControlLabel>
                  <OverlayTrigger trigger={this.state.passwordOverlaytrigger} placement="right" ref="infoPwd" overlay={tooltipPassword}>
                    <FormControl type={this.state.passType} disabled={this.state.isDisablePassword} placeholder="Enter Password"
                      style={{width:326,height:40,border:this.state.passwordBorderColor,borderRadius:0}}
                      onChange={this.handlePassword}/>
                  </OverlayTrigger>
                  <div  style={{width:'326px',textAlign:'right',marginBottom:'31px'}}>
                    <a style={{cursor: "pointer",fontFamily:"Source Sans Pro",fontSize:'15px'}} onClick={this.charecterShowHide}>{this.state.showPwdDescription}</a>
                  </div>
                </FormGroup>

                <div style={{width:'326px',textAlign:'right'}}>
                  <Button style={{border:'1px solid #4C58A4',borderRadius:0}} id='cancelCredential' onClick={this.handleCancel}>Cancel </Button>
                    {'        '}
                  <Button disabled={this.state.addButtonDisability} id='saveCredentials' className={btnPrimary} style={{border:'1px solid #4C58A4',borderRadius:0,marginLeft:'12px', color:'white'}} onClick={this.handleSave}> {this.state.addButtonName} </Button>
                </div>
            </fieldset>
          </div>
        </div>
        }
        <br/>
        <br/>
      </div>
    </div>
  );
}})
export {ResourceCredentials}
