import React, {PropTypes} from 'react'
import { modalContainer } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import {deleteReport} from 'helpers/reports'

function findElement(arr, propName, propValue,columnToBeReturned) {
  var obj ;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue){
      obj = arr[i][columnToBeReturned];
    }
  return obj
}

const DeleteTest = React.createClass({
  getInitialState(){
    return{
      selectedIds: [],
      runningReports: false,
      showModal: false,
      isDeleting: false
    }
  },
  closeModal() {
    this.setState({showModal: false});
  },
  openModal(){
    this.setState({selectedIds: []});
    this.getSelectedIdsForDelete();
    this.setState({showModal: true });
  },
  getSelectedIdsForDelete(){
    let validIds = [];
    let runningReportsState=false;
    this.props.selectedReports.map((report) => {
      if(report.status !== 'COMPLETED' && report.status !== 'ABORTED'){
        runningReportsState = true;
      }else{
        validIds.push(report.worklogid);
      }
    })
    this.setState({selectedIds: validIds});
    this.setState({runningReports:runningReportsState});
  },
  deleteTests(){
    let deleteIds= this.state.selectedIds;
    if(deleteIds !== null && deleteIds.length>0){
      this.setState({isDeleting:true});
      deleteIds.map((id) => {
        let assettype=findElement(this.props.selectedReports,"worklogid",id,"assetType")
        deleteReport(id, assettype)
        .then(() => {
          this.setState({isDeleting:false});
          let ids=findElement(this.props.selectedReports,"worklogid",id,"id")
          this.props.removeReport(ids);
          this.closeModal();
        })
        .catch((error) => {
          console.log("Error in deleteReport in delete tests: "+ error);
          this.setState({isDeleting:false});
        //  this.props.removeReport(id);
          this.closeModal();
        })
      })
    }else{
      this.closeModal();
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

    let confirmMsg = "Are you sure you want to delete the selected multiple tests?";
    if(this.props.selectedReports&&this.props.selectedReports.length === 1){
      if(this.props.selectedReports[0]&&this.props.selectedReports[0].testName != null){
        confirmMsg = "Are you sure you want to delete test '"+this.props.selectedReports[0].testName+"'";
      }
    }

    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openModal}>
          Delete
        </a>
        {this.state.isDeleting?
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DELETE TEST'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Deleting selected tests. Please wait...</p>
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
            <a style={{textDecoration:'none', fontSize:28, top:15}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>x</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DELETE TEST'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{confirmMsg}</p>
            {this.state.runningReports? <p>Reports in running state will not be deleted.</p> : ""}
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeModal}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.deleteTests}>Yes</Button>          
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})

export default DeleteTest
