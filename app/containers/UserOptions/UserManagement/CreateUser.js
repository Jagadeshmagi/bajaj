import React, {PropTypes} from 'react'
import { modalContainer,CreateUserDialogClass,modalCloseStyle } from './styles.css'
import {blueBtn, btnPrimary, mytable, selectStyle, navbar,modalDialogClassDash, modalDialogClassDashLarge, hrStyle,hrStyleInDash} from 'sharedStyles/styles.css'
import styles from 'sharedStyles/styles.css'
import {Col,Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, HelpBlock, Row, Popover, OverlayTrigger} from 'react-bootstrap'
import {putResourceAssetGroup,addResourcesToGroups} from 'helpers/assetGroups'
import getAssetGroupsList from 'helpers/assetGroups'
import Joi from 'joi-browser'
import {addUser, editUser, getUserById, validateUserInfo} from 'helpers/user'
import closeButtonImg from 'assets/close_Button.png'
import Select from 'react-select'

const CreateUser = React.createClass({
  getInitialState() {
    return {
      createStatus: "Save",
      show: false,
      // groupOption:'new',
      // groupsList: [],
      // selectedGroups:[],
      // groupName: '',
      // groupDesc: '',
      // groupNameValid: false,
      // groupDescValid: false,
      // groupName_validation: '',
      // groupDesc_validation: '',
      // groupName_error: '',
      // groupDesc_error: '',
      // groupName_border:'thin solid #4C58A4',
      // groupDesc_border:'thin solid #4C58A4',
      bordercolc:'thin solid #4C58A4',
      CloudType:[{label:"Google Cloud", value:"Google Cloud"}, {label:"Microsoft Azure", value:"Microsoft Azure"}, {label:"AWS", value:"AWS"}],
      // (IT, Finance, DevSecOps, Engineering, CISO office
      userDepartmentList:[
        {label:'Select Department', value:''},
        {label:'Accounting', value:'Accounting'},
        {label:"IT", value:"IT"},
        {label:"Finance", value:"Finance"},
        {label:"DevSecOps", value:"DevSecOps"},
        {label:"CISO office", value:"CISO office"},
      ],
      userRoleList:[
        // Admin, IT security, a Security analyst
        {label:'Select Role', value:''},
        {label:"Admin", value: "ROLE_ADMIN"},
        {label:"IT security", value:"IT security"},
        {label:"Security Analyst", value:"Security Analyst"},
      ],
      userTimeZoneList:[
        {label: 'Select Timezone', value:''},
        {label: "PT	Pacific Time	UTC -8:00 / -7:00", value:"PT	Pacific Time	UTC -8:00 / -7:00"},
        {label: "MT	Mountain Time	UTC -7:00 / -6:00", value:"MT	Mountain Time	UTC -7:00 / -6:00"},
        {label: "CT	Central Time	UTC -6:00 / -5:00", value:"CT	Central Time	UTC -6:00 / -5:00"},
        {label: "ET	Eastern Time	UTC -5:00 / -4:00", value:"ET	Eastern Time	UTC -5:00 / -4:00"}
      ],
      ////////////
      userFirstName:"",
      userLastName:"",
      userTitle:"",
      userRole:"Select Role",
      userEmail:"",
      userUsername:"",
      userTimeZone:"Select Timezone",
      userDepartment:"Select Department",

      userFirstName_error:"Please enter a First Name ",
      userLastName_error:"Please enter a Last Name ",
      userTitle_error:"Please enter a Title ",
      userRole_error:"Please select a Role ",
      userEmail_error:"Please enter an Email ",
      userUsername_error:"Please enter a Username ",
      userTimeZone_error:"Please enter a Time Zone ",
      userDepartment_error:"Please enter a Department ",

      userFirstNameValid:false,
      userLastNameValid:false,
      userTitleValid:false,
      userRoleValid:false,
      userEmailValid:false,
      userUsernameValid:false,
      userTimeZoneValid:false,
      userDepartmentValid:false,

      userFirstName_validation:"",
      userLastName_validation:"",
      userTitle_validation:"",
      userRole_validation:"",
      userEmail_validation:"",
      userUsername_validation:"",
      userTimeZone_validation:"",
      userDepartment_validation:"",

      tooltipUserFirstName:"",
      tooltipUserLastName:"",
      tooltipUserTitle:"",
      tooltipUserRole:"",
      tooltipUserEmail:"",
      tooltipUserUsername:"",
      tooltipUserTimeZone:"",
      tooltipUserDepartment:"",

      bordercolFirstName:"thin solid #4C58A4",
      bordercolLastName:"thin solid #4C58A4",
      bordercolTitle:"thin solid #4C58A4",
      bordercolRole:"thin solid #4C58A4",
      bordercolEmail:"thin solid #4C58A4",
      bordercolUsername:"thin solid #4C58A4",
      bordercolTimeZone:"thin solid #4C58A4",
      bordercolDepartment:"thin solid #4C58A4"
    };
  },
  debouncedValidate: _.debounce(function(validatingFunction, e) {
    validatingFunction(e);
  }, 1500),

   handleFirstName(e){
     this.setState({
       userFirstName:e.target.value
     })
  },
   handleLastName(e){
     this.setState({
       userLastName:e.target.value
     })
  },
   handleTitle(e){
     this.setState({
       userTitle:e.target.value
     })
  },
   handleRole(e){
     this.setState({
       userRole:e
     }, ()=>{this.validateRole()})
  },
   handleEmail(e){
     this.setState({
       userEmail:e.target.value
     }, ()=>{
       this.debouncedValidate(this.validateEmail, this.state.userEmail)
     })
  },
  handleUsername(e){
      this.setState({
        userUsername:e.target.value
      }, ()=>{
        this.debouncedValidate(this.validateUsername, this.state.userUsername)
       })
   },
   handleTimeZone(e){
     this.setState({
       userTimeZone:e
     })
  },
  handleDepartment(e){
    this.setState({
      userDepartment:e
    })
 },
  save() {
    let userInfo={
          // "id": 0,
          // "email": "90asdad9n@gmail.com",
          // "username": "administrator",
          // "password": "cavirin123",
          // "created": 1500318337116,
          // "roles": "ROLE_ADMIN",
          // "modified": 1500415701921,
          // "active": true
    }
    userInfo.username = this.state.userUsername
    userInfo.firstName = this.state.userFirstName
    userInfo.lastName = this.state.userLastName
    // userInfo.password = this.state.userFirstName
    userInfo.title = this.state.userTitle
    userInfo.roles = this.state.userRole
    userInfo.email = this.state.userEmail
    userInfo.timezone = this.state.userTimeZone
    userInfo.department = this.state.userDepartment

    console.log("tempUserInfo", userInfo)
    this.setState({
      createStatus:"Saving..."
    })
    if (userInfo) {
      addUser(userInfo)
      .then((response)=>{

        //this.props.refreshList();
        this.props.saveUserSuccess()
        this.close();
      })
    }

  },

  update() {
    let userInfo={}
    // let userId = localStorage.getItem('userID');
    // "username":"test4",
    // "password":"password",
    // "email":"test@email.com",
    // "roles": "ROLE_ADMIN",
    // "active": "TRUE",
    // "title": "title",
    // "department": "department",
    // "timezone": "PST",
    // "firstName": "Kevin",
    // "lastName": "Duffey"
    userInfo.username = this.state.userUsername
    userInfo.firstName = this.state.userFirstName
    userInfo.lastName = this.state.userLastName
    // userInfo.password = this.state.userFirstName
    userInfo.title = this.state.userTitle
    userInfo.roles = this.state.userRole
    userInfo.email = this.state.userEmail
    userInfo.timezone = this.state.userTimeZone
    userInfo.department = this.state.userDepartment

    console.log("tempUserInfotempUserInfotempUserInfotempUserInfo", this.props.selectedUserIds[0], userInfo)

    if (userInfo) {
      editUser(this.props.selectedUserIds[0], userInfo)
      .then((response)=>{
        // this.props.removeFromSelected(this.props.selectedUserIds[i]);
        this.close();
        this.props.refreshList();
      })
      .catch((error)=>{
        console.log("error in editing user", error)
      })
    }

  },

  close(){
    // console.log("this.props.selectedUserIds[0]this.props.selectedUserIds[0]", this.props.selectedUserIds[0])
    if (this.props.selectedUserIds){
      this.props.removeFromSelected(this.props.selectedUserIds[0]);
    }
    // this.props.refreshList();
    this.setState({ show: false});
    this.setState({
      createStatus:"Save",
      userFirstName:"",
      userLastName:"",
      userTitle:"",
      userRole:"Select Role",
      userEmail:"",
      userUsername:"",
      userTimeZone:"Select Timezone",
      userDepartment:"Select Department",
      userFirstName_error:"Please enter a First Name ",
      userLastName_error:"Please enter a Last Name ",
      userTitle_error:"Please enter a Title ",
      userRole_error:"Please select a Role ",
      userEmail_error:"Please enter an Email ",
      userUsername_error:"Please enter a Username ",
      userTimeZone_error:"Please enter a Time Zone ",
      userDepartment_error:"Please enter a Department ",

      userFirstNameValid:false,
      userLastNameValid:false,
      userTitleValid:false,
      userRoleValid:false,
      userEmailValid:false,
      userUsernameValid:false,
      userTimeZoneValid:false,
      userDepartmentValid:false,

      userFirstName_validation:"",
      userLastName_validation:"",
      userTitle_validation:"",
      userRole_validation:"",
      userEmail_validation:"",
      userUsername_validation:"",
      userTimeZone_validation:"",
      userDepartment_validation:"",

      tooltipUserFirstName:"",
      tooltipUserLastName:"",
      tooltipUserTitle:"",
      tooltipUserRole:"",
      tooltipUserEmail:"",
      tooltipUserUsername:"",
      tooltipUserTimeZone:"",
      tooltipUserDepartment:"",

      bordercolFirstName:"thin solid #4C58A4",
      bordercolLastName:"thin solid #4C58A4",
      bordercolTitle:"thin solid #4C58A4",
      bordercolRole:"thin solid #4C58A4",
      bordercolEmail:"thin solid #4C58A4",
      bordercolUsername:"thin solid #4C58A4",
      bordercolTimeZone:"thin solid #4C58A4",
      bordercolDepartment:"thin solid #4C58A4"
    })
  },

  open(){
    // this.setState({ show: true})
    if (this.props.edit === true){
      console.log("this.props.selectedIntegrationIdsthis.props.selectedIntegrationIds", this.props.selectedIntegrationIds)
      getUserById(this.props.selectedUserIds[0])
      .then((userInfo)=>{
        this.setState({
          bordercolFirstName:"thin solid #00C484",
          bordercolLastName:"thin solid #00C484",
          bordercolTitle:"thin solid #00C484",
          bordercolRole:"thin solid #00C484",
          bordercolEmail:"thin solid #00C484",
          bordercolUsername:"thin solid #00C484",
          bordercolTimeZone:"thin solid #00C484",
          bordercolDepartment:"thin solid #00C484",

          userFirstName_validation:"success",
          userLastName_validation:"success",
          userTitle_validation:"success",
          userRole_validation:"success",
          userEmail_validation:"success",
          userUsername_validation:"success",
          userTimeZone_validation:"success",
          userDepartment_validation:"success",

          userUsername: userInfo.username,
          userFirstName: userInfo.firstName,
          userLastName: userInfo.lastName,
          userTitle: userInfo.title,
          userRole: userInfo.roles,
          userEmail: userInfo.email,
          userTimeZone: userInfo.timezone,
          userDepartment: userInfo.department,
          show:true
        })
      })
      .catch((cloudResponseError)=>console.log("cloudResponseError "+cloudResponseError))
    } else {
      this.setState({ show: true})
    }
  },

  validateFirstName(FirstName){
      // FirstName
      let FirstName_schema = {
          FirstName: Joi.string().required(),
      };
      let result = Joi.validate({FirstName: this.state.userFirstName}, FirstName_schema)
      if (result.error) {
          this.refs.FirstName.show();
          this.setState({userFirstName_error : result.error.details[0].message, userFirstName_validation: 'error'})
          this.state.userFirstNamevalid=false;
          this.state.bordercolFirstName='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipFirstName:"hover"});
      } else {
          this.refs.FirstName.hide();
          this.setState({tooltipFirstName:false});
          this.setState({userFirstName_error: '', userFirstName_validation : 'success'})
         this.state.userFirstNamevalid=true;
        //  asdfasfs
          this.state.bordercolFirstName='thin solid #00C484';
      }

  },
  validateLastName(LastName){
      // LastName
      let LastName_schema = {
          LastName: Joi.string().required(),
      };
      let result = Joi.validate({LastName: this.state.userLastName}, LastName_schema)
      if (result.error) {
          this.refs.LastName.show();
          this.setState({userLastName_error : result.error.details[0].message, userLastName_validation: 'error'})
          this.state.userLastNamevalid=false;
          this.state.bordercolLastName='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipLastName:"hover"});
      } else {
          this.refs.LastName.hide();
          this.setState({tooltipLastName:false});
          this.setState({userLastName_error: '', userLastName_validation : 'success'})
         this.state.userLastNamevalid=true;
        //  asdfasfs
          this.state.bordercolLastName='thin solid #00C484';
      }

  },
  validateEmail(Email){
      // Email
      let Email_schema = {
          Email: Joi.string().required().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
      };
      let result = Joi.validate({Email: this.state.userEmail}, Email_schema)
      if (result.error) {
          this.refs.Email.show();
          this.setState({userEmail_error : "Please enter a proper email", userEmail_validation: 'error'})
          this.state.userEmailvalid=false;
          this.state.bordercolEmail='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipEmail:"hover"});
      } else {
        this.checkDuplicate("email", this.state.userEmail, this.validate)
      }

  },

  checkDuplicate(input, value, callback){
    validateUserInfo(input, value)
    .then((res)=>{
      return callback(false, input)
    })
    .catch((error)=>{
      return callback(true, input)
    })
  },
  validate(duplicate, type){
    console.log("checkdeuplicate", duplicate, type)
    if (duplicate){
      if (type === "email"){
        this.refs.Email.show();
        this.setState({userEmail_error : "This email is already in use", userEmail_validation: 'error'})
        this.state.userEmailvalid=false;
        this.state.bordercolEmail='thin solid #FF444D';
        this.state.labeltoolheight=55;
        this.setState({tooltipEmail:"hover"});
      } else if (type === "username"){
        this.refs.Username.show();
        this.setState({userUsername_error : "This username is already in use", userUsername_validation: 'error'})
        this.state.userUsernamevalid=false;
        this.state.bordercolUsername='thin solid #FF444D';
        this.state.labeltoolheight=55;
        this.setState({tooltipUsername:"hover"});
      }
    } else if (!duplicate){
      console.log("checkdeuplicate", duplicate, type)
      if (type === "email"){
        this.refs.Email.hide();
        this.setState({tooltipEmail:false});
        this.setState({userEmail_error: '', userEmail_validation : 'success', bordercolEmail:'thin solid #00C484'})
       this.state.userEmailvalid=true;
      } else if (type === "username"){
        this.refs.Username.hide();
        this.setState({tooltipUsername:false});
        this.setState({userUsername_error: '', userUsername_validation : 'success', bordercolUsername:'thin solid #00C484'})
       this.state.userUsernamevalid=true;
      }
    }

  },
  validateUsername(Username){
      // Username
      let Username_schema = {
          Username: Joi.string().required(),
      };
      let result = Joi.validate({Username: this.state.userUsername}, Username_schema)
      if (result.error) {
          this.refs.Username.show();
          this.setState({userUsername_error : result.error.details[0].message, userUsername_validation: 'error'})
          this.state.userUsernamevalid=false;
          this.state.bordercolUsername='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipUsername:"hover"});
      } else {
        this.checkDuplicate("username", this.state.userUsername, this.validate)
      }

  },
  validateRole(Role){
      // Role
      let Role_schema = {
          Role: Joi.string().required(),
      };
      let result = Joi.validate({Role: this.state.userRole}, Role_schema)
      if (result.error || this.state.userRole === "Select Role") {
          this.refs.Role.show();
          this.setState({userRole_error : result.error.details[0].message, userRole_validation: 'error'})
          this.state.userRolevalid=false;
          this.state.bordercolRole='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipRole:"hover"});
      } else {
          this.refs.Role.hide();
          this.setState({tooltipRole:false});
          this.setState({userRole_error: '', userRole_validation : 'success'})
         this.state.userRolevalid=true;
        //  asdfasfs
          this.state.bordercolRole='thin solid #00C484';
      }

  },
  validateTitle(Title){
      // Title
      let Title_schema = {
          Title: Joi.string().required(),
      };
      let result = Joi.validate({Title: this.state.userTitle}, Title_schema)
      if (result.error) {
          this.refs.Title.show();
          this.setState({userTitle_error : result.error.details[0].message, userTitle_validation: 'error'})
          this.state.userTitlevalid=false;
          this.state.bordercolTitle='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipTitle:"hover"});
      } else {
          this.refs.Title.hide();
          this.setState({tooltipTitle:false});
          this.setState({userTitle_error: '', userTitle_validation : 'success'})
         this.state.userTitlevalid=true;
        //  asdfasfs
          this.state.bordercolTitle='thin solid #00C484';
      }

  },
  validateDepartment(Department){
      // Department
      let Department_schema = {
          Department: Joi.string().required(),
      };
      let result = Joi.validate({Department: this.state.userDepartment}, Department_schema)
      if (result.error) {
          this.refs.Department.show();
          this.setState({userDepartment_error : result.error.details[0].message, userDepartment_validation: 'error'})
          this.state.userDepartmentvalid=false;
          this.state.bordercolDepartment='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipDepartment:"hover"});
      } else {
          this.refs.Department.hide();
          this.setState({tooltipDepartment:false});
          this.setState({userDepartment_error: '', userDepartment_validation : 'success'})
         this.state.userDepartmentvalid=true;
        //  asdfasfs
          this.state.bordercolDepartment='thin solid #00C484';
      }

  },
  validateTimeZone(TimeZone){
      // TimeZone
      let TimeZone_schema = {
          TimeZone: Joi.string().required(),
      };
      let result = Joi.validate({TimeZone: this.state.userTimeZone}, TimeZone_schema)
      if (result.error) {
          this.refs.TimeZone.show();
          this.setState({userTimeZone_error : result.error.details[0].message, userTimeZone_validation: 'error'})
          this.state.userTimeZonevalid=false;
          this.state.bordercolTimeZone='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipTimeZone:"hover"});
      } else {
          this.refs.TimeZone.hide();
          this.setState({tooltipTimeZone:false});
          this.setState({userTimeZone_error: '', userTimeZone_validation : 'success'})
         this.state.userTimeZonevalid=true;
        //  asdfasfs
          this.state.bordercolTimeZone='thin solid #00C484';
      }

  },

  render() {

    tooltipFirstName
    tooltipLastName
    tooltipEmail
    tooltipUsername
    tooltipRole
    tooltipTitle
    tooltipDepartment
    tooltipTimeZone

    const tooltipFirstName = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userFirstName_error}</Popover>
    );
    const tooltipLastName = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userLastName_error}</Popover>
    );
    const tooltipEmail = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userEmail_error}</Popover>
    );
    const tooltipUsername = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userUsername_error}</Popover>
    );
    const tooltipRole = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userRole_error}</Popover>
    );
    const tooltipTitle = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userTitle_error}</Popover>
    );
    const tooltipDepartment = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userDepartment_error}</Popover>
    );
    const tooltipTimeZone = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.userTimeZone_error}</Popover>
    );

    let posstyle = {  position: 'relative', top:40, left: 0,
      width: '200px',
      float: 'left',
      textAlign:"center",
      marginLeft: '70' }

    // let close = () => this.setState({ show: false});

    let disableDoneBtn = (this.state.userFirstName_validation === 'success' && this.state.userLastName_validation === 'success' && this.state.userEmail_validation === 'success' && this.state.userUsername_validation === 'success' && this.state.userRole_validation === 'success' && this.state.userTitle_validation === 'success') ? false : true
    return (
      <span className={modalContainer} >
        <a href='javascript:void(0)' onClick={this.open}>
          {this.props.edit?"Edit User": "Add User"}
        </a>

        <Modal
          show={this.state.show}
          onHide={this.close}
          aria-labelledby="contained-modal-title"
          dialogClassName={CreateUserDialogClass}
          backdrop='static'
          keyboard={false}
        >

        <form style={{border: '1px solid Navy'}}>
        <div style={{marginTop:'25px',paddingLeft:'15px'}}>
            <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
              <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} style={{position:'absolute', top:36, right:30}} onClick={this.close}>
                <img style={{width:15,height:20}} src={closeButtonImg} alt='close_btn'/>
              </a>
              <Modal.Title id="contained-modal-title"
                    style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{this.props.edit?"EDIT USER": "ADD USER"}</Modal.Title>

            </Modal.Header>

            <Modal.Body>
              <Row style={{backgroundColor: "white", marginRight:"60px", marginLeft:"20px", marginTop:"-20px", paddingTop:"30"}}>
                <Col lg={12}>
                  <FormGroup  controlId="FirstName" style={{marginTop:"20px"}}>
                   <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>First Name</ControlLabel>
                     <OverlayTrigger ref="FirstName" trigger={this.state.tooltipFirstName} placement="right" overlay={tooltipFirstName}>
                       <FormControl type="text"
                           name="GroupLabel"
                           defaultValue={this.state.userFirstName}
                           onChange={this.handleFirstName}
                           onBlur={this.validateFirstName}
                           value={this.state.GroupLabel}
                           placeholder="Enter First Name"
                           style={{width:326,height:40,border:this.state.bordercolFirstName,borderRadius:0, marginLeft:"60px"}}
                             />
                     </OverlayTrigger>
                  </FormGroup>
                  <FormGroup  controlId="LastName" style={{marginTop:"20px"}}>
                   <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Last Name</ControlLabel>
                     <OverlayTrigger ref="LastName" trigger={this.state.tooltipLastName} placement="right" overlay={tooltipLastName}>
                       <FormControl type="text"
                           name="GroupLabel"
                           defaultValue={this.state.userLastName}
                           onChange={this.handleLastName}
                           onBlur={this.validateLastName}
                           value={this.state.GroupLabel}
                           placeholder="Enter Last Name"
                           style={{width:326,height:40,border:this.state.bordercolLastName,borderRadius:0, marginLeft:"60px"}}
                             />
                     </OverlayTrigger>
                  </FormGroup>
                  <FormGroup  controlId="Email" style={{marginTop:"20px"}}>
                   <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Email</ControlLabel>
                     <OverlayTrigger ref="Email" trigger={this.state.tooltipEmail} placement="right" overlay={tooltipEmail}>
                       <FormControl type="text"
                           name="GroupLabel"
                           defaultValue={this.state.userEmail}
                           onChange={this.handleEmail}
                           onBlur={this.validateEmail}
                           value={this.state.GroupLabel}
                           placeholder="Enter Email"
                           style={{width:326,height:40,border:this.state.bordercolEmail,borderRadius:0, marginLeft:"60px"}}
                             />
                     </OverlayTrigger>
                  </FormGroup>
                  <FormGroup  controlId="Username" style={{marginTop:"20px"}}>
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
                  </FormGroup>
                  <FormGroup  controlId="Title" style={{marginTop:"20px"}}>
                   <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Title</ControlLabel>
                     <OverlayTrigger ref="Title" trigger={this.state.tooltipTitle} placement="right" overlay={tooltipTitle}>
                       <FormControl type="text"
                           name="GroupLabel"
                           defaultValue={this.state.userTitle}
                           onChange={this.handleTitle}
                           onBlur={this.validateTitle}
                           value={this.state.GroupLabel}
                           placeholder="Enter Title"
                           style={{width:326,height:40,border:this.state.bordercolTitle,borderRadius:0, marginLeft:"60px"}}
                             />
                      </OverlayTrigger>
                  </FormGroup>
                  <FormGroup  controlId="Role" style={{marginTop:"20px", marginLeft:"60"}}>
                   <ControlLabel style={{fontWeight:500,padding:'0'}}>Role</ControlLabel>
                     <OverlayTrigger ref="Role" trigger={this.state.tooltipRole} placement="right" overlay={tooltipRole}>
                       <Select placeholder={<i>Select Role</i>}
                         inputProps={{"id":"userRoles"}}
                         name="userRoles"
                         value={this.state.userRole?this.state.userRole:""}
                         options={this.state.userRoleList}
                         searchable={true}
                         multi={false}
                         clearable={false}
                         allowCreate={false}
                         onChange={this.handleRole}/>
                       {/*<select
                         className={selectStyle}
                         id="cloudTypeid"
                         style={{width:326,height:40,border:this.state.bordercolRole,borderRadius:0, marginLeft:"60px"}}
                         onChange={this.handleRole}
                         defaultValue={this.state.userRole}
                         >
                         <option value=''>Select Role</option>
                       {
                         this.state.userRoleList.map((item) =>
                         {
                           return <option
                             key={item.value}
                             name={item.value}
                             value={item.value}
                             >{item.label}</option>
                         }
                         )}
                       </select>*/}
                    </OverlayTrigger>
                  </FormGroup>
                  <FormGroup controlId="Department" style={{marginTop:"20px", marginLeft:"60"}}>
                    <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Department </ControlLabel>
                      <OverlayTrigger ref="Department" trigger={this.state.tooltipDepartment} placement="right" overlay={tooltipDepartment}>
                        <Select placeholder={<i>Select Department</i>}
                          name=""
                          inputProps={{"id":"userDepartment"}}
                          value={this.state.userDepartment?this.state.userDepartment:""}
                          style={{width:326,height:40,border:this.state.bordercolDepartment,borderRadius:0}}
                          options={this.state.userDepartmentList}
                          searchable={true}
                          multi={false}
                          clearable={false}
                          allowCreate={false}
                          onChange={this.handleDepartment}/>
                       {/*<select
                         className={selectStyle}
                         id="cloudTypeid"
                         placeholder= "Select Department"
                         style={{width:326,height:40,border:this.state.bordercolDepartment,borderRadius:0}}
                         onChange={this.handleDepartment}
                         defaultValue={this.state.userDepartment}>
                       {
                         this.state.userDepartmentList.map((item) =>
                         {
                           return <option
                             key={item.value}
                             name={item.value}
                             value={item.value}
                             >{item.label}</option>
                         }
                         )}
                       </select>*/}
                     </OverlayTrigger>
                  </FormGroup>
                  <FormGroup controlId="TimeZone" style={{marginTop:"20px", marginLeft:"60"}}>
                      <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Time Zone </ControlLabel>
                        <OverlayTrigger ref="TimeZone" trigger={this.state.tooltipTimeZone} placement="right" overlay={tooltipTimeZone}>
                         {/*<select
                           className={selectStyle}
                           id="cloudTypeid"
                           placeholder= "Select Time Zone"
                           style={{width:326,height:40,border:this.state.bordercolTimeZone,borderRadius:0}}
                           onChange={this.handleTimeZone}
                           defaultValue={this.state.userTimeZone}>
                         {
                           this.state.userTimeZoneList.map((item) =>
                           {
                             return <option
                               key={item.value}
                               name={item.value}
                               value={item.value}>
                               {item.label}
                             </option>
                           }
                           )}
                         </select>*/}
                         <Select id="timezone"  placeholder={<i>Select Timezone</i>}
                           name=""
                           inputProps={{"id":"userTimezone"}}
                           style={{width:326,height:40,border:this.state.bordercolTimeZone,borderRadius:0}}
                           value={this.state.userTimeZone?this.state.userTimeZone:""}
                           options={this.state.userTimeZoneList}
                           searchable={true}
                           multi={false}
                           clearable={false}
                           allowCreate={false}
                           onChange={this.handleTimeZone}/>
                       </OverlayTrigger>
                    </FormGroup>

                  {/*<Button onClick={this.openCloudModal}
                  bsSize='large' style={posstyle} className={blueBtn} >Reset Password</Button>
                  <Button href='JavaScript: void(0)' onClick={this.openCloudModal}
                    bsStyle='primary' bsSize='large' className={btnPrimary}
                    style={{borderRadius: 0, marginTop: 20,marginBottom: 20,width:'300px', marginLeft:"60", marginBottom:"30"}}>
                      Reset Password
                  </Button>*/}
                </Col>
              </Row>

            </Modal.Body>

            <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
                <Button className={blueBtn} onClick={this.close}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                  onClick={this.props.edit?this.update:this.save} disabled={disableDoneBtn}>
                  {this.state.createStatus}
                </Button>
            </Modal.Footer>
          </div>
          </form>

        </Modal>

      </span>
    );
  }
})

export default CreateUser
