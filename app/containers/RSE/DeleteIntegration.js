import React, {PropTypes} from 'react'
import { modalContainer , modalCloseStyle, closeButtonClass } from './styles.css'
import { blueBtn, btnPrimary,deleteDialogClass} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Col } from 'react-bootstrap'
import {deleteIntegrationById} from 'helpers/integration'

const DeleteIntegration = React.createClass({
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
   
     for(let i =0 ; i< this.props.selectedIntegrationIds.length;i++){
         console.log("Inside remove from selected")
         this.props.removeFromSelected(this.props.selectedIntegrationIds[i]);
         }
          this.props.refreshIntegrationsList();

  },

  openDelete(){
    this.setState({ showDeleteModal: true });
  },

  deleteMethod(){
    this.setState({deleteButtonName:'Deleting',
                   deleteButtonDisability:true})  

    let deleteIntegrationIds= this.props.selectedIntegrationIds;
    
    deleteIntegrationIds.map((deleteIds)=>{
      deleteIntegrationById(deleteIds)
        .then((response)=>{
          console.log("Inside success delete "+deleteIds)
          console.log("response"+JSON.stringify(response));
          this.props.removeFromSelected(deleteIds);
          this.props.refreshIntegrationsList();
          this.closeDelete();
        })
        .catch((deleteIntegrationByIdsError)=>{
          console.log("Error in delete Credentials "+deleteIntegrationByIdsError)
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
    if(this.props.selectedIntegrationIds.length === 1){
      deleteConfirmMessage="Are you sure you want to delete integration '"+this.props.selectedIntegrationName+"' ?"
    }else
    {
     deleteConfirmMessage="Are you sure you want to delete these integrations?"
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
            <a className={closeButtonClass} onClick={this.closeDelete}>
                &#10005; 
            </a>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'DELETE INTEGRATION'}
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

export default DeleteIntegration
