import React, {PropTypes} from 'react'
import { modalContainer , modalCloseStyle, closeButtonClass } from './styles.css'
import { blueBtn, btnPrimary,AdminResetPWDialogClass} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Col } from 'react-bootstrap'
import {AdminResetPWById} from 'helpers/user'
import {putUIContext} from 'helpers/context'
import closeButtonImg from 'assets/close_Button.png'

const AdminResetPW = React.createClass({
  getInitialState() {
    return {
      showAdminResetPWModal:false,
      AdminResetPWButtonName:'Yes',
      AdminResetPWButtonDisability:false
    };
  },

  closeAdminResetPW() {
    this.setState({
      showAdminResetPWModal: false,
    });

     for(let i =0 ; i< this.props.selectedUserIds.length;i++){
         console.log("Inside remove from selected")
         this.props.removeFromSelected(this.props.selectedUserIds[i]);
         }
  },

  openAdminResetPW(){
    this.setState({ showAdminResetPWModal: true });
  },

  AdminResetPWMethod(){
    this.setState({AdminResetPWButtonName:'Resetting',
                   AdminResetPWButtonDisability:true})

    let AdminResetPWUserIds= this.props.selectedUserIds;

    AdminResetPWUserIds.map((AdminResetPWIds, index)=>{
      console.log("AdminResetPWUserIds.map((AdminResetPWIds", AdminResetPWIds)
      AdminResetPWById(AdminResetPWIds)
        .then((response)=>{
          this.resetContext();
          console.log("Inside success AdminResetPW "+AdminResetPWIds)
          console.log("response"+JSON.stringify(response));
          this.props.removeFromSelected(AdminResetPWIds);
          this.props.refreshList();
          this.closeAdminResetPW();
        })
        .catch((AdminResetPWByIdsError)=>{
          console.log("Error in AdminResetPW Credentials "+AdminResetPWByIdsError)
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
    let close = () => this.setState({ showAdminResetPWModal: false});
    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid Navy',
        borderRadius: 0,
        marginTop: 200,
        width:500,
      }

     let AdminResetPWConfirmMessage;
    if(this.props.selectedUserIds.length === 1){
      console.log("this.props.selectedUserIdsthis.props.selectedUserIds", this.props.selectedUserName)
      AdminResetPWConfirmMessage="Are you sure you want to reset password for this user, '"+this.props.selectedUserName+"' ?"
    }else
    {
     AdminResetPWConfirmMessage="Are you sure you want to reset password for these users?"
    }

    return (
      <span className={modalContainer}>
        <a href='JavaScript: void(0)' onClick={this.openAdminResetPW}>
          Reset User Password
        </a>
        <Modal
          show={this.state.showAdminResetPWModal}
          onHide={this.closeAdminResetPW}
          aria-labelledby="contained-modal-title"
          dialogClassName={AdminResetPWDialogClass}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <a href="javascript:void(0)"
               style={{position:'absolute', top:17, right:15}}
               className={modalCloseStyle}
               onClick={this.closeAdminResetPW}>
               <img style={{width:15,height:19}} src={closeButtonImg} alt='close_btn'/>
            </a>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'RESET USER PASSWORD'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
                  <p>{AdminResetPWConfirmMessage}</p>
              </Modal.Body>
              <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeAdminResetPW}>
                  Cancel
                </Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                  disabled={this.state.AdminResetPWButtonDisability} onClick={this.AdminResetPWMethod}>
                  {this.state.AdminResetPWButtonName}
                </Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
})

export default AdminResetPW
