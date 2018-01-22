import React, {PropTypes} from 'react'
import { modalContainer , modalCloseStyle, closeButtonClass } from './styles.css'
import { blueBtn, btnPrimary,removeDialogClass} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Col } from 'react-bootstrap'
import {removeResourceFromGroup} from 'helpers/resources'
import closeButtonImg from 'assets/close_Button.png'

const RemoveResource = React.createClass({
  getInitialState() {
    return {
      showRemoveModal:false,
      removeButtonName:'Yes',
      removeButtonDisability:false
    };
  },

  closeRemove() {
    this.setState({
      showRemoveModal: false,
    });
  },

  openRemove(){
    this.setState({ showRemoveModal: true });
  },

  removeMethod(){
    this.setState({removeButtonName:'Removing',
                   removeButtonDisability:true})

    let removeResourceIds= this.props.selectedResourceIds;

    // removeResourceIds.map((removeIds, index)=>{
    //   console.log("removeResourceIds.map((removeIds", removeIds)

      //  for(let i =0 ; i< this.props.selectedResourceIds.length;i++){
      //      console.log("Inside remove from selected", this.props.selectedResourceIds[i])
      //      this.props.removeFromSelected(this.props.selectedResourceIds[i]);
      //      }

      removeResourceFromGroup(this.props.groupName, removeResourceIds)
        .then((response)=>{
          // console.log("Inside success remove "+removeIds)
          console.log("response"+JSON.stringify(response));
          // this.props.removeFromSelected(removeIds);
          this.props.refreshList();
          this.closeRemove();
        })
        .catch((removeResourceFromGroupsError)=>{
          console.log("Error in remove Credentials "+removeResourceFromGroupsError)
        })
    // })
  },


  render() {
    let close = () => this.setState({ showRemoveModal: false});
    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid Navy',
        borderRadius: 0,
        marginTop: 200,
        width:500,
      }

     let removeConfirmMessage;
    if(this.props.selectedResourceIds.length === 1){
      console.log("this.props.selectedResourceIdsthis.props.selectedResourceIds", this.props.selectedResourceName)
      removeConfirmMessage="Are you sure you want to remove resource, '"+this.props.selectedResourceName+"' ?"
    }else
    {
     removeConfirmMessage="Are you sure you want to remove these resources?"
    }

    return (
      <span className={modalContainer}>
        <a href='JavaScript: void(0)' onClick={this.openRemove}>
          Remove
        </a>
        <Modal
          show={this.state.showRemoveModal}
          onHide={this.closeRemove}
          aria-labelledby="contained-modal-title"
          dialogClassName={removeDialogClass}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <a href="javascript:void(0)"
               style={{position:'absolute', top:15, right:17}}
               className={modalCloseStyle}
               onClick={this.closeRemove}>
               <img style={{width:12,height:16}} src={closeButtonImg} alt='close_btn'/>
            </a>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'REMOVE RESOURCE'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
                  <p>{removeConfirmMessage}</p>
              </Modal.Body>
              <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeRemove}>
                  Cancel
                </Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                  disabled={this.state.removeButtonDisability} onClick={this.removeMethod}>
                  {this.state.removeButtonName}
                </Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
})

export default RemoveResource
