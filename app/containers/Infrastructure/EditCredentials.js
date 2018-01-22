import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { modalContainer , CredentialsDialogClass, modalCloseStyle, closeButtonClass} from './styles.css'
import { blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import getCredentialsList from 'helpers/credentials'
import {getCredentialsById,updateCredentialById, uploadFile, updateCredentialByLabel} from 'helpers/credentials'
import {dotted,fileGlyph} from './styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, OverlayTrigger, ControlLabel ,Glyphicon, Popover} from 'react-bootstrap'
import Joi from 'joi-browser'
import {selectStyle} from 'sharedStyles/styles.css'
import {SpinnyLogo} from 'containers'
import Select from 'react-select'

const EditCredentials = React.createClass({

  getInitialState() {
    return {
      showEditModal: false ,
      credType:'',
      credUsage:'',
      credUsername:'',
      credPassword:'',
      oPwd:'',
      credLabel:'',
      keyPairFilePath:'',
      showAuthenticationField:false,
      showPemWithRadioButtons:false,
      selectedOption : 'PemKey',
      isDisablePassword:true,
      isDisablePem:false,
      loadingInfo:false,
      passType:"password",
      showPwdDescription:"Show characters",
      pemKeyBorderColor:'1px solid #4C58A4',
      passwordBorderColor:'1px solid #4C58A4',
      pemAreaColor:'white',
      uploadFileName:"",
      tooltipPemHeight:'40px',
      credentialsPemKey_Message:'Upload PEM Key file',
      credentialsType_Message:'Select credential type to add a new credential',
      pemFile:'',
      done:true,
      inputUploadDisability:true,
      userName_Message:'Username is required',
      tooltipUnameHeight:'40px',
      Username_Validation:'',
      userNameBorderColor:'1px solid #4C58A4',
      credentialsTypeBorderColor:'1px solid #4C58A4',
      pemFileExists:true,
      tooltipPwdHeight:'40px',
      credentialsPassword_Message:'Password is required',
      usernameOverlayTrigger:"hover",
      credTypeOverlayTrigger:"hover",
      displayShowHideCharecter:false,
      firstTimePwdClick:true,
      credentialType:[
        {label:'Select a credential type', value:'' },
        {label:'Linux Servers - SSH', value:'linux-server' },
        {label:'Windows Administrator', value:'windows-server' },
      ],
    };
  },

  functionSetState(){
    this.setState({
      showEditModal: false ,
      credType:'',
      credUsage:'',
      credUsername:'',
      credPassword:'',
      oPwd:'',
      credLabel:'',
      keyPairFilePath:'',
      showAuthenticationField:false,
      showPemWithRadioButtons:false,
      selectedOption : 'PemKey',
      isDisablePassword:true,
      isDisablePem:false,
      loadingInfo:false,
      passType:"password",
      showPwdDescription:"Show characters",
      pemKeyBorderColor:'1px solid #4C58A4',
      pemAreaColor:'white',
      uploadFileName:"",
      tooltipPemHeight:'40px',
      credentialsPemKey_Message:'Upload PEM Key file',
      credentialsType_Message:'Select credential type to add a new credential',
      pemFile:'',
      done:true,
      inputUploadDisability:true,
      userName_Message:'Username is required',
      tooltipUnameHeight:'40px',
      Username_Validation:'',
      userNameBorderColor:'1px solid #4C58A4',
      pemFileExists:true,
      tooltipPwdHeight:'40px',
      credentialsPassword_Message:'Password is required',
      passwordBorderColor:'1px solid #4C58A4',
      credentialsTypeBorderColor:'1px solid #4C58A4',
      usernameOverlayTrigger:"hover",
      credTypeOverlayTrigger:"hover",
      displayShowHideCharecter:false,
      firstTimePwdClick:true
    })
  },

  closeEdit() {
    this.functionSetState();
  },

  openEdit(){
    let credId=this.props.editCredId;
    this.setState({loadingInfo:true,
    showEditModal:true})

    getCredentialsById(this.props.editCredId)
    .then(
        (response) => {
           this.setState({
              credType:response.data.credentialType,
              credUsage:response.data.usage,
              credUsername:response.data.username,
              credLabel:response.data.label,
              credPassword:response.data.password,
              oPwd:response.data.password,
              keyPairFilePath:response.data.keyPairFilePath,
              pemFile:response.data.pemFile})

           if(this.state.credType==='linux-server')
            {
              //++++++++++ OverlayForUserName Check ++++++++++++++++
              if(this.state.credUsername!=''){
                this.setState({usernameOverlayTrigger:false})
              }
               //++++++++++ OverlayForType Check ++++++++++++++++
              if(this.state.credType!=''){
                this.setState({credTypeOverlayTrigger:false})
              }
              this.setState({showAuthenticationField:true,
                           showPemWithRadioButtons:true,})
              if(this.state.oPwd!="" && this.state.oPwd != null)
              {
                //++++++++++Password Selection++++++++++++++++++++++
                this.setState({isDisablePem:true,
                  isDisablePassword:false,
                  selectedOption:"Password",
                  pemAreaColor:'#eee',
                  inputUploadDisability:true,
                  passwordOverlaytrigger:[],
                  pemOverlayTrigger:[],
                  pemFileExists:false
                })
              }
             else
              {
                //++++++++++Pem Key Selection++++++++++++++++++++++
                this.setState({isDisablePassword:true,
                  isDisablePem:false,
                  selectedOption:"PemKey",
                  pemAreaColor:'white',
                  uploadFileName:this.state.pemFile,
                  inputUploadDisability:false,
                  passwordOverlaytrigger:[],
                  pemOverlayTrigger:[],
                  pemFileExists:true
                  //this.state.keyPairFilePath.split('\\').pop().split('/').pop()
                })
              }
            }

            if(this.state.credType==='windows-server'){
              //++++++++++ OverlayForUserName Check ++++++++++++++++
              if(this.state.credUsername!=''){
                this.setState({usernameOverlayTrigger:false})
              }

               //++++++++++ OverlayForType Check ++++++++++++++++
              if(this.state.credType!=''){
                this.setState({credTypeOverlayTrigger:false})
              }

             this.setState({
              showAuthenticationField:false,
              showPemWithRadioButtons:false,
              passwordOverlaytrigger:[],
              selectedOption:"Password",
              isDisablePassword:false})
           }
           this.setState({loadingInfo:false})
    })
    .catch((error) => console.log("Error in getCredentialsById in container:" + error))

  },

  handleCredType(type)
  {
    if(type==''){
      this.setState({credTypeOverlayTrigger:"hover"})
    }
    this.setState({credType:type},function()
    {
      if(this.state.credType == 'linux-server')
      {
        this.setState({showAuthenticationField:true,
                      showPemWithRadioButtons:true,
                      credTypeOverlayTrigger:false})
         if(this.state.oPwd==""){
            this.setState({passwordOverlaytrigger:"hover"})
            this.refs.infoPwd.show();
          }else{
            this.setState({passwordOverlaytrigger:false})
            this.refs.infoPwd.hide();
          }
        if(this.state.oPwd!="" && this.state.oPwd != null)
        {
          //++++++++++Password Selection++++++++++++++++++++++
          this.setState({
            isDisablePem:true,
            isDisablePassword:false,
            selectedOption:"Password",
            pemAreaColor:'#eee',
            inputUploadDisability:true,
            //passwordOverlaytrigger:['hover', 'focus'],
            pemOverlayTrigger:[],
            pemFileExists:false
          })

        }
        else
        {
          //++++++++++Pem Key Selection++++++++++++++++++++++
          this.setState({isDisablePassword:true,
            isDisablePem:false,
            selectedOption:"PemKey",
            pemAreaColor:'white',
            uploadFileName:this.state.pemFile,
            inputUploadDisability:false,
            passwordOverlaytrigger:[],
            //pemOverlayTrigger:['hover','focus'],
            pemFileExists:true
            //this.state.keyPairFilePath.split('\\').pop().split('/').pop()
          })
          if(this.state.pemFile==""){
             this.setState({pemOverlayTrigger:"hover"})
            this.refs.infoPem.show();

          }else{
           this.setState({pemOverlayTrigger:false})
            this.refs.infoPem.hide();
          }

        }
      }
      if(this.state.credType  == 'windows-server')
      {
        this.setState({
          credTypeOverlayTrigger:false,
          showAuthenticationField:false,
          isSelectedType:true,
          showPemWithRadioButtons:false,
          isDisablePassword:false,
          selectedOption:"Password"});
        if(this.state.oPwd==""){
          this.setState({passwordOverlaytrigger:['hover']})
          this.refs.infoPwd.show();
        }else{
          this.setState({passwordOverlaytrigger:false})
          this.refs.infoPwd.hide();
        }
      }
    }.bind(this))
    //+++++++++++++Credential Type Validation +++++++++++++
    let CredentialsType_schema = {
      CredentialsType: Joi.string().required(),
    };
    let result = Joi.validate({CredentialsType: type.target.value}, CredentialsType_schema)
    if(result.error)
    {
      console.log("error is "+result.error.details[0].message)
      this.setState({
        credentialsType_Message:"Select credential type to add a new credential",
        CredentialsType_validation: 'error',
        addButtonDisability:true,
        isSelectedType:false,
        credTypeOverlayTrigger:"hover"
      })
      this.state.credentialsTypeBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({
        CredentialsType_validation : 'success',
        isSelectedType:true,
        credTypeOverlayTrigger:false
      })
      this.state.credTypeOverlayTrigger=""
      this.refs.credType.hide();
      this.state.credentialsTypeBorderColor='1px solid #00C484'
    }
  },

  //+++++++ for show/hide charecters ++++++++++++ //
  charecterShowHide(){
    let node = ReactDOM.findDOMNode(this.refs.inputNode);
    if (node && node.focus instanceof Function) {
            node.focus();
        }
    //this.refs.inputPwd.focus();
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

  handleOptionChange: function (changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value,
    });
    if(changeEvent.target.value === "Password")
    {
      this.refs.infoPem.hide();
      this.setState({
        isDisablePem : true,
        isDisablePassword : false,
        pemAreaColor:'#eee',
        pemOverlayTrigger:[],
        inputUploadDisability:true
      });
      //+++++++++++++ check if pwd is empty +++++++++++++
      if(this.state.credPassword!=''){
        this.setState({passwordOverlaytrigger:false})
        this.refs.infoPwd.hide();


      }else{
        this.setState({passwordOverlaytrigger:"hover"})
        this.refs.infoPwd.show();
      }

     /* if(formPassword.value==''){
        this.setState({pwdEntered:false})
      }*/
    }
    else
    {
      //formPassword.value='';
      this.setState({
        isDisablePassword : true,
        isDisablePem : false,
        pemAreaColor:'white',
        passwordOverlaytrigger:[],
        pemOverlayTrigger:"hover",
        inputUploadDisability:false
     });
      if(this.state.uploadFileName!=''){
        this.setState({pemOverlayTrigger:false})
        this.refs.infoPem.hide();
      }else{
        this.setState({pemOverlayTrigger:"hover"})
        this.refs.infoPem.show();
      }
    }
  },

  saveChanges(){
    if(this.state.selectedOption==="PemKey"){
      //++++++++++ PemKey Selection +++++++++++++++
      this.setState({credPassword:""})
      if( document.getElementById('uploadBtn').files.length>0)
      {//++++++++++Change for PEM Key Selection+++++++++++++
        let pemFileName=document.getElementById('uploadBtn').files[0].name
        this.setState({pemFile:pemFileName})
        var data = new FormData();
        data.append('file', document.getElementById('uploadBtn').files[0]);
        data.append('label', this.props.label);
        uploadFile(data)
        .then((response)=>{
          this.credentialsUpdate(this.props.label, this.state.credUsername, this.state.credPassword, this.state.credUsage, this.state.credType, this.state.pemFile, this.state.keyPairFilePath)
        })
        .catch((error)=>{
          console.log("error in saving pem file "+error)
        })
      }
      else{
        //++++++++++No Change for PEM Key Selection+++++++++++++
        this.setState({credPassword:""},
          function(){
          this.credentialsUpdate(this.props.label, this.state.credUsername, this.state.credPassword, this.state.credUsage,this.state.credType, this.state.pemFile, this.state.keyPairFilePath)
        }.bind(this))
      }
  }
    else{
      //++++++++++ Password selection +++++++++++++
      if(this.state.credPassword===this.state.oPwd){
        this.setState({credPassword:"null",
                      pemFile:""},function(){
        this.credentialsUpdate(this.props.editCredId, this.state.credLabel, this.state.credUsername, this.state.credPassword, this.state.credUsage,this.state.credType, this.state.pemFile)
       }.bind(this))
      }
      else
      { 
        this.setState({pemFile:""},function(){
          this.credentialsUpdate(this.props.editCredId, this.state.credLabel, this.state.credUsername, this.state.credPassword, this.state.credUsage, this.state.credType,this.state.pemFile)
        }.bind(this))
        
      }
    }
  },

  credentialsUpdate(){
    // updateCredentialById(this.props.editCredId,this.state.credLabel,this.state.credUsername,this.state.credPassword,this.state.credUsage,this.state.credType, this.state.pemFile)
    //    .then(
    //     (response) => {
    //       this.props.refreshCredentialsList();
    //       this.props.removeFromSelected(this.props.editCredId[0]);
    //       //console.log('response is '+JSON.stringify(response))
    //         })
    // .catch((error) => console.log("Error in updateCredentialById in container:" + error))
    updateCredentialByLabel(this.props.label,this.state.credUsername,this.state.credPassword,this.state.credUsage,this.state.credType, this.state.pemFile, this.state.keyPairFilePath)
      .then(
        (response) => {
          this.props.refreshCredentialsList();
          this.props.removeFromSelected(this.props.editCredId[0]);
          //console.log('response is '+JSON.stringify(response))
      })
      .catch((error) => console.log("Error in updateCredentialById in container:" + error))
    this.closeEdit()
  },

  handleUsage(usage){
    this.state.credUsage=usage.target.value
  },

  handleUsername(username){
    if(username.target.value!=''){
    this.setState({usernameOverlayTrigger:false})
  }
    this.setState({credUsername:username.target.value})
    let Username_schema = {
      Username: Joi.string().required(),
    };
    let result = Joi.validate({Username: username.target.value}, Username_schema)
    if(result.error)
    {

      this.setState({
        tooltipUnameHeight:'70px',
        userName_Message: "Username cannot be empty",
        Username_Validation: 'error',
        usernameOverlayTrigger:"hover"
      })
      this.state.userNameBorderColor='1px solid #FF444D'
      this.refs.infoUname.show();
    }else
    {
      this.setState({
        tooltipUnameHeight:'40px',
        userName_Message: "Username is required",
        Username_Validation : 'success',
        usernameOverlayTrigger:false
      })
      this.state.userNameBorderColor='1px solid #00C484'
      this.refs.infoUname.hide();
    }
    this.setState({credUsername:username.target.value})
  },

  handleLabel(label){
    this.setState({credLabel:label.target.value})
  },

  pwdClick(e){
    if(this.state.firstTimePwdClick){
    this.setState({
      credPassword:''})
 }else{
    this.setState({credPassword:e.target.value})
 } },

  pwdBlur(){
    if(this.state.credPassword=='')
    {
      this.setState({credPassword:this.state.oPwd,
                 displayShowHideCharecter:false,
                  passType:'Password' })
    this.setState({firstTimePwdClick:true})
    }else
    {
    this.setState({firstTimePwdClick:false})
    }
  },

  handlePassword(pwd){
    this.setState({displayShowHideCharecter:true,
                  firstTimePwdClick:false})
    if(pwd.target.value!=''){
      this.setState({passwordOverlaytrigger:false})
    }else{
      this.setState({
        passwordOverlaytrigger:['hover'],
        displayShowHideCharecter:false,
        passType:"password",
        showPwdDescription:"Show characters"
      })
    }
    this.setState({credPassword:pwd.target.value})
    let Password_schema = {
      Password:  Joi.string().required(),
    };
    let result = Joi.validate({Password: pwd.target.value}, Password_schema)
    if(result.error)
    {
      this.setState({
        tooltipPwdHeight:'70px',
        credentialsPassword_Message: "Password is not allowed to be empty",
        passwordOverlaytrigger:"hover"
        //passwordBorderColor:'1.5px solid #FF444D'
        /*Password_Validation: 'error',
        addButtonDisability:true,
        pwdEntered:false*/
      })
      //this.state.passwordBorderColor='1px solid #FF444D'
    }else
    {
      this.setState({
        tooltipPwdHeight:'40px',
        credentialsPassword_Message:'Password is required',
        passwordOverlaytrigger:false
        /*Password_Validation : 'success',
        pwdEntered:true*/
      })
      this.state.passwordOverlaytrigger=false
      //this.refs.infoPwd.hide();
      this.state.passwordBorderColor='1px solid #00C484'
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
                    pemOverlayTrigger:"hover",
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
            pemFile:finalFileName,
            credentialsPemKey_Message:'Upload PEM Key file'},function()
          {
            this.setState({uploadFileName:finalFileName});
          }.bind(this))
        }.bind(this)
        reader.onerror = function (evt) {
          console.log("error reading file "+evt);
        }
      }else{
        console.log("no file exists")
      }
    }

  },
  render() {
    let close = () => this.setState({ show: false});
    const tooltipCredentialsUsername = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipUnameHeightLabel}}>
        {this.state.userName_Message}
      </Popover>
    );

    const tooltipPem = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipPemHeight}}>
        {this.state.credentialsPemKey_Message} </Popover>
      );

    const tooltipPassword = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:this.state.tooltipPwdHeight}}>
        {this.state.credentialsPassword_Message}
      </Popover>
    );

    const tooltipCredentialsType = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:60}}>
        {this.state.credentialsType_Message}
      </Popover>
    );

    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid Navy',
        borderRadius: 0,
        marginTop: 100,
        width:500,
      }

      if(this.state.selectedOption=="PemKey"){
        if(this.state.pemFile!="" && this.state.pemFile!=null && this.state.pemFileExists==true && this.state.credUsername!="" && this.state.credUsername!=null && this.state.credType!="" && this.state.credType!=null){
          this.state.done=false
        }else{
          this.state.done=true //++++ Disabling done button ++++++
        }
      }else{
        if(/*this.state.credPassword!="" && this.state.credPassword!=null && */ this.state.credUsername!=""  && this.state.credUsername!=null && this.state.credType!="" && this.state.credType!=null){
          this.state.done=false //++++ Enabling done button ++++++
        }else{
          this.state.done=true
        }
      }
    return (
      <span className={modalContainer} >
        <a href='javascript:void(0)' onClick={this.openEdit} >
        Edit
        </a>
        <Modal show={this.state.showEditModal}
          onHide={this.closeEdit}
          aria-labelledby="contained-modal-title"
          backdrop='static'
          keyboard={false}
          dialogClassName={CredentialsDialogClass}>
          <form style={{border: '1px solid Navy'}}>
            <a className={modalCloseStyle} onClick={this.closeEdit}>
              x
            </a>
            <div style={{marginTop:'8px',paddingLeft:'10px'}}>
              <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
                <Modal.Title id="contained-modal-title"
                  style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'EDIT CREDENTIAL'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{marginLeft:'50px'}}>
                {this.state.loadingInfo?
                  <div style={{width:'90px',height:'90px',marginLeft:'150px'}}>
                    <SpinnyLogo />
                  </div>
                :
                <div>
                  <FormGroup controlId="formBasicText" >
                    <ControlLabel>Credential Type</ControlLabel>
                    <OverlayTrigger placement="right" trigger={this.state.credTypeOverlayTrigger} ref="credType" overlay={tooltipCredentialsType}>
                   
                    <Select className="dropdownForm" placeholder="Select Credential Type"
                      style={{marginLeft:25}}
                      value={this.state.credType}
                      inputProps={{"id":"credentialsSelect"}}
                      name='credentialsSelect'
                      options={this.state.credentialType}
                      searchable={true}
                      multi={false}
                      clearable={false}
                      allowCreate={false}
                      onChange={this.handleCredType}/>
                    </OverlayTrigger>
                  </FormGroup>

                  <FormGroup controlId="formControlsLabel">
                    <ControlLabel>Label</ControlLabel>
                    <FormControl type="text"  id='label' disabled={'true'} style={{width:326,height:40,border:'1px solid #4C58A4',borderRadius:0}} placeholder="Enter Label" value={this.state.credLabel} onChange={this.handleLabel}/>
                  </FormGroup>

                  <FormGroup controlId="formControlsUsage">
                  <ControlLabel>Usage</ControlLabel>
                  <FormControl className={selectStyle} componentClass="select"  disabled={'true'}  defaultValue={this.state.credUsage} placeholder="Select usage" style={{width:326,height:40,border:'1px solid #4C58A4',borderRadius:0}} onChange={this.handleUsage}>
                   <option value="">Select Usage</option>
                   <option value="Global">Global - tried on all devices</option>
                   <option value="Restricted">Restricted - used only on assigned devices</option>
                  </FormControl>
                 </FormGroup>

                  <FormGroup controlId="formControlsUsername">
                    <ControlLabel>Username</ControlLabel>
                    <OverlayTrigger placement="right"  trigger={this.state.usernameOverlayTrigger} ref="infoUname"  overlay={tooltipCredentialsUsername}>
                      <FormControl type="text" id='uname' name={this.state.credUsername} style={{width:326, height:40, border:this.state.userNameBorderColor, borderRadius:0}} placeholder="Enter Username" value={this.state.credUsername} onChange={this.handleUsername}/>
                    </OverlayTrigger>
                  </FormGroup>

                {this.state.showAuthenticationField?
                    <div>
                      <div>
                        <FormGroup controlId="formControlsAuthentication">
                          <ControlLabel>Authentication</ControlLabel>
                        </FormGroup>
                      </div>
                      {this.state.showPemWithRadioButtons?
                        <div>
                          <div className="form-group option_field radio" id="grping-server">
                            <div className="row col-xs-12 pull-right">
                              <input type="radio" name="authenticate" id="formControlsPassword" value="Password" checked={this.state.selectedOption === 'Password'} onChange={this.handleOptionChange}/>
                              <strong>Use Password &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                              <input type="radio" name="authenticate" id="formControlsPemKey" value="PemKey" checked={this.state.selectedOption === 'PemKey'} onChange={this.handleOptionChange}/>
                              <strong >Use Key-Pair </strong>
                            </div>
                          </div>
                          <br/>
                          <br/>

                          <FormGroup controlId="formPemkey">
                            <ControlLabel>Pem Key File</ControlLabel>
                            <FormGroup style={{width:'326px'}}>
                              <OverlayTrigger trigger={this.state.pemOverlayTrigger} ref="infoPem"  placement="right" overlay={tooltipPem}>
                                <div>
                                  <div id="uploadFileDiv" style={{display:'inline-block', border:this.state.pemKeyBorderColor, backgroundColor:this.state.pemAreaColor, paddingTop:'8px', paddingLeft:'12px', paddingBottom:'3px', paddingRight:'12px', width:258,height:40}}>
                                    {this.state.uploadFileName}&nbsp; {(this.state.uploadFileName === "") ?<i>Click Browse to add PEM key file</i>: <noscript/>}
                                  </div>
                                  <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0, marginTop:'-2px'}}>
                                    <input id="uploadBtn" disabled={this.state.inputUploadDisability} name="file" type="file" accept=".pem" onChange={this.handlePem} style={{borderRadius:0, width: 70, height: 50, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>
                                    <span style={{position:'absolute',top:'459px',left:'288px',WebkitUserSelect: 'none', pointerEvents:'none', borderRadius:0}}>Browse</span>
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
                        <ControlLabel>Password </ControlLabel>
                        {/*<OverlayTrigger trigger={this.state.passwordOverlaytrigger} placement="right" ref="infoPwd" overlay={tooltipPassword}>*/}
                          
                          <FormControl ref="inputNode" type={this.state.passType} disabled={this.state.isDisablePassword} 
                          placeholder="Enter Password"
                          id='credPwd'
                          style={{width:326, height:40, border:this.state.passwordBorderColor, borderRadius:0}}
                          onChange={this.handlePassword} 
                          value={this.state.credPassword}
                          onClick={this.pwdClick}
                          onBlur={this.pwdBlur}/>
                          
                        
                       {/*</OverlayTrigger>*/}
                        <div  style={{width:'326px',marginLeft:3, textAlign:'right', visibility:this.state.displayShowHideCharecter?'visible':'hidden'}}>
                          <a style={{cursor: "pointer",fontFamily:"Source Sans Pro",fontSize:'15px'}} onClick={this.charecterShowHide}>{this.state.showPwdDescription}</a>
                        </div>
                      </FormGroup>
                </div>
                }
              </Modal.Body>
              <Modal.Footer style={{marginRight:90, paddingRight:0, marginBottom:15,borderTop:0}}>
                  <Button className={blueBtn} id='cancel' onClick={this.closeEdit}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                  <Button bsStyle='primary' id='save' disabled={this.state.done} className={btnPrimary} style={{borderRadius: 0}}
                    onClick={this.saveChanges}>
                    Done
                  </Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
})

export default EditCredentials
