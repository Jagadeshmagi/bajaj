import React, { Component, PropTypes } from 'react'
import {ResourceCredentials} from './ResourceCredentials'
import {Glyphicon,Popover,Tooltip, Table, ButtonToolbar,ButtonGroup, Button , SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio} from 'react-bootstrap'
import { navbar,footerBtn } from 'sharedStyles/styles.css'
import {emailb,italic1,divContainer,footerDivContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle} from './styles.css'
import Joi from 'joi-browser'
import ReactDOM from 'react-dom'
import {spanstyle,divstyle} from './styles.css'

const Monitorselection = React.createClass ({  
  getInitialState() {
    return { 
      instanceChecked:false,
      containerChecked:false,
      clusterChecked:false
   
  }
},


onChangeInstance(e){
  if(e.target.checked==true){
    this.setState({instanceChecked:true})
    this.props.setMonitordata("instanceChecked",true)
  }
  else{
    this.setState({instanceChecked:false})
    this.props.setMonitordata("instanceChecked",false)

  }
  
},
onChangeContainers(e){
  if(e.target.checked==true){
    this.setState({containerChecked:true})
    this.props.setMonitordata("containerChecked",true)
  }
  else{
    this.setState({containerChecked:false})
    this.props.setMonitordata("containerChecked",false)

  }
  
},
onChangeClusetrs(e){
  if(e.target.checked==true){
    this.setState({clusterChecked:true})
    this.props.setMonitordata("clusterChecked",true)
  }
  else{
    this.setState({clusterChecked:false})
    this.props.setMonitordata("clusterChecked",false)

  }
  
},


render() {
 
/*
  const tooltipEmailPopover = (
      <Popover style={{height:40,color:'black',borderWidth: 2,
                      borderRadius:0,width:150}}>
        {this.state.tooltipEmailText}
      </Popover>
  );*/

  return (
    <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#e5efff'}}>
      <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
      </div>
       <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
         
         <ControlLabel><h3 style={{fontSize:'15px'}}><strong>ENABLE MONITORING  &nbsp;&nbsp;&nbsp; </strong> 
          </h3></ControlLabel><br/>

         <input type='Checkbox' style={{position:'absolute'}} id="Instances" value="Instances" name="Instances" onChange={this.onChangeInstance} checked={this.state.instanceChecked}/> 
         <label style={{display:'inline',fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',overflow:'hidden',height:'22px','lineHeight':'20px'}} htmlFor="Instances" title="Instances">&nbsp;&nbsp;Instances</label><br/><br/>
         
         <input type='Checkbox' style={{position:'absolute'}} id="Containers" value="Containers" name="Containers" onChange={this.onChangeContainers} checked={this.state.containerChecked}/> 
         <label style={{display:'inline',fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',overflow:'hidden',height:'22px','lineHeight':'20px'}} htmlFor="Containers" title="Containers">&nbsp;&nbsp;Containers</label><br/><br/>
         
         <input type='Checkbox' style={{position:'absolute'}} id="Clusters" value="Clusters" name="Clusters" onChange={this.onChangeClusetrs} checked={this.state.clusterChecked}/> 
         <label style={{display:'inline',fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',overflow:'hidden',height:'22px','lineHeight':'20px'}} htmlFor="Clusters" title="Clusters">&nbsp;&nbsp;Clusters</label><br/><br/>

      </div>
    </div>

    );
  }    
})  

export {Monitorselection}