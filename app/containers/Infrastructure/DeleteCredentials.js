import React, {PropTypes} from 'react'
import { modalContainer , modalCloseStyle, closeButtonClass} from './styles.css'
import { blueBtn, btnPrimary,deleteDialogClass} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Col } from 'react-bootstrap'
import {deleteCredential} from 'helpers/credentials'
import getCredentialsList from 'helpers/credentials'

const DeleteCredentials = React.createClass({
  getInitialState() {
    return { 
      clist:[],
      showDeleteModal:false,
      deleteButtonName:'Yes',
      deleteButtonDisability:false
    };
  },

  closeDelete() { 
    this.setState({ 
      showDeleteModal: false,
    });
   
     for(let i =0 ; i< this.props.selectedCredIds.length;i++){
         console.log("Inside remove from selected")
         this.props.removeFromSelected(this.props.selectedCredIds[i]);
         }
          this.props.refreshCredentialsList();

  },

  openDelete(){
    this.setState({ showDeleteModal: true });
  },

  deleteMethod(){
    this.setState({deleteButtonName:'Deleting',
      deleteButtonDisability:true })  
    console.log("Multiple delete")
    let deleteCredIds= this.props.selectedCredIds;
    console.log("The ids in delete selection are "+deleteCredIds)
    deleteCredIds.map((deleteIds)=>{
      console.log("Deleting "+deleteIds)
      deleteCredential(deleteIds)
      .then((response)=>{
        console.log("Inside success delete "+deleteIds)
        console.log("response"+JSON.stringify(response));
        this.props.removeFromSelected(deleteIds);
        this.props.refreshCredentialsList();
        this.closeDelete();
      })
      .catch((deleteCredentialsError)=>{
        console.log("Error in delete Credentials "+deleteCredentialsError)
      })
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
    if(this.props.selectedCredIds.length === 1){
      deleteConfirmMessage="Are you sure you want to delete credential '"+this.props.selectedCredName+"' ?"
    }else
    {
     deleteConfirmMessage="Are you sure you want to delete these credentials?"
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
            <a className={modalCloseStyle} onClick={this.closeDelete}>
                x 
            </a>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'DELETE CREDENTIAL'}
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

export default DeleteCredentials
