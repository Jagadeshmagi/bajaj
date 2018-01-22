import React, {PropTypes} from 'react'
import {Cell} from 'fixed-data-table'
import {Button,Popover, Modal } from 'react-bootstrap'
import {CreateGroup} from 'containers'
import {CreateUser, DeleteUser, SuspendUser, ResetUser, CreateRole} from 'containers'

export const ActionLinksRole = React.createClass({
  getInitialState(){
    return {
      completeStatus:true
    }
  },
  render:function()
  {
    const {selectedResources, numAccessible, numInaccessible, numSelected, ...props} = this.props;
    const style={marginBottom: 15}
    let separator = ''
    let totalCount = numAccessible+numInaccessible
    if(totalCount === 0){
      return <div style={style}>0 Actions</div>
    }
    if (numSelected > 1) {
       separator = ' | '
    }
    return numSelected == 0
    ?
      <div style={style}>
        {totalCount} Actions: &nbsp;
        <a href='javascript: void(0)'>
          <CreateRole
            refreshList={this.props.refreshList}
            saveRoleSuccess = {this.props.saveRoleSuccess}/> &nbsp;
        </a>&nbsp;
      </div>
    :
      <div style={style}>
        {totalCount} Actions: &nbsp;
        <a href='javascript:void(0)'>Create</a> &nbsp;
        | &nbsp; <a href='javascript:void(0)'>Suspend</a> &nbsp; | &nbsp;
        <a href='javascript:void(0)'>Delete</a> &nbsp;

        {/*<span style={{marginLeft:5}}><a href='javascript:void(0)' onClick={()=>this.props.cherryPickedDiscover(this.props.selectedResources)}>Discover</a></span>*/}
      </div>
  }
})

export const ActionLinksUsers = React.createClass({
  getInitialState(){
    return {
      completeStatus:true
    }
  },
  render:function()
  {
    const {selectedUserIds, numSelected, numUsers, ...props} = this.props;
    console.log("this.props.suspendthis.props.suspend", this.props.suspend)
    const style={marginBottom: 15}
    let separator = ''
    let totalCount = numUsers
    console.log("totalCount", totalCount)
    if(totalCount === 0){
      return (
        <div style={style}>
          <span>{totalCount} Users</span>&nbsp;
           | &nbsp;<CreateUser refreshList={this.props.refreshList} removeFromSelected={this.props.removeFromSelected} selectedUserIds={this.props.selectedUserIds}/> &nbsp;
        </div>
      )
    }
    if (numSelected > 1) {
       separator = ' | '
    }
    return numSelected == 0
    ?
      <div style={style}>
        <span>{totalCount} Users</span>&nbsp;
         | &nbsp;
         <CreateUser
           refreshList={this.props.refreshList}
           saveUserSuccess = {this.props.saveUserSuccess}/> &nbsp;
      </div>
    : numSelected == 1?
      <div style={style}>
        {totalCount} Users &nbsp;
        {numSelected} Selected:&nbsp;{' '}
        <CreateUser refreshList={this.props.refreshList}
          selectedUserIds={this.props.selectedUserIds}
          removeFromSelected={this.props.removeFromSelected}
          saveUserSuccess = {this.props.saveUserSuccess}
          /> &nbsp; | &nbsp;
        <CreateUser
          edit={true}
          selectedUserIds={this.props.selectedUserIds}
          removeFromSelected={this.props.removeFromSelected}
          refreshList={this.props.refreshList}
          saveUserSuccess = {this.props.saveUserSuccess}/> &nbsp; | &nbsp;
        <SuspendUser
          suspend={this.props.suspend}
          refreshList={this.props.refreshList}
          selectedUserIds={this.props.selectedUserIds}
          removeFromSelected={this.props.removeFromSelected}
          selectedUserName={this.props.selectedUserName}/> &nbsp; | &nbsp;
        <DeleteUser
          refreshList={this.props.refreshList}
          selectedUserIds={this.props.selectedUserIds}
          removeFromSelected={this.props.removeFromSelected}
          selectedUserName={this.props.selectedUserName}/> &nbsp;
        {/*  | &nbsp;
        <ResetUser
          refreshList={this.props.refreshList}
          selectedUserIds={this.props.selectedUserIds}
          removeFromSelected={this.props.removeFromSelected}
          selectedUserName={this.props.selectedUserName}/> &nbsp;*/}

        {/*<span style={{marginLeft:5}}><a href='javascript:void(0)' onClick={()=>this.props.cherryPickedDiscover(this.props.selectedResources)}>Discover</a></span>*/}
      </div>
      :
      <div style={style}>
        {totalCount} Users &nbsp;
        {numSelected} Selected:&nbsp;{' '}
        <CreateUser
            refreshList={this.props.refreshList}
            saveUserSuccess = {this.props.saveUserSuccess}/> &nbsp; | &nbsp;
        <DeleteUser
          refreshList={this.props.refreshList}
          selectedUserIds={this.props.selectedUserIds}
          removeFromSelected={this.props.removeFromSelected}
          selectedUserName={this.props.selectedUserName}/> &nbsp;
          {/*| &nbsp;
        <ResetUser
          refreshList={this.props.refreshList}
          selectedUserIds={this.props.selectedUserIds}
          removeFromSelected={this.props.removeFromSelected}
          selectedUserName={this.props.selectedUserName}/> &nbsp;*/}
        {/*<span style={{marginLeft:5}}><a href='javascript:void(0)' onClick={()=>this.props.cherryPickedDiscover(this.props.selectedResources)}>Discover</a></span>*/}
      </div>
  }
})

// import React, { PropTypes } from 'react'
// import {AlertTable} from 'containers'
// import {blueBtn} from 'sharedStyles/styles.css'
// import {Col, Button} from 'react-bootstrap'
// import {UserTable, AddUser} from 'containers'
// import {verifyPDconnection, addUser, getAllUsers} from 'helpers/integration'
// import {DeleteCloud, AddCloud} from 'containers'
//
// const CloudActions = React.createClass({
//
//   render: function () {
//       let count = this.props.slectedUsers.length
//       let edit
//       if(count === 1){
//         edit = (
//           <span>
//           <AddCloud
//             edit={true}
//             updateCloud={this.props.updateCloud}
//             selectedUserIds={this.props.slectedUsers}
//             refreshCloudsList={this.props.refreshUsersList}
//             removeFromSelected={removeFromSelected}
//             selectedUserName={this.props.selectedUserName}/> | &nbsp;</span>
//         )
//       } else {
//         edit = ""
//       }
//       console.log("this.props.slectedUsers "+this.props.selectedUserName, this.props.slectedUsers)
//       return (count > 0 )
//       ? <p style={{marginLeft:"-35", paddingTop: 10, paddingBottom: 15}}>
//             {this.props.totalUserCount} Cloud Accounts {count} selected: {' '}
//             {edit}
//             <DeleteCloud
//               selectedUserIds={this.props.slectedUsers}
//               refreshCloudsList={this.props.refreshUsersList}
//               removeFromSelected={removeFromSelected}
//               selectedUserName={this.props.selectedUserName}/>
//         </p>
//       :
//       <p style={{marginLeft:"-35", paddingTop: 10, paddingBottom: 15}}>
//          {this.props.totalUserCount} Cloud Accounts
//       </p>
//   }
// })
//
// export default CloudActions
