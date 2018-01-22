import React, {PropTypes} from 'react'
import {Col,InputGroup,FormGroup,FormControl,Checkbox,
        Glyphicon,ControlLabel,Button} from 'react-bootstrap'
import {TextCell,LinkCell,CheckboxCell} from 'components/Table/Table'
import {spacer, blueBtn} from 'sharedStyles/styles.css'
import {progress, mytable,centeredContainer} from 'sharedStyles/styles.css'
import getIpConfig from 'helpers/applicationSettings'
import {saveIPConfig} from 'helpers/applicationSettings'
import {IPSettingsConfirmation} from './IPSettingsConfirmation'
import {SpinnyLogo} from 'containers'


const IPAddressConfig = React.createClass({
getInitialState(){
  return{
    loadingDiv:true,
    ipConfig:[],
    ipTypeSelection:'dhcp',
    ipAddress:'' ,
    subnetMask:'',
    defaultGateway:'',
    dnsServerPref:'',
    dnsServerAlt:'',
    saveSuccess:false,
    openConfirmationModal:false,
    ipBorderCol:'1.5px solid #4C58A4',
    subnetBorderCol:'1.5px solid #4C58A4',
    defaultGatewayBorderCol:'1.5px solid #4C58A4',
    dnsServerPrefBorderCol:'1.5px solid #4C58A4',
    dnsServerAltBorderCol:'1.5px solid #4C58A4'
  }
},

  componentDidMount(){
    getIpConfig()
    .then((ipConfig)=>{
      this.setState({loadingDiv:false,
                    ipConfig:ipConfig.ipconfig},function(){
                      if(this.state.ipConfig.length===0){
                        this.setState({ipTypeSelection:'dhcp'})
                      }else
                      { //+++ Check for ipSetting attribute to be static
                        
                        if(this.state.ipConfig[0].ipSetting==="dhcp")
                          this.setState({ipTypeSelection:'dhcp'})
                        else if(this.state.ipConfig[0].ipSetting === "static"){
                          this.setState({ipTypeSelection:'static',
                                        dnsServerAlt:this.state.ipConfig[0].alternateDNS,
                                        defaultGateway:this.state.ipConfig[0].defaultGateway,
                                        ipAddress:this.state.ipConfig[0].ipAddress,
                                        dnsServerPref:this.state.ipConfig[0].preferredDNS,
                                        subnetMask:this.state.ipConfig[0].subnetMask})
                        }
                      }
                    })
    })
    .catch((ipConfigError)=>{console.log('error in get ipConfig '+ipConfigError)})
  },

  handleOptionChange: function (changeEvent) {
    this.setState({ipTypeSelection: changeEvent.target.value});
  }, 

  handleIpAddress(e){
    this.setState({ipAddress:e.target.value})
  },

  handleSubnetMask(e){
    this.setState({subnetMask:e.target.value})
  },

  handleDefaultGateway(e){
    this.setState({defaultGateway:e.target.value})
  },

  handleDNSServerPref(e){
    this.setState({dnsServerPref:e.target.value})
  },

  handleDNSServerAlt(e){
    this.setState({dnsServerAlt:e.target.value})
  },

  handleSave(){
    if(this.state.ipTypeSelection === 'dhcp'){
      console.log('ipTypeSelection'+this.state.ipTypeSelection)
      //++++++++++++++ For DHCP +++++++++++++
      saveIPConfig(this.state.ipTypeSelection,'','','','','')
      .then((saveSuccess)=>{
        //show confirmation to user
        this.setState({saveSuccess:true,
                      openConfirmationModal:true})
        console.log('success'+JSON.stringify(saveSuccess))
      })
      .catch((saveIPConfigError)=>{console.log('error'+saveIPConfigError)})
    }else{
      //++++++++++++ For Static +++++++++++++
      saveIPConfig(this.state.ipTypeSelection,this.state.ipAddress,this.state.subnetMask,this.state.defaultGateway,this.state.dnsServerPref,this.state.dnsServerAlt)
      .then((saveSuccess)=>{
        //show confirmation to user
        this.setState({saveSuccess:true,
                      openConfirmationModal:true})
        console.log('success'+JSON.stringify(saveSuccess))
      })
      .catch((saveIPConfigError)=>{console.log('error'+saveIPConfigError)})
    }
  },

  handleCancel(){
    //++++ Clearing all the fields
    this.setState({ipAddress:'' ,
                  subnetMask:'',
                  defaultGateway:'',
                  dnsServerPref:'',
                  dnsServerAlt:''})
  },

render() {
  let posstyle = { width: 100, height:35, margin:'0 10px',padding:0}
  let saveStyle = {width: 100, height:35, margin:'0 10px',
                    backgroundColor:'#4C58A4', color:'#fff',padding:0}
  let saveRestartStyle = {width: 170, height:35, margin:'0 10px',
                          backgroundColor:'#4c58a4', color:'#fff',padding:0}
  let disableSave=true
  if(this.state.ipTypeSelection === 'dhcp')
    disableSave=false
  else{
    if(this.state.ipAddress==='' || this.state.ipAddress === null){
      disableSave=true
    }else{
      disableSave=false
    }
  }

  return (
    <div className={spacer}>
      <div style={{backgroundColor:'#fff', margin:'0 75px 0 60px', padding:'30px 0 50px 0'}}>
        {this.state.loadingDiv?
          <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
            <SpinnyLogo />
          </div>
        :
        <div style={{margin:'0 auto', width:700, backgroundColor:'#FFF'}}>
          <div id="dhcpdesc" style={{marginBottom:10}}>
            DHCP provides true "plug and play" networking, but it can come
            at a cost.There is less control, so you can't count on a particular device having a particular address if you have a networking
            challenge that requires this.
          </div>
          <div id="ipTypeSelection" style={{padding:'30px 0 40px 60px',width:'400px',margin: '0 auto'}}>
            <input type="radio" name="dhcp" id="dhcp" value="dhcp"  
              checked={this.state.ipTypeSelection === 'dhcp'?true:false}
              onChange={this.handleOptionChange}/>&nbsp;&nbsp; DHCP&nbsp;&nbsp;
            <input type="radio" name="static" id="static" value="static"
              checked={this.state.ipTypeSelection === 'static'?true:false} 
              onChange={this.handleOptionChange}/>&nbsp;&nbsp;Static IP
          </div>
          {this.state.ipTypeSelection==='static'?
          <div style={{width:'500px',margin:'0 auto',padding:'0 0 40px 35px'}}>
            <FormGroup  controlId="ipAddress">
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>IP Address</ControlLabel>           
              <FormControl type="text"
                  name="ipAddress"
                  value={this.state.ipAddress}
                  placeholder="Enter IP Address"
                  style={{width:326,height:40,border:this.state.ipBorderCol,borderRadius:0}}
                  onChange={this.handleIpAddress}/>            
            </FormGroup>
            <FormGroup  controlId="subnetMask" style={{marginTop:'20px'}}>
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Subnet Mask</ControlLabel>           
              <FormControl type="text"
                  name="subnetMask"
                  value={this.state.subnetMask}
                  placeholder="Enter Subnet Mask"
                  style={{width:326,height:40,borderRadius:0,border:this.state.subnetBorderCol}}
                  onChange={this.handleSubnetMask}/>            
            </FormGroup>
            <FormGroup  controlId="defaultGateway" style={{marginTop:'20px'}}>
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Default Gateway</ControlLabel>            
              <FormControl type="text"
                  name="defaultGateway"
                  value={this.state.defaultGateway}
                  placeholder="Default gateway IP Address"
                  style={{width:326,height:40,borderRadius:0,border:this.state.defaultGatewayBorderCol}}
                  onChange={this.handleDefaultGateway}/>            
            </FormGroup>
            <FormGroup  controlId="dnsServerPref" style={{marginTop:'20px'}}>
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>DNS Server address(preffered)</ControlLabel>            
              <FormControl type="text"
                  name="dnsServerPref"
                  value={this.state.dnsServerPref}
                  placeholder="Server IP Address"
                  style={{width:326,height:40,borderRadius:0,border:this.state.dnsServerPrefBorderCol}}
                  onChange={this.handleDNSServerPref}/>          
            </FormGroup>
            <FormGroup  controlId="dnsServerAlt" style={{marginTop:'20px'}}>
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>DNS Server address(alternate)</ControlLabel>            
              <FormControl type="text"
                name="dnsServerAlt"
                value={this.state.dnsServerAlt}
                placeholder="Server IP Address"
                style={{width:326,height:40,borderRadius:0,border:this.state.dnsServerAltBorderCol}}
                onChange={this.handleDNSServerAlt}/>            
           </FormGroup>
          </div>
          :''}
          <div style={{float:'right',marginRight:'-130px'}}>
            <Button bsSize='large' style={posstyle} 
              className={blueBtn}  onClick={this.handleCancel}>Cancel</Button>
            <Button bsSize='large' disabled={disableSave} 
              style={saveStyle} className={blueBtn}
              onClick={this.handleSave}>Save</Button>
              {this.state.saveSuccess?
                <IPSettingsConfirmation openModal={this.state.openConfirmationModal}/>:''}
            <Button bsSize='large' style={saveRestartStyle} className={blueBtn}>Save & Restart VM</Button>
          </div>
        </div>
      }
      </div>
    </div>
  )
  }
})

export default IPAddressConfig

    