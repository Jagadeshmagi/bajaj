import React, {PropTypes} from 'react'
import { modalContainer , modalCloseStyle, closeButtonClass } from './styles.css'
import { blueBtn, btnPrimary,deleteDialogClass} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Col } from 'react-bootstrap'
import {deleteTemplate} from 'helpers/schedules'

const DeleteTemplates = React.createClass({
  getInitialState() {
    return { 
      templatesList:[],
      showDeleteModal:false,
      deleteButtonName:'Yes',
      deleteButtonDisability:false
    };
  },

  closeDelete() { 
    this.setState({ 
      showDeleteModal: false,
    });
   
     for(let i =0 ; i< this.props.selectedTemplatesList.length;i++){
         this.props.removeFromSelected(this.props.selectedTemplatesList[i]);
         }
           this.props.refreshTemplatesList();

  },

  openDelete(){
    this.setState({ showDeleteModal: true });
  },

  deleteMethod(){
    this.setState({deleteButtonName:'Deleting',
    deleteButtonDisability:true })  
    let deleteCredIds= this.props.selectedTemplatesList;
    deleteCredIds.map((deleteIds)=>{
      deleteTemplate(deleteIds)
      .then((response)=>{
        this.props.removeFromSelected(deleteIds);
         this.props.refreshTemplatesList();
        this.closeDelete();
      })
      .catch((deleteTemplateError)=>{
        console.log("Error in delete Credentials "+deleteTemplateError)
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
    
      if(this.props.groupsAssigned===true){
        deleteConfirmMessage="Deletion of template'"+this.props.selectedTemplateName+"' will affect one or more Asset Groups. Do you want to continue?"
      }else{
      deleteConfirmMessage="Are you sure you want to delete template '"+this.props.selectedTemplateName+"' ?"}
    

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
                  {'DELETE TEMPLATE'}
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

export default DeleteTemplates
