import React, {PropTypes} from 'react'
import { blueBtn, btnPrimary, deleteDialogClass, footerBtn, modalCloseStyle } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, Glyphicon } from 'react-bootstrap'
import closeButtonImg from 'assets/close_Button.png'

const AlertComponent = React.createClass({
  getInitialState(){
    return{
      visible: false,
      message: ''
    }
  },
  show(msg,title=''){
    if(msg !== null){
      this.setState({visible:true,message:msg,title:title})
    }
  },
  dismissAlert(){
    this.setState({visible:false,message:''})
  },
  render() {
    return (

        <Modal 
          show={this.state.visible} 
          onHide={this.dismissAlert}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
        >
          <form style={{border: '1px solid Navy'}}>
          <div style={{marginTop:'10px',paddingLeft:'15px'}}>
            {this.state.title == '' ?
            <Modal.Header  style={{marginRight:15,borderBottom:0,marginBottom:15}}> 
              <a style={{textDecoration:'none',position:'absolute', top:15, right:30}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.dismissAlert}>
                <img style={{width:15,height:20}} src={closeButtonImg} alt='close'/>
              </a>
            </Modal.Header> :
            <Modal.Header  style={{marginRight:15,borderBottom:0}}> 
              <a style={{textDecoration:'none',position:'absolute', top:15, right:30}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.dismissAlert}>
                <img style={{width:15,height:20}} src={closeButtonImg} alt='close'/>
              </a>
              
              <Modal.Title  style={{fontSize: 22, fontWeight:'bold', color:'#454855'}}>
                {this.state.title}
              </Modal.Title>
            
            </Modal.Header>     
            }
            <Modal.Body style={{"padding-bottom":"0px","padding-top":"0px"}}>
              <p>{this.state.message}</p>
            </Modal.Body>

            <Modal.Footer style={{"border-top":"0px","padding-top":"0px"}}> 
                <a class="button" onClick={this.dismissAlert} href="javascript:void(0)">
                  <Button style={{float: "right"}} onClick={this.dismissAlert} className={footerBtn} >{"OK"}</Button>
                </a>     
            </Modal.Footer>   
          </div>
          </form>
        </Modal>

    );
  }
})

export default AlertComponent
