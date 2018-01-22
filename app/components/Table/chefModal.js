import React from 'react'
import ReactDOM from 'react-dom'
import {Cell} from 'fixed-data-table'
import {Checkbox,Glyphicon, ProgressBar, Row, Col, Grid, Popover,OverlayTrigger, Button, Modal, Overlay, FormGroup, ControlLabel, HelpBlock, FormControl} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange, progressbargeneral} from 'containers/Infrastructure/styles.css'
import AttributeConstants from 'constants/AttributeConstants'
import {blueBtn, btnPrimary,selectStyle, modalCloseBtnStyle,} from 'sharedStyles/styles.css'
import {modalContainer,remediationDialogClass,suppressDialogClass, modal, customHrRemediation, modalCloseStyle} from './styles.css'
import {saveRemediation, getRemediationByName, deleteRemediationByName} from "./../../helpers/chef"
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/ruby';
import 'brace/theme/monokai';
import moment from 'moment'
import Select from 'react-select'
import closeButtonImg from 'assets/close_Button.png'
import SuppressRule from './SuppressRule'

export const RemediationModal = React.createClass({
  getInitialState(){
    return {
      deleteButton:"none",
      showRemediationModal:this.props.show,
      showSuppressModal:false,
      suppressRule:false,
      aceValue:`# Example Recipe
execute 'recipe' do
 command 'command to run'
 action :run
end`,
      name:"",
      spaceless:"",
      typingTimeout:0,
      typing:false,
      status:"",
      dateLastSaved:"",
      remediationType:[{label:"Chef", value:"Chef"}, {label:"Ansible", value:"Ansible"}, {label:'Suppress Policy', value:'SuppressPolicy'}],
      remediationValues:{
        Default:{
          selected:"Default",
        },
        SuppressPolicy: {
          selected: 'SuppressPolicy'
        },
        unsuppressPolicy: {
          selected: 'unsuppressPolicy'
        },
        Chef:{
          selected:"Chef",
          fileType:".rb",
          title:"CREATE RECIPE",
          delete:"Delete this Recipe?",
          value:`# Example Recipe
    execute 'recipe' do
     command 'command to run'
     action :run
    end`
        },
        Ansible:{
          selected:"Ansible",
          fileType:".yml",
          title:"CREATE PLAYBOOK",
          delete:"Delete this Playbook?",
          value:`# Example playbook
    execute 'playbook' do
     command 'command to run'
     action :run
    end`
        }
      },
      selectedValue:{},
    }
  },
  openRemediationModal(e){
    let selected = this.state.remediationValues[e.target.value]
    if(e.target.value === 'SuppressPolicy'){
      this.setState({showRemediationModal: false,
        showSuppressModal: true,
        suppressRule: true,
        selectedValue:selected})
    }else if(e.target.value === 'unsuppressPolicy'){
      this.setState({showRemediationModal: false,
        showSuppressModal: true,
        suppressRule: false,
        selectedValue:selected},function(){
          console.log('I am called')
        })
    }
    else
    {
      
      this.setState({
        showRemediationModal: true,
        selectedValue: selected,
      }, ()=>{this.getRemediation();})
    }
  },

  componentDidMount(){
    
    if(this.props.reportType && this.props.reportType === 'docker')
      this.setState({remediationType:[{label:"Chef", value:"Chef"}, {label:"Ansible", value:"Ansible"}]})
    else{
      if(this.props.suppressed){
        this.setState({remediationType:[{label:"Chef", value:"Chef"}, {label:"Ansible", value:"Ansible"}, {label:'Unsuppress Policy', value:'unsuppressPolicy'}]})
      }else{
        this.setState({remediationType:[{label:"Chef", value:"Chef"}, {label:"Ansible", value:"Ansible"}, {label:'Suppress Policy', value:'SuppressPolicy'}]})
      }
      
    }
      
  },

  componentWillReceiveProps(nextProps,nextState){
    if (this.props.reportType != nextProps.reportType || this.props.suppressed !=nextProps.suppressed)
    {
      if(nextProps.reportType && nextProps.reportType === 'docker')
        this.setState({remediationType:[{label:"Chef", value:"Chef"}, {label:"Ansible", value:"Ansible"}]})
      else
      {
        if(nextProps.suppressed)
        {
        this.setState({remediationType:[{label:"Chef", value:"Chef"}, {label:"Ansible", value:"Ansible"}, {label:'Unsuppress Policy', value:'unsuppressPolicy'}]})
        }else
        {
        this.setState({remediationType:[{label:"Chef", value:"Chef"}, {label:"Ansible", value:"Ansible"}, {label:'Suppress Policy', value:'SuppressPolicy'}]})
        }
      }
    }
  },

  closeRemediationModal(){
    this.setState({
      selectedValue: this.state.remediationValues["Default"],
      showRemediationModal:false,
      aceValue:"",
      name:"",
      spaceless:"",
      deleteButton:"none",
      typingTimeout:0,
      typing:false,
      status:"",
      dateLastSaved:""
    }, ()=>{this.refs.targetDeleteOverlay.hide()})
  },

  closeSuppressModal(){
    this.setState({
      selectedValue: this.state.remediationValues["Default"],
      showSuppressModal: false
    })
  },

  deleteRemediation(){
    let name = this.state.selectedValue.selected + " : " + this.props.pp + " - " + this.props.pName;
    // let spaceless = name.replace(/\s/g, '').replace(/\//g,'').replace(/\./g,'');
    let spaceless = name.replace(/\s/g, '').replace(/\//g,'').replace(/\./g,'');

    // ('/[\s-]+/', '-', $s)
    // this.setState({
    //   name:name,
    //   spaceless:spaceless
    // })
    deleteRemediationByName(spaceless)
      .then((res)=>{
        if (res.response != "error"){
          this.setState({
            aceValue:res.response
          })
        }
        this.closeRemediationModal()
      })
      .catch((error)=>{
        console.log('getRemediation failed', error)
      })
  },
  getRemediation(){
    if (this.state.showRemediationModal){
      console.log("dkfjalskfjaklsf123123", this.state.selectedValue)
      let name = this.state.selectedValue.selected + " : " + this.props.pp + " - " + this.props.pName;
      let spaceless = name.replace(/\s/g, '').replace(/\//g,'')
      // .replace(/\./g,'');
      // let spaceless = name.replace(/\s|//g, '')
      // .replace(/\//g,'');

      this.setState({
        name:name,
        spaceless:spaceless
      })
      getRemediationByName(spaceless)
        .then((res)=>{
          if (res.response != "error"){
            let time = moment.utc(res.time).format('MM[/]DD[/]YY [@] HH[:]mm')
            this.setState({
              deleteButton:"inline-block",
              aceValue:res.response,
              dateLastSaved:time,
              status:"Last Saved: " + time
            })
          } else {
            this.setState({
              aceValue:this.state.selectedValue.value
            })
          }
        })
        .catch((error)=>{
          console.log('getRemediation failed', error)
        })
    }
  },
  onChange(newValue) {
    this.setState({
      aceValue:newValue
    })
    const self = this;

    if (this.state.typingTimeout) {
       clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      aceValue:newValue,
      typing: false,
      typingTimeout: setTimeout(function () {
           self.saveRemediation();
         }, 1000)
    });
  },
  saveRemediation(){
    saveRemediation(this.state.spaceless, this.state.aceValue)
      .then((res)=>{
        // this.closeRemediationModal();
        let time = moment.utc(Date.now()).format('MM[/]DD[/]YY [@] HH[:]mm')
        let that = this;
        this.setState({status:"Saving..."}, ()=>{
          setTimeout(function(){
            that.setState({
              deleteButton:"inline-block",
              dateLastSaved:time,
              status:"Last Saved: " + time
            });
          //  that.setState({status:"Last Saved: " + res.time});
           }, 3000)
        })

      })
      .catch((error)=>{
        console.log('saveRemediation failed', error)
      })
  },
  _downloadTxtFile(){
    var element = document.createElement("a");
    var file = new Blob([this.state.aceValue], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = this.state.spaceless+this.state.selectedValue.fileType;
    element.click();
  },
  selectRemediationTypeChange(e){

  },
  deletePopoverClose(){
    this.refs.targetDeleteOverlay.hide();
    // this.setState({
    //   showDelete:!this.state.showDelete
    // }, console.log("this.state.showDelete", this.state.showDelete))
  },
  render() {
    const popoverLeft = (
      <Popover id="popover-delete" title={this.state.selectedValue.delete}>
          <Button bsStyle='primary' className={btnPrimary} style={{marginLeft:'15', borderRadius: 0}} onClick={this.deleteRemediation}>Delete</Button>&nbsp;&nbsp;&nbsp;
          <Button className={blueBtn} onClick={this.deletePopoverClose}>Cancel</Button>&nbsp;&nbsp;&nbsp;
      </Popover>
    );
    let remediationLogo = `
      <svg width="50px" height="40px" cursor="pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 98.64">
        <title>RemediationLogoAsset 1</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1"><path d="M98.78,78.18h0l-.87-1.33v1.88h-.35V76.28h.37l.88,1.35.87-1.35H100v2.45h-.34V76.85Zm-2.6.55h-.35V76.61H95v-.33H97v.33h-.79Z" style="fill:#435363"/>
            <path d="M0,87.08V87A11.42,11.42,0,0,1,11.71,75.4a11.59,11.59,0,0,1,8.86,3.47L17.42,82.5A8.29,8.29,0,0,0,11.68,80c-3.79,0-6.51,3.14-6.51,7V87c0,3.85,2.66,7.06,6.51,7.06,2.57,0,4.14-1,5.9-2.63l3.14,3.18a11.48,11.48,0,0,1-9.21,4A11.34,11.34,0,0,1,0,87.08" style="fill:#435363"/>
            <polygon points="26.45 75.79 31.39 75.79 31.39 84.68 40.51 84.68 40.51 75.79 45.45 75.79 45.45 98.25 40.51 98.25 40.51 89.23 31.39 89.23 31.39 98.25 26.45 98.25 26.45 75.79" style="fill:#435363"/>
            <polygon points="51.48 75.79 68.43 75.79 68.43 80.19 56.39 80.19 56.39 84.74 66.98 84.74 66.98 89.14 56.39 89.14 56.39 93.86 68.59 93.86 68.59 98.25 51.48 98.25 51.48 75.79" style="fill:#435363"/>
            <polygon points="75.05 75.79 92.15 75.79 92.15 80.28 79.99 80.28 79.99 85.06 90.7 85.06 90.7 89.56 79.99 89.56 79.99 98.25 75.05 98.25 75.05 75.79" style="fill:#435363"/>
            <path d="M46.63,45.44a14.11,14.11,0,1,1,13.55-18h5.46a19.41,19.41,0,1,0,0,7.83H60.18A14.13,14.13,0,0,1,46.63,45.44" style="fill:#435363"/>
            <path d="M37.11,40.84a13.42,13.42,0,0,0,9.51,3.95V39.16a7.81,7.81,0,0,1-5.54-2.29Z" style="fill:#435363"/>
            <path d="M33.17,31.33a13.37,13.37,0,0,0,1.14,5.42l5.15-2.26a7.83,7.83,0,0,1,7.17-11V17.87A13.47,13.47,0,0,0,33.17,31.33" style="fill:#f38b00"/>
            <path d="M51.51,18.79l-2,5.25a7.86,7.86,0,0,1,3.94,3.38H59.5a13.52,13.52,0,0,0-8-8.63" style="fill:#435363"/>
            <path d="M49.47,38.63l2,5.25a13.52,13.52,0,0,0,8-8.63H53.41a7.86,7.86,0,0,1-3.94,3.38" style="fill:#f38b00"/>
            <path d="M46.63,57.35a25.93,25.93,0,0,1-18.39-7.63l-3.76,3.76A31.33,31.33,0,0,0,77.71,35.25H72.35a26.06,26.06,0,0,1-25.72,22.1" style="fill:#f38b00"/>
            <path d="M46.63,5.31a25.87,25.87,0,0,1,15.55,5.18l3.18-4.27A31.33,31.33,0,0,0,17.42,20l5,1.93A26.06,26.06,0,0,1,46.63,5.31" style="fill:#f38b00"/>
            <path d="M72.35,27.41h5.36a31.14,31.14,0,0,0-4.51-12.67l-4.52,2.82a25.85,25.85,0,0,1,3.66,9.85" style="fill:#435363"/>
            <path d="M66.31,27.41h5.38A25.44,25.44,0,0,0,55.82,7.7L53.9,12.64A20.13,20.13,0,0,1,66.31,27.41" style="fill:#f38b00"/>
            <path d="M46.63,11.27h0V6h0A25.4,25.4,0,0,0,23,22.13l4.94,1.92a20.1,20.1,0,0,1,18.7-12.79" style="fill:#435363"/>
            <path d="M26.56,31.33h-5.3A25.4,25.4,0,0,0,37.21,54.87l2-4.92A20.09,20.09,0,0,1,26.56,31.33" style="fill:#f38b00"/>
            <path d="M46.63,51.39v5.3A25.4,25.4,0,0,0,71.69,35.25H66.31A20.1,20.1,0,0,1,46.63,51.39" style="fill:#435363"/>
            <path d="M17.94,43.94A31.28,31.28,0,0,1,15.3,31.33h5.32a26.09,26.09,0,0,0,2.2,10.47Z" style="fill:#435363"/>
          </g>
        </g>
      </svg>`;
    console.log('props ', this.state.showSuppressModal)
    return(
      <div>
      <div>
        {/*<span onClick={this.openRemediationModal} dangerouslySetInnerHTML={{__html: remediationLogo}} ></span>*/}
        <select
          value={this.state.selectedValue.selectedValue ? this.state.selectedValue.selected : ''}
          className={selectStyle}
          id="remediationTypeid"
          placeholder= "Select Remediation"
          style={{width:190,height:40,border:this.state.bordercolc,borderRadius:0}}
          onChange={this.openRemediationModal}>
          <option key={"Default"} name={"Default"} selected disabled>Select Remediation</option>
          {this.state.remediationType.map((item) =>
            {
              return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
            }
          )}
        </select>
      </div>
      {this.state.showRemediationModal?
        <Modal
          dialogClassName={remediationDialogClass}
          style={{width:"1200px", backgroundColor:"green"}}
          show={this.state.showRemediationModal}
          backdrop='static'
          aria-labelledby="contained-modal-title"
          >
          <form style={{border: '1px solid Navy'}}>
          <Modal.Header style={{marginRight:5,borderBottom:0}}>
           <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeRemediationModal}>X</a>
              <br/>
            <Modal.Title id="contained-modal-title"
                  style={{fontWeight:'bold', fontSize:22, fontColor:'#faffff', marginTop:-14, marginLeft:20, marginBottom:20}}>{this.state.selectedValue.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{fontSize:15}}>
            <div style={{marginTop:-30, marginLeft:20, fontSize:15}}>
            <table style={{ marginTop: 5}}>
              <tbody>
                <tr>
                  <td style={{textAlign: 'left', fontWeight: 'bold',paddingRight:'20px',fontSize:15}}>Policy Pack Name: </td>
                  <td style={{textAlign: 'left',fontSize:15}}>{this.props.pp}</td>
                </tr>
                <tr>
                  <td style={{textAlign: 'left', fontWeight: 'bold',paddingRight:'20px',fontSize:15}}>Policy Name: </td>
                  <td style={{textAlign: 'left',fontSize:15}}>{this.props.pName}</td>
                </tr>
                {this.props.os?<tr>
                  <td style={{textAlign: 'left', fontWeight: 'bold',paddingRight:'20px',fontSize:15}}>OS: </td>
                  <td style={{textAlign: 'left',fontSize:15}}>{this.props.os}</td>
                </tr>:<span></span>}
              </tbody>
            </table>

            <hr className={customHrRemediation}></hr>
            <div style={{textAlign: 'left', fontWeight: 'bold',paddingRight:'20px',fontSize:15}}>Remediation Steps: </div>
            <div style={{marginLeft:"20"}}>{this.props.remediationSteps}</div>
              <hr className={customHrRemediation}></hr>
              <tr>
                <td style={{textAlign: 'left', fontWeight: 'bold',paddingRight:'50px',fontSize:15}}>Name: </td>
                <td style={{textAlign: 'left',fontSize:15}}>{this.state.name}</td>
              </tr>
              <Col lg={12} style={{fontSize:12, textAlign:"right", paddingRight:"115px"}}>{this.state.status}</Col>
              <tr>
              </tr>
              <div style={{marginTop:"20px", marginBottom:"20px"}}>
                <AceEditor
                  mode="ruby"
                  value={this.state.aceValue}
                  theme="monokai"
                  width={'90%'}
                  onChange={this.onChange}
                  name="UNIQUE_ID_OF_DIV"
                />
              </div>
              {/*<AceEditor
                mode="ruby"
                theme="monokai"
                name="blah2"
                onLoad={this.onLoad}
                onChange={this.onChange}
                fontSize={14}
                width={'90%'}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={`execute "chown-kubernetes" do
      }
      }
command "chown root:root /etc/kubernetes/controller-manager.conf"
action :run
end`}
                setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}/>
              <hr className={customHrRemediation}></hr>
              <div>{this.state.name}</div>*/}
            </div>
          </Modal.Body>
          <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
            <Button className={blueBtn} onClick={this.closeRemediationModal}>Close</Button>&nbsp;&nbsp;&nbsp;
            {/*<Button onClick={this.saveRemediation} bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}>
              Save
            </Button>*/}
            <Button onClick={this._downloadTxtFile} bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}>
              Download
            </Button>

            <OverlayTrigger trigger="click" ref='targetDeleteOverlay' rootClose placement="left" overlay={popoverLeft}>
              <Button  ref='targetDelete' bsStyle='primary' className={btnPrimary} style={{borderRadius: 0, display:this.state.deleteButton}}>Delete</Button>
            </OverlayTrigger>
          </Modal.Footer>
          </form>
        </Modal>
      :''}
      {this.state.showSuppressModal?
        <div> 
          <SuppressRule
                suppressRule={this.state.suppressRule}
                deviceName={this.props.deviceName}
                policyName={this.props.pName}
                pp={this.props.pp}
                suppressRule={this.state.suppressRule}
                refresh={this.props.refresh}
                worklogId={this.props.worklogId}
                policyResultId={this.props.policyResultId}
                reportType={this.props.reportType}
                closeSuppressModal={this.closeSuppressModal}
                /*showSuppressModal={false}*/
                showSuppressModal={this.state.showSuppressModal}/>
        </div>
      :''
      }
      
      </div>
    )
  }
})
