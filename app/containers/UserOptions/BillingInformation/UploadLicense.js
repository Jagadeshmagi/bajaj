import { EventEmitter } from 'events'
import React, {PropTypes} from 'react'
import {Col,InputGroup,FormGroup,FormControl,Checkbox,
        Glyphicon,ControlLabel,Button} from 'react-bootstrap'
import {TextCell,LinkCell,CheckboxCell} from 'components/Table/Table'
import {spacer, blueBtn} from 'sharedStyles/styles.css'
import {progress, mytable,centeredContainer,btnPrimary,deleteDialogClass} from 'sharedStyles/styles.css'
import {SpinnyLogo} from 'containers'
import {modalContainer, CreateGroupDialogClass, modalCloseStyle, ubtnPrimary, toolTipStyle} from '.././styles.css'
import {ButtonToolbar, Modal, HelpBlock } from 'react-bootstrap'
import {uploadLicenseFile} from 'helpers/license'
import moment from 'moment'

//import FileUploadProgress  from 'react-fileupload-progress';

const UploadLicense = React.createClass({
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
    if (this.props.login && this.props.expired){
      this.setState({
        showUploadText:true,
        doneButtonDisability:false,
        fileUploadStatusText:'License has expired'
      })
    }
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

      let pemFileName=document.getElementById('uploadBtn').files[0].name
      var data = new FormData();
      data.append('file', document.getElementById('uploadBtn').files[0]);

      uploadLicenseFile(data)
      .then((response)=>{
        this.props.refresh()
        let daysRemaining = moment(response.expiration,'DD-MMM-YYYY').diff(moment(),'days')
        if (daysRemaining >= 0){
          console.log('response??? '+response)
          this.setState({
            showUploadText:false
          })
          console.log('inside save '+response.id)
          console.log('saveeee '+JSON.stringify(response))
          // this.props.refresh()
          this.closeModal();
        } else {
          if (this.props.login){
            this.setState({
              showUploadText:true,
              doneButtonDisability:false,
              fileUploadStatusText:'Upload Error: License has expired'
            })
          } else {
            this.setState({
              show:true,
              showUploadText:true,
              doneButtonDisability:false,
              fileUploadStatusText:'Upload Error: License has expired'
            })
          }
        }
      })
      .catch((error)=>{
        // console.log("error in uploading file "+JSON.stringify(error.data))
        let errorMessage;
        if (error.data.message){
          errorMessage = error.data.message
        } else if (error.data === "License parsing error"){
          errorMessage = "License has expired"
        }
        console.log("error in uploading file "+JSON.stringify(errorMessage))
        this.setState({show:true,
          showUploadText:true,
          doneButtonDisability:false,
          fileUploadStatusText:'Upload Error: '+errorMessage
        })
      })
  },


  render() {
    // console.log("fileUploadStatusText", this.state.fileUploadStatusText.slice(0,19))
    let   noteMessage
    let fileUploadPlaceHolder = this.state.uploadFileName;
    let fileUploadStatusText =''
    if(this.state.uploadFileName == ""){
          fileUploadPlaceHolder = 'Please select a file'
        }
    fileUploadStatusText='File upload in progress ...'
   /*
    if(this.state.type=='Content')
      {
        noteMessage = 'Note, any progress scans will be terminated'
        fileUploadStatusText='File upload in progress ...'
        if(this.state.uploadFileName == ""){
          fileUploadPlaceHolder = 'Content package file here'
        }
      }*/
      if(this.props.login){
        return (
          <span className={modalContainer} style={{position:'relative'}}>


            <form style={{border: '1px solid Navy', width:"130%"}}>
            <div style={{marginTop:'25px',paddingLeft:'15px'}}>

              <Modal.Body style={{marginLeft:'15px'}}>
                <div>
                  <div style={{marginBottom:"20", paddingRight:"20"}}>Please provide a valid license key file. If you do not have one, <a style={{textDecoration:'none',top:'0px',marginTop: '7px'}} target="_blank" href="https://cavirin.zendesk.com/hc/en-us">please contact Cavirin Support.</a></div>
                  <FormGroup controlId="formUpdate">
                    <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Please select a valid license key file.</ControlLabel>
                      <FormGroup style={{width:'326px',marginBottom:'31px'}}>
                        <div>
                            <div id="uploadFileDiv" style={{display:'inline-block', border:'1px solid #4C58A4', backgroundColor:'#FFF', paddingTop:'8px', paddingLeft:'12px', paddingBottom:'3px', paddingRight:'12px', width:258,height:40}}>
                              <i>{fileUploadPlaceHolder}&nbsp;</i>
                            </div>
                            <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0, marginTop:'-2px'}}>
                              <input id="uploadBtn" name="file" type="file" accept=".gz, .tar" onChange={this.handleFileUpload} style={{borderRadius:0, width: 70, height: 50, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>                              <span style={{'WebkitUserSelect': 'none', borderRadius:0}}>Browse</span>
                               <span style={{position:'absolute',top:'121px',left:'283px',WebkitUserSelect: 'none', pointerEvents:'none', borderRadius:0}}>Browse</span>
                            </div>
                          </div>
                       {/* <div style={{marginTop:'10px', fontSize:13, paddingLeft:8}}><i>{noteMessage}</i></div> */}
                        {this.state.showUploadText?<div
                          style={this.state.fileUploadStatusText.slice(0,12)==="Upload Error" || this.state.fileUploadStatusText.slice(0,19)==="License has expired"?{marginTop:'10px', fontSize:15, paddingLeft:0, color:"red"}:{marginTop:'10px', fontSize:13, paddingLeft:0}}
                          >
                          {this.state.fileUploadStatusText}</div> :''}
                        </FormGroup>
                      </FormGroup>
                </div>
                </Modal.Body>
                <Modal.Footer style={{marginRight:30,marginBottom:15,marginTop:-30,borderTop:0}}>
                    <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                      onClick={this.save} disabled={this.state.doneButtonDisability}>
                      Done
                    </Button>
                </Modal.Footer>
              </div>
              </form>


          </span>
       );
      } else {
        return (
          <span className={modalContainer} style={{position:'relative'}}>
              <Button  bsStyle='primary' bsSize='large' className={ubtnPrimary} style={{borderRadius: 0,width: '200px',height: '40px'}} onClick={() => this.setState({ show: true})}>
                Upload License Key
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
                    {'License Upload'}
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{marginLeft:'15px'}}>
                <div>
                  <FormGroup controlId="formUpdate">
                    <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Please select a valid license key file.</ControlLabel>
                      <FormGroup style={{width:'326px',marginBottom:'31px'}}>
                        <div>
                            <div id="uploadFileDiv" style={{display:'inline-block', border:'1px solid #4C58A4', backgroundColor:'#FFF', paddingTop:'8px', paddingLeft:'12px', paddingBottom:'3px', paddingRight:'12px', width:258,height:40}}>
                              <i>{fileUploadPlaceHolder}&nbsp;</i>
                            </div>
                            <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0, marginTop:'-2px'}}>
                              <input id="uploadBtn" name="file" type="file" accept=".gz, .tar" onChange={this.handleFileUpload} style={{borderRadius:0, width: 70, height: 50, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>
                              <span style={{position:'absolute',top:'121px',left:'283px',WebkitUserSelect: 'none', pointerEvents:'none', borderRadius:0}}>Browse</span>
                            </div>
                          </div>
                       {/* <div style={{marginTop:'10px', fontSize:13, paddingLeft:8}}><i>{noteMessage}</i></div> */}
                        {this.state.showUploadText?<div
                          style={this.state.fileUploadStatusText.slice(0,12)==="Upload Error"?{marginTop:'10px', fontSize:15, paddingLeft:0, color:"red"}:{marginTop:'10px', fontSize:13, paddingLeft:0}}
                        >{this.state.fileUploadStatusText}</div> :''}
                        </FormGroup>
                      </FormGroup>
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
  }
})

export default UploadLicense
