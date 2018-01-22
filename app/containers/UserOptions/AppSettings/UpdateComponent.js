import { EventEmitter } from 'events'
import React, {PropTypes} from 'react'
import {Col,InputGroup,FormGroup,FormControl,Checkbox,
        Glyphicon,ControlLabel,Button} from 'react-bootstrap'
import {TextCell,LinkCell,CheckboxCell} from 'components/Table/Table'
import {spacer, blueBtn} from 'sharedStyles/styles.css'
import {progress, mytable,centeredContainer,btnPrimary,deleteDialogClass} from 'sharedStyles/styles.css'
import getIpConfig from 'helpers/applicationSettings'
import {saveIPConfig} from 'helpers/applicationSettings'
import {IPSettingsConfirmation} from './IPSettingsConfirmation'
import {SpinnyLogo} from 'containers'
import {modalContainer, CreateGroupDialogClass, modalCloseStyle, ubtnPrimary, toolTipStyle} from '.././styles.css'
import {ButtonToolbar, Modal, HelpBlock } from 'react-bootstrap'
import {uploadContentFile, uploadSoftware} from 'helpers/Upgrade'
//import FileUploadProgress  from 'react-fileupload-progress';



//... Styles for fileUpload ...
const styles = {
  progressWrapper: {
    height: '10px',
    marginTop: '10px',
    width: '400px',
    float: 'left',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    WebkitBoxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)',
  },
  progressBar: {
    float: 'left',
    width: '0',
    height: '100%',
    fontSize: '12px',
    lineHeight: '20px',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#337ab7',
    WebkitBoxShadow: 'inset 0 -1px 0 rgba(0,0,0,.15)',
    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.15)',
    WebkitTransition: 'width .6s ease',
    Otransition: 'width .6s ease',
    transition: 'width .6s ease',
  },
  cancelButton: {
    marginTop: '5px',
    WebkitAppearance: 'none',
    padding: 0,
    cursor: 'pointer',
    background: '0 0',
    border: 0,
    float: 'left',
    fontSize: '21px',
    fontWeight: 700,
    lineHeight: 1,
    color: '#000',
    textShadow: '0 1px 0 #fff',
    filter: 'alpha(opacity=20)',
    opacity: '.2',
  },
};


