import React, { PropTypes } from 'react'
import {Modal,ControlLabel} from 'react-bootstrap'
import {modalContainer,deleteDialogClass,infoCircle, modal} from './styles.css'
import {modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {customModal} from 'sharedStyles/customCSS.css'
import {RuleList} from './RuleList'
import {SpinnyLogo} from 'containers'

 export const RuleListModal = React.createClass({
  getInitialState() {
    return {
      show: false,
      divHeight:600
    };
  },

  closeModal() {
    this.setState({showModal: false});
  },

  openModal(){
    this.setState({showModal: true });
    setTimeout(function(){
      document.querySelector('.modal-backdrop').style.opacity=0        
    }, 50);    
  },

  render() {

    return (
    <span className={modalContainer} >
      <a href='JavaScript: void(0)' title="Show all policies" style={{paddingRight:30,textDecoration:'none'}} onClick={this.openModal}>
        &nbsp;&nbsp;
         <ControlLabel style={{color:'#00C484',fontSize: '15px'}} >
            <i style={{paddingRight:'0.25em'}}>Show all policies</i>
        </ControlLabel>
      </a>
      <Modal
        show={this.state.showModal}
        onHide={this.closeDelete}
        aria-labelledby="contained-modal-title"
        // className="modal fade left"
        className="myClass"
        dialogClassName={deleteDialogClass}
        onClick={this.closeModal}
        >
        <form style={{border: '1px solid Navy'}}>
        <Modal.Header style={{marginRight:5,borderBottom:0}}>
         <a style={{textDecoration:'none', width:window.innerWidth, height:'110%', position:'absolute', left:-window.innerWidth/2, top:0}} href="javascript:void(0)" onClick={this.closeModal}>X</a>
         <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <br/>
          <Modal.Title id="contained-modal-title"
                style={{fontWeight:'bold', fontSize:18, fontColor:'#faffff', marginTop:-14, marginLeft:20, marginBottom:20}}>{this.props.rootTitle} - Policies</Modal.Title>

        </Modal.Header>
        <Modal.Body style={{fontSize:15}}>
        <div style={{height:490,overflowY:'auto', marginTop:-30, fontSize:15}}>
        { this.props.isFetching?
          <SpinnyLogo/>
          :
          <RuleList 
            policyPackPath={this.props.policyPackPath} 
            osSelected={this.props.osSelected} 
            controlId={this.props.controlId} 
            profiles={this.props.profilesSelected}/>
        }
        </div>
        </Modal.Body>
        </form>
      </Modal>
    </span>
    );
  },
 })
