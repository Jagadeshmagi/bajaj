import React, {PropTypes} from 'react'
import { modalContainer } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import {repeatDiscovery} from 'helpers/discovery'
import ErrorMessages from 'constants/ErrorMessages';
import {dockerRescan} from 'helpers/docker'
import { connect } from 'react-redux'

const RepeatTest = React.createClass({
  getInitialState(){
    return{
      showModal: false,
      isFetching: false,
      disableYes: false
    }
  },
  closeModal() {
    this.setState({showModal: false,
                  disableYes:false});
  },
  openModal(){
    this.setState({showModal: true });
  },
  repeatTest(){
    this.setState({isFetching:true,
                  disableYes: true});   
    if(this.props.report.assetType!="IMAGE"){
      repeatDiscovery(this.props.report.worklogid, this.props.report.assetgroupid, this.props.loginName)
      .then((scanResponse) => {
        this.closeModal();
        //let newReport = this.props.report;
        //newReport.status = 'RUNNING'
        //this.props.refreshAfterUpdate(this.props.report,newReport);
        this.setState({isFetching:false});
        if(scanResponse !== null && scanResponse.data.output !== null && scanResponse.data.output === "time_completed")
        {
          this.props.showAlert(ErrorMessages.LICENSE_EXPIRED);
        }else if(scanResponse !== null && scanResponse.data.output !== null && scanResponse.data.output === "scans_completed")
        {
          this.props.showAlert(ErrorMessages.MAX_SCANS);
        }
        else{
          this.props.reloadList();
        }
      })
      .catch((error) => {console.log("Error in repeatTest : "+ error)})
    }
    else{
      dockerRescan(this.props.report.worklogid,this.props.report.assetgroupid, this.props.loginName)
       .then((scanResponse) => {
         this.closeModal();
        //let newReport = this.props.report;
        //newReport.status = 'RUNNING'
        //this.props.refreshAfterUpdate(this.props.report,newReport);
        this.setState({isFetching:false});
        if(scanResponse !== null && scanResponse.data.output !== null && scanResponse.data.output === "time_completed")
        {
          this.props.showAlert(ErrorMessages.LICENSE_EXPIRED);
        }else if(scanResponse !== null && scanResponse.data.output !== null && scanResponse.data.output === "scans_completed")
        {
          this.props.showAlert(ErrorMessages.MAX_SCANS);
        }
        else{
          this.props.reloadList();
        }

       })
       .catch((error) => {console.log("Error in repeatTestfordocker: "+ error)})
    }    
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

    let confirmMsg = "Are you sure you want to repeat the assessment '"+this.props.report.testName+"'";

    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openModal}>
          Repeat Assessment
        </a>
        {this.state.isDeleting?
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeDelete}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'REPEAT TEST'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Setting Repeat Assessment. Please wait...</p>
          </Modal.Body>
        </Modal>
          :
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'REPEAT TEST'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{confirmMsg}</p>
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeModal}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} disabled={this.state.disableYes}
            style={{borderRadius: 0}} onClick={this.repeatTest}>
              Yes
          </Button>          
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})

export default connect(
 ({users}) => ({loginName: users.login}),
)(RepeatTest)

