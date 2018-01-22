import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import {enableAlert} from 'helpers/alerts'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import { blueBtn, btnPrimary, deleteDialogClass, modalCloseBtnStyle } from 'sharedStyles/styles.css'

class EnableAlert extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      showModal:false,
      //selectedId:this.props.selectedAlerts[0].id,
      selectedId:[],
      isEnabling: false
    }
  }

  closeModal() {
    this.setState({showModal: false});
  }
  openModal(){
    /*if(!this.state.showModal)
      this.setState({showModal:true})
    else
      this.setState({showModal:false})*/
    this.setState({selectedIds: []});
    this.getSelectedIdsForEnable();
    this.setState({showModal: true });
  }
  getSelectedIdsForEnable(){
    let validIds = [];
   
    this.props.selectedAlerts.map((alert) => {
      
        validIds.push(alert.id);
      
    })
    this.setState({selectedIds: validIds});
    
  }

  handleDisableAlert(){
     let enableIds= this.state.selectedIds;
    if(enableIds !== null && enableIds.length>0){
      this.setState({isEnabling:true});
      enableIds.map((id) => {
     
       enableAlert(id)
        .then((responce) => {
          this.setState({isEnabling:false});
          this.props.removeFromSelected(id);
          this.props.refreshList();
          console.log('I am in sucess'+ JSON.stringify(responce))
          
        })
        .catch((error) => {
          console.log("Error in deleteAlert in delete tests: "+ error);
          this.setState({isEnabling:false});
        //  this.props.removeReport(id);
          
        })
         this.setState({showModal:false})
      })
    }else{
      this.closeModal();
    }



   /* disableAlert(this.state.selectedId)
    .then((responce) => {
      this.props.refreshList();
      this.props.removeFromSelected(this.state.selectedId);
      console.log('I am in sucess'+ JSON.stringify(responce))
    })
    .catch((error) => {
      console.log("Error in Disable Alert in RSE:" + error)
    })
    this.setState({showModal:false})*/
  }

  render(){

    //let confirmMsg = "Are you sure you want to disable the selected alert";
     let confirmMsg = "Are you sure you want to enable the selected multiple alerts?";
    if(this.props.selectedAlerts&&this.props.selectedAlerts.length === 1){
      if(this.props.selectedAlerts[0]&&this.props.selectedAlerts[0].name != null){
        confirmMsg = "Are you sure you want to enable alert '"+this.props.selectedAlerts[0].name+"'";
      }
    }

    return(
      <span>
        <a href='JavaScript: void(0)' onClick={this.openModal.bind(this)}>
          Enable
        </a>
        {this.state.isEnabling?
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal.bind(this)}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          keyboard={false}
          backdrop='static'
         >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'ENABLE ALERTS'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Enabling selected alerts. Please wait...</p>
          </Modal.Body>
        </Modal>
          :
        <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal.bind(this)}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none', fontSize:28, top:15}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal.bind(this)}>x</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'ENABLE ALERTS'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{confirmMsg}</p>
           
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeModal.bind(this)}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.handleDisableAlert.bind(this)}>Yes</Button>          
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }


       {/* <Modal 
          show={this.state.showModal} 
          onHide={this.closeModal.bind(this)}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none', fontSize:28, top:15}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal.bind(this)}>x</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DISABLE ALERT'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{confirmMsg}</p>
           
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeModal.bind(this)}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.handleDisableAlert.bind(this)}>Yes</Button>          
         </Modal.Footer>
         </div>
         </form>
        </Modal>*/}
      </span>
    )  
  }
}

export default EnableAlert

EnableAlert.contextTypes = {
  router: React.PropTypes.func.isRequired
};