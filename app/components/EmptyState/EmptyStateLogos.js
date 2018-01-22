import React, {PropTypes} from 'react'
import image1 from 'assets/discovergreen.png';
import image2 from 'assets/policygreen.png';
import image3 from 'assets/testgreen.png';
import {Popover,OverlayTrigger} from 'react-bootstrap'
import {popover} from 'sharedStyles/styles.css'

const Texts = React.createClass({
  hideInfoPopup(){
    this.refs.infoPopup.hide();
  },
  render: function () {
    const style = {textAlign: 'center', color: this.props.color}
    const hStyle={color:this.props.hyperLinkColor}
    const hrefStyle={color:this.props.hrefColor}
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:'100%',
                        height:415,paddingLeft:10,
                        paddingTop:10,
                      paddingBottom:60}
    let popoverContent ={padding:0}
    let pStyle={margin:0,padding:0}

     const resourceCredentialsPopOver = (
    <Popover  id="popover-positioned-scrolling-top" arrowOffsetLeft="30" style={overLayStyle}>
    <div className="pull-right" style={{marginTop:-10}}><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.hideInfoPopup}>x</a></div>
    <div className={popover}>
      <p style={{fontWeight:'bold',fontSize:14}}>YOU'LL NEED:</p>
      <ul style={{fontSize:'14', margin:'-5px'}}>
      <li>Credential Type</li>
      <li>Usage</li>
      <li>Username</li>
      <li>Password or Pem-key authentication</li>
      </ul>
      <br/>

      You may wish to reach out to members in
      your IT team for these details.If you wish,
      we can send them a list of information needed.
      <br/>
      <div style={{height: '20px'}} > </div>
      <input type='checkbox' id="info"/>
                    <label htmlFor="info">&nbsp;&nbsp;Send an email</label>
      <hr/>
      <p style={{fontWeight:'bold',fontSize:'14'}}>QUESTIONS:</p>
       <p style={{fontSize:'14',display:'inline'}}>Email:</p>
       <p style={{fontSize:'14',color:'#4C58A4',display:'inline'}}>support@cavirin.com</p>
      <br/>
      <p style={{fontSize:'14',display:'inline'}}>Phone:</p>
      <p style={{fontSize:'14',display:'inline'}}>+1(800)444-8888</p>


    </div>

    </Popover>
    );
    return (
        <tr>
          <td style={style}>
           <p style={pStyle}> Help us identify the environment </p>
           <p style={pStyle}> you want to discover in order to start </p>
          <p style={pStyle} > the discovery process. You will need </p>
            <OverlayTrigger ref="infoPopup" placement="top" trigger="click" overlay={resourceCredentialsPopOver}>
            <a href='javaScript: void(0)' style={hStyle}>Resource Credentials</a>
            </OverlayTrigger>
          </td>
          <td style={style}>
           <p style={pStyle}> Tell us which policy packs you would </p>
            <p style={pStyle}> like to check for risk, security and compliance </p>
            <p style={pStyle}> with your system.</p>

          </td>
          <td style={style}>
            <p style={pStyle}> You set the schedule and we will </p>
          <p style={pStyle}>assess your system for you and send</p>
             <p style={pStyle}>you data-rich reports.</p>
          </td>
        </tr>
    )
  }
})

const TextIcons = React.createClass({
  propTypes: {
     color: PropTypes.string.isRequired,

  },
  render: function () {
    const style = {textAlign: 'center', color: this.props.color}
    return (
        <tr>
          <td style={style}><h4>DISCOVER RESOURCES</h4> </td>
          <td style={style}><h4>SELECT POLICY PACKS</h4> </td>
          <td style={style}><h4>SCHEDULE ASSESSMENTS</h4></td>
        </tr>
    )
  }
})


const Icons = React.createClass({
  propTypes: {
     color: PropTypes.string.isRequired,
  },
  render: function () {
    const style = {textAlign: 'center'}
    return (
        <tr>
          <td style={style}><img src={image1} /> </td>
          <td style={style}><img src={image2} />  </td>
          <td style={style}><img src={image3} />  </td>
        </tr>
    )
  }
})

EmptyStateLogos.propTypes = {
    color: PropTypes.string.isRequired,
}

export default function EmptyStateLogos  (props) {
  return (
    <table style={{width: '100%'}}>
      <tbody>
        <Icons color={props.color}/>
        <TextIcons color={props.color} />
        <Texts color={props.color} hyperLinkColor={props.hyperLinkColor} hrefColor={props.hrefColor}/>
      </tbody>
    </table>
  )
}
