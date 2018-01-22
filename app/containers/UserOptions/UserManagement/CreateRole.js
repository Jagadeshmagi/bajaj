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
      RoleName:"",
      userLastName:"",
      userTitle:"",
      userRole:"Select Role",
      userEmail:"",
      userUsername:"",
      userTimeZone:"Select Timezone",
      userDepartment:"Select Department",

      RoleName_error:"Please enter a Role Name ",
      userLastName_error:"Please enter a Last Name ",
      userTitle_error:"Please enter a Title ",
      userRole_error:"Please select a Role ",
      userEmail_error:"Please enter an Email ",
      userUsername_error:"Please enter a Username ",
      userTimeZone_error:"Please enter a Time Zone ",
      userDepartment_error:"Please enter a Department ",

      RoleNameValid:false,
      userLastNameValid:false,
      userTitleValid:false,
      userRoleValid:false,
      userEmailValid:false,
      userUsernameValid:false,
      userTimeZoneValid:false,
      userDepartmentValid:false,

      RoleName_validation:"",
      userLastName_validation:"",
      userTitle_validation:"",
      userRole_validation:"",
      userEmail_validation:"",
      userUsername_validation:"",
      userTimeZone_validation:"",
      userDepartment_validation:"",

      tooltipRoleName:"",
      tooltipUserLastName:"",
      tooltipUserTitle:"",
      tooltipUserRole:"",
      tooltipUserEmail:"",
      tooltipUserUsername:"",
      tooltipUserTimeZone:"",
      tooltipUserDepartment:"",

      bordercolRoleName:"thin solid #4C58A4",
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

   handleRoleName(e){
     this.setState({
       RoleName:e.target.value
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
    userInfo.roleName = this.state.RoleName
    userInfo.lastName = this.state.userLastName
    // userInfo.password = this.state.RoleName
    userInfo.title = this.state.userTitle
    userInfo.roles = this.state.userRole
    userInfo.email = this.state.userEmail
    userInfo.timezone = this.state.userTimeZone
    userInfo.department = this.state.userDepartment

    console.log("tempUserInfo", userInfo)
    // this.setState({
    //   createStatus:"Saving..."
    // })
    this.props.saveRoleSuccess(this.state.RoleName)
    this.close();
    // if (userInfo) {
      // addUser(userInfo)
      // .then((response)=>{
      //
      //   //this.props.refreshList();
      //   this.props.saveRoleSuccess(this.state.RoleName)
      //   this.close();
      // })
    // }

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
    // "roleName": "Kevin",
    // "lastName": "Duffey"
    userInfo.username = this.state.userUsername
    userInfo.roleName = this.state.RoleName
    userInfo.lastName = this.state.userLastName
    // userInfo.password = this.state.RoleName
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
      RoleName:"",
      userLastName:"",
      userTitle:"",
      userRole:"Select Role",
      userEmail:"",
      userUsername:"",
      userTimeZone:"Select Timezone",
      userDepartment:"Select Department",
      RoleName_error:"Please enter a Role Name ",
      userLastName_error:"Please enter a Last Name ",
      userTitle_error:"Please enter a Title ",
      userRole_error:"Please select a Role ",
      userEmail_error:"Please enter an Email ",
      userUsername_error:"Please enter a Username ",
      userTimeZone_error:"Please enter a Time Zone ",
      userDepartment_error:"Please enter a Department ",

      RoleNameValid:false,
      userLastNameValid:false,
      userTitleValid:false,
      userRoleValid:false,
      userEmailValid:false,
      userUsernameValid:false,
      userTimeZoneValid:false,
      userDepartmentValid:false,

      RoleName_validation:"",
      userLastName_validation:"",
      userTitle_validation:"",
      userRole_validation:"",
      userEmail_validation:"",
      userUsername_validation:"",
      userTimeZone_validation:"",
      userDepartment_validation:"",

      tooltipRoleName:"",
      tooltipUserLastName:"",
      tooltipUserTitle:"",
      tooltipUserRole:"",
      tooltipUserEmail:"",
      tooltipUserUsername:"",
      tooltipUserTimeZone:"",
      tooltipUserDepartment:"",

      bordercolRoleName:"thin solid #4C58A4",
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
          bordercolRoleName:"thin solid #00C484",
          bordercolLastName:"thin solid #00C484",
          bordercolTitle:"thin solid #00C484",
          bordercolRole:"thin solid #00C484",
          bordercolEmail:"thin solid #00C484",
          bordercolUsername:"thin solid #00C484",
          bordercolTimeZone:"thin solid #00C484",
          bordercolDepartment:"thin solid #00C484",

          RoleName_validation:"success",
          userLastName_validation:"success",
          userTitle_validation:"success",
          userRole_validation:"success",
          userEmail_validation:"success",
          userUsername_validation:"success",
          userTimeZone_validation:"success",
          userDepartment_validation:"success",

          userUsername: userInfo.username,
          RoleName: userInfo.roleName,
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

  validateRoleName(RoleName){
      // RoleName
      let RoleName_schema = {
          RoleName: Joi.string().required(),
      };
      let result = Joi.validate({RoleName: this.state.RoleName}, RoleName_schema)
      if (result.error) {
          this.refs.RoleName.show();
          this.setState({RoleName_error : result.error.details[0].message, RoleName_validation: 'error'})
          this.state.RoleNamevalid=false;
          this.state.bordercolRoleName='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltipRoleName:"hover"});
      } else {
          this.refs.RoleName.hide();
          this.setState({tooltipRoleName:false});
          this.setState({RoleName_error: '', RoleName_validation : 'success'})
         this.state.RoleNamevalid=true;
        //  asdfasfs
          this.state.bordercolRoleName='thin solid #00C484';
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

    tooltipRoleName
    tooltipLastName
    tooltipEmail
    tooltipUsername
    tooltipRole
    tooltipTitle
    tooltipDepartment
    tooltipTimeZone

    const tooltipRoleName = (
      <Popover style={{height:55,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.RoleName_error}</Popover>
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

    let disableDoneBtn = (this.state.RoleName_validation === 'success') ? false : true
    return (
      <span className={modalContainer} >
        <a href='javascript:void(0)' onClick={this.open}>
          {this.props.edit?"Edit User": "Add Role"}
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
                    style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{this.props.edit?"EDIT USER": "ADD ROLE"}</Modal.Title>

            </Modal.Header>

            <Modal.Body>
              <Row style={{backgroundColor: "white", marginRight:"60px", marginLeft:"20px", marginTop:"-20px", paddingTop:"30"}}>
                <Col lg={12}>
                  <FormGroup  controlId="RoleName" style={{marginTop:"20px"}}>
                   <ControlLabel style={{fontSize:'15px',fontWeight:500, marginRight:"60", marginLeft:'60', width:"100"}}>Role Name</ControlLabel>
                     <OverlayTrigger ref="RoleName" trigger={this.state.tooltipRoleName} placement="right" overlay={tooltipRoleName}>
                       <FormControl type="text"
                           name="GroupLabel"
                          //  defaultValue={this.state.RoleName}
                           onChange={this.handleRoleName}
                           onBlur={this.validateRoleName}
                           value={this.state.GroupLabel}
                          //  placeholder="Enter Role Name"
                           style={{width:326,height:40,border:this.state.bordercolRoleName,borderRadius:0, marginLeft:"60px"}}
                             />
                     </OverlayTrigger>
                  </FormGroup>
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
