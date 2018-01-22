import React, { Component, PropTypes } from 'react'
import {Popover,Tooltip, Table, ButtonToolbar,ButtonGroup, Button , 
		SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel,
		HelpBlock, OverlayTrigger ,Checkbox, Radio} from 'react-bootstrap'
import {navbar,footerBtn,selectStyle} from 'sharedStyles/styles.css'
import {PolicyPacks} from './PolicyPacks'
import {italic1,divContainer,footerDivContainer,customHrBefore,toDoCircle,
		inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,
		completedOuterCircle} from './styles.css'
import ReactDOM from 'react-dom'


function MultistepHeader(stepCount) {
  return (
    <table className="col-lg-12 col-sm-12 col-md-12 col-xs-12" 
    	style={{width: '90%',fontSize: 15,marginLeft:20}}>
     <tbody>
    <tr>
    </tr>
    <tr>
    </tr>
          <tr >
          <td style={{width:'33.33%'}}>
           <span  className={inProgressOuterCircle}>
             <span  className={inProgressInnerCircle}>
             </span>
           </span>
          </td>
          <td style={{width:'33.33%'}}>
           <span  className={toDoCircle}>
           </span>
          </td>
          <td style={{width:'30.33%'}}>
          <span className={toDoCircle}>
          </span>
          </td>
          </tr>
          <tr >
              <td>
                <ul style={{listStyleType:'none',color:'white'}}>
                    <li style={{marginTop:93}}>DISCOVER</li>
                    <li> RESOURCES</li>
                </ul>
              </td>
              <td>
                <ul style={{listStyleType:'none',color:'white'}}>
                    <li style={{marginTop:93}}>SELECT POLICY</li>
                    <li> PACKS</li>
                </ul>
              </td>
              <td>
                <ul style={{listStyleType:'none',color:'white'}}>
                    <li style={{marginTop:93}}>SCHEDULE</li>
                    <li> ASSESSMENTS</li>
                </ul>
              </td>
          </tr>
        </tbody>
      </table>
  )
}


export const WizardSteps =  React.createClass({
    getInitialState(){
    return{
      totalStepCount:3,
      currentStep:1,
      stepNames:[]
    }
  },

  componentDidMount(){
  },

  

  render: function () {
    return(
     <div className={divContainer}>
    	<br/>
    	<MultistepHeader/>
    </div>
    );
  }
})




