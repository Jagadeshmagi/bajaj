import React, {PropTypes} from 'react'
import { modalContainer , modalCloseStyle, closeButtonClass } from './styles.css'
import { blueBtn, btnPrimary,suspendDialogClass} from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Col } from 'react-bootstrap'
import {editUser} from 'helpers/user'
import closeButtonImg from 'assets/close_Button.png'

const SuspendUser = React.createClass({
  getInitialState() {
    return {
      showSuspendModal:false,
      suspendButtonName:'Yes',
      suspendButtonDisability:false,
      text: "suspend"
    };
  },

  componentDidMount(){
    console.log("this.props.suspend", this.props.suspend)
    if (this.props.suspend === false){
      this.setState({
        text: "activate"
      })
    }
  },

  // componentWillReceiveProps(nextProps){
  //   console.log("nextPropsnextPropsnextProps", nextProps)
  //   if (nextProps.suspend !== this.props.suspend){
  //     this.props.suspend = nextProps.suspend
  //   }
  // },

  closeSuspend() {
    this.setState({
      showSuspendModal: false,
    });

     for(let i =0 ; i< this.props.selectedUserIds.length;i++){
         console.log("Inside remove from selected")
         this.props.removeFromSelected(this.props.selectedUserIds[i]);
         }
  },

  openSuspend(){
    this.setState({ showSuspendModal: true });
  },

  suspendMethod(){
    this.setState({suspendButtonName:'Suspending',
                   suspendButtonDisability:true})

     if (this.props.suspend === false){
       this.setState({
         suspendButtonName:"Activating"
       })
     }

    let suspendUserIds= this.props.selectedUserIds;

    suspendUserIds.map((suspendIds, index)=>{
      console.log("suspendUserIds.map((suspendIds", suspendIds)
      editUser(suspendIds, {active:!this.props.suspend})
        .then((response)=>{
          console.log("Inside success suspend "+suspendIds)
          console.log("response"+JSON.stringify(response));
          this.props.removeFromSelected(suspendIds);
          this.props.refreshList();
          this.closeSuspend();
        })
        .catch((editUsersError)=>{
          console.log("Error in suspend Credentials "+editUsersError)
        })
    })
  },


  render() {
    let close = () => this.setState({ showSuspendModal: false});
    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid Navy',
        borderRadius: 0,
        marginTop: 200,
        width:500,
      }

     let suspendConfirmMessage;
    if(this.props.selectedUserIds.length === 1){
      // console.log("this.props.selectedUserIdsthis.props.selectedUserIds", this.state.text)
      suspendConfirmMessage=`Are you sure you want to ${this.state.text} user, ${this.props.selectedUserName}?`
    }else
    {
     suspendConfirmMessage="Are you sure you want to suspend these users?"
    }

    return (
      <span className={modalContainer}>
        <a href='JavaScript: void(0)' onClick={this.openSuspend}>
          {this.props.suspend?"Suspend":"Activate"}
        </a>
        <Modal
          show={this.state.showSuspendModal}
          onHide={this.closeSuspend}
          keyboard={false}
          aria-labelledby="contained-modal-title"
          dialogClassName={suspendDialogClass}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <a href="javascript:void(0)"
               style={{position:'absolute', top:17, right:15}}
               className={modalCloseStyle}
               onClick={this.closeSuspend}>
               <img style={{width:15,height:19}} src={closeButtonImg} alt='close_btn'/>
            </a>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {`${this.state.text.toUpperCase()} USER`}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
                  <p>{suspendConfirmMessage}</p>
              </Modal.Body>
              <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeSuspend}>
                  Cancel
                </Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                  disabled={this.state.suspendButtonDisability} onClick={this.suspendMethod}>
                  {this.state.suspendButtonName}
                </Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
})

export default SuspendUser
