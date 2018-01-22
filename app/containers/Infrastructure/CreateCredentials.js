import React, {PropTypes} from 'react'
import { modalContainer, CreateGroupDialogClass, CredentialsDialogClass, modalCloseStyle, closeButtonClass} from './styles.css'
import { blueBtn, btnPrimary,modalDialogClass} from 'sharedStyles/styles.css'
import {Popover,Tooltip,Table, Modal,ButtonToolbar,ButtonGroup,Label, Button , SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio,fieldset,legend,Glyphicon} from 'react-bootstrap'
import {dotted,fileGlyph,ulStyle,liStyle,italic1,infoCircle} from './styles.css'
import Joi from 'joi-browser'
import getCredentialsList from 'helpers/credentials'
import {putCredential, uploadFile} from 'helpers/credentials'
import { selectStyle} from 'sharedStyles/styles.css'
import Select from 'react-select'

const CredIntro = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#454855', paddingBottom: 10}}>
                    Ready to create new credentials ?</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>By adding new credentials</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>you will be able to run discovery and assessment. </td></tr>
        </tbody>
      </table>
    )
  }
})


const CreateCredentials = React.createClass({
  getInitialState() {
    return { showAddModal: false,
      singleTypeSelectionField:true,
      credType:'',
      credUsage:'',
      credUsername:'',
      credpwd:'',
      credLabel:'',
      isSelectedType:false,
      isSelectedUsage:false,
      userNameEntered:false,
      isLabelSet:false,
      pwdEntered:false,
      addButtonDisability:true,
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
      credentialsPemKey_Message:'Upload a PEM Key file',
      tooltipPwdHeight:'40px',
      tooltipLabelHeight:'40px',
      tooltipUnameHeight:'40px',
      CredentialsType_validation:'',
      Usage_Validation:'',
      Username_Validation:'',
      CredentialLabel_validation:'',
      showPemWithRadioButtons:false,
      showPwdDescription:"Show characters",
      passType:"password",
      doneButton:'Save',
      selectedOption : 'PemKey',
      passwordOverlaytrigger:"",
      pemOverlayTrigger:"hover",
      uploadFileName:"",
      pemAreaColor:'white',
      credTypeOverlayTrigger:"hover",
      credLabelOverlayTrigger:"hover",
      credUsageOverlayTrigger:"hover",
      credUnameOverlayTrigger:"hover",
      pemFileExists:false,
      saveandadd:"Save and add another",
      credentialType:[
        {label:'Select a credential type', value:'' },
        {label:'Linux Servers - SSH', value:'linux-server' },
        {label:'Windows Administrator', value:'windows-server' },
      ],
      usageOption:[
    		{label:'Select Usage', value:'' },
    		{label:'Global - tried on all devices', value:'Global' },
    		{label:'Restricted - used only on assigned devices', value:'Restricted' },
  	  ],
      selectedUsageNew:''
      };
  },

  save(ev) {
    let label = this.state.credLabel;
    let ncredType=this.state.credType;
    let loginId=formControlsUsername.value;
    let password=formPassword.value;
    let usage=this.state.selectedUsageNew;
    let pemFileName='';
    if(this.state.selectedOption==="PemKey"){
      password='';
      pemFileName=document.getElementById('uploadBtn').files[0].name
      var data = new FormData();
      data.append('file', document.getElementById('uploadBtn').files[0]);
      uploadFile(data)
      .then((response)=>{
        this.saveCredentials(label, ncredType, loginId, password, usage, pemFileName)
      })
      .catch((error)=>{
        console.log("error in saving pem file "+error)
      })

    }
    else{
      //password selection
      this.saveCredentials(label, ncredType, loginId, password, usage, pemFileName)
    }

  },



  saveAndAddOther(){
    let label = this.state.credLabel;
    let ncredType=this.state.credType;
    let loginId=formControlsUsername.value;
    let password=formPassword.value;
    let usage=this.state.selectedUsageNew;
    let pemFileName='';
    if(this.state.selectedOption==="PemKey"){
      password='';
      pemFileName=document.getElementById('uploadBtn').files[0].name
      var data = new FormData();
      data.append('file', document.getElementById('uploadBtn').files[0]);
      uploadFile(data)
      .then((response)=>{
        this.saveCredentialsandAdd(label, ncredType, loginId, password, usage, pemFileName)
      })
      .catch((error)=>{
        console.log("error in saving pem file "+error)
      })

    }
    else{
      //password selection
      this.saveCredentialsandAdd(label, ncredType, loginId, password, usage, pemFileName)
    }

  },

  handleCancel(){
    this.setState({showAddModal:false,
      singleTypeSelectionField:true,
      selectedOption : 'PemKey',
      isDisablePassword:true,
      isDisablePem:false,
      isSelectedType:false,
      isSelectedUsage:false,
      userNameEntered:false,
      isLabelSet:false,
      pwdEntered:false,
      addButtonDisability:true,
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
      credentialsPemKey_Message:'Upload a PEM Key file',
      tooltipPwdHeight:'40px',
      tooltipLabelHeight:'40px',
      tooltipUnameHeight:'40px',
      tooltipUnameHeight:'40px',
      CredentialsType_validation:'',
      Usage_Validation:'',
      Username_Validation:'',
      CredentialLabel_validation:'',
      showPemWithRadioButtons:false,
      showPwdDescription:"Show characters",
      passType:"password",
      doneButton:'Save',
      uploadFileName:"",
      pemAreaColor:'white',
      credTypeOverlayTrigger:"hover",
      credLabelOverlayTrigger:"hover",
      credUsageOverlayTrigger:"hover",
      credUnameOverlayTrigger:"hover",
      pemFileExists:false,
      credType:'',
      selectedUsageNew:''
    })
    this.props.refreshCredentialsList();
  },

  handleSelectTypeChanges(type){
    this.setState({selectedUsageNew:''})
    this.state.credType=type
    if(this.state.credType==''){
      this.setState({credTypeOverlayTrigger:"hover"})
      this.refs.credType.show();
    }else{
      this.setState({credTypeOverlayTrigger:''})
      this.refs.credType.hide();
    }
    this.setState({singleTypeSelectionField:false,
      credType:type})
     if(this.state.credType == 'linux-server')
     {
      this.refs.credType.hide();
      this.setState({ showUsernameField: true,
                    showAuthenticationField: true,
                    isSelectedType:true,
                    showPemWithRadioButtons:true,
                    credTypeOverlayTrigger:''});
      if(this.state.selectedOption=="Password"){
        //++++++++ password selection +++++++++++

        //++++++++ Common settings +++++++++++
        this.setState({
          isDisablePassword : false,
          isDisablePem : true,
          pemOverlayTrigger:""
        })
        //++++++++ password check +++++++++++
        if(formPassword.value!=''){
           this.setState({passwordOverlaytrigger:[],
            pwdEntered:true})
        }else{
          this.setState({passwordOverlaytrigger:['hover','focus'],
            pwdEntered:false})
        }
      }else{
        //+++++++++ pemSelection ++++++++++
         this.setState({ isDisablePassword : true,
                    isDisablePem : false,
                    pemAreaColor:'white'})

         if(this.state.pemFileExists) {
            this.setState({pemOverlayTrigger:[]})
         }else{
          this.setState({pemOverlayTrigger:['hover','focus']})
         }

        //let pemFileName=document.getElementById('uploadBtn').files[0].name
      }
    }
    if(this.state.credType  == 'windows-server'){
      this.refs.credType.hide();
      this.setState({
                    showUsernameField: true,
                    showAuthenticationField:false,
                    isSelectedType:true,
                    showPemWithRadioButtons:false,
                    isDisablePassword:false,
                    selectedOption:"Password"},function(){
                       if(formPassword.value!=''){
           this.setState({passwordOverlaytrigger:[],
            pwdEntered:true})
        }else{
          this.setState({passwordOverlaytrigger:['hover','focus'],
            pwdEntered:false})
        }
                    });
    }
    let CredentialsType_schema = {
      CredentialsType: Joi.string().required(),
    };
    let result = Joi.validate({CredentialsType: type.target.value}, CredentialsType_schema)
    if(result.error)
    {
      this.refs.credType.show();
      this.setState({
        credentialsType_Message:"Select credential type to add a new credential",
        CredentialsType_validation: 'error',
        addButtonDisability:true,
        isSelectedType:false
      })
      this.state.credentialsTypeBorderColor='1px solid #FF444D'
    }else
    {
      this.refs.credType.hide();
      this.setState({CredentialsType_validation : 'success',
      isSelectedType:true
      })
      this.state.credentialsTypeBorderColor='1px solid #00C484'
      this.refs.credType.hide();
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pwdEntered && this.state.isLabelSet){
        this.setState({addButtonDisability:false})
      }
    }
    
  },

  handleUsage(usage){
    this.setState({selectedUsageNew:usage})
    if(usage==""){
      this.setState({credUsageOverlayTrigger:"hover"})
      this.refs.credUsage.show();
    }else{
      this.setState({credUsageOverlayTrigger:''})
      this.refs.credUsage.hide();
    }
    this.setState({isSelectedUsage:true, selectedUsage:usage})
    //+++++++++++ Usage Validation ++++++++++++++++++
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
          credUsageOverlayTrigger:"hover"
        })
        this.refs.credUsage.show();
        this.state.credentialsUsageBorderColor='1px solid #FF444D'
    }else
    {
      this.refs.credUsage.hide();
      this.setState({Usage_Validation : 'success',
        isSelectedUsage:true,
        credUsage:usage,
        credUsageOverlayTrigger:""
      })
      this.state.isSelectedUsage=true
      this.state.credentialsUsageBorderColor='1px solid #00C484'
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pwdEntered && this.state.isLabelSet){
        this.setState({addButtonDisability:false})
      }
    }
  },


  handleOptionChange: function (changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value,
    });
    if(changeEvent.target.value == 'Password')
    {
      //+++++++ Password option selection +++++++++++++
      this.setState({
        isDisablePem : true,
        isDisablePassword : false,
        pemOverlayTrigger:[],
        pemAreaColor:'#eee'
      });
      document.getElementById("uploadBtn").disabled = true;
      if(formPassword.value==''){
        this.setState({pwdEntered:false,
          passwordOverlaytrigger:['hover', 'focus']})
      }else{
        this.setState({pwdEntered:true,
          passwordOverlaytrigger:[]})
      }
    }
    else
    {
      //++++++++ PEM option selection +++++++++++++
         this.setState({
        //passwordBorderColor:'1.5px solid #4C58A4',
        isDisablePassword : true,
        isDisablePem : false,
        passwordOverlaytrigger:[],
        pemAreaColor:'white'
     });
      document.getElementById("uploadBtn").disabled = false;
      if(this.state.pemFileExists)
        this.setState({pemOverlayTrigger:[]})
      else
        this.setState({pemOverlayTrigger:['hover','focus']})
    }
    
    this.setState({passwordBorderColor: '1px solid #4C58A4' })
    formPassword.value=''
  },

   handlePassword(passwd){
    let Password_schema = {
      Password:  Joi.string().required(),
    };
    let result = Joi.validate({Password: passwd.target.value}, Password_schema)
    if(result.error)
    {
      this.setState({
        tooltipPwdHeight:'70px',
        credentialsPassword_Message: result.error.details[0].message,
        addButtonDisability:true,
        pwdEntered:false,
        passwordOverlaytrigger:['hover','focus']
      })
      this.state.passwordBorderColor='1px solid #FF444D'
      this.refs.infoPwd.show();
    }else
    {
      this.refs.infoPwd.hide();
      this.setState({
        tooltipPwdHeight:'40px',
        credentialsPassword_Message:'Password is required',
        pwdEntered:true,
        passwordOverlaytrigger:''
      })
      this.state.passwordBorderColor='1px solid #00C484'
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pwdEntered && this.state.isLabelSet)
      {
        this.setState({addButtonDisability:false})
      }
    }
  },

   handleUserName(uname){
    if(uname.target.value==""){
      this.setState({credUnameOverlayTrigger:"hover"})
      this.refs.credUname.show();
    }else{
      this.setState({credUnameOverlayTrigger:''})
      this.refs.credUname.hide();
    }
    let Username_schema = {
      Username: Joi.string().required(),
    };
    let result = Joi.validate({Username: uname.target.value}, Username_schema)
    if(result.error)
    {
      this.setState({
        tooltipUnameHeight:'70px',
        userName_Message: "Username must not be empty.",
        Username_Validation: 'error',
        addButtonDisability:true,
        userNameEntered:false,
        credUnameOverlayTrigger:"hover"
      })
      this.refs.credUname.show();
      this.state.userNameBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({
        tooltipUnameHeight:'40px',
        userName_Message: "Username is required",
        Username_Validation : 'success',
        userNameEntered:true,
        credUnameOverlayTrigger:""
      })
      this.refs.credUname.hide();
      this.state.userNameBorderColor='1px solid #00C484'
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pwdEntered && this.state.isLabelSet)
      {
        this.setState({addButtonDisability:false})
      }
    }
  },

  handleLabel(label){
    if(label.target.value==""){
      this.setState({credLabelOverlayTrigger:"hover"})
      this.refs.credLabel.show();
    }else{
      this.setState({credLabelOverlayTrigger:false})
      this.refs.credLabel.hide();
    }
    let Label_schema = {
      Label: Joi.string().required(),
    };
    let result = Joi.validate({Label: label.target.value}, Label_schema)
    if(result.error)
    {
      this.setState({
        tooltipLabelHeight:'40px',
        credentialsLabel_Message: "Label must not be empty.",
        CredentialLabel_validation: 'error',
        addButtonDisability:true,
        isLabelSet:false,
        credLabelOverlayTrigger:"hover"
      })
      this.refs.credLabel.show();
      this.state.labelBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({
        tooltipLabelHeight:'40px',
        credentialsLabel_Message: "Label is required",
        CredentialLabel_validation : 'success',
        isLabelSet:true,
        credLabel:label.target.value,
        credLabelOverlayTrigger:false
      })
      this.refs.credLabel.hide();
      this.state.labelBorderColor='1px solid #00C484'
      if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pwdEntered && this.state.isLabelSet)
      {
        this.setState({addButtonDisability:false})
      }
    }
  },

   handlePem(evt){
    let fileName=evt.target.files[0].name;
    let finalFileName=evt.target.files[0].name;
    var ext = fileName.substring(fileName.indexOf(".") + 1, fileName.length);
    if (ext != 'pem' && ext != 'PEM')
    {
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
                    pemFileExists:false,
                    addButtonDisability:true})
      this.refs.infoPem.show();
    }
    else
    {
      this.refs.infoPem.hide();
      this.setState({pemKeyBorderColor:'1px solid #4C58A4',
                    tooltipPemHeight:'40px',
                    pemOverlayTrigger:''})
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
            pemKeyBorderColor:'1px solid #4C58A4',
            credentialsPemKey_Message:'Upload PEM Key file'},function()
          {
            this.setState({uploadFileName:finalFileName});
            if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pemFileExists && this.state.isLabelSet)
            {
              this.setState({addButtonDisability:false})
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

  initializeStateAfterSave(){
    this.setState({
      singleTypeSelectionField:true,
      selectedOption : 'PemKey',
      isDisablePassword:true,
      isDisablePem:false,
      isSelectedType:false,
      isSelectedUsage:false,
      userNameEntered:false,
      isLabelSet:false,
      pwdEntered:false,
      addButtonDisability:true,
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
      credentialsPemKey_Message:'Upload a PEM Key file',
      tooltipPwdHeight:'40px',
      tooltipLabelHeight:'40px',
      tooltipUnameHeight:'40px',
      tooltipUnameHeight:'40px',
      CredentialsType_validation:'',
      Usage_Validation:'',
      Username_Validation:'',
      CredentialLabel_validation:'',
      showPemWithRadioButtons:false,
      showPwdDescription:"Show characters",
      passType:"password",
      doneButton:'Save',
      uploadFileName:"",
      pemAreaColor:'white',
      credTypeOverlayTrigger:"hover",
      credLabelOverlayTrigger:"hover",
      credUsageOverlayTrigger:"hover",
      credUnameOverlayTrigger:"hover",
      pemFileExists:false,
      credType:''
    })
    /* this.setState({
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
          credentialsTypeBorderColor:'1.5px solid #4C58A4',
          credentialsUsageBorderColor:'1.5px solid #4C58A4',
          userNameBorderColor:'1.5px solid #4C58A4',
          passwordBorderColor:'1.5px solid #4C58A4',
          pemKeyBorderColor:'1.5px solid #4C58A4',
          labelBorderColor:'1.5px solid #4C58A4',
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
          CredentialLabel_validation:'',
          showPemWithRadioButtons:false,
          showPwdDescription:"Show characters",
          passType:"password",
          showToolTipForType:"hover",
          showToolTipForLabel:"hover",
          showToolTipForUsage:"hover",
          showToolTipForUsername:"hover",
          pemOverlayTrigger:['hover','focus'],
          uploadFileName:"",
          pemAreaColor:'white',
          credType:''
        });*/
  },

 saveCredentials(label,ncredType,loginId,password,usage,pemFileName){
    this.setState({doneButton:'Saving'})
     putCredential(label,ncredType,loginId,password,usage,pemFileName)
    .then(
      (response) => {
        this.setState({doneButton:'Save',
          showAddModal:false},function(){
          this.props.refreshCredentialsList();
          this.initializeStateAfterSave();})
      }
    )
    .catch((error) => {
      this.setState({addButtonName:'Add',
      addButtonDisability:false})
        if(error.data.message != null && error.data.status != null && error.data.status===409){
          if(error.data.message.indexOf("Credentials already exists")>-1)
          {
            this.refs.credLabel.show();
            this.setState({credLabelOverlayTrigger:"hover",
              doneButton:'Save',
             credentialsLabel_Message : "Label already exists",
             CredentialLabel_validation: 'error',
             labelBorderColor:'1px solid #FF444D'
             })
          }
      }
       //e.preventDefault();
       return false;
    })
  },



   saveCredentialsandAdd(label,ncredType,loginId,password,usage,pemFileName){
    this.setState({saveandadd:'Saving Credential'})
     putCredential(label,ncredType,loginId,password,usage,pemFileName)
    .then(
      (response) => {
        this.setState({saveandadd:'Save and add another',
          singleTypeSelectionField:true,
          showAddModal:true},function(){
            this.refs.credType.show();
          this.initializeStateAfterSave();})
      }
    )
    .catch((error) => {
      this.setState({saveandadd:'Save and add another',
      addButtonDisability:false})
        if(error.data.message != null && error.data.status != null && error.data.status===409){
          if(error.data.message.indexOf("Credentials already exists")>-1)
          {
            this.refs.credLabel.show();
            this.setState({credLabelOverlayTrigger:"hover",
              doneButton:'Save',
             credentialsLabel_Message : "Label already exists",
             CredentialLabel_validation: 'error',
             labelBorderColor:'1px solid #FF444D'
             })
          }
      }
       //e.preventDefault();
       return false;
    })
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

  openModal(){
    this.setState({showAddModal:true})
  },

  closeAddModal(){
    this.setState({showAddModal:false})
    this.props.refreshCredentialsList();
  },

  render() {
   let close = () => this.setState({ show: false});

  let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid Navy',
        borderRadius: 0,
        marginTop: 100,
        width:500,
  }
  let tooltipeffect2= {color: 'black',borderWidth: 2,
                        borderRadius:0,width:180,height:70}
  const beforeLegendCredentialsTypeToolTip=(
    <Popover id='initialToolTip' style={tooltipeffect2}>{'Select credential type to add a new credential'}</Popover>
    );

    const tooltipCredentialsType = (
      <Popover id='credTypePopover' style={tooltipeffect2}>
        {this.state.credentialsType_Message}
      </Popover>
    );

    const tooltipCredentialsUsage = (
      <Popover id='credUsagePopover' style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:40}}>
        {this.state.credentialsUsage_Message}
      </Popover>
    );

    const tooltipCredentialsUsername = (
      <Popover id='credUnamePopover' style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipUnameHeightLabel}}>
        {this.state.userName_Message}
      </Popover>
    );

    const tooltipLabel = (
      <Popover id='credLabelPopover' style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipLabelHeight}}>
        {this.state.credentialsLabel_Message}
      </Popover>
    );

     const tooltipPassword = (
      <Popover id='credPwdPopover' style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipPwdHeight}}>
        {this.state.credentialsPassword_Message}
      </Popover>
      );

      const tooltipPem = (
        <Popover id='credPemPopover' style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipPemHeight}}>
        {this.state.credentialsPemKey_Message} </Popover>
      );
      if(this.state.selectedOption=="Password"){
        //++++++++++++ Password selection +++++++++++
        if(this.state.isSelectedType && this.state.isSelectedUsage &&
            this.state.userNameEntered && this.state.pwdEntered && this.state.isLabelSet)
       {
        this.state.addButtonDisability=false
      }
        else{
          this.state.addButtonDisability=true
        }
      }
      else{
          //++++++++++Pem selection ++++++++++++++++
           if(this.state.isSelectedType && this.state.isSelectedUsage &&
            this.state.userNameEntered && this.state.pemFileExists && this.state.isLabelSet)
        {
          this.state.addButtonDisability=false
        }
          else{
          this.state.addButtonDisability=true
        }
      }
      console.log("credType"+this.state.credType)
  return (
    <span className={modalContainer}>
    {(this.props.totalCredsCount >0)?
      <a href='JavaScript: void(0)' onClick={this.openModal}>
        Add
      </a>
    :
      <Button href='JavaScript: void(0)' onClick={this.openModal} bsStyle='primary' bsSize='large' className={btnPrimary} style={{borderRadius: 0, marginTop: 20,marginBottom: 20,width:'300px'}}>
        Create Credentials
      </Button>

      }

      <Modal
          show={this.state.showAddModal}
          onHide={this.closeAddModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={CredentialsDialogClass}
          backdrop='static'
          keyboard={false}
      >
           <form style={{border: '1px solid Navy'}}>
            <a className={modalCloseStyle} onClick={this.closeAddModal}>
              x
            </a>
            <div style={{marginTop:'8px',padding:'0 0 15px 10px'}}>
              <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
                <Modal.Title id="contained-modal-title"
                  style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'ADD CREDENTIAL'}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body style={{marginLeft:'50px'}}>
                <div>
                  {this.state.singleTypeSelectionField?
                    <div>
                      <FormGroup controlId="credentialsSelect">
                        <Col xs={12} style={{marginBottom:15}}>
                          <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Credential Type</ControlLabel>
                        <OverlayTrigger ref="credType" placement="right" overlay={beforeLegendCredentialsTypeToolTip}>
                          <Select className="dropdownForm" placeholder="Select Credential Type"
                            style={{marginLeft:25}}
                            inputProps={{"id":"selectCredentials"}}
                            name='selectCredentials'
                            value={this.state.credType}
                            options={this.state.credentialType}
                            searchable={true}
                            multi={false}
                            clearable={false}
                            allowCreate={false}
                            onChange={this.handleSelectTypeChanges}/>
                        </OverlayTrigger>
                        </Col>
                      </FormGroup>
                    
                    </div>
                  :
                  <div>
                    <FormGroup controlId="Selectcredentials">
                      <Col xs={12} style={{marginBottom:15}}>
                        <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Credential Type</ControlLabel>
                      
                      <OverlayTrigger ref="credType" placement="right" overlay={tooltipCredentialsType} trigger={this.state.credTypeOverlayTrigger}>
                        <Select className="dropdownForm" placeholder="Select Credential Type"
                            style={{marginLeft:25}}
                            value={this.state.credType}
                            options={this.state.credentialType}
                            inputProps={{"id":"credentialsSelect"}}
                            name='credentialsSelect'
                            searchable={true}
                            multi={false}
                            clearable={false}
                            allowCreate={false}
                            onChange={this.handleSelectTypeChanges}/>
                      </OverlayTrigger>
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formControlsLabel">
                      <Col xs={12}>
                        <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Label</ControlLabel>
                      </Col>
                      <OverlayTrigger ref="credLabel" trigger={this.state.credLabelOverlayTrigger} placement="right" overlay={tooltipLabel}>
                        <FormControl type="text"  placeholder="Enter Label for Credential" style={{width:326, height:40, marginLeft:15, border:this.state.labelBorderColor, borderRadius:0}} onChange={this.handleLabel} validationState={this.state.CredentialLabel_validation}/>
                      </OverlayTrigger>
                    </FormGroup>

                    <FormGroup controlId="formControlsUsage">
                      <Col xs={12} style={{marginBottom:15}}>
                        <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Usage</ControlLabel>
                      <OverlayTrigger placement="right" ref="credUsage" trigger={this.state.credUsageOverlayTrigger} overlay={tooltipCredentialsUsage}>
                        <Select className="dropdownForm" placeholder="Select Credential Type"
                          style={{marginLeft:25}}
                          value={this.state.selectedUsageNew}
                          inputProps={{"id":"credentialsUsage"}}
                          name='credentialsUsage'
                          options={this.state.usageOption}
                          searchable={true}
                          multi={false}
                          clearable={false}
                          allowCreate={false}
                          onChange={this.handleUsage}/>
                      </OverlayTrigger>
                      </Col>
                   </FormGroup>

                    {this.state.showUsernameField?
                      <div>
                        <FormGroup controlId="formControlsUsername">
                          <Col xs={12}>
                            <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Username</ControlLabel>
                          </Col>
                            <OverlayTrigger placement="right" ref="credUname" trigger={this.state.credUnameOverlayTrigger} overlay={tooltipCredentialsUsername}>
                              <FormControl type="text"  name="credentialsUsername" placeholder="Enter Username" style={{width:326,height:40,marginLeft:15, border:this.state.userNameBorderColor,borderRadius:0}} onChange={this.handleUserName} validationState={this.state.Username_Validation}/>
                            </OverlayTrigger>
                        </FormGroup>
                      </div>
                      :<div></div>
                      }
                      {this.state.showAuthenticationField?
                        <div>
                          <div>
                            <FormGroup controlId="formControlsAuthentication">
                              <Col xs={12}>
                                <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Authentication</ControlLabel>
                              </Col>
                            </FormGroup>
                          </div>
                          {this.state.showPemWithRadioButtons?
                          <div>
                            <div className="form-group option_field radio" id="grping-server">
                              <div className="row col-xs-12 pull-right">
                                <input type="radio" name="authenticate" id="formControlsPassword" value="Password" checked={this.state.selectedOption === 'Password'} onChange={this.handleOptionChange}/>
                                Use Password &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" name="authenticate" id="formControlsPemKey" value="PemKey" checked={this.state.selectedOption === 'PemKey'} onChange={this.handleOptionChange}/>
                                Use Key-Pair
                              </div>
                            </div>
                            <br/>
                            <br/>
                            <br/>

                            <FormGroup controlId="formPemkey">
                              <Col xs={12}>
                                <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Pem Key File</ControlLabel>
                              </Col>
                              <FormGroup style={{width:'326px', marginLeft:15}}>
                               <OverlayTrigger ref="infoPem" trigger={this.state.pemOverlayTrigger} placement="right" overlay={tooltipPem}>
                                  <div>
                                    <div id="uploadFileDiv" style={{display:'inline-block', border:this.state.pemKeyBorderColor, backgroundColor:this.state.pemAreaColor, paddingTop:'8px', paddingLeft:'12px', paddingBottom:'3px', paddingRight:'12px', width:258,height:40}}>
                                      {this.state.uploadFileName}&nbsp; {(this.state.uploadFileName === "") ?<i>Click Browse to add PEM key file</i>: <noscript/>}
                                    </div>
                                    <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0, marginTop:'-2px'}}>
                                      <input id="uploadBtn" name="file" type="file" accept=".pem" onChange={this.handlePem} style={{borderRadius:0, width: 70, height: 50, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>
                                      <span style={{position:'absolute',top:'455px',left:'298px',WebkitUserSelect: 'none', pointerEvents:'none',borderRadius:0}}>Browse</span>
                                    </div>
                                  </div>
                                </OverlayTrigger>
                              </FormGroup>
                            </FormGroup>
                          </div>
                          :<div></div>
                          }
                        </div>
                      :<div></div>
                      }
                      <FormGroup controlId="formPassword">
                        <Col xs={12}>
                          <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Password</ControlLabel>
                        </Col>
                        <OverlayTrigger trigger={this.state.passwordOverlaytrigger} placement="right" ref="infoPwd" overlay={tooltipPassword}>
                          <FormControl type={this.state.passType} disabled={this.state.isDisablePassword} placeholder="Enter Password" style={{width:326,height:40, marginLeft:15,border:this.state.passwordBorderColor,borderRadius:0}} onChange={this.handlePassword}/>
                        </OverlayTrigger>
                        <div  style={{width:'326px',marginLeft:15, textAlign:'right'}}>
                          <a style={{cursor: "pointer",fontFamily:"Source Sans Pro",fontSize:'15px'}} onClick={this.charecterShowHide}>{this.state.showPwdDescription}</a>
                        </div>
                      </FormGroup>
                    </div>
                    }
                </div>
              </Modal.Body>
              <Modal.Footer style={{marginRight:80, paddingRight:0, marginBottom:15,borderTop:0}}>
                <Button className={blueBtn} id='cancel' onClick={this.handleCancel}>Cancel</Button>
                &nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                  onClick={this.save} id='save' disabled={this.state.addButtonDisability}>
                  {this.state.doneButton}
                </Button>
                <Button bsStyle='primary' id='saveAndAddNew' className={btnPrimary} style={{borderRadius:0}}
                 onClick={this.saveAndAddOther} disabled={this.state.addButtonDisability}>
                  {this.state.saveandadd}</Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
})

export default CreateCredentials
