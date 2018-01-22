import React, {PropTypes} from 'react'
import {Cell} from 'fixed-data-table'
import {Button,Popover, Modal } from 'react-bootstrap'
import {CreateGroup} from 'containers'
import {CreateUser} from 'containers'
import RemoveResource from '../GroupsResources/RemoveResource'
import { modalContainer, modalCloseStyle } from 'containers/Infrastructure/styles.css'
import { blueBtn, btnPrimary, deleteDialogClass } from 'sharedStyles/styles.css'
import {getDiscoverList, removeResourceFromGroup} from 'helpers/resources'


function findElement(arr, propName, propValue) {
  let group = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      group = arr[i];
  return group
}

const ReDiscover = React.createClass({
  getInitialState(){
    return{
      show: false,
      isDiscovering: false
    }
  },

  showDiscoverModal(){
    this.setState({show:true})
  },

  refreshList(){
    this.props.refreshList();
  },

  discoverResources(){

    this.setState({isDiscovering:false});
    let discoverResourcesIds= this.props.selectedResources;
    let discoverResourcesStringIds = discoverResourcesIds.map(String)
    getDiscoverList(discoverResourcesStringIds)
    .then(() => {
      this.setState({isDiscovering:true});
 
    })
    .catch((error) => {console.log("Error in discoverResources: "+ JSON.stringify(error))})
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

    let refreshConfirmMsg = "Are you sure you want to discover the selected resources?";
    let discoveringMsg = "Discovering the selected resources";
    if(this.props.selectedResources.length === 1){
      let resource = findElement(this.props.list,"id",this.props.selectedResources[0]);
      if(resource != null){
        refreshConfirmMsg = "Are you sure you want to discover resource '"+resource.ipaddress+"'";
        discoveringMsg = "Discovering the resource '"+resource.ipaddress+"'";
      }
    }
    return (
      <span className={modalContainer} >

        <a href='JavaScript: void(0)' onClick={this.showDiscoverModal}>
          Discover
        </a>
        {this.state.isDiscovering?
        <Modal
          show={this.state.show}
          onHide={close}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          keyboard={false}
          backdrop='static'
          >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
          <Modal.Header style={{marginRight:5,borderBottom:0}}>
          <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} onClick={close}>x</a>
            <Modal.Title id="contained-modal-title"
              style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DISCOVER RESOURCE'}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{discoveringMsg}</p>
          </Modal.Body>
          <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
            <Button className={blueBtn} onClick={this.refreshList}>Close</Button>
          </Modal.Footer>
         </div>
         </form>                    
        </Modal>
          :
        <Modal
          show={this.state.show}
          onHide={close}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          backdrop='static'
          keyboard={false}
         >
         <form style={{border: '1px solid Navy'}}>
         <div style={{marginTop:'5px',paddingLeft:'15px'}}>
         <Modal.Header style={{marginRight:5,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} onClick={close}>x</a>
            <Modal.Title id="contained-modal-title"
                style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'DISCOVER RESOURCE'}</Modal.Title>
         </Modal.Header>
         <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
            <p>{refreshConfirmMsg}</p>
         </Modal.Body>
         <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
          <Button className={blueBtn} onClick={close}>No</Button>
          <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} onClick={this.discoverResources}>Yes</Button>
         </Modal.Footer>
         </div>
         </form>
        </Modal>
        }
      </span>
    );
  }
})



    /*return(
      <div className="modal-container" style={{display: 'inline-block'}}>
        <span  >
          <a href='javascript:void(0)' onClick={()=>this.myFunction()}>Discover</a>
        </span>

        <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <a style={{textDecoration:'none', fontSize: '27px', color: '#4C58A4',top:0, right:12, fontWeight:500, position:'absolute', cursor:'pointer',transform: 'scale(1.3,0.9)'}} href="javascript:void(0)" onClick={close}>X</a>
          <Modal.Header style={{borderStyle:'none'}}></Modal.Header>
          <Modal.Body>
            <h4 style={{marginTop:-20}}>Rediscover has started for your selected resources</h4>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}*/

export const ColumnChooserPopover = React.createClass({
  handleChange(e){
    this.props.changeHandler(e.target.id)
  },
  render() {
    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: '#FFF',
        width : 200,
        borderRadius: 0,
        zIndex: 100,
        fontSize: 14,
    }
    return (

      <Popover style={style} placement="bottom" id="columnsPopover">
        <div className="pull-right"><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.props.closeHandler}>x</a><br/></div>
        <div>&nbsp;</div>
        { this.props.columnsList.map((item) =>
          { return  (
              <div style={{marginTop:'5px'}} key={item.name}>
                <input type='checkbox' id={item.name} defaultChecked={item.show} onChange={this.handleChange}/>
                <label htmlFor={item.name}> {item.displayText}</label>
              </div>
          )}
        )}
      </Popover>

    );
  },
});

