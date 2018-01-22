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
import {PolicyPacksList} from 'containers/PolicyPacksList/PolicyPacksList'


const PolicyPacksWithoutFooter = React.createClass ({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return{
        selectedSet: [],
       bordercolor:'0px',
       }
   },

  componentDidMount(){
    this.setState({selectedSet: []});
  },
  saveSelectedSet(newSelectedList){
    this.setState({selectedSet:newSelectedList},function(){
      console.log("selectedSet "+this.state.selectedSet)
    })
  },
  saveSelectedArtifacts(newSelectedList){
   
    this.setState({selectedArtifacts:newSelectedList},function(){
      console.log("selectedArtifacts "+this.state.selectedArtifacts)
    })
  },

render() {
    let headingColor = {backgroundColor: '#DCDCDC',color:'black'}
    let standingLineStyle = {fontSize: 25,height: 85,paddingTop:2,paddingBottom: 3}
    let containerStyle={border:'1px',borderColor:'gray',paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}
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
       <Header name="Policy Packs" />
          <br />
          <PolicyPacksList selectedSet={this.state.selectedSet} saveSelectedSet={this.saveSelectedSet} isEditable={false}/>
      </div>

    );
    }    
})  

export default  PolicyPacksWithoutFooter 