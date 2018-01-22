import React, {PropTypes} from 'react'
import { modalContainer, modalCloseStyle } from './styles.css'
import { blueBtn, btnPrimary, deleteDialogClass } from 'sharedStyles/styles.css'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel } from 'react-bootstrap'
import {refreshAssetGroup} from 'helpers/assetGroups'
import {connect} from 'react-redux'

function findElement(arr, propName, propValue) {
  let group = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      group = arr[i];
  return group
}

const RefreshGroups = React.createClass({
  getInitialState(){
    return{
      showRefreshModal: false,
      isRefreshing: false
    }
  },
  closeRefresh() {
    this.setState({showRefreshModal: false});
  },
  openRefresh(){
    this.setState({showRefreshModal: true });
  },
  refreshGroups(){
    this.setState({isRefreshing:true});
    let refreshGroupIds= this.props.selectedIds;
    let user = this.props.loginName

    refreshGroupIds.map((groupId) => {
      refreshAssetGroup(groupId, user)
      .then(() => {
        this.closeRefresh();
        this.props.refreshList();
        // this.props.refreshSelected(groupId);
        this.setState({isRefreshing:false});
      })
      .catch((error) => {console.log("Error in refreshAssetGroup in refreshGroups: "+ error)})
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

    let refreshConfirmMsg = "Are you sure you want to rediscover the selected multiple Groups?";
    if(this.props.selectedIds.length === 1){
      let group = findElement(this.props.list,"id",this.props.selectedIds[0]);
      if(group != null){
        refreshConfirmMsg = "Are you sure you want to rediscover group '"+group.name+"'";
      }
    }
    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.openRefresh}>
          Rediscover
        </a>
        {this.state.isRefreshing?
        <Modal
          show={this.state.showRefreshModal}
          onHide={this.closeRefresh}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
          >
          <Modal.Header style={{marginRight:15,borderBottom:0}}>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'REDISCOVER GROUP'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Rediscovering selected groups. Please wait...</p>
          </Modal.Body>
        </Modal>
          :
        <Modal
          show={this.state.showRefreshModal}
          onHide={this.closeRefresh}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeRefresh}>x</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'REDISCOVER GROUP'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{refreshConfirmMsg}</p>
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={this.closeRefresh}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.refreshGroups}>Yes</Button>
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})

export default connect(
({users}) => ({loginName: users.login}) 
)(RefreshGroups)