const UpdateComponent = React.createClass({
  getInitialState(){
    return{
      type:this.props.upgradeType,
      contentStatus:this.props.contentStatus,
      uploadFileName:"",
      doneButtonDisability:true,
      showUploadText:false,
      fileUploadStatusText:'File upload in progress ...',
      progress:-1,
      hasError:false
    }
  },

  cancelUpload() {
    this.proxy.emit('abort');
    this.setState({
      progress: -1,
      hasError: false
    });
  },

  onSubmit(e) {
    e.preventDefault();
    this.setState({
      progress: 0,
      hasError: false,
    }, this._doUpload);
  },

  componentDidMount(){
    //this.proxy = new EventEmitter();
  },

  closeModal(){
    this.setState({
    show: false,
       type:this.props.upgradeType,
      uploadFileName:"",
      doneButtonDisability:true,
      showUploadText:false})
  },

  handleFileUpload(evt){
    this.setState({doneButtonDisability:false})
    this.setState({fileUploadStatusText:'File upload in progress ....'})
    let fileName=evt.target.files[0].name;
    let finalFileName=evt.target.files[0].name;
    var ext = fileName.substring(fileName.indexOf(".") + 1, fileName.length);
    if (ext != 'pem' && ext != 'PEM')
    {
      var uploadedFileName=fileName.substring(0, fileName.indexOf("."));
      if(uploadedFileName.length>25){
        let concatString='...'+ext
        let subFileName=uploadedFileName.substring(0,25);
        finalFileName= subFileName.concat(concatString)
      }
      this.setState({/*pemKeyBorderColor:'1px solid #FF444D',
                    tooltipPemHeight:'80px',
                    pemOverlayTrigger:['hover','focus'],
                    credentialsPemKey_Message:'File type is invalid,upload only .pem file',*/
                      uploadFileName:finalFileName,
                      showUploadText:false
                      /*pemFileExists:false,*/
                    },function(){
                      console.log('inside '+this.state.fileUploadStatusText)
                    })
      //this.refs.infoPem.show();
    }
    else
    {
      //this.refs.infoPem.hide();
      /*this.setState({pemKeyBorderColor:'1px solid #4C58A4',
                    tooltipPemHeight:'40px',
                    pemOverlayTrigger:''})*/
      var localFileName=fileName.substring(0, fileName.indexOf("."));
      if(localFileName.length>25){
        let concatString='...tar.gz'
        let subFileName=localFileName.substring(0,25);
        finalFileName= subFileName.concat(concatString)
      }
      var file = evt.target.files[0];
      if (file) 
      {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt)
        {
          let pemStroing=evt.target.result;
          this.setState({fileUploadStatusText:'File upload in progress ....',
            /*pemKeyBorderColor:'1px solid #4C58A4',
            credentialsPemKey_Message:'Upload PEM Key file'*/},function() 
          {
            this.setState({uploadFileName:finalFileName});
            /*if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.pemFileExists && this.state.isLabelSet)
            {
              this.setState({addButtonDisability:false})
            }*/ 
          }.bind(this))
        }.bind(this)
        reader.onerror = function (evt) {
          console.log("error reading file "+evt);
        }    
      }else{
        console.log("no file")
      } 
    }
  },

  save(){
      this.setState({doneButtonDisability:true,
                    showUploadText:true})
      this.proxy = new EventEmitter();
      //console.log("proxyyy "+JSON.stringify(this.proxy))
      let pemFileName=document.getElementById('uploadBtn').files[0].name
      var data = new FormData();
      data.append('file', document.getElementById('uploadBtn').files[0]);
      
      if(this.state.type=='Content'){
      uploadContentFile(data)
      .then((response)=>{
        console.log('response '+response)
        this.setState({show:false,
          showUploadText:false})
        console.log('inside save '+response.id)
        console.log('saveeee '+JSON.stringify(response))
        this.props.setId(response.id)
      })
      .catch((error)=>{
        console.log("error in uploading file "+JSON.stringify(error.data.message))
        this.setState({show:true,
          showUploadText:true,
          doneButtonDisability:false,
          fileUploadStatusText:'Error while uploading: '+error.data.message
        })
      })
    }
    else if(this.state.type == 'Software'){
      uploadSoftware(data)
      .then((response)=>{
        console.log('response '+response)
        this.setState({show:false,
          showUploadText:false})
      })
      .catch((error)=>{
        console.log("error in uploading software file "+JSON.stringify(error.data.message))
        this.setState({show:true,
          showUploadText:true,
          doneButtonDisability:false,
          fileUploadStatusText:'Error while uploading: '+error.data.message
        })
      })
    }
      
  },


  render() {
    let headerConstant, textConstant, noteMessage
    let fileUploadPlaceHolder = this.state.uploadFileName;
    let disableDoneBtn =  false 
    let fileUploadStatusText =''
    
    if(this.state.type=='Content')
      {
        disableDoneBtn = true
        headerConstant='CONTENT UPDATE'
        textConstant='Select content package for update'
        noteMessage = 'Note, any progress scans will be terminated'
        fileUploadStatusText='File upload in progress ...'
        if(this.state.uploadFileName == ""){
          fileUploadPlaceHolder = 'Content package file here'
        }
      }
    else if(this.state.type=='Software'){
      disableDoneBtn=true
      headerConstant='SOFTWARE UPDATE'
      textConstant='Select software package for update'
      fileUploadStatusText='File upload in progress ...'
      noteMessage = 'Note, any in progress scans will be stopped and all logged in users will be logged off, losing unsaved changes'
      if(this.state.uploadFileName == ""){
          fileUploadPlaceHolder = 'Software package file here'
      }
    }

    else if(this.state.type=='PatchesAndVul'){
      disableDoneBtn=true
    }

    return (
      <span className={modalContainer} style={{position:'relative'}}>
          <Button disabled={disableDoneBtn} bsStyle='primary' bsSize='large' className={ubtnPrimary} style={{borderRadius: 0,width: '100px',height: '40px'}} onClick={() => this.setState({ show: true})}>
            Update
          </Button>
        <Modal
          show={this.state.show}
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
          dialogClassName={CreateGroupDialogClass}
          backdrop='static'
        >    
        <form style={{border: '1px solid Navy'}}>
        <div style={{marginTop:'25px',paddingLeft:'15px'}}>
          <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
            <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} style={{fontSize:27, top:12, right:26, transform: 'scale(1.3,0.9)'}} onClick={this.closeModal}>X</a>
              <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                {headerConstant}
              </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{marginLeft:'15px'}}>
            <div>         
              <FormGroup controlId="formUpdate">
                <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>{textConstant}</ControlLabel>
                  <FormGroup style={{width:'326px',marginBottom:'31px'}}>                    
                    <div>
                        <div id="uploadFileDiv" style={{display:'inline-block', border:'1px solid #4C58A4', backgroundColor:'#FFF', paddingTop:'8px', paddingLeft:'12px', paddingBottom:'3px', paddingRight:'12px', width:258,height:40}}>
                          <i>{fileUploadPlaceHolder}&nbsp;</i>
                        </div>
                        <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0, marginTop:'-2px'}}>
                          <input id="uploadBtn" name="file" type="file"  onChange={this.handleFileUpload} style={{borderRadius:0, width: 30, height: 10, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>
                          <span style={{'WebkitUserSelect': 'none', borderRadius:0}}>Browse</span>
                        </div>
                      </div>
                    <div style={{marginTop:'10px', fontSize:13, paddingLeft:8}}><i>{noteMessage}</i></div> 
                    {this.state.showUploadText?<div style={{marginTop:'10px', fontSize:13, paddingLeft:8}}>{this.state.fileUploadStatusText}</div> :''}                  
                    </FormGroup>
                  </FormGroup>
                  {/*<div>
                  <FileUploadProgress key='ex1' url='http://34.212.226.129:8080/arap-server/api/v0/content/upload'
          onProgress={(e, request, progress) => {console.log('progress', e, request, progress);}}
          onLoad={ (e, request) => {console.log('load', e, request);}}
          onError={ (e, request) => {console.log('error', e, request);}}
          onAbort={ (e, request) => {console.log('abort', e, request);}}
          /></div>*/}
            </div>        
            </Modal.Body>
            <Modal.Footer style={{marginRight:30,marginBottom:15,marginTop:-30,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeModal}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} 
                  onClick={this.save} disabled={this.state.doneButtonDisability}>
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

export default UpdateComponent

    