export const ActionLinks = React.createClass({
  getInitialState(){
    return {
      completeStatus:true
    }
  },
  render:function()
  {
    const {selectedResources, numAccessible, numInaccessible, numSelected,list, ...props} = this.props;
    const style={marginBottom: 15}
    let separator = ''
    let totalCount = numAccessible+numInaccessible
   /* if(list.length === 0){
      return <div style={style}>0 Resources</div>
    }*/
    if(totalCount === 0){
      return <div style={style}>0 Resources</div>
    }
    if (numSelected > 1) {
       separator = ' | '
    }
    return numSelected == 0
    ?
      <div style={style}>
        <a href='javascript: void(0)' onClick={() => this.props.getDevicesByAccess('ALL')}>{totalCount} Resources</a>:&nbsp;
        {' '}<a href='javascript: void(0)' onClick={() => this.props.getDevicesByAccess('True')}>{numAccessible} Accessible</a>
        {' '}| <a href='javascript: void(0)' onClick={() => this.props.getDevicesByAccess('False')}>{numInaccessible} Inaccessible</a>
      </div>
    :
      <div style={style}>
        {totalCount} Resources &nbsp;
        {numSelected} Selected:&nbsp;{' '}
        <CreateGroup selectedResources={selectedResources}/> | &nbsp;
        {this.state.completeStatus ?(
        <ReDiscover
          list={this.props.list}
          refreshList={this.props.refreshList}
          selectedResources={selectedResources}
          selectedResourcesHandle={this.props.cherryPickedDiscover}/>):''}
        {/*<span style={{marginLeft:5}}><a href='javascript:void(0)' onClick={()=>this.props.cherryPickedDiscover(this.props.selectedResources)}>Discover</a></span>*/}
      </div>
  }
})

export const ActionLinksGroupResources = React.createClass({
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
      return <div style={style}>0 Resources</div>
    }
    if (numSelected > 1) {
       separator = ' | '
    }
    return numSelected == 0
    ?
      <div style={style}>
        <a href='javascript: void(0)' onClick={() => this.props.getDevicesByAccess('ALL')}>{totalCount} Resources</a>:&nbsp;
        {' '}<a href='javascript: void(0)' onClick={() => this.props.getDevicesByAccess('True')}>{numAccessible} Accessible</a>
        {' '}| <a href='javascript: void(0)' onClick={() => this.props.getDevicesByAccess('False')}>{numInaccessible} Inaccessible</a>
      </div>
    :
      <div style={style}>
        {totalCount} Resources &nbsp;
        {numSelected} Selected:&nbsp;{' '}
        <RemoveResource
          refreshList={this.props.refreshList}
          selectedResourceName = {this.props.firstResource}
          groupName={this.props.groupName}
          removeResourceFromGroup={removeResourceFromGroup}
          selectedResourceIds={selectedResources}
          refreshList={this.props.refreshList}
        />
        {/*<span style={{marginLeft:5}}><a href='javascript:void(0)' onClick={()=>this.props.cherryPickedDiscover(this.props.selectedResources)}>Discover</a></span>*/}
      </div>
  }
})

// export const ActionLinksUsers = React.createClass({
//   getInitialState(){
//     return {
//       completeStatus:true
//     }
//   },
//   render:function()
//   {
//     const {selectedResources, numSelected, numUsers, ...props} = this.props;
//     const style={marginBottom: 15}
//     let separator = ''
//     let totalCount = numUsers
//     console.log("totalCount", totalCount)
//     if(totalCount === 0){
//       return <div style={style}>0 Users</div>
//     }
//     if (numSelected > 1) {
//        separator = ' | '
//     }
//     return numSelected == 0
//     ?
//       <div style={style}>
//         <span>{totalCount} Users</span>&nbsp;
//          | &nbsp;<CreateUser selectedResources={selectedResources}/> &nbsp;
//       </div>
//     :
//       <div style={style}>
//         {totalCount} Users &nbsp;
//         {numSelected} Selected:&nbsp;{' '}
//         <CreateUser refresh={this.props.refresh}/> &nbsp; | &nbsp;
//         <a href='javascript:void(0)'>Edit</a> &nbsp; | &nbsp;
//         <a href='javascript:void(0)'>Suspend</a> &nbsp; | &nbsp;
//         <a href='javascript:void(0)'>Delete</a> &nbsp;
//
//         {/*<span style={{marginLeft:5}}><a href='javascript:void(0)' onClick={()=>this.props.cherryPickedDiscover(this.props.selectedResources)}>Discover</a></span>*/}
//       </div>
//   }
// })

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
        <a href='javascript: void(0)' onClick={() => this.props.getDevicesByAccess('ALL')}>
          <a href='javascript:void(0)'>Create</a> &nbsp;
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
