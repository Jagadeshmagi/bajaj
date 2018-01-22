import React, {PropTypes} from 'react'
//import {redis} from 'redis'
import {connect} from 'react-redux'
import {Button, Grid, Row, Col} from 'react-bootstrap'
import {blueBtn, paddingThirty, spacer} from 'sharedStyles/styles.css'
import {btnPrimary} from './styles.css'
import { BarChart, PieChart } from 'react-d3-components'
import {EmptyStateLogos} from 'components'
import ReactDOM from 'react-dom'
import {Navbar, Glyphicon , ProgressBar, PopOver, Overlay} from 'react-bootstrap';
import image from 'assets/CavirinGreen.png';
import { numberCircle, progress, body } from './styles.css'
import {navbar,centeredContainer} from 'sharedStyles/styles.css'
import AlertComponent from 'components/Common/AlertComponent'
import ErrorMessages from 'constants/ErrorMessages';
import {checkUsage}from 'helpers/context'
import {ResetPassword} from 'containers'

 const WelcomeText = React.createClass({
  propTypes: {
    login: PropTypes.string.isRequired,
  },
  render: function () {
    return (
      <table style={{width: '100%', marginTop:15, fontSize: 18}} >
        <tbody>
          <tr style={{paddingBottom:'20px'}} ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#00C484', paddingBottom: 10}}>
                    Welcome to Cavirin, {this.props.login}!</td></tr>
          <tr><td style={{textAlign: 'center', color: 'white'}}><p style={{margin:0,padding:0}}>Start using this tool once you discover resources.</p></td></tr>
          <tr><td style={{textAlign: 'center', color: 'white'}}>We run automated risk, security and compliance checks for you.</td></tr>
          <tr><td style={{textAlign: 'center', color: 'white',paddingBottom: 3}}>You will get quick visibility into your entire system's security status.</td></tr>
        </tbody>
      </table>
    )
  }
})


const WelcomeHeader=React.createClass({
  propTypes: {
    login: PropTypes.string.isRequired,
  },
  getInitialState() {
    return { show: false };
  },
  render:function(){
    let navColorStyle = {  backgroundColor: '#00C484', width:'100%',border: 0, borderRadius: 0, marginBottom: 0}
      let colstyle = {color: 'white',fontStyle:'italic'}
      let pstyle = { paddingLeft: 20}

  return(
      <Navbar style={navColorStyle}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#"><div style={{color: 'white', fontSize: 24}}>{this.props.name}</div></a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Text pullRight style={colstyle} >
              {' '}
              <Glyphicon style={pstyle} glyph='user' />
              {' '} Hi {this.props.login}!
              <span> {'   '}  </span>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
    )
  },
 })


const WelcomeScreen = React.createClass({
  register: function () {
    console.log('welcome screen skip register with redis')
    //let client = redis.createClient('http://52.207.223.0:6380')
    //client.quit()
    return true
  },
  redirectToWizard(){
   checkUsage()
   .then((response) =>{
      if(response !== null && response.data.output !== null && response.data.output === "time_completed")
      {
        Alert.show(ErrorMessages.LICENSE_EXPIRED);
      }else if(response !== null && response.data.output !== null && response.data.output === "instance_completed")
      {
        Alert.show(ErrorMessages.MAX_RESOURCES);
      }
      else{
        window.location = '#/cloud/'+ -1;
      }
   })
   .catch((error) => {
      window.location = '#/cloud/'+ -1;
   })
  },

  render: function () {
    let logoBackGround = {backgroundColor: '#00C484', paddingLeft: 0}
    let imgstyle = { width: 30, height: 30}
    return (
      <div className={body}>
        <WelcomeHeader login={this.props.login}/>
        <div className='container-fluid'>
          <div style={{backgroundColor:'#4C58A4'}} className="row">
            <div className ={centeredContainer} style={{paddingTop:"35px"}}>
              <svg style={{allign:'center'}}  width="115px" height="115px"  viewBox="656 156 288 288" version="1.1" >
                 <g id="Group-2" stroke="none" strokeWidth="5" fill="none" fill-rule="evenodd" transform="translate(660.000000, 160.000000)">
                  <path d="M238.529268,238.300807 C213.343231,263.458971 178.555888,279.020052 140.127469,279.020052 C63.2799069,279.020052 0.978093317,216.784994 0.978093317,139.999073 C0.978093317,63.2177865 63.2799069,0.978094172 140.127469,0.978094172 C189.701753,0.978094172 233.213762,26.8684345 257.861755,65.845283" id="Stroke-1" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"></path>
                  <path d="M193.088648,192.956335 C179.516946,206.51088 160.773525,214.893845 140.072736,214.893845 C98.6757973,214.893845 65.0990531,181.357351 65.0990531,139.993976 C65.0990531,98.6306005 98.6757973,65.0941063 140.072736,65.0941063 C161.752209,65.0941063 181.284143,74.2926611 194.971803,88.9871786" id="Stroke-3" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"></path>
                  <path d="M158.681646,140 C158.681646,150.231944 150.383705,158.536131 140.128396,158.536131 C129.89164,158.536131 121.575146,150.231944 121.575146,140 C121.575146,129.768056 129.89164,121.463869 140.128396,121.463869 C150.383705,121.463869 158.681646,129.768056 158.681646,140 L158.681646,140 Z" id="Stroke-5" stroke="#FFFFFF" stroke-width="8"></path>
                  <path d="M279.504121,139.995366 C279.504121,155.35255 267.045614,167.799562 251.674246,167.799562 C236.302878,167.799562 223.844371,155.35255 223.844371,139.995366 C223.844371,124.642816 236.302878,112.19117 251.674246,112.19117 C267.045614,112.19117 279.504121,124.642816 279.504121,139.995366 L279.504121,139.995366 Z" id="Stroke-7" stroke="#FFFFFF" stroke-width="8"></path>
                  <path d="M153.19174,153.046655 L238.527413,238.298954" id="Stroke-9" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path>
                 </g>
              </svg>
            </div>
            <WelcomeText login={this.props.login}/>
            <div style={{marginTop: 30}} ></div>
            <EmptyStateLogos color='white' hyperLinkColor='#00C484'/>
          </div>

          {/*Footer*/}

          <div style={{backgroundColor: '#4C58A4', width:'100%', bottom: 0, height: 90, paddingTop:15, position:'fixed'}}>
            <div className={centeredContainer}>
              <tr><td style={{textAlign: 'center', color: 'white'}}>Discover resources and assess risk, security and compliance</td></tr>
              <Button onClick={this.redirectToWizard} bsStyle='primary' bsSize='medium' className={btnPrimary} style={{borderRadius: 0}}>
                &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Get Started &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </Button>
              <AlertComponent ref={(a) => global.Alert = a}/>
            </div>
            <div style={{position: 'absolute', bottom: 0, textAlign:'right', fontSize:'24px',width: '95%', color: 'white'}} >
              <a href="#/startdashboard" onClick={() => this.register()} > skip </a>
            </div>
          </div>
        </div>
      </div>
    )
  },
})

export default connect(
  ({users}) => ({login: users.login}),
)(WelcomeScreen)
