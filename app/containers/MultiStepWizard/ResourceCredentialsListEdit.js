import React, { Component, PropTypes } from 'react'
import {Popover,Tooltip,Table, ButtonToolbar,ButtonGroup, Button , SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio,fieldset,legend,Glyphicon} from 'react-bootstrap'
import { navbar } from 'sharedStyles/styles.css'
import getCredentialsList from 'helpers/credentials'
import {putCredential, uploadFile} from 'helpers/credentials'
import Joi from 'joi-browser'
import {ulStyle,liStyle,infoCircle} from './styles.css'
import { blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import {SpinnyLogo} from 'containers'

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



 const ResourceCredentialsListEdit = React.createClass ({  
  getInitialState() {
   return {    
          
          clist:[],
          loadingDiv:true,
          selectedCredLabelId:[]



      }
  },
   componentDidMount: function(){
    console.log("this.props1 in compo-mount"+this.props.credidsedit+"id to b edited "+this.props.idtobeedited)
    getCredentialsList()
    .then(
      (credentials) =>  {
        this.setState({clist:credentials,
         loadingDiv:false});
      }
     )
    .catch((error) => console.log("Error in getCredentialsList in container:" + error))
    this.setState({selectedCredLabelId:this.props.credidsedit});
  },
  
  componentWillReceiveProps(nextProps,nextState){
   
   if(this.props.credidsedit!== nextProps.credidsedit){
     
     this.setState({selectedCredLabelId:nextProps.credidsedit});
    // this.setState({selectedCredLabelId:this.state.selectedCredLabelId.concat([this.props.credidsedit])});     
    }
  },   
  hideInfoPopup(){
    this.refs.infoPopup.hide();
  },
  selectedCredentials(e){
  let chkVal1 = e.target.id;
  console.log("chkVal1 "+chkVal1)
  let indx=chkVal1.indexOf("d");
   console.log("indx "+indx)
  let idcred=chkVal1.substring(indx+1);
  console.log("idcred "+idcred);
 
  let idcredint=parseInt(idcred);
   console.log("idcredint "+idcredint)
  const index1 = this.state.selectedCredLabelId.indexOf(idcredint)
  console.log("index1"+index1)
  console.log( "Index is "+this.state.selectedCredLabelId.indexOf(idcredint))
  let newList1 = this.state.selectedCredLabelId.slice();
  if (index1 === -1)
  {
    newList1 = newList1.concat(idcredint)
  } else {
    newList1.splice(index1,1);
  }
  this.setState({selectedCredLabelId: newList1},
    function() {
     console.log("selected id list "+this.state.selectedCredLabelId);
     this.props.getCredentialsId(this.state.selectedCredLabelId)
    }.bind(this));
},

 render() {
  let selectedCredCount=this.state.selectedCredLabelId.length;


    const tooltipcredentiaalDetail =
      (
        <Popover style={{maxWidth:'100%',width:'500px', borderRadius:0}}>
        <h4> <strong> CREDENTIALS REQUIREMENTS </strong></h4>

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

  return (
    <div>
    
        <ControlLabel><h3 style={{fontSize:'15px'}}><strong>RESOURCE CREDENTIALS  &nbsp;&nbsp;&nbsp; </strong> 
            <OverlayTrigger ref="infoPopup" placement="right" rootClose trigger="click" overlay={tooltipcredentiaalDetail}> 
              <ControlLabel className={infoCircle} style={{color:'#4C58A4'}} >
                  <i style={{paddingRight:'2px',paddingTop:'4px'}}>i</i>
              </ControlLabel>
            </OverlayTrigger></h3>
          </ControlLabel>
          <Selections slectedIds={selectedCredCount} />
          

      <div className={ulStyle} style={{width:326, position:'relative'}}>
            {this.state.loadingDiv?
              <div style={{width:'90px',height:'90px',marginLeft:'50px',marginTop:'20px'}}>
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
                    console.log("cred Lable after concatenation "+finalLabel)
                  }

                  if((this.state.selectedCredLabelId.indexOf(cred.id))>-1)
                  {
                    let credidd= "cred"+cred.id;
                    console.log("credidd"+credidd);
                    console.log("Credential id : "+cred.id+" In if ");
                    return (<div>
                    <input type='Checkbox' style={{position:'absolute'}} id={credidd} value={cred.label} name={cred.label} onChange={this.selectedCredentials} checked={true}/> 
                    <label style={{fontWeight:'500'}} htmlFor={credidd} title={cred.label}>&nbsp;&nbsp;{finalLabel}</label></div>);
                  }
                  else
                  {
                    let credidd= "cred"+cred.id;
                    console.log("credidd"+credidd);
                    console.log("Credential id : "+cred.id+" In else");
                    return (
                    <div>
                      <input type='Checkbox' style={{position:'absolute'}} id={credidd} value={cred.label} name={cred.label} onChange={this.selectedCredentials} checked={false}/> 
                      <label style={{fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',overflow:'hidden',height:'22px','lineHeight':'20px'}} htmlFor={credidd} title={cred.label}>&nbsp;&nbsp;{finalLabel}</label>
                   </div>
                    );
                  }
                }.bind(this))
              }
              </li>
            </ul>}
          </div>

        </div>

  );
}    
})  

export {ResourceCredentialsListEdit}