import React, {PropTypes} from 'react'
import {Cell} from 'fixed-data-table'
import {deleteDockerImageByLabel} from 'helpers/docker'
import {CreateGroup} from 'containers'
import {Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Modal,Button} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import { blueBtn, btnPrimary, deleteDialogClass } from 'sharedStyles/styles.css'
import { modalContainer, modalCloseStyle } from './styles.css'


function findElement(arr, propName, propValue) {
  let group = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      group = arr[i];
  return group
}

const DeleteImages = React.createClass({
  getInitialState(){
    return{
      showDeleteModal: false,
      isDeleting: false
    }
  },
  closeDelete() {
    this.setState({showDeleteModal: false});
  },
  openDelete(){
    this.setState({showDeleteModal: true });
  },
  deleteImag(){
    this.setState({isDeleting:true});
    let deleteLabels= this.props.selectedIds;

    deleteLabels.map((label) => {
      deleteDockerImageByLabel(label)
      .then(() => {
        this.closeDelete();
       
        this.props.refreshList();
        this.props.refreshSelected(label);
        this.setState({isDeleting:false});
      })
      .catch((error) => {console.log("Error in deleteImage  "+ error)})
       this.closeDelete();
       this.setState({isDeleting:false});
    })
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

    let delConfirmMsg = "Are you sure you want to delete the selected multiple Images?";
    if(this.props.selectedIds.length === 1){
      let group = findElement(this.props.list,"id",this.props.selectedIds[0]);
      if(group != null){
        
        delConfirmMsg = "Are you sure you want to delete the image '"+group.imageName+"'";
      }
    }
    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openDelete}>
          Delete
        </a>
        {this.state.isDeleting?
        <Modal 
          show={this.state.showDeleteModal} 
          onHide={this.closeDelete}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DELETE IMAGE'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Deleting selected Images. Please wait...</p>
          </Modal.Body>
        </Modal>
          :
        <Modal 
          show={this.state.showDeleteModal} 
          onHide={this.closeDelete}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeDelete}>X</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DELETE IMAGE'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{delConfirmMsg}</p>
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeDelete}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.deleteImag}>Yes</Button>          
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})

export default DeleteImages

