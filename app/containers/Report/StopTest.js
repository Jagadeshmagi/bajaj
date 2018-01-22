import React, {PropTypes} from 'react'
import { modalContainer } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import {stopDiscovery} from 'helpers/discovery'

const StopTest = React.createClass({
  getInitialState(){
    return{
      showModal: false,
      isFetching: false
    }
  },
  closeModal() {
    this.setState({showModal: false});
  },
  openModal(){
    this.setState({showModal: true });
  },
  stopTest(){
    this.setState({isFetching:true});
    stopDiscovery(this.props.report.worklogid)
    .then(() => {
      this.closeModal();
      //let newReport = this.props.report;
      //newReport.status = 'ABORTED'
      //this.props.refreshAfterUpdate(this.props.report,newReport);
      this.setState({isFetching:false});
    })
    .catch((error) => {console.log("Error in stopTest : "+ error)})
    
  },
  render() {
    let close = () => this.setState({ show: false});
    let style = {
      ...this.props.style,
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid Navy',
      borderRadius: 0,
      marginTop: 200,
      width:500,
    }

    let confirmMsg = "Are you sure you want to stop the assessment '"+this.props.report.testName+"'?";

    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openModal}>
          Stop Assessment
        </a>
        {this.state.isFetching?
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'STOP ASSESSMENT'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Setting Stop Assessment. Please wait...</p>
          </Modal.Body>
        </Modal>
          :
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'STOP ASSESSMENT'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{confirmMsg}</p>
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeModal}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.stopTest}>Yes</Button>          
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})

export default StopTest
