import React, { PropTypes } from 'react'
import { Authenticate, CavirinIcon} from 'components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {fetchAndHandleAuthedUser, resetUser, fetchAndHandleAuthedUserSAAS} from 'redux/modules/users'
import { Col, FormControl, FormGroup, ControlLabel, HelpBlock,Glyphicon, Row} from 'react-bootstrap'
import { spacer, centeredContainer } from 'sharedStyles/styles.css'
import Joi from 'joi-browser'
import image from 'assets/ARAPCavirinLogo_color.png';
import {fetchUserContext, setWelcomeSeen,setDashboardSetup} from 'redux/modules/context'
import {getUIContext, putUIContext} from 'helpers/context'
import {getReportsExists} from 'helpers/reports'
import UIContextConstants from 'constants/UIContextConstants'
import {ResetPassword} from 'containers'
import {getAllData} from 'helpers/license'
import UploadLicense from '../UserOptions/BillingInformation/UploadLicense'
import moment from 'moment'




const AuthenticateContainer = React.createClass({
  propTypes: {
    resetUser:PropTypes.func.isRequired,
    fetchAndHandleAuthedUser: PropTypes.func.isRequired,
    fetchAndHandleAuthedUserSAAS: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      username: '',
      password: '',
      username_validation: 'success',
      password_validation: 'success',
      username_error: '',
      password_error: '',
      show:false,
      showLicense:false,
      expired:false
      // resetComplete:false
    }
  },
  checkLicense(){
    getAllData()
    .then((res)=>{
      let daysRemaining = moment(res.expiration,'DD-MMM-YYYY').diff(moment(),'days')
      if (daysRemaining > 0){
        console.log("this is the res fromliscense ", res)
        this.setState({
          showLicense:false
        })
      } else {
        this.setState({
          showLicense:true
        })
      }
    })
    .catch((error)=>{
      if (error.status == "404") {
        this.setState({
          showLicense:true
        })
      }
      console.log("error in getting license data", error)
    })
  },
  refresh(){
    console.log("refresh is called")
    this.checkLicense()
    // Router.refresh();
  },
  componentDidMount(){
    if (!this.props.location.query.token){
      this.checkLicense();
      this.props.resetUser();
    }
    if (this.props.location.query.token){
      this.signInAuto();
    }
  },

  signInAuto(){
    let userData = JSON.parse(this.props.location.query.token);
    console.log("hello token", this.props.routeParams, this.props.location.query, userData)

    localStorage.setItem('accessToken', userData.access_token);
    localStorage.setItem('refreshToken', userData.refresh_token);
    localStorage.setItem('userID', userData.user.id);
    this.setState({
      username: userData.userName,
      // password: "1234567890-="
    },
      ()=>{
        // this.handleAuth();
        let user = {
          name: userData.userName,
          company: '',
          uid: userData.access_token,
          user: userData.user
        }
        this.props.fetchAndHandleAuthedUserSAAS(user);
        this.enterPulsar();
      }
    )
      console.log("hello token", this.props.routeParams.token)
  },

  handleChange: function(e) {
      this.setState({[e.target.name]: e.target.value})
  },
  validateUser: function(userName) {
    let user_schema = {
      username: Joi.string().required(),
    };
    let result = Joi.validate({username: this.state.username}, user_schema)
    if (result.error) {
      this.setState({username_error : result.error.details[0].message, username_validation: 'error'})
      return false
    } else {
      this.setState({username_error: '', username_validation : 'success'})
      return true
    }
  },
  validatePassword: function(password) {
    let password_schema = {
      password: Joi.string().required(),
    }
    let password_result = Joi.validate({password: this.state.password}, password_schema)
    if (password_result.error) {
      this.setState({password_error: password_result.error.details[0].message, password_validation: 'error'})
      return false
    } else {
      this.setState({password_error: '', password_validation: 'success'})
      return true
    }
  },
  saveContext(welcomeSeen,dashboardSetup,discoverySetup,policySetup){
    putUIContext(this.state.username,welcomeSeen,dashboardSetup,discoverySetup,policySetup)
    .then((response) => {
      console.log('saved welcome page seen'+JSON.stringify(response.data))
    })
    .catch((response) =>{
      console.log('failed to save welcome seen'+JSON.stringify(response))
    })
  },
  handleKeyPress(e){
    if (e.key === 'Enter') {
      this.handleAuth();
    }
  },
  handleAuthBtn(e){
    e.preventDefault()
    this.handleAuth();
  },
  checkResetPassword(changePassword, response){
    console.log("created, modifiedcreated, modified", changePassword)
    if(changePassword){
      this.setState({
        show:true
      })
      return false;
    } else {
      this.setState({
        show:false
      })
      return true;
    }
  },
  // resetComplete(){
  //   this.setState({
  //     resetComplete:true
  //   })
  // },
  enterPulsar(){
    console.log("this.state.usernamethis.state.usernamethis.state.username", this.state.username)
    getUIContext(this.state.username)
    .then((result) => {
      console.log("this.state.usernamethis.state.usernamethis.state.username", result, this.state.username)
      if(result.output != null){
        // console.log("redis fetch result111:", result.output, result.output.welcomeSeen)
        // console.log("redis fetch result222:", JSON.parse(result.output))

        let uiContext = JSON.parse(result.output)

        //uiContext = UIContextConstants.EMPTY_STATE_CONTEXT
        this.props.fetchUserContext(uiContext.welcomeSeen,
          uiContext.dashboardSetup,
          uiContext.discoverySetup,
          uiContext.policySetup)

        // show welcomeScreen or dashboardstart or dashbord depending on the values
        if (uiContext.welcomeSeen == true) {
          console.log("uiContext.welcomeSeen == true");
          if (uiContext.dashboardSetup == true) {
            this.context.router.replace('dashboard')
          } else {
            getReportsExists()
            .then((reportsExist) => {
              if(reportsExist != null && reportsExist.status){
                console.log("set uiContext.dashboardSetup == true");
                this.props.setDashboardSetup();
                this.saveContext(true,true,true,true);
                this.context.router.replace('dashboard');
              }else{
                this.context.router.replace('startdashboard')
              }
            })
            .catch((error) => console.log("Error in getting Reports status:"+error))
          }

        } else {
          console.log("uiContext.welcomeSeen == false");
          this.props.setWelcomeSeen();
          this.saveContext(true,false,false,false);
          this.context.router.replace('welcomeScreen');
        }
      }//end if(result.output != null)
      else{
        //User login first time, save user in context
        console.log("User logged in first time");
        this.saveContext(true,false,false,false);
        this.context.router.replace('welcomeScreen');
      }
    })
    .catch(function (response) {
      console.log("getUIContext reject in AuthenticateContainer :"+JSON.stringify(response));
      this.context.router.replace('welcomeScreen')
      //Promise.reject(response);
    }.bind(this))
  },
  checkFirstLogin(passwordFromReset){
        // validate user name
        let isValidUsername = this.validateUser(this.state.username)

        //validate password
        let isValidPassword = this.validatePassword(this.state.password)

        // procceed only if no error
        if (!(isValidUsername && isValidPassword))
          return false;

        let uiContext = {}

        let password = passwordFromReset || this.state.password;
        console.log("this is the passwordFromReset", passwordFromReset)
        this.props.fetchAndHandleAuthedUser(this.state.username, password)
        .then((response) => {
          if(this.props.error === ''){
            // this.enterPulsar();
          // get state
          getUIContext(this.state.username)
          .then((result) => {
            if(result.output != null){
              uiContext = JSON.parse(result.output);
              console.log("redis fetch result:"+JSON.stringify(uiContext))

              //uiContext = UIContextConstants.EMPTY_STATE_CONTEXT
              this.props.fetchUserContext(uiContext.welcomeSeen,
                uiContext.dashboardSetup,
                uiContext.discoverySetup,
                uiContext.policySetup)

              // show welcomeScreen or dashboardstart or dashbord depending on the values
              if (uiContext.welcomeSeen == true) {
                console.log("uiContext.welcomeSeen == true");
                if (uiContext.dashboardSetup == true) {
                  this.context.router.replace('dashboard')
                } else {
                  getReportsExists()
                  .then((reportsExist) => {
                    if(reportsExist != null && reportsExist.status){
                      console.log("set uiContext.dashboardSetup == true");
                      this.props.setDashboardSetup();
                      this.saveContext(true,true,true,true);
                      this.context.router.replace('dashboard');
                    }else{
                      this.context.router.replace('startdashboard')
                    }
                  })
                  .catch((error) => console.log("Error in getting Reports status:"+error))
                }

              } else {
                console.log("uiContext.welcomeSeen == false");
                this.props.setWelcomeSeen();
                this.saveContext(true,false,false,false);
                this.context.router.replace('welcomeScreen');
              }
            }//end if(result.output != null)
            else{
              //User login first time, save user in context
              console.log("User logged in first time");
              this.saveContext(true,false,false,false);
              this.context.router.replace('welcomeScreen');
            }
          })
          .catch(function (response) {
            console.log("getUIContext reject in AuthenticateContainer :"+JSON.stringify(response));
            this.context.router.replace('welcomeScreen')
            //Promise.reject(response);
          }.bind(this))

          }else{
            this.setState({password_validation:'error'})
          }  //this.context.router.replace('welcomeScreen')
        }).catch(function (error) {
          console.log('fetch user was not successful', error)
        })
  },
  handleAuth () {

    // validate user name
    let isValidUsername = this.validateUser(this.state.username)

    //validate password
    let isValidPassword = this.validatePassword(this.state.password)

    // procceed only if no error
    if (!(isValidUsername && isValidPassword))
      return false;

    let uiContext = {}
    this.props.fetchAndHandleAuthedUser(this.state.username, this.state.password)
    .then((response) => {
      console.log("resporesponseresponsense",response)
      if (response.statusText === "Unauthorized"){
        console.log("response.errorresponse.error", response.data.license)
        if (response.data.license === "License has expired"){
          console.log("response.errorresponse.error popopopop", response.license)
          this.setState({
            showLicense:true,
            expired:true
          })
        }
        console.log("resporesponseresponsenseFAILED",response)
      } else {
        console.log("resporesponseresponsense",response)
        var allowSignIn = this.checkResetPassword(response.changePassword, response)
        if (allowSignIn){
          // this.enterPulsar();
          // get state
          getUIContext(this.state.username)
          .then((result) => {
            if(result.output != null){
              uiContext = JSON.parse(result.output);
              console.log("redis fetch result:"+JSON.stringify(uiContext))

              //uiContext = UIContextConstants.EMPTY_STATE_CONTEXT
              this.props.fetchUserContext(uiContext.welcomeSeen,
                uiContext.dashboardSetup,
                uiContext.discoverySetup,
                uiContext.policySetup)

              // show welcomeScreen or dashboardstart or dashbord depending on the values
              if (uiContext.welcomeSeen == true) {
                console.log("uiContext.welcomeSeen == true");
                if (uiContext.dashboardSetup == true) {
                  this.context.router.replace('dashboard')
                } else {
                  getReportsExists()
                  .then((reportsExist) => {
                    if(reportsExist != null && reportsExist.status){
                      console.log("set uiContext.dashboardSetup == true");
                      this.props.setDashboardSetup();
                      this.saveContext(true,true,true,true);
                      this.context.router.replace('dashboard');
                    }else{
                      this.context.router.replace('startdashboard')
                    }
                  })
                  .catch((error) => console.log("Error in getting Reports status:"+error))
                }

              } else {
                console.log("uiContext.welcomeSeen == false");
                this.props.setWelcomeSeen();
                this.saveContext(true,false,false,false);
                this.context.router.replace('welcomeScreen');
              }
            }//end if(result.output != null)
            else{
              //User login first time, save user in context
              console.log("User logged in first time");
              this.saveContext(true,false,false,false);
              this.context.router.replace('welcomeScreen');
            }
          })
          .catch(function (response) {
            console.log("getUIContext reject in AuthenticateContainer :"+JSON.stringify(response));
            this.context.router.replace('welcomeScreen')
            //Promise.reject(response);
          }.bind(this))
        }
      }

    }).catch(function (error) {
      console.log('fetch user was not successful', error)
    })
  },
  render () {
    let style = {display: 'block', margin: 'auto', paddingBottom: 15}
    return (
        <div  style={{width:'100%', height:'100vh', backgroundColor:'#4c58a4'}}>
          <div className="navbar navbar-default navbar-fixed-top" style={{"background-color": "rgb(76, 88, 164)","width":"100%","height":"220px"}}>
          <div className="container" >
          <div style={{"padding-left": "42%","padding-top": "10px","padding-bottom": "10px"}}>
          <CavirinIcon color='#FFFFFF'/>
          </div>
          </div>
          </div>
          <div className="container" style={{"height": "100%","background": "white","width":"100%"}}>
           <form  className="myForm">
             <ResetPassword
               login={true}
               show={this.state.show}
               checkFirstLogin={this.checkFirstLogin}
               />
             {!this.state.showLicense?<div>
               <FormGroup controlId="formBasicText" validationState={this.state.username_validation} >
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Username</ControlLabel>
              <FormControl
                type="text"
                name="username"
                value={this.state.username}
                placeholder="Username"
                onChange={this.handleChange}
                style={{borderRadius:0}}
                onBlur={this.validateUser}
                onKeyPress={this.handleKeyPress}
              />
              <HelpBlock>{this.state.username_error}</HelpBlock>
            </FormGroup>

            <FormGroup controlId="formPassword" validationState={this.state.password_validation}>
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Password</ControlLabel>
              <FormControl
                type="password"
                name="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.handleChange}
                style={{borderRadius:0}}
                onBlur={this.validatePassword}
                onKeyPress={this.handleKeyPress}
              />
              <HelpBlock>{this.state.password_error}</HelpBlock>
            </FormGroup>
            <FormGroup style={{fontSize:'15px',fontWeight:500}} controlId="loginError" validationState="error">
              <HelpBlock>
                {
                  (this.props.error === '' || this.props.isFetching)
                  ?
                  '':
                  <div>
                    {this.props.error}
                  </div>
                }
              </HelpBlock>
            </FormGroup>
          </div>
          :
          <div>
          <UploadLicense refresh={this.refresh} login={true} expired={this.state.expired}/>
          </div>}
          </form>
        </div>
        <footer className="footer" style={{"background-color": "rgb(76, 88, 164)"}}>
          <div className="container" style={{"width":"100%"}}>

          <div style={{"margin": "0px", "padding-top": "30px"}}>
          <div className="styles__centeredContainer___1yLZn">
            {this.state.showLicense?<div></div>:<Authenticate
                onAuth={this.handleAuthBtn}
                isFetching={this.props.isFetching}
                error={this.props.error} />}
          </div></div>
          <p style={{padding:'23px 30px', color: 'white',backgroundColor:'#4C58A4', marginBottom:0}}>&copy; Cavirin Systems Inc. 2016<br/>
          <a target='_blank' href='https://www.Cavirin.com' style={{color: 'white'}}> About Cavirin</a> | <a target='_blank' href='https://www.cavirin.com/company/contact.html' style={{color: 'white'}}>Contact us</a> </p>
          </div>
        </footer>

      </div>

    )
  },
})

export default connect(
  ({users}) => ({users: users, isFetching: users.isFetching, error: users.error}),
  (dispatch) => bindActionCreators({resetUser, fetchAndHandleAuthedUser, fetchAndHandleAuthedUserSAAS, fetchUserContext, setWelcomeSeen,setDashboardSetup}, dispatch)
)(AuthenticateContainer)
