import React, { Component, PropTypes } from 'react'
import {Popover,ProgressBar, PopOver, Overlay,InputGroup, ButtonToolbar,ButtonGroup, Button ,Glyphicon, SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio} from 'react-bootstrap'
import { connect } from 'react-redux'
import {divContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle} from './styles.css'
import { navbar,footerBtn } from 'sharedStyles/styles.css'
import {linestyle} from './styles.css'
import ReactDOM from 'react-dom';
import {mytablepol, verticalLine} from './styles.css'
import {progress} from 'sharedStyles/styles.css'
import {Header} from 'components'


const PolicyPacksSelection = React.createClass ({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

   getInitialState(){
    return{
       selected: [],
       bordercolor:'0px',
       }
   },

   componentDidMount(){
    this.setState({selected: []});
  },
  showPoliciesChecked(e){
    let chkVal = e.target.id;
    const index = this.state.selected.indexOf(chkVal)
    let newList = this.state.selected.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selected: newList})
    console.log(this.state.selected);
  },

render() {
    let headingColor = {backgroundColor: '#DCDCDC',color:'black'}
    let standingLineStyle = {fontSize: 25,height: 85,paddingTop:2,paddingBottom: 3}
    let containerStyle={border:'1',borderColor:'gray',paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}
    let style={
        ...this.props.style,
        position: 'absolute',
        backgroundColor: '#ffffff',
        borderRadius: 0,
        marginLeft: 494,
        paddingLeft: 5,
        zIndex: 2,
        fontSize: 12,
        width:916,
        boxShadow: "-0px -2px -0px rgba(232,232,232,1)",
        height: '1835px'
    }
    return(      
      <div style={containerStyle} className="container">
            <div className="row"> 
             
              <div className="col-lg-12 ">
                <Col xs={11}>
                  <FormGroup  controlId="search" >
                    <InputGroup>
                      <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                        <FormControl type="text" placeholder="Search for policy packs, control families, controls, policies or rules…"  />  
                    </InputGroup>
                  </FormGroup> 
                </Col>
              </div>
            </div>

    <div className="row " style={{height: '900px'}}> 
       
        <div className="col-lg-12" id="policyPacksList">
          <table className={mytablepol} >
          <thead>
            <tr><th>POLICY PACKS</th></tr>
          </thead>
              <tbody>
                {
                  this.state.policiesList.map(function(policyPack){
                    return (
                      <tr key={policyPack.id}>
                    <td style={{paddingRight: 0,paddingLeft: 10,marginRight: 0,marginLeft:0,width:'35%'}}>
                     <input type='checkbox' id={policyPack.name} onChange={this.props.selectPolicies}/>
                     <label htmlFor={policyPack.name} ></label>
                     <label >&nbsp;&nbsp;<img style={{valign: 'top'}} src={policyPack.image}/></label>
                    </td>
                    <td style={{paddingRight: 10,paddingLeft: 0,marginRight: 0,marginLeft:0}}>
                    <label className={verticalLine} style={standingLineStyle}></label>
                    </td>
                    <br/>
                    <td style={{paddingTop:25,paddingBottom:25,paddingRight:'10px',paddingLeft:0}}> 
                      {policyPack.name}
                      <br/>
                      {policyPack.description1}
                      <br/>
                     <strong> {policyPack.description2} </strong>
                    </td>  
                  </tr>
                    );
                  }.bind(this))
                }
            </tbody>
          </table>
        </div>
      </div>
   

    </div>

    );
    }    
})  

export default  PolicyPacksSelection 