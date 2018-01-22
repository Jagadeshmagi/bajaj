import React, {PropTypes} from 'react'
import { modalContainer, modalCloseStyle } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import {deleteAssetGroup} from 'helpers/assetGroups'

function findElement(arr, propName, propValue) {
  let group = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      group = arr[i];
  return group
}

const DeleteGroups = React.createClass({
  getInitialState(){
    return{
      showDeleteModal: false,
      isDeleting: false,
      runningGroup:false,
      

    }
  },
  closeDelete() {
    this.setState({showDeleteModal: false,runningGroup:false});
  },
  
  openDelete(){
    this.props.selectedIds.map((grp)=>{
       let group = findElement(this.props.list,"id",grp);
      if(group.discovery_status=='RUNNING'){
        this.setState({runningGroup:true})
      }

    })

    

    this.setState({showDeleteModal: true });
  },
  deleteGroups(){
    this.setState({isDeleting:true});
    let deleteGroupIds= this.props.selectedIds;

    deleteGroupIds.map((groupId) => {
      deleteAssetGroup(groupId)
      .then(() => {
        this.closeDelete();
        this.props.refreshList(groupId);
        this.props.refreshSelected(groupId);
        this.setState({isDeleting:false});
      })
      .catch((error) => {console.log("Error in deleteAssetGroup in deleteGroups: "+ error)})
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

    let delConfirmMsg = "Are you sure you want to delete the selected multiple Groups?";
    if(this.props.selectedIds.length === 1){
      let group = findElement(this.props.list,"id",this.props.selectedIds[0]);
      if(group != null){
        delConfirmMsg = "Are you sure you want to delete group '"+group.name+"'";
      }
    }
    else if(this.state.runningGroup===true){
      delConfirmMsg='The selected list contains groups in running status. So the delete action cannot be performed now.'
    }
    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openDelete}>
          Delete
        </a>
        {this.state.runningGroup?
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
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DELETE GROUP'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Delete cannot be done, the selection list includes groups having scans in running state.</p>
          </Modal.Body>
           <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0,marginTop:-10}}>
              <Button className={blueBtn} onClick={this.closeDelete}>Close</Button>
         
            </Modal.Footer>
           </Modal>

          :
        <div>
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
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DELETE GROUP'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Deleting selected groups. Please wait...</p>
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
            <a style={{textDecoration:'none'}} href="javascript:void(0)" style={{marginTop:0, textDecoration:'none'}} className={modalCloseStyle} onClick={this.closeDelete}>x</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DELETE GROUP'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{delConfirmMsg}</p>
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeDelete}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.deleteGroups}>Yes</Button>          
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
        </div>
       }
      </span>
    );
  }
})

export default DeleteGroups
