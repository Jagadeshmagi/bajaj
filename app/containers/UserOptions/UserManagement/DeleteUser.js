import React, {PropTypes} from 'react'
import { modalContainer , modalCloseStyle, closeButtonClass } from './styles.css'
import { blueBtn, btnPrimary,deleteDialogClass} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Col } from 'react-bootstrap'
import {deleteUserById} from 'helpers/user'
import {putUIContext} from 'helpers/context'
import closeButtonImg from 'assets/close_Button.png'

const DeleteUser = React.createClass({
  getInitialState() {
    return {
      showDeleteModal:false,
      deleteButtonName:'Yes',
      deleteButtonDisability:false
    };
  },

  closeDelete() {
    this.setState({
      showDeleteModal: false,
    });

     for(let i =0 ; i< this.props.selectedUserIds.length;i++){
         console.log("Inside remove from selected")
         this.props.removeFromSelected(this.props.selectedUserIds[i]);
         }
  },

  openDelete(){
    this.setState({ showDeleteModal: true });
  },

  deleteMethod(){
    this.setState({deleteButtonName:'Deleting',
                   deleteButtonDisability:true})

    let deleteUserIds= this.props.selectedUserIds;

    deleteUserIds.map((deleteIds, index)=>{
      console.log("deleteUserIds.map((deleteIds", deleteIds)
      deleteUserById(deleteIds)
        .then((response)=>{
          this.resetContext();
          console.log("Inside success delete "+deleteIds)
          console.log("response"+JSON.stringify(response));
          this.props.removeFromSelected(deleteIds);
          this.props.refreshList();
          this.closeDelete();
        })
        .catch((deleteUserByIdsError)=>{
          console.log("Error in delete Credentials "+deleteUserByIdsError)
        })
    })
  },

  resetContext(){
    putUIContext(this.state.username,false,false,false,false)
    .then((response) => {
      console.log('saved welcome page seen'+JSON.stringify(response.data))
    })
    .catch((response) =>{
      console.log('failed to save welcome seen'+JSON.stringify(response))
    })
  },


  render() {
    let close = () => this.setState({ showDeleteModal: false});
    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid Navy',
        borderRadius: 0,
        marginTop: 200,
        width:500,
      }

     let deleteConfirmMessage;
    if(this.props.selectedUserIds.length === 1){
      console.log("this.props.selectedUserIdsthis.props.selectedUserIds", this.props.selectedUserName)
      deleteConfirmMessage="Are you sure you want to delete user, '"+this.props.selectedUserName+"' ?"
    }else
    {
     deleteConfirmMessage="Are you sure you want to delete these users?"
    }

    return (
      <span className={modalContainer}>
        <a href='JavaScript: void(0)' onClick={this.openDelete}>
          Delete
        </a>
        <Modal
          show={this.state.showDeleteModal}
          onHide={this.closeDelete}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          keyboard={false}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <a href="javascript:void(0)"
               style={{position:'absolute', top:17, right:15}}
               className={modalCloseStyle}
               onClick={this.closeDelete}>
               <img style={{width:15,height:19}} src={closeButtonImg} alt='close_btn'/>
            </a>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'DELETE USER'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
                  <p>{deleteConfirmMessage}</p>
              </Modal.Body>
              <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeDelete}>
                  Cancel
                </Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                  disabled={this.state.deleteButtonDisability} onClick={this.deleteMethod}>
                  {this.state.deleteButtonName}
                </Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
})

export default DeleteUser
