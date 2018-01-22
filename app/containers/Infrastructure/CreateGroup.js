import React, {PropTypes} from 'react'
import { modalContainer,CreateGroupDialogClass,modalCloseStyle } from './styles.css'
import {blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import styles from 'sharedStyles/styles.css'
import {Col,Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'
import {putResourceAssetGroup,addResourcesToGroups} from 'helpers/assetGroups'
import getAssetGroupsList from 'helpers/assetGroups'
import Joi from 'joi-browser'
import closeButtonImg from 'assets/close_Button.png'

const CreateGroup = React.createClass({
  getInitialState() {
    return {
      show: false,
      groupOption:'new',
      groupsList: [],
      selectedGroups:[],
      groupName: '',
      groupDesc: '',
      groupNameValid: false,
      groupDescValid: false,
      groupName_validation: '',
      groupDesc_validation: '',
      groupName_error: '',
      groupDesc_error: '',
      groupName_border:'1px solid #4C58A4',
      groupDesc_border:'1px solid #4C58A4'
    };
  },

  componentDidMount(){
    getAssetGroupsList()
    .then(
      (groups) =>  {
        this.setState({groupsList:groups});
      }
     )
    .catch((error) => console.log("Error in getAssetGroupsList in container:" + error))

  },

  handleGroupOption(changeEvent){
    this.setState({
      groupOption: changeEvent.target.value,
      groupName : '',
      groupNameValid : false,
      groupName_validation: '',
      groupName_error: '',
      groupName_border:'1px solid #4C58A4',
      selectedGroups: []
    })
  },

  handleSelectedGroup(e){
    let selectedGroupIds = this.state.selectedGroups.slice()

    //+++++++ Ex GroupId (e.target.id)==> group4 +++++
    //+++++++ Added this to avoid duplicate id's issue from resource and createGroup modal
    let indx=e.target.id.indexOf("p");
    let grpId=e.target.id.substring(indx+1);

    let groupId = parseInt(grpId)
    let index = selectedGroupIds.indexOf(groupId)
    if (index === -1)
    {
      selectedGroupIds = selectedGroupIds.concat(groupId)
    } else {
      selectedGroupIds.splice(index,1);
    }
    this.setState({selectedGroups: selectedGroupIds});
  },

  hasSpace(s) {
    return /\s/g.test(s);
  },

  checkSpaces(e){
    if (this.hasSpace(e.target.value)){
      this.setState({
        groupNameValid:false,
        groupName_error : "No Spaces Allowed",
        groupName_validation: 'error',
        groupName_border:'1px solid #a94442'
      })
      // let groupNameValidation = this.getValidationStateObj("groupName",false,"error","No Spaces Allowed")
      // groupNameValidation.height = 40
      // this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.show())
    } else {
      this.setState({
        groupNameValid:true,
        groupName_error: '',
        groupName_validation : 'success',
        groupName_border:'1px solid #3c763d'
      })
    }
  },

  handleGroupNameChange(e){
    let groupName_schema = {groupName: Joi.string().min(3).max(32).required()}
    let result = Joi.validate({groupName: e.target.value}, groupName_schema)
    this.setState({groupName: e.target.value});
    if (result.error) {
      this.setState({
        groupNameValid:false,
        groupName_error : result.error.details[0].message,
        groupName_validation: 'error',
        groupName_border:'1px solid #a94442'
      })
    } else {
      // this.checkSpaces(e);
      this.setState({
        groupNameValid:true,
        groupName_error: '',
        groupName_validation : 'success',
        groupName_border:'1px solid #3c763d'
      })
    }
  },
  handleGroupDescChange(e){
    let groupDesc_schema = {groupDesc: Joi.string().min(3).max(250).required()}
    let result = Joi.validate({groupDesc: e.target.value}, groupDesc_schema)
    this.setState({groupDesc: e.target.value})
    if (result.error) {
      this.setState({
        groupDescValid:false,
        groupDesc_error : result.error.details[0].message,
        groupDesc_validation: 'error',
        groupDesc_border:'1.5px solid #a94442'
      })
    } else {
      this.setState({
        groupDescValid:true,
        groupDesc_error: '',
        groupDesc_validation : 'success',
        groupDesc_border:'1.5px solid #3c763d'
      })
    }
  },
  save() {
    let resourceIds = [];
    this.props.selectedResources.map((r) => {
      resourceIds.push(r);
    })
    if(this.state.groupOption === "new"){
      putResourceAssetGroup(this.state.groupName,formGroupDesc.value,resourceIds)
      .then(() => {
        console.log("Group saved successfully")
        //Alert.show("Group is created successfully with selected resources")
        this.setState({ show: false})
      })
      .catch((error) =>{ console.log("Error in creating group:" + JSON.stringify(error))
        if(error.data.status==409 && error.data.message=="AssetGroup already exists")
        {
          this.setState({
          groupNameValid:false,
          groupName_error : "AssetGroup already exists",
          groupName_validation: 'error',
          groupName_border:'1px solid #a94442'
          })
        }
      })
    }else{
      //call save api with groups and resources ids
      addResourcesToGroups(this.state.selectedGroups,resourceIds)
      .then(() => {
        console.log("Group saved successfully")
        //Alert.show("Selected resources are successfully added to the group")
        this.setState({ show: false})
      })
      .catch((error) =>{
        console.log("Error in creating group:" + JSON.stringify(error))
      })
    }


  },
  render() {
    let close = () => this.setState({ show: false});
    let disableDoneBtn = (this.state.groupNameValid || this.state.selectedGroups.length>0) ? false : true
    return (
      <span className={modalContainer} >
        <a href='javascript:void(0)' onClick={() => this.setState({ show: true})}>
          Add to Group
        </a>

        <Modal
          show={this.state.show}
          onHide={close}
          aria-labelledby="contained-modal-title"
          dialogClassName={CreateGroupDialogClass}
          backdrop='static'
          keyboard={false}
        >

        <form style={{border: '1px solid Navy'}}>
        <div style={{marginTop:'25px',paddingLeft:'15px'}}>
            <Modal.Header  style={{marginLeft:15,marginRight:25, padding: '0 0 0 15px',borderBottom:0}}>
              <a style={{position:'absolute', top:17, right:41,textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} onClick={close}>
                <img style={{width:13,height:18}} src={closeButtonImg} alt='close_btn'/>
              </a>
              <Modal.Title id="contained-modal-title"
                    style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'CREATE GROUP'}</Modal.Title>

            </Modal.Header>

            <Modal.Body>
              <label style={{marginLeft:30,fontWeight:'500'}}>
                <input type="radio" id="groupOption" value="new" checked={this.state.groupOption === 'new'?true:false} onChange={this.handleGroupOption.bind(this)}/>
                &nbsp;&nbsp; Add to new group
              </label><br/>
              <label style={{marginLeft:30,fontWeight:'500'}}>
                <input type="radio" id="groupOption" value="existing" checked={this.state.groupOption === 'existing'?true:false} onChange={this.handleGroupOption.bind(this)}/>
                  &nbsp;&nbsp; Add to existing group
              </label><br/><br/>
              {(this.state.groupOption === "new")?
              <div>
              <FormGroup controlId="formGroupName" validationState={this.state.groupName_validation}>
                <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Name</ControlLabel></Col>
                <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.groupName_border}}
                  type="text" name="groupname" placeholder="Enter Group Name"
                  onChange={this.handleGroupNameChange}/>
                <Col xs={12}><HelpBlock>{this.state.groupName_error}</HelpBlock></Col>
              </FormGroup>

              <FormGroup controlId="formGroupDesc" validationState={this.state.groupDesc_validation}>

                <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500',marginTop:'20px'}}>Description</ControlLabel></Col>
                <FormControl componentClass="textarea" style={{width:400,height:150,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.groupDesc_border}}
                 placeholder="Enter Group Description"/>
                <Col xs={12}><HelpBlock>{this.state.groupDesc_error}</HelpBlock></Col>
              </FormGroup>
              </div>
            :
              <div>
              <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginLeft:'15px '}}>Select group(s) to add selected resources</ControlLabel>
              <div style={{margin:'10px 0 0 15px',paddingTop:'5px',paddingLeft:'10px',width:326,height:200,backgroundColor: '#FFFFFF',border: '1px solid #4C58A4', 'overflowY': 'auto', position:'relative'}}>
              {
                this.state.groupsList.map(function(group)
                {
                  let finalLabel=group.name

                  if(group.name.length>15){
                    finalLabel=group.name.substring(0,25).concat('...')
                  }
                  let groupId= "group"+group.id
                  let chkVal = (this.state.selectedGroups.indexOf(group.id)>-1)?true:false
                  return (
                  <div>
                    {chkVal}
                    <input type='Checkbox' style={{position:'absolute'}} id={groupId} key={groupId} value={group.name} name={group.name} onChange={this.handleSelectedGroup} checked={chkVal}/>
                    <label style={{fontWeight:'500',textOverflow: 'ellipsis','whiteSpace': 'nowrap',overflow:'hidden',height:'25px','lineHeight':'25px'}} htmlFor={groupId} title={group.name}>&nbsp;&nbsp;{finalLabel}</label>
                  </div>
                  );

                }.bind(this))
              }

              </div>
              </div>
            }

            </Modal.Body>

            <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
                <Button className={blueBtn} onClick={close}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                  onClick={this.save} disabled={disableDoneBtn}>
                  Done
                </Button>
            </Modal.Footer>
          </div>
          </form>

        </Modal>

      </span>
    );
  }
})

export default CreateGroup
