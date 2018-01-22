import React, {PropTypes} from 'react'
import { modalContainer } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import {stopDiscovery} from 'helpers/discovery'
import sockets from 'constants/socket'

const StopScan = React.createClass({
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
  stopScan(){
    this.setState({isFetching:true});
    stopDiscovery(this.props.selectedGroup.worklogid)
    .then(() => {
      this.closeModal();
      this.setState({isFetching:false});
      this.props.refreshedit(true);
      // socket.emit('removeFromLocalList', {id:this.props.selectedGroup.id});
      // this.removeFromLocalList(this.props.selectedGroup.id);
    })
    .catch((error) => {console.log("Error in stopScan : "+ error)})

  },
  // removeFromLocalList(id){
  //   let localList = JSON.parse(localStorage.getItem("localInProgress"));
  //   let removedList = _.filter(localList, function(item){
  //       return item[3] != id;
  //     });
  //   localStorage.setItem("localInProgress", JSON.stringify(removedList));
  // },
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

    let confirmMsg = "Do you want to stop assessment for the selected group?";

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
          keyboard={false}
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'STOP ASSESSMENT'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Setting Stop assessment. Please wait...</p>
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
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'STOP ASSESSMENT'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{confirmMsg}</p>
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeModal}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.stopScan}>Yes</Button>
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})

export default StopScan
